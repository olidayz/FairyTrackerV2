import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const RefundPolicyPage = () => {
    useEffect(() => {
        document.title = 'Refund Policy | Kiki the Tooth Fairy';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'Understand our refund policy for Kiki the Tooth Fairy personalized videos. Learn about eligibility, non-refundable situations, and how to request support.');
        }
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', 'https://kikithetoothfairy.co/policies/refund-policy');
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
                    Refund Policy
                </h1>

                {/* Content */}
                <div className="prose prose-invert prose-slate max-w-none space-y-8">
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                        <p className="text-slate-300">
                            All Kiki the Tooth Fairy products are personalized digital videos. No physical returns are accepted.
                        </p>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Eligibility for Refunds</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">We offer refunds or free re-delivery if:</p>
                        <ul className="text-slate-400 space-y-2 list-disc list-inside">
                            <li>You did not receive your video within 24 hours of purchase</li>
                            <li>The video has a technical issue (file won't play, corrupted link)</li>
                            <li>The personalization is incorrect due to our error</li>
                        </ul>
                        <p className="text-slate-500 text-sm mt-4">
                            Issues must be reported within 30 days of purchase at{' '}
                            <a href="mailto:hello@kikithetoothfairy.co" className="text-cyan-400 hover:text-cyan-300">hello@kikithetoothfairy.co</a>
                            {' '}with your order number.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Not Eligible for Refunds</h2>
                        <ul className="text-slate-400 space-y-2 list-disc list-inside">
                            <li>Correctly delivered videos with accurate personalization as provided at checkout</li>
                            <li>Typos or wrong info submitted by the customer</li>
                            <li>Change of mind after delivery</li>
                            <li>Gift cards and sale promotions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">How to Request a Fix or Refund</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Email{' '}
                            <a href="mailto:hello@kikithetoothfairy.co" className="text-cyan-400 hover:text-cyan-300">hello@kikithetoothfairy.co</a>
                            {' '}with:
                        </p>
                        <ul className="text-slate-400 space-y-2 list-disc list-inside">
                            <li>Order number</li>
                            <li>Problem description</li>
                            <li>Screenshot or video of the issue (if applicable)</li>
                        </ul>
                        <p className="text-slate-400 leading-relaxed mt-4">
                            We'll first repair or re-send your video. If we can't resolve it, we'll refund to the original payment method.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">EU Digital-Content Notice</h2>
                        <p className="text-slate-400 leading-relaxed">
                            For customers in the EU: by requesting immediate delivery of a personalized digital video, you expressly consent to performance starting right away and acknowledge you lose the 14-day withdrawal right for digital content once delivery begins (Directive 2011/83/EU). This does not limit your rights if the product is defective or not as described.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Processing Time</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Approved refunds are issued within <strong className="text-white">10 business days</strong>. Your bank or card issuer may take additional time to post the credit. If 15 business days pass without the refund, contact{' '}
                            <a href="mailto:hello@kikithetoothfairy.co" className="text-cyan-400 hover:text-cyan-300">hello@kikithetoothfairy.co</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Questions? Email us at{' '}
                            <a href="mailto:hello@kikithetoothfairy.co" className="text-cyan-400 hover:text-cyan-300">hello@kikithetoothfairy.co</a>.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RefundPolicyPage;
