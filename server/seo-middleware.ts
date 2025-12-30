import { db } from './db';
import { blogPosts } from '../shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://kikithetoothfairy.co';

const staticPageMeta: Record<string, PageMeta> = {
  '/': {
    title: 'Kiki the Tooth Fairy | Free Live Tracker & Personalized Videos',
    description: 'Track the tooth fairy in real-time with our free magical tracker! Watch Kiki\'s journey with 6 personalized video updates as she visits your child.',
    canonical: `${BASE_URL}/`,
  },
  '/tracker': {
    title: 'Tooth Fairy Tracker | Kiki the Tooth Fairy',
    description: 'Track the tooth fairy\'s magical journey in real-time! Watch Kiki fly across the world to collect your tooth with personalized video updates.',
    canonical: `${BASE_URL}/tracker`,
  },
  '/blogs/kikis-blog': {
    title: "Kiki's Blog - Tooth Fairy Stories & Tips | Kiki the Tooth Fairy",
    description: 'Discover magical tooth fairy stories, parenting tips, and traditions on Kiki\'s Blog. Expert advice for making your child\'s tooth fairy experience unforgettable.',
    canonical: `${BASE_URL}/blogs/kikis-blog`,
  },
  '/pages/faq': {
    title: 'Frequently Asked Questions | Kiki the Tooth Fairy',
    description: 'Find answers to common questions about Kiki the Tooth Fairy Tracker. Learn how the magical tooth fairy tracking experience works for your child.',
    canonical: `${BASE_URL}/pages/faq`,
  },
  '/pages/contact': {
    title: 'Contact Us | Kiki the Tooth Fairy',
    description: 'Get in touch with Kiki the Tooth Fairy. We\'d love to hear from you! Send us a message and we\'ll respond as soon as possible.',
    canonical: `${BASE_URL}/pages/contact`,
  },
  '/policies/privacy-policy': {
    title: 'Privacy Policy | Kiki the Tooth Fairy',
    description: 'Learn how Kiki the Tooth Fairy collects, uses, and protects your personal information. Read our privacy policy for complete details.',
    canonical: `${BASE_URL}/policies/privacy-policy`,
  },
  '/policies/terms-of-service': {
    title: 'Terms of Service | Kiki the Tooth Fairy',
    description: 'Read the terms and conditions for using Kiki the Tooth Fairy services. Understand your rights and responsibilities as a user.',
    canonical: `${BASE_URL}/policies/terms-of-service`,
  },
  '/policies/shipping-policy': {
    title: 'Shipping Policy | Kiki the Tooth Fairy',
    description: 'Learn about digital delivery for Kiki the Tooth Fairy personalized videos. All products are delivered instantly via email - no physical shipping required.',
    canonical: `${BASE_URL}/policies/shipping-policy`,
  },
  '/policies/refund-policy': {
    title: 'Refund Policy | Kiki the Tooth Fairy',
    description: 'Understand our refund policy for Kiki the Tooth Fairy personalized videos. Learn about eligibility, non-refundable situations, and how to request support.',
    canonical: `${BASE_URL}/policies/refund-policy`,
  },
  '/media-kit': {
    title: 'Media Kit | Kiki the Tooth Fairy',
    description: 'Download official Kiki the Tooth Fairy branding assets, logos, and media resources for press and partnership inquiries.',
    canonical: `${BASE_URL}/media-kit`,
  },
};

async function getBlogPostMeta(slug: string): Promise<PageMeta | null> {
  try {
    const [post] = await db
      .select({
        title: blogPosts.title,
        metaTitle: blogPosts.metaTitle,
        metaDescription: blogPosts.metaDescription,
        excerpt: blogPosts.excerpt,
        featuredImageUrl: blogPosts.featuredImageUrl,
      })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (!post) return null;

    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || `Read about ${post.title} on Kiki's Blog`;
    const ogImage = post.featuredImageUrl || `${BASE_URL}/og-image.png`;

    return {
      title: `${title} | Kiki the Tooth Fairy`,
      description,
      canonical: `${BASE_URL}/blogs/kikis-blog/${slug}`,
      ogTitle: title,
      ogDescription: description,
      ogImage,
    };
  } catch (error) {
    console.error('Error fetching blog post meta:', error);
    return null;
  }
}

function injectMeta(html: string, meta: PageMeta): string {
  let result = html;

  result = result.replace(
    /<title>[^<]*<\/title>/,
    `<title>${meta.title}</title>`
  );

  result = result.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${meta.description}">`
  );

  result = result.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${meta.canonical}">`
  );

  if (meta.noindex) {
    if (/<meta name="robots" content="[^"]*">/.test(result)) {
      result = result.replace(
        /<meta name="robots" content="[^"]*">/,
        `<meta name="robots" content="noindex, nofollow">`
      );
    } else {
      // Insert noindex tag after description meta tag if robots tag doesn't exist
      result = result.replace(
        /(<meta name="description" content="[^"]*">)/,
        `$1\n  <meta name="robots" content="noindex, nofollow">`
      );
    }
  }

  result = result.replace(
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${meta.canonical}">`
  );

  result = result.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${meta.ogTitle || meta.title}">`
  );

  result = result.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${meta.ogDescription || meta.description}">`
  );

  if (meta.ogImage) {
    result = result.replace(
      /<meta property="og:image" content="[^"]*">/,
      `<meta property="og:image" content="${meta.ogImage}">`
    );
    result = result.replace(
      /<meta name="twitter:image" content="[^"]*">/,
      `<meta name="twitter:image" content="${meta.ogImage}">`
    );
  }

  result = result.replace(
    /<meta name="twitter:url" content="[^"]*">/,
    `<meta name="twitter:url" content="${meta.canonical}">`
  );

  result = result.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${meta.ogTitle || meta.title}">`
  );

  result = result.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${meta.ogDescription || meta.description}">`
  );

  return result;
}

export async function seoMiddleware(reqPath: string, indexHtml: string): Promise<string> {
  if (staticPageMeta[reqPath]) {
    return injectMeta(indexHtml, staticPageMeta[reqPath]);
  }

  const blogPostMatch = reqPath.match(/^\/blogs\/kikis-blog\/([^\/]+)$/);
  if (blogPostMatch) {
    const slug = blogPostMatch[1];
    const meta = await getBlogPostMeta(slug);
    if (meta) {
      return injectMeta(indexHtml, meta);
    }
  }

  const trackerMatch = reqPath.match(/^\/tracker\/([^\/]+)$/);
  if (trackerMatch) {
    return injectMeta(indexHtml, {
      title: 'Tooth Fairy Tracker | Kiki the Tooth Fairy',
      description: 'Track the tooth fairy\'s magical journey in real-time! Watch Kiki fly across the world to collect your tooth with personalized video updates.',
      canonical: `${BASE_URL}/tracker`,
    });
  }

  // Intent landing pages / templates should not be indexed
  if (reqPath.startsWith('/templates/') || reqPath.startsWith('/lp/')) {
    return injectMeta(indexHtml, {
      title: 'Tooth Fairy Tracker | Kiki the Tooth Fairy',
      description: 'Track the tooth fairy\'s magical journey in real-time!',
      canonical: `${BASE_URL}/`,
      noindex: true,
    });
  }

  return indexHtml;
}
