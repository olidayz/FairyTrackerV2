import { Router, type Request, type Response } from "express";
import { storage } from "./storage";
import { scheduleEmails, generateWelcomeEmail, sendEmail } from "./email";
import { importBlogPostsFromShopify, isShopifyConfigured } from "./shopify";

const router = Router();

router.post("/api/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, utmSource, utmMedium, utmCampaign, referrer } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    let user = await storage.getUserByEmail(email);
    if (!user) {
      user = await storage.createUser({ name, email });
    }

    const session = await storage.createTrackerSession(user.id, {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      referrer,
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const trackerUrl = `${baseUrl}/tracker/${session.trackerToken}`;

    await scheduleEmails(session.id, user.name, user.email, session.trackerToken, baseUrl);

    const welcomeEmail = generateWelcomeEmail(user.name, trackerUrl);
    await sendEmail({
      to: user.email,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
    });

    res.json({
      success: true,
      trackerToken: session.trackerToken,
      trackerUrl,
    });
  } catch (error) {
    console.error("[API] Signup error:", error);
    res.status(500).json({ error: "Failed to create tracker session" });
  }
});

router.get("/api/tracker/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    const sessionData = await storage.getTrackerSessionWithUser(token);
    if (!sessionData) {
      return res.status(404).json({ error: "Tracker not found" });
    }

    const { session, user } = sessionData;
    const stageEntries = await storage.getStageEntriesForSession(session.id);
    const now = new Date();

    const stages = await Promise.all(stageEntries.map(async (entry) => {
      const content = await storage.getStageContent(entry.stageDefinitionId);
      const isUnlocked = now >= entry.availabilityTimestamp;
      
      return {
        id: entry.stageDefinition.id,
        slug: entry.stageDefinition.slug,
        label: entry.stageDefinition.label,
        dayPart: entry.stageDefinition.dayPart,
        orderIndex: entry.stageDefinition.orderIndex,
        isUnlocked,
        isCompleted: !!entry.completedAt,
        availableAt: entry.availabilityTimestamp,
        content: isUnlocked ? {
          videoUrl: content?.videoUrl || null,
          imageUrl: content?.imageUrl || null,
          messageText: content?.messageText || null,
        } : null,
      };
    }));

    res.json({
      userName: user.name,
      generatedAt: session.generatedAt,
      stages,
    });
  } catch (error) {
    console.error("[API] Get tracker error:", error);
    res.status(500).json({ error: "Failed to get tracker data" });
  }
});

router.post("/api/tracker/:token/stage/:stageId/view", async (req: Request, res: Response) => {
  try {
    const { token, stageId } = req.params;
    
    const session = await storage.getTrackerSessionByToken(token);
    if (!session) {
      return res.status(404).json({ error: "Tracker not found" });
    }

    await storage.createStageEvent({
      trackerSessionId: session.id,
      stageDefinitionId: parseInt(stageId),
      eventType: "view",
    });

    res.json({ success: true });
  } catch (error) {
    console.error("[API] Stage view error:", error);
    res.status(500).json({ error: "Failed to record stage view" });
  }
});

