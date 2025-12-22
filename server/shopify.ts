interface ShopifyArticle {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  summary_html: string | null;
  image?: {
    src: string;
  };
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ShopifyBlog {
  id: number;
  handle: string;
  title: string;
}

interface ShopifyArticlesResponse {
  articles: ShopifyArticle[];
}

interface ShopifyBlogsResponse {
  blogs: ShopifyBlog[];
}

export interface ImportedBlogPost {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImageUrl: string | null;
  status: "draft" | "published";
  publishedAt: Date | null;
  shopifyId: number;
}

function getShopifyConfig() {
  const storeUrl = process.env.SHOPIFY_STORE_URL;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!storeUrl || !accessToken) {
    throw new Error("Shopify credentials not configured. Please set SHOPIFY_STORE_URL and SHOPIFY_ACCESS_TOKEN.");
  }

  const cleanUrl = storeUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  
  return { storeUrl: cleanUrl, accessToken };
}

interface ShopifyFetchResult<T> {
  data: T;
  nextPageUrl: string | null;
}

async function shopifyFetch<T>(endpoint: string): Promise<ShopifyFetchResult<T>> {
  const { storeUrl, accessToken } = getShopifyConfig();
  
  const url = endpoint.startsWith("https://") 
    ? endpoint 
    : `https://${storeUrl}/admin/api/2024-01${endpoint}`;
  
  console.log(`[Shopify] Fetching: ${url.replace(/https:\/\/[^\/]+/, "")}`);
  
  const response = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Shopify] API Error: ${response.status} - ${errorText}`);
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  let nextPageUrl: string | null = null;
  const linkHeader = response.headers.get("Link");
  if (linkHeader) {
    const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
    if (nextMatch) {
      nextPageUrl = nextMatch[1];
    }
  }

  const data = await response.json();
  return { data, nextPageUrl };
}

export async function getShopifyBlogs(): Promise<ShopifyBlog[]> {
  const result = await shopifyFetch<ShopifyBlogsResponse>("/blogs.json");
  return result.data.blogs;
}

export async function getShopifyArticles(blogId: number): Promise<ShopifyArticle[]> {
  const allArticles: ShopifyArticle[] = [];
  const limit = 250;
  let nextUrl: string | null = `/blogs/${blogId}/articles.json?limit=${limit}`;

  while (nextUrl) {
    const result = await shopifyFetch<ShopifyArticlesResponse>(nextUrl);
    
    if (result.data.articles.length === 0) break;
    
    allArticles.push(...result.data.articles);
    nextUrl = result.nextPageUrl;
  }

  return allArticles;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function createExcerpt(html: string, maxLength: number = 200): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

export async function importBlogPostsFromShopify(): Promise<{
  imported: ImportedBlogPost[];
  blogName: string;
}> {
  const blogs = await getShopifyBlogs();
  
  if (blogs.length === 0) {
    throw new Error("No blogs found in your Shopify store");
  }

  const targetBlog = blogs.find(b => 
    b.handle === "kikis-blog" || 
    b.handle === "kiki-s-blog" ||
    b.title.toLowerCase().includes("kiki")
  ) || blogs[0];

  console.log(`[Shopify] Importing from blog: ${targetBlog.title} (${targetBlog.handle})`);

  const articles = await getShopifyArticles(targetBlog.id);
  
  console.log(`[Shopify] Found ${articles.length} articles`);

  const imported: ImportedBlogPost[] = articles.map(article => ({
    title: article.title,
    slug: article.handle,
    excerpt: article.summary_html 
      ? stripHtml(article.summary_html) 
      : createExcerpt(article.body_html),
    content: article.body_html,
    featuredImageUrl: article.image?.src || null,
    status: article.published_at ? "published" as const : "draft" as const,
    publishedAt: article.published_at ? new Date(article.published_at) : null,
    shopifyId: article.id,
  }));

  return { imported, blogName: targetBlog.title };
}

export function isShopifyConfigured(): boolean {
  return !!(process.env.SHOPIFY_STORE_URL && process.env.SHOPIFY_ACCESS_TOKEN);
}
