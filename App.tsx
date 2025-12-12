import React, { useState, useEffect, useRef } from 'react';
import { 
  LucideIcon,
  Plane, Search, Home, Lock, 
  Play, Gift, Star, Moon, 
  MapPin, Video, Smile, Sparkles,
  Unlock, Wind, Zap, CheckCircle2,
  Activity, Crosshair, Signal, Gauge, ArrowUp,
  Cpu, Database, Shield, Sun, Radar, Scan, Backpack,
  MessageCircle, Wifi, Battery, Radio, ChevronsRight
} from 'lucide-react';
import { StageCard } from './components/StageCard';
import { MissionModal } from './components/MissionModal';

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
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.3"/>
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
const IMG_WIREFRAME_FACE = "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=600&auto=format&fit=crop";

const STAGES: Stage[] = [
  { id: 1, title: "LEAVING FAIRYLAND", type: "completed", icon: Plane, message: "I'm on my way! The stardust wind is strong tonight, but my wings are ready!", subtext: "DEP: 20:00", location: "Fairyland Gate", cardImage: IMG_NIGHT_SKY, videoThumbnail: IMG_NIGHT_SKY, selfieImage: IMG_SELFIE_1, objectImage: IMG_TOOTH },
  { id: 2, title: "ATMOSPHERE ENTRY", type: "active", icon: Wind, message: "Almost there! I can see your roof from way up here. It looks like a tiny Lego house!", subtext: "MACH 5", location: "Stratosphere", cardImage: IMG_CLOUDS, videoThumbnail: IMG_CLOUDS, selfieImage: IMG_SELFIE_2, objectImage: IMG_TOOTH },
  { id: 3, title: "SCANNING TARGET", type: "locked", icon: Search, message: "Found a signal! My glitter-radar is beeping like crazy near your pillow.", subtext: "SECTOR 7", location: "Bedroom Sector", cardImage: IMG_BEDROOM, videoThumbnail: IMG_BEDROOM, selfieImage: IMG_SELFIE_1, objectImage: IMG_TOOTH },
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
  return (
    <div className={`relative group ${className} ${height}`}>
       {/* Main Container */}
       <div className={`
         absolute inset-0 rounded-2xl border-2 ${borderColor} ${bgColor} 
         shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-[1.02]
       `}>
          {/* REDUCED OPACITY DOT PATTERN: opacity-5 instead of opacity-20 */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '12px 12px' }} 
          />
          
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center">
             {children}
          </div>
       </div>

       {/* Floating Badge (Pill on Border) */}
       <div className={`
          absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full
          z-20 border-2 ${borderColor} ${bgColor}
       `}>
          <div className="text-[9px] md:text-[10px] text-white font-header tracking-widest uppercase whitespace-nowrap px-1">
            {label}
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

  return (
    <div className="flex flex-col items-center justify-center h-full w-full pt-4">
        <div className="flex items-baseline gap-1 relative">
           <span className="font-header text-5xl md:text-7xl text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] tabular-nums tracking-tighter">
             {speed}
           </span>
           <span className="font-header text-sm text-amber-200 uppercase mt-2">MPH</span>
        </div>
        <div className="w-24 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden border border-slate-700">
           <div className="h-full bg-amber-500 w-[80%] rounded-full animate-pulse shadow-[0_0_8px_#F59E0B]" />
        </div>
    </div>
  );
};

