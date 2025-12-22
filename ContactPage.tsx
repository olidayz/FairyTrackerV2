import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-[#0a1020] text-white font-sans">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-fuchsia-500/8 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <Header />

            <div className="relative z-10 pt-28 max-w-2xl mx-auto px-4 pb-16">
                {/* Form Card */}
                <div className="relative">
                    {/* Stacked background cards */}
                    <div className="absolute w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] transform rotate-6 translate-x-3 translate-y-3 shadow-2xl opacity-70" />
                    <div className="absolute w-full h-full bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-[2rem] transform -rotate-3 translate-x-1 translate-y-1 shadow-2xl opacity-80" />
                    <div className="absolute w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-[2rem] transform rotate-2 -translate-y-1 shadow-2xl opacity-90" />

                    {/* Main Form Card */}
                    <div className="relative bg-slate-950 rounded-[2rem] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border-2 border-white/10 z-10">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="mb-6">
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Say Hello</span>
                                <h1 className="font-chrome text-2xl md:text-3xl text-white uppercase tracking-normal mt-2">
                                    Get in Touch
                                </h1>
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
                                    className="w-full bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-sans font-extrabold uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-cyan-800 active:border-b-0"
                                >
                                    Send Message ✨
                                </button>
                            </form>

                            {/* Contact Info */}
                            <div className="pt-6 border-t border-white/10 text-center">
                                <p className="text-slate-400 text-sm mb-2">Or email us directly:</p>
                                <a href="mailto:hello@kikithetoothfairy.co" className="text-cyan-400 hover:text-cyan-300 font-medium">
                                    hello@kikithetoothfairy.co
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactPage;
