import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Play, MessageCircle, Camera, Lock, ChevronRight, ChevronLeft, Star, Zap, Sparkles, Heart, Activity, Signal } from 'lucide-react';

// === DATA ===
const STAGES = [
  { 
    id: 1, 
    title: "Discovery", 
    location: "Bedroom Sector", 
    message: "Scanning complete! Object identified: 1x Tooth (Pristine Condition). Initiating transport sequence.",
    fairyName: "Twinkle",
    theme: "from-pink-500 to-fuchsia-500",
    shadow: "shadow-pink-500/50",
    borderColor: "border-pink-500/50",
    icon: "🧚‍♀️",
    videoThumbnail: "linear-gradient(135deg, #831843 0%, #be185d 100%)"
  },
  { 
    id: 2, 
    title: "Liftoff", 
    location: "Rooftop Zone", 
    message: "We have liftoff! Wind speed is 12 knots. Your house looks like a tiny speck of glitter from up here!",
    fairyName: "Twinkle",
    theme: "from-cyan-400 to-blue-500",
    shadow: "shadow-cyan-400/50",
    borderColor: "border-cyan-400/50",
    icon: "🚀",
    videoThumbnail: "linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)"
  },
  { 
    id: 3, 
    title: "Ocean Cross", 
    location: "Atlantic Skyway", 
    message: "Cruising altitude reached. The moon reflection on the water is lighting our path. Engaging hyper-speed!",
    fairyName: "Twinkle",
    theme: "from-teal-400 to-emerald-400",
    shadow: "shadow-teal-400/50",
    borderColor: "border-teal-400/50",
    icon: "🌊",
    videoThumbnail: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)"
  },
  { 
    id: 4, 
    title: "Magic Woods", 
    location: "Forbidden Forest", 
    message: "Entering restricted airspace. The ancient trees are waving at us. Stealth mode engaged.",
    fairyName: "Twinkle",
    theme: "from-violet-500 to-purple-500",
    shadow: "shadow-violet-500/50",
    borderColor: "border-violet-500/50",
    icon: "🌲",
    videoThumbnail: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)"
  },
  { 
    id: 5, 
    title: "Processing", 
    location: "Glitter Lab", 
    message: "Tooth accepted! The Glitter Machines are analyzing the sparkle density. Result: 99.9% Pure Magic!",
    fairyName: "Twinkle",
    theme: "from-indigo-400 to-blue-600",
    shadow: "shadow-indigo-500/50",
    borderColor: "border-indigo-500/50",
    icon: "✨",
    videoThumbnail: "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)"
  },
  { 
    id: 6, 
    title: "Mission Done", 
    location: "The Vault", 
    message: "Transfer complete! Coin deployed under pillow. Sleep tight, my friend. Over and out!",
    fairyName: "Twinkle",
    theme: "from-amber-300 to-yellow-500",
    shadow: "shadow-amber-400/50",
    borderColor: "border-amber-400/50",
    icon: "🏰",
    videoThumbnail: "linear-gradient(135deg, #78350f 0%, #d97706 100%)"
  }
];

// === SUB-COMPONENTS ===

interface FeedBubbleProps {
  children: React.ReactNode;
  borderColor?: string;
}

const FeedBubble: React.FC<FeedBubbleProps> = ({ children, borderColor }) => (
  <div className={`
    bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden mb-4 
    border border-l-4 shadow-lg
    transform transition-all duration-300
    ${borderColor || 'border-[#00B0C0]/30'}
    hover:bg-slate-800/80
    relative z-10
  `}>
    <div className="p-3">
      {children}
    </div>
  </div>
);

