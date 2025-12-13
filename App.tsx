import React, { useState, useEffect, useRef } from 'react';
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
       {/* Main Container with Gradient Border */}
       <div className={`
         absolute inset-0 rounded-2xl p-[1px]
         shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-[1.02]
       `}>
          {/* Animated Gradient Border Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-purple-500/40 to-amber-500/40 animate-gradient-move" 
               style={{ backgroundSize: '400% 400%' }} />

          {/* Inner Content */}
          <div className={`relative h-full w-full rounded-2xl ${bgColor} flex flex-col items-center justify-center overflow-hidden`}>
             {/* REDUCED OPACITY DOT PATTERN */}
             <div className="absolute inset-0 opacity-5 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '12px 12px' }} 
             />
             <div className="relative z-10 h-full w-full flex flex-col items-center justify-center">
                {children}
             </div>
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
    <div className="w-full h-full flex flex-col items-center justify-center pt-2 relative">
       {/* FULL WIDTH FULL LENGTH BARS - PURPLE THEME */}
       <div className="flex items-end justify-center w-full h-full gap-[2px] px-1 pb-4">
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
       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-purple-900/90 px-3 py-1 rounded-full border border-purple-400/50 backdrop-blur-sm z-10 shadow-lg whitespace-nowrap">
          <span className="text-[10px] text-purple-200 font-black uppercase tracking-widest flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> CONNECTED
          </span>
       </div>
    </div>
);

const RadarWidget = () => (
   <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="w-24 h-24 rounded-full border-2 border-cyan-500/30 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 scale-75" />
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 scale-50" />
          <div className="w-1 h-1 bg-cyan-500 rounded-full" />
          
          {/* Sweep */}
          <div className="absolute top-1/2 left-1/2 w-[50%] h-1 bg-gradient-to-r from-cyan-500 to-transparent origin-left animate-[spin_2s_linear_infinite]" />
          
          {/* Blip */}
          <div className="absolute top-6 right-6 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />
      </div>
   </div>
);

