import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 100) {
                setHeaderVisible(true);
            } else if (currentScrollY > lastScrollY) {
                setHeaderVisible(false);
            } else {
                setHeaderVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleStartTracking = () => {
        navigate('/tracker');
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="mx-4 mt-4">
                <div className="max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 md:px-6 py-3 shadow-2xl">
                    <div className="flex items-center justify-between">

                        {/* Left: Hamburger (mobile) or Nav Links (desktop) */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <nav className="hidden lg:flex items-center gap-6">
                                <Link to="/#meet-kiki" className="text-sm text-slate-300 hover:text-white transition-colors">
                                    Meet Kiki
                                </Link>
                                <Link to="/#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">
                                    How it Works
                                </Link>
                                <Link to="/#faq" className="text-sm text-slate-300 hover:text-white transition-colors">
                                    FAQ
                                </Link>
                                <Link to="/blogs/kikis-blog" className="text-sm text-slate-300 hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </nav>
                        </div>

                        {/* Center: Logo */}
                        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
                            <div className="w-14 h-14 rounded-xl overflow-hidden">
                                <img src="/kiki-logo.png" alt="Kiki" className="w-full h-full object-cover" />
                            </div>
                        </Link>

                        {/* Right: CTA */}
                        <button
                            onClick={handleStartTracking}
                            className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-sans font-extrabold text-xs md:text-sm uppercase tracking-tight shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 border-b-[3px] border-indigo-900 active:border-b-0"
                        >
                            Start Tracking
                        </button>

                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden mx-4 mt-2">
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                        <nav className="flex flex-col gap-4">
                            <Link to="/#meet-kiki" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2">
                                Meet Kiki
                            </Link>
                            <Link to="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2">
                                How it Works
                            </Link>
                            <Link to="/#faq" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2">
                                FAQ
                            </Link>
                            <Link to="/blogs/kikis-blog" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2">
                                Blog
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
