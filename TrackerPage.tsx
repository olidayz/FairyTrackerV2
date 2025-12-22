import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  LucideIcon,
  Plane, Search, Home, Lock,
  Play, Gift, Star, Moon,
  MapPin, Video, Smile, Sparkles,
  Unlock, Wind, Zap, CheckCircle2,
  Activity, Crosshair, Signal, Gauge, ArrowUp,
  Cpu, Database, Shield, Sun, Radar, Scan, Backpack,
  MessageCircle, Wifi, Battery, Radio, ChevronsRight,
  Fingerprint, Compass, Navigation, Layers, ZoomIn,
  Ruler, Move
} from 'lucide-react';
import { StageCard } from './components/StageCard';
import Footer from './components/Footer';
// MissionModal removed - flip card handles reveals now
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// === CUSTOM ICONS ===
const CustomMoonIcon = ({ size = 48, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="moon3d_gradient" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="40%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <filter id="moon3d_shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.3" />
      </filter>
    </defs>
    <g transform="rotate(-15 50 50)" filter="url(#moon3d_shadow)">
      <path d="M 75 10 A 42 42 0 1 1 75 90 A 32 32 0 1 0 75 10 Z" fill="url(#moon3d_gradient)" stroke="#FEF08A" strokeWidth="0.5" />
      <ellipse cx="60" cy="25" rx="8" ry="14" fill="white" fillOpacity="0.7" transform="rotate(-20 60 25)" filter="blur(1px)" />
      <circle cx="70" cy="18" r="2.5" fill="white" fillOpacity="0.9" />
      <path d="M 35 75 Q 50 85 70 85" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none" />
    </g>
  </svg>
);

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
  videoUrl?: string | null;
}

interface CMSStageContent {
  id: number;
  slug: string;
  label: string;
  dayPart: string;
  orderIndex: number;
  content: {
    videoUrl?: string | null;
    imageUrl?: string | null;
    messageText?: string | null;
    frontImageUrl?: string | null;
    locationText?: string | null;
    statusText?: string | null;
    selfieImageUrl?: string | null;
    title?: string | null;
  } | null;
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
  { id: 1, title: "ADVENTURE BEGINS", type: "completed", icon: Plane, message: "I'm on my way! The stardust wind is strong tonight, but my wings are ready!", subtext: "DEP: 20:00", location: "Fairyland Gate", cardImage: IMG_NIGHT_SKY, videoThumbnail: IMG_NIGHT_SKY, selfieImage: IMG_SELFIE_1, objectImage: IMG_TOOTH },
  { id: 2, title: "OFF WE\u00A0GO", type: "active", icon: Wind, message: "Almost there! I can see your roof from way up here. It looks like a tiny Lego house!", subtext: "MACH 5", location: "Stratosphere", cardImage: IMG_CLOUDS, videoThumbnail: IMG_CLOUDS, selfieImage: IMG_SELFIE_2, objectImage: IMG_TOOTH },
  { id: 3, title: "PYRAMID PIT\u00A0STOP", type: "locked", icon: Search, message: "Found a signal! My glitter-radar is beeping like crazy near your pillow.", subtext: "SECTOR 7", location: "Bedroom Sector", cardImage: IMG_BEDROOM, videoThumbnail: IMG_BEDROOM, selfieImage: IMG_SELFIE_1, objectImage: IMG_TOOTH },
  { id: 4, title: "TOOTH SECURED", type: "locked", icon: Smile, message: "Got it! Wow, this is a shiny one. You must have brushed really well!", subtext: "ITEM: MOLAR", location: "Pillow Fort", cardImage: IMG_PILLOW, videoThumbnail: IMG_PILLOW, selfieImage: IMG_SELFIE_2, objectImage: IMG_TOOTH },
  { id: 5, title: "GIFT DEPLOYMENT", type: "locked", icon: Gift, message: "A golden coin for a golden tooth. Don't spend it all in one place!", subtext: "PAYMENT: SENT", location: "Under Pillow", cardImage: IMG_GIFT, videoThumbnail: IMG_GIFT, selfieImage: IMG_SELFIE_1, objectImage: IMG_TOOTH },
  { id: 6, title: "RETURN FLIGHT", type: "locked", icon: Home, message: "Heading back to the castle now. See you next time you lose a tooth!", subtext: "RTB: ASAP", location: "Starry Path", cardImage: IMG_SUNRISE, videoThumbnail: IMG_SUNRISE, selfieImage: IMG_SELFIE_2, objectImage: IMG_TOOTH }
];

// === DESIGN SYSTEM COMPONENTS ===