const LiveMapWidget = () => (
   <div className="w-full h-full relative overflow-hidden bg-slate-950 rounded-2xl group">
       {/* ANIMATIONS */}
       <style>{`
         @keyframes scan-line {
           0% { top: 0%; opacity: 0; }
           10% { opacity: 1; }
           90% { opacity: 1; }
           100% { top: 100%; opacity: 0; }
         }
         @keyframes pulse-ring {
           0% { transform: scale(0.8); opacity: 0.5; }
           100% { transform: scale(2); opacity: 0; }
         }
       `}</style>

       {/* === 1. TACTICAL MAP BACKGROUND (VECTOR STYLE) === */}
       <div className="absolute inset-[-25%] bg-[#020617] transform group-hover:scale-105 transition-transform duration-[10s] ease-linear">
            {/* Dark Mode Street Grid Pattern */}
            <div className="absolute inset-0" 
                 style={{
                   backgroundImage: `
                      linear-gradient(#1e293b 2px, transparent 2px), 
                      linear-gradient(90deg, #1e293b 2px, transparent 2px),
                      linear-gradient(rgba(30, 41, 59, 0.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(30, 41, 59, 0.5) 1px, transparent 1px)
                   `,
                   backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                   backgroundPosition: 'center'
                 }} 
            />
            
            {/* SVG Roads / Topography */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" preserveAspectRatio="none">
                 {/* Rivers / Parks */}
                 <path d="M -100,300 C 100,280 300,350 500,300 S 800,200 1200,250" stroke="#0f172a" strokeWidth="60" fill="none" />
                 <path d="M -100,300 C 100,280 300,350 500,300 S 800,200 1200,250" stroke="#0ea5e9" strokeWidth="15" fill="none" opacity="0.2" />

                 {/* Major Highways */}
                 <path d="M 100,-50 L 300,800" stroke="#334155" strokeWidth="12" fill="none" />
                 <path d="M -50,400 L 1000,200" stroke="#334155" strokeWidth="12" fill="none" />
                 <circle cx="300" cy="400" r="150" stroke="#334155" strokeWidth="10" fill="none" />
            </svg>

            {/* Glowing Points of Interest */}
            <div className="absolute top-[30%] left-[40%] w-1 h-1 bg-yellow-500 rounded-full shadow-[0_0_8px_#eab308]" />
            <div className="absolute bottom-[20%] right-[30%] w-1 h-1 bg-yellow-500 rounded-full shadow-[0_0_8px_#eab308]" />
            <div className="absolute top-[10%] right-[10%] w-1 h-1 bg-yellow-500 rounded-full shadow-[0_0_8px_#eab308]" />
       </div>

       {/* === 2. DYNAMIC ELEMENTS === */}
       
       {/* Moving Path Line */}
       <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
           <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="transparent" />
                 <stop offset="50%" stopColor="#22d3ee" />
                 <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
           </defs>
           <path 
              d="M -20,100 Q 150,140 300,80 T 600,100" 
              stroke="url(#pathGradient)" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray="8 6"
              strokeLinecap="round"
              className="opacity-80"
           >
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
           </path>
       </svg>

       {/* Center User (Fairy) Marker */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            {/* Radar Rings */}
            <div className="absolute inset-[-30px] border border-cyan-500/20 rounded-full" style={{ animation: 'pulse-ring 2s infinite' }} />
            <div className="absolute inset-[-15px] border border-cyan-500/40 rounded-full" style={{ animation: 'pulse-ring 2s infinite 0.5s' }} />
            
            {/* The Ship/Fairy Icon */}
            <div className="relative w-10 h-10 bg-slate-900/80 backdrop-blur-sm border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_#22d3ee] z-10">
                 <Navigation size={18} className="text-cyan-400 fill-cyan-400/50 transform rotate-45" />
            </div>
            
            {/* Altitude Tag */}
            <div className="absolute left-full ml-3 top-0 bg-slate-900/80 border border-cyan-500/30 px-1.5 py-0.5 rounded flex flex-col">
                <span className="text-[7px] font-mono text-cyan-500 font-bold whitespace-nowrap">ALT: 4500ft</span>
                <span className="text-[7px] font-mono text-cyan-300 whitespace-nowrap">SPD: 830mph</span>
                <div className="w-full h-[1px] bg-cyan-500/30 my-0.5" />
                <span className="text-[6px] font-mono text-white/50">TARGET LOCKED</span>
            </div>
       </div>

       {/* Home Base Marker */}
       <div className="absolute bottom-[25%] right-[15%] z-10 flex flex-col items-center group/home">
           <div className="relative">
              <MapPin size={24} className="text-amber-500 fill-amber-500/20 drop-shadow-lg transform -translate-y-1 group-hover/home:-translate-y-2 transition-transform" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/50 blur-[2px] rounded-full" />
           </div>
           <div className="bg-amber-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded mt-1 shadow-lg">HOME</div>
       </div>

       {/* === 3. UI OVERLAYS (HUD) === */}
       
       {/* Top Right: Compass */}
       <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-30">
            <div className="relative w-full h-full flex items-center justify-center">
                 <span className="absolute top-1 text-[8px] font-bold text-red-500">N</span>
                 <Compass size={18} className="text-slate-400" />
            </div>
       </div>

       {/* Bottom Left: Controls (Visual) */}
       <div className="absolute bottom-3 left-3 flex flex-col gap-1 z-30">
            <div className="w-6 h-6 bg-slate-800/90 border border-slate-600 rounded flex items-center justify-center shadow">
                <ZoomIn size={12} className="text-slate-300" />
            </div>
            <div className="w-6 h-6 bg-slate-800/90 border border-slate-600 rounded flex items-center justify-center shadow">
                <Layers size={12} className="text-slate-300" />
            </div>
       </div>

       {/* Bottom Right: Scale */}
       <div className="absolute bottom-3 right-3 flex flex-col items-end z-30">
            <span className="text-[8px] font-mono text-slate-400 mb-0.5">2 mi</span>
            <div className="w-12 h-1.5 border-b-2 border-r-2 border-l-2 border-slate-500/50" />
       </div>

       {/* Scan Line Overlay */}
       <div className="absolute left-0 right-0 h-[2px] bg-cyan-500/30 shadow-[0_0_10px_#22d3ee] z-20 pointer-events-none" style={{ animation: 'scan-line 4s linear infinite' }} />
       
       {/* Vignette */}
       <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none z-40 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />
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
     <div className="h-8 md:h-10 flex flex-col items-center justify-center bg-[#020617] border-t border-cyan-900">
         <h3 className="font-header text-sm md:text-lg text-white tracking-wider">KIKI</h3>
         <div className="text-[7px] text-cyan-500 font-mono tracking-[0.3em] uppercase">ID: 07-ALPHA</div>
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
        
        {/* === BACKGROUND PLATE WITH GRADIENT BORDER === */}
        <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-amber-500/40 animate-gradient-move shadow-xl overflow-hidden" style={{ backgroundSize: '200% 200%' }}>
            <div className="w-full h-full bg-[#0f172a]/90 backdrop-blur-md rounded-3xl overflow-hidden relative">
                {/* Grid texture */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-cyan-500/20 rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-cyan-500/20 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-cyan-500/20 rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-cyan-500/20 rounded-br-3xl" />
            </div>
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
            
            {/* ROW 1: MISSION LABEL - UPDATED TO 'MISSION TO', MATCHED COLORS, REDUCED SPACING */}
            <div className="relative z-30 mb-[-4px] md:mb-[-10px] flex items-center justify-center gap-3 group cursor-default -translate-y-1">
                  {/* Cool Decoration: Tiny animated arrows */}
                  <div className="flex text-cyan-400/80 animate-pulse gap-0.5">
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-cyan-400 rounded-full" />
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-cyan-400/50 rounded-full" />
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-cyan-400/20 rounded-full" />
                  </div>

                  <h2 className="font-header text-lg md:text-3xl uppercase italic tracking-[0.25em] leading-none transform -skew-x-12 relative">
                        {/* Glow effect behind */}
                        <span className="absolute inset-0 text-cyan-500 blur-sm opacity-50 select-none" aria-hidden="true">MISSION TO</span>
                        <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-sm">
                          MISSION TO
                        </span>
                  </h2>

                  {/* Cool Decoration: Tiny animated arrows reversed */}
                   <div className="flex text-cyan-400/80 animate-pulse gap-0.5 flex-row-reverse">
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-cyan-400 rounded-full" />
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-cyan-400/50 rounded-full" />
                     <div className="w-1 h-1 md:w-2 md:h-2 bg-cyan-400/20 rounded-full" />
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

// === REDESIGNED START MISSION CARD (FINAL FIXED LAYOUT) ===
const StartMissionCard = ({ onClick }: { onClick?: () => void }) => (
    <div onClick={onClick} className="relative w-full max-w-7xl mx-auto group cursor-pointer mb-32 mt-12">
        
        {/* Glow behind main card */}
        <div className="absolute top-10 bottom-10 left-10 right-10 bg-cyan-500/20 blur-[80px] rounded-full" />

        {/* Main Card Container - Reduced Height via Padding */}
        <div className="relative bg-[#020617] rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-visible px-8 md:px-12 py-6">
            
            {/* Background Texture inside card */}
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none z-0">
                 <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>

            {/* LEFT CONTENT */}
            <div className="flex-col items-start text-left z-10 flex relative py-2">
                
                {/* 1. Badge - CLEAN, NO STARS */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-lg mb-6 group-hover:border-slate-500 transition-colors">
                    <span className="font-mono text-[10px] md:text-xs text-cyan-400 font-bold tracking-widest uppercase">
                        SAVANNAH'S MISSION
                    </span>
                </div>

                {/* 2. Title */}
                <h2 className="font-header text-5xl md:text-7xl text-white uppercase italic tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-cyan-500">
                       MISSION<br/>STARTED
                    </span>
                </h2>
                
                {/* 4. Button - UPDATED TEXT */}
                <button className="relative group/btn overflow-hidden bg-[#a3e635] hover:bg-[#bef264] text-black px-10 py-4 rounded-xl font-header text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all transform hover:-translate-y-1 active:scale-[0.98] border-b-[4px] border-[#4d7c0f] active:border-b-0 active:translate-y-1">
                     <span className="relative z-10 flex items-center gap-2">
                        SEE MY UPDATES <ChevronsRight size={20} />
                     </span>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] translate-x-[-200%] group-hover/btn:animate-shimmer" />
                </button>
            </div>

            {/* RIGHT IMAGE - ID CARD POP OUT (NEGATIVE MARGINS) */}
            <div className="relative z-20 perspective-1000 shrink-0 md:-my-32 md:-mr-4 mt-8 md:mt-0">
                <div className="relative w-[300px] md:w-[580px] transform md:rotate-2 transition-all duration-500 md:group-hover:rotate-0 md:group-hover:scale-105 hover:z-30">
                    
                    {/* RAINBOW BORDER CONTAINER */}
                    <div className="relative rounded-[2rem] md:rounded-[2.5rem]">
                        {/* Glow Layer */}
                        <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-cyan-500 to-fuchsia