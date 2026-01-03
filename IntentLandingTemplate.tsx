import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import { getAttributionForSignup } from './lib/attribution';
import { trackCtaClick, getJourneyForSignup } from './lib/journeyTracking';
import { getOrCreateVisitorId } from './lib/visitor';

const IntentLandingTemplate = () => {
    const navigate = useNavigate();
    const [childName, setChildName] = useState('');
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    
    useEffect(() => {
        document.title = '[PLACEHOLDER] Intent Landing Page | Kiki the Tooth Fairy';
        
        let robotsMeta = document.querySelector('meta[name="robots"]');
        if (!robotsMeta) {
            robotsMeta = document.createElement('meta');
            robotsMeta.setAttribute('name', 'robots');
            document.head.appendChild(robotsMeta);
        }
        robotsMeta.setAttribute('content', 'noindex, nofollow');
        
        return () => {
            robotsMeta?.setAttribute('content', 'index, follow');
        };
    }, []);

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
        
        trackCtaClick('signup_submit', 'Start Tracking');
        
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
                    landingPage: attribution.landingPage,
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

    const placeholderBenefits = [
        { icon: "🎁", title: "[Benefit 1 Title]", desc: "[Description of benefit 1 - what value does the user get?]", color: "from-fuchsia-400 to-purple-500" },
        { icon: "✨", title: "[Benefit 2 Title]", desc: "[Description of benefit 2 - what problem does it solve?]", color: "from-cyan-400 to-blue-500" },
        { icon: "🌟", title: "[Benefit 3 Title]", desc: "[Description of benefit 3 - why is this special?]", color: "from-amber-400 to-orange-500" },
        { icon: "💫", title: "[Benefit 4 Title]", desc: "[Description of benefit 4 - what makes it unique?]", color: "from-lime-400 to-green-500" },
    ];

    const placeholderFaqs = [
        { question: "[FAQ Question 1]", answer: "[Answer to FAQ 1 - address a common concern or objection]" },
        { question: "[FAQ Question 2]", answer: "[Answer to FAQ 2 - explain how something works]" },
        { question: "[FAQ Question 3]", answer: "[Answer to FAQ 3 - clarify pricing or value]" },
        { question: "[FAQ Question 4]", answer: "[Answer to FAQ 4 - build trust and credibility]" },
    ];

    const placeholderTestimonials = [
        { name: "[Parent Name]", location: "[City, State]", text: "[Testimonial quote about the product/experience]", rating: 5 },
        { name: "[Parent Name]", location: "[City, State]", text: "[Testimonial quote focusing on child's reaction]", rating: 5 },
        { name: "[Parent Name]", location: "[City, State]", text: "[Testimonial quote about value/convenience]", rating: 5 },
    ];

    return (
        <div className="min-h-screen bg-[#02040a] text-white overflow-x-hidden">
            <Header />

            {/* ========== HERO SECTION ========== */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        
                        {/* Left: Hero Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/50 border border-cyan-500/30 rounded-full mb-6">
                                <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">[BADGE TEXT]</span>
                            </div>
                            
                            <h1 className="font-chrome text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-normal mb-6">
                                [Primary Headline]
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                                    [Highlighted Text]
                                </span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                                [Subheadline that expands on the promise and addresses the target audience's pain point or desire]
                            </p>
                            
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <button 
                                    onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105"
                                >
                                    [Primary CTA Button] <ArrowRight className="inline ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Right: Tracker Preview (iframe like landing page) */}
                        <div className="relative">
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
                                            <span className="text-xs text-slate-400 font-mono">tracker.kikithetoothfairy.co</span>
                                        </div>
                                    </div>
                                    <div className="w-14" />
                                </div>
                                <div className="relative aspect-[3/4] md:aspect-[4/3] bg-[#02040a] overflow-hidden">
                                    <iframe
                                        src="/tracker"
                                        className="absolute inset-0 w-full h-full border-0"
                                        title="Tracker Preview"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== BENEFITS SECTION ========== */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-x-0 top-0 flex justify-center">
                    <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
                </div>
                
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-fuchsia-950/50 border border-fuchsia-500/30 rounded-full mb-4">
                            <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest">[SECTION BADGE]</span>
                        </div>
                        <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                            [Benefits Section Title]
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            [Subheading that introduces the benefits]
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {placeholderBenefits.map((benefit, idx) => (
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

            {/* ========== SOCIAL PROOF / TESTIMONIALS SECTION ========== */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-950/50 border border-amber-500/30 rounded-full mb-4">
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">[TESTIMONIALS BADGE]</span>
                        </div>
                        <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                            [Testimonials Title]
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {placeholderTestimonials.map((testimonial, idx) => (
                            <div key={idx} className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                                <div className="text-sm">
                                    <span className="text-white font-semibold">{testimonial.name}</span>
                                    <span className="text-slate-500 ml-2">{testimonial.location}</span>
                                </div>
                            </div>
                        ))}
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
                            <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">[FAQ BADGE]</span>
                        </div>
                        <h2 className="font-chrome text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-normal mb-4">
                            [FAQ Section Title]
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {placeholderFaqs.map((faq, idx) => (
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

            {/* ========== CTA / SIGNUP SECTION ========== */}
            <section id="signup-form" className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="container mx-auto max-w-xl relative z-10">
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h2 className="font-chrome text-2xl md:text-3xl text-white uppercase tracking-normal mb-3">
                                [CTA Headline]
                            </h2>
                            <p className="text-slate-400">
                                [CTA subheadline reinforcing the value proposition]
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">[Child's Name Label]</label>
                                <input
                                    type="text"
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                    placeholder="[Placeholder text]"
                                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">[Email Label]</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="[Placeholder text]"
                                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                            
                            {formError && (
                                <p className="text-red-400 text-sm text-center">{formError}</p>
                            )}
                            
                            <button
                                onClick={handleSignup}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Starting...' : '[CTA Button Text]'}
                            </button>
                            
                            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <span className="text-green-400">✓</span> [Trust signal 1]
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="text-green-400">✓</span> [Trust signal 2]
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default IntentLandingTemplate;