const TeethCollectionWidget = () => {
  const [count, setCount] = useState(1003469);
  
  useEffect(() => {
     const interval = setInterval(() => setCount(prev => prev + 1), 5000);
     return () => clearInterval(interval);
  }, []);

  // SCROLLING ANIMATION for teeth
  const houses = [...Array(10)].map((_, i) => (
      <div key={i} className="flex-none px-2 group">
         <div className="w-10 h-10 md:w-12 md:h-12 bg-fuchsia-900/50 border-2 border-fuchsia-400 rounded-t-full rounded-b-lg flex items-center justify-center relative overflow-hidden shadow-[0_0_10px_rgba(232,121,249,0.3)] transform group-hover:-translate-y-1 transition-transform">
            <img src={IMG_TOOTH} className="w-6 h-6 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] brightness-200" alt="tooth" />
            <div className="absolute bottom-0 w-full h-1 bg-fuchsia-500" />
         </div>
      </div>
  ));

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden pt-4">
        <div className="w-full overflow-hidden mb-2 relative h-12">
             <div className="flex animate-marquee w-[200%] absolute left-0 top-0">
                <div className="flex w-[50%] justify-around">
                   {houses}
                </div>
                <div className="flex w-[50%] justify-around">
                   {houses}
                </div>
             </div>
             {/* Fade edges */}
             <div className="absolute inset-0 bg-gradient-to-r from-[#1a0b2e] via-transparent to-[#1a0b2e] pointer-events-none" />
        </div>
        <div className="font-header text-lg md:text-xl text-white drop-shadow-md tracking-wider tabular-nums">
          {count.toLocaleString()}
        </div>
    </div>
  );
};

const SignalWidget = () => (
    <div className="w-full h-full flex flex-col items-center justify-center pt-2">
       {/* FULL WIDTH FULL LENGTH BARS - PURPLE THEME */}
       <div className="flex items-end justify-center w-full h-full gap-[2px] px-1 pb-1">
          {[...Array(16)].map((_, i) => {
             const height = 20 + Math.random() * 80;
             return (
               <div 
                 key={i} 
                 className="flex-1 bg-purple-500/80 rounded-sm shadow-[0_0_4px_rgba(168,85,247,0.4)]"
                 style={{ 
                    height: `${height}%`,
                    opacity: i % 2 === 0 ? 0.9 : 0.5,
                    animation: `pulse ${0.3 + Math.random()}s infinite alternate`
                 }} 
               />
             );
          })}
       </div>
       <div className="absolute bottom-1 right-2 bg-purple-900/90 px-2 py-0.5 rounded-full border border-purple-400/50 backdrop-blur-sm z-10 shadow-lg">
          <span className="text-[8px] text-purple-200 font-black uppercase tracking-widest flex items-center gap-1">
             <Wifi size={10} /> Connected
          </span>
       </div>
    </div>
  );

const RadarWidget = () => (
   <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-2xl bg-cyan-950/20">
       {/* Constrain to square for circular shape */}
       <div className="relative h-[85%] md:h-[90%] aspect-square flex items-center justify-center">
            
            {/* Background Grid inside circle */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 overflow-hidden bg-cyan-950/30 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]">
                 <div className="absolute inset-0 opacity-30" 
                      style={{ backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.6) 1px, transparent 1px)', backgroundSize: '10px 10px' }} 
                 />
            </div>
            
            {/* Concentric Circles */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/30" />
            <div className="absolute inset-[25%] rounded-full border border-cyan-500/20" />
            <div className="absolute inset-[50%] rounded-full border border-cyan-500/10" />
            
            {/* Crosshairs */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/20" />
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-cyan-500/20" />

            {/* Sweep - Conic Gradient */}
            <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '4s', animationTimingFunction: 'linear' }}>
                 <div className="w-full h-full rounded-full" 
                      style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(6,182,212,0.4) 360deg)' }} 
                 />
            </div>
            
            {/* Blip */}
            <div className="absolute top-[30%] right-[30%] w-2 h-2 bg-fuchsia-400 rounded-full animate-ping" />
            <div className="absolute top-[30%] right-[30%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]" />
       </div>
       
       <div className="absolute bottom-1 right-2 text-[8px] font-mono text-cyan-500/70">RADAR ACTIVE</div>
   </div>
);

