import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon, Play, Radio, X, Clock } from 'lucide-react';

interface StageCardProps {
   stage: {
      id: number;
      title: string;
      subtext: string;
      icon: LucideIcon;
      message: string;
      location: string;
      cardImage: string;
      videoThumbnail?: string;
      selfieImage?: string;
      color?: string;
   };
   isActive: boolean;
   isLocked: boolean;
   isCompleted: boolean;
   onClick: () => void;
   onNext?: () => void;
   isLastStage?: boolean;
   index: number;
}

export const StageCard: React.FC<StageCardProps> = ({
   stage, isActive, isLocked, isCompleted, onClick, onNext, isLastStage, index
}) => {
   const [isFlipped, setIsFlipped] = useState(false);
   const [isHovered, setIsHovered] = useState(false);
   const [showContent, setShowContent] = useState(false);

   const frontRef = useRef<HTMLDivElement>(null);
   const backRef = useRef<HTMLDivElement>(null);

   const isInverted = index % 2 !== 0;

   const colors = [
      { ring: 'ring-cyan-500', button: 'from-cyan-400 to-blue-500', badge: 'bg-cyan-500', badgeBorder: 'border-cyan-300', gradient: 'from-cyan-400 via-blue-500 to-purple-500' },
      { ring: 'ring-fuchsia-500', button: 'from-fuchsia-500 to-purple-600', badge: 'bg-fuchsia-500', badgeBorder: 'border-fuchsia-300', gradient: 'from-fuchsia-400 via-pink-500 to-orange-400' },
      { ring: 'ring-amber-500', button: 'from-amber-400 to-orange-500', badge: 'bg-amber-500', badgeBorder: 'border-amber-300', gradient: 'from-amber-400 via-orange-500 to-red-500' },
   ];
   const theme = colors[index % colors.length];

   useEffect(() => {
      if (isFlipped) {
         setTimeout(() => setShowContent(true), 300);
      } else {
         setShowContent(false);
      }
   }, [isFlipped]);

   const handleFlip = () => { if (!isLocked) setIsFlipped(true); };
   const handleFlipBack = () => setIsFlipped(false);

   return (
      <div className="relative w-full mb-16 md:mb-24" style={{ perspective: '1500px' }}>
         <div
            className="relative w-full transition-all duration-700 ease-out overflow-visible"
            style={{
               transformStyle: 'preserve-3d',
               transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
         >
            {/* ===== FRONT FACE ===== */}
            <div
               ref={frontRef}
               className={`w-full cursor-pointer group ${isFlipped ? 'absolute inset-0 pointer-events-none' : ''}`}
               style={{ backfaceVisibility: 'hidden' }}
               onClick={handleFlip}
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}
            >
               <div className={`rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/90 ring-4 ${theme.ring}/40 overflow-visible shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative`}>
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-[2rem]" />
                  <div className={`relative h-[480px] md:h-96 flex flex-col ${isInverted ? 'md:flex-row-reverse' : 'md:flex-row'} items-center p-6 md:p-10 z-10`}>
                     <div className={`flex-1 flex flex-col items-center text-center ${isInverted ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} space-y-1 md:space-y-6 w-full pt-4 md:pt-0`}>
                        <div className={`absolute -top-5 left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:inline-block px-5 py-1.5 ${theme.badge} text-white border-2 ${theme.badgeBorder} shadow-lg rounded-lg transform -rotate-2 group-hover:rotate-0 transition-transform z-50`}>
                           <span className="font-sans font-bold text-xs text-white uppercase tracking-widest drop-shadow-md flex items-center gap-2">
                              <Radio size={14} className="text-white animate-pulse" /> New Update
                           </span>
                        </div>
                        <h2 className={`font-chrome text-6xl md:text-7xl uppercase tracking-normal drop-shadow-[0_4px_0_rgba(0,0,0,1)] transform skew-x-[-6deg] transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}>
                           <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200">
                              {stage.title.split(' ').map((word, i) => (<React.Fragment key={i}>{i > 0 && <br />}{word}</React.Fragment>))}
                           </span>
                        </h2>
                        <div className={`relative group/btn z-50 bg-gradient-to-r ${theme.button} border-b-[6px] border-black/20 rounded-xl px-8 py-3 md:px-10 md:py-4 transform transition-all duration-200 shadow-xl hover:-translate-y-1 hover:border-b-[8px] active:translate-y-1 active:border-b-0`}>
                           <div className="flex items-center gap-2">
                              <span className="font-sans font-black text-sm md:text-lg uppercase tracking-widest text-white drop-shadow-sm">Tap To Reveal</span>
                              <Play size={20} className="text-white fill-current" />
                           </div>
                        </div>
                     </div>
                     <div className="relative w-full md:w-[45%] h-[240px] md:h-full mt-8 md:mt-0 flex items-center justify-center">
                        <div className={`relative w-[90%] md:w-full aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden ring-4 ${theme.ring} shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all duration-700 ease-out ${isInverted ? `rotate-3 md:-rotate-3 translate-y-4 md:translate-x-8 ${isHovered ? 'scale-110 -rotate-2 shadow-2xl' : ''}` : `-rotate-3 md:rotate-3 translate-y-4 md:-translate-x-8 ${isHovered ? 'scale-110 rotate-2 shadow-2xl' : ''}`} group-hover:z-50 bg-slate-800`}>
                           <img src={stage.cardImage} alt={stage.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* ===== BACK FACE ===== */}
            <div
               ref={backRef}
               className={`w-full ${!isFlipped ? 'absolute inset-0 pointer-events-none' : ''}`}
               style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
               <div className={`rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/90 ring-4 ${theme.ring}/60 overflow-visible shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative`}>
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-[2rem]" />

                  {/* Close Button - Hangs on corner */}
                  <button
                     onClick={handleFlipBack}
                     className={`absolute -top-3 -right-3 z-[60] w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full border-2 border-white/30 flex items-center justify-center text-white transition-all shadow-xl hover:scale-110 ${showContent ? 'opacity-100' : 'opacity-0'}`}
                  >
                     <X size={20} />
                  </button>


                  {/* Title - Top center, hanging */}
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                     <h2 className="font-chrome text-2xl md:text-3xl text-white uppercase drop-shadow-lg bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-white/20">
                        {stage.title}
                     </h2>
                  </div>

                  {/* Layout: Vertical HUD */}
                  <div className="relative min-h-[520px] md:min-h-[460px] flex flex-col items-center p-6 md:p-8 z-10 gap-6">

                     {/* 1. TOP SECTION: Video Hero + Overlapping Message */}
                     <div className="relative w-full max-w-2xl group">
                        {/* Video - Centered and Large */}
                        <div className={`relative w-full aspect-video rounded-3xl overflow-hidden ring-4 ${theme.ring} shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out bg-slate-800 cursor-pointer ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}`}>
                           <img src={stage.videoThumbnail || stage.cardImage} alt="Video" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                           {/* Play Button */}
                           <div className="absolute inset-0 flex items-center justify-center">
                              <button className="w-14 h-14 md:w-16 md:h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center pl-1 shadow-2xl hover:scale-110 transition-transform ring-4 ring-white/30">
                                 <Play size={24} className="text-slate-900 fill-slate-900" />
                              </button>
                           </div>

                           {/* Live Badge */}
                           <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 px-2 py-1 rounded-full shadow-lg">
                              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                              <span className="text-[9px] font-bold text-white uppercase">Live</span>
                           </div>
                        </div>

                        {/* Message - Overlaps bottom center of video */}
                        <div className={`absolute -bottom-6 md:-bottom-6 bottom-[-3rem] left-1/2 -translate-x-1/2 w-full max-w-sm px-4 transition-all duration-500 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                           <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-2xl transform -rotate-1 border border-white/20">
                              <div className="flex items-start gap-3">
                                 <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-400 flex-shrink-0">
                                    <img src="/PFP FULL SIZE KIKI 1.png" className="w-full h-full object-cover" alt="Kiki" />
                                 </div>
                                 <div className="flex-1">
                                    <p className="font-sans text-slate-700 text-sm leading-snug line-clamp-3">
                                       "{stage.message}"
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* 2. BOTTOM SECTION: Mission Control Style Boxes */}
                     <div className={`w-full max-w-2xl mx-auto mt-16 md:mt-8 flex flex-col md:flex-row items-center md:items-start gap-6 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                         {/* Left Column: Map + Status stacked */}
                         <div className="w-full md:w-auto flex flex-row md:flex-col gap-3">
                            {/* Box 1: Live Map - Rectangular */}
                            <div className="flex-1 relative group/map">
                               {/* Floating Badge */}
                               <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.5)] border border-white/50 whitespace-nowrap">
                                     <h4 className="font-chrome text-[10px] text-white uppercase tracking-wide">Location</h4>
                                  </div>
                               </div>

                               {/* Card Body - Rectangular */}
                               <div className="w-full h-[122px] md:w-32 md:h-32 bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] ring-4 ring-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.2)] overflow-hidden flex items-center justify-center">
                                  <div className="relative w-full h-full bg-slate-800/50">
                                     <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-slate-900/40" />
                                     <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-50" />
                                        <div className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                                     </div>
                                     <div className="absolute bottom-1 left-0 right-0 text-center">
                                        <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-tighter opacity-80">Sync Active</span>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            {/* Box 2: Status */}
                            <div className="flex-1 relative group/status">
                               {/* Floating Badge */}
                               <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                                  <div className="bg-gradient-to-r from-fuchsia-400 to-purple-500 px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(192,38,211,0.5)] border border-white/50 whitespace-nowrap">
                                     <h4 className="font-chrome text-[10px] text-white uppercase tracking-wide">Status</h4>
                                  </div>
                               </div>

                               {/* Card Body */}
                               <div className="w-full h-[122px] md:w-32 md:h-32 bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] ring-4 ring-fuchsia-500/50 shadow-[0_0_30px_rgba(192,38,211,0.2)] overflow-hidden flex items-center justify-center">
                                  <div className="flex items-center gap-2">
                                     <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                                     <span className="text-sm font-bold text-white uppercase">In Progress</span>
                                  </div>
                               </div>
                            </div>
                         </div>


                         {/* Box 3: Fairy Selfie - Same total height as left column */}
                         <div className="w-full md:flex-1 relative group/selfie">
                            {/* Floating Badge */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                               <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1.5 rounded-lg transform rotate-1 shadow-[0_0_20px_rgba(251,191,36,0.5)] border border-white/40 whitespace-nowrap">
                                  <h4 className="font-chrome text-xs text-white uppercase tracking-widest">Fairy Selfie</h4>
                               </div>
                            </div>

                            {/* Card Body - Fixed height matching left column total */}
                            <div className="aspect-video md:aspect-auto md:h-[268px] bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] ring-4 ring-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.2)] overflow-hidden">
                               <img src={stage.selfieImage || stage.cardImage} alt="Selfie" className="w-full h-full object-cover" />
                            </div>
                         </div>

                     </div>

                      {/* Scroll to Next Update Indicator - Hangs off bottom */}
                      <div 
                         className={`absolute -bottom-5 left-1/2 -translate-x-1/2 z-50 cursor-pointer transition-all duration-500 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                         onClick={onNext}
                      >
                         <div className="animate-[bounce_2s_ease-in-out_infinite]">
                            <div className={`${isLastStage ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-lime-400 to-green-500'} px-4 py-1.5 rounded-lg shadow-lg border-2 border-white/30 hover:scale-105 transition-transform flex items-center justify-center`}>
                               <span className="font-chrome text-white text-[11px] uppercase tracking-wide leading-none">
                                  {isLastStage ? 'Check back in the morning ☀️' : 'Next Update ↓'}
                               </span>
                            </div>
                         </div>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};