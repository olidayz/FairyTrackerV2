import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronsRight, ArrowRight, Menu, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCopy } from './lib/useCopy';

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

// Video component that handles autoplay properly
const AutoPlayVideo = ({ src, isActive, className }: { src: string; isActive: boolean; className: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        
        if (isActive) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [isActive, src]);
    
    const handleLoadedData = () => {
        if (isActive && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };
    
    return (
        <video
            ref={videoRef}
            src={src}
            muted
            loop
            playsInline
            autoPlay={isActive}
            preload={isActive ? "auto" : "metadata"}
            onLoadedData={handleLoadedData}
            className={className}
        />
    );
};

const NewLandingPage = () => {
    const navigate = useNavigate();
    const { get } = useCopy();
    const [activeStage, setActiveStage] = useState(1);
    const [activeReview, setActiveReview] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const trackerIframeRef = useRef<HTMLIFrameElement>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [fairyPosition, setFairyPosition] = useState(0);
    
    const [childName, setChildName] = useState('');
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Dynamic CMS content
    const [landingContent, setLandingContent] = useState<{
        hero: { headline: string; subheadline: string; badgeText: string; ctaText: string } | null;
        reviews: Array<{ id: number; reviewerName: string; reviewerLocation: string; reviewText: string; rating: number }>;
        kikiProfile: { name: string; title: string; bio: string; photoUrl: string } | null;
        faqs: Array<{ id: number; question: string; answer: string }>;
        images: Record<string, string | null>;
        stageTitles: Record<string, string>;
        mediaTypes: Record<string, string>;
    }>({ hero: null, reviews: [], kikiProfile: null, faqs: [], images: {}, stageTitles: {}, mediaTypes: {} });
    
    // Stage content from CMS (same as tracker)
    const [stageContent, setStageContent] = useState<Array<{
        id: number;
        content: { messageText?: string | null; title?: string | null } | null;
    }>>([]);
    
    useEffect(() => {
        fetch('/api/landing-content')
            .then(res => res.json())
            .then(data => setLandingContent(data))
            .catch(err => console.error('Failed to load landing content:', err));
        
        // Fetch stage content for messages
        fetch('/api/stage-content')
            .then(res => res.json())
            .then(data => setStageContent(data))
            .catch(err => console.error('Failed to load stage content:', err));
    }, []);

    const handleSignup = async () => {
        setFormError('');
        
        if (!childName.trim()) {
            setFormError(get('error_name_required'));
            return;
        }
        
        if (!email.trim()) {
            setFormError(get('error_email_required'));
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFormError(get('error_email_invalid'));
            return;
        }
        
        setIsSubmitting(true);
        
        // Capture UTM parameters from URL for referral tracking
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || undefined;
        const utmMedium = urlParams.get('utm_medium') || undefined;
        const utmCampaign = urlParams.get('utm_campaign') || undefined;
        
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: childName.trim(), 
                    email: email.trim(),
                    utmSource,
                    utmMedium,
                    utmCampaign,
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }
            
            navigate(data.trackerUrl);
        } catch (error: any) {
            setFormError(error.message || get('error_generic'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fairy positions for animation (North America path)
    const fairyPath = [
        [47.6, -122.3], // Seattle
        [40.7, -111.9], // Salt Lake
        [39.7, -104.9], // Denver
        [41.9, -87.6],  // Chicago
        [40.7, -74.0],  // New York
    ];

    // Animate fairy every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setFairyPosition(prev => (prev + 1) % fairyPath.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

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

    // Reviews data with dynamic content fallback
    const colorSchemes = [
        { bg: "bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600", glow: "shadow-[0_20px_50px_rgba(34,211,238,0.3)]" },
        { bg: "bg-gradient-to-br from-fuchsia-400 via-fuchsia-500 to-purple-600", glow: "shadow-[0_20px_50px_rgba(232,121,249,0.3)]" },
        { bg: "bg-gradient-to-br from-lime-400 via-lime-500 to-green-600", glow: "shadow-[0_20px_50px_rgba(163,230,53,0.3)]" },
        { bg: "bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600", glow: "shadow-[0_20px_50px_rgba(251,191,36,0.3)]" },
        { bg: "bg-gradient-to-br from-rose-400 via-rose-500 to-pink-600", glow: "shadow-[0_20px_50px_rgba(251,113,133,0.3)]" },
    ];
    
    const defaultReviews = [
        { name: "Sarah M.", role: "Mother of two", review: "My daughter ABSOLUTELY LOVED watching the little videos at every step! It made the Tooth Fairy feel so real." },
        { name: "James P.", role: "Dad", review: "Finally a stress-free way to handle the Tooth Fairy. The tracker bought us so much time!" },
        { name: "Emily R.", role: "Parent", review: "The custom selfie from Kiki blew their minds. Best app ever." }
    ];
    
    const reviews = landingContent.reviews.length > 0
        ? landingContent.reviews.map((r, i) => ({
            name: r.reviewerName,
            role: r.reviewerLocation || 'Parent',
            review: r.reviewText,
            ...colorSchemes[i % colorSchemes.length]
        }))
        : defaultReviews.map((r, i) => ({ ...r, ...colorSchemes[i % colorSchemes.length] }));

    const defaultFairyPhoto = "/Fairy photo booth pic.webp";
    
    // Helper to get CMS message for a stage
    const getStageMessage = (stageId: number, defaultMessage: string) => {
        const content = stageContent.find(s => s.id === stageId)?.content;
        return content?.messageText || defaultMessage;
    };
    
    // Helper to get CMS title for a stage
    const getStageTitle = (stageId: number, defaultTitle: string) => {
        const content = stageContent.find(s => s.id === stageId)?.content;
        return content?.title || defaultTitle;
    };
    
    const storyStages: Array<{stage: number; title: string; location: string; image: string; isVideo: boolean; message: string; color: string}> = [
        {
            stage: 1,
            title: getStageTitle(1, "The Departure"),
            location: "North Star Portal",
            image: landingContent.images?.stage_1_photo || defaultFairyPhoto,
            isVideo: landingContent.mediaTypes?.stage_1_photo === 'video',
            message: getStageMessage(1, "I've just taken flight from the North Star! The wind is in my wings and I'm heading your way. Keep that tooth safe! ✨"),
            color: "from-cyan-400 to-blue-500"
        },
        {
            stage: 2,
            title: getStageTitle(2, "Mid-Flight Magic"),
            location: "Sparkle Mountains",
            image: landingContent.images?.stage_2_photo || defaultFairyPhoto,
            isVideo: landingContent.mediaTypes?.stage_2_photo === 'video',
            message: getStageMessage(2, "Just passed over the Sparkle Mountains. The view is breath-taking! I can see your neighborhood lights from here. 🏔️"),
            color: "from-fuchsia-400 to-purple-500"
        },
        {
            stage: 3,
            title: getStageTitle(3, "Cloud Surfing"),
            location: "Silver Lining Lane",
            image: landingContent.images?.stage_3_photo || defaultFairyPhoto,
            isVideo: landingContent.mediaTypes?.stage_3_photo === 'video',
            message: getStageMessage(3, "Hitching a ride on a silver lining! Almost there. Is everyone tucked in tight? The magic works best when you're dreaming! ☁️"),
            color: "from-amber-400 to-orange-500"
        },
        {
            stage: 4,
            title: getStageTitle(4, "Final Approach"),
            location: "Your Neighborhood",
            image: landingContent.images?.stage_4_photo || defaultFairyPhoto,
            isVideo: landingContent.mediaTypes?.stage_4_photo === 'video',
            message: getStageMessage(4, "I'm circling your street now! Just look for the faint trail of stardust. I'll be at your window in just a few minutes! 🏠"),
            color: "from-lime-400 to-green-500"
        },
        {
            stage: 5,
            title: getStageTitle(5, "Mission Complete"),
            location: "Your Pillow",
            image: landingContent.images?.stage_5_photo || defaultFairyPhoto,
            isVideo: landingContent.mediaTypes?.stage_5_photo === 'video',
            message: getStageMessage(5, "Mission successful! The tooth has been collected and a special surprise is waiting for you. Safe travels back to Fairy HQ! 🦷"),
            color: "from-red-400 to-pink-500"
        },
        {
            stage: 6,
            title: getStageTitle(6, "Home Bound"),
            location: "Fairy HQ",
            image: landingContent.images?.stage_6_photo || defaultFairyPhoto,
            isVideo: landingContent.mediaTypes?.stage_6_photo === 'video',
            message: getStageMessage(6, "I'm back home now, tucked into my own petal bed. I'll see you again for the next one! Sweet dreams! 🌸"),
            color: "from-indigo-400 to-blue-600"
        }
    ];

    const handleEnter = () => document.getElementById('start-mission')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="min-h-screen bg-[#0a1020] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* === FIXED BACKGROUND === */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Base Night - Lighter */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />

                {/* Boosted ambient glows - hidden on mobile to prevent iOS Safari black screen */}
                <div className="hidden lg:block absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen" />
                <div className="hidden lg:block absolute bottom-0 right-0 w-[800px] h-[800px] bg-teal-500/8 rounded-full blur-[120px] mix-blend-screen" />
                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[200px] mix-blend-screen" />


                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                {/* Subtle noise texture */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }} />
            </div>

            <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="mx-4 mt-4">
                    <div className="max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 md:px-6 py-3 shadow-2xl">
                        <div className="flex items-center justify-between">

                            {/* Left: Hamburger (mobile) or Nav Links (desktop) */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
                                >
                                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
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
                            </div>

                            {/* Center: Logo */}
                            <div className="absolute left-1/2 -translate-x-1/2">
                                <div className="w-16 h-16 rounded-xl overflow-hidden">
                                    <img src="/kiki-logo.png" alt="Kiki" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            {/* Right: CTA */}
                            <button
                                onClick={handleEnter}
                                className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-sans font-extrabold text-xs md:text-sm uppercase tracking-tight shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 border-b-[3px] border-indigo-900 active:border-b-0"
                            >
                                Start Tracking
                            </button>

                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mx-4 mt-2">
                        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                            <nav className="flex flex-col gap-4">
                                <a href="#meet-kiki" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2">
                                    Meet Kiki
                                </a>
                                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2">
                                    How it Works
                                </a>
                                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2">
                                    FAQ
                                </a>
                            </nav>
                        </div>
                    </div>
                )}
            </header>

            <div className="relative z-10 pt-24">

                {/* ========== SECTION 1: HERO ========== */}
                <section className="relative py-12 md:py-16 px-4 overflow-hidden">
                    <div className="container mx-auto max-w-7xl">

                        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4 lg:gap-0 items-center">

                            {/* LEFT SIDE: Text Content */}
                            <div className="relative z-10 text-center lg:text-left">
                                <div className="space-y-6">
                                    {/* Status Badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-xl transform -rotate-1 shadow-xl border-2 border-white/50">
                                        <span className="text-[11px] font-sans font-bold text-white tracking-wide">The World's #1 Tooth Fairy Experience</span>
                                    </div>

                                    {/* Main Headline */}
                                    <div className="space-y-3">
                                        <h1 className="font-chrome text-5xl lg:text-6xl text-white leading-[0.95] tracking-normal">
                                            Track the Tooth&nbsp;Fairy,<br />
                                            <span className="text-white">Bring the Magic to&nbsp;Life</span>
                                        </h1>
                                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-sans">
                                            A magical experience where the Tooth Fairy sends videos and updates as she flies to pick up their tooth.
                                        </p>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start pt-2">
                                        <button
                                            onClick={handleEnter}
                                            className="relative group/btn overflow-hidden bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white px-7 py-4 md:px-8 md:py-5 rounded-xl font-sans font-extrabold text-sm md:text-base uppercase tracking-tight shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-cyan-800 active:border-b-0 flex items-center justify-center gap-2 w-full sm:w-auto"
                                        >
                                            <span className="relative z-10">Start the Journey</span>
                                            <ChevronsRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>

                                        <button
                                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="px-7 py-4 md:px-8 md:py-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all font-sans font-bold text-sm md:text-base uppercase tracking-tight flex items-center justify-center gap-2 w-full sm:w-auto"
                                        >
                                            <span>How It Works</span>
                                            <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                                        </button>
                                    </div>

                                    {/* No Credit Card - simple styling with dots */}
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 text-slate-400 text-xs sm:text-sm">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-lime-500"></span>
                                            No credit card required
                                        </span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="flex items-center gap-2">
                                            <span className="text-slate-500">⏻</span>
                                            No Download
                                        </span>
                                    </div>

                                    {/* Social Proof */}
                                    <div className="flex items-center justify-center lg:justify-start pt-1">
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
                            <div
                                className="relative h-[280px] md:h-[600px] flex items-center justify-center touch-pan-y mt-8 md:mt-0"
                                style={{ perspective: '1500px' }}
                                onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                                onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                                onTouchEnd={() => {
                                    if (!touchStart || !touchEnd) return;
                                    const distance = touchStart - touchEnd;
                                    const isSwipe = Math.abs(distance) > 50;
                                    if (isSwipe) {
                                        if (distance > 0) {
                                            setActiveStage(prev => prev === 6 ? 1 : prev + 1);
                                        } else {
                                            setActiveStage(prev => prev === 1 ? 6 : prev - 1);
                                        }
                                    }
                                    setTouchStart(null);
                                    setTouchEnd(null);
                                }}
                            >
                                {/* Decorative Anchor Shape (Option 4) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[120%] h-full md:h-[120%] max-w-[800px] pointer-events-none z-0 overflow-hidden">
                                    <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/5 rounded-full blur-[100px] transform -rotate-12 scale-110" />
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
                                        transform = window.innerWidth < 768 
                                            ? 'rotateY(-10deg) rotateX(3deg) translateZ(-60px) translateX(40px) translateY(15px) scale(0.9)'
                                            : 'rotateY(-15deg) rotateX(4deg) translateZ(-80px) translateX(80px) translateY(20px) scale(0.92)';
                                        zIndex = 20;
                                        opacity = 0.7;
                                    } else if (isPrev) {
                                        transform = window.innerWidth < 768
                                            ? 'rotateY(-3deg) rotateX(0deg) translateZ(-100px) translateX(-40px) translateY(-10px) scale(0.85)'
                                            : 'rotateY(-3deg) rotateX(0deg) translateZ(-150px) translateX(-80px) translateY(-15px) scale(0.85)';
                                        zIndex = 10;
                                        opacity = 0.5;
                                    }

                                    return (
                                        <div
                                            key={stage.stage}
                                            className={`absolute w-[90%] md:w-full max-w-[600px] transition-all duration-700 ease-out cursor-pointer group/card`}
                                            style={{ transform, zIndex, opacity }}
                                            onClick={() => setActiveStage(stage.stage)}
                                        >
                                            {/* Card Container */}
                                            <div className={`relative w-full aspect-[16/10] md:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 shadow-[0_25px_50px_rgba(0,0,0,0.5)] ring-2 md:ring-4`} style={{
                                                '--tw-ring-color': stage.color.includes('cyan') ? '#22d3ee' : stage.color.includes('fuchsia') ? '#e879f9' : stage.color.includes('amber') ? '#fbbf24' : stage.color.includes('lime') ? '#a3e635' : stage.color.includes('red') ? '#f87171' : '#818cf8'
                                            } as React.CSSProperties}>

                                                {/* Media Content (Video or Image) */}
                                                {(() => {
                                                    const shouldLoad = isActive || isNext || isPrev;
                                                    
                                                    if (!shouldLoad) {
                                                        return (
                                                            <div className="absolute inset-0 w-full h-full bg-slate-800" />
                                                        );
                                                    }
                                                    
                                                    return stage.isVideo ? (
                                                        <AutoPlayVideo
                                                            src={stage.image}
                                                            isActive={isActive}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover/card:scale-110"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={stage.image}
                                                            alt={stage.title}
                                                            loading={isActive ? "eager" : "lazy"}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover/card:scale-110"
                                                        />
                                                    );
                                                })()}

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

                                                {/* Title Banner with Location - Top */}
                                                <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-20">
                                                    <div className="inline-flex items-start gap-2 md:gap-3">
                                                        {/* Stage Badge */}
                                                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-xl border-2 border-white transform -rotate-3 transition-transform group-hover/card:rotate-3 shrink-0`}>
                                                            <span className="text-white text-sm md:text-xl font-black">{stage.stage}</span>
                                                        </div>
                                                        {/* Title + Location */}
                                                        <div className={`bg-gradient-to-r ${stage.color} px-3 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl transform rotate-1 shadow-xl border-2 border-white/50 transition-transform group-hover/card:-rotate-1`}>
                                                            <h3 className="font-chrome text-sm md:text-2xl text-white uppercase tracking-wide">
                                                                {stage.title}
                                                            </h3>
                                                            <div className="hidden md:flex items-center gap-1 text-white/70 text-[10px]">
                                                                <span>📍</span>
                                                                <span>{stage.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Active Ring */}
                                                {isActive && (
                                                    <div className="absolute inset-0 rounded-3xl ring-4 ring-white/60 pointer-events-none" />
                                                )}
                                            </div>

                                            {/* Chat Bubble - Outside card container so it can hang */}
                                            <div className="relative -mt-4 mx-auto max-w-[70%] z-30">
                                                <div className="bg-white rounded-2xl p-2 md:p-3 shadow-xl border-2 border-white/50">
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden ring-2 ring-cyan-400 flex-shrink-0">
                                                            <img src="/PFP FULL SIZE KIKI 1.png" className="w-full h-full object-cover" alt="Kiki" />
                                                        </div>
                                                        <p className="font-sans text-slate-700 text-[10px] md:text-xs leading-relaxed flex-1 line-clamp-2">
                                                            "{stage.message}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Stage Dots - Inside the relative container */}
                                <div className="absolute -bottom-6 md:bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
                                    {storyStages.map((stage, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveStage(idx + 1)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStage === idx + 1 ? `bg-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.8)]` : 'bg-white/40 hover:bg-white/60'}`}
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
                        <div className="text-center mb-8">
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

                            {/* Description Text - Now under title */}
                            <p className="text-slate-300 text-lg mt-6">
                                Tell us your child's name and email, and we'll create their personalized tracker right away.
                            </p>
                        </div>

                        {/* STEP SEQUENCE - Cleaner Design */}
                        <div className="mb-10">
                            {/* Desktop: Clean horizontal steps */}
                            <div className="hidden md:grid grid-cols-4 gap-6 max-w-3xl mx-auto">
                                {/* Step 1 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg border-2 border-white/30">
                                        <span className="font-chrome text-2xl text-white">1</span>
                                    </div>
                                    <h4 className="font-bold text-white mt-3 text-sm">Enter Child's Name</h4>
                                    <p className="text-slate-400 text-xs mt-1">Quick 10-second signup</p>
                                </div>

                                {/* Step 2 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center shadow-lg border-2 border-white/30">
                                        <span className="font-chrome text-2xl text-white">2</span>
                                    </div>
                                    <h4 className="font-bold text-white mt-3 text-sm">Get Your Tracker Link</h4>
                                    <p className="text-slate-400 text-xs mt-1">Delivered instantly by email</p>
                                </div>

                                {/* Step 3 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg border-2 border-white/30">
                                        <span className="font-chrome text-2xl text-white">3</span>
                                    </div>
                                    <h4 className="font-bold text-white mt-3 text-sm">Track the Fairy's Journey</h4>
                                    <p className="text-slate-400 text-xs mt-1">Live map + nighttime updates</p>
                                </div>

                                {/* Step 4 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/30">
                                        <span className="font-chrome text-2xl text-white">4</span>
                                    </div>
                                    <h4 className="font-bold text-white mt-3 text-sm">Wake Up to Magic</h4>
                                    <p className="text-slate-400 text-xs mt-1">Morning updates reveal what happened</p>
                                </div>
                            </div>

                            <div className="md:hidden grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3 border border-white/10">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 border border-white/30">
                                        <span className="font-chrome text-lg text-white">1</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-xs">Enter Name</h4>
                                        <p className="text-slate-400 text-[10px]">10-sec signup</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3 border border-white/10">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center shrink-0 border border-white/30">
                                        <span className="font-chrome text-lg text-white">2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-xs">Get Tracker Link</h4>
                                        <p className="text-slate-400 text-[10px]">Instant email</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3 border border-white/10">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shrink-0 border border-white/30">
                                        <span className="font-chrome text-lg text-white">3</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-xs">Track Journey</h4>
                                        <p className="text-slate-400 text-[10px]">Live map + updates</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3 border border-white/10">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 border border-white/30">
                                        <span className="font-chrome text-lg text-white">4</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-xs">Wake Up to Magic</h4>
                                        <p className="text-slate-400 text-[10px]">Morning reveals all</p>
                                    </div>
                                </div>
                            </div>
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
                                    {/* Full height map with overlay */}
                                    <div className="relative" style={{ height: '320px' }}>
                                        <MapContainer
                                            center={[39, -98]}
                                            zoom={3}
                                            zoomSnap={0.1}
                                            scrollWheelZoom={false}
                                            dragging={false}
                                            zoomControl={false}
                                            attributionControl={false}
                                            style={{ height: '100%', width: '100%', background: '#020617' }}
                                        >
                                            <MapUpdater center={[30, -20]} zoom={1} />
                                            <TileLayer
                                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                            />
                                            {/* Animated fairy marker */}
                                            <Marker
                                                position={fairyPath[fairyPosition] as [number, number]}
                                                icon={L.divIcon({
                                                    className: 'custom-fairy-preview',
                                                    html: `<div style="width: 28px; height: 28px; border-radius: 50%; border: 2px solid #22d3ee; box-shadow: 0 0 12px #22d3ee; background: url('/PFP FULL SIZE KIKI 1.png') center/cover; overflow: hidden; transition: all 0.5s ease;"></div>`,
                                                    iconSize: [28, 28],
                                                    iconAnchor: [14, 14]
                                                })}
                                            />
                                        </MapContainer>

                                        {/* Gradient overlay + Text content */}
                                        <div className="absolute inset-x-0 bottom-0 z-[500] bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pt-20 pb-6 px-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-2xl">🗺️</span>
                                                <p className="text-white text-base font-semibold">
                                                    A personalized tracking experience
                                                </p>
                                            </div>
                                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                                <ul className="space-y-2 text-slate-300 text-sm">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-cyan-400">✓</span>
                                                        <span>Tracker page <span className="text-white font-medium">customized with their name</span></span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-cyan-400">✓</span>
                                                        <span>Watch her <span className="text-white font-medium">speed & location</span></span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-cyan-400">✓</span>
                                                        <span>View her <span className="text-white font-medium">Fairy ID</span> & <span className="text-white font-medium">mission progress</span></span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

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
                                    {/* Full height image with overlay */}
                                    <div className="relative" style={{ height: '320px' }}>
                                        <img
                                            src={landingContent.images?.fairy_updates_photo || defaultFairyPhoto}
                                            alt="Kiki the Tooth Fairy"
                                            className="w-full h-full object-cover object-[center_20%]"
                                        />

                                        {/* Gradient overlay + Text content */}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pt-20 pb-6 px-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-2xl">✨</span>
                                                <p className="text-white text-base font-semibold">
                                                    6 updates — each with a video, message & selfie
                                                </p>
                                            </div>
                                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                                <p className="text-slate-300 text-sm leading-relaxed">
                                                    <span className="text-cyan-400 font-medium">First 3</span> unlock before bedtime.
                                                    <span className="text-amber-400 font-medium"> Final 3</span> unlock in the morning—so kids can see what the fairy did overnight.
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Note */}
                        <div className="text-center mt-8">
                            <p className="text-slate-500 text-xs">
                                ✨ You control what your child sees—and can unlock morning stages anytime.
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
                <section id="start-mission" className="relative py-24 px-4 overflow-hidden">
                    {/* Background Accents - hidden on mobile */}
                    <div className="hidden lg:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="hidden lg:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="container mx-auto max-w-6xl">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-950/50 border border-lime-500/30 rounded-full mb-4">
                                <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-lime-300 uppercase tracking-widest">Ready to Launch</span>
                            </div>
                            <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal mb-4">
                                {get('section_start_magic')}
                            </h2>
                            <p className="text-slate-400 text-lg max-w-xl mx-auto">
                                {get('section_start_magic_desc')}
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
                                                <span className="text-sm font-bold text-cyan-300">{get('live_counter')} ✨</span>
                                            </div>
                                        </div>

                                        {/* Child's First Name Input - BIGGER */}
                                        <div>
                                            <label className="block text-white font-bold text-lg mb-2">{get('form_child_name_label')}</label>
                                            <p className="text-slate-400 text-sm mb-3">{get('form_child_name_desc')}</p>
                                            <input
                                                type="text"
                                                placeholder="Enter name..."
                                                value={childName}
                                                onChange={(e) => setChildName(e.target.value)}
                                                className="w-full px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner"
                                            />
                                        </div>

                                        {/* Email Input - BIGGER */}
                                        <div>
                                            <label className="block text-white font-bold text-lg mb-2">{get('form_email_label')}</label>
                                            <p className="text-slate-400 text-sm mb-3">{get('form_email_desc')}</p>
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner"
                                            />
                                        </div>

                                        {/* Error Message */}
                                        {formError && (
                                            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg py-3 px-4">
                                                {formError}
                                            </div>
                                        )}

                                        {/* CTA Button - MASSIVE */}
                                        <button
                                            onClick={handleSignup}
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white px-8 py-6 rounded-xl font-sans font-extrabold text-xl uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-[#1e40af] active:border-b-0 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            <span>{isSubmitting ? get('form_submit_button_loading') : get('form_submit_button')}</span>
                                            {!isSubmitting && <span className="text-2xl">✨</span>}
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
                                        desc: "You control what your child sees—and can unlock morning stages anytime.",
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
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-fuchsia-950/50 border border-fuchsia-500/30 rounded-full mb-4">
                                <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest">✨ Sneak Peek</span>
                            </div>
                            <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal mb-0 relative">
                                Inside the Tracker
                            </h2>
                            <div className="relative -mt-2 mb-6 inline-block">
                                <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-1.5 rounded-lg transform rotate-1 border-2 border-white/30 shadow-lg">
                                    <p className="font-sans font-bold text-xs text-white uppercase tracking-wide">
                                        A preview of the experience
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

                        {/* Bento Grid Feature Cards - Colorful like reviews */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Large Featured Card - Live Tracking Map */}
                            <div
                                className="col-span-2 row-span-2 group cursor-pointer"
                                onClick={() => scrollToSection('tracker-map')}
                            >
                                <div className="h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl ring-2 ring-white/30 overflow-hidden hover:scale-[1.02] transition-all duration-300 relative">
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                    <div className="relative z-10 p-5 md:p-8 h-full flex flex-col justify-between min-h-[180px] md:min-h-[280px]">
                                        <div>
                                            <span className="text-4xl md:text-6xl mb-3 block">🗺️</span>
                                            <h3 className="font-bold text-white text-lg md:text-2xl mb-1 md:mb-2">Live Tracking Map</h3>
                                            <p className="text-white/80 text-sm md:text-base leading-relaxed">Watch Kiki fly across the globe in real-time.</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-white text-sm font-semibold mt-3">
                                            <span>Explore</span>
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Small Card - Video Updates */}
                            <div
                                className="group cursor-pointer"
                                onClick={() => scrollToSection('tracker-videos')}
                            >
                                <div className="h-full bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl shadow-xl ring-2 ring-white/30 overflow-hidden hover:scale-[1.02] transition-all duration-300 p-4 md:p-5 min-h-[100px] md:min-h-[140px] flex flex-col justify-between relative">
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                    <span className="text-lg md:text-3xl relative z-10">🎬</span>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-white text-sm md:text-base">Video Updates</h3>
                                        <p className="text-white/70 text-[10px] md:text-xs mt-0.5">Vlog-Style Updates from the Fairy</p>
                                    </div>
                                </div>
                            </div>

                            {/* Small Card - Custom Page */}
                            <div
                                className="group cursor-pointer"
                                onClick={() => document.getElementById('start-mission')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <div className="h-full bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl ring-2 ring-white/30 overflow-hidden hover:scale-[1.02] transition-all duration-300 p-4 md:p-5 min-h-[100px] md:min-h-[140px] flex flex-col justify-between relative">
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                    <span className="text-lg md:text-3xl relative z-10">✨</span>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-white text-sm md:text-base">Made for Your Child</h3>
                                        <p className="text-white/70 text-[10px] md:text-xs mt-0.5">A Page Personalized with their Name</p>
                                    </div>
                                </div>
                            </div>

                            {/* Small Card - Speed & Stats */}
                            <div
                                className="group cursor-pointer"
                                onClick={() => scrollToSection('tracker-speed')}
                            >
                                <div className="h-full bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl shadow-xl ring-2 ring-white/30 overflow-hidden hover:scale-[1.02] transition-all duration-300 p-4 md:p-5 min-h-[100px] md:min-h-[140px] flex flex-col justify-between relative">
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                    <span className="text-lg md:text-3xl relative z-10">⚡</span>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-white text-sm md:text-base">Speed & Stats</h3>
                                        <p className="text-white/70 text-[10px] md:text-xs mt-0.5">Live Mission Stats</p>
                                    </div>
                                </div>
                            </div>

                            {/* Small Card - Morning Surprise */}
                            <div
                                className="group cursor-pointer"
                                onClick={() => scrollToSection('tracker-videos')}
                            >
                                <div className="h-full bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl ring-2 ring-white/30 overflow-hidden hover:scale-[1.02] transition-all duration-300 p-4 md:p-5 min-h-[100px] md:min-h-[140px] flex flex-col justify-between relative">
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                    <span className="text-lg md:text-3xl relative z-10">🌅</span>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-white text-sm md:text-base">Morning Reveal</h3>
                                        <p className="text-white/70 text-[10px] md:text-xs mt-0.5">See What the Fairy Did Overnight</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hint text */}
                        <div className="flex justify-center mt-6">
                            <p className="text-slate-500 text-sm">Click any card to explore that feature</p>
                        </div>
                    </div>
                </section>

                {/* ========== SECTION 2.9: MEET KIKI ========== */}
                <section id="meet-kiki" className="relative py-24 px-4 overflow-hidden">
                    {/* Background Glow - hidden on mobile to prevent rendering issues */}
                    <div className="hidden lg:block absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

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
                                    <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white tracking-wide">
                                        Meet Kiki the Tooth Fairy
                                    </h2>

                                    {/* Paragraphs */}
                                    <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                                        <p>
                                            Kiki is the fairy your child will see in every video. She is cheerful, curious, and usually running (or flying) just a tiny bit late. She gets ready in her castle, gathers her things, and heads out on her nightly rounds.
                                        </p>
                                        <p className="text-white font-medium">
                                            Kiki's whole goal is simple: She wants to turn every wiggly tooth into a big adventure your child will remember forever.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* The Image (overlaps the card) */}
                            <div className="lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[550px] mt-4 lg:mt-0 mx-auto max-w-[350px] lg:max-w-none transform lg:-rotate-3">
                                {/* Glow behind image - hidden on mobile to prevent color block rendering issue */}
                                <div className="hidden lg:block absolute -inset-4 bg-gradient-to-br from-cyan-400/40 via-teal-400/30 to-cyan-400/40 rounded-[2rem] blur-2xl" />

                                {/* Image Frame */}
                                <div className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl">
                                    <img
                                        src={landingContent.images?.meet_kiki_photo || defaultFairyPhoto}
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
                        <div className="relative h-[350px] md:h-[450px] flex items-center justify-center">
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
                                        className="absolute w-full max-w-sm md:max-w-xl transition-all duration-500 ease-out cursor-pointer hover:opacity-80"
                                        style={{ transform, opacity, zIndex }}
                                        onClick={() => setActiveReview(index)}
                                    >
                                        {/* Card with ring wrapper */}
                                        <div className={`${review.bg} ${review.glow} rounded-[2rem] shadow-2xl ring-4 ring-white/50`}>
                                            <div className="relative p-6 md:p-10 rounded-[2rem] overflow-hidden">
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
                                                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center shadow-lg">
                                                        <span className="font-chrome text-xl md:text-3xl text-white">{review.name.charAt(0)}</span>
                                                    </div>

                                                    {/* Name & Role */}
                                                    <div>
                                                        <h4 className="font-bold text-white text-base md:text-xl">{review.name}</h4>
                                                        <p className="text-white/70 text-sm md:text-base">{review.role}</p>
                                                    </div>

                                                    {/* Review */}
                                                    <p className="text-white text-base md:text-2xl font-medium italic leading-relaxed">
                                                        "{review.review}"
                                                    </p>

                                                    {/* Stars */}
                                                    <div className="flex gap-1 md:gap-2">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <Star key={i} size={18} className="md:w-6 md:h-6 fill-white text-white drop-shadow-lg" />
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
                    {/* Background Glow - hidden on mobile */}
                    <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[200px] pointer-events-none" />

                    <div className="container mx-auto max-w-5xl">
                        {/* Header */}
                        <div className="text-center mb-14">
                            <div className="relative inline-block mb-8">
                                <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal">
                                    Why Families Love Our<br />
                                    <span className="text-white">Tooth Fairy Tracker</span>
                                </h2>
                                {/* Badge under title - styled like How It Works */}
                                <div className="absolute -bottom-6 md:-bottom-2 left-1/2 -translate-x-1/2 transform rotate-2">
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
                                    No Download
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== SECTION 5: PRESS LOGOS ========== */}
                <section className="relative py-20 px-4">
                    {/* Background glow - hidden on mobile */}
                    <div className="hidden lg:flex absolute inset-0 justify-center pointer-events-none">
                        <div className="w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
                    </div>

                    <div className="container mx-auto max-w-5xl relative z-10">
                        {/* Section Title */}
                        <div className="text-center mb-10">
                            <h2 className="font-chrome text-3xl md:text-4xl text-white uppercase tracking-normal">
                                They're Talking About Us
                            </h2>
                        </div>

                        {/* Logo Grid */}
                        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
                            {[
                                { src: "/press-logo-gohtech.png", alt: "Gohtech" },
                                { src: "/press-logo-ap.png", alt: "Associated Press" },
                                { src: "/press-logo-forbes.png", alt: "Forbes" },
                                { src: "/press-logo-techcrunch.png", alt: "TechCrunch" }
                            ].map((logo, idx) => (
                                <div
                                    key={idx}
                                    className="w-24 h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" />
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
                                            q: "How does the tracker work?",
                                            a: "Bedtime updates unlock as soon as you sign up. Morning updates unlock later to feel like a real overnight journey—but parents can unlock them anytime."
                                        },
                                        {
                                            q: "How will I know when Morning Updates are ready?",
                                            a: "We'll send you an email when they're available. You can also unlock morning updates anytime directly on the tracker page."
                                        },
                                        {
                                            q: "Does my child need a phone or tablet?",
                                            a: "No. Parents control everything. Kids simply watch the videos with you."
                                        },
                                        {
                                            q: "Do you need my address or payment details?",
                                            a: "No. The tracker is completely free, and we don't collect your address or payment information."
                                        },
                                        {
                                            q: "What if my child loses a tooth at an inconvenient time?",
                                            a: "No problem. The tracker stays active, and you can start the experience whenever it works for your family."
                                        },
                                        {
                                            q: "Does this replace the coin under the pillow?",
                                            a: "No. The tracker adds to the magic—the classic reward stays the same. Kiki never mentions what gift she left, so parents keep full control."
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

                {/* ========== FOOTER ========== */}
                <footer className="relative py-16 px-4 border-t border-white/10">
                    {/* Background Glow - hidden on mobile */}
                    <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 md:gap-8">

                            {/* Logo & About Column */}
                            <div className="space-y-5">
                                {/* Logo */}
                                <div className="flex items-center">
                                    <img src="/kiki-logo.png" alt="Kiki" className="w-14 h-14 rounded-xl shadow-lg" />
                                </div>

                                {/* Tagline */}
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                    Making childhood magic real, one tooth at a time. The world's most magical Tooth Fairy experience.
                                </p>

                                {/* Social Links */}
                                <div className="flex gap-3 pt-2">
                                    <a
                                        href="https://www.instagram.com/kikithetoothfairy/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Navigation Column */}
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Explore</h4>
                                <ul className="space-y-3">
                                    <li><a href="#meet-kiki" className="text-slate-400 hover:text-white transition-colors text-sm">Meet Kiki</a></li>
                                    <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm">How It Works</a></li>
                                    <li><a href="#reviews" className="text-slate-400 hover:text-white transition-colors text-sm">Reviews</a></li>
                                    <li><a href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">Blog</a></li>
                                    <li><a href="/media-kit" className="text-slate-400 hover:text-white transition-colors text-sm">Media Kit</a></li>
                                </ul>
                            </div>

                            {/* Support Column */}
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Support</h4>
                                <ul className="space-y-3">
                                    <li><a href="/#faq" className="text-slate-400 hover:text-white transition-colors text-sm">FAQ</a></li>
                                    <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
                                </ul>
                            </div>

                            {/* Legal Column */}
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Legal</h4>
                                <ul className="space-y-3">
                                    <li><a href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                                    <li><a href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                                    <li><a href="/shipping" className="text-slate-400 hover:text-white transition-colors text-sm">Shipping Policy</a></li>
                                    <li><a href="/refund" className="text-slate-400 hover:text-white transition-colors text-sm">Refund Policy</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-slate-500 text-sm">
                                © {new Date().getFullYear()} Tooth Fairy Tracker. All rights reserved.
                            </p>
                            <p className="text-slate-500 text-xs flex items-center gap-2">
                                Made with <span className="text-pink-500">♥</span> for magical families everywhere
                            </p>
                        </div>
                    </div>
                </footer>

            </div >
        </div >
    );
};

export default NewLandingPage;
