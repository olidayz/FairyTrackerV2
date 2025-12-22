import React from 'react';

const Footer = () => {
    return (
        <footer className="relative py-10 md:py-16 px-4 border-t border-white/10">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Mobile: Compact Layout */}
                <div className="md:hidden">
                    {/* Logo Row */}
                    <div className="flex items-center justify-between mb-6">
                        <img src="/kiki-logo.png" alt="Kiki" className="w-14 h-14 rounded-xl shadow-lg" />
                        <a
                            href="https://www.instagram.com/kikithetoothfairy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                        >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>

                    {/* 2x2 Grid of Links */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Explore</h4>
                            <ul className="space-y-1.5">
                                <li><a href="/#meet-kiki" className="text-slate-400 hover:text-white transition-colors text-xs">Meet Kiki</a></li>
                                <li><a href="/#how-it-works" className="text-slate-400 hover:text-white transition-colors text-xs">How It Works</a></li>
                                <li><a href="/blog" className="text-slate-400 hover:text-white transition-colors text-xs">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Support</h4>
                            <ul className="space-y-1.5">
                                <li><a href="/#faq" className="text-slate-400 hover:text-white transition-colors text-xs">FAQ</a></li>
                                <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors text-xs">Contact Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Legal</h4>
                            <ul className="space-y-1.5">
                                <li><a href="/terms" className="text-slate-400 hover:text-white transition-colors text-xs">Terms</a></li>
                                <li><a href="/privacy" className="text-slate-400 hover:text-white transition-colors text-xs">Privacy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Policies</h4>
                            <ul className="space-y-1.5">
                                <li><a href="/shipping" className="text-slate-400 hover:text-white transition-colors text-xs">Shipping</a></li>
                                <li><a href="/refund" className="text-slate-400 hover:text-white transition-colors text-xs">Refunds</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-4 border-t border-white/10 text-center">
                        <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Tooth Fairy Tracker</p>
                    </div>
                </div>

                {/* Desktop: Full Layout */}
                <div className="hidden md:block">
                    <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8">
                        {/* Logo & About Column */}
                        <div className="space-y-5">
                            <div className="flex items-center">
                                <img src="/kiki-logo.png" alt="Kiki" className="w-16 h-16 rounded-xl shadow-lg" />
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                Making childhood magic real, one tooth at a time. The world's most magical Tooth Fairy experience.
                            </p>
                            <div className="flex gap-3 pt-2">
                                <a
                                    href="https://www.instagram.com/kikithetoothfairy/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                >
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Navigation Column */}
                        <div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Explore</h4>
                            <ul className="space-y-3">
                                <li><a href="/#meet-kiki" className="text-slate-400 hover:text-white transition-colors text-sm">Meet Kiki</a></li>
                                <li><a href="/#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm">How It Works</a></li>
                                <li><a href="/#reviews" className="text-slate-400 hover:text-white transition-colors text-sm">Reviews</a></li>
                                <li><a href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">Blog</a></li>
                                <li><a href="/media-kit" className="text-slate-400 hover:text-white transition-colors text-sm">Media Kit</a></li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Support</h4>
                            <ul className="space-y-3">
                                <li><a href="/#faq" className="text-slate-400 hover:text-white transition-colors text-sm">FAQ</a></li>
                                <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Legal</h4>
                            <ul className="space-y-3">
                                <li><a href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                                <li><a href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                                <li><a href="/shipping" className="text-slate-400 hover:text-white transition-colors text-sm">Shipping Policy</a></li>
                                <li><a href="/refund" className="text-slate-400 hover:text-white transition-colors text-sm">Refund Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} Tooth Fairy Tracker. All rights reserved.
                        </p>
                        <p className="text-slate-500 text-xs flex items-center gap-2">
                            Made with <span className="text-pink-500">♥</span> for magical families everywhere
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
