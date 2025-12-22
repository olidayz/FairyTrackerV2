import React from 'react';
import { ArrowRight, Sparkles, MapPin, CheckCircle } from 'lucide-react';

const EmailContainer = ({ subject, children }: { subject: string, children: React.ReactNode }) => (
    <div className="max-w-2xl mx-auto my-12 font-sans text-slate-900">
        <div className="bg-slate-100 rounded-lg p-4 mb-4 text-sm text-slate-500 border border-slate-200">
            <strong>Subject:</strong> {subject}
        </div>
        <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-slate-800">
            {children}
        </div>
    </div>
);

const EmailPreviews = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
            <h1 className="text-3xl font-bold text-center mb-12">Email Templates</h1>

            {/* EMAIL 1: TRACKING LINK */}
            <EmailContainer subject="🧚‍♀️ It's Happening! Track Kiki Live">
                {/* Header */}
                <div className="bg-[#020617] p-8 text-center border-b border-white/10">
                    <img src="/kiki-logo.png" alt="Kiki" className="w-16 h-16 rounded-xl mx-auto mb-4" />
                    <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">Tooth Fairy Tracker</p>
                </div>

                {/* Hero */}
                <div className="bg-slate-900 p-8 pt-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Tracker Activated
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                        Kiki is Airborne!
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto mb-8">
                        The Fairyland Control Center has confirmed lift-off. We've detected magical signals near <span className="text-white font-semibold">Oliver's Room</span>.
                    </p>

                    {/* Button */}
                    <a href="#" className="inline-block bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-base px-8 py-4 rounded-lg uppercase tracking-wide shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all">
                        Track Kiki Live
                    </a>
                </div>

                {/* Info Box */}
                <div className="p-8 bg-[#0f172a]">
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                        <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                            <Sparkles size={16} className="text-amber-400" />
                            Mission Checklist
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-400 text-sm">
                                <CheckCircle size={16} className="text-cyan-500 mt-0.5" />
                                <span>Tooth placed securely under the pillow</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-400 text-sm">
                                <CheckCircle size={16} className="text-cyan-500 mt-0.5" />
                                <span>Lights out and eyes closed (fairies are shy!)</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-400 text-sm">
                                <CheckCircle size={16} className="text-cyan-500 mt-0.5" />
                                <span>Tracker ready on parent's device</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-[#020617] p-6 text-center text-slate-500 text-xs">
                    <p>© 2024 The Office of the Tooth Fairy. All rights reserved.</p>
                    <p className="mt-2">Sent from Fairyland Connection Node #492</p>
                </div>
            </EmailContainer>


            {/* EMAIL 2: MORNING UNLOCK */}
            <EmailContainer subject="✨ Mission Complete! See Kiki's Visit">
                {/* Header */}
                <div className="bg-[#020617] p-8 text-center border-b border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 to-transparent opacity-50" />
                    <img src="/kiki-logo.png" alt="Kiki" className="w-16 h-16 rounded-xl mx-auto mb-4 relative z-10" />
                    <p className="text-fuchsia-300 text-xs font-bold uppercase tracking-[0.2em] relative z-10">Mission Update</p>
                </div>

                {/* Hero */}
                <div className="bg-slate-900 p-8 pt-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles size={12} />
                        Delivery Confirmed
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                        Mission Complete!
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto mb-8">
                        Good morning! Kiki visited <span className="text-white font-semibold">Oliver's Room</span> last night while the house was sleeping.
                    </p>

                    {/* Button */}
                    <a href="#" className="inline-block bg-[#d946ef] hover:bg-[#c026d3] text-white font-bold text-base px-8 py-4 rounded-lg uppercase tracking-wide shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all">
                        See The Magic
                    </a>
                </div>

                {/* Info Box */}
                <div className="p-8 bg-[#0f172a]">
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5 text-center">
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            "The tooth was perfect! I've left a little something special behind. Can you find it?"
                        </p>
                        <p className="text-cyan-400 font-bold text-xs uppercase tracking-widest">
                            — Kiki
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-[#020617] p-6 text-center text-slate-500 text-xs">
                    <div className="flex justify-center gap-4 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    </div>
                    <p>Hope you had a magical night!</p>
                </div>
            </EmailContainer>
        </div>
    );
};

export default EmailPreviews;
