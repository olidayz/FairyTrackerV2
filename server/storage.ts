import { db } from './db';
import { users, trackerSessions, stageDefinitions, stageEntries, stageContent, blogPosts } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const storage = {
  async createUser(name: string, email: string) {
    const [user] = await db.insert(users).values({ name, email }).returning();
    return user;
  },

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  },

  async createTrackerSession(userId: number, childName?: string, referralData?: { utmSource?: string; utmMedium?: string; utmCampaign?: string; referrer?: string }) {
    const trackerToken = uuidv4().replace(/-/g, '');
    const [session] = await db.insert(trackerSessions).values({
      userId,
      trackerToken,
      childName,
      utmSource: referralData?.utmSource,
      utmMedium: referralData?.utmMedium,
      utmCampaign: referralData?.utmCampaign,
      referrer: referralData?.referrer,
    }).returning();
    return session;
  },

  async getTrackerSessionByToken(token: string) {
    const [session] = await db.select().from(trackerSessions).where(eq(trackerSessions.trackerToken, token));
    return session || null;
  },

  async getTrackerSessionWithUser(token: string) {
    const result = await db
      .select({
        session: trackerSessions,
        user: users,
      })
      .from(trackerSessions)
      .innerJoin(users, eq(trackerSessions.userId, users.id))
      .where(eq(trackerSessions.trackerToken, token));
    
    if (result.length === 0) return null;
    return result[0];
  },

  async getStageDefinitions() {
    return db.select().from(stageDefinitions).orderBy(stageDefinitions.orderIndex);
  },

  async createStageEntry(data: {
    trackerSessionId: number;
    stageDefinitionId: number;
    availabilityTimestamp: Date;
  }) {
    const [entry] = await db.insert(stageEntries).values(data).returning();
    return entry;
  },

  async getStageEntriesForSession(sessionId: number) {
    return db
      .select({
        entry: stageEntries,
        stageDefinition: stageDefinitions,
      })
      .from(stageEntries)
      .innerJoin(stageDefinitions, eq(stageEntries.stageDefinitionId, stageDefinitions.id))
      .where(eq(stageEntries.trackerSessionId, sessionId));
  },

  async getStageContent(stageDefinitionId: number) {
    const [content] = await db.select().from(stageContent).where(eq(stageContent.stageDefinitionId, stageDefinitionId));
    return content || null;
  },

  async getPublishedBlogPosts() {
    return db.select().from(blogPosts).where(eq(blogPosts.status, 'published')).orderBy(desc(blogPosts.createdAt));
  },

  async getBlogPostBySlug(slug: string) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || null;
  },
};
