import React from 'react';
import { Radar, Search, Map, Backpack, Star, Sparkles, Moon } from 'lucide-react';

interface OrnateButtonProps {
  icon: React.ElementType;
  isActive?: boolean;
  isLocked?: boolean;
}

const OrnateButton: React.FC<OrnateButtonProps> = ({ icon: Icon, isActive, isLocked }) => (
  <div className={`relative group ${isLocked ? 'opacity-60 grayscale' : 'cursor-pointer'}`}>
    {/* Decorative Frame */}
    <div className={`
      w-12 h-12 flex items-center justify-center
      border-2 transform rotate-45 transition-all duration-500
      ${isActive 
        ? 'border-wes-gold bg-wes-purple shadow-gold-glow scale-110' 
        : 'border-wes-turquoise/30 bg-wes-navy/50 group-hover:border-wes-turquoise'}
    `}>
       {/* Inner box to correct rotation for icon */}
       <div className={`transform -rotate-45 ${isActive ? 'text-wes-gold' : 'text-wes-turquoise'}`}>
          <Icon size={20} strokeWidth={1.5} />
       </div>
    </div>
    
    {/* Corner dots for that extra maximalist detail */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-1 h-1 bg-wes-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-1 h-1 bg-wes-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

export const MaximalistCard: React.FC = () => {
  return (
    <div className="relative animate-float-delayed">
        {/* 
            Main Container: 
            Symmetrical, framed, deep colors.
        */}
        <div 
          className="relative w-[320px] h-[240px] rounded-lg overflow-hidden wes-pattern border-4 border-wes-turquoise shadow-2xl z-10 flex flex-col items-center"
          style={{
             boxShadow: '0 0 40px rgba(0, 176, 192, 0.15), inset 0 0 50px rgba(0,0,0,0.8)'
          }}
        >
           {/* === LAYERS OF BORDERS === */}
           {/* Inner dashed line */}
           <div className="absolute inset-1.5 border border-dashed border-wes-white/20 rounded-[4px] pointer-events-none" />
           {/* Inner solid accent line */}
           <div className="absolute inset-3 border border-wes-turquoise/30 rounded-[2px] pointer-events-none" />
           
           {/* Decorative Corners */}
           <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-wes-gold opacity-60" />
           <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-wes-gold opacity-60" />
           <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-wes-gold opacity-60" />
           <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-wes-gold opacity-60" />

           {/* === CONTENT === */}
           
           {/* 1. Header Section: The "Badge" */}
           <div className="mt-6 mb-2 relative z-20">
              <div className="relative">
                 {/* Rotating outer ring */}
                 <div className="absolute inset-[-8px] border border-dashed border-wes-turquoise/40 rounded-full animate-spin-slow" />
                 
                 {/* Main Badge Body */}
                 <div className="w-16 h-16 rounded-full bg-wes-purple border-2 border-wes-gold shadow-gold-glow flex items-center justify-center relative overflow-hidden">
                    {/* Inner sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-wes-pink/20 to-transparent" />
                    
                    <div className="flex flex-col items-center">
                       <span className="font-wes text-wes-gold text-2xl font-bold italic leading-none pt-1">1</span>
                       <span className="text-[6px] tracking-widest text-wes-white uppercase font-sans mt-0.5">Stage</span>
                    </div>
                 </div>
                 
                 {/* Side flourishes (Wings) */}
                 <div className="absolute top-1/2 left-full w-12 h-[1px] bg-wes-turquoise/50 ml-2" />
                 <div className="absolute top-1/2 right-full w-12 h-[1px] bg-wes-turquoise/50 mr-2" />
                 <Star size={8} className="absolute top-1/2 -translate-y-1/2 left-full ml-14 text-wes-gold animate-pulse" fill="currentColor" />
                 <Star size={8} className="absolute top-1/2 -translate-y-1/2 right-full mr-14 text-wes-gold animate-pulse" fill="currentColor" />
              </div>
           </div>

           {/* 2. Middle Section: Typography */}
           <div className="text-center relative z-10 mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                 <Moon size={10} className="text-wes-lavender" />
                 <h1 className="font-wes text-wes-turquoise text-lg font-bold tracking-[0.2em] uppercase drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
                    Fairy Tracker
                 </h1>
                 <Sparkles size={10} className="text-wes-pink" />
              </div>
              
              <div className="inline-block border-t border-b border-wes-white/10 py-0.5 px-4 bg-wes-navy/80 backdrop-blur-sm">
                 <span className="font-pixel text-wes-lavender text-xs tracking-widest uppercase">
                    Model No. IX • Night Edition
                 </span>
              </div>
           </div>

           {/* 3. Bottom Section: Controls */}
           <div className="mt-auto mb-8 flex gap-6 items-center justify-center z-20">
              <OrnateButton icon={Radar} isActive={true} />
              <OrnateButton icon={Search} />
              <OrnateButton icon={Map} isLocked={true} />
              <OrnateButton icon={Backpack} isLocked={true} />
           </div>

           {/* Background Atmosphere */}
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-wes-purple/40 to-transparent pointer-events-none" />
           <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-ping opacity-20" />
           <div className="absolute top-20 right-10 w-1 h-1 bg-wes-pink rounded-full animate-ping opacity-20 delay-700" />
        </div>
        
        {/* External Label Tag (Vintage style) */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-wes-gold text-wes-navy text-[8px] font-bold px-2 py-0.5 rounded-sm shadow-lg z-20 uppercase tracking-wider border border-white/20">
           Property of Dept. 7
        </div>
    </div>
  );
};