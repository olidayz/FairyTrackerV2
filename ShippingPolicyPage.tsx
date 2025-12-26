import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const ShippingPolicyPage = () => {
    useEffect(() => {
        document.title = 'Shipping Policy | Kiki the Tooth Fairy';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'Learn about digital delivery for Kiki the Tooth Fairy personalized videos. All products are delivered instantly via email - no physical shipping required.');
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#0a1020] text-white font-sans">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] mix-blend-screen" />
            </div>

            <Header />

            <div className="relative z-10 pt-28 max-w-4xl mx-auto px-4 pb-16">
                {/* Header */}
                <h1 className="font-chrome text-4xl md:text-5xl text-white uppercase tracking-normal mb-8">
                    Shipping Policy
                </h1>

                {/* Content */}
                <div className="prose prose-invert prose-slate max-w-none space-y-8">
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
                        <p className="text-white font-semibold text-lg mb-2">✨ All Digital Products</p>
                        <p className="text-slate-300">
                            All Kiki the Tooth Fairy videos are digital products. No physical shipping is required.
                        </p>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Delivery Method</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Your personalized video is delivered directly to the email address you provide at checkout.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Delivery Time</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Most videos are delivered within <strong className="text-white">1 hour</strong> of your order. In rare cases, processing may take up to 24 hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Order Confirmation</h2>
                        <p className="text-slate-400 leading-relaxed">
                            You will receive an order confirmation email immediately after purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Issues with Delivery</h2>
                        <p className="text-slate-400 leading-relaxed">
                            If you do not receive your video within 24 hours, please check your spam/junk folder. If it's not there, contact us at{' '}
                            <a href="mailto:hello@kikithetoothfairy.co" className="text-cyan-400 hover:text-cyan-300">hello@kikithetoothfairy.co</a>
                            {' '}and we'll resend it.
                        </p>
                    </section>

                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 mt-8">
                        <p className="text-slate-300">
                            Because videos are digital, there are <strong className="text-white">no shipping fees</strong> or international restrictions.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ShippingPolicyPage;
