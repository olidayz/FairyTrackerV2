import React from 'react';
import { X, Play, Camera, Database, MessageCircle, Scan, Radio, Battery, Wifi, Maximize2 } from 'lucide-react';

interface MissionModalProps {
  stage: any;
  onClose: () => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({ stage, onClose }) => {
  if (!stage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in perspective-1000">
      {/* Backdrop with heavy blur */}
      <div 
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl transition-opacity" 
        onClick={onClose}
      />

      {/* Main Device Container */}
      <div className="relative w-full max-w-2xl transform transition-all animate-scale-up group">
        
        {/* === GLOWING RAINBOW EDGE LAYERS === */}
        {/* 1. The Blur/Glow Layer */}
        <div 
            className="absolute -inset-[5px] rounded-[2.8rem] bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-cyan-500 to-fuchsia-500 opacity-60 blur-xl animate-gradient-move" 
            style={{ backgroundSize: '400% 400%', animationDuration: '3s' }} 
        />
        
        {/* 2. The Sharp Border Layer */}
        <div 
            className="absolute -inset-[2px] rounded-[2.6rem] bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-cyan-500 to-fuchsia-500 opacity-100 animate-gradient-move" 
            style={{ backgroundSize: '400% 400%', animationDuration: '3s' }} 
        />

        {/* Decorative Elements sticking out - preserved but behind card */}
        <div className="absolute -top-3 left-10 w-20 h-4 bg-cyan-500/20 rounded-t-lg border-t border-x border-cyan-500/50 backdrop-blur-sm z-0" />
        <div className="absolute -bottom-3 right-10 w-32 h-4 bg-fuchsia-500/20 rounded-b-lg border-b border-x border-fuchsia-500/50 backdrop-blur-sm z-0" />

        {/* The Card Itself */}
        <div className="relative z-10 bg-[#090e1a] rounded-[2.5rem] border border-slate-700 shadow-[0_20px_60px_-15px_rgba(0,0,0,1),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* === HEADER: DRONE FEED === */}
            <div className="relative h-72 shrink-0 bg-black group overflow-hidden">
                {/* Image */}
                <img 
                  src={stage.videoThumbnail} 
                  alt="Feed" 
                  className="w-full h-full object-cover opacity-80 mix-blend-screen group-hover:scale-105 transition-transform duration-700"
                />
                {/* Scanlines & Grain */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-transparent to-transparent z-10" />

                {/* HUD Overlay */}
                <div className="absolute inset-0 p-6 z-20 flex flex-col justify-between pointer-events-none">
                    {/* Top Bar */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                                <span className="font-mono text-red-500 font-bold tracking-widest text-xs">LIVE FEED</span>
                             </div>
                             <span className="font-mono text-cyan-500/70 text-[10px]">CAM-04 // {stage.location.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-cyan-500/70">
                            <Wifi size={14} />
                            <Battery size={14} />
                            <span className="font-mono text-xs">98%</span>
                        </div>
                    </div>

                    {/* Center Play Trigger (Interactive) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                         <button className="group/play relative w-20 h-20 flex items-center justify-center">
                             <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping-slow" />
                             <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full scale-100 group-hover/play:scale-110 transition-transform duration-300" />
                             <div className="w-14 h-14 bg-cyan-500/90 backdrop-blur-md rounded-full flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover/play:bg-cyan-400 transition-colors">
                                 <Play size={24} className="text-black fill-black" />
                             </div>
                         </button>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex justify-between items-end">
                        <div className="font-mono text-[10px] text-white/50 space-y-0.5">
                            <div>ISO 800</div>
                            <div>F/2.8</div>
                            <div>1/60</div>
                        </div>
                        <Maximize2 size={16} className="text-white/50" />
                    </div>
                </div>
            </div>

            {/* === BODY CONTENT === */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8 space-y-6 relative">
                 {/* Background Grid */}
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                      style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
                 />

                 {/* 1. DECODED TRANSMISSION */}
                 <div className="relative pl-6 py-1">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-fuchsia-500 rounded-full" />
                     <div className="flex items-center gap-2 mb-2">
                        <MessageCircle size={14} className="text-cyan-400" />
                        <span className="font-mono text-[10px] text-cyan-400 tracking-[0.2em] uppercase">Incoming Transmission</span>
                     </div>
                     <h2 className="font-header text-2xl md:text-3xl text-white leading-tight mb-2 drop-shadow-lg">
                        "{stage.message}"
                     </h2>
                     <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
                           SECURE_CHANNEL
                        </div>
                     </div>
                 </div>

                 {/* 2. DATA GRID */}
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                     
                     {/* LEFT: VISUAL PROOF (2 cols) */}
                     <div className="md:col-span-2 space-y-2">
                         <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">Visual Log</div>
                         <div className="relative aspect-[4/5] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 group hover:border-yellow-500/50 transition-colors duration-300 shadow-lg">
                             <img src={stage.selfieImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Selfie" />
                             {/* Overlay UI */}
                             <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                 <div className="flex items-center gap-2 text-yellow-400">
                                     <Camera size={14} />
                                     <span className="font-mono text-[10px] font-bold">IMG_0042.RAW</span>
                                 </div>
                             </div>
                             {/* Sticker */}
                             <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                                <span className="text-black text-xs font-bold">:)</span>
                             </div>
                         </div>
                     </div>

                     {/* RIGHT: ITEM ANALYSIS (3 cols) */}
                     <div className="md:col-span-3 space-y-2 flex flex-col">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">Item Analysis</div>
                        <div className="flex-1 bg-[#0f1629] rounded-2xl border border-slate-700 relative overflow-hidden flex items-center justify-center p-6 group hover:border-fuchsia-500/50 transition-colors duration-300 shadow-inner">
                            {/* Holographic Grid Floor */}
                            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[linear-gradient(transparent,rgba(232,121,249,0.1))] transform perspective-[500px] rotate-x-[60deg]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,121,249,0.1),transparent_70%)]" />

                            {/* Floating Item */}
                            <div className="relative z-10 w-32 h-32 animate-float drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
                                <img src={stage.objectImage} className="w-full h-full object-contain" alt="Object" />
                            </div>

                            {/* Scanning Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500 shadow-[0_0_15px_#d946ef] animate-scan opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Data Tags */}
                            <div className="absolute top-4 left-4 font-mono text-[9px] text-fuchsia-500/60 space-y-1">
                                <div>MASS: 0.4g</div>
                                <div>TYPE: ORGANIC</div>
                                <div>VAL: HIGH</div>
                            </div>
                            
                            <div className="absolute bottom-4 right-4 bg-fuchsia-500/10 border border-fuchsia-500/30 px-2 py-1 rounded text-[10px] text-fuchsia-300 font-mono flex items-center gap-1">
                                <Database size={10} /> ARCHIVED
                            </div>
                        </div>
                     </div>
                 </div>

                 {/* ACTION BUTTON */}
                 <button 
                    onClick={onClose}
                    className="w-full group relative py-4 bg-slate-800 hover:bg-slate-700 rounded-xl overflow-hidden border border-slate-600 transition-all duration-300 shadow-lg active:scale-[0.98]"
                 >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                    <div className="relative flex items-center justify-center gap-3">
                        <span className="font-header text-white tracking-[0.2em] uppercase">Save to Archives</span>
                        <div className="bg-green-500/20 p-1 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                        </div>
                    </div>
                 </button>

            </div>

            {/* === CLOSE BUTTON (FLOATING) === */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-red-500/20 hover:border-red-500 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-red-400 transition-all duration-200 group"
            >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
        </div>
      </div>
    </div>
  );
};