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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TrackerSession = typeof trackerSessions.$inferSelect;
export type InsertTrackerSession = typeof trackerSessions.$inferInsert;
