import React, { useState } from 'react';
import { LucideIcon, Play, Radio } from 'lucide-react';
import { BackgroundGradient } from './ui/background-gradient';

interface StageCardProps {
   stage: {
      id: number;
      title: string;
      subtext: string;
      icon: LucideIcon;
      message: string;
      location: string;
      cardImage: string;
   };
   isActive: boolean;
   isLocked: boolean;
   isCompleted: boolean;
   onClick: () => void;
   index: number;
}

export const StageCard: React.FC<StageCardProps> = ({
   stage, isActive, isLocked, isCompleted, onClick, index
}) => {
   const [isHovered, setIsHovered] = useState(false);
   const isInverted = index % 2 !== 0;

   // Define colors based on index for variety
   const colors = [
      {
         glow: 'shadow-cyan-500/40',
         ring: 'ring-cyan-500',
         border: 'from-cyan-400 via-blue-500 to-cyan-400',
         button: 'from-cyan-400 to-blue-500',
         icon: 'text-cyan-500',
         badge: 'bg-cyan-500',
         badgeBorder: 'border-cyan-300'
      },
      {
         glow: 'shadow-fuchsia-500/40',
         ring: 'ring-fuchsia-500',
         border: 'from-fuchsia-400 via-pink-500 to-fuchsia-400',
         button: 'from-fuchsia-500 to-purple-600',
         icon: 'text-fuchsia-100',
         badge: 'bg-fuchsia-500',
         badgeBorder: 'border-fuchsia-300'
      },
      {
         glow: 'shadow-amber-500/40',
         ring: 'ring-amber-500',
         border: 'from-amber-400 via-orange-500 to-amber-400',
         button: 'from-amber-400 to-orange-500',
         icon: 'text-amber-100',
         badge: 'bg-amber-500',
         badgeBorder: 'border-amber-300'
      },
   ];
   const theme = colors[index % colors.length];

   // Ensure play icon matches text color (white)
   const iconColor = 'text-white';

   return (
      <div
         className="relative w-full mb-16 md:mb-24 cursor-pointer group perspective-1000"
         onClick={onClick}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         {/* === MAIN CARD CONTAINER with RICH BACKGROUND === */}
         <BackgroundGradient containerClassName="rounded-[2.5rem]" className="rounded-[2.5rem] bg-gradient-to-br from-indigo-950 via-[#1e1b4b] to-[#312e81] h-full p-0 relative overflow-visible">

            {/* Background Texture/Effects */}
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-20" />
               <div className="absolute inset-0 opacity-[0.1]"
                  style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
               />
               <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
            </div>

            {/* === CONTENT LAYOUT === */}
            <div className={`relative h-[480px] md:h-96 flex flex-col ${isInverted ? 'md:flex-row-reverse' : 'md:flex-row'} items-center p-6 md:p-10 z-10`}>

               {/* TEXT SIDE */}
               <div className={`
                        flex-1 flex flex-col 
                        items-center text-center
                        ${isInverted ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}
                        space-y-1 md:space-y-6
                        w-full
                        pt-4 md:pt-0
                    `}>
                  {/* 1. Status Badge - DYNAMIC Style (Floating on Mobile) */}
                  <div className={`
                            absolute -top-5 left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:inline-block
                            px-5 py-1.5 
                            ${theme.badge} text-white 
                            border-2 ${theme.badgeBorder} 
                            shadow-lg rounded-lg
                            transform -rotate-2 group-hover:rotate-0 transition-transform
                            z-50
                        `}>
                     <span className="font-sans font-bold text-xs text-white uppercase tracking-widest drop-shadow-md flex items-center gap-2">
                        <Radio size={14} className="text-white animate-pulse" />
                        New Update
                     </span>
                  </div>

                  {/* 2. Main Title - NO ITALIC */}
                  <h2 className={`
                            font-chrome text-6xl md:text-7xl uppercase tracking-normal
                            drop-shadow-[0_4px_0_rgba(0,0,0,1)]
                            transform skew-x-[-6deg]
                            transition-all duration-300
                            ${isHovered ? 'scale-105' : 'scale-100'}
                        `}>
                     <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200">
                        {stage.title.split(' ').map((word, i) => (
                           <React.Fragment key={i}>
                              {i > 0 && <br />}
                              {word}
                           </React.Fragment>
                        ))}
                     </span>
                  </h2>

                  {/* 3. Button - BLUE GRADIENT */}
                  <div className={`
                            relative group/btn z-50
                            bg-gradient-to-r ${theme.button}
                            border-b-[6px] border-black/20
                            rounded-xl
                            px-8 py-3 md:px-10 md:py-4
                            transform transition-all duration-200
                            shadow-xl
                            hover:-translate-y-1 hover:border-b-[8px]
                            active:translate-y-1 active:border-b-0
                        `}>
                     <div className="flex items-center gap-2">
                        <span className="font-sans font-black text-sm md:text-lg uppercase tracking-widest text-white drop-shadow-sm">
                           Tap To Reveal
                        </span>
                        {/* Play icon matches text color (white) */}
                        <Play size={20} className="text-white fill-current" />
                     </div>
                  </div>

               </div>


               {/* IMAGE SIDE (Floating Pop-out) */}
               <div className={`
                        relative w-full md:w-[45%] h-[240px] md:h-full
                        mt-8 md:mt-0
                        flex items-center justify-center
                        perspective-1000
                    `}>
                  <div className={`
                            relative w-[90%] md:w-full aspect-[4/3] md:aspect-square
                            rounded-3xl overflow-hidden
                            ring-4 ${theme.ring} ring-opacity-100
                            shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                            transform transition-all duration-700 ease-out
                            ${isInverted
                        ? `rotate-3 md:-rotate-3 translate-y-4 md:translate-x-8 ${isHovered ? 'scale-110 -rotate-2 shadow-2xl' : ''}`
                        : `-rotate-3 md:rotate-3 translate-y-4 md:-translate-x-8 ${isHovered ? 'scale-110 rotate-2 shadow-2xl' : ''}`
                     }
                            group-hover:z-50
                            bg-slate-800
                        `}>
                     <img
                        src={stage.cardImage}
                        alt={stage.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />

                     {/* Gloss Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                     {/* "Peek" Badge */}
                     <div className={`
                                absolute bottom-4 left-1/2 -translate-x-1/2
                                px-4 py-2 rounded-full
                                bg-black/60 backdrop-blur-md border border-white/20
                                opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0
                            `}>
                        <span className="text-white font-bold text-xs tracking-widest uppercase">Peek Inside</span>
                     </div>
                  </div>
               </div>

            </div>
         </BackgroundGradient>
      </div>
   );
};