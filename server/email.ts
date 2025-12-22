import { Resend } from "resend";
import { storage } from "./storage";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: SendEmailParams): Promise<string | null> {
  if (!resend) {
    console.log("[Email] Resend not configured, skipping email send:", params.subject);
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error("[Email] Send error:", error);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error("[Email] Exception:", err);
    return null;
  }
}

export function generateWelcomeEmail(name: string, trackerUrl: string): { subject: string; html: string } {
  return {
    subject: `Welcome ${name}! Your journey begins now`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px 0; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome, ${name}!</h1>
            </div>
            <p>Your personalized journey has begun. We're so excited to have you with us!</p>
            <p>Your first 3 stages are now available. Click below to access your tracker:</p>
            <p style="text-align: center;">
              <a href="${trackerUrl}" class="button">Access Your Tracker</a>
            </p>
            <p>Save this link - you'll need it to access your progress anytime.</p>
            <div class="footer">
              <p>You're receiving this because you signed up for our tracker experience.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function generateUnlockEmail(name: string, trackerUrl: string): { subject: string; html: string } {
  return {
    subject: `${name}, new stages are now unlocked!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px 0; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Good news, ${name}!</h1>
            </div>
            <p>Your morning stages are now unlocked! New content is waiting for you.</p>
            <p style="text-align: center;">
              <a href="${trackerUrl}" class="button">Continue Your Journey</a>
            </p>
            <p>Click above to access your tracker and explore the new stages.</p>
            <div class="footer">
              <p>You're receiving this because you signed up for our tracker experience.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export async function scheduleEmails(trackerSessionId: number, userName: string, userEmail: string, trackerToken: string, baseUrl: string) {
  const trackerUrl = `${baseUrl}/tracker/${trackerToken}`;
  const now = new Date();
  const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);

  await storage.createEmailLog({
    trackerSessionId,
    emailType: "welcome",
    scheduledFor: now,
    status: "pending",
  });

  await storage.createEmailLog({
    trackerSessionId,
    emailType: "unlock",
    scheduledFor: sixHoursLater,
    status: "pending",
  });
}

export async function processScheduledEmails(baseUrl: string) {
  const pendingEmails = await storage.getPendingEmails();
  
  for (const emailLog of pendingEmails) {
    try {
      const sessionData = await storage.getTrackerSessionWithUser(
        (await storage.getTrackerSessionByToken(emailLog.trackerSessionId.toString()))?.trackerToken || ""
      );
      
      if (!sessionData) {
        await storage.updateEmailLog(emailLog.id, { status: "failed", errorMessage: "Session not found" });
        continue;
      }

      const { user, session } = sessionData;
      const trackerUrl = `${baseUrl}/tracker/${session.trackerToken}`;
      
      let emailContent: { subject: string; html: string };
      if (emailLog.emailType === "welcome") {
        emailContent = generateWelcomeEmail(user.name, trackerUrl);
      } else {
        emailContent = generateUnlockEmail(user.name, trackerUrl);
      }

      const messageId = await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      if (messageId) {
        await storage.updateEmailLog(emailLog.id, {
          status: "sent",
          sentAt: new Date(),
          providerMessageId: messageId,
        });
      } else {
        await storage.updateEmailLog(emailLog.id, {
          status: "failed",
          errorMessage: "Failed to send email",
        });
      }
    } catch (error) {
      console.error(`[Email] Failed to process email ${emailLog.id}:`, error);
      await storage.updateEmailLog(emailLog.id, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
