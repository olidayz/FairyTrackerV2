import { Router, Request, Response, NextFunction } from 'express';
import { db } from './db';
import { blogPosts, stageDefinitions, stageContent, siteAssets, emailTemplates, landingHero, fairyUpdates, kikiProfile, reviews, faqs, copySections, landingImages } from '../shared/schema';
import { eq, asc } from 'drizzle-orm';

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
    const { slug, title, excerpt, content, featuredImageUrl, status, metaTitle, metaDescription } = req.body;
    const [post] = await db.insert(blogPosts).values({
      slug,
      title,
      excerpt,
      content,
      featuredImageUrl,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null,
      metaTitle,
      metaDescription,
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
    const { slug, title, excerpt, content, featuredImageUrl, status, metaTitle, metaDescription } = req.body;
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
        metaTitle,
        metaDescription,
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
    const { videoUrl, imageUrl, messageText, frontImageUrl, locationText, statusText } = req.body;
    
    const existing = await db.select().from(stageContent).where(eq(stageContent.stageDefinitionId, parseInt(stageId)));
    
    if (existing.length > 0) {
      const [updated] = await db.update(stageContent)
        .set({ videoUrl, imageUrl, messageText, frontImageUrl, locationText, statusText, updatedAt: new Date() })
        .where(eq(stageContent.stageDefinitionId, parseInt(stageId)))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(stageContent)
        .values({ stageDefinitionId: parseInt(stageId), videoUrl, imageUrl, messageText, frontImageUrl, locationText, statusText })
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

router.get('/api/admin/email-templates', async (req: Request, res: Response) => {
  try {
    const templates = await db.select().from(emailTemplates);
    res.json(templates);
  } catch (error) {
    console.error('[Admin] Failed to fetch email templates:', error);
    res.status(500).json({ error: 'Failed to fetch email templates' });
  }
});

router.post('/api/admin/email-templates', async (req: Request, res: Response) => {
  try {
    const { slug, name, subject, preheader, headline, bodyText, ctaText, ctaUrl, footerText } = req.body;
    const [template] = await db.insert(emailTemplates).values({
      slug,
      name,
      subject,
      preheader,
      headline,
      bodyText,
      ctaText,
      ctaUrl,
      footerText,
    }).returning();
    res.json(template);
  } catch (error) {
    console.error('[Admin] Failed to create email template:', error);
    res.status(500).json({ error: 'Failed to create email template' });
  }
});

router.put('/api/admin/email-templates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { slug, name, subject, preheader, headline, bodyText, ctaText, ctaUrl, footerText } = req.body;
    const [template] = await db.update(emailTemplates)
      .set({
        slug,
        name,
        subject,
        preheader,
        headline,
        bodyText,
        ctaText,
        ctaUrl,
        footerText,
        updatedAt: new Date(),
      })
      .where(eq(emailTemplates.id, parseInt(id)))
      .returning();
    res.json(template);
  } catch (error) {
    console.error('[Admin] Failed to update email template:', error);
    res.status(500).json({ error: 'Failed to update email template' });
  }
});

router.delete('/api/admin/email-templates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(emailTemplates).where(eq(emailTemplates.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Failed to delete email template:', error);
    res.status(500).json({ error: 'Failed to delete email template' });
  }
});

// === LANDING PAGE CMS ROUTES ===

// Landing Hero
router.get('/api/admin/landing-hero', async (req: Request, res: Response) => {
  try {
    const [hero] = await db.select().from(landingHero).limit(1);
    res.json(hero || null);
  } catch (error) {
    console.error('[Admin] Failed to fetch landing hero:', error);
    res.status(500).json({ error: 'Failed to fetch landing hero' });
  }
});

