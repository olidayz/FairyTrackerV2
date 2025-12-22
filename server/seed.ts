import { db } from './db';
import { stageDefinitions, stageContent, emailTemplates, landingImages, blogPosts } from '../shared/schema';
import { seedStageDefinitions, seedStageContent, seedEmailTemplates, seedLandingImages } from './seed-data';
import { seedBlogPosts } from './seed-blog-data';

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

    for (const img of seedLandingImages) {
      await db.insert(landingImages).values({
        key: img.key,
        label: img.label,
        description: img.description,
        imageUrl: img.imageUrl,
        title: img.title,
        mediaType: img.mediaType
      });
    }
    console.log('[Seed] Landing images seeded');

    for (const post of seedBlogPosts) {
      await db.insert(blogPosts).values({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImageUrl: post.featuredImageUrl,
        status: post.status,
        publishedAt: new Date()
      });
    }
    console.log('[Seed] Blog posts seeded');

    console.log('[Seed] Database seeding complete!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
}
