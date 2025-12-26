import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Header from './components/Header';
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
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Kiki's Blog - Tooth Fairy Stories & Tips | Kiki the Tooth Fairy";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'Discover magical tooth fairy stories, parenting tips, and traditions on Kiki\'s Blog. Expert advice for making your child\'s tooth fairy experience unforgettable.');
        }
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', 'https://kikithetoothfairy.co/blogs/kikis-blog');
        }
    }, []);

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

    return (
        <div className="min-h-screen bg-[#0a1020] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* === FIXED BACKGROUND (MATCHING LANDING PAGE) === */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />

                {/* Ambient glows - Safari-safe radial gradients (responsive sizing) */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px]" style={{ background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px]" style={{ background: 'radial-gradient(circle, rgba(45, 212, 191, 0.06) 0%, transparent 70%)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] md:w-[900px] md:h-[450px] lg:w-[1200px] lg:h-[600px]" style={{ background: 'radial-gradient(ellipse, rgba(217, 70, 239, 0.04) 0%, transparent 70%)' }} />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            </div>

            <Header />


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
