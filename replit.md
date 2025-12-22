# replit.md

## Overview

This is a "Tooth Fairy Tracker" application - an interactive web experience that simulates tracking a tooth fairy's journey. The application features a visually rich, gamified interface with multiple stages that unlock over time, creating an engaging experience for children (and parents) after losing a tooth.

The core concept involves:
- A landing page that captures user signups
- A tracker interface showing the fairy's journey through various stages
- Time-based unlocking of content (night stages vs morning stages)
- Email notifications at key moments
- An admin CMS for managing stage content and blog posts

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (December 21, 2025)

**Fixed Signup Form Issue:**
- Corrected form implementation in NewLandingPage.tsx (was previously editing wrong file)
- Added state management for form inputs (childName, email, formError, isSubmitting)
- Implemented email validation with regex pattern before API submission
- Updated handleEnter to call `/api/signup` endpoint and navigate to tracker with token
- Fixed navigation buttons to scroll to signup form instead of bypassing it
- Form now properly prevents tracker generation without valid name and email
- User's child name now displays throughout the tracker page (e.g., "Journey to SOPHIE")

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7 for client-side navigation
- **Styling**: Tailwind CSS with custom design tokens for a "neon/toy-like" aesthetic
- **Maps**: Leaflet with React-Leaflet for interactive map displays
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and optimized production builds

**Key Pages**:
- `/` - Landing page for user acquisition and signup
- `/tracker` - Main tracker experience showing fairy journey stages
- `/tracker/:token` - Personalized tracker page with user's child name
- `/admin/cms` - Content management for stages, blog posts, site assets, and analytics dashboard
- `/blogs/kikis-blog` - Public blog page with SEO-optimized articles
- `/blogs/kikis-blog/:slug` - Individual blog post pages
- `/pages/faq` - FAQ page
- `/pages/contact` - Contact us page
- `/policies/privacy-policy` - Privacy Policy page
- `/policies/terms-of-service` - Terms of Service page
- `/policies/shipping-policy` - Shipping Policy page
- `/policies/refund-policy` - Refund Policy page

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript executed via tsx
- **API Pattern**: RESTful endpoints under `/api/*`
- **Static Serving**: Express serves the Vite-built frontend from `/dist`

**Key API Endpoints**:
- `POST /api/signup` - User registration and tracker session creation
- `GET /api/tracker/:token` - Retrieve tracker session data with user info (name for personalization)
- Stage and content management endpoints for the CMS
- `GET /api/admin/analytics/overview` - Analytics summary (visitors, page views, signups)
- `GET /api/admin/analytics/top-pages` - Most viewed pages
- `GET /api/admin/analytics/traffic-sources` - Traffic source breakdown
- `GET /api/admin/analytics/signups-over-time` - Signup trends over last 30 days
- `GET /api/admin/assets` - Manage site assets (CRUD operations)
- `GET /api/assets` - Public endpoint for landing page to fetch assets by type
- `GET /api/media-kit` - Public endpoint for media kit downloadable items

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Managed via `drizzle-kit push`

**Core Tables**:
- `users` - User accounts with name and email
- `tracker_sessions` - Individual tracking sessions with tokens and UTM data
- `stage_definitions` - Template definitions for each journey stage
- `stage_content` - CMS-managed content (videos, images, messages) per stage
- `stage_entries` - User progress through stages
- `email_logs` - Email delivery tracking
- `blog_posts` - CMS blog content with SEO fields (metaTitle, metaDescription)
- `site_assets` - CMS-managed images for landing page and media kit (hero_image, background, logo, media_kit_item, other)
- Analytics tables for visitor sessions, page views, and events

### Authentication Pattern
- Token-based tracker access (UUID tokens stored in `tracker_sessions`)
- No user authentication currently implemented for the admin CMS
- Sessions tied to email addresses for user identification

## External Dependencies

### Third-Party Services
- **Resend**: Email delivery service for welcome and unlock notification emails
  - Configured via `RESEND_API_KEY` environment variable
  - Fallback behavior logs emails when not configured
- **Shopify**: Blog content sync for importing existing blog posts
  - Configured via `SHOPIFY_STORE_URL` and `SHOPIFY_ACCESS_TOKEN` secrets
  - Uses Admin API 2024-01 with cursor-based pagination
  - Syncs to `blog_posts` table with `shopifyId` tracking for updates
  - Local-only posts (without shopifyId) are protected from overwrites
- **Replit Object Storage**: Direct image uploads for blog posts and stage content
  - Images stored in Replit's built-in cloud storage
  - Supports direct upload from CMS with preview
  - Served via `/objects/*` endpoint

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (required)
- `RESEND_API_KEY` - Resend API key for email sending (optional)
- `FROM_EMAIL` - Sender email address (optional, defaults to resend.dev)
- `GEMINI_API_KEY` - For AI features (referenced in Vite config)
- `SHOPIFY_STORE_URL` - Shopify store URL for blog sync (optional)
- `SHOPIFY_ACCESS_TOKEN` - Shopify Admin API token for blog sync (optional)

### Key NPM Dependencies
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `pg` - PostgreSQL client
- `express` - HTTP server
- `resend` - Email API client
- `uuid` - Token generation
- `leaflet` / `react-leaflet` - Map rendering
- `lucide-react` - Icons