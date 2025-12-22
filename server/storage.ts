import { 
  users, trackerSessions, stageDefinitions, stageContent, stageEntries, 
  emailLogs, visitorSessions, pageViews, stageEvents, emailEvents, blogPosts, siteAssets,
  type User, type InsertUser, type TrackerSession, type InsertTrackerSession,
  type StageDefinition, type InsertStageDefinition, type StageContent, type InsertStageContent,
  type StageEntry, type InsertStageEntry, type EmailLog, type InsertEmailLog,
  type VisitorSession, type InsertVisitorSession, type PageView, type InsertPageView,
  type StageEvent, type InsertStageEvent, type EmailEvent, type InsertEmailEvent,
  type BlogPost, type InsertBlogPost, type SiteAsset, type InsertSiteAsset
} from "../shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export interface IStorage {
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  
  createTrackerSession(userId: number, utmData?: { source?: string; medium?: string; campaign?: string; referrer?: string }): Promise<TrackerSession>;
  getTrackerSessionByToken(token: string): Promise<TrackerSession | undefined>;
  getTrackerSessionWithUser(token: string): Promise<{ session: TrackerSession; user: User } | undefined>;
  
  getStageDefinitions(): Promise<StageDefinition[]>;
  getStageDefinitionBySlug(slug: string): Promise<StageDefinition | undefined>;
  
  getStageContent(stageDefinitionId: number): Promise<StageContent | undefined>;
  upsertStageContent(content: InsertStageContent): Promise<StageContent>;
  getAllStageContent(): Promise<(StageContent & { stageDefinition: StageDefinition })[]>;
  
  getStageEntriesForSession(trackerSessionId: number): Promise<(StageEntry & { stageDefinition: StageDefinition })[]>;
  createStageEntry(entry: InsertStageEntry): Promise<StageEntry>;
  markStageComplete(stageEntryId: number): Promise<void>;
  
  createEmailLog(log: InsertEmailLog): Promise<EmailLog>;
  getEmailLogsBySession(trackerSessionId: number): Promise<EmailLog[]>;
  updateEmailLog(id: number, updates: Partial<EmailLog>): Promise<void>;
  getPendingEmails(): Promise<EmailLog[]>;
  
  createVisitorSession(session: InsertVisitorSession): Promise<VisitorSession>;
  getVisitorSessionById(sessionId: string): Promise<VisitorSession | undefined>;
  updateVisitorSession(sessionId: string, updates: Partial<VisitorSession>): Promise<void>;
  
  createPageView(view: InsertPageView): Promise<PageView>;
  
  createStageEvent(event: InsertStageEvent): Promise<StageEvent>;
  
  createEmailEvent(event: InsertEmailEvent): Promise<EmailEvent>;
  
  getAnalyticsSummary(): Promise<{
    totalUsers: number;
    totalSessions: number;
    emailsSent: number;
    emailsOpened: number;
    emailsBounced: number;
  }>;
  
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createTrackerSession(userId: number, utmData?: { source?: string; medium?: string; campaign?: string; referrer?: string }): Promise<TrackerSession> {
    const trackerToken = uuidv4().replace(/-/g, '');
    const generatedAt = new Date();
    
    const [session] = await db.insert(trackerSessions).values({
      userId,
      trackerToken,
      generatedAt,
      utmSource: utmData?.source,
      utmMedium: utmData?.medium,
      utmCampaign: utmData?.campaign,
      referrer: utmData?.referrer,
    }).returning();
    
    const stages = await this.getStageDefinitions();
    for (const stage of stages) {
      const availabilityTimestamp = new Date(generatedAt.getTime() + stage.unlockOffsetMinutes * 60 * 1000);
      await db.insert(stageEntries).values({
        trackerSessionId: session.id,
        stageDefinitionId: stage.id,
        availabilityTimestamp,
      });
    }
    
    return session;
  }

  async getTrackerSessionByToken(token: string): Promise<TrackerSession | undefined> {
    const [session] = await db.select().from(trackerSessions).where(eq(trackerSessions.trackerToken, token));
    return session || undefined;
  }

  async getTrackerSessionWithUser(token: string): Promise<{ session: TrackerSession; user: User } | undefined> {
    const result = await db.select({
      session: trackerSessions,
      user: users,
    }).from(trackerSessions)
      .innerJoin(users, eq(trackerSessions.userId, users.id))
      .where(eq(trackerSessions.trackerToken, token));
    
    if (result.length === 0) return undefined;
    return result[0];
  }

  async getStageDefinitions(): Promise<StageDefinition[]> {
    return db.select().from(stageDefinitions).orderBy(stageDefinitions.orderIndex);
  }

  async getStageDefinitionBySlug(slug: string): Promise<StageDefinition | undefined> {
    const [stage] = await db.select().from(stageDefinitions).where(eq(stageDefinitions.slug, slug));
    return stage || undefined;
  }

  async getStageContent(stageDefinitionId: number): Promise<StageContent | undefined> {
    const [content] = await db.select().from(stageContent).where(eq(stageContent.stageDefinitionId, stageDefinitionId));
    return content || undefined;
  }

  async upsertStageContent(content: InsertStageContent): Promise<StageContent> {
    const existing = await this.getStageContent(content.stageDefinitionId);
    if (existing) {
      const [updated] = await db.update(stageContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(stageContent.id, existing.id))
        .returning();
      return updated;
    }
    const [newContent] = await db.insert(stageContent).values(content).returning();
    return newContent;
  }

  async getAllStageContent(): Promise<(StageContent & { stageDefinition: StageDefinition })[]> {
    const result = await db.select({
      content: stageContent,
      stageDefinition: stageDefinitions,
    }).from(stageContent)
      .innerJoin(stageDefinitions, eq(stageContent.stageDefinitionId, stageDefinitions.id))
      .orderBy(stageDefinitions.orderIndex);
    
    return result.map(r => ({ ...r.content, stageDefinition: r.stageDefinition }));
  }

  async getStageEntriesForSession(trackerSessionId: number): Promise<(StageEntry & { stageDefinition: StageDefinition })[]> {
    const result = await db.select({
      entry: stageEntries,
      stageDefinition: stageDefinitions,
    }).from(stageEntries)
      .innerJoin(stageDefinitions, eq(stageEntries.stageDefinitionId, stageDefinitions.id))
      .where(eq(stageEntries.trackerSessionId, trackerSessionId))
      .orderBy(stageDefinitions.orderIndex);
    
    return result.map(r => ({ ...r.entry, stageDefinition: r.stageDefinition }));
  }

  async createStageEntry(entry: InsertStageEntry): Promise<StageEntry> {
    const [newEntry] = await db.insert(stageEntries).values(entry).returning();
    return newEntry;
  }

  async markStageComplete(stageEntryId: number): Promise<void> {
    await db.update(stageEntries)
      .set({ completedAt: new Date() })
      .where(eq(stageEntries.id, stageEntryId));
  }

  async createEmailLog(log: InsertEmailLog): Promise<EmailLog> {
    const [newLog] = await db.insert(emailLogs).values(log).returning();
    return newLog;
  }

  async getEmailLogsBySession(trackerSessionId: number): Promise<EmailLog[]> {
    return db.select().from(emailLogs).where(eq(emailLogs.trackerSessionId, trackerSessionId));
  }

  async updateEmailLog(id: number, updates: Partial<EmailLog>): Promise<void> {
    await db.update(emailLogs).set(updates).where(eq(emailLogs.id, id));
  }

  async getPendingEmails(): Promise<EmailLog[]> {
    return db.select().from(emailLogs)
      .where(and(
        eq(emailLogs.status, "pending"),
        lte(emailLogs.scheduledFor, new Date())
      ));
  }

  async createVisitorSession(session: InsertVisitorSession): Promise<VisitorSession> {
    const [newSession] = await db.insert(visitorSessions).values(session).returning();
    return newSession;
  }

  async getVisitorSessionById(sessionId: string): Promise<VisitorSession | undefined> {
    const [session] = await db.select().from(visitorSessions).where(eq(visitorSessions.sessionId, sessionId));
    return session || undefined;
  }

  async updateVisitorSession(sessionId: string, updates: Partial<VisitorSession>): Promise<void> {
    await db.update(visitorSessions).set(updates).where(eq(visitorSessions.sessionId, sessionId));
  }

  async createPageView(view: InsertPageView): Promise<PageView> {
    const [newView] = await db.insert(pageViews).values(view).returning();
    return newView;
  }

  async createStageEvent(event: InsertStageEvent): Promise<StageEvent> {
    const [newEvent] = await db.insert(stageEvents).values(event).returning();
    return newEvent;
  }

  async createEmailEvent(event: InsertEmailEvent): Promise<EmailEvent> {
    const [newEvent] = await db.insert(emailEvents).values(event).returning();
    return newEvent;
  }

  async getAnalyticsSummary(): Promise<{
    totalUsers: number;
    totalSessions: number;
    emailsSent: number;
    emailsOpened: number;
    emailsBounced: number;
  }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [sessionCount] = await db.select({ count: sql<number>`count(*)` }).from(trackerSessions);
    const [sentCount] = await db.select({ count: sql<number>`count(*)` }).from(emailLogs).where(eq(emailLogs.status, "sent"));
    const [openedCount] = await db.select({ count: sql<number>`count(*)` }).from(emailLogs).where(eq(emailLogs.status, "opened"));
    const [bouncedCount] = await db.select({ count: sql<number>`count(*)` }).from(emailLogs).where(eq(emailLogs.status, "bounced"));

    return {
      totalUsers: Number(userCount.count),
      totalSessions: Number(sessionCount.count),
      emailsSent: Number(sentCount.count),
      emailsOpened: Number(openedCount.count),
      emailsBounced: Number(bouncedCount.count),
    };
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(blogPosts.createdAt);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(blogPosts.publishedAt);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updated] = await db.update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getBlogPostByShopifyId(shopifyId: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.shopifyId, shopifyId));
    return post || undefined;
  }

  async getAnalyticsOverview(): Promise<{
    totalVisitors: number;
    totalPageViews: number;
    totalSignups: number;
    emailsSent: number;
    todayVisitors: number;
    todayPageViews: number;
    todaySignups: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalVisitors] = await db.select({ count: sql<number>`count(*)` }).from(visitorSessions);
    const [totalPageViews] = await db.select({ count: sql<number>`count(*)` }).from(pageViews);
    const [totalSignups] = await db.select({ count: sql<number>`count(*)` }).from(trackerSessions);
    const [emailsSent] = await db.select({ count: sql<number>`count(*)` }).from(emailLogs).where(eq(emailLogs.status, "sent"));
    
    const [todayVisitors] = await db.select({ count: sql<number>`count(*)` })
      .from(visitorSessions)
      .where(gte(visitorSessions.createdAt, today));
    const [todayPageViews] = await db.select({ count: sql<number>`count(*)` })
      .from(pageViews)
      .where(gte(pageViews.timestamp, today));
    const [todaySignups] = await db.select({ count: sql<number>`count(*)` })
      .from(trackerSessions)
      .where(gte(trackerSessions.generatedAt, today));

    return {
      totalVisitors: Number(totalVisitors.count),
      totalPageViews: Number(totalPageViews.count),
      totalSignups: Number(totalSignups.count),
      emailsSent: Number(emailsSent.count),
      todayVisitors: Number(todayVisitors.count),
      todayPageViews: Number(todayPageViews.count),
      todaySignups: Number(todaySignups.count),
    };
  }

  async getTopPages(limit: number = 10): Promise<{ path: string; views: number }[]> {
    const results = await db.select({
      path: pageViews.path,
      views: sql<number>`count(*)`,
    })
      .from(pageViews)
      .groupBy(pageViews.path)
      .orderBy(sql`count(*) DESC`)
      .limit(limit);

    return results.map(r => ({ path: r.path, views: Number(r.views) }));
  }

  async getTrafficSources(limit: number = 10): Promise<{ source: string; visitors: number }[]> {
    const results = await db.select({
      source: sql<string>`COALESCE(${visitorSessions.utmSource}, 'direct')`,
      visitors: sql<number>`count(*)`,
    })
      .from(visitorSessions)
      .groupBy(sql`COALESCE(${visitorSessions.utmSource}, 'direct')`)
      .orderBy(sql`count(*) DESC`)
      .limit(limit);

    return results.map(r => ({ source: r.source || 'direct', visitors: Number(r.visitors) }));
  }

  async getSignupsOverTime(days: number = 30): Promise<{ date: string; signups: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const results = await db.select({
      date: sql<string>`DATE(${trackerSessions.generatedAt})`,
      signups: sql<number>`count(*)`,
    })
      .from(trackerSessions)
      .where(gte(trackerSessions.generatedAt, startDate))
      .groupBy(sql`DATE(${trackerSessions.generatedAt})`)
      .orderBy(sql`DATE(${trackerSessions.generatedAt})`);

    return results.map(r => ({ date: String(r.date), signups: Number(r.signups) }));
  }

  async getSiteAssets(): Promise<SiteAsset[]> {
    return db.select().from(siteAssets).orderBy(siteAssets.sortOrder, siteAssets.createdAt);
  }

  async getSiteAssetsByType(type: string): Promise<SiteAsset[]> {
    return db.select().from(siteAssets)
      .where(eq(siteAssets.type, type as any))
      .orderBy(siteAssets.sortOrder);
  }

  async getSiteAssetByKey(key: string): Promise<SiteAsset | undefined> {
    const [asset] = await db.select().from(siteAssets).where(eq(siteAssets.key, key));
    return asset || undefined;
  }

  async createSiteAsset(asset: InsertSiteAsset): Promise<SiteAsset> {
    const [newAsset] = await db.insert(siteAssets).values(asset).returning();
    return newAsset;
  }

  async updateSiteAsset(id: number, updates: Partial<InsertSiteAsset>): Promise<SiteAsset> {
    const [updated] = await db.update(siteAssets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(siteAssets.id, id))
      .returning();
    return updated;
  }

  async deleteSiteAsset(id: number): Promise<void> {
    await db.delete(siteAssets).where(eq(siteAssets.id, id));
  }
}

export const storage = new DatabaseStorage();