const StageContent = ({ stage }: { stage: typeof STAGES[0] }) => {
  return (
    <div className="animate-fade-in pb-4 relative z-10">
      {/* HEADER CARD */}
      <div className={`
        bg-gradient-to-r from-slate-900 to-slate-800 
        border border-[#00B0C0]/30 border-t-[#00B0C0] 
        rounded-2xl p-4 mb-5 shadow-[0_0_15px_rgba(0,176,192,0.15)]
        relative overflow-hidden
      `}>
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(0deg,transparent_50%,rgba(0,176,192,0.5)_50%)] bg-[length:100%_4px]" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-2xl 
            bg-gradient-to-br ${stage.theme} shadow-lg ${stage.shadow}
            border border-white/20
          `}>
            {stage.icon}
          </div>
          <div>
            <h2 className="font-toy text-white text-xl tracking-wide drop-shadow-sm">
              {stage.title}
            </h2>
            <div className="flex items-center gap-1.5 text-[#00B0C0] text-[10px] font-mono uppercase tracking-wider">
              <Activity size={10} className="animate-pulse" /> 
              {stage.location}
            </div>
          </div>
        </div>
      </div>

      {/* MAP WIDGET */}
      <FeedBubble borderColor="border-[#00B0C0]/40">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[#00B0C0] font-mono text-[10px] uppercase tracking-wider font-bold">
              <MapPin size={10} /> Sector Map
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse shadow-[0_0_5px_#F59E0B]" />
         </div>
         <div className="relative h-32 w-full bg-[#050b14] rounded-xl overflow-hidden border border-[#105B69]/50">
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(rgba(0,176,192,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,176,192,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00B0C0]/10 to-transparent animate-radar-sweep opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
               <div className={`w-3 h-3 rounded-full bg-[#F59E0B] animate-ping absolute opacity-75`} />
               <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${stage.theme} flex items-center justify-center shadow-[0_0_15px_currentColor] border border-white/50 relative z-10`}>
                  <span className="text-xs">🧚</span>
               </div>
            </div>
            <div className="absolute bottom-1 left-2 font-mono text-[8px] text-[#00B0C0]/70">
              LAT: 42.103 • LNG: 91.004
            </div>
         </div>
      </FeedBubble>

      {/* VIDEO WIDGET */}
      <FeedBubble borderColor="border-[#00B0C0]/40">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[#00B0C0] font-mono text-[10px] uppercase tracking-wider font-bold">
              <Camera size={10} /> Drone Feed
            </div>
            <div className="text-[8px] font-mono text-[#00B0C0]">HD-720p</div>
         </div>
         <div className="relative h-36 rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer border border-white/5"
              style={{ background: stage.videoThumbnail }}>
            <div className="absolute inset-0 bg-black/10 grid grid-cols-4 grid-rows-4 opacity-30">
               <div className="border-r border-b border-white/20" />
               <div className="border-r border-b border-white/20" />
               <div className="border-r border-b border-white/20" />
               <div className="border-b border-white/20" />
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
               <Play size={20} className="text-white ml-1 fill-white" />
            </div>
            <div className="absolute top-2 left-2 bg-red-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm animate-pulse">
               REC
            </div>
         </div>
      </FeedBubble>

      {/* MESSAGE WIDGET */}
      <FeedBubble borderColor={stage.borderColor.replace('border-', 'border-l-')}>
         <div className="flex items-center gap-2 mb-2 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
           <MessageCircle size={10} /> Transmission
         </div>
         <div className="relative pl-2">
            <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b ${stage.theme} rounded-full`} />
            <p className="font-toy text-white text-sm leading-relaxed tracking-wide">
               "{stage.message}"
            </p>
         </div>
         <div className="mt-3 flex justify-end items-center gap-1 text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-white">
             {stage.fairyName} <Sparkles size={10} className="text-cyan-200" />
         </div>
      </FeedBubble>
    </div>
  );
};

// === CHUNKY BUTTON COMPONENT ===
const GameButton = ({ onClick, disabled, icon: Icon, color, size = 'md' }: any) => {
  // Balanced Palette
  const styles: Record<string, string> = {
    // Main Action: Teal (High Tech)
    turquoise: 'bg-[#00B0C0] border-[#007A85] text-[#022c22] shadow-[0_4px_0_#007A85] hover:bg-[#22d3ee]',
    // Secondary: Slate (Tactical)
    slate: 'bg-slate-700 border-slate-800 text-slate-300 shadow-[0_4px_0_#1e293b] hover:bg-slate-600',
    // Pop Accent: Amber/Orange (Warmth)
    orange: 'bg-[#F59E0B] border-[#B45309] text-[#451a03] shadow-[0_4px_0_#B45309] hover:bg-[#fbbf24]',
  };
  
  const theme = styles[color] || styles.turquoise;
  const sizeClasses = size === 'lg' ? 'w-20 h-20 rounded-[24px]' : 'w-16 h-16 rounded-[20px]';

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex items-center justify-center transition-all duration-100 group
        ${sizeClasses}
        ${theme}
        ${disabled 
          ? 'opacity-40 grayscale cursor-not-allowed border-b-[4px]' 
          : 'border-b-[6px] active:border-b-0 active:translate-y-[6px] hover:-translate-y-1 shadow-xl'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/10 rounded-[inherit] pointer-events-none" />
      <Icon size={size === 'lg' ? 40 : 28} strokeWidth={3} className="relative z-10 filter drop-shadow-sm" />
      <div className="absolute top-2 right-3 w-1/4 h-1/4 bg-white/40 rounded-full blur-[2px]" />
    </button>
  );
}

