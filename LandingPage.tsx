import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles, Moon, Sun, Camera, FileText, Gift, Star, Play, CheckCircle,
    ChevronDown, ChevronsRight, Wind, Activity, Zap, Heart, Shield, Clock,
    Signal, Wifi, Battery, MapPin, Video, MessageCircle
} from 'lucide-react';

import { BackgroundGradient } from './components/ui/background-gradient';

// === ASSETS (Matching Tracker) ===
const IMG_FAIRY = "https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=400&auto=format&fit=crop";
const IMG_NIGHT_SKY = "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=600&auto=format&fit=crop";
const IMG_SUNRISE = "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=600&auto=format&fit=crop";
const IMG_BEDROOM = "https://images.unsplash.com/photo-1505691938895-1758d7bab192?q=80&w=600&auto=format&fit=crop";

// === REUSABLE NEON PANEL (Matching Tracker) ===
interface NeonPanelProps {
    label: string;
    children?: React.ReactNode;
    className?: string;
    borderColor?: string;
    bgColor?: string;
}

const NeonPanel: React.FC<NeonPanelProps> = ({
    label,
    children,
    className = "",
    borderColor = "border-cyan-500",
    bgColor = "bg-slate-900",
}) => (
    <div className={`relative group ${className}`}>
        <div className="absolute inset-0 rounded-2xl p-[1px] shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-purple-500/40 to-amber-500/40 animate-gradient-move" style={{ backgroundSize: '400% 400%' }} />
            <div className={`relative h-full w-full rounded-2xl ${bgColor} flex flex-col overflow-hidden`}>
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                <div className="relative z-10 h-full w-full flex flex-col">{children}</div>
            </div>
        </div>
        <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full z-20 border-2 ${borderColor} ${bgColor}`}>
            <div className="text-[9px] md:text-[10px] text-white font-header tracking-widest uppercase whitespace-nowrap px-1">{label}</div>
        </div>
    </div>
);

// === PHASE DIVIDER (Matching Tracker) ===
const PhaseDivider = ({ phase, title, icon: Icon, color }: { phase: string, title: string, icon: any, color: string }) => (
    <div className="relative py-6 md:py-10 group my-8 md:my-12">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-24 md:h-32 bg-[#020617]/90 skew-x-[-20deg] border-y border-cyan-500/20 blur-[1px] shadow-[0_0_30px_rgba(0,0,0,0.8)]" />
        <div className="relative flex flex-col items-center justify-center z-10 px-4 text-center space-y-2">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-[#0b1221] border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Icon size={16} className={`${color} drop-shadow-[0_0_8px_currentColor]`} />
                </div>
                <div className="px-3 py-1 bg-slate-800 border border-cyan-500/50 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                    <span className="font-mono text-xs md:text-sm text-cyan-300 font-bold tracking-[0.2em] uppercase">{phase}</span>
                </div>
            </div>
            <h2 className="font-header text-4xl md:text-6xl text-white uppercase italic tracking-tighter leading-normal drop-shadow-[0_4px_0_rgba(0,0,0,1)] scale-y-110 py-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-100 pb-2 inline-block">{title}</span>
            </h2>
        </div>
    </div>
);

// === HUD GAUGE (Matching Tracker) ===
const HudGauge = ({ icon: Icon, label, value, color, delay }: any) => (
    <div className="flex flex-col items-center gap-2 group">
        <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border border-white/10 ${color.replace('text-', 'border-')}/30`} />
            <div className="absolute inset-1 rounded-full border border-dashed border-white/20 animate-spin-slow" style={{ animationDuration: '10s', animationDelay: delay }} />
            <div className={`absolute inset-0 rounded-full ${color.replace('text-', 'bg-')}/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity`} />
            <Icon size={20} className={`${color} drop-shadow-[0_0_8px_currentColor]`} />
        </div>
        <div className="text-center">
            <div className={`font-mono text-[9px] uppercase tracking-widest ${color} opacity-80`}>{label}</div>
            <div className="font-header text-xs text-white tracking-wide mt-0.5">{value}</div>
        </div>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [activeCard, setActiveCard] = useState(0);

    const handleEnter = () => navigate('/tracker');
    const toggleFaq = (index: number) => setActiveFaq(activeFaq === index ? null : index);

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* === FIXED BACKGROUND === */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#02040a_100%)]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0, 176, 192, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 176, 192, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative z-10">

                {/* ========== HERO SECTION (Tracker-Style Design) ========== */}
                <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-8 pb-16 px-4 container mx-auto">

                    {/* === TOP SYSTEM BAR === */}
                    <div className="w-full max-w-5xl flex justify-between items-center px-2 md:px-4 mb-12 font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-cyan-500/60 uppercase">
                        {/* Left: Rec */}
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                            <span className="text-red-400/80">LIVE</span>
                        </div>

                        {/* Center: System Status */}
                        <div className="hidden md:block opacity-50 font-mono">
                            TOOTH FAIRY TRACKER 3000
                        </div>

                        {/* Right: Timer & Battery */}
                        <div className="flex items-center gap-4">
                            <span className="font-mono">TONIGHT</span>
                            <div className="flex gap-0.5 items-center opacity-80">
                                <div className="w-4 h-2 border border-current rounded-sm flex items-center px-[1px]">
                                    <div className="w-full h-full bg-current opacity-80" />
                                </div>
                                <div className="w-[1px] h-1 bg-current" />
                            </div>
                        </div>
                    </div>

                    {/* === HERO 1 - BOLD CENTERED DESIGN === */}
                    <div className="flex flex-col items-center text-center w-full max-w-5xl mx-auto">

                        {/* Live Badge */}
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse shadow-[0_0_10px_#a3e635]" />
                            <span className="text-sm font-medium text-white/70">Active Tonight • 2.4M Kids Worldwide</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="font-kinetic text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-[0.85] mb-6">
                            <span className="block text-white">Track Your</span>
                            <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 text-transparent bg-clip-text">Tooth Fairy</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
                            Live GPS tracking, real-time video, and official fairy ID verification.
                            The world's most magical bedtime experience.
                        </p>

                        {/* Single Bold CTA */}
                        <button onClick={handleEnter} className="group relative bg-gradient-to-r from-lime-400 to-lime-500 text-black px-12 py-5 rounded-full font-kinetic text-xl uppercase tracking-wide shadow-[0_0_40px_rgba(163,230,53,0.4)] hover:shadow-[0_0_60px_rgba(163,230,53,0.6)] transition-all duration-300 hover:scale-105 mb-16">
                            <span className="flex items-center gap-3">
                                Start Tracking Free
                                <ChevronsRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        {/* Preview Cards Row */}
                        <div className="relative w-full flex justify-center gap-4 md:gap-6">

                            {/* Card 1: Map */}
                            <div className="relative w-[140px] md:w-[200px] transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
                                <div className="bg-slate-900 rounded-2xl border border-cyan-500/40 overflow-hidden shadow-xl h-[100px] md:h-[140px]">
                                    <div className="absolute inset-0 opacity-40 bg-[linear-gradient(#22d3ee_1px,transparent_1px),linear-gradient(90deg,#22d3ee_1px,transparent_1px)] bg-[size:12px_12px]" />
                                    <svg className="absolute inset-0 w-full h-full">
                                        <path d="M 15 60 Q 50 20 90 50 T 160 30" stroke="#22d3ee" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    </svg>
                                    <div className="absolute top-[35%] left-[55%] w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] animate-pulse" />
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-950/80 rounded-md text-[10px] text-cyan-400 font-bold uppercase">GPS Live</div>
                                </div>
                            </div>

                            {/* Card 2: Video (Center, Larger) */}
                            <div className="relative w-[180px] md:w-[260px] transform hover:scale-105 transition-all duration-300 z-10">
                                <div className="bg-slate-900 rounded-2xl border border-fuchsia-500/40 overflow-hidden shadow-2xl h-[130px] md:h-[180px]">
                                    <img src={IMG_FAIRY} alt="Live Feed" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                            <Play size={20} className="text-white fill-white ml-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-950/80 rounded-md text-[10px] text-fuchsia-400 font-bold uppercase flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Fairy ID */}
                            <div className="relative w-[140px] md:w-[200px] transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
                                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl overflow-hidden shadow-xl h-[100px] md:h-[140px] p-3">
                                    <div className="text-[9px] font-bold text-black/50 uppercase tracking-wider">Fairy ID</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/30">
                                            <img src={IMG_FAIRY} alt="Fairy" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-sm md:text-base font-bold text-white">KIKI</div>
                                            <div className="text-[9px] text-black/60 font-mono">ID: 07-ALPHA</div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs">✓</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ========== HERO V2 - MATCHES TRACKER PAGE ========== */}
                <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-[#020617]">
                    {/* Background Pattern - Same as TrackerPage */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                    <div className="relative z-10 container mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">

                            {/* LEFT SIDE - Text Content */}
                            <div className="order-2 md:order-1 space-y-5">

                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-600">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                                    <span className="text-sm text-white/90">
                                        The World's #1 Tooth Fairy Experience
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="font-header text-4xl sm:text-5xl md:text-[3.5rem] text-white leading-[1.1] tracking-tight">
                                    Gift Them a Tooth<br />
                                    Fairy Night They'll<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Remember Forever</span>
                                </h1>

                                {/* Subtext */}
                                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-md">
                                    A magical experience where the Tooth Fairy sends videos and updates as she flies to pick up their tooth.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={handleEnter}
                                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 active:scale-[0.98] shadow-lg shadow-cyan-500/25"
                                    >
                                        Start the Journey ✨
                                    </button>
                                    <button
                                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="flex items-center gap-2 bg-transparent hover:bg-white/5 text-white px-6 py-3 rounded-full font-semibold text-sm border border-slate-600 hover:border-slate-500 transition-all"
                                    >
                                        <Play size={14} className="fill-white" /> How it Works
                                    </button>
                                </div>

                                {/* Trust Indicators */}
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle size={14} className="text-emerald-500" /> No credit card required
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-slate-500" /> No download
                                    </span>
                                </div>

                                {/* Social Proof */}
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 max-w-md">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-slate-800" />
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-slate-800" />
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-slate-800" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-0.5 text-amber-400">
                                            <Star size={12} className="fill-amber-400" />
                                            <Star size={12} className="fill-amber-400" />
                                            <Star size={12} className="fill-amber-400" />
                                            <Star size={12} className="fill-amber-400" />
                                            <Star size={12} className="fill-amber-400" />
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            Trusted by <span className="text-white font-medium">hundreds of parents</span> for magical nights ✨
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE - Card Carousel */}
                            <div className="order-1 md:order-2 relative w-full">

                                {/* Glow behind */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-fuchsia-500/20 to-amber-500/20 blur-[100px] rounded-full" />

                                {/* Carousel Container */}
                                <div className="relative flex items-center justify-center py-8">

                                    {/* Navigation - Left Arrow */}
                                    <button
                                        onClick={() => setActiveCard((prev) => (prev - 1 + 3) % 3)}
                                        className="absolute left-0 md:-left-4 z-50 w-10 h-10 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-sm rounded-full border border-slate-600 flex items-center justify-center text-white hover:text-cyan-400 transition-all shadow-xl"
                                    >
                                        <ChevronDown className="rotate-90" size={20} />
                                    </button>

                                    {/* Cards Stack */}
                                    <div className="relative w-full max-w-md h-[480px] md:h-[540px]">

                                        {/* Card Data */}
                                        {[
                                            { title: "Video Update", message: "Almost there! I can see your house...", image: IMG_NIGHT_SKY, selfie: IMG_FAIRY, label: "CAM-04 // BEDSIDE" },
                                            { title: "Tooth Collected", message: "Found it under your pillow! Perfect specimen.", image: IMG_FAIRY, selfie: IMG_NIGHT_SKY, label: "CAM-02 // PILLOW" },
                                            { title: "Mission Complete", message: "Coin delivered! Sleep tight, Savannah.", image: IMG_NIGHT_SKY, selfie: IMG_FAIRY, label: "CAM-01 // EXIT" },
                                        ].map((card, index) => {
                                            const offset = (index - activeCard + 3) % 3;
                                            const isActive = offset === 0;
                                            const isNext = offset === 1;
                                            const isPrev = offset === 2;

                                            return (
                                                <div
                                                    key={index}
                                                    className={`absolute inset-0 transition-all duration-500 ease-out ${isActive ? 'z-30 scale-100 translate-x-0 rotate-0 opacity-100' :
                                                        isNext ? 'z-20 scale-[0.85] translate-x-[18%] rotate-[6deg] opacity-60' :
                                                            'z-10 scale-[0.85] -translate-x-[18%] -rotate-[6deg] opacity-60'
                                                        }`}
                                                    style={{ filter: isActive ? 'none' : 'grayscale(30%)' }}
                                                >
                                                    {/* Rainbow Border */}
                                                    <div className="relative h-full p-[2px] rounded-[2rem] bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-cyan-500 to-fuchsia-500 animate-gradient-move shadow-2xl" style={{ backgroundSize: '400% 400%' }}>

                                                        {/* Glow */}
                                                        {isActive && <div className="absolute inset-0 blur-xl bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-cyan-500 to-fuchsia-500 opacity-40 animate-gradient-move -z-10" style={{ backgroundSize: '400% 400%' }} />}

                                                        {/* Card Content */}
                                                        <div className="relative h-full rounded-[1.8rem] overflow-hidden bg-[#090e1a] border border-slate-700 flex flex-col">

                                                            {/* Video Header */}
                                                            <div className="relative h-32 md:h-40 bg-black overflow-hidden shrink-0">
                                                                <img src={card.image} alt="Feed" className="w-full h-full object-cover opacity-80" />
                                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px] pointer-events-none" />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-transparent to-transparent" />

                                                                {/* HUD */}
                                                                <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_#ef4444]" />
                                                                            <span className="font-mono text-red-500 font-bold tracking-widest text-[8px]">LIVE</span>
                                                                        </div>
                                                                        <span className="font-mono text-cyan-500/70 text-[8px]">{card.label}</span>
                                                                    </div>

                                                                    {/* Play Button */}
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className="w-12 h-12 bg-cyan-500/90 rounded-full flex items-center justify-center pl-0.5 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                                                            <Play size={16} className="text-black fill-black" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Body */}
                                                            <div className="flex-1 p-4 space-y-3 relative overflow-hidden">
                                                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />

                                                                {/* Message */}
                                                                <div className="relative pl-3">
                                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-fuchsia-500 rounded-full" />
                                                                    <div className="flex items-center gap-1.5 mb-1">
                                                                        <MessageCircle size={10} className="text-cyan-400" />
                                                                        <span className="font-mono text-[8px] text-cyan-400 tracking-widest uppercase">Transmission</span>
                                                                    </div>
                                                                    <p className="font-header text-sm md:text-base text-white leading-tight">"{card.message}"</p>
                                                                </div>

                                                                {/* Visual Log + Map Grid */}
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {/* Selfie - Square */}
                                                                    <div className="space-y-0.5">
                                                                        <div className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">Visual Log</div>
                                                                        <div className="relative aspect-square bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                                                                            <img src={card.selfie} className="w-full h-full object-cover opacity-80" alt="Selfie" />
                                                                            <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/90 to-transparent">
                                                                                <div className="flex items-center gap-1 text-yellow-400">
                                                                                    <Camera size={7} />
                                                                                    <span className="font-mono text-[6px] font-bold">IMG_0042.RAW</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg rotate-12">
                                                                                <span className="text-black text-[7px] font-bold">:)</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Map */}
                                                                    <div className="space-y-0.5">
                                                                        <div className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">Live Map</div>
                                                                        <div className="relative aspect-square bg-[#0f1629] rounded-lg overflow-hidden border border-slate-700">
                                                                            {/* Grid */}
                                                                            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

                                                                            {/* Flight path */}
                                                                            <svg className="absolute inset-0 w-full h-full">
                                                                                <path d="M 15 70 Q 40 20 70 50 Q 100 80 115 25" stroke="#22d3ee" strokeWidth="2" fill="none" strokeDasharray="6,3" opacity="0.8" className="drop-shadow-[0_0_4px_#22d3ee]" />
                                                                            </svg>

                                                                            {/* Fairy */}
                                                                            <div className="absolute top-[35%] left-[55%] w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-pulse">
                                                                                <span className="text-[10px]">🧚</span>
                                                                            </div>

                                                                            {/* Home */}
                                                                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg">
                                                                                <span className="text-[10px]">🏠</span>
                                                                            </div>

                                                                            {/* ETA */}
                                                                            <div className="absolute bottom-1 left-1 bg-slate-950/90 px-1.5 py-0.5 rounded">
                                                                                <span className="text-cyan-400 text-[6px] font-mono font-bold">ETA: 3m</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Navigation - Right Arrow */}
                                    <button
                                        onClick={() => setActiveCard((prev) => (prev + 1) % 3)}
                                        className="absolute right-0 md:-right-4 z-50 w-10 h-10 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-sm rounded-full border border-slate-600 flex items-center justify-center text-white hover:text-cyan-400 transition-all shadow-xl"
                                    >
                                        <ChevronDown className="-rotate-90" size={20} />
                                    </button>

                                    {/* Dots Indicator */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                                        {[0, 1, 2].map((i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveCard(i)}
                                                className={`w-2 h-2 rounded-full transition-all ${activeCard === i ? 'bg-cyan-400 w-6' : 'bg-slate-600 hover:bg-slate-500'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== MEET KIKI SECTION ========== */}
                <section className="relative py-20 px-4 overflow-hidden">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-12 items-center">

                            {/* Photo - Tilted and Bigger */}
                            <div className="relative flex justify-center md:justify-end md:pr-12">
                                <div className="relative transform -rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
                                    {/* Glow behind */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-fuchsia-500/20 to-purple-500/30 blur-[60px] rounded-full scale-110" />

                                    {/* Photo with chunky border */}
                                    <div className="relative p-3 bg-white rounded-[2.5rem] shadow-2xl transform scale-110 border-b-[12px] border-r-[12px] border-slate-300">
                                        <img
                                            src={IMG_FAIRY}
                                            alt="Kiki the Tooth Fairy"
                                            className="w-72 md:w-96 aspect-[4/5] object-cover rounded-[2rem] shadow-inner filter contrast-110 saturate-110"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Text content with StageCard Background */}
                            <div className="relative z-10 md:-ml-12 lg:-ml-16">
                                <BackgroundGradient containerClassName="rounded-[2.5rem]" className="rounded-[2.5rem] bg-gradient-to-br from-indigo-950 via-[#1e1b4b] to-[#312e81] p-0">
                                    <div className="relative p-8 md:p-10 rounded-[2.5rem] overflow-hidden">
                                        {/* Grid/Texture Backgrounds */}
                                        <div className="absolute inset-0 opacity-30 pointer-events-none"
                                            style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                                        />
                                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#22d3ee_3px)]" />

                                        {/* Content */}
                                        <div className="relative z-10 space-y-5">
                                            <h2 className="font-header text-4xl md:text-5xl text-white leading-tight">
                                                Meet Kiki<br />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">the Tooth Fairy</span>
                                            </h2>

                                            <div className="space-y-4">
                                                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                                    Kiki is the fairy your child will see in every video. She is cheerful, curious, and usually running (or flying) just a tiny bit late. She gets ready in her castle, gathers her things, and heads out on her nightly rounds.
                                                </p>
                                                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                                    She has a soft, friendly way of talking that feels perfect for bedtime. Kids warm up to her instantly, and parents appreciate how gentle and reassuring she is.
                                                </p>
                                                <p className="text-white font-medium leading-relaxed text-sm md:text-base pt-2 border-t border-slate-700/50">
                                                    Kiki's whole goal is simple. She wants to turn every wiggly tooth into a big adventure your child will remember forever.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </BackgroundGradient>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== THE EXPERIENCE SECTION ========== */}
                <PhaseDivider phase="How It Works" title="The Two-Phase Experience" icon={Activity} color="text-cyan-400" />

                <section id="how-it-works" className="container mx-auto px-4 max-w-6xl pb-16">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        {/* NIGHT PHASE CARD */}
                        <NeonPanel label="Phase One" borderColor="border-indigo-500" bgColor="bg-slate-950" className="h-auto min-h-[380px]">
                            <div className="relative flex-1">
                                <img src={IMG_NIGHT_SKY} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Night" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                                <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-end">
                                    <div className="mb-4 inline-flex p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/50 backdrop-blur-md w-fit">
                                        <Moon size={28} className="text-indigo-400" />
                                    </div>
                                    <h3 className="font-header text-2xl md:text-3xl text-white uppercase italic tracking-tighter mb-2">Night Flight</h3>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                        Before bedtime, watch Kiki fly from Fairyland in real-time. See speed, altitude, and her approach vector as she targets your pillow.
                                    </p>
                                </div>
                            </div>
                        </NeonPanel>

                        {/* MORNING PHASE CARD */}
                        <NeonPanel label="Phase Two" borderColor="border-amber-500" bgColor="bg-slate-950" className="h-auto min-h-[380px]">
                            <div className="relative flex-1">
                                <img src={IMG_SUNRISE} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Morning" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                                <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-end">
                                    <div className="mb-4 inline-flex p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 backdrop-blur-md w-fit">
                                        <Sun size={28} className="text-amber-400" />
                                    </div>
                                    <h3 className="font-header text-2xl md:text-3xl text-white uppercase italic tracking-tighter mb-2">Morning Report</h3>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                        Wake up to the evidence! Photos, a tooth analysis report, and exact gift coordinates — proof that the magic was real.
                                    </p>
                                </div>
                            </div>
                        </NeonPanel>
                    </div>
                </section>

                {/* ========== MISSION CONTROL PREVIEW ========== */}
                <PhaseDivider phase="Live Preview" title="Mission Control" icon={Activity} color="text-cyan-400" />

                <section className="container mx-auto px-4 max-w-5xl pb-24">
                    <NeonPanel label="Satellite Feed" borderColor="border-cyan-500" bgColor="bg-slate-950" className="h-auto min-h-[300px] md:min-h-[400px]">
                        <div className="relative flex-1 w-full h-full overflow-hidden">
                            {/* Grid */}
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(34,211,238,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.5)_1px,transparent_1px)] bg-[size:30px_30px]" />

                            {/* Simulated Marker */}
                            <div className="absolute top-[25%] left-[20%] w-3 h-3 bg-cyan-500 rounded-full animate-ping" />
                            <div className="absolute top-[25%] left-[20%] w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_#22d3ee]" />
                            <div className="absolute top-[70%] left-[75%] w-2 h-2 bg-white/50 rounded-full" />

                            {/* Flight Path */}
                            <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none">
                                <path d="M 100 150 Q 350 50 550 250" stroke="#22d3ee" strokeWidth="2" fill="none" strokeDasharray="8,8" filter="drop-shadow(0 0 5px #22d3ee)" />
                            </svg>

                            {/* Central Status */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-slate-900/80 backdrop-blur border border-cyan-500/50 px-6 py-3 rounded-lg flex items-center gap-4 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />
                                    <span className="font-mono text-cyan-400 tracking-widest uppercase text-sm">Approaching Target</span>
                                </div>
                            </div>

                            {/* Corner Details */}
                            <div className="absolute top-4 left-4 text-[9px] font-mono text-cyan-500/50 uppercase">Lat: 51.5074</div>
                            <div className="absolute bottom-4 right-4 text-[9px] font-mono text-cyan-500/50 uppercase">ZOOM: 4x</div>
                        </div>
                    </NeonPanel>
                </section>

                {/* ========== WHAT'S INSIDE ========== */}
                <PhaseDivider phase="Included" title="What's Inside" icon={Gift} color="text-fuchsia-400" />

                <section className="container mx-auto px-4 max-w-6xl pb-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { icon: Play, title: "Flight Videos", desc: "Live clips from the fairy helmet cam.", color: "text-cyan-400", border: "border-cyan-500" },
                            { icon: Camera, title: "Room Photo", desc: "AI-generated proof from their room.", color: "text-fuchsia-400", border: "border-fuchsia-500" },
                            { icon: FileText, title: "Tooth Report", desc: "Official grade and analysis.", color: "text-amber-400", border: "border-amber-500" },
                            { icon: Gift, title: "Gift Locator", desc: "Exact coordinates of the treasure.", color: "text-green-400", border: "border-green-500" },
                        ].map((item, i) => (
                            <NeonPanel key={i} label={item.title} borderColor={item.border} bgColor="bg-slate-900" className="h-44 md:h-52">
                                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                                    <item.icon size={36} className={`${item.color} mb-3 drop-shadow-[0_0_10px_currentColor]`} />
                                    <p className="text-slate-400 text-[11px] md:text-xs">{item.desc}</p>
                                </div>
                            </NeonPanel>
                        ))}
                    </div>
                </section>

                {/* ========== MEET KIKI ========== */}
                <PhaseDivider phase="Agent Profile" title="Meet Kiki" icon={Star} color="text-yellow-400" />

                <section className="container mx-auto px-4 max-w-5xl pb-24">
                    <div className="relative w-full max-w-4xl mx-auto group">
                        <div className="absolute top-10 bottom-10 left-10 right-10 bg-cyan-500/10 blur-[80px] rounded-full" />
                        <div className="relative bg-[#020617] rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-visible px-8 md:px-12 py-8">
                            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none z-0">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                            </div>

                            {/* LEFT: TEXT */}
                            <div className="flex-1 z-10 text-center md:text-left">
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-lg mb-4">
                                    <span className="font-mono text-[10px] md:text-xs text-cyan-400 font-bold tracking-widest uppercase">YOUR ASSIGNED FAIRY</span>
                                </div>
                                <h3 className="font-header text-5xl md:text-7xl text-white uppercase italic tracking-tighter leading-none mb-2">KIKI</h3>
                                <p className="text-slate-400 text-sm md:text-base max-w-md">
                                    Top-rated specialist in the Night Wing division. She's fast, quiet, and known for leaving the shiniest coins in the realm.
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                                    <div className="text-center px-4 py-2 bg-slate-800 rounded-lg border border-white/5"><div className="font-header text-xl text-white">4.2"</div><div className="text-[9px] text-slate-500 uppercase tracking-wider">Height</div></div>
                                    <div className="text-center px-4 py-2 bg-slate-800 rounded-lg border border-white/5"><div className="font-header text-xl text-white">831 MPH</div><div className="text-[9px] text-slate-500 uppercase tracking-wider">Top Speed</div></div>
                                    <div className="text-center px-4 py-2 bg-slate-800 rounded-lg border border-white/5"><div className="font-header text-xl text-white">98%</div><div className="text-[9px] text-slate-500 uppercase tracking-wider">Magic Lvl</div></div>
                                </div>
                            </div>

                            {/* RIGHT: IMAGE CARD */}
                            <div className="relative z-20 shrink-0 md:-my-20">
                                <div className="relative w-60 md:w-72">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-40 blur-xl animate-gradient-move rounded-2xl" style={{ backgroundSize: '400% 400%' }} />
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 animate-gradient-move rounded-2xl" style={{ backgroundSize: '400% 400%' }} />
                                    <div className="relative w-full h-80 bg-slate-900 rounded-2xl overflow-hidden z-10">
                                        <img src={IMG_FAIRY} className="w-full h-full object-cover opacity-90" alt="Kiki" />
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-900 to-transparent h-24" />
                                        <div className="absolute bottom-3 left-3 font-mono text-[9px] text-cyan-400 tracking-widest uppercase">ID: 07-ALPHA</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== SOCIAL PROOF ========== */}
                <PhaseDivider phase="Testimonials" title="Families Love It" icon={Heart} color="text-red-400" />

                <section className="container mx-auto px-4 max-w-5xl pb-24">
                    <div className="text-center mb-12">
                        <div className="flex justify-center gap-1 mb-3">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400" size={22} />)}</div>
                        <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">Loved by 10,000+ Families</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { text: "My daughter literally gasped when she saw the photo of Kiki in her room. Best experience ever.", author: "Sarah J." },
                            { text: "The morning report saved me. The tracker said Kiki was 'delayed by wind' when I forgot to swap the tooth. Genius.", author: "Mike T." },
                            { text: "So much better than just leaving money. It makes the whole night an event. We use it every time now.", author: "Elena R." }
                        ].map((review, i) => (
                            <NeonPanel key={i} label={review.author} borderColor="border-fuchsia-500/50" bgColor="bg-slate-900" className="h-auto">
                                <div className="p-6 flex flex-col h-full justify-center">
                                    <p className="text-slate-300 text-sm italic leading-relaxed">"{review.text}"</p>
                                </div>
                            </NeonPanel>
                        ))}
                    </div>
                </section>

                {/* ========== WHY FAMILIES LOVE IT (FEATURES GRID) ========== */}
                <PhaseDivider phase="Benefits" title="Why Choose This" icon={Shield} color="text-green-400" />

                <section className="container mx-auto px-4 max-w-5xl pb-24">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {[
                            { icon: Zap, title: "Instant Access", desc: "Works in seconds, no app needed." },
                            { icon: Shield, title: "Ad-Free & Safe", desc: "A private, secure experience." },
                            { icon: Clock, title: "Timed Updates", desc: "Content unlocks at the right moment." },
                            { icon: Camera, title: "Personalized", desc: "Your child's name is featured." },
                            { icon: Heart, title: "Memorable", desc: "They'll remember it forever." },
                            { icon: CheckCircle, title: "Easy for Parents", desc: "Completely stress-free setup." },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                                <div className="p-3 bg-slate-800 rounded-xl mb-4 border border-white/10">
                                    <item.icon size={24} className="text-cyan-400" />
                                </div>
                                <h4 className="font-header text-white text-sm md:text-base mb-1">{item.title}</h4>
                                <p className="text-slate-500 text-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ========== PRICING / CTA ========== */}
                <section className="relative py-24 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent" />
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <div className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 p-8 md:p-16 rounded-[3rem] shadow-[0_0_50px_rgba(34,211,238,0.1)]">
                            <h2 className="font-header text-4xl md:text-6xl text-white uppercase italic tracking-tighter mb-6">Start The Magic Tonight</h2>
                            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
                                Don't just leave a coin. Give them a memory they will never forget. Instant access to the full tracker experience.
                            </p>
                            <button onClick={handleEnter} className="bg-[#a3e635] hover:bg-[#bef264] text-black px-12 py-5 rounded-full font-header text-xl uppercase tracking-widest shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:scale-105 transition-all transform">
                                Launch Mission Control
                            </button>
                            <div className="mt-4 text-sm text-slate-500 font-mono">INSTANT ACCESS • WORKS ON ANY DEVICE</div>
                        </div>
                    </div>
                </section>

                {/* ========== FAQ ========== */}
                <section className="py-24 bg-[#050b14]">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="font-header text-3xl text-white mb-12 text-center uppercase italic tracking-tighter">Frequently Asked Questions</h2>
                        <div className="space-y-2">
                            {[
                                { q: "How long does the tracking last?", a: "The tracker has two phases: Night Flight (before sleep) and Morning Report (after waking). It's designed to be checked twice for maximum magic." },
                                { q: "Do I need to download an app?", a: "No! It works directly in your browser on any phone, tablet, or computer. Just open the link." },
                                { q: "Is it customizable?", a: "The tracker automatically adapts to your local time zone and your child's name is featured prominently." },
                                { q: "What if my child doesn't lose a tooth?", a: "No problem! You can use the tracker whenever you want. It's a magical experience on demand." }
                            ].map((item, i) => (
                                <div key={i} className="border border-white/5 rounded-xl bg-slate-900/50 overflow-hidden">
                                    <button onClick={() => toggleFaq(i)} className="w-full p-5 flex justify-between items-center text-left hover:bg-slate-800/50 transition-colors">
                                        <span className="font-bold text-slate-200">{item.q}</span>
                                        <ChevronDown className={`text-slate-500 transform transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeFaq === i && (
                                        <div className="px-5 pb-5 text-slate-400 leading-relaxed text-sm">{item.a}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== FOOTER ========== */}
                <footer className="py-12 border-t border-white/5 bg-[#02040a] text-center">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center gap-2 mb-4 opacity-40">
                            <Sparkles size={14} />
                            <span className="font-header tracking-widest uppercase text-sm">Tooth Fairy Tracker</span>
                        </div>
                        <div className="text-slate-600 text-xs font-mono">
                            &copy; 2025 Fairy Tech Industries. All Magic Reserved.
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default LandingPage;
