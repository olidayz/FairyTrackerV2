import { pgTable, serial, varchar, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const trackerSessions = pgTable('tracker_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  trackerToken: varchar('tracker_token', { length: 64 }).notNull().unique(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  referrer: text('referrer'),
});

export const stageDefinitions = pgTable('stage_definitions', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  label: varchar('label', { length: 255 }).notNull(),
  dayPart: varchar('day_part', { length: 20 }).notNull(),
  unlockOffsetMinutes: integer('unlock_offset_minutes'),
  orderIndex: integer('order_index').notNull(),
});

export const stageContent = pgTable('stage_content', {
  id: serial('id').primaryKey(),
  stageDefinitionId: integer('stage_definition_id').references(() => stageDefinitions.id).notNull(),
  videoUrl: text('video_url'),
  imageUrl: text('image_url'),
  messageText: text('message_text'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const stageEntries = pgTable('stage_entries', {
  id: serial('id').primaryKey(),
  trackerSessionId: integer('tracker_session_id').references(() => trackerSessions.id).notNull(),
  stageDefinitionId: integer('stage_definition_id').references(() => stageDefinitions.id).notNull(),
  availabilityTimestamp: timestamp('availability_timestamp').notNull(),
  completedAt: timestamp('completed_at'),
});

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  featuredImageUrl: text('featured_image_url'),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  shopifyId: varchar('shopify_id', { length: 100 }),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: varchar('meta_description', { length: 500 }),
});

export const siteAssets = pgTable('site_assets', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  description: text('description'),
  url: text('url'),
  downloadable: boolean('downloadable').default(false),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TrackerSession = typeof trackerSessions.$inferSelect;
export type InsertTrackerSession = typeof trackerSessions.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type SiteAsset = typeof siteAssets.$inferSelect;
export type StageDefinition = typeof stageDefinitions.$inferSelect;
export type StageContent = typeof stageContent.$inferSelect;
