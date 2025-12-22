import { db } from './db';
import { stageDefinitions, stageContent, emailTemplates } from '../shared/schema';
import { seedStageDefinitions, seedStageContent, seedEmailTemplates } from './seed-data';
import { sql } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    const existingStages = await db.select().from(stageDefinitions).limit(1);
    
    if (existingStages.length > 0) {
      console.log('[Seed] Database already has data, skipping seed');
      return;
    }

    console.log('[Seed] Database is empty, seeding with initial data...');

    for (const stage of seedStageDefinitions) {
      await db.insert(stageDefinitions).values({
        slug: stage.slug,
        label: stage.label,
        dayPart: stage.dayPart,
        unlockOffsetMinutes: stage.unlockOffsetMinutes,
        orderIndex: stage.orderIndex
      });
    }
    console.log('[Seed] Stage definitions seeded');

    for (const content of seedStageContent) {
      await db.insert(stageContent).values({
        stageDefinitionId: content.stageDefinitionId,
        videoUrl: content.videoUrl,
        imageUrl: content.imageUrl,
        messageText: content.messageText,
        frontImageUrl: content.frontImageUrl,
        locationText: content.locationText,
        statusText: content.statusText,
        selfieImageUrl: content.selfieImageUrl,
        title: content.title
      });
    }
    console.log('[Seed] Stage content seeded');

    for (const template of seedEmailTemplates) {
      await db.insert(emailTemplates).values({
        slug: template.slug,
        name: template.name,
        subject: template.subject,
        preheader: template.preheader,
        headline: template.headline,
        bodyText: template.bodyText,
        ctaText: template.ctaText,
        ctaUrl: template.ctaUrl,
        footerText: template.footerText
      });
    }
    console.log('[Seed] Email templates seeded');

    console.log('[Seed] Database seeding complete!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
}
