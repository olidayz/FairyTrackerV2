# Kiki the Tooth Fairy Tracker

## Overview

This is a React-based web application that provides an interactive "Tooth Fairy Tracker" experience for children and parents. The app creates a magical, immersive experience where kids can track a tooth fairy's journey through personalized video updates and animated map interfaces. The product is a free tracker tool with plans for premium personalized video content.

The application features a modern, visually rich UI with a dark space/night theme, animated backgrounds, and interactive elements designed to feel like a magical tracking device.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM v7 for client-side navigation
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS (loaded via CDN in index.html) with custom configuration
- **Custom Fonts**: MDNIchrome Ultra (custom font files served from public directory)

### Page Structure
The app follows a multi-page SPA architecture with these main routes (matching Shopify URL structure):
- `/` - Landing page with signup form (NewLandingPage.tsx)
- `/tracker` - Demo tracker experience (TrackerPage.tsx)
- `/tracker/:token` - Personalized tracker with child's name from database
- `/blogs/kikis-blog` and `/blogs/kikis-blog/:slug` - Blog listing and posts
- `/pages/faq`, `/pages/contact` - Marketing and support pages
- `/policies/privacy-policy`, `/policies/terms-of-service`, `/policies/shipping-policy`, `/policies/refund-policy` - Legal pages

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Port**: Backend runs on port 3001, Vite dev server on port 5000 with proxy

### API Endpoints
- `POST /api/signup` - Creates user and tracker session, returns personalized tracker URL
- `GET /api/tracker/:token` - Returns personalized tracker data including child's name

### Database Schema
- `users` - Stores child name and parent email
- `tracker_sessions` - Links users to unique tracker tokens (includes childName for per-session personalization)
- `stage_definitions` - Defines tracker stages (night/morning)
- `stage_entries` - Per-session stage availability timestamps
- `stage_content` - Video/image content for each stage (includes frontImageUrl, locationText, statusText for front card)
- `blog_posts` - Blog articles with slug, title, content, featured images
- `email_templates` - Customizable email templates for tracking, morning unlock, admin notifications
- `landing_hero` - Hero section content (headline, subheadline, CTA text)
- `fairy_updates` - Fairy update cards content
- `kiki_profile` - Meet Kiki section content (name, title, bio, photo)
- `reviews` - Customer reviews with ratings and photos
- `faqs` - FAQ questions and answers (displayed on /pages/faq)
- `copy_sections` - Editable text sections across the site

### Admin CMS Features
The Admin panel (/admin) provides full CMS capabilities:
- **Analytics Dashboard**: Real-time metrics for signups, tracker views, email performance, and recent users
- **Blog Posts**: Create, edit, delete blog articles with rich content
- **Stage Content**: Configure each tracker stage with front card image (via upload), location text, status text, video URL, image URL, and message text
- **Email Templates**: Customize email content for tracking links, morning unlock, and admin notifications
- **Landing Page Content**: Manage hero section, fairy updates, Kiki profile, reviews, FAQs, and copy sections
- **Site Assets**: Manage downloadable assets and media files

### File Upload (Object Storage)
- Uses Replit Object Storage with presigned URL upload flow
- POST /api/uploads/request-url - Get presigned URL for file upload
- GET /objects/* - Serve uploaded files from storage
- Images uploaded in Admin are stored in cloud storage and served via /objects/ path

### Component Organization
- **Page Components**: Root-level TSX files (App.tsx, NewLandingPage.tsx, etc.)
- **Shared Components**: Located in `/components` directory (Header, Footer, StageCard, etc.)
- **UI Components**: Reusable UI elements in `/components/ui`
- **Utilities**: Helper functions in `/lib` directory

### Design Patterns
- **Component-based architecture**: Each page and feature is encapsulated in its own component
- **Shared layout components**: Header and Footer are reused across pages
- **Theme consistency**: Dark space theme with cyan, fuchsia, and amber accent colors throughout
- **Interactive elements**: Cards with flip animations, hover states, and visual feedback

### Map Integration
- **Library**: Leaflet with React-Leaflet wrapper
- **Purpose**: Displays animated fairy flight paths across a world map
- **Features**: Custom markers, polylines for flight paths, animated fairy position

### State Management
- Local component state using React hooks (useState, useEffect)
- No external state management library - state is kept close to where it's used

## External Dependencies

### Core Libraries
- **React 19.2.1**: UI framework
- **React Router DOM 7.10.1**: Client-side routing
- **Leaflet 1.9.4 + React-Leaflet 5.0.0**: Interactive maps
- **Lucide React 0.555.0**: Icon library

### Styling Utilities
- **clsx + tailwind-merge**: CSS class name utilities
- **Tailwind CSS**: Utility-first CSS framework (CDN-loaded)

### Development Tools
- **Vite 6.2.0**: Build tool and dev server
- **TypeScript 5.8.2**: Type checking
- **@vitejs/plugin-react**: React plugin for Vite

### External Services
- **Google Fonts**: Plus Jakarta Sans, Archivo Black, JetBrains Mono
- **Unsplash**: Stock images for blog posts
- **Instagram**: Social media integration (linked in footer)

### API Configuration
- **Gemini API**: Environment variable `GEMINI_API_KEY` is configured in Vite for potential AI features
- API key is loaded from `.env.local` file

### Static Assets
- Custom font files (MDNIchrome) served from public directory
- Logo and branding images expected in public directory

## Recent Additions (December 22, 2025)

### Analytics Dashboard
- Real-time metrics for user signups and tracker views
- Email performance tracking (sent, delivered, opened, clicked)
- 30-day historical charts with interactive tooltips
- Recent signups table with direct tracker links
- Integrated with Resend webhook events

### SEO & Search
- `/sitemap.xml` - Dynamic XML sitemap with all pages and published blog posts
- `/robots.txt` - Search engine crawling rules and sitemap reference
- Vite proxy configured for both endpoints

### UI Improvements
- Fixed stage card layout: expanded cards now push down subsequent cards instead of overlaying
- Dynamic height calculation for flipped stage cards
- Smooth height transitions during card flip animation