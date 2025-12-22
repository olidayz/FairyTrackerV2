import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Clock, User, ArrowRight, ChevronsRight, Sparkles, Menu, X } from 'lucide-react';
import Footer from './components/Footer';

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    featuredImageUrl: string | null;
    status: string;
    createdAt: string;
}

const BlogListPage = () => {
    const navigate = useNavigate();
    const [headerVisible, setHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blog')
            .then(res => res.json())
            .then(data => {
                setBlogPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch blog posts:', err);
                setLoading(false);
            });
    }, []);

    // Card color variations matching landing page bento
    const cardColors = [
        { badge: 'from-cyan-400 to-blue-500', ring: 'ring-cyan-500/20 group-hover:ring-cyan-500/40' },
        { badge: 'from-fuchsia-500 to-purple-600', ring: 'ring-fuchsia-500/20 group-hover:ring-fuchsia-500/40' },
        { badge: 'from-amber-400 to-orange-500', ring: 'ring-amber-500/20 group-hover:ring-amber-500/40' },
        { badge: 'from-lime-400 to-green-500', ring: 'ring-lime-500/20 group-hover:ring-lime-500/40' },
        { badge: 'from-pink-500 to-rose-600', ring: 'ring-pink-500/20 group-hover:ring-pink-500/40' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setHeaderVisible(false);
            } else {
                setHeaderVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className="min-h-screen bg-[#0a1020] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* === FIXED BACKGROUND (MATCHING LANDING PAGE) === */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />

                {/* Ambient glows */}
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-teal-500/8 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[200px] mix-blend-screen" />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            </div>

            {/* ========== FLOATING HEADER (MATCHING LANDING PAGE) ========== */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="mx-4 mt-4">
                    <div className="max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 md:px-6 py-3 shadow-2xl">
                        <div className="flex items-center justify-between">

                            {/* Left: Hamburger (mobile) or Logo */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
                                >
                                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                                <Link to="/" className="flex items-center">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden">
                                        <img src="/kiki-logo.png" alt="Kiki" className="w-full h-full object-cover" />
                                    </div>
                                </Link>
                            </div>

                            {/* Desktop nav */}
                            <nav className="hidden lg:flex items-center gap-6">
                                <Link to="/" className="text-sm text-slate-300 hover:text-white transition-colors">Home</Link>
                                <Link to="/blog" className="text-sm text-slate-300 hover:text-white transition-colors">Stories</Link>
                            </nav>

                            {/* CTA */}
                            <button
                                onClick={() => navigate('/')}
                                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-sans font-extrabold text-xs md:text-sm uppercase tracking-tight shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 border-b-[3px] border-indigo-900 active:border-b-0"
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
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2">
                                    Home
                                </Link>
                                <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2">
                                    Stories
                                </Link>
                            </nav>
                        </div>
                    </div>
                )}
            </header>


            <main className="relative z-10 pt-32 pb-24 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-fuchsia-950/50 border border-fuchsia-500/30 rounded-full mb-4">
                            <Sparkles size={14} className="text-fuchsia-300" />
                            <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest">Tooth Fairy Tips, Ideas & Magic</span>
                        </div>
                        <h1 className="font-chrome text-5xl md:text-7xl text-white uppercase tracking-wide mb-6">
                            Kiki's Blog
                        </h1>
                    </div>

                    {/* Blog Grid - Subtle cards matching tracker aesthetic */}
                    {loading ? (
                        <div className="text-center py-12 text-slate-400">Loading...</div>
                    ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogPosts.map((post, idx) => {
                            const accentColors = [
                                'border-cyan-500/30 hover:border-cyan-400/50',
                                'border-fuchsia-500/30 hover:border-fuchsia-400/50',
                                'border-amber-500/30 hover:border-amber-400/50',
                                'border-lime-500/30 hover:border-lime-400/50',
                                'border-pink-500/30 hover:border-pink-400/50',
                            ];
                            const accent = accentColors[idx % accentColors.length];
                            const postDate = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            return (
                                <Link
                                    key={post.slug}
                                    to={`/blogs/kikis-blog/${post.slug}`}
                                    className="group"
                                >
                                    <article className={`relative bg-slate-900/80 backdrop-blur-sm rounded-2xl border ${accent} overflow-hidden hover:scale-[1.02] transition-all duration-300 h-full flex flex-col shadow-xl`}>
                                        {/* Image */}
                                        <div className="aspect-[16/10] overflow-hidden relative">
                                            <img
                                                src={post.featuredImageUrl || 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800&auto=format&fit=crop'}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {/* Dark gradient overlay on image */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex flex-col flex-1 relative z-10">
                                            <p className="text-slate-500 text-xs font-medium mb-2">{postDate}</p>
                                            <h3 className="font-bold text-white text-lg mb-2 leading-snug group-hover:text-cyan-200 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="mt-auto flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                                                Read More <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                    )}

                    {/* Footer CTA - Meet Kiki style with overlapping image */}
                    <div className="mt-24">
                        <div className="relative">
                            {/* The Card (sits behind) */}
                            <div className="relative lg:mr-[200px] bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 md:p-12 lg:pr-[220px]">
                                {/* Inner glow */}
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                                <div className="relative z-10 space-y-6 max-w-xl">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/50 border border-cyan-500/30 rounded-full">
                                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">✨ Start the Magic</span>
                                    </div>

                                    <h3 className="font-chrome text-5xl md:text-6xl text-white tracking-wide uppercase">
                                        Track the Fairy
                                    </h3>

                                    <p className="text-slate-300 text-lg leading-relaxed">
                                        Create your child's personalized Tooth Fairy experience in seconds.
                                    </p>

                                    <button
                                        onClick={() => navigate('/')}
                                        className="bg-gradient-to-r from-lime-400 to-green-500 text-slate-900 px-8 py-5 rounded-xl font-sans font-extrabold text-lg uppercase tracking-tight shadow-[0_0_30px_rgba(163,230,53,0.4)] hover:shadow-[0_0_40px_rgba(163,230,53,0.6)] transition-all transform hover:-translate-y-1 active:translate-y-1 border-b-[4px] border-green-700 active:border-b-0"
                                    >
                                        Start Tracking
                                    </button>
                                </div>
                            </div>

                            {/* The Image (overlaps the card) */}
                            <div className="lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[350px] mt-4 lg:mt-0 mx-auto max-w-[250px] lg:max-w-none transform lg:rotate-3">
                                {/* Glow behind image */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-400/40 via-teal-400/30 to-cyan-400/40 rounded-[2rem] blur-2xl" />

                                {/* Image Frame */}
                                <div className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl">
                                    <img
                                        src="/Fairy photo booth pic.webp"
                                        alt="Kiki the Tooth Fairy"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Shine overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogListPage;