router.post("/api/tracker/:token/stage/:stageId/complete", async (req: Request, res: Response) => {
  try {
    const { token, stageId } = req.params;
    
    const session = await storage.getTrackerSessionByToken(token);
    if (!session) {
      return res.status(404).json({ error: "Tracker not found" });
    }

    const entries = await storage.getStageEntriesForSession(session.id);
    const entry = entries.find(e => e.stageDefinitionId === parseInt(stageId));
    
    if (entry) {
      await storage.markStageComplete(entry.id);
      await storage.createStageEvent({
        trackerSessionId: session.id,
        stageDefinitionId: parseInt(stageId),
        eventType: "complete",
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("[API] Stage complete error:", error);
    res.status(500).json({ error: "Failed to mark stage complete" });
  }
});

router.get("/api/admin/stages", async (req: Request, res: Response) => {
  try {
    const stages = await storage.getStageDefinitions();
    const stagesWithContent = await Promise.all(stages.map(async (stage) => {
      const content = await storage.getStageContent(stage.id);
      return {
        ...stage,
        content: content || null,
      };
    }));
    
    res.json(stagesWithContent);
  } catch (error) {
    console.error("[API] Get stages error:", error);
    res.status(500).json({ error: "Failed to get stages" });
  }
});

router.put("/api/admin/stages/:stageId/content", async (req: Request, res: Response) => {
  try {
    const { stageId } = req.params;
    const { videoUrl, imageUrl, messageText } = req.body;

    const content = await storage.upsertStageContent({
      stageDefinitionId: parseInt(stageId),
      videoUrl,
      imageUrl,
      messageText,
    });

    res.json(content);
  } catch (error) {
    console.error("[API] Update stage content error:", error);
    res.status(500).json({ error: "Failed to update stage content" });
  }
});

router.get("/api/admin/analytics", async (req: Request, res: Response) => {
  try {
    const summary = await storage.getAnalyticsSummary();
    res.json(summary);
  } catch (error) {
    console.error("[API] Analytics error:", error);
    res.status(500).json({ error: "Failed to get analytics" });
  }
});

router.post("/api/analytics/pageview", async (req: Request, res: Response) => {
  try {
    const { sessionId, path, referrer, utmSource, utmMedium, utmCampaign, device } = req.body;

    let visitorSession = await storage.getVisitorSessionById(sessionId);
    
    if (!visitorSession) {
      visitorSession = await storage.createVisitorSession({
        sessionId,
        firstReferrer: referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        device,
      });
    } else {
      await storage.updateVisitorSession(sessionId, { lastSeenAt: new Date() });
    }

    await storage.createPageView({
      visitorSessionId: visitorSession.id,
      path,
      referrer,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("[API] Pageview error:", error);
    res.status(500).json({ error: "Failed to record pageview" });
  }
});

router.post("/api/webhooks/resend", async (req: Request, res: Response) => {
  try {
    const event = req.body;
    
    if (event.data?.email_id) {
      const emailLogs = await storage.getPendingEmails();
      const matchingLog = emailLogs.find(log => log.providerMessageId === event.data.email_id);
      
      if (matchingLog) {
        let status: "delivered" | "bounced" | "opened" = "delivered";
        if (event.type === "email.bounced") status = "bounced";
        if (event.type === "email.opened") status = "opened";
        
        await storage.updateEmailLog(matchingLog.id, { status });
        
        await storage.createEmailEvent({
          emailLogId: matchingLog.id,
          eventType: event.type,
          metadata: event.data,
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[API] Webhook error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

router.get("/api/admin/blogs", async (req: Request, res: Response) => {
  try {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  } catch (error) {
    console.error("[API] Get blogs error:", error);
    res.status(500).json({ error: "Failed to get blog posts" });
  }
});

router.get("/api/blogs/kikis-blog", async (req: Request, res: Response) => {
  try {
    const posts = await storage.getPublishedBlogPosts();
    res.json(posts);
  } catch (error) {
    console.error("[API] Get published blogs error:", error);
    res.status(500).json({ error: "Failed to get blog posts" });
  }
});

router.get("/api/blogs/kikis-blog/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await storage.getBlogPostBySlug(slug);
    if (!post || post.status !== "published") {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("[API] Get blog error:", error);
    res.status(500).json({ error: "Failed to get blog post" });
  }
});

router.post("/api/admin/blogs", async (req: Request, res: Response) => {
  try {
    const { title, slug, excerpt, content, featuredImageUrl, metaTitle, metaDescription, status } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: "Title, slug, and content are required" });
    }

    const existing = await storage.getBlogPostBySlug(slug);
    if (existing) {
      return res.status(400).json({ error: "A blog post with this slug already exists" });
    }

    const post = await storage.createBlogPost({
      title,
      slug,
      excerpt,
      content,
      featuredImageUrl,
      metaTitle,
      metaDescription,
      status: status || "draft",
      publishedAt: status === "published" ? new Date() : undefined,
    });

    res.json(post);
  } catch (error) {
    console.error("[API] Create blog error:", error);
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

router.put("/api/admin/blogs/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, featuredImageUrl, metaTitle, metaDescription, status } = req.body;

    const existing = await storage.getBlogPostById(parseInt(id));
    if (!existing) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await storage.getBlogPostBySlug(slug);
      if (slugExists) {
        return res.status(400).json({ error: "A blog post with this slug already exists" });
      }
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (slug !== undefined) updates.slug = slug;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;
    if (featuredImageUrl !== undefined) updates.featuredImageUrl = featuredImageUrl;
    if (metaTitle !== undefined) updates.metaTitle = metaTitle;
    if (metaDescription !== undefined) updates.metaDescription = metaDescription;
    if (status !== undefined) {
      updates.status = status;
      if (status === "published" && !existing.publishedAt) {
        updates.publishedAt = new Date();
      }
    }

    const post = await storage.updateBlogPost(parseInt(id), updates);
    res.json(post);
  } catch (error) {
    console.error("[API] Update blog error:", error);
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

router.delete("/api/admin/blogs/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existing = await storage.getBlogPostById(parseInt(id));
    if (!existing) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    await storage.deleteBlogPost(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Delete blog error:", error);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

router.get("/api/admin/shopify/status", async (req: Request, res: Response) => {
  try {
    res.json({ configured: isShopifyConfigured() });
  } catch (error) {
    console.error("[API] Shopify status error:", error);
    res.status(500).json({ error: "Failed to check Shopify status" });
  }
});

router.post("/api/admin/blogs/sync-shopify", async (req: Request, res: Response) => {
  try {
    if (!isShopifyConfigured()) {
      return res.status(400).json({ 
        error: "Shopify is not configured. Please set SHOPIFY_STORE_URL and SHOPIFY_ACCESS_TOKEN." 
      });
    }

    const { imported, blogName } = await importBlogPostsFromShopify();
    
    let created = 0;
    let updated = 0;
    let skipped = 0;
    const skippedPosts: string[] = [];

    for (const post of imported) {
      const shopifyIdStr = String(post.shopifyId);
      
      const existingByShopifyId = await storage.getBlogPostByShopifyId(shopifyIdStr);
      
      if (existingByShopifyId) {
        await storage.updateBlogPost(existingByShopifyId.id, {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || undefined,
          content: post.content,
          featuredImageUrl: post.featuredImageUrl || undefined,
          status: post.status,
          publishedAt: post.publishedAt || undefined,
        });
        updated++;
      } else {
        const existingBySlug = await storage.getBlogPostBySlug(post.slug);
        
        if (existingBySlug && !existingBySlug.shopifyId) {
          skipped++;
          skippedPosts.push(post.title);
          continue;
        }
        
        await storage.createBlogPost({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || undefined,
          content: post.content,
          featuredImageUrl: post.featuredImageUrl || undefined,
          status: post.status,
          shopifyId: shopifyIdStr,
          publishedAt: post.publishedAt || undefined,
        });
        created++;
      }
    }

    res.json({
      success: true,
      blogName,
      stats: {
        total: imported.length,
        created,
        updated,
        skipped,
      },
      skippedPosts: skippedPosts.length > 0 ? skippedPosts : undefined,
    });
  } catch (error: any) {
    console.error("[API] Shopify sync error:", error);
    res.status(500).json({ error: error.message || "Failed to sync from Shopify" });
  }
});

// Analytics endpoints
router.get("/api/admin/analytics/overview", async (req: Request, res: Response) => {
  try {
    const stats = await storage.getAnalyticsOverview();
    res.json(stats);
  } catch (error) {
    console.error("[API] Analytics overview error:", error);
    res.status(500).json({ error: "Failed to get analytics overview" });
  }
});

router.get("/api/admin/analytics/top-pages", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const pages = await storage.getTopPages(limit);
    res.json(pages);
  } catch (error) {
    console.error("[API] Top pages error:", error);
    res.status(500).json({ error: "Failed to get top pages" });
  }
});

router.get("/api/admin/analytics/traffic-sources", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const sources = await storage.getTrafficSources(limit);
    res.json(sources);
  } catch (error) {
    console.error("[API] Traffic sources error:", error);
    res.status(500).json({ error: "Failed to get traffic sources" });
  }
});

router.get("/api/admin/analytics/signups-over-time", async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const data = await storage.getSignupsOverTime(days);
    res.json(data);
  } catch (error) {
    console.error("[API] Signups over time error:", error);
    res.status(500).json({ error: "Failed to get signups over time" });
  }
});

// Site Assets API
router.get("/api/admin/assets", async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const assets = type 
      ? await storage.getSiteAssetsByType(type)
      : await storage.getSiteAssets();
    res.json(assets);
  } catch (error) {
    console.error("[API] Get assets error:", error);
    res.status(500).json({ error: "Failed to get assets" });
  }
});

router.get("/api/admin/assets/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assets = await storage.getSiteAssets();
    const asset = assets.find(a => a.id === parseInt(id));
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(asset);
  } catch (error) {
    console.error("[API] Get asset error:", error);
    res.status(500).json({ error: "Failed to get asset" });
  }
});

router.post("/api/admin/assets", async (req: Request, res: Response) => {
  try {
    const { key, type, label, description, url, downloadable, sortOrder } = req.body;

    if (!key || !label || !url) {
      return res.status(400).json({ error: "Key, label, and URL are required" });
    }

    const existing = await storage.getSiteAssetByKey(key);
    if (existing) {
      return res.status(400).json({ error: "An asset with this key already exists" });
    }

    const asset = await storage.createSiteAsset({
      key,
      type: type || "other",
      label,
      description,
      url,
      downloadable: downloadable || false,
      sortOrder: sortOrder || 0,
    });

    res.json(asset);
  } catch (error) {
    console.error("[API] Create asset error:", error);
    res.status(500).json({ error: "Failed to create asset" });
  }
});

router.put("/api/admin/assets/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { key, type, label, description, url, downloadable, sortOrder } = req.body;

    const updates: any = {};
    if (key !== undefined) updates.key = key;
    if (type !== undefined) updates.type = type;
    if (label !== undefined) updates.label = label;
    if (description !== undefined) updates.description = description;
    if (url !== undefined) updates.url = url;
    if (downloadable !== undefined) updates.downloadable = downloadable;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;

    const asset = await storage.updateSiteAsset(parseInt(id), updates);
    res.json(asset);
  } catch (error) {
    console.error("[API] Update asset error:", error);
    res.status(500).json({ error: "Failed to update asset" });
  }
});

router.delete("/api/admin/assets/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await storage.deleteSiteAsset(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Delete asset error:", error);
    res.status(500).json({ error: "Failed to delete asset" });
  }
});

// Public API for site assets (for landing page to fetch)
router.get("/api/assets", async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const assets = type 
      ? await storage.getSiteAssetsByType(type)
      : await storage.getSiteAssets();
    res.json(assets);
  } catch (error) {
    console.error("[API] Get public assets error:", error);
    res.status(500).json({ error: "Failed to get assets" });
  }
});

// Media Kit page assets
router.get("/api/media-kit", async (req: Request, res: Response) => {
  try {
    const assets = await storage.getSiteAssetsByType("media_kit_item");
    res.json(assets);
  } catch (error) {
    console.error("[API] Get media kit error:", error);
    res.status(500).json({ error: "Failed to get media kit" });
  }
});

export default router;
