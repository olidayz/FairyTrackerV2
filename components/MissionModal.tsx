import React, { useState } from 'react';
import { X, Play, ChevronsRight } from 'lucide-react';

interface MissionModalProps {
    stage: any;
    onClose: () => void;
    onNext?: () => void;
    isLastStage?: boolean;
}

export const MissionModal: React.FC<MissionModalProps> = ({ stage, onClose, onNext, isLastStage }) => {
    const [showSelfie, setShowSelfie] = useState(false);

    if (!stage) return null;

    const handleNext = () => {
        if (onNext && !isLastStage) {
            onNext();
        } else {
            onClose();
        }
    };

    // Selfie fullscreen view
    if (showSelfie) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
                <div className="absolute inset-0 bg-black/95" onClick={() => setShowSelfie(false)} />
                <div className="relative max-w-md w-full animate-scale-up">
                    <button
                        onClick={() => setShowSelfie(false)}
                        className="absolute -top-2 -right-2 z-50 w-10 h-10 bg-slate-800 hover:bg-red-500 rounded-full border-2 border-white/20 flex items-center justify-center text-white transition-all shadow-xl"
                    >
                        <X size={20} />
                    </button>
                    <div className="p-[3px] rounded-[2rem] bg-gradient-to-r from-amber-400 via-pink-500 to-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.4)]">
                        <img
                            src={stage.selfieImage}
                            className="w-full rounded-[1.85rem]"
                            alt="Kiki's Selfie"
                        />
                    </div>
                    <div className="text-center mt-4">
                        <span className="font-sans font-bold text-white text-lg">Kiki's Selfie</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl"
                onClick={onClose}
            />

            {/* Main Container */}
            <div className="relative w-full max-w-lg animate-scale-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 z-50 w-10 h-10 bg-slate-800 hover:bg-red-500 rounded-full border-2 border-white/20 flex items-center justify-center text-white transition-all shadow-xl"
                >
                    <X size={20} />
                </button>

                {/* Card with Ring Accent - Matching NeonPanel Style */}
                <div className="relative rounded-[2rem] bg-slate-950 ring-4 ring-cyan-400/60 overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.3),0_25px_50px_rgba(0,0,0,0.5)]">

                    {/* 1. VIDEO SECTION */}
                    <div className="relative aspect-video overflow-hidden">
                        <img
                            src={stage.videoThumbnail}
                            alt="Video"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center pl-1 shadow-2xl hover:scale-110 transition-transform">
                                <Play size={28} className="text-slate-900 fill-slate-900" />
                            </button>
                        </div>

                        <div className="absolute top-4 left-4">
                            <div className={`bg-gradient-to-r ${stage.color || 'from-cyan-400 to-blue-500'} px-4 py-2 rounded-xl transform -rotate-2 shadow-xl border-2 border-white/50`}>
                                <span className="font-chrome text-sm text-white uppercase tracking-wide">
                                    Stage {stage.id}
                                </span>
                            </div>
                        </div>

                        {/* Status Badge - Header Style */}
                        <div className="absolute top-4 right-4">
                            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
                                <span className={`text-[10px] font-sans font-bold uppercase ${stage.id <= 3 ? 'text-amber-400' : 'text-green-400'}`}>
                                    {stage.id <= 3 ? 'In Flight' : 'Complete'}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${stage.id <= 3 ? 'bg-amber-400 animate-pulse' : 'bg-green-400'} shadow-[0_0_8px_currentColor]`} />
                            </div>
                        </div>
                    </div>

                    {/* 2. CONTENT SECTION */}
                    <div className="p-6 space-y-5">

                        {/* Title Only */}
                        <div className="text-center">
                            <h2 className="font-chrome text-2xl md:text-3xl text-white uppercase tracking-wide mb-1">
                                {stage.title}
                            </h2>
                        </div>

                        {/* Message Bubble */}
                        <div className="bg-white rounded-2xl p-4 shadow-lg relative">
                            <p className="font-sans text-slate-700 text-sm md:text-base leading-relaxed">
                                "{stage.message}"
                            </p>
                            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45" />
                        </div>

                        {/* Kiki Avatar */}
                        <div className="flex items-center gap-3 pl-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-400 shadow-lg">
                                <img src="/PFP FULL SIZE KIKI 1.png" className="w-full h-full object-cover" alt="Kiki" />
                            </div>
                            <span className="font-sans font-bold text-sm text-white">Kiki</span>
                        </div>

                        {/* 2-Column Grid: Selfie & Location */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* 1. Selfie Button */}
                            <button
                                onClick={() => setShowSelfie(true)}
                                className="group relative rounded-2xl overflow-hidden ring-4 ring-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.3)] hover:ring-amber-400 hover:scale-[1.02] transition-all duration-300 active:scale-100"
                            >
                                <div className="aspect-square relative flex items-center justify-center bg-slate-900">
                                    <img src={stage.selfieImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Selfie" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-0 right-0 text-center">
                                        <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                            <span className="text-lg">📸</span>
                                            <span className="font-sans font-bold text-[10px] text-white">View Selfie</span>
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {/* 2. Location Card */}
                            <div className="rounded-2xl ring-4 ring-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.3)] bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden relative group">
                                {/* Map Background Pattern */}
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mb-2 animate-pulse-slow">
                                        <span className="text-xl">📍</span>
                                    </div>
                                    <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1">Location</div>
                                    <div className="font-chrome text-sm md:text-base text-cyan-400 uppercase leading-tight line-clamp-2">
                                        {stage.location}
                                    </div>
                                    <div className="mt-2 text-[9px] font-mono text-cyan-500/70">
                                        LAT: {40 + stage.id * 2}.492<br />
                                        LON: {70 - stage.id * 3}.104
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* CTA Button - Next Stage, Stage 3 special, or Done */}
                        <button
                            onClick={handleNext}
                            className={`w-full py-4 rounded-xl font-sans font-extrabold text-base uppercase tracking-tight shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-1 flex items-center justify-center gap-2 ${stage.id === 3
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 border-b-[4px] border-[#c2410c] active:border-b-0 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 border-b-[4px] border-[#1e40af] active:border-b-0 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                } text-white`}
                        >
                            <span>
                                {isLastStage
                                    ? 'Done!'
                                    : stage.id === 3
                                        ? '🌙 Check Back Tomorrow Morning!'
                                        : 'Next Stage'}
                            </span>
                            <ChevronsRight size={20} />
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};