const ToothTargetWidget = () => (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-cyan-950/20">
        {/* Large Background Grid */}
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
             <span className="font-header text-[10px] text-cyan-200 tracking-wider uppercase drop-shadow-md">Savannah's Tooth</span>
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
     <div className="h-10 md:h-16 flex flex-col items-center justify-center bg-[#020617] border-t border-cyan-900">
         <h3 className="font-header text-lg md:text-2xl text-white tracking-wider">KIKI</h3>
         <div className="text-[7px] md:text-[9px] text-cyan-500 font-mono tracking-[0.3em] uppercase">ID: 07-ALPHA</div>
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
    className = "my-10 md:my-14"
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
        
        <div className="relative flex flex-col items-center justify-center z-10 px-4 text-center space-y-2">
            
            {/* ROW 1: PHASE BADGE & ICON */}
            <div className="flex items-center gap-2 mb-1">
                <div className={`
                    p-1.5 rounded-lg bg-[#0b1221] border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]
                `}>
                    <Icon size={16} className={`${color} drop-shadow-[0_0_8px_currentColor]`} fill="currentColor" />
                </div>
                <div className="px-3 py-1 bg-slate-800 border border-cyan-500/50 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                    <span className="font-mono text-xs md:text-sm text-cyan-300 font-bold tracking-[0.2em] uppercase">
                        {phase}
                    </span>
                </div>
            </div>

            {/* ROW 2: MAIN TITLE */}
            <h2 className="font-header text-4xl md:text-6xl text-white uppercase italic tracking-tighter leading-none drop-shadow-[0_4px_0_rgba(0,0,0,1)] scale-y-110">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-100">
                   {title}
                </span>
            </h2>
            
            {/* ROW 3: SEPARATE WARNING CALLOUT */}
            {warning && (
                <div className="mt-3 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                    {/* CHANGED: Red bg/border to Fuchsia/Purple for softer, magical vibe */}
                    <div className="inline-block px-4 py-1.5 bg-fuchsia-600 text-white border-2 border-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.6)]">
                         <span className="font-header text-sm md:text-base tracking-[0.2em] uppercase">
                             ⚠️ {warning} ⚠️
                         </span>
                    </div>
                </div>
            )}

            {/* Optional Status Badge */}
             {badgeText && (
                <div className="mt-2 inline-block px-3 py-0.5 bg-yellow-400 text-black font-mono text-[10px] md:text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_10px_rgba(250,204,21,0.6)] rounded-sm transform -skew-x-12">
                   // Status: {badgeText}
                </div>
             )}
        </div>
    </div>
);


// === HEADER CARDS ===

const HeaderStat = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="flex flex-col items-center justify-center gap-1 group">
      <div className={`flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest ${color} opacity-80 group-hover:opacity-100 transition-opacity`}>
         <Icon size={10} className="group-hover:animate-pulse" /> {label}
      </div>
      <div className="font-header text-xs md:text-sm text-white/90 tracking-wide drop-shadow-sm">
         {value}
      </div>
  </div>
);

