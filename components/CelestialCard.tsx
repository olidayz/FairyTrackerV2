import React from 'react';
import { Radar, Search, Map, Backpack, Star, Compass, Wind } from 'lucide-react';

interface CelestialButtonProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  isLocked?: boolean;
}

const CelestialButton: React.FC<CelestialButtonProps> = ({ icon: Icon, label, isActive, isLocked }) => (
  <div className={`flex flex-col items-center gap-1 group ${isLocked ? 'opacity-50 grayscale' : 'cursor-pointer'}`}>
    {/* Button Frame */}
    <div className={`
      relative w-14 h-14 rounded-full flex items-center justify-center
      border border-wes-gold/30 transition-all duration-500
      ${isActive 
        ? 'bg-wes-purple shadow-[0_0_20px_rgba(255,215,0,0.3)] border-wes-gold scale-110' 
        : 'bg-wes-navy hover:border-wes-turquoise hover:bg-wes-navy/80'}
    `}>
       {/* Rotating Ring for Active State */}
       {isActive && (
         <div className="absolute inset-[-4px] border border-dashed border-wes-gold/50 rounded-full animate-spin-slow" />
       )}

       <Icon 
         size={20} 
         className={`transition-colors ${isActive ? 'text-wes-gold' : 'text-wes-turquoise'}`} 
         strokeWidth={1.5}
       />
    </div>
    <span className={`font-wes text-[8px] tracking-[0.2em] uppercase ${isActive ? 'text-wes-gold' : 'text-wes-white/50'}`}>
      {label}
    </span>
  </div>
);

export const CelestialCard: React.FC = () => {
  return (
    <div className="relative animate-float">
        {/* 
            Main Container: Antique Astrolabe / Star Chart Vibe
        */}
        <div 
          className="relative w-[340px] h-[220px] rounded-xl overflow-hidden bg-[#0a0a1a] shadow-2xl z-10 flex flex-col"
          style={{
             boxShadow: '0 0 50px rgba(36, 0, 70, 0.4), inset 0 0 80px rgba(0,0,0,0.8)'
          }}
        >
           {/* === BACKGROUND LAYERS === */}
           {/* Star Map Texture */}
           <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{
                 backgroundImage: 'radial-gradient(circle at center, transparent 0%, #0a0a1a 100%), repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,215,0,0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,215,0,0.1) 20px)'
               }} 
           />
           
           {/* Golden Corner Flourishes (CSS Shapes) */}
           <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-wes-gold/40 rounded-tl-xl" />
           <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-wes-gold/40 rounded-tr-xl" />
           <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-wes-gold/40 rounded-bl-xl" />
           <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-wes-gold/40 rounded-br-xl" />
           
           {/* Center Crosshair */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <div className="w-full h-[1px] bg-wes-gold" />
              <div className="h-full w-[1px] bg-wes-gold" />
           </div>

           {/* === CONTENT === */}
           
           {/* Header: Date/Location Tag */}
           <div className="absolute top-4 left-0 right-0 flex justify-center z-20">
              <div className="bg-wes-purple/90 border border-wes-gold/30 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2 shadow-lg">
                 <Star size={8} className="text-wes-gold fill-wes-gold" />
                 <span className="font-wes text-wes-white text-[10px] tracking-widest uppercase">
                    Ephemeris: Night
                 </span>
                 <Star size={8} className="text-wes-gold fill-wes-gold" />
              </div>
           </div>

           {/* Central Stage Display: The "Astrolabe" */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-10">
               {/* Concentric Decorative Rings */}
               <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 border border-wes-turquoise/20 rounded-full" />
                  <div className="absolute inset-2 border border-dotted border-wes-gold/40 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
                  <div className="absolute inset-4 border border-wes-turquoise/30 rounded-full" />
                  
                  {/* Center Diamond */}
                  <div className="w-12 h-12 bg-gradient-to-br from-wes-purple to-wes-navy border border-wes-gold rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.4)] relative z-20 group">
                      <div className="-rotate-45 flex flex-col items-center">
                        <span className="font-wes text-3xl text-wes-white drop-shadow-md">I</span>
                      </div>
                      
                      {/* Magical glow pulsing behind */}
                      <div className="absolute inset-0 bg-wes-pink/30 blur-md -z-10 animate-pulse-slow" />
                  </div>
                  
                  {/* Horizontal Axis decorations */}
                  <div className="absolute top-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-wes-gold/50 to-transparent" />
               </div>
               
               {/* Label under stage */}
               <div className="text-center mt-1">
                  <p className="font-wes text-wes-gold text-xs italic">The Awakening</p>
               </div>
           </div>

           {/* Bottom Controls: Symmetrical Grid */}
           <div className="mt-auto pb-5 px-6 flex justify-between items-end relative z-20">
               <CelestialButton icon={Radar} label="Detect" isActive={true} />
               <CelestialButton icon={Search} label="Inspect" />
               <CelestialButton icon={Map} label="Chart" isLocked={true} />
               <CelestialButton icon={Backpack} label="Cargo" isLocked={true} />
           </div>
        </div>
        
        {/* External Ornament: Hanging Chain/Charm */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
           <div className="w-[1px] h-4 bg-wes-gold" />
           <div className="w-2 h-2 rounded-full border border-wes-gold bg-wes-navy" />
           <div className="w-[1px] h-2 bg-wes-gold" />
           <Compass size={12} className="text-wes-gold animate-spin-slow" />
        </div>
    </div>
  );
};