const NeonPanel = ({
  label,
  children,
  className = "",
  borderColor = "border-cyan-500",
  bgColor = "bg-slate-900",
  height = "h-32",
}: {
  label: string,
  children?: React.ReactNode,
  className?: string,
  borderColor?: string,
  bgColor?: string,
  height?: string,
}) => {
  // Map borderColor to gradient colors for the floating badge
  const getGradient = () => {
    if (borderColor.includes('cyan')) return 'from-cyan-400 to-blue-500';
    if (borderColor.includes('amber')) return 'from-amber-400 to-orange-500';
    if (borderColor.includes('fuchsia')) return 'from-fuchsia-400 to-pink-500';
    if (borderColor.includes('purple')) return 'from-purple-400 to-fuchsia-500';
    if (borderColor.includes('lime')) return 'from-lime-400 to-green-500';
    if (borderColor.includes('emerald')) return 'from-emerald-400 to-teal-500';
    return 'from-cyan-400 to-blue-500';
  };

  // Map borderColor to ring color - BRIGHTER
  const getRingColor = () => {
    if (borderColor.includes('cyan')) return 'ring-cyan-400/60';
    if (borderColor.includes('amber')) return 'ring-amber-400/60';
    if (borderColor.includes('fuchsia')) return 'ring-fuchsia-400/60';
    if (borderColor.includes('purple')) return 'ring-purple-400/60';
    if (borderColor.includes('lime')) return 'ring-lime-400/60';
    if (borderColor.includes('emerald')) return 'ring-emerald-400/60';
    return 'ring-cyan-400/60';
  };

  // Map borderColor to glow shadow - COLOR POP
  const getGlowShadow = () => {
    if (borderColor.includes('cyan')) return 'shadow-[0_0_40px_rgba(34,211,238,0.3),0_20px_50px_rgba(0,0,0,0.4)]';
    if (borderColor.includes('amber')) return 'shadow-[0_0_40px_rgba(251,191,36,0.3),0_20px_50px_rgba(0,0,0,0.4)]';
    if (borderColor.includes('fuchsia')) return 'shadow-[0_0_40px_rgba(232,121,249,0.3),0_20px_50px_rgba(0,0,0,0.4)]';
    if (borderColor.includes('purple')) return 'shadow-[0_0_40px_rgba(192,132,252,0.3),0_20px_50px_rgba(0,0,0,0.4)]';
    if (borderColor.includes('lime')) return 'shadow-[0_0_40px_rgba(163,230,53,0.3),0_20px_50px_rgba(0,0,0,0.4)]';
    if (borderColor.includes('emerald')) return 'shadow-[0_0_40px_rgba(52,211,153,0.3),0_20px_50px_rgba(0,0,0,0.4)]';
    return 'shadow-[0_0_40px_rgba(34,211,238,0.3),0_20px_50px_rgba(0,0,0,0.4)]';
  };

  // Badge glow shadow
  const getBadgeGlow = () => {
    if (borderColor.includes('cyan')) return 'shadow-[0_0_20px_rgba(34,211,238,0.5)]';
    if (borderColor.includes('amber')) return 'shadow-[0_0_20px_rgba(251,191,36,0.5)]';
    if (borderColor.includes('fuchsia')) return 'shadow-[0_0_20px_rgba(232,121,249,0.5)]';
    if (borderColor.includes('purple')) return 'shadow-[0_0_20px_rgba(192,132,252,0.5)]';
    if (borderColor.includes('lime')) return 'shadow-[0_0_20px_rgba(163,230,53,0.5)]';
    if (borderColor.includes('emerald')) return 'shadow-[0_0_20px_rgba(52,211,153,0.5)]';
    return 'shadow-[0_0_20px_rgba(34,211,238,0.5)]';
  };

  return (
    <div className={`relative group ${className} ${height} mt-6`}>
      {/* Floating Title Badge - Centered ON TOP of card */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
        <div className={`bg-gradient-to-r ${getGradient()} px-3 py-1.5 rounded-lg transform -rotate-1 ${getBadgeGlow()} border border-white/50 group-hover:rotate-0 transition-transform`}>
          <h4 className="font-chrome text-xs md:text-sm text-white uppercase tracking-wide whitespace-nowrap">
            {label}
          </h4>
        </div>
      </div>

      {/* Card Body with Ring Accent - Vibrant Colors */}
      <div className={`
        relative rounded-[2rem] ${bgColor} ring-4 ${getRingColor()} overflow-hidden 
        ${getGlowShadow()} h-full
        transition-all duration-300 hover:ring-opacity-80
      `}>
        {/* Content */}
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

// === WIDGETS ===

const SpeedWidget = () => {
  const [speed, setSpeed] = useState(831);
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prev => Math.min(999, Math.max(800, prev + (Math.floor(Math.random() * 5) - 2))));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Calculate fill percentage (800-999 range mapped to 0-100%)
  const fillPercent = ((speed - 800) / 199) * 100;
  const segments = 12;
  const filledSegments = Math.round((fillPercent / 100) * segments);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full pt-4">
      <div className="flex items-baseline gap-1 relative">
        <span className="font-chrome text-5xl md:text-7xl text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] tabular-nums tracking-tighter">
          {speed}
        </span>
        <span className="font-sans font-bold text-sm text-amber-200 uppercase mt-2">MPH</span>
      </div>

      {/* Segmented Speed Bar */}
      <div className="flex gap-1 mt-3">
        {[...Array(segments)].map((_, i) => (
          <div
            key={i}
            className={`w-2 md:w-3 h-4 md:h-5 rounded-sm transition-all duration-100 ${i < filledSegments
              ? i < 4 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]'
                : i < 8 ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                  : 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse'
              : 'bg-slate-700'
              }`}
            style={{
              transform: i < filledSegments ? 'scaleY(1.1)' : 'scaleY(1)',
              opacity: i < filledSegments ? 1 : 0.4
            }}
          />
        ))}
      </div>
    </div>
  );
};

const TeethCollectionWidget = () => {
  const [count, setCount] = useState(1003469);

  useEffect(() => {
    // Gradual increment: add 1-5 teeth every 3 seconds for visible activity
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // SCROLLING ANIMATION for teeth
  const houses = [...Array(4)].map((_, i) => (
    <div key={i} className="w-[25%] shrink-0 flex items-center justify-center h-full">
      <span className="text-4xl md:text-5xl leading-tight drop-shadow-[0_0_10px_rgba(232,121,249,0.5)] filter grayscale-[0.2] transform group-hover:scale-110 transition-transform duration-300 select-none">🦷</span>
    </div>
  ));

  return (
    <div className="flex flex-col items-center justify-between h-full w-full relative overflow-hidden pt-2 pb-2">
      {/* Scrolling Teeth - Centered Vertically */}
      <div className="w-full h-24 overflow-hidden relative flex-1 flex items-center">
        <div className="flex animate-marquee w-[200%] absolute left-0 flex items-center">
          <div className="flex w-[50%]">
            {houses}
          </div>
          <div className="flex w-[50%]">
            {houses}
          </div>
        </div>
        {/* Fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0b2e] via-transparent to-[#1a0b2e] pointer-events-none" />
      </div>

      {/* Pill Badge at Bottom - Matched to SignalWidget size */}
      <div className="bg-fuchsia-900/90 px-3 py-1 rounded-full border border-fuchsia-400/50 backdrop-blur-sm shadow-lg mb-1 relative z-10">
        <span className="text-[10px] text-fuchsia-200 font-sans font-bold uppercase tracking-widest flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const SignalWidget = () => (
  <div className="w-full h-full flex flex-col items-center justify-center pt-2 relative">
    {/* FULL WIDTH FULL LENGTH BARS - LIME/GREEN THEME */}
    <div className="flex items-end justify-center w-full h-full gap-[2px] px-1 pb-0">
      {[...Array(16)].map((_, i) => {
        const height = 30 + Math.random() * 70;
        return (
          <div
            key={i}
            className="flex-1 bg-lime-400/80 rounded-t-sm shadow-[0_0_4px_rgba(163,230,53,0.4)]"
            style={{
              height: `${height}%`,
              opacity: i % 2 === 0 ? 0.9 : 0.6,
              animation: `pulse ${0.3 + Math.random()}s infinite alternate`
            }}
          />
        );
      })}
    </div>
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-900/90 px-3 py-1 rounded-full border border-lime-400/50 backdrop-blur-sm z-10 shadow-lg whitespace-nowrap">
      <span className="text-[10px] text-lime-200 font-sans font-black uppercase tracking-widest flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" /> CONNECTED
      </span>
    </div>
  </div>
);

const RadarWidget = () => {
  const [blipPos, setBlipPos] = useState({ top: 25, left: 70 });

  useEffect(() => {
    const moveBlip = () => {
      // Random position within the radar area (10-90% range)
      setBlipPos({
        top: 10 + Math.random() * 80,
        left: 10 + Math.random() * 80
      });
    };

    // Move blip at random intervals between 2-5 seconds
    const scheduleMove = () => {
      const delay = 2000 + Math.random() * 3000;
      return setTimeout(() => {
        moveBlip();
        scheduleMove();
      }, delay);
    };

    const timeout = scheduleMove();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Concentric Ellipses - Full Container */}
      <div className="absolute inset-2 border border-cyan-500/20 rounded-[50%]" />
      <div className="absolute inset-6 border border-cyan-500/15 rounded-[50%]" />
      <div className="absolute inset-10 border border-cyan-500/10 rounded-[50%]" />

      {/* Center Dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#22d3ee]" />

      {/* Crosshairs */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/20" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/20" />

      {/* Sweep - Larger, covers full area */}
      <div
        className="absolute top-1/2 left-1/2 w-1/2 h-1 origin-left animate-[spin_3s_linear_infinite]"
        style={{
          background: 'linear-gradient(90deg, rgba(34,211,238,0.8) 0%, rgba(34,211,238,0.3) 50%, transparent 100%)',
          boxShadow: '0 0 20px rgba(34,211,238,0.5)'
        }}
      />

      {/* Moving Turquoise Blip - REPLACED WITH FAIRY MAP ICON (Scaled down to 32px) */}
      <div
        className="absolute transition-all duration-1000 ease-in-out z-20"
        style={{
          top: `${blipPos.top}%`,
          left: `${blipPos.left}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div style={{ position: 'relative', width: '32px', height: '32px' }}>
          {/* Glow */}
          <div style={{ position: 'absolute', inset: '-4px', background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 70%)', animation: 'pulse 2s ease-in-out infinite' }} />
          {/* Main Circle with Border & Image */}
          <div style={{ position: 'absolute', inset: '0', width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #22d3ee', boxShadow: '0 0 15px #22d3ee, inset 0 0 10px rgba(34,211,238,0.5)', overflow: 'hidden', background: '#0f172a' }}>
            <img src="/PFP FULL SIZE KIKI 1.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Fairy" />
          </div>
          {/* Twinkle Dot */}
          <div style={{ position: 'absolute', top: '-1px', right: '3px', width: '3px', height: '3px', background: '#ffffff', borderRadius: '50%', boxShadow: '0 0 8px #ffffff', animation: 'twinkle 1.5s infinite' }} />
        </div>
      </div>

      {/* Corner Tech Details */}
      <div className="absolute top-2 left-2 text-[8px] font-sans font-bold text-cyan-500/50">SCAN ACTIVE</div>
      <div className="absolute bottom-2 right-2 text-[8px] font-sans font-bold text-cyan-500/50">360°</div>
    </div>
  );
};

// Component to fix map sizing issues and enforce view
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map, center, zoom]);
  return null;
};

// Major Land Locations to prevent Ocean Landings
const LAND_LOCATIONS: [number, number][] = [
  [51.5074, -0.1278],   // London
  [40.7128, -74.0060],  // New York
  [35.6762, 139.6503],  // Tokyo
  [-33.8688, 151.2093], // Sydney
  [48.8566, 2.3522],    // Paris
  [30.0444, 31.2357],   // Cairo
  [-22.9068, -43.1729], // Rio
  [55.7558, 37.6173],   // Moscow
  [39.9042, 116.4074],  // Beijing
  [34.0522, -118.2437], // Los Angeles
  [25.2048, 55.2708],   // Dubai
  [1.3521, 103.8198],   // Singapore
  [-33.9249, 18.4241],  // Cape Town
  [19.0760, 72.8777],   // Mumbai
  [19.4326, -99.1332],  // Mexico City
  [49.2827, -123.1207], // Vancouver
  [41.0082, 28.9784],   // Istanbul
  [13.7563, 100.5018],  // Bangkok
  [37.5665, 126.9780],  // Seoul
  [40.4168, -3.7038],   // Madrid
  [-1.2921, 36.8219],   // Nairobi
  [-34.6037, -58.3816], // Buenos Aires
  [64.1466, -21.9426],  // Reykjavik
  [31.2304, 121.4737],  // Shanghai
  [28.6139, 77.2090]    // New Delhi
];

// Helper function to calculate distance between two coordinates
const getDistance = (pos1: [number, number], pos2: [number, number]): number => {
  const latDiff = Math.abs(pos1[0] - pos2[0]);
  const lngDiff = Math.abs(pos1[1] - pos2[1]);
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
};

// Minimum distance threshold (approximately 30 degrees - ensures visually distinct jumps)
const MIN_DISTANCE = 30;

// Get a random location that's far enough from the current position
const getDistantLocation = (currentPos: [number, number]): [number, number] => {
  let attempts = 0;
  let newLoc: [number, number];

  do {
    newLoc = LAND_LOCATIONS[Math.floor(Math.random() * LAND_LOCATIONS.length)];
    attempts++;
    // After 10 attempts, just accept whatever we get to avoid infinite loop
  } while (getDistance(currentPos, newLoc) < MIN_DISTANCE && attempts < 10);

  return newLoc;
};

const LiveMapWidget = () => {
  // === STATE ===
  const [fairyPos, setFairyPos] = useState<[number, number]>([51.5074, -0.1278]); // Start London
  const [flightPath, setFlightPath] = useState<[number, number][]>([[51.5074, -0.1278]]);

  const [mapView, setMapView] = useState<{ center: [number, number], zoom: number }>({
    center: [42, -40],
    zoom: 1.0
  });

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      setMapView({
        center: [35, 10], // Unified center for both
        zoom: isDesktop ? 2.0 : 1.3
      });
    };

    handleResize(); // Set initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === MOVEMENT LOGIC ===
  useEffect(() => {
    const moveFairy = () => {
      // 1. Get current position
      const currentLoc = fairyPos;

      // 2. Find a new valid location (Land only, far enough away)
      const nextLoc = getDistantLocation(currentLoc);

      // 3. Update Position (CSS handles the smooth slide)
      setFairyPos(nextLoc);

      // 4. Update Trail (Keep last 4 points for ~3 segments)
      setFlightPath(prev => {
        const newPath = [...prev, nextLoc];
        return newPath.slice(-4); // Keep only last 4
      });
    };

    // Move immediately on mount? No, let's wait a bit.
    // actually, let's do an initial move after a short delay, then interval
    const initialTimeout = setTimeout(moveFairy, 1000);

    // Then move every 5 seconds (matches the 5s CSS transition)
    const interval = setInterval(moveFairy, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []); // Empty dependency array - logic is self-contained or uses refs if needed (but here state updates are functional)

  // Custom Fairy Icon
  // Custom Fairy Icon (Friendly Tech)
  const fairyIcon = L.divIcon({
    className: 'custom-fairy-icon',
    html: `<div style="position: relative; width: 48px; height: 48px;">
              <!-- Soft Glow Pulse -->
              <div style="position: absolute; inset: -4px; background: rgba(34,211,238,0.4); border-radius: 50%; filter: blur(4px); animation: pulse 2s ease-in-out infinite;"></div>
              
              <!-- Main Circle -->
              <div style="position: relative; width: 100%; height: 100%; border-radius: 50%; border: 2px solid #fff; overflow: hidden; box-shadow: 0 0 15px #22d3ee, inset 0 0 10px rgba(34,211,238,0.5); background: #0f172a; z-index: 10;">
                <img src="/PFP FULL SIZE KIKI 1.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Fairy" />
              </div>
            </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
  });

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 rounded-2xl group z-0">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fairy-path {
          stroke-dasharray: 10;
          animation: dash 30s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
            stroke-dashoffset: -1000;
          }
        }
      `}</style>

      <MapContainer
        center={mapView.center}
        zoom={mapView.zoom}
        zoomSnap={0.1}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        touchZoom={false}
        style={{ height: '100%', width: '100%', background: '#020617' }}
        zoomControl={false}
        attributionControl={false}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <MapUpdater center={mapView.center} zoom={mapView.zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          className="map-tiles"
          noWrap={true}
          style={{ filter: 'grayscale(100%) invert(100%) sepia(100%) saturate(400%) hue-rotate(130deg) brightness(1.2) contrast(1.1) drop-shadow(0 0 10px rgba(34,211,238,0.3))' }}
        />

        {/* NEON FAIRY TRAIL - Single line relying on CSS for glow/pulse */}
        <Polyline
          positions={flightPath}
          pathOptions={{
            color: '#22d3ee', // Cyan
            weight: 2,        // Base weight, animated by CSS
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round',
            className: 'fairy-path' // Uses the global CSS for glow & pulse
          }}
        />

        {/* The Fairy Marker */}
        <Marker position={fairyPos} icon={fairyIcon}>
          <Popup>
            <div className="text-slate-900 font-bold text-center">
              Target Tracking<br />
              <span className="text-xs font-fastmode">{fairyPos[0].toFixed(2)}, {fairyPos[1].toFixed(2)}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Grid overlay for tech feel */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-20"
        style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Minimal Overlay UI */}
      {/* Minimal Overlay UI - REMOVED COMPASS */}

      {/* Scan Line Overlay */}
      <div className="absolute left-0 right-0 h-[1px] bg-cyan-400/50 shadow-[0_0_8px_#22d3ee] z-[400] pointer-events-none" style={{ animation: 'scan-line 3s linear infinite' }} />

      {/* Vignette */}
      <div className="absolute inset-0 ring-1 ring-inset ring-cyan-500/20 rounded-2xl pointer-events-none z-[400] shadow-[inset_0_0_60px_rgba(2,6,23,0.8)]" />
    </div>
  );
};

const ToothTargetWidget = () => (
  <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-cyan-950/20">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

    {/* Target overlay corners to make it look technical */}
    <div className="absolute inset-2 pointer-events-none z-30">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/60 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/60 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500/60 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/60 rounded-br-lg" />
    </div>

    {/* Large Tooth */}
    <img
      src={IMG_TOOTH}
      className="w-[60%] h-[60%] object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.4)] relative z-10 animate-float mb-2"
      style={{ animationDuration: '6s' }}
      alt="Target Tooth"
    />

    {/* Scanning Laser */}
    <div className="absolute left-0 right-0 h-1.5 bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-scan z-20 opacity-80" />

    {/* Text Label */}
    <div className="absolute bottom-2 w-full text-center z-40">
      <span className="font-sans text-[10px] font-bold text-cyan-200 tracking-wider uppercase drop-shadow-md">Savannah's Tooth</span>
    </div>
  </div>
);

const FairyIDCard = () => (
  <div className="w-full h-full bg-[#020617] relative flex flex-col overflow-hidden">
    {/* Image Area */}
    <div className="flex-1 relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=400&auto=format&fit=crop"
        className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
        alt="Fairy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />

      {/* Face Frame */}
      <div className="absolute top-[10%] left-[15%] right-[15%] bottom-[20%] border border-cyan-400/30 rounded-lg">
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
      </div>
    </div>

    {/* Text Area */}
    <div className="h-8 md:h-10 flex flex-col items-center justify-center bg-[#020617] border-t border-cyan-900">
      <h3 className="font-sans font-bold text-sm md:text-lg text-white tracking-wider">KIKI</h3>
      <div className="text-[7px] text-cyan-500 font-sans font-bold tracking-[0.3em] uppercase">ID: 07-ALPHA</div>
    </div>
  </div>
);


// REFACTORED PHASE DIVIDER
const FunPhaseDivider = ({
  phase,
  title,
  warning,
  icon: Icon,
  color,
  badgeText,
  className = "my-6 mdummy-10"
}: {
  phase: string,
  title: string,
  warning?: string,
  icon: any,
  color: string,
  badgeText?: string,
  className?: string
}) => (
  <div className={`relative py-4 md:py-6 group ${className}`}>
    {/* Abstract Background Strip */}
    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-24 md:h-32 bg-[#020617]/90 skew-x-[-20deg] border-y border-cyan-500/20 blur-[1px] shadow-[0_0_30px_rgba(0,0,0,0.8)]" />

    <div className="relative flex flex-col items-center justify-center z-10 px-4 text-center">

      {/* ROW 1: PHASE BADGE - Only show if phase is not empty */}
      {phase && (
        <div className="flex items-center gap-2 mb-1">
          <div className="px-3 py-1 bg-slate-800 border border-cyan-500/50 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <span className="font-sans text-xs md:text-sm text-cyan-300 font-bold tracking-[0.2em] uppercase">
              {phase}
            </span>
          </div>
        </div>
      )}

      {/* ROW 2: MAIN TITLE */}
      <h2 className="font-chrome text-5xl md:text-7xl text-white uppercase tracking-normal leading-normal drop-shadow-[0_4px_0_rgba(0,0,0,1)] scale-y-110 py-2 md:py-4 whitespace-nowrap">
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-100 pb-1 inline-block">
          {title}
        </span>
      </h2>

      {/* ROW 3: OVERLAPPING WARNING CALLOUT */}
      {warning && (
        <div className="relative z-20 -mt-6 md:-mt-8 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
          <div className="inline-flex items-center justify-center px-4 py-1 bg-fuchsia-600 text-white border-2 border-fuchsia-400 shadow-[0_4px_20px_rgba(232,121,249,0.5)] rounded-lg">
            <span className="font-sans font-bold text-xs sm:text-sm md:text-base tracking-tight sm:tracking-wide uppercase drop-shadow-md whitespace-nowrap text-center">
              {warning}
            </span>
          </div>
        </div>
      )}

      {/* Optional Status Badge - Attached to Warning */}
      {badgeText && (
        <div className="mt-2 inline-block px-3 py-0.5 bg-yellow-400 text-black font-mono text-[10px] md:text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_10px_rgba(250,204,21,0.6)] rounded-sm transform -skew-x-12">
                   // Status: {badgeText}
        </div>
      )}
    </div>
  </div>
);


// === HEADER CARDS ===

const HudGauge = ({ icon: Icon, label, value, color, delay }: any) => (
  <div className="flex flex-col items-center gap-2 group">
    <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
      {/* Outer Static Ring */}
      <div className={`absolute inset-0 rounded-full border border-white/10 ${color.replace('text-', 'border-')}/30`} />

      {/* Rotating Dashed Ring */}
      <div
        className={`absolute inset-1 rounded-full border border-dashed border-white/20 animate-spin-slow`}
        style={{ animationDuration: '10s', animationDelay: delay }}
      />

      {/* Inner Glow */}
      <div className={`absolute inset-0 rounded-full ${color.replace('text-', 'bg-')}/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity`} />

      {/* Icon */}
      <Icon size={20} className={`${color} drop-shadow-[0_0_8px_currentColor]`} />
    </div>

    <div className="text-center">
      <div className={`font-sans font-bold text-[9px] uppercase tracking-widest ${color} opacity-80`}>{label}</div>
      <div className="font-sans font-bold text-xs text-white tracking-wide mt-0.5">{value}</div>
    </div>
  </div>
);


const MissionHeaderCard = ({ isComplete = false, userName = 'Your Child' }: { isComplete?: boolean; userName?: string }) => (
  <div className="relative w-full flex flex-col items-center justify-center mb-10 pt-8 pb-4">

    {/* === PERSONALIZED HEADER === */}
    <div className="w-full flex justify-between items-center px-2 md:px-6 mb-8">
      {/* Left: Date */}
      <div className="flex items-center gap-2">
        <span className="text-xs md:text-sm font-sans text-white/50 tracking-wide">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Right: Pickup */}
      <div className="flex items-center gap-2">
        <span className="text-xs md:text-sm font-sans font-medium text-white/80 tracking-wide">Pickup: {userName}'s Tooth</span>
      </div>
    </div>

    {/* === MAIN TARGET DISPLAY === */}
    <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl mx-auto">

      {/* Unified Journey + Name Block - Hero Headline Style */}
      <div className="relative flex flex-col items-center">

        {/* "Journey to" - Smaller label */}
        <span className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase leading-none tracking-normal text-center mb-0">
          Journey to
        </span>

        {/* User Name - Main name with scan line */}
        <div className="relative -mt-1 md:-mt-3">
          <span className="font-chrome text-white text-7xl sm:text-8xl md:text-[9rem] tracking-wide uppercase"
            style={{
              textShadow: '0 0 40px rgba(34,211,238,0.8), 0 0 80px rgba(34,211,238,0.4), 0 4px 0 rgba(0,0,0,0.5)'
            }}>
            {userName.toUpperCase()}
          </span>

          {/* Scan Line Animation - Only on name */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_#fff] animate-scan pointer-events-none z-20" />
        </div>

        {/* Glow layer behind text */}
        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-500/40 via-fuchsia-500/30 to-amber-500/40 scale-150 animate-pulse -z-10" />
      </div>

      {/* === MISSION UPDATES - Subtle Box === */}
      <div className="relative mt-6 w-full max-w-2xl mx-auto px-4 z-20">

        {/* Floating Badge - Centered Hanging Over Top - Dynamic text */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <div className={`px-4 h-7 rounded-lg shadow-lg border-2 border-white/50 flex items-center ${isComplete ? 'bg-gradient-to-r from-lime-400 to-green-500' : 'bg-gradient-to-r from-fuchsia-400 to-pink-500'}`}>
            <span className="font-chrome text-xs text-white uppercase tracking-wide leading-none">
              {isComplete ? 'Journey Complete' : 'Journey Underway'}
            </span>
          </div>
          {/* 3 New Updates - Overlapping the badge above */}
          <div className="bg-amber-400 px-3 h-5 rounded-full shadow-lg border border-white/40 flex items-center -mt-1 transform rotate-2">
            <span className="text-[9px] font-bold text-black leading-none">3 New Updates</span>
          </div>
        </div>

        {/* Subtle Box Container - Extra top padding for badges */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 px-6 py-3 pt-10">

          {/* Timeline Row */}
          <div className="relative h-10">

            {/* Track - Rainbow gradient with glow */}
            <div className="absolute inset-x-0 top-2 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${isComplete ? 'w-full' : 'w-1/2'} bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)] ${isComplete ? '' : 'animate-pulse'} transition-all duration-1000`} />
            </div>

            {/* Kiki marker - moves to end when complete */}
            <div className={`absolute ${isComplete ? 'right-0 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} top-2 -translate-y-1/2 z-10 transition-all duration-1000`}>
              <div className="w-9 h-9 rounded-full border-3 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.7),0_0_30px_rgba(34,211,238,0.3)] overflow-hidden bg-slate-900 ring-2 ring-white/30">
                <img src="/PFP FULL SIZE KIKI 1.png" className="w-full h-full object-cover object-top" alt="Kiki" />
              </div>
            </div>

            {/* Labels - Directly below the track, left and right aligned */}
            <div className="absolute inset-x-0 top-8 flex justify-between items-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Lift Off</span>
              <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${isComplete ? 'text-lime-400' : 'text-slate-500'}`}>Picked Up</span>
            </div>

          </div>

        </div>

      </div>


    </div>

  </div>
);

// === REDESIGNED START MISSION CARD (FINAL FIXED LAYOUT) ===
const StartMissionCard = ({ onClick, isMorning = false, userName = 'Your Child' }: { onClick?: () => void; isMorning?: boolean; userName?: string }) => (
  <div onClick={onClick} className="relative w-full max-w-7xl mx-auto group cursor-pointer mb-48 mt-8 md:mb-32 md:mt-12">

    {/* Glow behind main card */}
    <div className="absolute top-10 bottom-10 left-10 right-10 bg-cyan-500/20 blur-[80px] rounded-full" />

    {/* Main Card Container - Reduced Padding for Mobile + Space for Hanging Card */}
    {/* Main Card Container - Reduced Padding for Mobile + Space for Hanging Card */}
    <div className="relative bg-[#020617] rounded-[2rem] md:rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-1 md:gap-8 overflow-visible px-4 py-3 pb-[220px] md:px-12 md:py-6 md:pb-6">

      {/* Background Texture inside card */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      </div>

      {/* LEFT CONTENT */}
      <div className="flex-col items-center md:items-start text-center md:text-left z-10 flex relative py-0 w-full md:w-auto space-y-0">

        {/* 1. Badge - Centered on Mobile */}
        <div className="w-full flex justify-center md:w-auto md:inline-flex mb-3">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-lg group-hover:border-slate-500 transition-colors">
            <span className="font-sans text-[10px] md:text-xs text-cyan-400 font-bold tracking-widest uppercase">
              For {userName} Only
            </span>
          </div>
        </div>

        {/* 2. Title - Compact on Mobile */}
        <h2 className="font-chrome-oblique text-5xl sm:text-6xl md:text-7xl text-white uppercase tracking-normal leading-[0.9] drop-shadow-2xl text-center md:text-left w-full md:w-auto mb-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-cyan-500 pt-1 pb-3 md:pb-8 md:pr-4 inline-block leading-[0.85] md:leading-[0.9]">
            {isMorning ? <>FAIRY VISIT<br />COMPLETE</> : <>MAGIC<br />UNDERWAY</>}
          </span>
        </h2>

        {/* 3. Button - Landing Page Style */}
        <div className="w-full flex justify-center md:inline-block relative z-30 mb-8 md:mb-0">
          <button className="relative group/btn overflow-hidden bg-[#a3e635] hover:bg-[#bef264] text-black px-10 py-5 rounded-xl font-sans font-extrabold text-lg uppercase tracking-tight shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-[#4d7c0f] active:border-b-0 flex items-center justify-center gap-2 whitespace-nowrap">
            <span className="relative z-10">{isMorning ? 'See What the Fairy Did' : 'See my Fairy Updates'}</span>
            <ChevronsRight size={22} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* RIGHT IMAGE - ID CARD POP OUT (MATCH UpdateCard Layout) */}
      <div className={`
        z-20 perspective-1000 shrink-0 
        
        /* Mobile: Absolute Hanging Position */
        absolute bottom-[-60px] left-1/2 -translate-x-1/2
        w-[90%] sm:w-[320px] 
        transform scale-100 origin-top

        /* Desktop: Relative Side Position */
        md:static md:w-[600px] md:mt-0 md:-my-32 md:-mr-4
        md:scale-100 md:rotate-2 md:group-hover:rotate-0 md:group-hover:scale-105 md:-translate-y-6 md:translate-x-0
        
        transition-all duration-500 hover:z-30
      `}>

        {/* RAINBOW BORDER CONTAINER - Refactored for visible corners */}
        <div className="relative p-[3px] rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-cyan-500 to-fuchsia-500 animate-gradient-move shadow-2xl overflow-hidden" style={{ backgroundSize: '400% 400%' }}>

          {/* Glow Layer (Behind) */}
          <div className="absolute inset-0 blur-xl bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-cyan-500 to-fuchsia-500 opacity-60 animate-gradient-move -z-10" style={{ backgroundSize: '400% 400%' }} />

          {/* Badge Body - Inner Content */}
          <div className="w-full h-[250px] md:h-[450px] bg-slate-900 rounded-[1.8rem] md:rounded-[2.3rem] relative overflow-hidden group/card z-10">
            {/* Full Image Background - Fixed Object Fit */}
            <img src="/Fairy%20photo%20booth%20pic.webp" className="absolute inset-0 w-full h-full object-cover object-center opacity-90 transition-transform duration-700 group-hover/card:scale-110" alt="ID Photo" />

            {/* Gradient Overlay for Text Visibility - Stronger at corners */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/60 via-transparent to-[#020617]/60" />

            {/* Content Area: Pill + Name Stacked */}
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-10 z-10 flex flex-col items-start gap-0.5 md:gap-3">

              {/* 1. Purple Pill - SMALLER & COMPACT */}
              <div className="inline-block px-2 py-0.5 bg-fuchsia-900/90 backdrop-blur-md rounded-t-lg rounded-br-lg border-t border-l border-r border-fuchsia-500/50 shadow-[0_0_15px_rgba(232,121,249,0.3)]">
                <span className="font-sans text-fuchsia-100 tracking-[0.05em] text-[7px] md:text-xs uppercase font-bold flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-fuchsia-400 animate-pulse" />
                  Your Tooth Fairy
                </span>
              </div>

              {/* 2. Name */}
              <h2 className="font-chrome text-5xl md:text-6xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-none">
                KIKI
              </h2>
            </div>

            {/* Stats Bar - Vertical */}
            {/* Stats Bar - Vertical */}
            <div className="absolute top-4 bottom-4 right-4 md:top-6 md:bottom-6 md:right-6 w-24 md:w-32 bg-black/60 backdrop-blur-md rounded-2xl p-2 border border-white/10 flex flex-col justify-evenly items-center shadow-xl">
              <div className="text-center">
                <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Height</div>
                <div className="font-sans font-bold text-base md:text-xl text-white">8"</div>
              </div>
              <div className="w-3/4 h-px bg-white/10" />
              <div className="text-center">
                <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Wing Span</div>
                <div className="font-sans font-bold text-base md:text-xl text-white">9"</div>
              </div>
              <div className="w-3/4 h-px bg-white/10" />
              <div className="text-center">
                <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Top Speed</div>
                <div className="font-sans font-bold text-base md:text-xl text-white leading-none">2000</div>
                <div className="text-[8px] text-slate-500 font-bold text-center mt-0.5">MPH</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

);


// === RECENTLY COLLECTED WIDGET ===
const RECENT_COLLECTIONS = [
  { name: "Sophia", location: "London, UK", time: "2m ago" },
  { name: "Liam", location: "New York, USA", time: "5m ago" },
  { name: "Yuki", location: "Tokyo, JP", time: "12m ago" },
  { name: "Mateo", location: "Madrid, ES", time: "18m ago" },
  { name: "Chloe", location: "Paris, FR", time: "24m ago" },
  { name: "Noah", location: "Toronto, CA", time: "31m ago" },
  { name: "Zara", location: "Dubai, UAE", time: "45m ago" },
];

const RecentlyCollectedWidget = () => {
  // Card color palette matching NewLandingPage reviews
  const cardColors = [
    { bg: 'bg-gradient-to-br from-cyan-500 to-blue-600', glow: 'shadow-[0_0_40px_rgba(34,211,238,0.3)]' },
    { bg: 'bg-gradient-to-br from-fuchsia-500 to-pink-600', glow: 'shadow-[0_0_40px_rgba(232,121,249,0.3)]' },
    { bg: 'bg-gradient-to-br from-amber-400 to-orange-500', glow: 'shadow-[0_0_40px_rgba(251,191,36,0.3)]' },
    { bg: 'bg-gradient-to-br from-lime-400 to-green-500', glow: 'shadow-[0_0_40px_rgba(163,230,53,0.3)]' },
    { bg: 'bg-gradient-to-br from-violet-500 to-purple-600', glow: 'shadow-[0_0_40px_rgba(139,92,246,0.3)]' },
    { bg: 'bg-gradient-to-br from-rose-400 to-red-500', glow: 'shadow-[0_0_40px_rgba(251,113,133,0.3)]' },
    { bg: 'bg-gradient-to-br from-teal-400 to-cyan-500', glow: 'shadow-[0_0_40px_rgba(45,212,191,0.3)]' },
  ];

  return (
    <div className="w-full mt-16 mb-12 overflow-hidden relative">
      <FunPhaseDivider
        phase=""
        title="TOOTH PICKUPS"
        warning="Real-time Data"
        icon={Activity}
        color="text-cyan-400"
      />

      {/* Marquee Container with Fade Edges */}
      <div className="relative w-full overflow-visible py-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" style={{ animationDuration: '40s' }}>
          {/* Triple list for seamless loop on wide screens */}
          {[...RECENT_COLLECTIONS, ...RECENT_COLLECTIONS, ...RECENT_COLLECTIONS].map((item, i) => {
            const colorIndex = i % cardColors.length;
            const colors = cardColors[colorIndex];
            return (
              <div key={i} className="mx-3 md:mx-4">
                {/* Square card with clean border */}
                <div className={`${colors.bg} ${colors.glow} rounded-2xl border-4 border-white/50 transition-all duration-300 hover:scale-105`}>
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex flex-col items-center justify-center p-4 overflow-hidden">
                    {/* Shine overlay */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-xl" />

                    {/* Tooth icon */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 border-3 border-white/50 flex items-center justify-center shadow-lg mb-2">
                      <span className="text-2xl md:text-3xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">🦷</span>
                    </div>

                    {/* Text */}
                    <div className="text-center relative z-10">
                      <div className="text-white font-chrome text-sm md:text-base tracking-wide drop-shadow-md">{item.name}</div>
                      <div className="text-white/80 font-sans text-[10px] md:text-xs uppercase tracking-wider truncate flex items-center justify-center gap-1">
                        <MapPin size={8} className="text-white/70" />
                        {item.location}
                      </div>
                    </div>

                    {/* Time Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="text-[8px] md:text-[10px] text-white font-bold bg-black/20 px-1.5 py-0.5 rounded-full backdrop-blur-sm">{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


// === MAIN APP ===

function Tracker() {
  const { token } = useParams<{ token: string }>();
  const [currentStage, setCurrentStage] = useState(2);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cmsStageContent, setCmsStageContent] = useState<CMSStageContent[]>([]);
  
  // Night/Morning unlock system
  // true = Night mode (morning locked), false = Morning mode (morning unlocked)
  const [isNextBatchAvailable, setIsNextBatchAvailable] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(6 * 60 * 60); // 6 hours in seconds

  const morningRef = useRef<HTMLDivElement>(null);

  // Timer-based auto-unlock (6 hours)
  useEffect(() => {
    // Don't run timer if already unlocked
    if (!isNextBatchAvailable) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsNextBatchAvailable(false); // AUTO-UNLOCK after 6 hours
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isNextBatchAvailable]);

  // Format time remaining as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchTrackerData = async () => {
      if (!token) {
        setUserName('Your Child');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tracker/${token}`);
        if (response.ok) {
          const data = await response.json();
          setUserName(data.userName || 'Your Child');
        } else {
          setUserName('Your Child');
        }
      } catch (error) {
        console.error('Failed to fetch tracker data:', error);
        setUserName('Your Child');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackerData();
  }, [token]);

  // Fetch CMS stage content
  useEffect(() => {
    const fetchStageContent = async () => {
      try {
        const response = await fetch('/api/stage-content');
        if (response.ok) {
          const data = await response.json();
          setCmsStageContent(data);
        }
      } catch (error) {
        console.error('Failed to fetch stage content:', error);
      }
    };
    fetchStageContent();
  }, []);

  // Listen for postMessage from landing page to scroll to sections
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.scrollTo) {
        const element = document.getElementById(event.data.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleUnlock = (stage: Stage) => {
    // ALLOW ALL CLICKS - "NO MORE LOCKS"
    // Flip card handles the reveal now - no modal needed
    setCurrentStage(stage.id);
    setSelectedStage(stage);
  };

  // Manual parent unlock - bypasses 6-hour wait
  const unlockNextBatch = () => {
    setIsNextBatchAvailable(false);
    setTimeRemaining(0);
    setTimeout(() => {
      morningRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Helper to capitalize first letter of name
  const formatName = (name: string) => {
    if (!name) return 'Your Child';
    // If name is all caps, return as-is
    if (name === name.toUpperCase()) return name;
    // Otherwise capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Replace [Name] placeholder in message text
  const replaceNamePlaceholder = (text: string | null | undefined) => {
    if (!text) return text;
    const formattedName = formatName(userName || 'Your Child');
    return text.replace(/\[Name\]/gi, formattedName);
  };

  // Merge CMS content with default stages
  const mergedStages = STAGES.map(stage => {
    const cmsContent = cmsStageContent.find(c => c.id === stage.id)?.content;
    if (!cmsContent) return stage;
    
    const rawMessage = cmsContent.messageText || stage.message;
    
    return {
      ...stage,
      title: cmsContent.title || stage.title,
      cardImage: cmsContent.frontImageUrl || stage.cardImage,
      location: cmsContent.locationText || stage.location,
      subtext: cmsContent.statusText || stage.subtext,
      message: replaceNamePlaceholder(rawMessage),
      videoThumbnail: cmsContent.imageUrl || stage.videoThumbnail,
      videoUrl: cmsContent.videoUrl || null,
      selfieImage: cmsContent.selfieImageUrl || stage.selfieImage,
    };
  });

  const nightStages = mergedStages.slice(0, 3);
  const morningStages = mergedStages.slice(3, 6);

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-cyan-500/30 pb-20 overflow-x-hidden">


      {/* Fixed Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#02040a_100%)]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0, 176, 192, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 176, 192, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4 md:py-8 max-w-5xl">

        {/* 1. HEADER SECTION */}
        <MissionHeaderCard isComplete={!isNextBatchAvailable} userName={userName} />

        {/* 2. ISOLATED START CARD */}
        <StartMissionCard onClick={unlockNextBatch} isMorning={!isNextBatchAvailable} userName={userName} />

        {/* 3. TITLE ROW */}
        <div className="relative mb-8 md:mb-12">
          <FunPhaseDivider
            phase=""
            title="FLIGHT CENTER"
            icon={Activity}
            color="text-cyan-400"
            className="mb-0"
          />

          {/* Overlapping Purple Card */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 transform rotate-2">
            <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-2 rounded-xl border border-white/30 shadow-xl backdrop-blur-sm">
              <p className="font-sans font-black text-sm md:text-base text-white uppercase tracking-widest whitespace-nowrap">
                Track the Fairy
              </p>
            </div>
          </div>
        </div>

        {/* 4. DASHBOARD LAYOUT */}
        <div className="relative flex flex-col gap-4 md:gap-6 mb-12">
          {/* Ambient Glow Orbs - Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/8 rounded-full blur-[150px]" />
          </div>

          {/* PRIMARY DISPLAY: LIVE MAP (Full Width) */}
          <div id="tracker-map" className="w-full h-64 md:h-96">
            <NeonPanel label="Fairy Location" borderColor="border-cyan-500" bgColor="bg-slate-950" height="h-full">
              <LiveMapWidget />
            </NeonPanel>
          </div>

          {/* SECONDARY GRID: STATUS MODULES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[120px] md:auto-rows-[160px]">

            {/* Slot 1: Speed */}
            <div id="tracker-speed">
              <NeonPanel label="Speed" borderColor="border-amber-400" bgColor="bg-slate-900" height="h-full">
                <SpeedWidget />
              </NeonPanel>
            </div>

            {/* Slot 2: Teeth */}
            <NeonPanel label="Teeth Collected" borderColor="border-fuchsia-500" bgColor="bg-[#1a0b2e]" height="h-full">
              <TeethCollectionWidget />
            </NeonPanel>

            {/* Slot 3: Signal */}
            <NeonPanel label="Fairy Link" borderColor="border-lime-400" bgColor="bg-slate-900" height="h-full">
              <SignalWidget />
            </NeonPanel>

            {/* Slot 4: Radar */}
            <NeonPanel label="Radar" borderColor="border-cyan-400" bgColor="bg-slate-950" height="h-full">
              <RadarWidget />
            </NeonPanel>

          </div>
        </div>

        {/* 5. MISSION STAGES */}
        <div id="tracker-videos">
          <FunPhaseDivider
            phase="Phase 1"
            title="Night Flight"
            warning={`For ${userName} Only!`}
            icon={CustomMoonIcon}
            color="text-yellow-400"
            badgeText="ACTIVE"
          />

          <div className="grid grid-cols-1 gap-8 md:gap-12 mb-8 md:mb-12 px-1 md:px-2">
            {nightStages.map((stage, index) => (
              <div key={stage.id} id={`stage-${stage.id}`}>
                <StageCard
                  stage={stage}
                  isActive={stage.type === 'active'}
                  isLocked={stage.type === 'locked'}
                  isCompleted={stage.type === 'completed'}
                  onClick={() => handleUnlock(stage)}
                  index={index}
                  isLastStage={stage.id === 3}
                  onNext={() => {
                    const nextId = stage.id + 1;
                    const nextEl = document.getElementById(`stage-${nextId}`);
                    if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                />
              </div>
            ))}
          </div>

        </div>

        <div ref={morningRef} className={`relative transition-all duration-1000 ${isNextBatchAvailable ? 'opacity-50 grayscale' : 'opacity-100'}`}>

          {/* LOCK OVERLAY */}
          {isNextBatchAvailable && (
            <div className="absolute inset-x-0 top-32 z-50 flex justify-center">
              <div className="bg-black/90 backdrop-blur-md border border-fuchsia-500/30 px-8 py-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/50 flex items-center justify-center">
                    <Lock className="text-fuchsia-400" size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-chrome text-white uppercase tracking-widest text-lg">MORNING UPDATES LOCKED</div>
                    <div className="font-sans text-slate-400 text-sm">The fairy is still on her journey!</div>
                  </div>
                </div>
                
                {/* Countdown Timer */}
                <div className="flex flex-col items-center gap-1 py-3 px-6 bg-slate-900/80 rounded-xl border border-cyan-500/30">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Unlocks In</span>
                  <span className="font-mono text-3xl text-white tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                
                <button
                  onClick={unlockNextBatch}
                  className="mt-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-sans font-bold rounded-xl border border-slate-600 hover:border-slate-500 transition-all flex items-center gap-2"
                >
                  <Unlock size={16} /> Parent Unlock
                </button>
              </div>
            </div>
          )}


          <FunPhaseDivider
            phase="Phase 2"
            title="Morning Report"
            warning={`For ${userName} Only!`}
            icon={Sun}
            color="text-amber-400"
            badgeText={isNextBatchAvailable ? "LOCKED" : "UNLOCKED"}
          />

          <div className="grid grid-cols-1 gap-8 md:gap-12 px-1 md:px-2">
            {morningStages.map((stage, index) => (
              <div key={stage.id} id={`stage-${stage.id}`}>
                <StageCard
                  stage={stage}
                  isActive={stage.type === 'active'}
                  isLocked={isNextBatchAvailable}

                  isCompleted={stage.type === 'completed'}
                  onClick={() => handleUnlock(stage)}
                  index={index + 3}
                  isLastStage={stage.id === 6}
                  onNext={() => {
                    const nextId = stage.id + 1;
                    const nextEl = document.getElementById(`stage-${nextId}`);
                    if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                />
              </div>
            ))}
          </div>

        </div>

        {/* 6. RECENTLY COLLECTED FOOTER */}
        <RecentlyCollectedWidget />

        {/* 7. STANDARD FOOTER */}
        <Footer />

      </div>
    </div>
  );
}

export default Tracker;