const MissionHeaderCard = () => (
    <div className="relative w-full flex flex-col items-center justify-center mb-6 pt-6 pb-4">
        
        {/* === BACKGROUND PLATE === */}
        <div className="absolute inset-0 bg-[#0f172a]/40 rounded-3xl border border-white/5 shadow-xl backdrop-blur-sm overflow-hidden">
            {/* Grid texture */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-cyan-500/20 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-cyan-500/20 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-cyan-500/20 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-cyan-500/20 rounded-br-3xl" />
        </div>

        {/* === TOP HUD ELEMENTS === */}
        <div className="absolute top-3 left-4 flex items-center gap-2 z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
            <span className="text-[8px] font-mono text-red-400/80 tracking-widest uppercase">REC</span>
        </div>
        <div className="absolute top-3 right-4 flex items-center gap-2 z-20">
             <span className="text-[8px] font-mono text-cyan-500/60 tracking-widest uppercase">T-MINUS 04:00</span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center w-full">
            
            {/* ROW 1: MISSION LABEL - UPDATED SIZE & COLOR & MARGIN & DECORATION */}
            <div className="relative z-30 mb-[-4px] md:mb-[-10px] flex items-center justify-center gap-3 group cursor-default">
                  {/* Cool Decoration: Tiny animated arrows */}
                  <div className="flex text-amber-400/80 animate-pulse gap-0.5">
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-amber-400 rounded-full" />
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-amber-400/50 rounded-full" />
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-amber-400/20 rounded-full" />
                  </div>

                  <h2 className="font-header text-lg md:text-3xl uppercase italic tracking-[0.3em] leading-none transform -skew-x-12 relative">
                        {/* Glow effect behind */}
                        <span className="absolute inset-0 text-amber-500 blur-sm opacity-50 select-none" aria-hidden="true">MISSION: TO</span>
                        <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-orange-500 drop-shadow-sm">
                          MISSION: TO
                        </span>
                  </h2>

                  {/* Cool Decoration: Tiny animated arrows reversed */}
                   <div className="flex text-amber-400/80 animate-pulse gap-0.5 flex-row-reverse">
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-amber-400 rounded-full" />
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-amber-400/50 rounded-full" />
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-amber-400/20 rounded-full" />
                  </div>
            </div>

            {/* ROW 2: NAME - REMOVED DECORATIONS - REMOVED TOP PADDING */}
            <div className="relative w-full flex justify-center overflow-visible z-20">
                <h1 className="font-header text-5xl sm:text-6xl md:text-8xl text-white uppercase italic tracking-tighter leading-[0.85] drop-shadow-[0_5px_0_rgba(0,0,0,1)] transform scale-y-110 pb-2 pt-0">
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 filter drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] pr-4 mr-[-0.1em]">
                    SAVANNAH
                    </span>
                </h1>
            </div>

            {/* ROW 3: PRIORITY BADGE (Skewed Rectangle) */}
            {/* Kept close to name via small margins */}
            <div className="mt-1 mb-5 group cursor-default z-20">
                <div className="relative inline-flex items-center justify-center px-8 py-1.5 bg-gradient-to-r from-[#00B0C0] via-cyan-500 to-[#8B5CF6] text-white border border-cyan-400/50 shadow-[0_0_25px_rgba(0,176,192,0.4)] transform -skew-x-12 hover:scale-105 transition-transform">
                     {/* Shimmer */}
                     <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
                     {/* Content */}
                     <div className="flex items-center gap-2 transform skew-x-12">
                         <div className="relative flex items-center justify-center w-2 h-2">
                            <div className="absolute w-2 h-2 bg-white rounded-full animate-ping opacity-75" />
                            <div className="relative w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]" />
                         </div>
                         <span className="font-header text-[10px] md:text-xs tracking-[0.2em] uppercase text-white drop-shadow-md pt-0.5">
                             Priority: Maximum
                         </span>
                     </div>
                </div>
            </div>

            {/* ROW 4: FUN STATS (Divider Line & Grid) */}
            <div className="w-full max-w-xl border-t border-white/5 pt-3 flex justify-center gap-6 md:gap-12 relative">
                {/* Vertical Separators */}
                <div className="absolute top-3 bottom-0 left-1/3 w-px bg-gradient-to-b from-white/10 to-transparent" />
                <div className="absolute top-3 bottom-0 right-1/3 w-px bg-gradient-to-b from-white/10 to-transparent" />
                
                <HeaderStat icon={Moon} label="Moon Phase" value="Waxing Gibbous" color="text-yellow-400" />
                <HeaderStat icon={Sparkles} label="Magic Integrity" value="98.5% Stable" color="text-fuchsia-400" />
                <HeaderStat icon={Wind} label="Wind Speed" value="12 Knots NW" color="text-cyan-400" />
            </div>

        </div>
    </div>
);

