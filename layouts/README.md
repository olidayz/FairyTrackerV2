# Layout Variations

This directory contains different design variations for the Tooth Fairy Tracker app. Each layout presents the same data (mission stages, user info) in a completely different visual style.

## Available Layouts

### 1. Card Grid Layout (`CardGridLayout.tsx`)
**Style:** Modern, Clean, Minimal
**Features:**
- Pastel gradient backgrounds (indigo → purple → pink)
- Floating card animations
- Soft shadows and rounded corners
- Hover effects with scale transforms
- Status badges with icons
- Clean typography with gradient text

**Best For:** Modern, professional feel with soft aesthetics

---

### 2. Timeline Layout (`TimelineLayout.tsx`)
**Style:** Vertical Journey Progression
**Features:**
- Dark theme (slate-900 background)
- Central timeline with connecting dots
- Side-by-side card layout (alternating left/right)
- Gradient status colors (green → blue → gray)
- Pulse animations for active stages
- Technical/professional aesthetic

**Best For:** Showing linear progression and journey flow

---

### 3. Arcade Layout (`ArcadeLayout.tsx`)
**Style:** Retro Gaming / 80s-90s Arcade
**Features:**
- CRT scanline effects
- Starfield background
- Score counter, lives display, level indicator
- Neon colors with text shadows
- Pixel-style borders
- XP progress bars
- "INSERT COIN" aesthetic

**Best For:** Fun, playful, nostalgic gaming experience

---

### 4. Storyboard Layout (`StoryboardLayout.tsx`)
**Style:** Comic Book / Story Panels
**Features:**
- Book cover design with decorative corners
- Chapter-based organization
- Speech bubble messages
- Serif fonts for literary feel
- Amber/yellow color scheme
- Comic panel frames
- Narrative-focused layout

**Best For:** Storytelling, bedtime reading, narrative experience

---

## Usage

All layouts share the same props interface:

```typescript
interface LayoutProps {
  stages: Stage[];
  userName: string;
  onStageClick: (stage: Stage) => void;
}
```

To use a layout:

```typescript
import { CardGridLayout } from './layouts/CardGridLayout';

<CardGridLayout
  stages={STAGES}
  userName="Savannah"
  onStageClick={handleStageClick}
/>
```

## Switching Layouts

The main app (`App.tsx`) includes a floating layout switcher button that allows instant switching between all four layouts without page reload.

## Creating New Layouts

To add a new layout:

1. Create a new file in `layouts/` (e.g., `MyLayout.tsx`)
2. Implement the `LayoutProps` interface
3. Export your layout component
4. Add it to the switcher in `App.tsx`

Each layout should handle:
- Stage display (all 6 stages)
- Status types (completed, active, locked)
- Click handlers
- Responsive design (mobile + desktop)
