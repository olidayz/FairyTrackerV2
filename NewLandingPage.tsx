import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronsRight, ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to fix map sizing issues
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map, center, zoom]);
    return null;
};

const NewLandingPage = () => {
    const navigate = useNavigate();
    const [activeStage, setActiveStage] = useState(1);
    const [activeReview, setActiveReview] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const trackerIframeRef = useRef<HTMLIFrameElement>(null);

    // Function to scroll iframe to a specific section
    const scrollToSection = (sectionId: string) => {
        if (trackerIframeRef.current?.contentWindow) {
            trackerIframeRef.current.contentWindow.postMessage(
                { scrollTo: sectionId },
                '*'
            );
        }
    };

    // Hide header on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setHeaderVisible(false);
            } else {
                setHeaderVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Reviews data
    const reviews = [
        {
            name: "Sarah M.",
            role: "Mother of two",
            review: "My daughter ABSOLUTELY LOVED watching the little videos at every step! It made the Tooth Fairy feel so real.",
            bg: "bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600",
            glow: "shadow-[0_20px_50px_rgba(34,211,238,0.3)]"
        },
        {
            name: "James P.",
            role: "Dad",
            review: "Finally a stress-free way to handle the Tooth Fairy. The tracker bought us so much time!",
            bg: "bg-gradient-to-br from-fuchsia-400 via-fuchsia-500 to-purple-600",
            glow: "shadow-[0_20px_50px_rgba(232,121,249,0.3)]"
        },
        {
            name: "Emily R.",
            role: "Parent",
            review: "The custom selfie from Kiki blew their minds. Best app ever.",
            bg: "bg-gradient-to-br from-lime-400 via-lime-500 to-green-600",
            glow: "shadow-[0_20px_50px_rgba(163,230,53,0.3)]"
        }
    ];

    const storyStages = [
        {
            stage: 1,
            title: "The Departure",
            location: "North Star Portal",
            image: "/Fairy photo booth pic.webp",
            message: "I've just taken flight from the North Star! The wind is in my wings and I'm heading your way. Keep that tooth safe! ✨",
            color: "from-cyan-400 to-blue-500"
        },
        {
            stage: 2,
            title: "Mid-Flight Magic",
            location: "Sparkle Mountains",
            video: "https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4",
            message: "Just passed over the Sparkle Mountains. The view is breath-taking! I can see your neighborhood lights from here. 🏔️",
            color: "from-fuchsia-400 to-purple-500"
        },
        {
            stage: 3,
            title: "Cloud Surfing",
            location: "Silver Lining Lane",
            video: "https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_24fps.mp4",
            message: "Hitching a ride on a silver lining! Almost there. Is everyone tucked in tight? The magic works best when you're dreaming! ☁️",
            color: "from-amber-400 to-orange-500"
        },
        {
            stage: 4,
            title: "Final Approach",
            location: "Your Neighborhood",
            video: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
            message: "I'm circling your street now! Just look for the faint trail of stardust. I'll be at your window in just a few minutes! 🏠",
            color: "from-lime-400 to-green-500"
        },
        {
            stage: 5,
            title: "Mission Complete",
            location: "Your Pillow",
            video: "https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_25fps.mp4",
            message: "Mission successful! The tooth has been collected and a special surprise is waiting for you. Safe travels back to Fairy HQ! 🦷",
            color: "from-red-400 to-pink-500"
        },
        {
            stage: 6,
            title: "Home Bound",
            location: "Fairy HQ",
            video: "https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4",
            message: "I'm back home now, tucked into my own petal bed. I'll see you again for the next one! Sweet dreams! 🌸",
            color: "from-indigo-400 to-blue-600"
        }
    ];

    const handleEnter = () => navigate('/tracker');

    return (
        <div className="min-h-screen bg-[#0a1020] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* === FIXED BACKGROUND === */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Base Night - Lighter */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />

                {/* Boosted ambient glows */}
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-teal-500/8 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[200px] mix-blend-screen" />


                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                {/* Subtle noise texture */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* ========== FLOATING HEADER ========== */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="mx-4 mt-4">
                    <div className="max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
                        <div className="flex items-center justify-between">

                            {/* Left: Nav Links */}
                            <nav className="hidden lg:flex items-center gap-6">
                                <a href="#meet-kiki" className="text-sm text-slate-300 hover:text-white transition-colors">
                                    Meet Kiki
                                </a>
                                <a href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">
                                    How it Works
                                </a>
                                <a href="#faq" className="text-sm text-slate-300 hover:text-white transition-colors">
                                    FAQ
                                </a>
                            </nav>

                            {/* Center: Logo */}
                            <div className="absolute left-1/2 -translate-x-1/2">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                                        <span className="text-xl">🧚‍♀️</span>
                                    </div>
                                    <span className="font-chrome text-white text-lg uppercase tracking-tight hidden md:block">
                                        Tooth Fairy Tracker
                                    </span>
                                </div>
                            </div>

                            {/* Right: CTA */}
                            <button
                                onClick={handleEnter}
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-tight shadow-lg hover:shadow-cyan-500/30 transition-all hover:-translate-y-0.5"
                            >
                                Start Tracking
                            </button>

                        </div>
                    </div>
                </div>
            </header>

            <div className="relative z-10 pt-24">

                {/* ========== SECTION 1: HERO ========== */}
                <section className="relative py-12 md:py-16 px-4 overflow-hidden">
                    <div className="container mx-auto max-w-7xl">

                        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">

                            {/* LEFT SIDE: Text Content */}
                            <div className="relative z-10 text-center lg:text-left">
                                <div className="space-y-6">
                                    {/* Status Badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/50 border border-cyan-500/30 rounded-full">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                        <span className="text-xs font-sans font-bold text-cyan-300 tracking-widest uppercase">System Active</span>
                                    </div>

                                    {/* Main Headline */}
                                    <div className="space-y-3">
                                        <h1 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[0.9] tracking-normal">
                                            Gift Them a<br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-300 to-cyan-500">Night To Remember</span>
                                        </h1>
                                        <p className="text-slate-400 text-lg md:text-xl max-w-md leading-relaxed font-sans">
                                            The most magical Tooth Fairy experience for families. Real-time tracking and cinematic proof delivered to their pillow.
                                        </p>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                                        <button
                                            onClick={handleEnter}
                                            className="relative group/btn overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-sans font-extrabold text-base uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-[#1e40af] active:border-b-0 flex items-center justify-center gap-2"
                                        >
                                            <span className="relative z-10">Start the Journey</span>
                                            <ChevronsRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>

                                        <button
                                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all font-sans font-bold text-base uppercase tracking-tight flex items-center justify-center gap-2"
                                        >
                                            How It Works
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>

                                    {/* Social Proof */}
                                    <div className="flex items-center justify-center lg:justify-start pt-4">
                                        <div className="relative bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative flex items-center gap-4">
                                                <div className="flex -space-x-3">
                                                    {['😊', '🥰', '😍', '🤩', '💜'].map((emoji, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg border-2 border-slate-900 shadow-lg"
                                                            style={{ zIndex: 5 - i }}
                                                        >
                                                            {emoji}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <Star key={i} size={14} className="fill-amber-400 text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]" />
                                                        ))}
                                                    </div>
                                                    <p className="text-slate-300 text-sm font-medium mt-0.5">
                                                        Trusted by <span className="text-white font-bold">hundreds of parents</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: Stage Cards Stack */}
                            <div className="relative h-[550px] md:h-[600px] flex items-center justify-center" style={{ perspective: '1500px' }}>
                                {/* Decorative Anchor Shape (Option 4) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[800px] pointer-events-none z-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/5 rounded-full blur-[100px] transform -rotate-12 scale-110" />
                                    <div className="absolute inset-20 border border-white/5 rounded-[60px] transform rotate-12" />
                                    <div className="absolute inset-40 border border-white/10 rounded-[40px] transform -rotate-6" />
                                </div>
                                {storyStages.map((stage) => {
                                    const stageIndex = stage.stage - 1;
                                    const activeIdx = activeStage - 1;

                                    const isActive = stageIndex === activeIdx;
                                    const isNext = stageIndex === (activeIdx + 1) % 6;
                                    const isPrev = stageIndex === (activeIdx - 1 + 6) % 6;

                                    let transform = 'translateZ(-300px) scale(0.8)';
                                    let zIndex = 0;
                                    let opacity = 0;

                                    if (isActive) {
                                        transform = 'rotateY(-8deg) rotateX(2deg) translateZ(0)';
                                        zIndex = 30;
                                        opacity = 1;
                                    } else if (isNext) {
                                        transform = 'rotateY(-15deg) rotateX(4deg) translateZ(-80px) translateX(80px) translateY(20px) scale(0.92)';
                                        zIndex = 20;
                                        opacity = 0.7;
                                    } else if (isPrev) {
                                        transform = 'rotateY(-3deg) rotateX(0deg) translateZ(-150px) translateX(-80px) translateY(-15px) scale(0.85)';
                                        zIndex = 10;
                                        opacity = 0.5;
                                    }

                                    return (
                                        <div
                                            key={stage.stage}
                                            className="absolute w-full max-w-[600px] transition-all duration-700 ease-out cursor-pointer group/card"
                                            style={{ transform, zIndex, opacity }}
                                            onClick={() => setActiveStage(stage.stage)}
                                        >
                                            {/* Card Container */}
                                            <div className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden transition-all duration-500 shadow-[0_25px_50px_rgba(0,0,0,0.5)] ring-4`} style={{
                                                '--tw-ring-color': stage.color.includes('cyan') ? '#22d3ee' : stage.color.includes('fuchsia') ? '#e879f9' : stage.color.includes('amber') ? '#fbbf24' : stage.color.includes('lime') ? '#a3e635' : stage.color.includes('red') ? '#f87171' : '#818cf8'
                                            } as React.CSSProperties}>

                                                {/* Media Content (Video or Image) */}
                                                {stage.video ? (
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
                                                ) : (
                                                    <img
                                                        src={stage.image}
                                                        alt={stage.title}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover/card:scale-110"
                                                    />
                                                )}

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
                                                <div className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-20 mix-blend-overlay`} />

                                                {/* Title Banner with Location - Top */}
                                                <div className="absolute top-4 left-4 right-4 z-20">
                                                    <div className="inline-flex items-start gap-3">
                                                        {/* Stage Badge */}
                                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-xl border-2 border-white transform -rotate-3 transition-transform group-hover/card:rotate-3 shrink-0`}>
                                                            <span className="text-white text-xl font-black">{stage.stage}</span>
                                                        </div>
                                                        {/* Title + Location */}
                                                        <div className={`bg-gradient-to-r ${stage.color} px-5 py-3 rounded-xl transform rotate-1 shadow-xl border-2 border-white/50 transition-transform group-hover/card:-rotate-1`}>
                                                            <h3 className="font-chrome text-xl md:text-2xl text-white uppercase tracking-wide">
                                                                {stage.title}
                                                            </h3>
                                                            <div className="flex items-center gap-1 text-white/70 text-[10px]">
                                                                <span>📍</span>
                                                                <span>{stage.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chat Bubble - Inside card, bottom right */}
                                                <div className="absolute bottom-4 right-4 z-20 max-w-[260px]">
                                                    <div className="bg-white rounded-2xl p-3 shadow-xl">
                                                        <p className="font-sans text-slate-700 text-xs leading-relaxed">
                                                            "{stage.message}"
                                                        </p>
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 text-sm">✨</div>
                                                </div>

                                                {/* Active Ring */}
                                                {isActive && (
                                                    <div className="absolute inset-0 rounded-3xl ring-4 ring-white/60 pointer-events-none" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Stage Dots - minimal */}
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-2">
                                    {storyStages.map((stage, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveStage(idx + 1)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-150 ${activeStage === idx + 1 ? `bg-white scale-125` : 'bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ========== SECTION 2: HOW IT WORKS ========== */}
                <section id="how-it-works" className="relative py-16 px-4">
                    {/* Thin glowing line divider */}
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    </div>
                    <div className="container mx-auto max-w-5xl">

                        {/* Section Header with Badge */}
                        <div className="text-center mb-12">
                            <div className="relative inline-block mb-4">
                                <h2 className="font-chrome text-5xl md:text-6xl text-white uppercase tracking-normal">
                                    How It Works
                                </h2>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform rotate-2">
                                    <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 px-3 py-1 rounded-lg border border-white/30 shadow-xl backdrop-blur-sm">
                                        <p className="font-sans font-black text-[9px] text-white uppercase tracking-widest whitespace-nowrap">
                                            Simple & Easy
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PART 1: Form - Inline Text */}
                        <div className="text-center mb-12">
                            <p className="text-slate-300 text-lg">
                                Fill out the form with your <span className="text-white font-semibold">child's name</span> + <span className="text-white font-semibold">your email</span>. We generate your tracker page.
                            </p>
                        </div>

                        {/* PART 2: Two Side-by-Side Cards with Hero-Style Titles */}
                        <div className="grid md:grid-cols-2 gap-8">

                            {/* Card 1: Live Tracking */}
                            <div className="relative mt-6">
                                {/* Title ON TOP of card */}
                                <div className="absolute -top-4 left-6 z-[1000]">
                                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 rounded-xl transform -rotate-1 shadow-xl border-2 border-white/50">
                                        <h4 className="font-chrome text-lg text-white uppercase tracking-wide">Live Tracking</h4>
                                    </div>
                                </div>
                                {/* Card Body with Ring Accent */}
                                <div className="rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/90 ring-4 ring-cyan-500/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                                    {/* Leaflet Map Preview */}
                                    <div style={{ height: '192px', width: '100%' }}>
                                        <MapContainer
                                            center={[40, 10]}
                                            zoom={1.3}
                                            zoomSnap={0.1}
                                            scrollWheelZoom={false}
                                            dragging={false}
                                            zoomControl={false}
                                            attributionControl={false}
                                            style={{ height: '100%', width: '100%', background: '#020617' }}
                                        >
                                            <MapUpdater center={[40, 10]} zoom={1.3} />
                                            <TileLayer
                                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                            />
                                            {/* Static fairy marker for preview */}
                                            <Marker
                                                position={[48.8566, 2.3522]}
                                                icon={L.divIcon({
                                                    className: 'custom-fairy-preview',
                                                    html: `<div style="width: 28px; height: 28px; border-radius: 50%; border: 2px solid #22d3ee; box-shadow: 0 0 12px #22d3ee; background: url('/fairy-head.png') center/cover; overflow: hidden;"></div>`,
                                                    iconSize: [28, 28],
                                                    iconAnchor: [14, 14]
                                                })}
                                            />
                                            {/* Flight path line */}
                                            <Polyline
                                                positions={[[51.5, -0.1], [48.8, 2.4], [40.4, -3.7], [35.7, 139.7]]}
                                                pathOptions={{
                                                    color: '#22d3ee',
                                                    weight: 2,
                                                    opacity: 0.6,
                                                    dashArray: '5, 10'
                                                }}
                                            />
                                        </MapContainer>
                                    </div>
                                    {/* Content */}
                                    <div className="p-6">
                                        <p className="text-slate-400 text-sm mb-4">
                                            A customized experience where they can:
                                        </p>
                                        <ul className="space-y-2 text-slate-300 text-sm">
                                            <li className="flex items-start gap-2">
                                                <span className="text-cyan-400">✓</span>
                                                <span>See the fairy move on a <span className="text-white">live map</span></span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-cyan-400">✓</span>
                                                <span>Watch her <span className="text-white">speed stats</span></span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-cyan-400">✓</span>
                                                <span>View her <span className="text-white">Fairy ID</span> & <span className="text-white">mission progress</span></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Fairy Updates */}
                            <div className="relative mt-6">
                                {/* Title ON TOP of card */}
                                <div className="absolute -top-4 left-6 z-20">
                                    <div className="bg-gradient-to-r from-fuchsia-400 to-pink-500 px-4 py-2 rounded-xl transform rotate-1 shadow-xl border-2 border-white/50">
                                        <h4 className="font-chrome text-lg text-white uppercase tracking-wide">Fairy Updates</h4>
                                    </div>
                                </div>
                                {/* Card Body with Ring Accent */}
                                <div className="rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/90 ring-4 ring-fuchsia-500/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                                    {/* Kiki Visual - Stage 1 Image (URL encoded) */}
                                    <div className="relative overflow-hidden" style={{ height: '200px' }}>
                                        <img
                                            src="/Fairy%20photo%20booth%20pic.webp"
                                            alt="Kiki the Tooth Fairy"
                                            className="w-full h-full object-cover object-top"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                                    </div>
                                    {/* Content */}
                                    <div className="p-6">
                                        <p className="text-slate-300 text-sm mb-4">
                                            <span className="text-white font-semibold">6 updates</span> — each with a <span className="text-white">video</span>, <span className="text-white">message</span>, and <span className="text-white">selfie</span>.
                                        </p>
                                        <div className="flex gap-3">
                                            <div className="flex-1 p-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl text-center">
                                                <span className="text-xl block mb-1">🌙</span>
                                                <span className="text-cyan-300 font-semibold text-xs">3 before bed</span>
                                            </div>
                                            <div className="flex-1 p-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-center">
                                                <span className="text-xl block mb-1">☀️</span>
                                                <span className="text-amber-300 font-semibold text-xs">3 in morning</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Note */}
                        <div className="text-center mt-8">
                            <p className="text-slate-500 text-xs">
                                ✨ Parents control when each update is shown
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="text-center mt-10">
                            <button
                                onClick={handleEnter}
                                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white px-10 py-5 rounded-xl font-sans font-extrabold text-lg uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-[#1e40af] active:border-b-0 flex items-center justify-center gap-3 mx-auto"
                            >
                                <span>Start the Journey</span>
                                <ChevronsRight size={24} />
                            </button>
                        </div>

                    </div>
                </section>

                {/* ========== SECTION 2.5: START MISSION (The Stack of Promises) ========== */}
                <section className="relative py-24 px-4 overflow-hidden">
                    {/* Background Accents */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="container mx-auto max-w-6xl">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-950/50 border border-lime-500/30 rounded-full mb-4">
                                <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-lime-300 uppercase tracking-widest">Ready to Launch</span>
                            </div>
                            <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal mb-4">
                                Start the Magic
                            </h2>
                            <p className="text-slate-400 text-lg max-w-xl mx-auto">
                                Enter your details and the Tooth Fairy will begin preparing for her big adventure.
                            </p>
                        </div>

                        {/* Two Column Layout - Form gets more space */}
                        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-center">

                            {/* LEFT: The Card Stack with Form - BIGGER */}
                            <div className="relative flex justify-center items-center min-h-[580px]">
                                {/* Background Card 3 (Deepest - Amber) */}
                                <div className="absolute w-full max-w-lg h-[520px] bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] transform rotate-6 translate-x-4 translate-y-4 shadow-2xl opacity-80" />

                                {/* Background Card 2 (Middle - Fuchsia) */}
                                <div className="absolute w-full max-w-lg h-[520px] bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-[2rem] transform -rotate-3 -translate-x-3 translate-y-2 shadow-2xl opacity-90" />

                                {/* Background Card 1 (Cyan) */}
                                <div className="absolute w-full max-w-lg h-[520px] bg-gradient-to-br from-cyan-400 to-blue-500 rounded-[2rem] transform rotate-2 -translate-y-1 shadow-2xl opacity-95" />

                                {/* Main Form Card - MUCH BIGGER */}
                                <div className="relative w-full max-w-lg bg-slate-950 rounded-[2rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border-2 border-white/10 z-10">
                                    {/* Glow Ring */}
                                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 via-transparent to-fuchsia-500/20 blur-sm pointer-events-none" />
                                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 pointer-events-none" />

                                    <div className="relative z-10 space-y-8">
                                        {/* Live Counter Badge - BIGGER */}
                                        <div className="flex justify-center">
                                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                                                <span className="text-sm font-bold text-cyan-300">48 families tracking tonight ✨</span>
                                            </div>
                                        </div>

                                        {/* Child's Name Input - BIGGER */}
                                        <div>
                                            <label className="block text-white font-bold text-lg mb-2">Child's Name</label>
                                            <p className="text-slate-400 text-sm mb-3">We use the name to customize the experience.</p>
                                            <input
                                                type="text"
                                                placeholder="Enter name..."
                                                className="w-full px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner"
                                            />
                                        </div>

                                        {/* Email Input - BIGGER */}
                                        <div>
                                            <label className="block text-white font-bold text-lg mb-2">Your Email</label>
                                            <p className="text-slate-400 text-sm mb-3">We'll send your tracker link. Nothing else.</p>
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                className="w-full px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner"
                                            />
                                        </div>

                                        {/* CTA Button - MASSIVE */}
                                        <button
                                            onClick={handleEnter}
                                            className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white px-8 py-6 rounded-xl font-sans font-extrabold text-xl uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-[#1e40af] active:border-b-0 flex items-center justify-center gap-3"
                                        >
                                            <span>Start Tracking</span>
                                            <span className="text-2xl">✨</span>
                                        </button>

                                        {/* Trust Signals - BIGGER */}
                                        <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
                                            <span className="flex items-center gap-2">
                                                <span className="text-green-400 text-lg">✓</span> No credit card required
                                            </span>
                                            <span className="text-slate-600">•</span>
                                            <span className="flex items-center gap-2">
                                                <span className="text-green-400 text-lg">✓</span> Takes 30 seconds
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Feature Cards */}
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: "🌙",
                                        title: "A Two-Part Magical Experience",
                                        desc: "You start the adventure before sleep and finish it after your child wakes up.",
                                        color: "from-fuchsia-400 to-purple-500",
                                        glow: "group-hover:shadow-fuchsia-500/30"
                                    },
                                    {
                                        icon: "📡",
                                        title: "An Interactive Experience",
                                        desc: "Track the Fairy's speed, location, and watch live video updates.",
                                        color: "from-cyan-400 to-blue-500",
                                        glow: "group-hover:shadow-cyan-500/30"
                                    },
                                    {
                                        icon: "😴",
                                        title: "No Overnight Updates",
                                        desc: "Watch what she's been up to in the morning — no updates appear during sleeping hours.",
                                        color: "from-amber-400 to-orange-500",
                                        glow: "group-hover:shadow-amber-500/30"
                                    },
                                    {
                                        icon: "🛡️",
                                        title: "Parent-Led Experience",
                                        desc: "You control what your child sees and when they see it.",
                                        color: "from-lime-400 to-green-500",
                                        glow: "group-hover:shadow-lime-500/30"
                                    }
                                ].map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className={`group relative flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-xl ${feature.glow}`}
                                    >
                                        {/* Icon Box */}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg shrink-0 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                                            <span className="text-xl">{feature.icon}</span>
                                        </div>
                                        {/* Text */}
                                        <div>
                                            <h4 className="text-white font-bold text-base mb-1">{feature.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </section>

                {/* ========== SECTION 2.75: PEEK INSIDE THE TRACKER ========== */}
                <section className="relative py-24 px-4 overflow-hidden">
                    {/* Thin glowing line divider */}
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
                    </div>
                    <div className="container mx-auto max-w-6xl">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-fuchsia-950/50 border border-fuchsia-500/30 rounded-full mb-4">
                                <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest">✨ Sneak Peek</span>
                            </div>
                            <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal mb-0 relative">
                                Inside the Tracker
                            </h2>
                            <div className="relative -mt-2 mb-6 inline-block">
                                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1.5 rounded-lg transform rotate-1 border-2 border-white/30 shadow-lg">
                                    <p className="font-sans font-bold text-xs text-white uppercase tracking-wide">
                                        See what your child experiences
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Browser Mockup with Live Preview */}
                        <div className="mb-16">
                            <div className="relative mx-auto max-w-5xl">
                                {/* Glow behind */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-amber-500/20 rounded-[2rem] blur-2xl" />

                                {/* Browser Frame */}
                                <div className="relative bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                    {/* Browser Top Bar */}
                                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/80 border-b border-white/10">
                                        {/* Traffic Lights */}
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        {/* Address Bar */}
                                        <div className="flex-1 flex justify-center">
                                            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-700/50 rounded-lg border border-white/5">
                                                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs text-slate-400 font-mono">tracker.kikithetoothfairy.co/emma</span>
                                            </div>
                                        </div>
                                        {/* Empty space for symmetry */}
                                        <div className="w-14" />
                                    </div>

                                    {/* Browser Content - Scrollable Iframe */}
                                    <div className="relative aspect-[16/9] bg-[#02040a] overflow-hidden">
                                        {/* Actual iframe to TrackerPage - SCROLLABLE */}
                                        <iframe
                                            ref={trackerIframeRef}
                                            src="/tracker"
                                            className="absolute inset-0 w-full h-full border-0"
                                            title="Tracker Preview"
                                        />
                                    </div>
                                </div>

                                {/* Scroll to Explore Callout */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full shadow-lg border-2 border-white/30 animate-bounce">
                                        <span className="text-white text-sm font-bold">✨ Scroll to Explore!</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Scroll Feature Cards */}
                        <div className="relative">
                            {/* Fade edges */}
                            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#02040a] to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#02040a] to-transparent z-10 pointer-events-none" />

                            <div className="flex gap-6 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {[
                                    {
                                        title: "Live Tracking Map",
                                        desc: "Watch Kiki fly across the globe in real-time with smooth animations.",
                                        gradient: "from-cyan-400 to-blue-600",
                                        icon: "🗺️",
                                        scrollTo: "tracker-map"
                                    },
                                    {
                                        title: "Personal Video Updates",
                                        desc: "She sends personalized video messages during her journey.",
                                        gradient: "from-fuchsia-400 to-purple-600",
                                        icon: "🎬",
                                        scrollTo: "tracker-videos"
                                    },
                                    {
                                        title: "Fairy ID Card",
                                        desc: "A custom profile card featuring your child's name and mission.",
                                        gradient: "from-amber-400 to-orange-600",
                                        icon: "🪪",
                                        scrollTo: "tracker-videos"
                                    },
                                    {
                                        title: "Speed & Stats",
                                        desc: "Track her flight speed, distance traveled, and current location.",
                                        gradient: "from-lime-400 to-green-600",
                                        icon: "⚡",
                                        scrollTo: "tracker-speed"
                                    },
                                    {
                                        title: "Morning Surprise",
                                        desc: "Wake up to proof she visited – selfies, messages, and more.",
                                        gradient: "from-pink-400 to-rose-600",
                                        icon: "🌅",
                                        scrollTo: "tracker-videos"
                                    }
                                ].map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex-shrink-0 w-72 snap-center group cursor-pointer"
                                        onClick={() => scrollToSection(feature.scrollTo)}
                                    >
                                        {/* Card */}
                                        <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                                            {/* Mockup Area */}
                                            <div className={`h-48 bg-gradient-to-br ${feature.gradient} flex items-center justify-center relative overflow-hidden`}>
                                                {/* Placeholder visual */}
                                                <div className="absolute inset-0 bg-black/20" />
                                                <div className="relative z-10 text-6xl group-hover:scale-110 transition-transform duration-300">
                                                    {feature.icon}
                                                </div>
                                                {/* Shine */}
                                                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
                                            </div>
                                            {/* Text */}
                                            <div className="p-6">
                                                <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scroll hint */}
                        <div className="flex justify-center mt-6">
                            <p className="text-slate-500 text-sm flex items-center gap-2">
                                <span>←</span> Click a card to explore <span>→</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* ========== SECTION 2.9: MEET KIKI ========== */}
                <section id="meet-kiki" className="relative py-24 px-4 overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

                    <div className="container mx-auto max-w-6xl">
                        {/* Overlapping Layout Container */}
                        <div className="relative">

                            {/* The Card (sits behind) */}
                            <div className="relative lg:ml-[280px] bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 lg:p-12 lg:pl-[320px]">
                                {/* Inner glow */}
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                                {/* Text Content */}
                                <div className="relative z-10 space-y-6 max-w-xl">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/50 border border-cyan-500/30 rounded-full">
                                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">🧚‍♀️ Your Child's Fairy</span>
                                    </div>

                                    {/* Title - Single line */}
                                    <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal">
                                        Meet Kiki the Tooth Fairy
                                    </h2>

                                    {/* Paragraphs */}
                                    <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                                        <p>
                                            Kiki is the fairy your child will see in every video. She is cheerful, curious, and usually running (or flying) just a tiny bit late. She gets ready in her castle, gathers her things, and heads out on her nightly rounds.
                                        </p>
                                        <p>
                                            She has a soft, friendly way of talking that feels perfect for bedtime. Kids warm up to her instantly, and parents appreciate how gentle and reassuring she is.
                                        </p>
                                        <p className="text-white font-medium">
                                            Kiki's whole goal is simple: She wants to turn every wiggly tooth into a big adventure your child will remember forever.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* The Image (overlaps the card) */}
                            <div className="lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[550px] -mt-8 lg:mt-0 mx-auto max-w-[350px] lg:max-w-none transform lg:-rotate-3">
                                {/* Glow behind image */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-400/40 via-teal-400/30 to-cyan-400/40 rounded-[2rem] blur-2xl" />

                                {/* Image Frame */}
                                <div className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl">
                                    <img
                                        src="/Fairy photo booth pic.webp"
                                        alt="Kiki the Tooth Fairy"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Shine overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ========== SECTION 3: REVIEWS ========== */}
                <section className="relative py-24 px-4">
                    {/* Thin glowing line divider */}
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    </div>
                    <div className="container mx-auto max-w-5xl text-center">

                        {/* Header */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/50 border border-cyan-500/30 rounded-full mb-6">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs text-cyan-300 uppercase tracking-wider">5-Star Reviews</span>
                        </div>

                        <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal mb-0 relative">
                            What Parents Say
                        </h2>
                        {/* Overlapping Badge */}
                        <div className="relative -mt-2 mb-10 inline-block">
                            <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-1.5 rounded-lg transform -rotate-2 border-2 border-white/30 shadow-lg">
                                <p className="font-sans font-bold text-xs text-white uppercase tracking-wide">
                                    Trusted by hundreds of families
                                </p>
                            </div>
                        </div>

                        {/* Review Cards Carousel - 5 Card Stack */}
                        <div className="relative h-[450px] flex items-center justify-center">
                            {reviews.map((review, index) => {
                                const isActive = index === activeReview;
                                const isPrev = index === (activeReview - 1 + reviews.length) % reviews.length;
                                const isNext = index === (activeReview + 1) % reviews.length;
                                const isPrevPrev = index === (activeReview - 2 + reviews.length) % reviews.length;
                                const isNextNext = index === (activeReview + 2) % reviews.length;

                                let transform = 'scale(0.5) translateX(0)';
                                let opacity = 0;
                                let zIndex = 0;

                                if (isActive) {
                                    transform = 'scale(1) translateX(0) rotate(0deg)';
                                    opacity = 1;
                                    zIndex = 30;
                                } else if (isPrev) {
                                    transform = 'scale(0.85) translateX(-260px) rotate(-4deg)';
                                    opacity = 0.6;
                                    zIndex = 20;
                                } else if (isNext) {
                                    transform = 'scale(0.85) translateX(260px) rotate(4deg)';
                                    opacity = 0.6;
                                    zIndex = 20;
                                } else if (isPrevPrev) {
                                    transform = 'scale(0.7) translateX(-450px) rotate(-8deg)';
                                    opacity = 0.3;
                                    zIndex = 10;
                                } else if (isNextNext) {
                                    transform = 'scale(0.7) translateX(450px) rotate(8deg)';
                                    opacity = 0.3;
                                    zIndex = 10;
                                }

                                return (
                                    <div
                                        key={index}
                                        className="absolute w-full max-w-xl transition-all duration-500 ease-out cursor-pointer hover:opacity-80"
                                        style={{ transform, opacity, zIndex }}
                                        onClick={() => setActiveReview(index)}
                                    >
                                        {/* Card with ring wrapper */}
                                        <div className={`${review.bg} ${review.glow} rounded-[2rem] shadow-2xl ring-4 ring-white/50`}>
                                            <div className="relative p-10 rounded-[2rem] overflow-hidden">
                                                {/* Shine */}
                                                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-[2rem]" />

                                                {/* Quote icon */}
                                                <div className="absolute top-4 right-4 text-white/20">
                                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M14.017 21L14.017 18C14.017 16.0548 15.0065 14.5492 16.9856 13.4939C17.9751 12.9663 19.0177 12.6465 20.1139 12.5342L19.9998 12.0152C19.9998 9.38871 18.0069 7.39589 15.3804 7.39589L14.017 7.39589L14.017 3L15.3804 3C20.4072 3 24 7.19958 24 12.0152L24 21L14.017 21ZM5.01695 21L5.01695 18C5.01695 16.0548 6.00647 14.5492 7.98556 13.4939C8.97508 12.9663 10.0177 12.6465 11.1139 12.5342L10.9998 12.0152C10.9998 9.38871 9.00695 7.39589 6.38043 7.39589L5.01695 7.39589L5.01695 3L6.38043 3C11.4072 3 15 7.19958 15 12.0152L15 21L5.01695 21Z" />
                                                    </svg>
                                                </div>

                                                <div className="relative z-10 flex flex-col items-center gap-5">
                                                    {/* Avatar */}
                                                    <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center shadow-lg">
                                                        <span className="font-chrome text-3xl text-white">{review.name.charAt(0)}</span>
                                                    </div>

                                                    {/* Name & Role */}
                                                    <div>
                                                        <h4 className="font-bold text-white text-xl">{review.name}</h4>
                                                        <p className="text-white/70 text-base">{review.role}</p>
                                                    </div>

                                                    {/* Review */}
                                                    <p className="text-white text-xl md:text-2xl font-medium italic leading-relaxed">
                                                        "{review.review}"
                                                    </p>

                                                    {/* Stars */}
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <Star key={i} size={24} className="fill-white text-white drop-shadow-lg" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation Dots - Styled */}
                        <div className="flex justify-center gap-4 mt-10">
                            {reviews.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveReview(i)}
                                    className={`relative transition-all duration-300 ${i === activeReview
                                        ? 'w-10 h-3'
                                        : 'w-3 h-3 hover:scale-125'
                                        }`}
                                >
                                    <div className={`absolute inset-0 rounded-full transition-all ${i === activeReview
                                        ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                                        : 'bg-white/20 border border-white/30 hover:bg-white/30'
                                        }`} />
                                </button>
                            ))}
                        </div>

                    </div>
                </section>

                {/* ========== SECTION 4: WHY FAMILIES LOVE US ========== */}
                <section className="relative py-24 px-4 overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[200px] pointer-events-none" />

                    <div className="container mx-auto max-w-5xl">
                        {/* Header */}
                        <div className="text-center mb-14">
                            <div className="relative inline-block mb-8">
                                <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal">
                                    Why Families Love Our<br />
                                    <span className="text-white">Tooth Fairy Tracker</span>
                                </h2>
                                {/* Badge under title - styled like How It Works */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform rotate-2">
                                    <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 px-3 py-1 rounded-lg border border-white/30 shadow-xl backdrop-blur-sm">
                                        <p className="font-sans font-black text-[9px] text-white uppercase tracking-widest whitespace-nowrap">
                                            ✨ Trusted by Families
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2x2 Feature Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            {[
                                {
                                    icon: "✓",
                                    title: "Free & Safe to Use",
                                    desc: "No hidden costs. No ads. Just pure fun & magic.",
                                    gradient: "from-cyan-400 to-blue-500",
                                    glow: "shadow-cyan-500/30"
                                },
                                {
                                    icon: "👥",
                                    title: "Magic for the whole family",
                                    desc: "Everyone can follow the journey together — kids, parents, even grandparents.",
                                    gradient: "from-fuchsia-400 to-purple-500",
                                    glow: "shadow-fuchsia-500/30"
                                },
                                {
                                    icon: "♥",
                                    title: "Created with parents & dentists",
                                    desc: "Designed to feel warm, gentle, and genuinely magical.",
                                    gradient: "from-pink-400 to-rose-500",
                                    glow: "shadow-pink-500/30"
                                },
                                {
                                    icon: "⭐",
                                    title: "Loved by Parents & Kids",
                                    desc: "More than a hundred families are already tracking Kiki's nightly flights.",
                                    gradient: "from-amber-400 to-orange-500",
                                    glow: "shadow-amber-500/30"
                                }
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="group relative bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-[1.5rem] p-6 hover:border-white/20 hover:bg-slate-900/80 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-5">
                                        {/* Glowing Icon Box */}
                                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ${feature.glow} group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                                            <span className="text-2xl">{feature.icon}</span>
                                        </div>

                                        {/* Text */}
                                        <div>
                                            <h3 className="font-bold text-white text-lg mb-1">{feature.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="text-center">
                            <button
                                onClick={handleEnter}
                                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white px-10 py-5 rounded-xl font-sans font-extrabold text-lg uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-[#1e40af] active:border-b-0 flex items-center justify-center gap-3 mx-auto"
                            >
                                <span>Start the Journey</span>
                                <span className="text-xl">✨</span>
                            </button>

                            {/* Trust Signals */}
                            <div className="flex items-center justify-center gap-4 mt-5 text-slate-500 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    No credit card required
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5">
                                    <span>⏱</span>
                                    Takes 3 seconds
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== SECTION 5: PRESS LOGOS ========== */}
                <section className="relative py-20 px-4">
                    {/* Background glow */}
                    <div className="absolute inset-0 flex justify-center pointer-events-none">
                        <div className="w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
                    </div>

                    <div className="container mx-auto max-w-5xl relative z-10">
                        {/* Section Title */}
                        <div className="text-center mb-10">
                            <h2 className="font-chrome text-3xl md:text-4xl text-white uppercase tracking-normal">
                                They're Talking About Us
                            </h2>
                        </div>

                        {/* Logo Grid - Pops more */}
                        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                            {/* Placeholder Logos - Replace with actual press logos */}
                            {[
                                { name: "TechCrunch", width: "w-36" },
                                { name: "Forbes", width: "w-28" },
                                { name: "Parents", width: "w-32" },
                                { name: "Mashable", width: "w-32" },
                                { name: "The Verge", width: "w-32" }
                            ].map((press, idx) => (
                                <div
                                    key={idx}
                                    className={`${press.width} h-12 bg-slate-800/60 border border-white/10 rounded-xl flex items-center justify-center hover:bg-slate-800 hover:border-white/20 transition-all cursor-pointer`}
                                >
                                    <span className="text-white/70 text-sm font-bold tracking-wide">
                                        {press.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== SECTION 6: FAQ & CONTACT ========== */}
                <section id="faq" className="relative py-24 px-4">
                    {/* Thin glowing line divider */}
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
                    </div>

                    <div className="container mx-auto max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-16 items-start">

                            {/* Contact Form Column - LEFT (3 Stacked Cards) */}
                            <div className="relative w-full max-w-lg">
                                {/* 3 Stacked background cards */}
                                <div className="absolute w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] transform rotate-6 translate-x-3 translate-y-3 shadow-2xl opacity-70" />
                                <div className="absolute w-full h-full bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-[2rem] transform -rotate-3 translate-x-1 translate-y-1 shadow-2xl opacity-80" />
                                <div className="absolute w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-[2rem] transform rotate-2 -translate-y-1 shadow-2xl opacity-90" />

                                {/* Main Form Card */}
                                <div className="relative bg-slate-950 rounded-[2rem] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border-2 border-white/10 z-10">
                                    {/* Inner subtle glow */}
                                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

                                    <div className="relative z-10 space-y-6">
                                        <div className="mb-6">
                                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Say Hello</span>
                                            <h2 className="font-chrome text-2xl md:text-3xl text-white uppercase tracking-normal mt-2">
                                                Get in Touch
                                            </h2>
                                        </div>

                                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                            <div>
                                                <label className="block text-white font-bold text-sm mb-2">Your Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Sarah"
                                                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white font-bold text-sm mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    placeholder="sarah@email.com"
                                                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white font-bold text-sm mb-2">Message</label>
                                                <textarea
                                                    rows={4}
                                                    placeholder="Hi! I had a question about..."
                                                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner resize-none"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white py-4 rounded-xl font-sans font-extrabold uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-[#1e40af] active:border-b-0"
                                            >
                                                Send Message ✨
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Column - RIGHT */}
                            <div>
                                <div className="mb-8">
                                    <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest">Got Questions?</span>
                                    <h2 className="font-chrome text-3xl md:text-4xl text-white uppercase tracking-normal mt-2">
                                        Frequently Asked
                                    </h2>
                                </div>

                                {/* FAQ Items */}
                                <div className="space-y-4">
                                    {[
                                        {
                                            q: "Is this really free?",
                                            a: "Yes! The Tooth Fairy Tracker is completely free. No hidden costs, no subscriptions, no ads."
                                        },
                                        {
                                            q: "How long does it take to set up?",
                                            a: "Just 3 seconds! Enter your child's name and you're ready to go."
                                        },
                                        {
                                            q: "When should I start the tracker?",
                                            a: "Start it about 30 minutes before bedtime for the full experience. Kiki sends her first updates right away!"
                                        },
                                        {
                                            q: "Can grandparents watch too?",
                                            a: "Absolutely! Share the tracking link with family so everyone can follow Kiki's journey together."
                                        },
                                        {
                                            q: "Is my child's name stored anywhere?",
                                            a: "No. We don't store any personal information. Everything stays on your device."
                                        }
                                    ].map((faq, idx) => (
                                        <details
                                            key={idx}
                                            className="group bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden"
                                        >
                                            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors">
                                                <span className="font-semibold text-white">{faq.q}</span>
                                                <span className="text-cyan-400 text-xl group-open:rotate-45 transition-transform">+</span>
                                            </summary>
                                            <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">
                                                {faq.a}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

            </div >
        </div >
    );
};

export default NewLandingPage;
