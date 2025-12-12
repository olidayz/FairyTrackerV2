import React from 'react';
import { Radar, Search, Map, Backpack, Signal, BatteryMedium } from 'lucide-react';
import { GlowingButton } from './GlowingButton';

export const FairyTrackerCard: React.FC = () => {
  return (
    <div className="relative group animate-float">
        {/* 
           Small Antenna on Top Right
        */}
        <div className="absolute -top-8 right-10 w-3 h-12 bg-toy-sapphireDark rounded-full border border-toy-sapphire z-0 shadow-lg flex flex-col items-center justify-end pb-1">
           <div className="w-4 h-4 rounded-full bg-toy-cyan animate-pulse shadow-[0_0_10px_#22d3ee]" />
        </div>

        {/* 
            Device Casing: Translucent Sapphire Blue
        */}
        <div 
          className="relative w-[340px] h-[230px] rounded-[40px] overflow-hidden transition-transform duration-500 z-10"
          style={{
            background: 'linear-gradient(160deg, rgba(30, 58, 138, 0.95) 0%, rgba(23, 37, 84, 0.9) 100%)',
            boxShadow: `
              inset 0 1px 2px rgba(255,255,255,0.3), 
              inset 0 -2px 5px rgba(0,0,0,0.5),
              0 25px 60px -15px rgba(0,0,0,1),
              0 0 0 2px rgba(30, 58, 138, 0.4)
            `,
          }}
        >
          {/* Internal Tech Texture (Subtle Circuitry) */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)',
               }} 
          />
          
          {/* Main Content Container */}
          <div className="relative h-full flex flex-col p-6">
            
            {/* 
              Top Section: The Screen
              Modern "Ice Blue" Holographic Display
            */}
            <div className="relative bg-toy-screenBg rounded-xl p-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] mb-5 border border-toy-screenText/20 group-hover:border-toy-screenText/40 transition-colors">
               
               <div className="relative bg-[#0c4a6e] h-24 rounded-lg overflow-hidden flex flex-col relative">
                 {/* Grid Lines Background */}
                 <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
                 
                 {/* Screen Content */}
                 <div className="relative z-10 p-3 flex justify-between items-center h-full">
                    
                    {/* Level Indicator Circle */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                           <circle cx="28" cy="28" r="24" stroke="rgba(125, 211, 252, 0.2)" strokeWidth="3" fill="none" />
                           <circle cx="28" cy="28" r="24" stroke="#7dd3fc" strokeWidth="3" fill="none" strokeDasharray="150" strokeDashoffset="40" strokeLinecap="round" className="drop-shadow-[0_0_3px_#7dd3fc]" />
                        </svg>
                        <div className="text-center">
                            <span className="block font-pixel text-3xl text-toy-screenText leading-none drop-shadow-[0_0_5px_rgba(125,211,252,0.5)]">1</span>
                        </div>
                    </div>

                    {/* Status Text */}
                    <div className="text-right">
                        <div className="flex justify-end gap-2 mb-1 text-toy-screenText opacity-60">
                            <Signal size={12} />
                            <BatteryMedium size={12} />
                        </div>
                        <h2 className="font-pixel text-xl text-toy-screenText tracking-widest mb-0.5">SCANNING</h2>
                        <div className="text-[10px] font-toy text-toy-cyan uppercase tracking-wider bg-toy-cyan/10 px-1.5 py-0.5 rounded inline-block">
                            Sector 7G
                        </div>
                    </div>

                 </div>

                 {/* Glossy Screen Reflection */}
                 <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rotate-12" />
               </div>
            </div>

            {/* 
              Middle: Branding/Speaker
            */}
            <div className="flex justify-between items-center px-1 mb-5">
              <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-1 h-1 bg-black/40 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
                 ))}
              </div>
              <span className="font-toy text-toy-screenText/30 text-[10px] tracking-[0.3em] font-bold">FAIRY-X</span>
            </div>

            {/* 
               Bottom Section: The Buttons
               Vibrant Jelly Buttons
            */}
            <div className="flex justify-between items-end mt-auto">
                <GlowingButton 
                  id="btn-1" 
                  icon={Radar} 
                  isActive={true} 
                  isLocked={false} 
                  color="yellow"
                />
                <GlowingButton 
                  id="btn-2" 
                  icon={Search} 
                  isActive={false} 
                  isLocked={false} 
                  color="magenta"
                />
                <GlowingButton 
                  id="btn-3" 
                  icon={Map} 
                  isActive={false} 
                  isLocked={true} 
                  color="cyan"
                />
                <GlowingButton 
                  id="btn-4" 
                  icon={Backpack} 
                  isActive={false} 
                  isLocked={true} 
                  color="white"
                />
             </div>
          </div>
          
          {/* Main Case Reflection */}
          <div className="absolute top-0 left-4 right-4 h-12 bg-white/5 rounded-b-[20px] blur-[10px] pointer-events-none" />
        </div>
    </div>
  );
};