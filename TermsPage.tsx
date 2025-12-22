import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const TermsPage = () => {
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
                    Terms of Service
                </h1>

                {/* Content */}
                <div className="prose prose-invert prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Overview</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Welcome to Kiki the Tooth Fairy! The terms "we", "us" and "our" refer to Kiki the Tooth Fairy. Kiki the Tooth Fairy operates this store and website, including all related information, content, features, tools, products and services in order to provide you, the customer, with a curated experience (the "Services").
                        </p>
                        <p className="text-slate-400 leading-relaxed mt-4">
                            By visiting, interacting with or using our Services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these Terms of Service or Privacy Policy, you should not use or access our Services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 1 - Access and Account</h2>
                        <p className="text-slate-400 leading-relaxed">
                            By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, and you have given us your consent to allow any of your minor dependents to use the Services on devices you own, purchase or manage. You are solely responsible for maintaining the security of your account credentials and for all of your account activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 2 - Our Products</h2>
                        <p className="text-slate-400 leading-relaxed">
                            We have made every effort to provide an accurate representation of our products and services. However, colors or product appearance may differ from how they may appear on your screen. All descriptions of products are subject to change at any time without notice at our sole discretion. We reserve the right to discontinue any product at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 3 - Orders</h2>
                        <p className="text-slate-400 leading-relaxed">
                            When you place an order, you are making an offer to purchase. Kiki the Tooth Fairy reserves the right to accept or decline your order for any reason at its discretion. Your order is not accepted until Kiki the Tooth Fairy confirms acceptance. Your purchases are subject to return or exchange solely in accordance with our Refund Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 4 - Prices and Billing</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Prices, discounts and promotions are subject to change without notice. You agree to provide current, complete and accurate purchase, payment and account information for all purchases made at our stores.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 5 - Shipping and Delivery</h2>
                        <p className="text-slate-400 leading-relaxed">
                            We are not liable for shipping and delivery delays. All delivery times are estimates only and are not guaranteed. We are not responsible for delays caused by shipping carriers, customs processing, or events outside our control.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 6 - Intellectual Property</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Our Services, including but not limited to all trademarks, brands, text, displays, images, graphics, video, and audio, are owned by Kiki the Tooth Fairy, its affiliates or licensors and are protected by U.S. and foreign intellectual property laws. Unauthorized use of the Services may be a violation of intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 7 - Prohibited Uses</h2>
                        <p className="text-slate-400 leading-relaxed">
                            You may access and use the Services for lawful purposes only. You may not access or use the Services for any unlawful or malicious purpose, to violate any regulations or laws, to infringe upon intellectual property rights, to harass or harm any person, or to transmit false or misleading information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 8 - Termination</h2>
                        <p className="text-slate-400 leading-relaxed">
                            We may terminate this agreement or your access to the Services in our sole discretion at any time without notice, and you will remain liable for all amounts due up to and including the date of termination.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 9 - Disclaimer of Warranties</h2>
                        <p className="text-slate-400 leading-relaxed">
                            THE SERVICES AND ALL PRODUCTS OFFERED THROUGH THE SERVICES ARE PROVIDED 'AS IS' AND 'AS AVAILABLE' FOR YOUR USE, WITHOUT ANY REPRESENTATION, WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 10 - Limitation of Liability</h2>
                        <p className="text-slate-400 leading-relaxed">
                            TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO CASE SHALL KIKI THE TOOTH FAIRY BE LIABLE FOR ANY INJURY, LOSS, CLAIM, OR ANY DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, SPECIAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 11 - Governing Law</h2>
                        <p className="text-slate-400 leading-relaxed">
                            These Terms of Service shall be governed by and construed in accordance with the federal and state or territorial courts in the jurisdiction where Kiki the Tooth Fairy is headquartered.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Section 12 - Changes to Terms</h2>
                        <p className="text-slate-400 leading-relaxed">
                            We reserve the right to update, change, or replace any part of these Terms of Service by posting updates and changes to our website. Your continued use of the Services following the posting of any changes constitutes acceptance of those changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Questions about the Terms of Service should be sent to us at{' '}
                            <a href="mailto:hello@kikithetoothfairy.co" className="text-cyan-400 hover:text-cyan-300">hello@kikithetoothfairy.co</a>.
                        </p>
                        <p className="text-slate-400 leading-relaxed mt-2">
                            Kiki the Tooth Fairy<br />
                            251 Elizabeth St<br />
                            New York, NY 10001
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsPage;
