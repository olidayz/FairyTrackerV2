import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb, date } from 'drizzle-orm/pg-core';

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
  morningEmailScheduledFor: timestamp('morning_email_scheduled_for'),
  morningEmailSentAt: timestamp('morning_email_sent_at'),
  childName: varchar('child_name', { length: 255 }),
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
  frontImageUrl: text('front_image_url'),
  locationText: text('location_text'),
  statusText: text('status_text'),
  selfieImageUrl: text('selfie_image_url'),
  title: text('title'),
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
export const emailTemplates = pgTable('email_templates', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  preheader: varchar('preheader', { length: 255 }),
  headline: varchar('headline', { length: 255 }),
  bodyText: text('body_text'),
  ctaText: varchar('cta_text', { length: 100 }),
  ctaUrl: varchar('cta_url', { length: 500 }),
  footerText: text('footer_text'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Landing Page CMS Tables
export const landingHero = pgTable('landing_hero', {
  id: serial('id').primaryKey(),
  headline: varchar('headline', { length: 255 }),
  subheadline: text('subheadline'),
  badgeText: varchar('badge_text', { length: 100 }),
  ctaText: varchar('cta_text', { length: 100 }),
  backgroundImageUrl: text('background_image_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fairyUpdates = pgTable('fairy_updates', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  iconType: varchar('icon_type', { length: 50 }),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const kikiProfile = pgTable('kiki_profile', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).default('Kiki'),
  title: varchar('title', { length: 255 }),
  bio: text('bio'),
  photoUrl: text('photo_url'),
  stats: text('stats'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  reviewerName: varchar('reviewer_name', { length: 255 }).notNull(),
  reviewerLocation: varchar('reviewer_location', { length: 255 }),
  reviewText: text('review_text').notNull(),
  rating: integer('rating').default(5),
  photoUrl: text('photo_url'),
  isVerified: boolean('is_verified').default(false),
  isFeatured: boolean('is_featured').default(false),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: varchar('category', { length: 100 }),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const copySections = pgTable('copy_sections', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  label: varchar('label', { length: 255 }).notNull(),
  content: text('content'),
  page: varchar('page', { length: 100 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const landingImages = pgTable('landing_images', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  label: varchar('label', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  title: text('title'),
  mediaType: varchar('media_type', { length: 20 }).default('image'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SiteAsset = typeof siteAssets.$inferSelect;
export type LandingImage = typeof landingImages.$inferSelect;
export type StageDefinition = typeof stageDefinitions.$inferSelect;
export type StageContent = typeof stageContent.$inferSelect;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = typeof emailTemplates.$inferInsert;
export type LandingHero = typeof landingHero.$inferSelect;
export type FairyUpdate = typeof fairyUpdates.$inferSelect;
export type KikiProfile = typeof kikiProfile.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type FAQ = typeof faqs.$inferSelect;
export type CopySection = typeof copySections.$inferSelect;

// Analytics Tables
export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  trackerSessionId: integer('tracker_session_id').references(() => trackerSessions.id),
  userId: integer('user_id').references(() => users.id),
  stageDefinitionId: integer('stage_definition_id').references(() => stageDefinitions.id),
  source: varchar('source', { length: 100 }),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata'),
  occurredAt: timestamp('occurred_at').defaultNow().notNull(),
});

export const emailEvents = pgTable('email_events', {
  id: serial('id').primaryKey(),
  resendEventId: varchar('resend_event_id', { length: 255 }),
  trackerSessionId: integer('tracker_session_id').references(() => trackerSessions.id),
  email: varchar('email', { length: 255 }).notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  payload: jsonb('payload'),
  occurredAt: timestamp('occurred_at').defaultNow().notNull(),
});

export const dailyMetrics = pgTable('daily_metrics', {
  id: serial('id').primaryKey(),
  metricDate: date('metric_date').notNull(),
  metricName: varchar('metric_name', { length: 100 }).notNull(),
  metricValue: integer('metric_value').notNull().default(0),
  dimension: varchar('dimension', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const stageProgressMetrics = pgTable('stage_progress_metrics', {
  id: serial('id').primaryKey(),
  metricDate: date('metric_date').notNull(),
  stageDefinitionId: integer('stage_definition_id').references(() => stageDefinitions.id).notNull(),
  sessionsStarted: integer('sessions_started').default(0),
  sessionsCompleted: integer('sessions_completed').default(0),
  avgCompletionSeconds: integer('avg_completion_seconds'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;
export type EmailEvent = typeof emailEvents.$inferSelect;
export type InsertEmailEvent = typeof emailEvents.$inferInsert;
export type DailyMetric = typeof dailyMetrics.$inferSelect;
export type StageProgressMetric = typeof stageProgressMetrics.$inferSelect;
