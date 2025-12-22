import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const PrivacyPolicyPage = () => {
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
                    Privacy Policy
                </h1>

                {/* Content */}
                <div className="prose prose-invert prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Changes to This Privacy Policy</h2>
                        <p className="text-slate-400 leading-relaxed">
                            We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site and update the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">How We Collect and Use Your Personal Information</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            To provide the Services, we collect personal information about you from a variety of sources. The information we collect and use varies depending on how you interact with us.
                        </p>

                        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Information We Collect Directly from You</h3>
                        <ul className="text-slate-400 space-y-2 list-disc list-inside">
                            <li>Contact details including your name, address, phone number, and email</li>
                            <li>Order information including billing address, shipping address, and payment confirmation</li>
                            <li>Account information including username and password</li>
                            <li>Customer support information when communicating with us</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Information We Collect About Your Usage</h3>
                        <p className="text-slate-400 leading-relaxed">
                            We may automatically collect information about your interaction with the Services ("Usage Data") including device information, browser information, IP address, and other information regarding your interaction with the Services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">How We Use Your Personal Information</h2>
                        <ul className="text-slate-400 space-y-3">
                            <li><strong className="text-white">Providing Products and Services:</strong> We use your information to provide Services, process payments, fulfill orders, and manage your account.</li>
                            <li><strong className="text-white">Marketing and Advertising:</strong> We may use your information for marketing and promotional purposes, such as sending promotional communications.</li>
                            <li><strong className="text-white">Security and Fraud Prevention:</strong> We use your information to detect and investigate possible fraudulent or malicious activity.</li>
                            <li><strong className="text-white">Communicating with You:</strong> We use your information to provide customer support and improve our Services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Cookies</h2>
                        <p className="text-slate-400 leading-relaxed">
                            We use Cookies to power and improve our Site and Services. Most browsers automatically accept Cookies by default, but you can choose to set your browser to remove or reject Cookies through your browser controls.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">How We Disclose Personal Information</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            In certain circumstances, we may disclose your personal information to third parties for legitimate purposes, including:
                        </p>
                        <ul className="text-slate-400 space-y-2 list-disc list-inside">
                            <li>With vendors who perform services on our behalf (IT management, payment processing, etc.)</li>
                            <li>With business and marketing partners</li>
                            <li>When you direct or consent to disclosure</li>
                            <li>With affiliates within our corporate group</li>
                            <li>In connection with business transactions or legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Children's Data</h2>
                        <p className="text-slate-400 leading-relaxed">
                            The Services are not intended to be used by children, and we do not knowingly collect any personal information about children. If you are the parent or guardian of a child who has provided us with their personal information, please contact us to request deletion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Your Rights</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Depending on where you live, you may have rights including:
                        </p>
                        <ul className="text-slate-400 space-y-2 list-disc list-inside">
                            <li>Right to Access / Know</li>
                            <li>Right to Delete</li>
                            <li>Right to Correct</li>
                            <li>Right of Portability</li>
                            <li>Right to Opt out of Sale or Sharing</li>
                            <li>Right to Withdraw Consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
                        <p className="text-slate-400 leading-relaxed">
                            If you have questions about our privacy practices or this Privacy Policy, or would like to exercise your rights, please contact us at{' '}
                            <a href="mailto:hello@kikithetoothfairy.co" className="text-cyan-400 hover:text-cyan-300">hello@kikithetoothfairy.co</a>
                            {' '}or at 251 Elizabeth Street, New York, NY, 10012, US.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
