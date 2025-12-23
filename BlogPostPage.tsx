import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
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

const BlogPostPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [otherPosts, setOtherPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        
        Promise.all([
            fetch(`/api/blog/${slug}`).then(res => res.ok ? res.json() : null),
            fetch('/api/blog').then(res => res.json())
        ]).then(([postData, allPosts]) => {
            if (!postData) {
                setNotFound(true);
            } else {
                setPost(postData);
                setOtherPosts(allPosts.filter((p: BlogPost) => p.slug !== slug).slice(0, 2));
            }
            setLoading(false);
        }).catch(err => {
            console.error('Failed to fetch blog post:', err);
            setNotFound(true);
            setLoading(false);
        });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a1020] flex items-center justify-center text-white">
                <div className="text-center text-slate-400">Loading...</div>
            </div>
        );
    }

    if (notFound || !post) {
        return (
            <div className="min-h-screen bg-[#0a1020] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-chrome mb-4">Story Not Found</h1>
                    <Link to="/blogs/kikis-blog" className="text-cyan-400 hover:underline">Return to Archive</Link>
                </div>
            </div>
        );
    }

    const postDate = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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

            <main className="relative z-10 pt-24 pb-24">
                <div className="container mx-auto max-w-5xl px-4">
                    {/* Back Link */}
                    <Link to="/blogs/kikis-blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-12 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to stories
                    </Link>

                    {/* Article Header */}
                    <div className="mb-16">
                        <h1 className="font-chrome text-5xl md:text-7xl text-white tracking-normal mb-8 leading-[1.1]">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-slate-400 text-sm border-t border-white/5 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg border-2 border-slate-900 shadow-lg">
                                    🧚‍♀️
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">Storyteller</div>
                                    <div className="text-sm font-bold text-white leading-none">Kiki the Tooth Fairy</div>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-white/5 hidden md:block" />
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">Date</div>
                                <div className="text-sm font-bold text-white leading-none">{postDate}</div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.featuredImageUrl && (
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 mb-16 shadow-xl">
                        <img
                            src={post.featuredImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/40 via-transparent to-transparent" />
                    </div>
                    )}

                    {/* Main Content Layout */}
                    <div className="grid lg:grid-cols-[1fr_300px] gap-20">
                        {/* Article Content */}
                        <article className="prose prose-invert prose-cyan max-w-none">
                            <div
                                className="text-white text-lg leading-relaxed font-sans space-y-8"
                                dangerouslySetInnerHTML={{ __html: post.content || '' }}
                            />
                        </article>

                        {/* Sidebar */}
                        <aside className="space-y-16">
                            <div>
                                <h3 className="font-chrome text-xl text-white uppercase mb-8 tracking-wide relative">
                                    Read More
                                    <div className="absolute -bottom-2 left-0 w-12 h-1 bg-cyan-500 rounded-full" />
                                </h3>
                                <div className="space-y-6">
                                    {otherPosts.map((other, idx) => (
                                        <Link key={other.slug} to={`/blogs/kikis-blog/${other.slug}`} className="group block">
                                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group-hover:border-cyan-500/30 mb-3 transition-all bg-slate-800 shadow-lg">
                                                <img src={other.featuredImageUrl || 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800&auto=format&fit=crop'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={other.title} />
                                            </div>
                                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                                                {other.title}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Share / Interaction */}
                            <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-white/10 text-center">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Spread the Magic</p>
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: post.title,
                                                    text: post.excerpt,
                                                    url: window.location.href,
                                                });
                                            } else {
                                                navigator.clipboard.writeText(window.location.href);
                                                alert('Link copied to clipboard!');
                                            }
                                        }}
                                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center text-slate-400 hover:text-white hover:-translate-y-1"
                                        title="Share this article"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert('Link copied to clipboard!');
                                        }}
                                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center text-slate-400 hover:text-white hover:-translate-y-1"
                                        title="Copy link"
                                    >
                                        <Bookmark size={20} />
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>

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

export default BlogPostPage;
