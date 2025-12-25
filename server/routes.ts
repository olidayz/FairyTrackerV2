import { Router, Request, Response } from 'express';
import { storage } from './storage';
import { db } from './db';
import { emailTemplates, trackerSessions, landingHero, fairyUpdates, kikiProfile, reviews, faqs, copySections, stageContent, stageDefinitions, landingImages, pressLogos } from '../shared/schema';
import { sendTrackingEmail, sendAdminNotificationEmail, sendContactFormEmail } from './email';
import { eq, asc } from 'drizzle-orm';
import { trackEvent, trackEmailEvent } from './analytics';

const router = Router();

router.post('/api/webhooks/resend', async (req: Request, res: Response) => {
  try {
    const event = req.body;
    console.log('[Webhook] Received Resend event:', event.type);

    const eventTypeMap: Record<string, string> = {
      'email.sent': 'sent',
      'email.delivered': 'delivered',
      'email.opened': 'opened',
      'email.clicked': 'clicked',
      'email.bounced': 'bounced',
      'email.complained': 'complained',
    };

    const mappedType = eventTypeMap[event.type];
    if (mappedType && event.data) {
      const emailTo = Array.isArray(event.data.to) ? event.data.to[0] : event.data.to;
      
      await trackEmailEvent({
        resendEventId: event.data.email_id,
        email: emailTo || 'unknown',
        eventType: mappedType as any,
        payload: event.data,
      });
      
      console.log(`[Webhook] Tracked ${mappedType} event for ${emailTo}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Webhook] Error processing Resend event:', error);
    res.status(200).json({ success: true });
  }
});

router.post('/api/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, utmSource, utmMedium, utmCampaign } = req.body;

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

    const referrer = req.headers.referer as string || undefined;
    const session = await storage.createTrackerSession(user.id, name, {
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
    });

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

    trackEvent({
      eventType: 'signup',
      trackerSessionId: session.id,
      userId: user.id,
      source: 'web',
      referrer,
      userAgent: req.headers['user-agent'] as string || undefined,
      metadata: {
        utmSource,
        utmMedium,
        utmCampaign,
      },
    });

    const baseUrl = process.env.SITE_URL || `https://${process.env.REPLIT_DEV_DOMAIN}` || 'https://kikithetoothfairy.co';
    const fullTrackerUrl = `${baseUrl}/tracker/${session.trackerToken}`;
    
    // Schedule morning email for 6 hours from now
    const morningEmailTime = new Date();
    morningEmailTime.setHours(morningEmailTime.getHours() + 6);
    await db
      .update(trackerSessions)
      .set({ morningEmailScheduledFor: morningEmailTime })
      .where(eq(trackerSessions.id, session.id));
    
    // Send emails sequentially to avoid Resend rate limits (2 req/sec)
    (async () => {
      try {
        await sendTrackingEmail(email, name, fullTrackerUrl);
        console.log('[Signup] Tracking email sent successfully');
      } catch (err) {
        console.error('[Signup] Tracking email failed:', err);
      }
      
      // Wait 600ms before sending next email to stay under rate limit
      await new Promise(resolve => setTimeout(resolve, 600));
      
      try {
        await sendAdminNotificationEmail(email, name, req.headers.referer || null, { utmSource, utmMedium, utmCampaign });
        console.log('[Signup] Admin notification sent successfully');
      } catch (err) {
        console.error('[Signup] Admin notification failed:', err);
      }
    })();

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
        
        const baseUrl = process.env.SITE_URL || `https://${process.env.REPLIT_DEV_DOMAIN}` || 'https://kikithetoothfairy.co';
        const fullTrackerUrl = `${baseUrl}/tracker/${newSession.trackerToken}`;
        
        // Schedule morning email for 6 hours from now
        const morningEmailTime = new Date();
        morningEmailTime.setHours(morningEmailTime.getHours() + 6);
        await db
          .update(trackerSessions)
          .set({ morningEmailScheduledFor: morningEmailTime })
          .where(eq(trackerSessions.id, newSession.id));
        
        // Send emails sequentially to avoid Resend rate limits
        (async () => {
          try {
            await sendTrackingEmail(req.body.email, req.body.name, fullTrackerUrl);
            console.log('[Signup] Tracking email sent successfully');
          } catch (err) {
            console.error('[Signup] Tracking email failed:', err);
          }
          
          await new Promise(resolve => setTimeout(resolve, 600));
          
          try {
            const { utmSource, utmMedium, utmCampaign } = req.body;
            await sendAdminNotificationEmail(req.body.email, req.body.name, req.headers.referer || null, { utmSource, utmMedium, utmCampaign });
            console.log('[Signup] Admin notification sent successfully');
          } catch (err) {
            console.error('[Signup] Admin notification failed:', err);
          }
        })();

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

    trackEvent({
      eventType: 'tracker_view',
      trackerSessionId: session.id,
      userId: user.id,
      source: 'web',
      referrer: req.headers.referer as string || undefined,
      userAgent: req.headers['user-agent'] as string || undefined,
    });

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
                frontImageUrl: content?.frontImageUrl || null,
                locationText: content?.locationText || null,
                statusText: content?.statusText || null,
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

// === PUBLIC LANDING PAGE CMS ENDPOINTS ===

router.get('/api/landing-content', async (req: Request, res: Response) => {
  try {
    const [hero] = await db.select().from(landingHero).limit(1);
    const updates = await db.select().from(fairyUpdates).where(eq(fairyUpdates.isActive, true)).orderBy(asc(fairyUpdates.sortOrder));
    const [profile] = await db.select().from(kikiProfile).limit(1);
    const featuredReviews = await db.select().from(reviews).orderBy(asc(reviews.sortOrder));
    const activeFaqs = await db.select().from(faqs).where(eq(faqs.isActive, true)).orderBy(asc(faqs.sortOrder));
    const allCopySections = await db.select().from(copySections);
    const allLandingImages = await db.select().from(landingImages);
    const activeLogos = await db.select().from(pressLogos).where(eq(pressLogos.isActive, true)).orderBy(asc(pressLogos.sortOrder));
    
    res.json({
      hero: hero || null,
      fairyUpdates: updates,
      kikiProfile: profile || null,
      reviews: featuredReviews,
      faqs: activeFaqs,
      pressLogos: activeLogos,
      copySections: allCopySections.reduce((acc, section) => {
        acc[section.key] = section.content;
        return acc;
      }, {} as Record<string, string | null>),
      images: allLandingImages.reduce((acc, img) => {
        acc[img.key] = img.imageUrl;
        return acc;
      }, {} as Record<string, string | null>),
      stageTitles: allLandingImages.reduce((acc, img) => {
        if (img.key.startsWith('stage_') && img.title) {
          acc[img.key] = img.title;
        }
        return acc;
      }, {} as Record<string, string>),
      mediaTypes: allLandingImages.reduce((acc, img) => {
        acc[img.key] = img.mediaType || 'image';
        return acc;
      }, {} as Record<string, string>),
    });
  } catch (error) {
    console.error('[API] Landing content fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch landing content' });
  }
});

router.get('/api/copy', async (req: Request, res: Response) => {
  try {
    const allCopy = await db.select().from(copySections);
    const copyMap = allCopy.reduce((acc, section) => {
      acc[section.key] = section.content || '';
      return acc;
    }, {} as Record<string, string>);
    res.json(copyMap);
  } catch (error) {
    console.error('[API] Copy fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch copy' });
  }
});

router.get('/api/faqs', async (req: Request, res: Response) => {
  try {
    const activeFaqs = await db.select().from(faqs).where(eq(faqs.isActive, true)).orderBy(asc(faqs.sortOrder));
    res.json(activeFaqs);
  } catch (error) {
    console.error('[API] FAQs fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

router.get('/api/reviews', async (req: Request, res: Response) => {
  try {
    const allReviews = await db.select().from(reviews).orderBy(asc(reviews.sortOrder));
    res.json(allReviews);
  } catch (error) {
    console.error('[API] Reviews fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.get('/api/stage-content', async (req: Request, res: Response) => {
  try {
    const definitions = await db.select().from(stageDefinitions).orderBy(asc(stageDefinitions.orderIndex));
    const content = await db.select().from(stageContent);
    
    const contentMap = content.reduce((acc, c) => {
      acc[c.stageDefinitionId] = c;
      return acc;
    }, {} as Record<number, typeof content[0]>);
    
    const result = definitions.map(def => ({
      id: def.id,
      slug: def.slug,
      label: def.label,
      dayPart: def.dayPart,
      orderIndex: def.orderIndex,
      content: contentMap[def.id] || null,
    }));
    
    res.json(result);
  } catch (error) {
    console.error('[API] Stage content fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stage content' });
  }
});

router.get('/api/landing-images', async (req: Request, res: Response) => {
  try {
    const images = await db.select().from(landingImages);
    const imageMap = images.reduce((acc, img) => {
      acc[img.key] = img.imageUrl;
      return acc;
    }, {} as Record<string, string | null>);
    res.json(imageMap);
  } catch (error) {
    console.error('[API] Landing images fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch landing images' });
  }
});

router.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = process.env.SITE_URL || 'https://kikithetoothfairy.co';
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /emails
Disallow: /tracker/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://kikithetoothfairy.co';
    const now = new Date().toISOString().split('T')[0];
    
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/tracker', priority: '0.9', changefreq: 'weekly' },
      { url: '/blogs/kikis-blog', priority: '0.8', changefreq: 'weekly' },
      { url: '/pages/faq', priority: '0.7', changefreq: 'monthly' },
      { url: '/pages/contact', priority: '0.6', changefreq: 'monthly' },
      { url: '/media-kit', priority: '0.5', changefreq: 'monthly' },
      { url: '/policies/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { url: '/policies/terms-of-service', priority: '0.3', changefreq: 'yearly' },
      { url: '/policies/shipping-policy', priority: '0.3', changefreq: 'yearly' },
      { url: '/policies/refund-policy', priority: '0.3', changefreq: 'yearly' },
    ];

    const blogPosts = await storage.getPublishedBlogPosts();
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
    
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }
    
    for (const post of blogPosts) {
      const lastmod = post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : now;
      xml += `  <url>
    <loc>${baseUrl}/blogs/kikis-blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }
    
    xml += `</urlset>`;
    
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

router.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    await sendContactFormEmail(name, email, message);

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('[Contact] Failed to send contact form:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

router.post('/api/analytics/page-view', async (req: Request, res: Response) => {
  try {
    const { path, visitorId, referrer } = req.body;
    
    if (!path) {
      return res.status(400).json({ error: 'Path is required' });
    }

    const userAgent = req.headers['user-agent'] as string || undefined;

    trackEvent({
      eventType: 'page_view',
      referrer: referrer || req.headers.referer as string || undefined,
      userAgent,
      metadata: {
        path,
        visitorId,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
    res.status(500).json({ error: 'Failed to track page view' });
  }
});

export default router;
