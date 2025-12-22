import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const dayPartEnum = pgEnum("day_part", ["night", "morning"]);
export const emailTypeEnum = pgEnum("email_type", ["welcome", "unlock"]);
export const emailStatusEnum = pgEnum("email_status", ["pending", "sent", "delivered", "bounced", "opened", "failed"]);
export const stageEventTypeEnum = pgEnum("stage_event_type", ["view", "complete"]);
export const blogStatusEnum = pgEnum("blog_status", ["draft", "published"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trackerSessions = pgTable("tracker_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  trackerToken: varchar("tracker_token", { length: 64 }).notNull().unique(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  utmSource: varchar("utm_source", { length: 255 }),
  utmMedium: varchar("utm_medium", { length: 255 }),
  utmCampaign: varchar("utm_campaign", { length: 255 }),
  referrer: text("referrer"),
});

export const stageDefinitions = pgTable("stage_definitions", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  dayPart: dayPartEnum("day_part").notNull(),
  unlockOffsetMinutes: integer("unlock_offset_minutes").notNull().default(0),
  orderIndex: integer("order_index").notNull(),
});

export const stageContent = pgTable("stage_content", {
  id: serial("id").primaryKey(),
  stageDefinitionId: integer("stage_definition_id").references(() => stageDefinitions.id).notNull(),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  messageText: text("message_text"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stageEntries = pgTable("stage_entries", {
  id: serial("id").primaryKey(),
  trackerSessionId: integer("tracker_session_id").references(() => trackerSessions.id).notNull(),
  stageDefinitionId: integer("stage_definition_id").references(() => stageDefinitions.id).notNull(),
  availabilityTimestamp: timestamp("availability_timestamp").notNull(),
  completedAt: timestamp("completed_at"),
});

export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  trackerSessionId: integer("tracker_session_id").references(() => trackerSessions.id).notNull(),
  emailType: emailTypeEnum("email_type").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  sentAt: timestamp("sent_at"),
  providerMessageId: varchar("provider_message_id", { length: 255 }),
  status: emailStatusEnum("status").notNull().default("pending"),
  errorMessage: text("error_message"),
});

export const visitorSessions = pgTable("visitor_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  firstReferrer: text("first_referrer"),
  utmSource: varchar("utm_source", { length: 255 }),
  utmMedium: varchar("utm_medium", { length: 255 }),
  utmCampaign: varchar("utm_campaign", { length: 255 }),
  device: varchar("device", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
});

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  visitorSessionId: integer("visitor_session_id").references(() => visitorSessions.id).notNull(),
  path: varchar("path", { length: 500 }).notNull(),
  referrer: text("referrer"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const stageEvents = pgTable("stage_events", {
  id: serial("id").primaryKey(),
  trackerSessionId: integer("tracker_session_id").references(() => trackerSessions.id).notNull(),
  stageDefinitionId: integer("stage_definition_id").references(() => stageDefinitions.id).notNull(),
  eventType: stageEventTypeEnum("event_type").notNull(),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
});

export const emailEvents = pgTable("email_events", {
  id: serial("id").primaryKey(),
  emailLogId: integer("email_log_id").references(() => emailLogs.id).notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

export const usersRelations = relations(users, ({ many }) => ({
  trackerSessions: many(trackerSessions),
  visitorSessions: many(visitorSessions),
}));

export const trackerSessionsRelations = relations(trackerSessions, ({ one, many }) => ({
  user: one(users, { fields: [trackerSessions.userId], references: [users.id] }),
  stageEntries: many(stageEntries),
  emailLogs: many(emailLogs),
  stageEvents: many(stageEvents),
}));

export const stageDefinitionsRelations = relations(stageDefinitions, ({ one, many }) => ({
  content: one(stageContent, { fields: [stageDefinitions.id], references: [stageContent.stageDefinitionId] }),
  stageEntries: many(stageEntries),
  stageEvents: many(stageEvents),
}));

export const stageContentRelations = relations(stageContent, ({ one }) => ({
  stageDefinition: one(stageDefinitions, { fields: [stageContent.stageDefinitionId], references: [stageDefinitions.id] }),
}));

export const stageEntriesRelations = relations(stageEntries, ({ one }) => ({
  trackerSession: one(trackerSessions, { fields: [stageEntries.trackerSessionId], references: [trackerSessions.id] }),
  stageDefinition: one(stageDefinitions, { fields: [stageEntries.stageDefinitionId], references: [stageDefinitions.id] }),
}));

export const emailLogsRelations = relations(emailLogs, ({ one, many }) => ({
  trackerSession: one(trackerSessions, { fields: [emailLogs.trackerSessionId], references: [trackerSessions.id] }),
  emailEvents: many(emailEvents),
}));

export const visitorSessionsRelations = relations(visitorSessions, ({ one, many }) => ({
  user: one(users, { fields: [visitorSessions.userId], references: [users.id] }),
  pageViews: many(pageViews),
}));

export const pageViewsRelations = relations(pageViews, ({ one }) => ({
  visitorSession: one(visitorSessions, { fields: [pageViews.visitorSessionId], references: [visitorSessions.id] }),
}));

export const stageEventsRelations = relations(stageEvents, ({ one }) => ({
  trackerSession: one(trackerSessions, { fields: [stageEvents.trackerSessionId], references: [trackerSessions.id] }),
  stageDefinition: one(stageDefinitions, { fields: [stageEvents.stageDefinitionId], references: [stageDefinitions.id] }),
}));

export const emailEventsRelations = relations(emailEvents, ({ one }) => ({
  emailLog: one(emailLogs, { fields: [emailEvents.emailLogId], references: [emailLogs.id] }),
}));

export const siteAssetTypeEnum = pgEnum("site_asset_type", ["hero_image", "background", "logo", "media_kit_item", "other"]);

export const siteAssets = pgTable("site_assets", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  type: siteAssetTypeEnum("type").notNull().default("other"),
  label: varchar("label", { length: 255 }).notNull(),
  description: text("description"),
  url: text("url").notNull(),
  downloadable: boolean("downloadable").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImageUrl: text("featured_image_url"),
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  status: blogStatusEnum("status").notNull().default("draft"),
  shopifyId: varchar("shopify_id", { length: 50 }),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TrackerSession = typeof trackerSessions.$inferSelect;
export type InsertTrackerSession = typeof trackerSessions.$inferInsert;
export type StageDefinition = typeof stageDefinitions.$inferSelect;
export type InsertStageDefinition = typeof stageDefinitions.$inferInsert;
export type StageContent = typeof stageContent.$inferSelect;
export type InsertStageContent = typeof stageContent.$inferInsert;
export type StageEntry = typeof stageEntries.$inferSelect;
export type InsertStageEntry = typeof stageEntries.$inferInsert;
export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;
export type VisitorSession = typeof visitorSessions.$inferSelect;
export type InsertVisitorSession = typeof visitorSessions.$inferInsert;
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;
export type StageEvent = typeof stageEvents.$inferSelect;
export type InsertStageEvent = typeof stageEvents.$inferInsert;
export type EmailEvent = typeof emailEvents.$inferSelect;
export type InsertEmailEvent = typeof emailEvents.$inferInsert;
export type SiteAsset = typeof siteAssets.$inferSelect;
export type InsertSiteAsset = typeof siteAssets.$inferInsert;
