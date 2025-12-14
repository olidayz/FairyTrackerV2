import React, { useState } from 'react';
import {
  LucideIcon,
  Plane, Search, Home,
  Wind, Smile, Gift, Layout, Grid3x3, Timeline, Gamepad2, BookMarked
} from 'lucide-react';
import { MissionModal } from './components/MissionModal';

// Import Layout Variants
import { CardGridLayout } from './layouts/CardGridLayout';
import { TimelineLayout } from './layouts/TimelineLayout';
import { ArcadeLayout } from './layouts/ArcadeLayout';
import { StoryboardLayout } from './layouts/StoryboardLayout';

// === TYPES ===
interface Stage {
  id: number;
  title: string;
  type: 'active' | 'locked' | 'completed';
  icon: LucideIcon;
  message: string;
  subtext: string;
  location: string;
  cardImage: string;
  videoThumbnail: string;
  selfieImage: string;
  objectImage: string;
}

// === ASSET URLS ===
const IMG_NIGHT_SKY = "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=600&auto=format&fit=crop";
const IMG_CLOUDS = "https://images.unsplash.com/photo-1534067783865-2913f5fd1503?q=80&w=600&auto=format&fit=crop";
const IMG_BEDROOM = "https://images.unsplash.com/photo-1505691938895-1758d7bab192?q=80&w=600&auto=format&fit=crop";
const IMG_PILLOW = "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4d?q=80&w=600&auto=format&fit=crop";
const IMG_GIFT = "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop";
const IMG_SUNRISE = "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=600&auto=format&fit=crop";
const IMG_SELFIE_1 = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop";
const IMG_SELFIE_2 = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop";
const IMG_TOOTH = "https://cdn-icons-png.flaticon.com/512/2865/2865586.png";

const STAGES: Stage[] = [
  { id: 1, title: "LEAVING FAIRYLAND", type: "completed", icon: Plane, message: "I'm on my way! The stardust wind is strong tonight, but my wings are ready!", subtext: "DEP: 20:00", location: "Fairyland Gate", cardImage: IMG_NIGHT_SKY, videoThumbnail: IMG_NIGHT_SKY, selfieImage: IMG_SELFIE_1, objectImage: IMG_TOOTH },
  { id: 2, title: "ATMOSPHERE ENTRY", type: "active", icon: Wind, message: "Almost there! I can see your roof from way up here. It looks like a tiny Lego house!", subtext: "MACH 5", location: "Stratosphere", cardImage: IMG_CLOUDS, videoThumbnail: IMG_CLOUDS, selfieImage: IMG_SELFIE_2, objectImage: IMG_TOOTH },
  { id: 3, title: "SCANNING TARGET", type: "locked", icon: Search, message: "Found a signal! My glitter-radar is beeping like crazy near your pillow.", subtext: "SECTOR 7", location: "Bedroom Sector", cardImage: IMG_BEDROOM, videoThumbnail: IMG_BEDROOM, selfieImage: IMG_SELFIE_1, objectImage: IMG_TOOTH },
  { id: 4, title: "TOOTH SECURED", type: "locked", icon: Smile, message: "Got it! Wow, this is a shiny one. You must have brushed really well!", subtext: "ITEM: MOLAR", location: "Pillow Fort", cardImage: IMG_PILLOW, videoThumbnail: IMG_PILLOW, selfieImage: IMG_SELFIE_2, objectImage: IMG_TOOTH },
  { id: 5, title: "GIFT DEPLOYMENT", type: "locked", icon: Gift, message: "A golden coin for a golden tooth. Don't spend it all in one place!", subtext: "PAYMENT: SENT", location: "Under Pillow", cardImage: IMG_GIFT, videoThumbnail: IMG_GIFT, selfieImage: IMG_SELFIE_1, objectImage: IMG_TOOTH },
  { id: 6, title: "RETURN FLIGHT", type: "locked", icon: Home, message: "Heading back to the castle now. See you next time you lose a tooth!", subtext: "RTB: ASAP", location: "Starry Path", cardImage: IMG_SUNRISE, videoThumbnail: IMG_SUNRISE, selfieImage: IMG_SELFIE_2, objectImage: IMG_TOOTH }
];

type LayoutType = 'card-grid' | 'timeline' | 'arcade' | 'storyboard';

const LAYOUT_OPTIONS = [
  { id: 'card-grid', name: 'Card Grid', icon: Grid3x3, desc: 'Modern & Clean' },
  { id: 'timeline', name: 'Timeline', icon: Timeline, desc: 'Journey Path' },
  { id: 'arcade', name: 'Arcade', icon: Gamepad2, desc: 'Retro Gaming' },
  { id: 'storyboard', name: 'Storybook', icon: BookMarked, desc: 'Story Panels' },
] as const;

function App() {
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('card-grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleStageClick = (stage: Stage) => {
    setSelectedStage(stage);
    setModalOpen(true);
  };

  const renderLayout = () => {
    const props = {
      stages: STAGES,
      userName: 'Savannah',
      onStageClick: handleStageClick
    };

    switch (currentLayout) {
      case 'card-grid':
        return <CardGridLayout {...props} />;
      case 'timeline':
        return <TimelineLayout {...props} />;
      case 'arcade':
        return <ArcadeLayout {...props} />;
      case 'storyboard':
        return <StoryboardLayout {...props} />;
      default:
        return <CardGridLayout {...props} />;
    }
  };

  return (
    <>
      {/* Modal */}
      {modalOpen && selectedStage && (
        <MissionModal stage={selectedStage} onClose={() => setModalOpen(false)} />
      )}

      {/* Layout Switcher - Floating Button */}
      <div className="fixed top-6 right-6 z-50">

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-16 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-72 animate-in slide-in-from-top-5 duration-200">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Layout size={16} />
                Choose Layout Style
              </h3>
            </div>

            <div className="p-2">
              {LAYOUT_OPTIONS.map((layout) => {
                const Icon = layout.icon;
                const isActive = currentLayout === layout.id;

                return (
                  <button
                    key={layout.id}
                    onClick={() => {
                      setCurrentLayout(layout.id as LayoutType);
                      setMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                      ${isActive
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-400'
                        : 'hover:bg-slate-50 border-2 border-transparent'
                      }
                    `}
                  >
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${isActive
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                      }
                    `}>
                      <Icon size={24} />
                    </div>

                    <div className="flex-1 text-left">
                      <div className={`font-bold ${isActive ? 'text-purple-700' : 'text-slate-800'}`}>
                        {layout.name}
                      </div>
                      <div className="text-xs text-slate-500">{layout.desc}</div>
                    </div>

                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 text-center">
              Click any layout to preview instantly
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-white/20"
        >
          <Layout size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          <div className="text-left">
            <div className="text-xs opacity-90 font-medium">Layout</div>
            <div className="text-sm font-bold capitalize">
              {LAYOUT_OPTIONS.find(l => l.id === currentLayout)?.name}
            </div>
          </div>
        </button>
      </div>

      {/* Render Current Layout */}
      {renderLayout()}

      {/* Click outside to close menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

export default App;
