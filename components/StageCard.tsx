import React from 'react';
import { LucideIcon, Radio, Play } from 'lucide-react';
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
  
  const isInverted = index % 2 !== 0;

  return (
    // WRAPPER
    <div className="relative w-full mb-24 md:mb-40 cursor-pointer group" onClick={onClick}>
       
       <BackgroundGradient containerClassName="rounded-[2.5rem]" className="rounded-[2.5rem] bg-gradient-to-br from-indigo-950 via-[#1e1b4b] to-[#312e81] h-full p-0">
          
          {/* Card Body */}
          {/* Reduced Mobile Height to 440px to fix "excessive length" */}
          <div className="relative h-[440px] md:h-96 rounded-[2.5rem] overflow-visible">
            
            {/* Grid/Texture Backgrounds */}
            <div className="absolute inset-0 opacity-30 rounded-[2.5rem] overflow-hidden pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
            />
            <div className="absolute inset-0 opacity-10 pointer-events-none rounded-[2.5rem] overflow-hidden bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#22d3ee_3px)]" />

            {/* === CONTENT CONTAINER === */}
            <div className={`
                relative h-full flex p-6 md:p-12
                flex-col
                ${isInverted ? 'md:flex-row-reverse' : 'md:flex-row'}
            `}>
               
               {/* === TEXT SECTION === */}
               <div className={`
                   relative z-40 flex flex-col 
                   /* Mobile: Centered items */
                   items-center text-center
                   w-full md:flex-1 md:w-auto
                   pt-2 md:pt-0
                   
                   /* DESKTOP Alignment Logic (Overrides Mobile) */
                   ${isInverted ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}
               `}>
                   
                   {/* Badge - Full width on mobile */}
                   <div className={`
                      mb-2 md:mb-4 
                      w-full flex justify-center md:w-auto md:inline-flex
                   `}>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-400 text-black rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-pulse border-2 border-white transform -skew-x-6">
                        <Radio size={12} className="fill-current animate-ping-slow" /> 
                        New Update
                      </div>
                   </div>

                   {/* TITLE */}
                   {/* Added overflow-visible explicitly */}
                   <div className="relative w-full overflow-visible pb-2 md:pb-4">
                       <h2 className={`
                           font-header text-white uppercase italic leading-[0.9] tracking-tighter 
                           drop-shadow-[0_4px_0_rgba(0,0,0,1)] transform skew-x-[-6deg]
                           text-5xl sm:text-6xl md:text-7xl
                           
                           /* DESKTOP Alignment (Mobile is centered by parent flex-col items-center) */
                           ${isInverted ? 'md:ml-auto' : 'md:mr-auto'}
                       `}>
                          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 decoration-clone py-2 block px-1">
                            {stage.title.split(' ').map((word, i) => (
                               <React.Fragment key={i}>
                                  {i > 0 && <br />}
                                  {word}
                               </React.Fragment>
                            ))}
                          </span>
                       </h2>
                   </div>

                   {/* BUTTON - Full width on mobile */}
                   <div className={`
                       mt-2 md:mt-6
                       w-full flex justify-center md:w-auto md:inline-flex
                       relative z-50
                   `}>
                      <div className={`
                         relative flex items-center justify-center gap-3
                         w-full md:w-auto
                         bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 
                         text-white 
                         border-b-[6px] border-blue-900 
                         px-8 py-3 md:px-12 md:py-5 
                         rounded-2xl
                         font-header text-sm md:text-lg tracking-[0.15em] uppercase 
                         transition-all duration-300 
                         shadow-[0_10px_30px_-10px_rgba(6,182,212,0.8)] 
                         hover:scale-105 hover:-translate-y-1
                         active:border-b-0 active:translate-y-1
                         ring-2 ring-white/20
                      `}>
                        <span className="drop-shadow-md whitespace-nowrap">Tap To Reveal</span> 
                        <div className="bg-white/20 p-1.5 rounded-xl backdrop-blur-sm">
                          <Play size={16} className="fill-current animate-pulse" />
                        </div>
                      </div>
                   </div>
               </div>

               {/* SPACER (Desktop Only) */}
               <div className="hidden md:block md:w-[40%] shrink-0" /> 
            </div>

            {/* === POP-OUT IMAGE === */}
            <div className={`
                absolute z-30 transform transition-all duration-500 ease-out
                hover:scale-105 hover:z-50
                shadow-2xl

                /* MOBILE POSITIONS: Centered Bottom */
                bottom-[-30px] w-[80%] h-[220px]
                left-1/2 -translate-x-1/2
                rotate-[-2deg]

                /* DESKTOP POSITIONS (Overrides) */
                md:translate-x-0 
                md:top-[-10%] md:bottom-[-10%] md:h-auto md:w-[35%]
                ${isInverted 
                   ? 'md:left-10 md:right-auto md:-rotate-2' 
                   : 'md:right-10 md:left-auto md:rotate-2'
                }
            `}>
                {/* Polaroid Frame */}
                <div className="w-full h-full p-3 bg-white rounded-2xl shadow-2xl relative border-b-8 border-r-8 border-slate-300 flex flex-col">
                   {/* Image Container */}
                   <div className="w-full flex-1 bg-slate-900 rounded-xl overflow-hidden relative shadow-inner">
                      <img src={stage.cardImage} alt={stage.title} className="w-full h-full object-cover filter contrast-125 saturate-125" />
                      
                      {/* Gloss Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent mix-blend-overlay" />
                   </div>
                </div>
            </div>

          </div>
       </BackgroundGradient>

    </div>
  );
};