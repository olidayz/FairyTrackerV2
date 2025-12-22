import { Router, Request, Response, NextFunction } from 'express';
import { db } from './db';
import { blogPosts, stageDefinitions, stageContent, siteAssets } from '../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Admin password not configured. Set ADMIN_PASSWORD in secrets.' });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

router.use('/api/admin/*splat', adminAuth);

router.get('/api/admin/blog-posts', async (req: Request, res: Response) => {
  try {
    const posts = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
    res.json(posts);
  } catch (error) {
    console.error('[Admin] Failed to fetch blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

router.post('/api/admin/blog-posts', async (req: Request, res: Response) => {
  try {
    const { slug, title, excerpt, content, featuredImageUrl, status } = req.body;
    const [post] = await db.insert(blogPosts).values({
      slug,
      title,
      excerpt,
      content,
      featuredImageUrl,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null,
    }).returning();
    res.json(post);
  } catch (error) {
    console.error('[Admin] Failed to create blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

router.put('/api/admin/blog-posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { slug, title, excerpt, content, featuredImageUrl, status } = req.body;
    const [post] = await db.update(blogPosts)
      .set({
        slug,
        title,
        excerpt,
        content,
        featuredImageUrl,
        status,
        publishedAt: status === 'published' ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();
    res.json(post);
  } catch (error) {
    console.error('[Admin] Failed to update blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

router.delete('/api/admin/blog-posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(blogPosts).where(eq(blogPosts.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Failed to delete blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

router.get('/api/admin/stages', async (req: Request, res: Response) => {
  try {
    const stages = await db.select().from(stageDefinitions).orderBy(stageDefinitions.orderIndex);
    res.json(stages);
  } catch (error) {
    console.error('[Admin] Failed to fetch stages:', error);
    res.status(500).json({ error: 'Failed to fetch stages' });
  }
});

router.get('/api/admin/stage-content', async (req: Request, res: Response) => {
  try {
    const content = await db.select().from(stageContent);
    res.json(content);
  } catch (error) {
    console.error('[Admin] Failed to fetch stage content:', error);
    res.status(500).json({ error: 'Failed to fetch stage content' });
  }
});

router.put('/api/admin/stage-content/:stageId', async (req: Request, res: Response) => {
  try {
    const { stageId } = req.params;
    const { videoUrl, imageUrl, messageText } = req.body;
    
    const existing = await db.select().from(stageContent).where(eq(stageContent.stageDefinitionId, parseInt(stageId)));
    
    if (existing.length > 0) {
      const [updated] = await db.update(stageContent)
        .set({ videoUrl, imageUrl, messageText, updatedAt: new Date() })
        .where(eq(stageContent.stageDefinitionId, parseInt(stageId)))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(stageContent)
        .values({ stageDefinitionId: parseInt(stageId), videoUrl, imageUrl, messageText })
        .returning();
      res.json(created);
    }
  } catch (error) {
    console.error('[Admin] Failed to save stage content:', error);
    res.status(500).json({ error: 'Failed to save stage content' });
  }
});

router.get('/api/admin/site-assets', async (req: Request, res: Response) => {
  try {
    const assets = await db.select().from(siteAssets).orderBy(siteAssets.sortOrder);
    res.json(assets);
  } catch (error) {
    console.error('[Admin] Failed to fetch site assets:', error);
    res.status(500).json({ error: 'Failed to fetch site assets' });
  }
});

export default router;