router.put('/api/admin/landing-hero', async (req: Request, res: Response) => {
  try {
    const { headline, subheadline, badgeText, ctaText, backgroundImageUrl } = req.body;
    const [existing] = await db.select().from(landingHero).limit(1);
    
    if (existing) {
      const [updated] = await db.update(landingHero)
        .set({ headline, subheadline, badgeText, ctaText, backgroundImageUrl, updatedAt: new Date() })
        .where(eq(landingHero.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(landingHero)
        .values({ headline, subheadline, badgeText, ctaText, backgroundImageUrl })
        .returning();
      res.json(created);
    }
  } catch (error) {
    console.error('[Admin] Failed to update landing hero:', error);
    res.status(500).json({ error: 'Failed to update landing hero' });
  }
});

// Fairy Updates
router.get('/api/admin/fairy-updates', async (req: Request, res: Response) => {
  try {
    const updates = await db.select().from(fairyUpdates).orderBy(asc(fairyUpdates.sortOrder));
    res.json(updates);
  } catch (error) {
    console.error('[Admin] Failed to fetch fairy updates:', error);
    res.status(500).json({ error: 'Failed to fetch fairy updates' });
  }
});

router.post('/api/admin/fairy-updates', async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, iconType, sortOrder, isActive } = req.body;
    const [update] = await db.insert(fairyUpdates).values({
      title, description, imageUrl, iconType, sortOrder: sortOrder || 0, isActive: isActive ?? true
    }).returning();
    res.json(update);
  } catch (error) {
    console.error('[Admin] Failed to create fairy update:', error);
    res.status(500).json({ error: 'Failed to create fairy update' });
  }
});

router.put('/api/admin/fairy-updates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, iconType, sortOrder, isActive } = req.body;
    const [updated] = await db.update(fairyUpdates)
      .set({ title, description, imageUrl, iconType, sortOrder, isActive, updatedAt: new Date() })
      .where(eq(fairyUpdates.id, parseInt(id)))
      .returning();
    res.json(updated);
  } catch (error) {
    console.error('[Admin] Failed to update fairy update:', error);
    res.status(500).json({ error: 'Failed to update fairy update' });
  }
});

router.delete('/api/admin/fairy-updates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(fairyUpdates).where(eq(fairyUpdates.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Failed to delete fairy update:', error);
    res.status(500).json({ error: 'Failed to delete fairy update' });
  }
});

// Kiki Profile
router.get('/api/admin/kiki-profile', async (req: Request, res: Response) => {
  try {
    const [profile] = await db.select().from(kikiProfile).limit(1);
    res.json(profile || null);
  } catch (error) {
    console.error('[Admin] Failed to fetch Kiki profile:', error);
    res.status(500).json({ error: 'Failed to fetch Kiki profile' });
  }
});

