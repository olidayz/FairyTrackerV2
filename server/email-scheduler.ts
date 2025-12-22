import { db } from './db';
import { trackerSessions, users } from '../shared/schema';
import { eq, isNull, lte, and } from 'drizzle-orm';
import { sendMorningUnlockEmail } from './email';

const CHECK_INTERVAL_MS = 60 * 1000; // Check every minute

export function startEmailScheduler() {
  console.log('[EmailScheduler] Starting background email scheduler');
  
  setInterval(async () => {
    await checkAndSendPendingEmails();
  }, CHECK_INTERVAL_MS);
  
  // Also run immediately on startup
  setTimeout(() => checkAndSendPendingEmails(), 5000);
}

async function checkAndSendPendingEmails() {
  try {
    const now = new Date();
    
    // Find sessions where morning email is scheduled, not sent, and time has passed
    const pendingSessions = await db
      .select({
        session: trackerSessions,
        user: users,
      })
      .from(trackerSessions)
      .innerJoin(users, eq(trackerSessions.userId, users.id))
      .where(
        and(
          isNull(trackerSessions.morningEmailSentAt),
          lte(trackerSessions.morningEmailScheduledFor, now)
        )
      )
      .limit(10);

    for (const { session, user } of pendingSessions) {
      if (!session.morningEmailScheduledFor) continue;
      
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : 'https://kiki-tracker.replit.app';
      const trackerUrl = `${baseUrl}/tracker/${session.trackerToken}`;

      console.log(`[EmailScheduler] Sending morning email to ${user.email} for session ${session.id}`);
      
      try {
        await sendMorningUnlockEmail(user.email, user.name, trackerUrl);
        
        // Mark as sent
        await db
          .update(trackerSessions)
          .set({ morningEmailSentAt: new Date() })
          .where(eq(trackerSessions.id, session.id));
          
        console.log(`[EmailScheduler] Morning email sent successfully for session ${session.id}`);
      } catch (err) {
        console.error(`[EmailScheduler] Failed to send morning email for session ${session.id}:`, err);
      }
    }
  } catch (error) {
    console.error('[EmailScheduler] Error checking pending emails:', error);
  }
}
