import { Router, Request, Response } from 'express';
import { storage } from './storage';

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

    const session = await storage.createTrackerSession(user.id);

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
        const session = await storage.createTrackerSession(existingUser.id);
        return res.json({
          success: true,
          trackerToken: session.token,
          trackerUrl: `/tracker/${session.token}`,
        });
      }
    }
    res.status(500).json({ error: 'Signup failed' });
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
      userName: user.name,
      generatedAt: session.generatedAt,
      stages: stages.sort((a, b) => a.orderIndex - b.orderIndex),
    });
  } catch (error) {
    console.error('[API] Tracker fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch tracker data' });
  }
});

export default router;
