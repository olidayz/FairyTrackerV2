import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || !email || !message) {
            setErrorMessage('Please fill in all fields');
            setSubmitStatus('error');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setSubmitStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error: any) {
            setSubmitStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1020] text-white font-sans">
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px]" style={{ background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px]" style={{ background: 'radial-gradient(circle, rgba(232, 121, 249, 0.06) 0%, transparent 70%)' }} />
            </div>

            <Header />

            <div className="relative z-10 pt-28 max-w-2xl mx-auto px-4 pb-16">
                <div className="relative">
                    <div className="absolute w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] transform rotate-6 translate-x-3 translate-y-3 shadow-2xl opacity-70" />
                    <div className="absolute w-full h-full bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-[2rem] transform -rotate-3 translate-x-1 translate-y-1 shadow-2xl opacity-80" />
                    <div className="absolute w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-[2rem] transform rotate-2 -translate-y-1 shadow-2xl opacity-90" />

                    <div className="relative bg-slate-950 rounded-[2rem] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border-2 border-white/10 z-10">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="mb-6">
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Say Hello</span>
                                <h1 className="font-chrome text-2xl md:text-3xl text-white uppercase tracking-normal mt-2">
                                    Get in Touch
                                </h1>
                            </div>

                            {submitStatus === 'success' ? (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                                    <div className="text-4xl mb-3">✨</div>
                                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-slate-300">Thank you for reaching out. We'll get back to you soon!</p>
                                    <button
                                        onClick={() => setSubmitStatus('idle')}
                                        className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    {submitStatus === 'error' && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-white font-bold text-sm mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            placeholder="Sarah"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={isSubmitting}
                                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-bold text-sm mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="sarah@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isSubmitting}
                                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-bold text-sm mb-2">Message</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Hi! I had a question about..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            disabled={isSubmitting}
                                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner resize-none disabled:opacity-50"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-sans font-extrabold uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-cyan-800 active:border-b-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </form>
                            )}

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
