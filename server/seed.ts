import { db } from './db';
import { stageDefinitions, stageContent, emailTemplates, landingImages, blogPosts } from '../shared/schema';
import { seedStageDefinitions, seedStageContent, seedEmailTemplates, seedLandingImages } from './seed-data';
import { seedBlogPosts } from './seed-blog-data';

export async function seedDatabase() {
  try {
    console.log('[Seed] Checking database tables...');

    const existingStages = await db.select().from(stageDefinitions).limit(1);
    if (existingStages.length === 0) {
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
    } else {
      console.log('[Seed] Stage definitions already exist, skipping');
    }

    const existingContent = await db.select().from(stageContent).limit(1);
    if (existingContent.length === 0) {
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
    } else {
      console.log('[Seed] Stage content already exists, skipping');
    }

    const existingTemplates = await db.select().from(emailTemplates).limit(1);
    if (existingTemplates.length === 0) {
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
    } else {
      console.log('[Seed] Email templates already exist, skipping');
    }

    const existingImages = await db.select().from(landingImages);
    if (existingImages.length < seedLandingImages.length) {
      if (existingImages.length > 0) {
        await db.delete(landingImages);
        console.log('[Seed] Cleared incomplete landing images');
      }
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
      console.log('[Seed] Landing images seeded (' + seedLandingImages.length + ' entries)');
    } else {
      console.log('[Seed] Landing images already exist (' + existingImages.length + '), skipping');
    }

    const existingPosts = await db.select().from(blogPosts);
    if (existingPosts.length < seedBlogPosts.length) {
      if (existingPosts.length > 0) {
        await db.delete(blogPosts);
        console.log('[Seed] Cleared incomplete blog posts');
      }
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
      console.log('[Seed] Blog posts seeded (' + seedBlogPosts.length + ' entries)');
    } else {
      console.log('[Seed] Blog posts already exist (' + existingPosts.length + '), skipping');
    }

    console.log('[Seed] Database check complete!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
}