const MessageCard = () => (
    <div className="relative h-full min-h-[120px] md:min-h-[140px] bg-[#1a0b2e] rounded-3xl overflow-hidden border border-fuchsia-500/30 group cursor-pointer transition-transform hover:scale-[1.01] shadow-lg shadow-fuchsia-900/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(162,28,175,0.15),transparent_70%)]" />
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(rgba(232,121,249,0.4) 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
        />
        
        {/* BIG ENVELOPE EMOJI ON THE SIDE */}
        <div className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 text-7xl md:text-8xl opacity-80 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 filter drop-shadow-lg z-0 pointer-events-none select-none">
             📨
        </div>

        <div className="relative z-10 p-2 md:p-6 flex flex-col items-center justify-center h-full text-center">
             <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse" />
                 <span className="font-mono text-[8px] md:text-[10px] text-fuchsia-300 tracking-[0.2em] uppercase font-bold whitespace-nowrap">Encrypted Data</span>
             </div>

             <div className="flex flex-col items-center justify-center w-full mb-2 md:mb-4 pr-12 md:pr-0">
                 <h2 className="font-header text-lg md:text-3xl text-white tracking-wide uppercase drop-shadow-md whitespace-nowrap leading-tight">
                     New Updates
                 </h2>
                 <div className="mt-2 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="bg-yellow-400 text-black px-4 py-1 rounded-sm border-2 border-white shadow-[0_0_20px_rgba(250,204,21,0.6)]">
                         <span className="font-header text-xs md:text-sm tracking-[0.2em] uppercase font-bold">
                             For Savannah
                         </span>
                    </div>
                 </div>
             </div>

             <div className="bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-[8px] md:text-[10px] font-header uppercase tracking-wider px-3 py-1 md:px-6 md:py-2 rounded-full shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all active:scale-95 flex items-center gap-1 whitespace-nowrap relative z-10">
                 TAP TO SEE <span className="text-[10px] hidden md:inline">»</span>
             </div>
        </div>

        <div className="absolute inset-2 border border-fuchsia-500/20 rounded-2xl pointer-events-none" />
    </div>
);


// === MAIN APP ===

function App() {
  const [currentStage, setCurrentStage] = useState(2);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  
  const morningRef = useRef<HTMLDivElement>(null);

  const handleUnlock = (stage: Stage) => {
    // ALLOW ALL CLICKS - "NO MORE LOCKS"
    setCurrentStage(stage.id);
    setSelectedStage(stage);
    setModalOpen(true);
  };

  const unlockNextBatch = () => {
     if (maxUnlockedStage < 6) {
         setMaxUnlockedStage(6);
         setCurrentStage(4);
         setTimeout(() => {
             morningRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }, 100);
     }
  };

  const nightStages = STAGES.slice(0, 3);
  const morningStages = STAGES.slice(3, 6);
  const isNextBatchAvailable = maxUnlockedStage === 3;

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-cyan-500/30 pb-20 overflow-x-hidden">
      
      {/* Modal Overlay */}
      {modalOpen && selectedStage && (
        <MissionModal stage={selectedStage} onClose={() => setModalOpen(false)} />
      )}

      {/* Fixed Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#02040a_100%)]" />
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: 'linear-gradient(rgba(0, 176, 192, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 176, 192, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4 md:py-8 max-w-7xl">
          
          {/* 1. HEADER SECTION */}
          
          {/* Main Title: Full width */}
          <MissionHeaderCard />

          {/* Sub-Header Grid: Message & ID */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
             {/* Message: Full width on mobile (col-span-2) and half on desktop */}
             <div className="col-span-2 md:col-span-1" onClick={unlockNextBatch}>
                <MessageCard />
             </div>

             {/* Fairy ID: Full width on mobile (col-span-2) and half on desktop */}
             {/* Previously hidden on desktop, now showing for symmetry since Title is separate */}
             <div className="col-span-2 md:col-span-1 h-full">
                 <NeonPanel label="Fairy On Duty" borderColor="border-cyan-500" bgColor="bg-slate-950" height="h-full min-h-[140px]">
                    <FairyIDCard />
                 </NeonPanel>
             </div>
          </div>

          {/* 2. TITLE ROW */}
          <FunPhaseDivider 
             phase="LIVE FEED" 
             title="MISSION CONTROL" 
             icon={Activity} 
             color="text-cyan-400" 
             className="mb-8 md:mb-12 mt-4" 
          />

          {/* 3. WIDGET GRID */}
          {/* MOBILE: 2x2 Grid. DESKTOP: 3-Col Layout. */}
          <div className="grid grid-cols-2 md:grid-cols-[1fr_288px_1fr] gap-4 md:gap-6 mb-8 md:mb-12 auto-rows-[140px] md:auto-rows-auto">
             
             {/* LEFT COLUMN ITEMS */}
             <div className="col-span-1 md:col-start-1 md:row-start-1">
                 <NeonPanel label="Flight Speed" borderColor="border-amber-400" bgColor="bg-slate-900" className="w-full h-full md:h-40">
                    <SpeedWidget />
                 </NeonPanel>
             </div>
             <div className="col-span-1 md:col-start-1 md:row-start-2">
                 <NeonPanel label="Teeth Collected" borderColor="border-fuchsia-500" bgColor="bg-[#1a0b2e]" className="w-full h-full md:h-40">
                    <TeethCollectionWidget />
                 </NeonPanel>
             </div>

             {/* CENTER COLUMN (ID DUPLICATE? No, removed ID from here since it's up top now) */}
             {/* Let's put a different decorative panel here or keep it simple. */}
             {/* We'll use a large Radar visualization in the center for desktop */}
             <div className="hidden md:block md:col-start-2 md:row-start-1 md:row-span-2 h-full">
                <NeonPanel label="Long Range Scan" borderColor="border-cyan-500" bgColor="bg-slate-950" className="h-full">
                   <RadarWidget />
                </NeonPanel>
             </div>
             
             {/* RIGHT COLUMN ITEMS */}
             <div className="col-span-1 md:col-start-3 md:row-start-1">
                 <NeonPanel label="Fairy Link" borderColor="border-purple-400" bgColor="bg-slate-900" className="w-full h-full md:h-40">
                    <SignalWidget />
                 </NeonPanel>
             </div>
             {/* For mobile, Radar was here. For desktop, it's center. We need a widget for bottom right desktop? */}
             {/* Actually, let's just reuse RadarWidget here for mobile, but hide it on desktop since scanning is center */}
             <div className="col-span-1 md:col-start-3 md:row-start-2 md:hidden">
                 <NeonPanel label="Radar" borderColor="border-cyan-400" bgColor="bg-slate-900" className="w-full h-full md:h-40">
                    <RadarWidget />
                 </NeonPanel>
             </div>
             {/* Desktop Bottom Right: Changed to Tooth Target */}
             <div className="hidden md:block col-span-1 md:col-start-3 md:row-start-2">
                  <NeonPanel label="Tooth Target" borderColor="border-cyan-500" bgColor="bg-slate-900" className="w-full h-full md:h-40">
                     <ToothTargetWidget />
                 </NeonPanel>
             </div>

          </div>

          {/* 4. MISSION STAGES */}
          <FunPhaseDivider 
             phase="Phase 1" 
             title="Night Flight" 
             warning="For Savannah Only!" 
             icon={CustomMoonIcon} 
             color="text-yellow-400" 
             badgeText="ACTIVE" 
          />
          
          <div className="grid grid-cols-1 gap-8 md:gap-12 mb-8 md:mb-12 px-1 md:px-2">
              {nightStages.map((stage, index) => (
                 <StageCard 
                    key={stage.id}
                    stage={stage}
                    isActive={stage.type === 'active'}
                    isLocked={stage.type === 'locked'}
                    isCompleted={stage.type === 'completed'}
                    onClick={() => handleUnlock(stage)}
                    index={index}
                 />
              ))}
          </div>

          <div ref={morningRef} className={`transition-all duration-1000 ${isNextBatchAvailable ? 'opacity-50 blur-sm grayscale' : 'opacity-100'}`}>
              <FunPhaseDivider 
                phase="Phase 2"
                title="Morning Report" 
                icon={Sun} 
                color="text-amber-400" 
                badgeText="LOCKED" 
              />
              
              <div className="grid grid-cols-1 gap-8 md:gap-12 px-1 md:px-2">
                  {morningStages.map((stage, index) => (
                     <StageCard 
                        key={stage.id}
                        stage={stage}
                        isActive={stage.type === 'active'}
                        isLocked={stage.type === 'locked'}
                        isCompleted={stage.type === 'completed'}
                        onClick={() => handleUnlock(stage)}
                        index={index + 3}
                     />
                  ))}
              </div>
          </div>

      </div>
    </div>
  );
}

export default App;