// === MAIN DEVICE ===

export const RetroCard: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [unlockedStages, setUnlockedStages] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentStage]);

  const handleUnlock = () => {
    if (unlockedStages < STAGES.length) {
       setUnlockedStages(u => u + 1);
       setCurrentStage(u => u + 1);
    }
  };

  const activeData = STAGES.find(s => s.id === currentStage) || STAGES[0];

  return (
    <div className="relative group select-none">
        
        {/* === DECORATIONS BEHIND DEVICE === */}
        <div className="absolute -right-12 top-20 text-[#00B0C0] animate-spin-slow opacity-20 mix-blend-screen">
          <Sparkles size={120} />
        </div>
        <div className="absolute -left-12 bottom-40 text-[#F59E0B] animate-pulse-slow opacity-20 mix-blend-screen delay-700">
          <Star size={80} fill="currentColor" />
        </div>
        
        {/* === DEVICE BODY === */}
        <div 
           className="relative w-[400px] h-[750px] bg-[#0f172a] rounded-[60px] flex flex-col overflow-hidden z-10"
           style={{
             boxShadow: `
               0 50px 100px -20px rgba(0,0,0,0.6), 
               inset 0 4px 20px rgba(255,255,255,0.05), 
               inset 0 -10px 40px rgba(0, 0, 0, 0.5),
               0 0 0 8px #1e293b,
               0 0 0 12px #105B69
             `
           }}
        >
           {/* TEXTURE: Matte Stipple */}
           <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay" 
                style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '4px 4px' }} 
           />

           {/* === TOP HEADER / FOREHEAD === */}
           <div className="h-[100px] relative bg-[#1e293b] rounded-b-[40px] shadow-sm z-20 flex flex-col items-center pt-5 pb-2 px-8 border-b border-[#334155]">
               
               {/* 1. Recessed Sensor Strip */}
               <div className="w-[140px] h-[28px] bg-[#020617] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1)] border border-slate-700 flex items-center justify-center gap-3 relative mb-3">
                   {/* IR Blaster Dot (Amber for warmth) */}
                   <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_5px_#F59E0B]" />
                   {/* Main Lens */}
                   <div className="w-16 h-3 bg-[#0f172a] rounded-full relative overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,1)]">
                       <div className="absolute inset-0 bg-[#00B0C0] blur-md opacity-30 animate-pulse" />
                       <div className="absolute top-0.5 left-2 w-6 h-0.5 bg-white/20 rounded-full" />
                   </div>
                   {/* Status LED (Green) */}
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_#22c55e] animate-pulse" />
               </div>

               {/* 2. Controls & Logo Row */}
               <div className="w-full flex items-center justify-between">
                   {/* Left: Speaker Slits */}
                   <div className="flex gap-1.5 items-center w-12">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-6 bg-slate-700 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border-r border-slate-600" />
                      ))}
                   </div>
                   
                   {/* Center: Logo */}
                   <h1 className="font-toy text-slate-400 text-xs tracking-[0.2em] font-black uppercase drop-shadow-sm select-none text-center">
                     Fairy<span className="text-[#00B0C0]">Tracker</span>
                   </h1>

                   {/* Right: Signal Bars (Amber accent for fun) */}
                   <div className="flex items-end gap-1 h-6 w-12 justify-end">
                      <div className="w-1.5 h-2 bg-[#00B0C0] rounded-[1px]" />
                      <div className="w-1.5 h-3 bg-[#00B0C0] rounded-[1px]" />
                      <div className="w-1.5 h-4 bg-[#00B0C0] rounded-[1px]" />
                      <div className="w-1.5 h-5 bg-[#F59E0B] rounded-[1px] animate-pulse" />
                   </div>
               </div>
           </div>


           {/* === MAIN SCREEN AREA === */}
           <div className="flex-1 px-5 py-4 relative">
              <div className="w-full h-full bg-[#020617] rounded-[30px] p-3 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_5px_0_rgba(255,255,255,0.05)] relative z-10 border-b-2 border-slate-700">
                 
                 <div className="w-full h-full bg-[#020617] rounded-[22px] border-[3px] border-black overflow-hidden relative shadow-inner">
                    
                    {/* HOLOGRAPHIC SCREEN EFFECT */}
                    {/* 1. Base Radial Glow */}
                    <div className="absolute inset-0 pointer-events-none z-0 opacity-10 mix-blend-screen" 
                         style={{ background: 'radial-gradient(circle at 50% 40%, rgba(0,176,192,0.4) 0%, transparent 70%)' }} 
                    />
                    
                    {/* 2. Shimmering Sweep */}
                    <div className="absolute inset-0 pointer-events-none z-0 opacity-5 mix-blend-overlay animate-shimmer"
                         style={{ 
                            background: 'linear-gradient(110deg, transparent 30%, rgba(0,176,192,0.6) 50%, transparent 70%)',
                            backgroundSize: '200% 100%'
                         }} 
                    />

                    {/* 3. Scanlines */}
                    <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03]" 
                         style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00B0C0 3px)' }} />

                    <div ref={scrollRef} className="absolute inset-0 overflow-y-auto p-4 scrollbar-hide z-10">
                       <StageContent stage={activeData} />
                       <div className="h-10" />
                    </div>

                    {/* Screen Status Header */}
                    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#00B0C0]/20 to-transparent z-20 flex justify-between px-3 py-1.5 border-b border-[#00B0C0]/20">
                       <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-[#00B0C0] rounded-full animate-pulse shadow-[0_0_5px_#00B0C0]" />
                          <span className="font-mono text-[10px] text-[#00B0C0] tracking-widest">ONLINE</span>
                       </div>
                       <div className="font-mono text-[10px] text-[#105B69]">CH-{activeData.id}</div>
                    </div>
                 </div>

                 {/* "Sticker" on Bezel (Warm Yellow pop) */}
                 <div className="absolute -bottom-2 -left-2 transform -rotate-12 z-20 pointer-events-none">
                    <Star size={36} className="text-[#F59E0B] fill-[#F59E0B] drop-shadow-lg opacity-80" strokeWidth={1.5} />
                    <div className="absolute inset-0 bg-[#F59E0B] blur-md opacity-10" />
                 </div>

              </div>
           </div>


           {/* === BOTTOM CONTROLS === */}
           <div className="h-[160px] relative z-20 px-6 pb-8 flex items-center justify-between">
               
               {/* Left Group: Nav (Tactical Slate) */}
               <GameButton 
                 icon={ChevronLeft} 
                 color="slate" 
                 size="md"
                 onClick={() => setCurrentStage(c => Math.max(1, c - 1))} 
                 disabled={currentStage === 1}
               />

               {/* Center Decorative (The Warm Pop!) */}
               <div className="flex flex-col items-center justify-center gap-2 -mt-2" onClick={handleUnlock}>
                   <div className="w-20 h-20 rounded-full border-[6px] border-[#334155] bg-[#1e293b] flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.5),0_8px_15px_rgba(0,0,0,0.5)] group cursor-pointer hover:bg-[#334155] transition-colors hover:scale-105 active:scale-95 duration-200">
                      <Heart size={32} className="text-[#F59E0B] animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform" fill="currentColor" />
                   </div>
                   <span className="text-[9px] font-toy text-[#F59E0B]/60 tracking-[0.2em] font-bold group-hover:text-[#F59E0B]">LINK</span>
               </div>

               {/* Right Group: Action (High Tech Teal) */}
               <GameButton 
                 icon={currentStage >= unlockedStages ? Lock : ChevronRight} 
                 color="turquoise" 
                 size="md"
                 onClick={() => setCurrentStage(c => Math.min(unlockedStages, c + 1))}
                 disabled={currentStage >= unlockedStages}
               />

           </div>
           
           {/* Side Grips */}
           <div className="absolute top-1/2 -left-[4px] w-4 h-32 bg-[#1e293b] rounded-r-lg border-r border-slate-600 flex flex-col justify-evenly py-2 shadow-inner">
               {[...Array(6)].map((_,i) => <div key={i} className="w-full h-1 bg-black/40" />)}
           </div>
           <div className="absolute top-1/2 -right-[4px] w-4 h-32 bg-[#1e293b] rounded-l-lg border-l border-slate-600 flex flex-col justify-evenly py-2 shadow-inner">
               {[...Array(6)].map((_,i) => <div key={i} className="w-full h-1 bg-black/40" />)}
           </div>

        </div>
    </div>
  );
};