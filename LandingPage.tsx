import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles, Moon, Sun, Camera, FileText, Gift, Star, Play, CheckCircle,
    ChevronDown, ChevronsRight, Wind, Activity, Zap, Heart, Shield, Clock,
    Signal, Wifi, Battery, MapPin, Video, MessageCircle, ArrowRight, Smile
} from 'lucide-react';

import { BackgroundGradient } from './components/ui/background-gradient';

// === ASSETS (Matching Tracker) ===
const IMG_FAIRY = "https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=400&auto=format&fit=crop";
const IMG_NIGHT_SKY = "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=600&auto=format&fit=crop";
const IMG_SUNRISE = "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=600&auto=format&fit=crop";

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

const LandingPage = () => {
    const navigate = useNavigate();

    // Custom Styles for Cinematic Hero
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #22d3ee, #e879f9);
                border-radius: 10px;
            }
            @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
        `;
        document.head.appendChild(style);
        return () => { if (document.head.contains(style)) document.head.removeChild(style); };
    }, []);

    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeStage, setActiveStage] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
            setScrollProgress(progress);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const reviews = [
        {
            name: "Sarah M.",
            role: "Mother of two",
            review: "My daughter ABSOLUTELY LOVED watching the little videos at every step! It made the Tooth Fairy feel so real.",
            rating: 5,
            color: "cyan",
            bg: "bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600",
            textColor: "text-white",
            subColor: "text-cyan-100/80",
            borderColor: "border-cyan-300/40",
            glow: "shadow-[0_20px_50px_rgba(34,211,238,0.3)]"
        },
        {
            name: "James P.",
            role: "Dad",
            review: "Finally a stress-free way to handle the Tooth Fairy. The tracker bought us so much time!",
            rating: 5,
            color: "fuchsia",
            bg: "bg-gradient-to-br from-fuchsia-400 via-fuchsia-500 to-purple-600",
            textColor: "text-white",
            subColor: "text-fuchsia-100/80",
            borderColor: "border-fuchsia-300/40",
            glow: "shadow-[0_20px_50px_rgba(232,121,249,0.3)]"
        },
        {
            name: "Emily R.",
            role: "Parent",
            review: "The custom selfie from Kiki blew their minds. Best app ever.",
            rating: 5,
            color: "lime",
            bg: "bg-gradient-to-br from-lime-400 via-lime-500 to-green-600",
            textColor: "text-white",
            subColor: "text-lime-100/80",
            borderColor: "border-lime-300/40",
            glow: "shadow-[0_20px_50px_rgba(163,230,53,0.3)]"
        }
    ];

    const storyStages = [
        {
            stage: 1,
            title: "The Departure",
            location: "North Star Portal",
            video: "https://player.vimeo.com/external/370375059.sd.mp4?s=69dcca4f03d524454ef4560ce0f6076226090757&profile_id=139&oauth2_token_id=57447761",
            message: "I've just taken flight from the North Star! The wind is in my wings and I'm heading your way. Keep that tooth safe! ✨",
            selfie: "https://images.unsplash.com/photo-1543332164-6e82cd007f3f?q=80&w=400&auto=format&fit=crop",
            color: "from-cyan-400 to-blue-500",
            glow: "shadow-cyan-500/20"
        },
        {
            stage: 2,
            title: "Mid-Flight Magic",
            location: "Sparkle Mountains",
            video: "https://player.vimeo.com/external/477435252.sd.mp4?s=d0840b3c66f91f7a075253896594236b28373307&profile_id=139&oauth2_token_id=57447761",
            message: "Just passed over the Sparkle Mountains. The view is breath-taking! I can see your neighborhood lights from here. 🏔️",
            selfie: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=400&auto=format&fit=crop",
            color: "from-fuchsia-400 to-purple-500",
            glow: "shadow-fuchsia-500/20"
        },
        {
            stage: 3,
            title: "Cloud Surfing",
            location: "Silver Lining Lane",
            video: "https://player.vimeo.com/external/517090025.sd.mp4?s=dd9dfa34479e0a0f9a94e8236d9361a3d902996c&profile_id=139&oauth2_token_id=57447761",
            message: "Hitching a ride on a silver lining! Almost there. Is everyone tucked in tight? The magic works best when you're dreaming! ☁️",
            selfie: "https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=400&auto=format&fit=crop",
            color: "from-amber-400 to-orange-500",
            glow: "shadow-amber-500/20"
        },
        {
            stage: 4,
            title: "Final Approach",
            location: "Your Neighborhood",
            video: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27ec3fa6974066cfbf75a0e00784c48979105ae&profile_id=139&oauth2_token_id=57447761",
            message: "I'm circling your street now! Just look for the faint trail of stardust. I'll be at your window in just a few minutes! 🏠",
            selfie: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop",
            color: "from-lime-400 to-green-500",
            glow: "shadow-lime-500/20"
        },
        {
            stage: 5,
            title: "Mission Complete",
            location: "Your Pillow",
            video: "https://player.vimeo.com/external/370375059.sd.mp4?s=69dcca4f03d524454ef4560ce0f6076226090757&profile_id=139&oauth2_token_id=57447761",
            message: "Mission successful! The tooth has been collected and a special surprise is waiting for you. Safe travels back to Fairy HQ! 🦷",
            selfie: "https://images.unsplash.com/photo-1542601039-291110c8475a?q=80&w=400&auto=format&fit=crop",
            color: "from-red-400 to-pink-500",
            glow: "shadow-red-500/20"
        },
        {
            stage: 6,
            title: "Home Bound",
            location: "Fairy HQ",
            video: "https://player.vimeo.com/external/477435252.sd.mp4?s=d0840b3c66f91f7a075253896594236b28373307&profile_id=139&oauth2_token_id=57447761",
            message: "I'm back home now, tucked into my own petal bed. I'll see you again for the next one! Sweet dreams! 🌸",
            selfie: "https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?q=80&w=400&auto=format&fit=crop",
            color: "from-indigo-400 to-blue-600",
            glow: "shadow-indigo-500/20"
        }
    ];

    const handleEnter = () => { navigate('/tracker'); }

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* === FIXED BACKGROUND === */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-1000">
                {/* 1. LAYER ONE: THE BASE NIGHT (Deep Black/Navy) */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#02040a] via-[#050811] to-[#010205]" />

                {/* 2. LAYER TWO: THE DAWN (Fades in very subtly late) */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/5 via-[#4c1d95]/10 to-[#f59e0b]/20 transition-opacity duration-500"
                    style={{ opacity: Math.max(0, (scrollProgress - 0.7) * 2) }}
                />

                {/* 3. LAYER THREE: TOP SUNRISE GLOW (Faint Gold) */}
                <div
                    className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[200%] aspect-square bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-amber-500/5 to-transparent blur-[120px] transition-all duration-700"
                    style={{
                        opacity: Math.max(0, (scrollProgress - 0.85) * 4),
                        transform: `translateX(-50%) translateY(${50 - scrollProgress * 20}%)`
                    }}
                />

                {/* Subtle turquoise accents (Fades out late) */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] mix-blend-screen transition-opacity duration-700" style={{ opacity: 1 - Math.max(0, (scrollProgress - 0.7) * 2) }} />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px] mix-blend-screen transition-opacity duration-700" style={{ opacity: 1 - Math.max(0, (scrollProgress - 0.7) * 2) }} />

                {/* Subtle Top Spotlight (Fades out late) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950/20 to-transparent blur-3xl pointer-events-none transition-opacity duration-700" style={{ opacity: 1 - Math.max(0, (scrollProgress - 0.7) * 2) }} />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            </div>

            <div className="relative z-10 pb-20">

                {/* ========== 1. HERO SECTION (Route 2: Tilted Cinematic) ========== */}
                <section className="relative py-12 md:py-24 px-4 overflow-hidden">
                    <div className="container mx-auto max-w-7xl">

                        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">

                            {/* LEFT SIDE: Mission Briefing */}
                            <div className="relative z-10 space-y-8 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-sans font-bold text-cyan-300 tracking-widest uppercase">System Status: Active Tracking</span>
                                </div>

                                <div className="space-y-4">
                                    <h1 className="font-chrome text-5xl md:text-6xl lg:text-7xl text-white uppercase leading-none tracking-tight">
                                        Gift Them a<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-300 to-cyan-500">Night To Remember</span>
                                    </h1>
                                    <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans">
                                        The most advanced magical experience for families. Real-time path monitoring and cinematic proof delivered to their pillow.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <button
                                        onClick={handleEnter}
                                        className="relative group/btn overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-sans font-extrabold text-base uppercase tracking-tight shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all transform hover:-translate-y-0.5 active:scale-[0.98] border-b-[4px] border-blue-900 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        <div className="absolute inset-x-0 top-0 h-full w-24 bg-white/20 -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                        <span className="relative z-10">Start the Journey</span>
                                        <ChevronsRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="relative p-[2px] rounded-xl bg-white/10 hover:bg-white/20 transition-all font-sans font-extrabold text-base uppercase tracking-tight px-8 py-[14px] flex items-center justify-center"
                                    >
                                        How it Works
                                    </button>
                                </div>

                                {/* Dynamic Stats Row */}
                                <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-white font-chrome text-2xl leading-none">2,400+</span>
                                        <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest mt-1">Families Tracking</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="flex flex-col">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="fill-cyan-400 text-cyan-400" />)}
                                        </div>
                                        <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest mt-1.5">4.9/5 Parent Rating</span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: Tilted Card Stack (Cinematic Deck) */}
                            <div className="relative h-[600px] flex items-center justify-center perspective-[1500px]">
                                {storyStages.map((stage, i) => {
                                    const stageIndex = stage.stage - 1;
                                    const activeIdx = activeStage - 1;

                                    const isActive = stageIndex === activeIdx;
                                    const isNext = stageIndex === (activeIdx + 1) % 6;
                                    const isPrev = stageIndex === (activeIdx - 1 + 6) % 6;

                                    let transform = 'translateZ(-300px) opacity-0 scale-90';
                                    let zIndex = 0;
                                    let opacity = 0;

                                    if (isActive) {
                                        transform = 'rotateY(-10deg) rotateX(2deg) translateZ(0) translateX(0)';
                                        zIndex = 30;
                                        opacity = 1;
                                    } else if (isNext) {
                                        transform = 'rotateY(-20deg) rotateX(5deg) translateZ(-100px) translateX(100px) translateY(10px) scale(0.9)';
                                        zIndex = 20;
                                        opacity = 0.6;
                                    } else if (isPrev) {
                                        transform = 'rotateY(-5deg) rotateX(0deg) translateZ(-200px) translateX(-100px) translateY(-10px) scale(0.8)';
                                        zIndex = 10;
                                        opacity = 0.4;
                                    }

                                    return (
                                        <div
                                            key={stage.stage}
                                            className="absolute w-full max-w-[560px] transition-all duration-700 ease-out cursor-pointer group/card"
                                            style={{ transform, zIndex, opacity }}
                                            onClick={() => setActiveStage(stage.stage)}
                                        >
                                            {/* Playful Card Design */}
                                            <div className={`relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-4 border-white/80 ${isActive ? 'scale-100' : 'scale-95'}`}>

                                                {/* Video Layer */}
                                                <video
                                                    key={stage.video}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover/card:scale-110"
                                                >
                                                    <source src={stage.video} type="video/mp4" />
                                                </video>

                                                {/* Lighter, More Magical Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                                                <div className={`absolute inset-0 bg-gradient-to-br ${(stage as any).color} opacity-20 mix-blend-overlay`} />

                                                {/* Fun Tilted Title Banner - Top */}
                                                <div className="absolute top-4 left-4 right-4 z-20">
                                                    <div className="inline-flex items-center gap-3">
                                                        {/* Bouncy Stage Badge */}
                                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${(stage as any).color} flex items-center justify-center shadow-lg border-2 border-white transform -rotate-3 transition-transform group-hover/card:rotate-3 group-hover/card:scale-110`}>
                                                            <span className="text-white text-lg font-black">{stage.stage}</span>
                                                        </div>
                                                        {/* Tilted Title */}
                                                        <div className={`bg-gradient-to-r ${(stage as any).color} px-5 py-2.5 rounded-xl transform rotate-1 shadow-lg border-2 border-white/40 transition-transform group-hover/card:-rotate-1`}>
                                                            <h3 className="font-chrome text-lg md:text-xl text-white uppercase tracking-wide">
                                                                {stage.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Hanging Cards - Bottom */}
                                                <div className="absolute -bottom-8 left-3 right-3 z-20 flex gap-3">
                                                    {/* Location Card - Left */}
                                                    <div className="relative bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg transform rotate-2 transition-transform group-hover/card:rotate-0 border-2 border-white flex items-center gap-2 shrink-0">
                                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${(stage as any).color} flex items-center justify-center`}>
                                                            <span className="text-white text-sm">📍</span>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Location</div>
                                                            <div className="text-sm text-slate-700 font-bold">{(stage as any).location}</div>
                                                        </div>
                                                    </div>

                                                    {/* Message Card - Right (Growing) */}
                                                    <div className="relative flex-1 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg transform -rotate-1 transition-transform group-hover/card:rotate-0 border-2 border-white">
                                                        {/* Colorful top accent */}
                                                        <div className={`absolute top-0 left-3 right-3 h-1 rounded-full bg-gradient-to-r ${(stage as any).color} -translate-y-1/2`} />
                                                        {/* Sparkle decoration */}
                                                        <div className="absolute -top-2 -right-2 text-lg">✨</div>
                                                        <p className="font-sans text-slate-700 text-xs leading-relaxed italic line-clamp-2">
                                                            "{stage.message}"
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Active Card Glow */}
                                                {isActive && (
                                                    <div className={`absolute inset-0 rounded-[2rem] ring-4 ring-white/50 pointer-events-none`} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Playful Navigation Controls */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-40">
                                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border-2 border-white transform -rotate-1 flex items-center gap-3">
                                        {/* Colorful Step Dots */}
                                        <div className="flex gap-1.5">
                                            {storyStages.map((stage, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={(e) => { e.stopPropagation(); setActiveStage(idx + 1); }}
                                                    className={`w-3 h-3 rounded-full transition-all duration-300 border border-white shadow-sm transform hover:scale-125 ${activeStage === idx + 1 ? `bg-gradient-to-br ${(stage as any).color} scale-110` : 'bg-slate-300 hover:bg-slate-400'}`}
                                                />
                                            ))}
                                        </div>
                                        {/* Divider */}
                                        <div className="w-px h-4 bg-slate-200" />
                                        {/* Next Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveStage(prev => prev === 6 ? 1 : prev + 1); }}
                                            className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wide shadow-sm hover:scale-105 transition-all flex items-center gap-1"
                                        >
                                            <span>Next</span>
                                            <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section >


                {/* ========== 2. HOW IT WORKS SECTION (4 Column Grid) ========== */}
                <section id="how-it-works" className="relative py-12 px-4">
                    <div className="container mx-auto max-w-6xl">

                        <div className="text-center mb-16">
                            <h2 className="font-chrome text-5xl md:text-6xl text-white uppercase tracking-normal mb-0">
                                How It Works
                            </h2>
                            <div className="inline-block -mt-10 relative z-10">
                                <div className="bg-gradient-to-r from-fuchsia-600 to-pink-500 px-4 py-1.5 transform -rotate-2 border-2 border-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.4)]">
                                    <p className="font-sans font-bold text-xs text-white uppercase tracking-wide">
                                        Simple, magical, 100% stress-free
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: MapPin,
                                    title: "Start Tracking",
                                    desc: "Activate the tracker before bed. See Kiki taking off from Fairyland.",
                                    color: "from-cyan-400 to-blue-500",
                                    border: "border-cyan-500/50"
                                },
                                {
                                    icon: Video,
                                    title: "Watch Flight",
                                    desc: "View real-time updates and video feeds as she flies across the globe.",
                                    color: "from-fuchsia-400 to-purple-500",
                                    border: "border-fuchsia-500/50"
                                },
                                {
                                    icon: Moon,
                                    title: "Go to Sleep",
                                    desc: "The magic happens while they dream. Kiki visits only when they are asleep.",
                                    color: "from-amber-300 to-orange-500",
                                    border: "border-amber-500/50"
                                }
                            ].map((step, i) => (
                                <NeonPanel key={i} label={`Step 0${i + 1}`} borderColor={step.border} className="h-full min-h-[280px]">
                                    <div className="flex flex-col items-center justify-center text-center p-6 h-full space-y-6">
                                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <step.icon size={32} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-header text-xl text-white mb-2">{step.title}</h3>
                                            <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                </NeonPanel>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <div className="text-center mt-16 space-y-6">
                            <p className="text-slate-400 text-sm">
                                ✨ Parents are in control ✨ You decide when your child sees each part of the journey.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button className="relative p-[2px] rounded-xl bg-gradient-to-r from-slate-500 to-slate-400 hover:from-cyan-400 hover:to-fuchsia-400 group/sec transition-all">
                                    <div className="px-8 py-[14px] rounded-[10px] bg-[#0b1021] text-white font-sans font-extrabold text-base uppercase tracking-tight group-hover/sec:bg-transparent transition-all flex items-center justify-center gap-2">
                                        <Play size={18} /> Try Interactive Demo
                                    </div>
                                </button>
                                <button
                                    onClick={handleEnter}
                                    className="relative group/btn overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-sans font-extrabold text-base uppercase tracking-tight shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:scale-[0.98] border-b-[4px] border-blue-900 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
                                >
                                    {/* Shine Sweep Effect */}
                                    <div className="absolute inset-x-0 top-0 h-full w-20 bg-white/20 -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                    <span className="relative z-10">Start the Journey</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-400" />
                                    No credit card required
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-slate-400" />
                                    Takes 3 seconds
                                </div>
                            </div>
                        </div>

                    </div>
                </section >

                {/* ========== 3. FORM SECTION ========== */}
                < section className="relative py-16 px-4" >
                    <div className="container mx-auto max-w-6xl">

                        {/* BACKGROUND CARD (like StageCard) */}
                        <div className="relative">
                            <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#082f49] border border-cyan-500/20 overflow-hidden shadow-2xl">
                                <div className="p-8 md:p-12 lg:pl-[45%]">

                                    {/* Grid/Texture Background */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                                        style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                                    />

                                    {/* RIGHT CONTENT */}
                                    <div className="relative z-10 space-y-6 text-center lg:text-right">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full">
                                            <span className="text-xs text-cyan-300 uppercase tracking-wider">Your Child's Mission</span>
                                        </div>

                                        <h2 className="font-header text-5xl md:text-6xl lg:text-7xl text-white uppercase italic leading-[0.9] tracking-tighter drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
                                            Mission<br />Started
                                        </h2>

                                        <button
                                            onClick={handleEnter}
                                            className="relative group/btn overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-sans font-extrabold text-base uppercase tracking-tight shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:scale-[0.98] border-b-[4px] border-blue-900 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
                                        >
                                            {/* Shine Sweep Effect */}
                                            <div className="absolute inset-x-0 top-0 h-full w-20 bg-white/20 -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                            <span className="relative z-10">See My Updates</span> <ChevronsRight size={20} className="relative z-10" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* FORM CARD - Overlapping on the left */}
                            <div className="lg:absolute lg:-left-4 lg:top-1/2 lg:-translate-y-1/2 mt-8 lg:mt-0 w-full max-w-lg mx-auto lg:mx-0 z-20">

                                {/* Rainbow Glow Behind */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-500 rounded-[2rem] opacity-60 blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />

                                {/* Dark Form Card with Rainbow Border */}
                                <div className="relative rounded-[1.5rem] p-[2px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-500">
                                    <div className="bg-[#0a0e1a] rounded-[1.4rem] p-6 md:p-10">

                                        {/* Live Badge */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full mb-5">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span className="text-xs text-cyan-300">49 families tracking tonight ✨</span>
                                        </div>

                                        <h3 className="font-sans font-bold text-xl md:text-2xl text-white mb-2">
                                            Ready to Start the Magic?
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-5">
                                            Enter your details and Kiki will begin preparing.
                                        </p>

                                        {/* Form Fields */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-white font-semibold text-sm mb-1">Child's Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter name..."
                                                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-black placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-white font-semibold text-sm mb-1">Your Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-black placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                                                />
                                            </div>

                                            <button
                                                onClick={handleEnter}
                                                className="w-full relative group/btn overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white py-4 rounded-xl font-sans font-extrabold text-base uppercase tracking-tight shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:scale-[0.98] border-b-[4px] border-blue-900 active:border-b-0 active:translate-y-1"
                                            >
                                                {/* Shine Sweep Effect */}
                                                <div className="absolute inset-x-0 top-0 h-full w-20 bg-white/20 -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                                <span className="relative z-10">Start Tracking ✨</span>
                                            </button>

                                            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle size={14} className="text-green-400" />
                                                    No credit card
                                                </div>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    3 seconds
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section >

                {/* ========== 4. PEEK INSIDE THE TRACKER SECTION ========== */}
                < section className="relative py-24 px-4" >
                    <div className="container mx-auto max-w-7xl">

                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            {/* LEFT SIDE: Title, Text, Feature Boxes, CTA */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal mb-4">
                                        Peek Inside
                                    </h2>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        A cinematic adventure in two parts: bedtime and morning. Watch Kiki's journey unfold.
                                    </p>
                                </div>

                                {/* Feature Boxes - 2x2 Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Video, title: "Video Updates", color: "from-cyan-400 to-blue-500" },
                                        { icon: MessageCircle, title: "Messages + Selfies", color: "from-fuchsia-400 to-purple-500" },
                                        { icon: Activity, title: "Live Flight Stats", color: "from-lime-400 to-green-500" },
                                        { icon: Shield, title: "Parent Controls", color: "from-amber-400 to-orange-500" }
                                    ].map((feature, i) => (
                                        <div key={i} className="p-4 bg-[#0b1021] border border-slate-700/50 rounded-xl hover:border-slate-600 transition-all">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-lg`}>
                                                <feature.icon size={20} className="text-white" />
                                            </div>
                                            <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={handleEnter}
                                    className="relative group/btn overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-sans font-extrabold text-base uppercase tracking-tight shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:scale-[0.98] border-b-[4px] border-blue-900 active:border-b-0 active:translate-y-1 inline-flex items-center gap-3"
                                >
                                    {/* Shine Sweep Effect */}
                                    <div className="absolute inset-x-0 top-0 h-full w-20 bg-white/20 -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                    <Play size={20} className="relative z-10" />
                                    <span className="relative z-10">Try Demo</span>
                                </button>
                            </div>

                            {/* RIGHT SIDE: Scrollable Tracker Preview */}
                            <div className="relative">
                                {/* Rainbow glow behind */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-lime-500 rounded-[2rem] opacity-30 blur-2xl" />

                                <BackgroundGradient containerClassName="rounded-[2rem]" className="rounded-[2rem] bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#082f49] h-full p-0">
                                    <div className="relative rounded-[2rem] overflow-hidden">
                                        {/* Grid texture */}
                                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                                            style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                                        />

                                        {/* Scrollable iframe container */}
                                        <div className="h-[600px] overflow-y-auto">
                                            <iframe
                                                src="/tracker"
                                                className="w-full h-[1400px] border-0 pointer-events-none"
                                                title="Tracker Preview"
                                            />
                                        </div>
                                    </div>
                                </BackgroundGradient>
                            </div>

                        </div>

                    </div>
                </section >

                {/* ========== 5. REVIEWS SECTION (Tilted Stack) ========== */}
                < section className="relative py-24 px-4 overflow-hidden" >
                    <div className="container mx-auto max-w-4xl text-center">

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/50 border border-cyan-500/30 rounded-full mb-8">
                            <Star size={14} className="text-cyan-400 fill-cyan-400" />
                            <span className="text-xs text-cyan-300 uppercase tracking-wider">5-Star Reviews</span>
                        </div>

                        <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal mb-0">
                            What Parents Are Saying
                        </h2>
                        <div className="inline-block -mt-10 relative z-10 mb-12">
                            <div className="bg-gradient-to-r from-fuchsia-600 to-pink-500 px-4 py-1.5 transform -rotate-2 border-2 border-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.4)]">
                                <p className="font-sans font-bold text-xs text-white uppercase tracking-wide">
                                    Trusted by hundreds of families
                                </p>
                            </div>
                        </div>

                        <div className="relative h-[400px] flex items-center justify-center">
                            {reviews.map((review, index) => {
                                // Calculate position relative to active index

                                const isActive = index === activeIndex;
                                const isPrev = index === (activeIndex - 1 + reviews.length) % reviews.length;
                                const isNext = index === (activeIndex + 1) % reviews.length;

                                let zIndex = 0;
                                let transform = '';
                                let opacity = 0;

                                if (isActive) {
                                    zIndex = 20;
                                    transform = 'scale(1) translate(0, 0) rotate(0deg)';
                                    opacity = 1;
                                } else if (isPrev) {
                                    zIndex = 10;
                                    transform = 'scale(0.85) translate(-250px, 20px) rotate(-10deg)';
                                    opacity = 0.6;
                                } else if (isNext) {
                                    zIndex = 10;
                                    transform = 'scale(0.85) translate(250px, 20px) rotate(10deg)';
                                    opacity = 0.6;
                                } else {
                                    // hidden
                                    opacity = 0;
                                }

                                return (
                                    <div
                                        key={index}
                                        className="absolute w-full max-w-lg transition-all duration-500 ease-out cursor-pointer"
                                        style={{
                                            zIndex,
                                            transform,
                                            opacity: isActive || isPrev || isNext ? opacity : 0,
                                            pointerEvents: isActive ? 'auto' : 'none'
                                        }}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <div className={`${review.bg} border ${review.borderColor} ${review.glow} p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group`}>

                                            {/* Subtle internal shine effect */}
                                            <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                                            {/* Glow effect for active card */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            )}

                                            <div className="flex flex-col items-center gap-6 relative z-10">
                                                <div className={`w-20 h-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center`}>
                                                    <span className={`font-chrome text-2xl ${review.textColor} uppercase`}>
                                                        {review.name.charAt(0)}
                                                    </span>
                                                </div>

                                                <div className="text-center">
                                                    <h4 className={`font-header text-lg ${review.textColor} mb-0`}>{review.name}</h4>
                                                    <p className={`text-xs ${review.subColor}`}>{review.role}</p>
                                                </div>

                                                <p className={`${review.textColor} text-xl md:text-2xl font-bold italic leading-relaxed`}>
                                                    "{review.review}"
                                                </p>

                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star key={i} size={20} className={`fill-current ${review.textColor}`} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quote Icon Background */}
                                            <div className="absolute top-8 right-8 text-slate-800/30">
                                                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M14.017 21L14.017 18C14.017 16.0548 15.0065 14.5492 16.9856 13.4939C17.9751 12.9663 19.0177 12.6465 20.1139 12.5342L19.9998 12.0152C19.9998 9.38871 18.0069 7.39589 15.3804 7.39589L14.017 7.39589L14.017 3L15.3804 3C20.4072 3 24 7.19958 24 12.0152L24 21L14.017 21ZM5.01695 21L5.01695 18C5.01695 16.0548 6.00647 14.5492 7.98556 13.4939C8.97508 12.9663 10.0177 12.6465 11.1139 12.5342L10.9998 12.0152C10.9998 9.38871 9.00695 7.39589 6.38043 7.39589L5.01695 7.39589L5.01695 3L6.38043 3C11.4072 3 15 7.19958 15 12.0152L15 21L5.01695 21Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-3 mt-8">
                            {reviews.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-3 h-3 rounded-full transition-all ${i === activeIndex ? 'bg-cyan-400 w-8' : 'bg-slate-700 hover:bg-slate-600'}`}
                                />
                            ))}
                        </div>

                    </div>
                </section >

            </div >
        </div >
    );
};

export default LandingPage;
