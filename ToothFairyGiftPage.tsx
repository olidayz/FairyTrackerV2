import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp, ArrowRight, Sparkles, Gift, Video, Map, Smartphone, Clock } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import { getAttributionForSignup } from './lib/attribution';
import { trackCtaClick, getJourneyForSignup } from './lib/journeyTracking';
import { getOrCreateVisitorId } from './lib/visitor';

const ToothFairyGiftPage = () => {
    const navigate = useNavigate();
    const [childName, setChildName] = useState('');
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [landingContent, setLandingContent] = useState<{
        hero: { headline: string; subheadline: string; badgeText: string; ctaText: string } | null;
        reviews: Array<{ id: number; reviewerName: string; reviewerLocation: string; reviewText: string; rating: number; photoUrl?: string | null }>;
        kikiProfile: { name: string; title: string; bio: string; photoUrl: string } | null;
        faqs: Array<{ id: number; question: string; answer: string }>;
        pressLogos: Array<{ id: number; name: string; imageUrl: string; linkUrl?: string | null }>;
        images: Record<string, string | null>;
        stageTitles: Record<string, string>;
        mediaTypes: Record<string, string>;
    }>({ hero: null, reviews: [], kikiProfile: null, faqs: [], pressLogos: [], images: {}, stageTitles: {}, mediaTypes: {} });


    // Dynamic live counter for social proof
    const [liveCount, setLiveCount] = useState(() => Math.floor(Math.random() * 30) + 35);

    // SEO meta tags
    useEffect(() => {
        document.title = 'Tooth Fairy Gift | Personalized Tracker & Videos | Kiki';

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'Looking for the perfect tooth fairy gift? Give your child a magical experience with Kiki\'s personalized tracker, videos, and real-time updates as she flies to collect their tooth!');
        }

        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', 'https://kikithetoothfairy.co/tooth-fairy-gift');
        }
    }, []);

    // Live counter animation
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCount(prev => {
                const change = Math.floor(Math.random() * 5) - 2;
                const newCount = prev + change;
                return Math.max(25, Math.min(85, newCount));
            });
        }, 4000 + Math.random() * 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetch('/api/landing-content')
            .then(res => res.json())
            .then(data => setLandingContent(data))
            .catch(err => console.error('Failed to load landing content:', err));
    }, []);

    const defaultFairyPhoto = "/Fairy photo booth pic.webp";


    const handleSignup = async () => {
        setFormError('');

        if (!childName.trim()) {
            setFormError('Please enter your child\'s name');
            return;
        }

        if (!email.trim()) {
            setFormError('Please enter your email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFormError('Please enter a valid email');
            return;
        }

        setIsSubmitting(true);

        trackCtaClick('signup_submit', 'tooth_fairy_gift_page');

        const attribution = getAttributionForSignup();
        const journey = getJourneyForSignup();
        const visitorId = getOrCreateVisitorId();

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: childName.trim(),
                    email: email.trim(),
                    visitorId,
                    utmSource: attribution.utmSource,
                    utmMedium: attribution.utmMedium,
                    utmCampaign: attribution.utmCampaign,
                    referrer: attribution.referrer,
                    derivedSource: attribution.derivedSource,
                    landingPage: '/tooth-fairy-gift',
                    journey: journey,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            navigate(data.trackerUrl);
        } catch (error: any) {
            setFormError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // What's Included items
    const includedItems = [
        { icon: Sparkles, title: "Live Tooth Fairy Tracker", desc: "Watch Kiki fly in real-time", color: "from-cyan-400 to-blue-500" },
        { icon: Video, title: "6 Personalized Videos", desc: "Your child's name in every one", color: "from-fuchsia-400 to-purple-500" },
        { icon: Gift, title: "Magic Updates", desc: "Real-time messages from Kiki", color: "from-amber-400 to-orange-500" },
        { icon: Map, title: "Interactive Flight Map", desc: "Follow her journey to your home", color: "from-lime-400 to-green-500" },
        { icon: Smartphone, title: "Works on Any Device", desc: "No app download needed", color: "from-rose-400 to-pink-500" },
        { icon: Clock, title: "Available 24/7", desc: "Use it any night they lose a tooth", color: "from-indigo-400 to-blue-600" },
    ];

    // Benefits
    const benefits = [
        { icon: "🎁", title: "The Gift That Creates Memories", desc: "Your child will remember this magical night forever—not the $5 bill under the pillow.", color: "from-fuchsia-400 to-purple-500" },
        { icon: "✨", title: "Completely Personalized", desc: "Kiki says your child's name in every video update, making the magic feel incredibly real.", color: "from-cyan-400 to-blue-500" },
        { icon: "🌟", title: "Zero Stress for Parents", desc: "No last-minute store runs or forgotten fairy duties. Ready in just 10 seconds.", color: "from-amber-400 to-orange-500" },
        { icon: "📱", title: "Works on Any Device", desc: "Just open the link—no app download needed. Works on phones, tablets, and computers.", color: "from-lime-400 to-green-500" },
    ];

    // FAQs - SEO optimized
    const faqs = [
        {
            question: "How does this tooth fairy gift work?",
            answer: "It's simple! Enter your child's name, and we create a personalized Tooth Fairy tracker instantly. Your child can watch Kiki fly across the map with 6 video updates—each one mentioning their name. It feels like real magic!"
        },
        {
            question: "How is this different from a tooth fairy letter?",
            answer: "While letters are wonderful, this is a full interactive experience. Your child watches the Tooth Fairy's journey in real-time with personalized videos, a live flight map, and updates as she gets closer. It's the 2024 upgrade to the classic tooth fairy tradition!"
        },
        {
            question: "What age is this tooth fairy gift best for?",
            answer: "This works wonderfully for kids aged 4-10 who are excited about the Tooth Fairy. The personalized videos and tracker are especially magical for first-time tooth losers!"
        },
        {
            question: "Do I need to download an app?",
            answer: "Nope! Everything works right in your browser. Just open the link we send you—that's it. Works perfectly on phones, tablets, and computers."
        },
    ];

    // Testimonials (from NewLandingPage)
    const testimonials = [
        { name: "Sarah M.", location: "Austin, TX", text: "My daughter ABSOLUTELY LOVED watching the little videos at every step! It made the Tooth Fairy feel so real.", rating: 5 },
        { name: "James P.", location: "Chicago, IL", text: "Finally a stress-free way to handle the Tooth Fairy. The tracker bought us so much time!", rating: 5 },
        { name: "Emily R.", location: "Seattle, WA", text: "The custom selfie from Kiki blew their minds. Best tooth fairy gift ever.", rating: 5 },
    ];

    return (
        <div className="min-h-screen bg-[#0a1020] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* === FIXED BACKGROUND === Safari-safe: using radial gradients instead of blur filters */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Base Night - Lighter */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />

                {/* Ambient glows - Safari-safe radial gradients (no blur filter) */}
                <div className="hidden lg:block absolute top-0 left-1/4 w-[1000px] h-[1000px]" style={{ background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)' }} />
                <div className="hidden lg:block absolute bottom-0 right-0 w-[800px] h-[800px]" style={{ background: 'radial-gradient(circle, rgba(45, 212, 191, 0.06) 0%, transparent 70%)' }} />
                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px]" style={{ background: 'radial-gradient(ellipse, rgba(217, 70, 239, 0.04) 0%, transparent 70%)' }} />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                {/* Subtle noise texture */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }} />
            </div>

            <Header />

            <div className="relative z-10 pt-24">

                {/* ========== HERO SECTION ========== */}
                <section className="relative py-12 md:py-16 px-4 overflow-hidden">

                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            {/* Left: Hero Content */}
                            <div className="relative z-10 text-center lg:text-left">
                                <div className="space-y-6">
                                    {/* Status Badge - matching NewLandingPage */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-xl transform -rotate-1 shadow-xl border-2 border-white/50">
                                        <span className="text-[11px] font-sans font-bold text-white tracking-wide">✨ The Most Magical Tooth Fairy Gift</span>
                                    </div>

                                    {/* Main Headline */}
                                    <div className="space-y-3">
                                        <h1 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95] tracking-normal">
                                            A Tooth Fairy Gift They'll&nbsp;Never&nbsp;Forget
                                        </h1>
                                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-sans">
                                            Make the magic feel real. Magical video messages from the Tooth Fairy and a real-time flight tracker as she travels to pick&nbsp;up&nbsp;the&nbsp;tooth.
                                        </p>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start pt-2">
                                        <button
                                            onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="relative group/btn overflow-hidden bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white px-7 py-4 md:px-8 md:py-5 rounded-xl font-sans font-extrabold text-sm md:text-base uppercase tracking-tight shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-cyan-800 active:border-b-0 flex items-center justify-center gap-2 w-full sm:w-auto"
                                        >
                                            <span className="relative z-10">Start the Magic</span>
                                            <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="px-7 py-4 md:px-8 md:py-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all font-sans font-bold text-sm md:text-base uppercase tracking-tight flex items-center justify-center gap-2 w-full sm:w-auto"
                                        >
                                            <span>How It Works</span>
                                            <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                                        </button>
                                    </div>

                                    {/* Trust signals */}
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

                            {/* Right: Static Hero Image */}
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-amber-500/20 rounded-[2rem] blur-2xl" />
                                <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                    <img
                                        src="/tracker-preview.png"
                                        alt="Tooth Fairy Tracker Preview - Watch Kiki fly to your child"
                                        className="w-full h-auto"
                                        loading="eager"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* ========== TURN LOST TOOTH INTO EXPERIENCE SECTION ========== */}
                <section className="relative py-24 px-4 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    </div>

                    <div className="container mx-auto max-w-5xl">
                        {/* Section Header */}
                        <div className="text-center mb-20">
                            <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal mb-6">
                                Turn a Lost Tooth Into an<br className="hidden md:block" /> Unforgettable Adventure
                            </h2>
                            <p className="text-slate-400 text-xl md:text-2xl font-medium">
                                Gift your child a magical experience.
                            </p>
                        </div>

                        {/* Stacked Hero Cards */}
                        <div className="space-y-16">

                            {/* Card 1: Track the Tooth Fairy */}
                            <div className="group relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                                <div className="w-full md:w-1/2 relative">
                                    <div className="absolute -inset-2 bg-cyan-500/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative rounded-[2rem] overflow-hidden ring-4 ring-cyan-500/30 shadow-2xl aspect-video">
                                        <img src="/tracker-preview.png" alt="Track the Tooth Fairy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full mb-4">
                                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">Real-time Data</span>
                                    </div>
                                    <h3 className="font-chrome text-2xl md:text-3xl text-white mb-4">Track the Tooth Fairy</h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        See where she is in the world, how fast she's flying, and how many teeth she's collected tonight.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: A Magical Journey (Flipped Layout) */}
                            <div className="group relative flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
                                <div className="w-full md:w-1/2 relative">
                                    <div className="absolute -inset-2 bg-fuchsia-500/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative rounded-[2rem] overflow-hidden ring-4 ring-fuchsia-500/30 shadow-2xl aspect-video">
                                        <img src="/card-overnight-magic.png" alt="A Magical Journey" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 text-left md:text-right">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-950/50 border border-fuchsia-500/30 rounded-full mb-4 md:flex-row-reverse">
                                        <span className="text-[10px] font-bold text-fuchsia-300 uppercase tracking-widest">Personal Updates</span>
                                    </div>
                                    <h3 className="font-chrome text-2xl md:text-3xl text-white mb-4">A Magical Journey</h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        She sends video updates as she travels to your home to pick up the tooth.
                                    </p>
                                </div>
                            </div>

                            {/* Card 3: One-Click Setup */}
                            <div className="group relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                                <div className="w-full md:w-1/2 relative">
                                    <div className="absolute -inset-2 bg-lime-500/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative rounded-[2rem] overflow-hidden ring-4 ring-lime-500/30 shadow-2xl aspect-video">
                                        <img src="/card-zero-stress.png" alt="One-Click Setup" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-950/50 border border-lime-500/30 rounded-full mb-4">
                                        <span className="text-[10px] font-bold text-lime-300 uppercase tracking-widest">Instant Activation</span>
                                    </div>
                                    <h3 className="font-chrome text-2xl md:text-3xl text-white mb-4">One-Click Setup</h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        Enter your child's name. Start the tracker. You're done.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>


                {/* ========== HOW IT WORKS SECTION ========== */}
                <section id="how-it-works" className="relative py-16 px-4">
                    {/* Thin glowing line divider */}
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    </div>
                    <div className="container mx-auto max-w-5xl">

                        {/* Section Header with Badge */}
                        <div className="text-center mb-8">
                            <div className="relative inline-block mb-4">
                                <h2 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal">
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

                            {/* Description Text */}
                            <p className="text-slate-300 text-lg mt-6">
                                Tell us your child's name and email, and we'll create their personalized tracker right away.
                            </p>
                        </div>

                        {/* STEP SEQUENCE */}
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

                            {/* Mobile: 2x2 Grid */}
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
                                <div className="absolute -top-4 left-6 z-20">
                                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 rounded-xl transform -rotate-1 shadow-xl border-2 border-white/50">
                                        <h4 className="font-chrome text-lg text-white uppercase tracking-wide">Live Tracking</h4>
                                    </div>
                                </div>
                                {/* Card Body with Ring Accent */}
                                <div className="rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/90 ring-4 ring-cyan-500/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                                    {/* Image with overlay */}
                                    <div className="relative" style={{ height: '320px' }}>
                                        <img
                                            src="/tracker-preview.png"
                                            alt="Live Tracker Preview"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Gradient overlay + Text content */}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pt-20 pb-6 px-6">
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
                                    {/* Image with overlay */}
                                    <div className="relative" style={{ height: '320px' }}>
                                        <img
                                            src="/PFP FULL SIZE KIKI 1.png"
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
                                onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white px-10 py-5 rounded-xl font-sans font-extrabold text-lg uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-[#1e40af] active:border-b-0 flex items-center justify-center gap-3 mx-auto"
                            >
                                <span>Start the Journey</span>
                                <ArrowRight size={24} />
                            </button>
                        </div>

                    </div>
                </section>

                {/* ========== BENEFITS SECTION ========== */}
                <section className="relative py-20 px-4 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    </div>

                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-950/50 border border-amber-500/30 rounded-full mb-4">
                                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Why Parents Love It</span>
                            </div>
                            <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                                More Than Just a Tooth Fairy Gift
                            </h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                An experience that delights kids and makes parenting easier
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {benefits.map((benefit, idx) => (
                                <div
                                    key={idx}
                                    className="group relative flex items-start gap-4 p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-xl"
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg shrink-0 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                                        <span className="text-2xl">{benefit.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-2">{benefit.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== SNEAK PEEK BENTO GRID SECTION ========== */}
                <section className="relative py-20 px-4 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    </div>

                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-fuchsia-950/50 border border-fuchsia-500/30 rounded-full mb-4">
                                <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest">✨ Sneak Peek</span>
                            </div>
                            <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                                Inside the Tracker
                            </h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                A preview of the magical experience
                            </p>
                        </div>

                        {/* Browser Mockup with Iframe */}
                        <div className="mb-12">
                            <div className="relative mx-auto max-w-5xl">
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-amber-500/20 rounded-[2rem] blur-2xl" />
                                <div className="relative bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/80 border-b border-white/10">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-700/50 rounded-lg border border-white/5">
                                                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs text-slate-400 font-mono">tracker.kikithetoothfairy.co/emma</span>
                                            </div>
                                        </div>
                                        <div className="w-14" />
                                    </div>
                                    <div className="relative aspect-[16/10] bg-[#02040a] overflow-hidden">
                                        <iframe
                                            src="/tracker"
                                            className="absolute inset-0 w-full h-full border-0"
                                            title="Tooth Fairy Tracker Preview"
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

                        {/* Bento Grid Feature Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                            {/* Large Featured Card - Live Tracking Map */}
                            <div className="col-span-2 row-span-2 group cursor-pointer">
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
                            <div className="group cursor-pointer">
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
                            <div className="group cursor-pointer">
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
                            <div className="group cursor-pointer">
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
                            <div className="group cursor-pointer">
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

                {/* ========== TESTIMONIALS SECTION ========== */}
                <section className="relative py-20 px-4 overflow-hidden">
                    {/* Thin glowing line divider */}
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    </div>

                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-950/50 border border-amber-500/30 rounded-full mb-4">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">5-Star Reviews</span>
                            </div>
                            <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-0">
                                What Parents Are Saying
                            </h2>
                            {/* Overlapping Badge */}
                            <div className="relative -mt-2 mb-6 inline-block">
                                <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-1.5 rounded-lg transform -rotate-2 border-2 border-white/30 shadow-lg">
                                    <p className="font-sans font-bold text-xs text-white uppercase tracking-wide">
                                        Trusted by hundreds of families
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Review Cards Grid - Colorful Gradient Style */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Sarah M.",
                                    role: "Mother of two",
                                    text: "My daughter ABSOLUTELY LOVED watching the little videos at every step! It made the Tooth Fairy feel so real.",
                                    bg: "bg-gradient-to-br from-fuchsia-500 to-purple-600",
                                    glow: "shadow-[0_0_40px_rgba(232,121,249,0.3)]"
                                },
                                {
                                    name: "James P.",
                                    role: "Dad",
                                    text: "Finally a stress-free way to handle the Tooth Fairy. The tracker bought us so much time!",
                                    bg: "bg-gradient-to-br from-cyan-500 to-blue-600",
                                    glow: "shadow-[0_0_40px_rgba(34,211,238,0.3)]"
                                },
                                {
                                    name: "Emily R.",
                                    role: "Parent",
                                    text: "The custom selfie from Kiki blew their minds. Best tooth fairy gift ever.",
                                    bg: "bg-gradient-to-br from-amber-500 to-orange-600",
                                    glow: "shadow-[0_0_40px_rgba(251,191,36,0.3)]"
                                }
                            ].map((review, idx) => (
                                <div key={idx} className={`${review.bg} ${review.glow} rounded-[2rem] ring-4 ring-white/50 overflow-hidden transition-all duration-300 hover:scale-[1.02]`}>
                                    <div className="relative p-6 md:p-8 h-full flex flex-col min-h-[320px]">
                                        {/* Shine overlay */}
                                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-[2rem]" />

                                        {/* Quote icon */}
                                        <div className="absolute top-4 right-4 text-white/20">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M14.017 21L14.017 18C14.017 16.0548 15.0065 14.5492 16.9856 13.4939C17.9751 12.9663 19.0177 12.6465 20.1139 12.5342L19.9998 12.0152C19.9998 9.38871 18.0069 7.39589 15.3804 7.39589L14.017 7.39589L14.017 3L15.3804 3C20.4072 3 24 7.19958 24 12.0152L24 21L14.017 21ZM5.01695 21L5.01695 18C5.01695 16.0548 6.00647 14.5492 7.98556 13.4939C8.97508 12.9663 10.0177 12.6465 11.1139 12.5342L10.9998 12.0152C10.9998 9.38871 9.00695 7.39589 6.38043 7.39589L5.01695 7.39589L5.01695 3L6.38043 3C11.4072 3 15 7.19958 15 12.0152L15 21L5.01695 21Z" />
                                            </svg>
                                        </div>

                                        <div className="relative z-10 flex flex-col items-center gap-4 flex-1 justify-between text-center">
                                            {/* Avatar */}
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center shadow-lg">
                                                <span className="font-chrome text-xl md:text-2xl text-white">{review.name.charAt(0)}</span>
                                            </div>

                                            {/* Name & Role */}
                                            <div>
                                                <h4 className="font-bold text-white text-base md:text-lg">{review.name}</h4>
                                                <p className="text-white/70 text-sm">{review.role}</p>
                                            </div>

                                            {/* Review Text */}
                                            <p className="text-white text-base md:text-lg font-medium italic leading-relaxed">
                                                "{review.text}"
                                            </p>

                                            {/* Stars */}
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} size={18} className="fill-white text-white drop-shadow-lg" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== SECTION: MEET KIKI ========== */}
                <section id="meet-kiki" className="relative py-24 px-4 overflow-hidden">
                    {/* Background glow - Safari-safe radial gradient */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none">
                        <div className="w-full h-full" style={{ background: 'radial-gradient(circle, rgba(232, 121, 249, 0.05) 0%, transparent 70%)' }} />
                    </div>

                    <div className="container mx-auto max-w-6xl relative z-10">
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
                                        Meet Kiki the Tooth&nbsp;Fairy
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

                {/* ========== FAQ SECTION ========== */}
                <section className="relative py-20 px-4 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    </div>

                    <div className="container mx-auto max-w-3xl">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/50 border border-cyan-500/30 rounded-full mb-4">
                                <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Questions?</span>
                            </div>
                            <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-white font-medium">{faq.question}</span>
                                        {expandedFaq === idx ? (
                                            <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                                        )}
                                    </button>
                                    {expandedFaq === idx && (
                                        <div className="px-5 pb-5 text-slate-400">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== SECTION: PRESS LOGOS ========== */}
                <section className="relative py-20 px-4">
                    {/* Background glow - Safari-safe radial gradient */}
                    <div className="hidden lg:flex absolute inset-0 justify-center pointer-events-none">
                        <div className="w-[600px] h-[300px]" style={{ background: 'radial-gradient(ellipse, rgba(34, 211, 238, 0.04) 0%, transparent 70%)' }} />
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
                            {(landingContent.pressLogos.length > 0 ? landingContent.pressLogos : [
                                { id: 1, name: "Gohtech", imageUrl: "/press-logo-gohtech.png" },
                                { id: 2, name: "Associated Press", imageUrl: "/press-logo-ap.png" },
                                { id: 3, name: "Forbes", imageUrl: "/press-logo-forbes.png" },
                                { id: 4, name: "TechCrunch", imageUrl: "/press-logo-techcrunch.png" }
                            ]).map((logo) => (
                                <div
                                    key={logo.id}
                                    className="w-40 h-20 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    {logo.linkUrl ? (
                                        <a href={logo.linkUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={logo.imageUrl} alt={logo.name} className="max-h-full max-w-full object-contain" />
                                        </a>
                                    ) : (
                                        <img src={logo.imageUrl} alt={logo.name} className="max-h-full max-w-full object-contain" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== SIGNUP FORM SECTION ========== */}
                <section id="signup-form" className="relative py-24 px-4 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-lime-500/50 to-transparent" />
                    </div>

                    {/* Background Accents */}
                    <div className="hidden lg:block absolute top-1/4 left-1/4 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217, 70, 239, 0.08) 0%, transparent 70%)' }} />
                    <div className="hidden lg:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)' }} />

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
                                Enter your child's name below and we'll create their personalized tracker right away.
                            </p>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-center">

                            {/* LEFT: The Card Stack with Form */}
                            <div className="relative flex justify-center items-center min-h-[580px]">
                                {/* Background Card 3 (Deepest - Amber) */}
                                <div className="absolute w-full max-w-lg h-[520px] bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] transform rotate-6 translate-x-4 translate-y-4 shadow-2xl opacity-80" />

                                {/* Background Card 2 (Middle - Fuchsia) */}
                                <div className="absolute w-full max-w-lg h-[520px] bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-[2rem] transform -rotate-3 -translate-x-3 translate-y-2 shadow-2xl opacity-90" />

                                {/* Background Card 1 (Cyan) */}
                                <div className="absolute w-full max-w-lg h-[520px] bg-gradient-to-br from-cyan-400 to-blue-500 rounded-[2rem] transform rotate-2 -translate-y-1 shadow-2xl opacity-95" />

                                {/* Main Form Card */}
                                <div className="relative w-full max-w-lg bg-slate-950 rounded-[2rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border-2 border-white/10 z-10">
                                    {/* Glow Ring */}
                                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 via-transparent to-fuchsia-500/20 blur-sm pointer-events-none" />
                                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 pointer-events-none" />

                                    <div className="relative z-10 space-y-8">
                                        {/* Live Counter Badge */}
                                        <div className="flex justify-center">
                                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                                                <span className="text-sm font-bold text-cyan-300">{liveCount} families tracking tonight ✨</span>
                                            </div>
                                        </div>

                                        {/* Child's First Name Input */}
                                        <div>
                                            <label className="block text-white font-bold text-lg mb-2">Your Child's First Name</label>
                                            <p className="text-slate-400 text-sm mb-3">This is how Kiki will address them in videos!</p>
                                            <input
                                                type="text"
                                                placeholder="Enter name..."
                                                value={childName}
                                                onChange={(e) => setChildName(e.target.value)}
                                                className="w-full px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner"
                                            />
                                        </div>

                                        {/* Email Input */}
                                        <div>
                                            <label className="block text-white font-bold text-lg mb-2">Your Email</label>
                                            <p className="text-slate-400 text-sm mb-3">We'll send the tracker link here instantly.</p>
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

                                        {/* CTA Button */}
                                        <button
                                            onClick={handleSignup}
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white px-8 py-6 rounded-xl font-sans font-extrabold text-xl uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-[#1e40af] active:border-b-0 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            <span>{isSubmitting ? 'Creating Magic...' : 'Start the Magic'}</span>
                                            {!isSubmitting && <span className="text-2xl">✨</span>}
                                        </button>

                                        {/* Trust Signals */}
                                        <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
                                            <span className="flex items-center gap-2">
                                                <span className="text-green-400 text-lg">✓</span> No credit card
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

            </div>

            <Footer />
        </div>
    );
};

export default ToothFairyGiftPage;
