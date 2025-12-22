import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Download,
    Mail,
    Shield,
    Zap,
    Star,
    Heart,
    Clock,
    ArrowRight,
    Sparkles,
    Video,
    Activity,
    Users
} from 'lucide-react';
import Footer from './components/Footer';

// === HELPER COMPONENTS ===

const NeonPanel = ({
    label,
    children,
    className = "",
    borderColor = "border-cyan-500",
    bgColor = "bg-slate-900/80",
    height = "min-h-32",
}: {
    label: string,
    children?: React.ReactNode,
    className?: string,
    borderColor?: string,
    bgColor?: string,
    height?: string,
    key?: any,
}) => {
    const getGradient = () => {
        if (borderColor.includes('cyan')) return 'from-cyan-400 to-blue-500';
        if (borderColor.includes('amber')) return 'from-amber-400 to-orange-500';
        if (borderColor.includes('fuchsia')) return 'from-fuchsia-400 to-pink-500';
        if (borderColor.includes('lime')) return 'from-lime-400 to-green-500';
        return 'from-cyan-400 to-blue-500';
    };

    const getRingColor = () => {
        if (borderColor.includes('cyan')) return 'ring-cyan-400/60';
        if (borderColor.includes('amber')) return 'ring-amber-400/60';
        if (borderColor.includes('fuchsia')) return 'ring-fuchsia-400/60';
        if (borderColor.includes('lime')) return 'ring-lime-400/60';
        return 'ring-cyan-400/60';
    };

    const getGlowShadow = () => {
        if (borderColor.includes('cyan')) return 'shadow-[0_0_40px_rgba(34,211,238,0.2)]';
        if (borderColor.includes('amber')) return 'shadow-[0_0_40px_rgba(251,191,36,0.2)]';
        if (borderColor.includes('fuchsia')) return 'shadow-[0_0_40px_rgba(232,121,249,0.2)]';
        if (borderColor.includes('lime')) return 'shadow-[0_0_40px_rgba(163,230,53,0.2)]';
        return 'shadow-[0_0_40px_rgba(34,211,238,0.2)]';
    };

    return (
        <div className={`relative group ${className} ${height} mt-8`}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
                <div className={`bg-gradient-to-r ${getGradient()} px-4 py-1.5 rounded-xl shadow-lg border border-white/50 group-hover:scale-105 transition-transform`}>
                    <h4 className="font-chrome text-xs md:text-sm text-white uppercase tracking-wide whitespace-nowrap">
                        {label}
                    </h4>
                </div>
            </div>
            <div className={`relative h-full rounded-[2rem] ${bgColor} backdrop-blur-xl ring-4 ${getRingColor()} overflow-hidden ${getGlowShadow()} transition-all duration-300`}>
                <div className="relative z-10 p-8 h-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

const MediaKitPage = () => {
    const navigate = useNavigate();
    const [headerVisible, setHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const trackerIframeRef = useRef<HTMLIFrameElement>(null);

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

    const assets = [
        { title: "Kiki Official Logo", type: "Logo Pack", icon: "💎", color: "cyan" },
        { title: "Character Renders", type: "3D Assets", icon: "🧚‍♀️", color: "fuchsia" },
        { title: "Brand Badges", type: "SVG Icons", icon: "✨", color: "amber" },
        { title: "Press Photos", type: "High Res", icon: "📸", color: "lime" }
    ];

    const keyFeatures = [
        {
            icon: Sparkles,
            title: "Six-stage mission",
            desc: "The Tooth Fairy's journey unlocks in sequence, with stages designed for nighttime and others for the morning."
        },
        {
            icon: Video,
            title: "Vlog-style video scenes",
            desc: "Each step comes with a video message from the Tooth Fairy that feel like they were recorded especially for the child."
        },
        {
            icon: Activity,
            title: "Travel stats",
            desc: "Speed, altitude, signal strength, and other playful details that make the journey feel real."
        },
        {
            icon: Clock,
            title: "Entirely parent-driven",
            desc: "Revealed from the parent's phone at their pace — no apps, no accounts, and no messages sent while children sleep."
        }
    ];

    const howItWorksSteps = [
        { num: 1, title: "Parents Register", desc: "Enter child's name and their email" },
        { num: 2, title: "Personalized Tracker Starts", desc: "A custom tracker link is sent to the parent's email." },
        { num: 3, title: "Evening Stages", desc: "Parents reveal the first stages before bedtime." },
        { num: 4, title: "Morning Stages", desc: "Parents reveal the rest of the adventure in the morning." }
    ];

    return (
        <div className="min-h-screen bg-[#0a1020] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* === FIXED BACKGROUND === */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-teal-500/8 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            </div>

            {/* ========== FLOATING HEADER ========== */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="mx-4 mt-4">
                    <div className="max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <Link to="/" className="flex items-center">
                                <div className="w-14 h-14 rounded-xl overflow-hidden">
                                    <img src="/kiki-logo.png" alt="Kiki" className="w-full h-full object-cover" />
                                </div>
                            </Link>
                            <nav className="flex items-center gap-6">
                                <Link to="/" className="text-sm text-slate-300 hover:text-white transition-colors">Home</Link>
                                <Link to="/blog" className="text-sm text-slate-300 hover:text-white transition-colors">Blog</Link>
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 text-white px-5 py-2.5 rounded-xl font-sans font-extrabold text-sm uppercase tracking-tight shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 border-b-[3px] border-indigo-900 active:border-b-0"
                                >
                                    Start Tracking
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            <div className="relative z-10 pt-32 pb-24">

                {/* ========== 1. HERO SECTION ========== */}
                <section className="container mx-auto max-w-5xl px-4 text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-xl shadow-xl border-2 border-white/50 mb-8">
                        <span className="text-[11px] font-sans font-bold text-white tracking-wide uppercase">Official Press Resources</span>
                    </div>
                    <h1 className="font-chrome text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-normal mb-6">
                        The World's First<br />
                        Tooth Fairy Tracker
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        We created an interactive tracker that lets children follow the Tooth Fairy as she travels to collect their tooth. The journey unfolds across six stages, revealed from the parent's phone.
                    </p>
                </section>



                {/* ========== 2. PEEK INSIDE THE TRACKER ========== */}

                <section className="relative py-12 px-4 overflow-hidden mb-24">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <span className="text-2xl">👁️</span>
                            </div>
                            <h2 className="font-chrome text-4xl md:text-5xl text-white uppercase tracking-normal mb-4">Peek Inside the Tracker</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A cinematic adventure your child follows in two parts: bedtime and morning.</p>
                        </div>

                        <div className="relative mx-auto max-w-5xl">
                            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-amber-500/10 rounded-[2rem] blur-2xl" />
                            <div className="relative bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/80 border-b border-white/10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-700/50 rounded-lg border border-white/5">
                                            <span className="text-xs text-slate-400 font-mono">tracker.kikithetoothfairy.co/demo</span>
                                        </div>
                                    </div>
                                    <div className="w-14" />
                                </div>
                                <div className="relative aspect-[16/9] bg-[#02040a] overflow-hidden">
                                    <iframe
                                        ref={trackerIframeRef}
                                        src="/tracker"
                                        className="absolute inset-0 w-full h-full border-0"
                                        title="Tracker Preview"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Callout Cards with Badges */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
                        {[
                            { label: "Mission Journey", title: "7-Stage Mission", desc: "A structured digital journey from departure to collection.", icon: Sparkles, color: "cyan" },
                            { label: "Content", title: "Vlog-Style Videos", desc: "Modern, relatable updates directly from Kiki.", icon: Video, color: "fuchsia" },
                            { label: "Realism", title: "Flight Telemetry", desc: "Real-time speed, altitude, and map tracking.", icon: Activity, color: "amber" },
                            { label: "Privacy", title: "Parent-Driven", desc: "No app downloads. Secure, private, and simple.", icon: Users, color: "lime" }
                        ].map((feat, i) => (
                            <NeonPanel key={i} label={feat.label} borderColor={`border-${feat.color}-500`} height="min-h-[200px]">
                                <div className="text-center">
                                    <div className={`w-12 h-12 rounded-xl bg-${feat.color}-500/20 flex items-center justify-center mx-auto mb-4 border border-${feat.color}-500/30`}>
                                        <feat.icon className={`text-${feat.color}-400`} size={24} />
                                    </div>
                                    <h3 className="font-bold text-white mb-2">{feat.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                                </div>
                            </NeonPanel>
                        ))}
                    </div>
                </section>

                {/* ========== 3. A SHARED TOOTH FAIRY EXPERIENCE ========== */}

                <section className="container mx-auto max-w-5xl px-4 mb-32">
                    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-16">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                        <div className="relative z-10 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <span className="text-2xl">✨</span>
                            </div>

                            <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-6">
                                A Shared Tooth Fairy Experience
                            </h2>

                            <p className="text-slate-300 text-lg max-w-3xl mx-auto mb-4">
                                The Tooth Fairy visit is a beloved and magical ritual. The tracker adds an extra layer of wonder, bringing the whole family along to watch it happen.
                            </p>
                            <p className="text-slate-400 text-base max-w-2xl mx-auto mb-12">
                                Parents share the early stages before bedtime and complete the adventure in the morning.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                {[
                                    "Six cinematic stages revealed from the parent's phone",
                                    "Short videos, Tooth Fairy selfies, and travel stats like flight speed and altitude",
                                    "Real-world locations and playful detours that build excitement and belief",
                                    "Designed to amplify a beloved childhood ritual, not replace it"
                                ].map((text, i) => (
                                    <div key={i} className="bg-slate-800/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 text-left flex items-start gap-4">
                                        <div className="w-3 h-3 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                        <p className="text-white font-medium leading-relaxed">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== 4. MEET KIKI (Copied from Landing Page) ========== */}
                <section id="meet-kiki" className="relative py-24 px-4 overflow-hidden mb-32">
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

                    <div className="container mx-auto max-w-6xl">
                        <div className="relative">
                            <div className="relative lg:ml-[280px] bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 lg:p-12 lg:pl-[320px]">
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                                <div className="relative z-10 space-y-6 max-w-xl">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/50 border border-cyan-500/30 rounded-full">
                                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">🧚‍♀️ Your Child's Fairy</span>
                                    </div>

                                    <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal">
                                        Meet Kiki the Tooth Fairy
                                    </h2>

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

                            <div className="lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[550px] -mt-8 lg:mt-0 mx-auto max-w-[350px] lg:max-w-none transform lg:-rotate-3">
                                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-400/40 via-teal-400/30 to-cyan-400/40 rounded-[2rem] blur-2xl" />
                                <div className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl">
                                    <img
                                        src="/Fairy photo booth pic.webp"
                                        alt="Kiki the Tooth Fairy"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== 5. KEY FEATURES ========== */}
                <section className="container mx-auto max-w-5xl px-4 mb-32">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-6 shadow-lg">
                        <Zap className="text-white" size={28} />
                    </div>

                    <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-12">
                        Key Features
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {keyFeatures.map((feat, i) => (
                            <div key={i} className="bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                    <feat.icon className="text-cyan-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-2">{feat.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ========== 6. HOW IT WORKS ========== */}
                <section className="container mx-auto max-w-5xl px-4 mb-32">
                    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-16">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-fuchsia-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <span className="text-2xl">🚀</span>
                                </div>
                                <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal">
                                    How It Works
                                </h2>
                            </div>

                            {/* Timeline */}
                            <div className="relative">
                                {/* Connecting line - hidden on mobile */}
                                <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-500/50 via-fuchsia-500/50 to-amber-500/50" />

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {howItWorksSteps.map((step, i) => (
                                        <div key={step.num} className="relative text-center">
                                            {/* Step number with glow */}
                                            <div className="relative z-10 w-20 h-20 rounded-2xl bg-slate-800 border-2 border-cyan-500/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                                                <span className="font-chrome text-3xl text-white">{step.num}</span>
                                            </div>

                                            {/* Content card */}
                                            <div className="bg-slate-800/60 backdrop-blur-sm border border-white/5 rounded-2xl p-5">
                                                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== 7. WHAT KIDS SEE ========== */}
                <section className="container mx-auto max-w-5xl px-4 mb-32">
                    <div className="text-center mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-2xl">👀</span>
                        </div>
                        <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                            What Kids See
                        </h2>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            An epic journey that feels personal and intimate
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* The Journey */}
                        <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                                    <span className="text-lg">✨</span>
                                </div>
                                <h3 className="font-bold text-white text-xl">The Journey</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Kiki leaves their home and soars through starlit skies",
                                    "Visits wonder-filled locations on her magical quest",
                                    "Brushing reminders throughout",
                                    "Triumphantly returns with their tooth safely delivered"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                                        <span className="text-slate-300 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* The Approach */}
                        <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center">
                                    <span className="text-lg">💜</span>
                                </div>
                                <h3 className="font-bold text-white text-xl">The Approach</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Direct address using child's name throughout",
                                    "Acknowledges their bravery and growth",
                                    "Cinematic visuals with comforting tone",
                                    "Sparks imagination while feeling personal"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-fuchsia-400 shrink-0 mt-2 shadow-[0_0_6px_rgba(232,121,249,0.6)]" />
                                        <span className="text-slate-300 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ========== 8. WHY FAMILIES LOVE IT ========== */}
                <section className="container mx-auto max-w-5xl px-4 mb-32">
                    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-16">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-lime-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <span className="text-2xl">❤️</span>
                                </div>
                                <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal">
                                    Why Families Love It
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    "Turns anxiety into excitement before bedtime",
                                    "Creates lasting family memories",
                                    "Personalized experience makes each child feel special",
                                    "Screen time parents feel good about",
                                    "No toys or clutter - just pure storytelling",
                                    "Works for all children of tooth-losing age"
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-800/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6 flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-lime-500/20 border border-lime-500/30 flex items-center justify-center shrink-0">
                                            <span className="text-lime-400 text-sm">✓</span>
                                        </div>
                                        <p className="text-white font-medium leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== 9. SAFETY & PRIVACY (No Box) ========== */}
                <section className="container mx-auto max-w-5xl px-4 mb-32">
                    <div className="text-center mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Shield className="text-white" size={28} />
                        </div>
                        <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                            Safety & Privacy
                        </h2>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Your child's safety and your family's privacy are our top priorities
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { text: "No personal information stored beyond session duration", emoji: "🔒" },
                            { text: "No third-party advertising or tracking", emoji: "🚫" },
                            { text: "Age-appropriate content reviewed by dentists & parents", emoji: "👨‍⚕️" },
                            { text: "Parents maintain full control of the experience", emoji: "👪" }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                    <span className="text-lg">{item.emoji}</span>
                                </div>
                                <p className="text-white font-medium leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>


                {/* ========== 10. REVIEWS ========== */}
                <section className="container mx-auto max-w-5xl px-4 mb-32">
                    <div className="text-center mb-12">
                        <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                            What Parents Are Saying
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Sarah M.",
                                role: "Mother of two",
                                review: "My daughter ABSOLUTELY LOVED watching the little videos at every step! It made the Tooth Fairy feel so real.",
                                color: "cyan"
                            },
                            {
                                name: "James P.",
                                role: "Dad",
                                review: "Finally a stress-free way to handle the Tooth Fairy. The tracker bought us so much time!",
                                color: "fuchsia"
                            },
                            {
                                name: "Emily R.",
                                role: "Parent",
                                review: "The custom selfie from Kiki blew their minds. Best app ever.",
                                color: "lime"
                            }
                        ].map((review, i) => (
                            <div key={i} className={`bg-gradient-to-br from-${review.color}-500/20 to-${review.color}-600/10 backdrop-blur-sm border border-${review.color}-500/30 rounded-2xl p-6`}>
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className={`text-${review.color}-400 fill-${review.color}-400`} size={16} />
                                    ))}
                                </div>
                                <p className="text-white leading-relaxed mb-4 italic">"{review.review}"</p>
                                <div>
                                    <p className="font-bold text-white">{review.name}</p>
                                    <p className="text-slate-400 text-sm">{review.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ========== STORY BEHIND KIKI ========== */}
                <section className="container mx-auto max-w-5xl px-4 mb-32">
                    <div className="text-center mb-12">
                        <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                            The Story Behind Kiki
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        {/* Founder Photo & Info */}
                        <div className="lg:col-span-1 text-center lg:text-left">
                            <div className="relative w-48 h-48 mx-auto lg:mx-0 mb-6">
                                <div className="absolute -inset-2 bg-gradient-to-br from-cyan-400/40 via-teal-400/30 to-cyan-400/40 rounded-2xl blur-xl" />
                                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-800 flex items-center justify-center">
                                    <span className="text-6xl">👨‍💻</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-white text-xl mb-1">Oliver Finel</h3>
                            <p className="text-cyan-400 text-sm font-medium uppercase tracking-wide mb-4">Founder of Kiki the Tooth Fairy</p>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Serial builder and dad-at-heart on a mission to bring magic back to childhood milestones.
                            </p>
                        </div>

                        {/* Story Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-4">
                                {[
                                    "Made the first video for his nephew, who wanted to \"meet\" the Tooth Fairy.",
                                    "Led him to notice that Santa had trackers, cameos, and videos — while the Tooth Fairy had almost nothing, despite being the second biggest childhood myth.",
                                    "So he built the first interactive tracker that lets children follow her mission step by step.",
                                    "Built to amplify the ritual, adding a layer of fun and magic to Tooth Fairy nights."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-cyan-400 font-bold text-sm">{i + 1}</span>
                                        </div>
                                        <p className="text-slate-300 leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quote */}
                            <div className="relative bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                                <div className="absolute -top-4 left-8 text-6xl text-cyan-500/30">"</div>
                                <p className="text-white text-lg italic leading-relaxed relative z-10">
                                    Santa has the North Pole. The Easter Bunny has the garden. The Tooth Fairy had... a pillow? We wanted to give her a world.
                                </p>
                                <p className="text-cyan-400 text-sm font-medium mt-4">— Oliver Finel</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== AVAILABILITY ========== */}
                <section className="container mx-auto max-w-5xl px-4 mb-32">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-2xl">🌎</span>
                        </div>
                        <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                            Availability
                        </h2>
                    </div>

                    <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center max-w-3xl mx-auto">
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            Kiki the Tooth Fairy is currently available to families across the <span className="text-white font-medium">United States</span> and <span className="text-white font-medium">Canada</span>. The experience works on any modern web browser on phones, tablets, and computers. No app download required.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                            <span className="text-amber-400">🚧</span>
                            <p className="text-amber-300 text-sm">
                                Localized "Tooth Mouse" versions for LATAM & Western Europe are in development.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ========== ASSETS SECTION ========== */}

                <section id="assets" className="container mx-auto max-w-6xl px-4 mb-32">
                    <div className="text-center mb-12">
                        <h2 className="font-chrome text-4xl text-white uppercase tracking-normal mb-4">Brand Assets</h2>
                        <p className="text-slate-400">High-resolution resources for media and partners.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {assets.map((asset, i) => (
                            <div key={i} className="group relative bg-slate-900 border border-white/10 rounded-2xl p-6 hover:bg-slate-800 transition-all">
                                <span className="text-4xl mb-4 block">{asset.icon}</span>
                                <h3 className="font-bold text-white mb-1">{asset.title}</h3>
                                <p className="text-slate-500 text-xs mb-6 uppercase tracking-widest">{asset.type}</p>
                                <button className={`w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-lg`}>
                                    <Download size={14} /> Download Assets
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ========== PRESS CONTACT ========== */}
                <section className="container mx-auto max-w-3xl px-4 mb-32">
                    <div className="text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Mail className="text-white" size={28} />
                        </div>
                        <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                            Press Contact
                        </h2>
                        <a href="mailto:oli@kikithetoothfairy.co" className="text-2xl md:text-3xl text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                            oli@kikithetoothfairy.co
                        </a>
                        <p className="text-slate-400 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
                            For interviews, demo access, high-resolution assets, or story ideas, please reach out. We typically respond within 12 hours.
                        </p>
                    </div>
                </section>

                {/* ========== RETURN HOME CTA ========== */}
                <section className="text-center pb-12">
                    <Link
                        to="/"
                        onClick={() => window.scrollTo(0, 0)}
                        className="bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600 text-white px-16 py-6 rounded-2xl font-sans font-extrabold text-xl uppercase tracking-tight shadow-[0_0_40px_rgba(163,230,53,0.4)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(163,230,53,0.5)] active:translate-y-1 border-b-[5px] border-emerald-800 active:border-b-0 inline-flex items-center gap-4"
                    >
                        Return Home <ArrowRight size={24} />
                    </Link>
                </section>


            </div>

            <Footer />
        </div>
    );
};

export default MediaKitPage;
