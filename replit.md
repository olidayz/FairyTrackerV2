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
The app follows a multi-page SPA architecture with these main routes:
- `/` - Landing page (NewLandingPage.tsx)
- `/tracker` - Main tracker experience (TrackerPage.tsx)
- `/blog` and `/blog/:slug` - Blog listing and individual posts
- `/media-kit`, `/faq`, `/contact` - Marketing and support pages
- `/privacy`, `/terms`, `/shipping`, `/refund` - Legal pages

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