router.put('/api/admin/kiki-profile', async (req: Request, res: Response) => {
  try {
    const { name, title, bio, photoUrl, stats } = req.body;
    const [existing] = await db.select().from(kikiProfile).limit(1);
    
    if (existing) {
      const [updated] = await db.update(kikiProfile)
        .set({ name, title, bio, photoUrl, stats, updatedAt: new Date() })
        .where(eq(kikiProfile.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(kikiProfile)
        .values({ name, title, bio, photoUrl, stats })
        .returning();
      res.json(created);
    }
  } catch (error) {
    console.error('[Admin] Failed to update Kiki profile:', error);
    res.status(500).json({ error: 'Failed to update Kiki profile' });
  }
});

// Reviews
router.get('/api/admin/reviews', async (req: Request, res: Response) => {
  try {
    const allReviews = await db.select().from(reviews).orderBy(asc(reviews.sortOrder));
    res.json(allReviews);
  } catch (error) {
    console.error('[Admin] Failed to fetch reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/api/admin/reviews', async (req: Request, res: Response) => {
  try {
    const { reviewerName, reviewerLocation, reviewText, rating, photoUrl, isVerified, isFeatured, sortOrder } = req.body;
    const [review] = await db.insert(reviews).values({
      reviewerName, reviewerLocation, reviewText, rating: rating || 5, photoUrl,
      isVerified: isVerified ?? false, isFeatured: isFeatured ?? false, sortOrder: sortOrder || 0
    }).returning();
    res.json(review);
  } catch (error) {
    console.error('[Admin] Failed to create review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

router.put('/api/admin/reviews/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reviewerName, reviewerLocation, reviewText, rating, photoUrl, isVerified, isFeatured, sortOrder } = req.body;
    const [updated] = await db.update(reviews)
      .set({ reviewerName, reviewerLocation, reviewText, rating, photoUrl, isVerified, isFeatured, sortOrder, updatedAt: new Date() })
      .where(eq(reviews.id, parseInt(id)))
      .returning();
    res.json(updated);
  } catch (error) {
    console.error('[Admin] Failed to update review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

router.delete('/api/admin/reviews/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(reviews).where(eq(reviews.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Failed to delete review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// FAQs
router.get('/api/admin/faqs', async (req: Request, res: Response) => {
  try {
    const allFaqs = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
    res.json(allFaqs);
  } catch (error) {
    console.error('[Admin] Failed to fetch FAQs:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

router.post('/api/admin/faqs', async (req: Request, res: Response) => {
  try {
    const { question, answer, category, sortOrder, isActive } = req.body;
    const [faq] = await db.insert(faqs).values({
      question, answer, category, sortOrder: sortOrder || 0, isActive: isActive ?? true
    }).returning();
    res.json(faq);
  } catch (error) {
    console.error('[Admin] Failed to create FAQ:', error);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

router.put('/api/admin/faqs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer, category, sortOrder, isActive } = req.body;
    const [updated] = await db.update(faqs)
      .set({ question, answer, category, sortOrder, isActive, updatedAt: new Date() })
      .where(eq(faqs.id, parseInt(id)))
      .returning();
    res.json(updated);
  } catch (error) {
    console.error('[Admin] Failed to update FAQ:', error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/api/admin/faqs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(faqs).where(eq(faqs.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Failed to delete FAQ:', error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// Copy Sections
router.get('/api/admin/copy-sections', async (req: Request, res: Response) => {
  try {
    const sections = await db.select().from(copySections);
    res.json(sections);
  } catch (error) {
    console.error('[Admin] Failed to fetch copy sections:', error);
    res.status(500).json({ error: 'Failed to fetch copy sections' });
  }
});

router.post('/api/admin/copy-sections', async (req: Request, res: Response) => {
  try {
    const { key, label, content, page } = req.body;
    const [section] = await db.insert(copySections).values({ key, label, content, page }).returning();
    res.json(section);
  } catch (error) {
    console.error('[Admin] Failed to create copy section:', error);
    res.status(500).json({ error: 'Failed to create copy section' });
  }
});

router.put('/api/admin/copy-sections/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { key, label, content, page } = req.body;
    const [updated] = await db.update(copySections)
      .set({ key, label, content, page, updatedAt: new Date() })
      .where(eq(copySections.id, parseInt(id)))
      .returning();
    res.json(updated);
  } catch (error) {
    console.error('[Admin] Failed to update copy section:', error);
    res.status(500).json({ error: 'Failed to update copy section' });
  }
});

router.delete('/api/admin/copy-sections/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(copySections).where(eq(copySections.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Failed to delete copy section:', error);
    res.status(500).json({ error: 'Failed to delete copy section' });
  }
});

router.get('/api/admin/landing-images', async (req: Request, res: Response) => {
  try {
    const images = await db.select().from(landingImages);
    res.json(images);
  } catch (error) {
    console.error('[Admin] Failed to fetch landing images:', error);
    res.status(500).json({ error: 'Failed to fetch landing images' });
  }
});

router.put('/api/admin/landing-images/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { imageUrl, title } = req.body;
    const updateData: { imageUrl?: string; title?: string; updatedAt: Date } = { updatedAt: new Date() };
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (title !== undefined) updateData.title = title;
    const [updated] = await db.update(landingImages)
      .set(updateData)
      .where(eq(landingImages.id, parseInt(id)))
      .returning();
    res.json(updated);
  } catch (error) {
    console.error('[Admin] Failed to update landing image:', error);
    res.status(500).json({ error: 'Failed to update landing image' });
  }
});

export default router;
