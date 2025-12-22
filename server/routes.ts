import { Router, Request, Response } from 'express';
import { storage } from './storage';
import { db } from './db';
import { emailTemplates, trackerSessions } from '../shared/schema';
import { sendTrackingEmail, sendAdminNotificationEmail } from './email';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/api/signup', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    let user = await storage.getUserByEmail(email);
    if (!user) {
      user = await storage.createUser(name, email);
    }

    const session = await storage.createTrackerSession(user.id, name);

    const stages = await storage.getStageDefinitions();
    const now = new Date();
    
    for (const stage of stages) {
      let availableAt = new Date(now);
      if (stage.dayPart === 'morning') {
        availableAt.setHours(availableAt.getHours() + 6);
      }
      
      await storage.createStageEntry({
        trackerSessionId: session.id,
        stageDefinitionId: stage.id,
        availabilityTimestamp: availableAt,
      });
    }

    console.log(`[Signup] User ${name} signed up with token ${session.trackerToken}`);

    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'https://kiki-tracker.replit.app';
    const fullTrackerUrl = `${baseUrl}/tracker/${session.trackerToken}`;
    
    // Schedule morning email for 6 hours from now
    const morningEmailTime = new Date();
    morningEmailTime.setHours(morningEmailTime.getHours() + 6);
    await db
      .update(trackerSessions)
      .set({ morningEmailScheduledFor: morningEmailTime })
      .where(eq(trackerSessions.id, session.id));
    
    // Send tracking email immediately
    sendTrackingEmail(email, name, fullTrackerUrl).catch(err => {
      console.error('[Signup] Background email send failed:', err);
    });
    
    // Send admin notification
    sendAdminNotificationEmail(email, name, req.headers.referer || null).catch(err => {
      console.error('[Signup] Admin notification failed:', err);
    });

    res.json({
      success: true,
      trackerToken: session.trackerToken,
      trackerUrl: `/tracker/${session.trackerToken}`,
    });
  } catch (error: any) {
    console.error('[API] Signup error:', error);
    if (error.code === '23505') {
      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        const newSession = await storage.createTrackerSession(existingUser.id, req.body.name);
        
        const stages = await storage.getStageDefinitions();
        const now = new Date();
        for (const stage of stages) {
          let availableAt = new Date(now);
          if (stage.dayPart === 'morning') {
            availableAt.setHours(availableAt.getHours() + 6);
          }
          await storage.createStageEntry({
            trackerSessionId: newSession.id,
            stageDefinitionId: stage.id,
            availabilityTimestamp: availableAt,
          });
        }
        
        const baseUrl = process.env.REPLIT_DEV_DOMAIN 
          ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
          : 'https://kiki-tracker.replit.app';
        const fullTrackerUrl = `${baseUrl}/tracker/${newSession.trackerToken}`;
        
        // Schedule morning email for 6 hours from now
        const morningEmailTime = new Date();
        morningEmailTime.setHours(morningEmailTime.getHours() + 6);
        await db
          .update(trackerSessions)
          .set({ morningEmailScheduledFor: morningEmailTime })
          .where(eq(trackerSessions.id, newSession.id));
        
        sendTrackingEmail(req.body.email, req.body.name, fullTrackerUrl).catch(err => {
          console.error('[Signup] Background email send failed:', err);
        });
        
        // Send admin notification with the new child name
        sendAdminNotificationEmail(req.body.email, req.body.name, req.headers.referer || null).catch(err => {
          console.error('[Signup] Admin notification failed:', err);
        });

        return res.json({
          success: true,
          trackerToken: newSession.trackerToken,
          trackerUrl: `/tracker/${newSession.trackerToken}`,
        });
      }
    }
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.get('/api/blog', async (req: Request, res: Response) => {
  try {
    const posts = await storage.getPublishedBlogPosts();
    res.json(posts);
  } catch (error) {
    console.error('[API] Blog fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

router.get('/api/blog/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await storage.getBlogPostBySlug(slug);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('[API] Blog post fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

router.get('/api/tracker/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const sessionData = await storage.getTrackerSessionWithUser(token);
    if (!sessionData) {
      return res.status(404).json({ error: 'Tracker not found' });
    }

    const { session, user } = sessionData;
    const entries = await storage.getStageEntriesForSession(session.id);
    const now = new Date();

    const stages = await Promise.all(
      entries.map(async ({ entry, stageDefinition }) => {
        const content = await storage.getStageContent(stageDefinition.id);
        const isUnlocked = now >= entry.availabilityTimestamp;

        return {
          id: stageDefinition.id,
          slug: stageDefinition.slug,
          label: stageDefinition.label,
          dayPart: stageDefinition.dayPart,
          orderIndex: stageDefinition.orderIndex,
          isUnlocked,
          isCompleted: !!entry.completedAt,
          availableAt: entry.availabilityTimestamp,
          content: isUnlocked
            ? {
                videoUrl: content?.videoUrl || null,
                imageUrl: content?.imageUrl || null,
                messageText: content?.messageText || null,
              }
            : null,
        };
      })
    );

    res.json({
      userName: session.childName || user.name,
      generatedAt: session.generatedAt,
      stages: stages.sort((a, b) => a.orderIndex - b.orderIndex),
    });
  } catch (error) {
    console.error('[API] Tracker fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch tracker data' });
  }
});

router.get('/api/email-templates', async (req: Request, res: Response) => {
  try {
    const templates = await db.select().from(emailTemplates);
    res.json(templates);
  } catch (error) {
    console.error('[API] Email templates fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch email templates' });
  }
});

export default router;
