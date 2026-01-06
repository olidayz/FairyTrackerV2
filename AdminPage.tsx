import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Image, Video, Settings, Plus, Trash2, Save, Edit2, X, Mail, LayoutDashboard, Star, HelpCircle, Type, BarChart3, Users, Eye, Send, MousePointer, Award, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import CopyEditor from './components/CopyEditor';
import RichTextEditor from './components/RichTextEditor';

interface LandingHero {
  id?: number;
  headline: string;
  subheadline: string;
  badgeText: string;
  ctaText: string;
  backgroundImageUrl: string;
}

interface FairyUpdate {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  iconType: string;
  sortOrder: number;
  isActive: boolean;
}

interface KikiProfile {
  id?: number;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  stats: string;
}

interface Review {
  id?: number;
  reviewerName: string;
  reviewerLocation: string;
  reviewText: string;
  rating: number;
  photoUrl: string;
  isVerified: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

interface FAQ {
  id?: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

interface CopySection {
  id?: number;
  key: string;
  label: string;
  content: string;
  page: string;
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  status: string;
  publishedAt: string | null;
  metaTitle: string;
  metaDescription: string;
}

interface StageDefinition {
  id: number;
  slug: string;
  label: string;
  dayPart: string;
  orderIndex: number;
}

interface StageContent {
  id: number;
  stageDefinitionId: number;
  videoUrl: string;
  imageUrl: string;
  messageText: string;
  frontImageUrl: string;
  locationText: string;
  statusText: string;
  selfieImageUrl: string;
  title: string;
}

interface EmailTemplate {
  id: number;
  slug: string;
  name: string;
  subject: string;
  preheader: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  ctaUrl: string;
  footerText: string;
}

interface LandingImage {
  id: number;
  key: string;
  label: string;
  description: string | null;
  imageUrl: string | null;
}

interface AnalyticsSummary {
  totalUsers: number;
  totalSessions: number;
  signups7d: number;
  signups30d: number;
  trackerViews7d: number;
  pageViews7d: number;
}

interface SignupsByDay {
  date: string;
  count: number;
}

interface TrackerViewsByDay {
  date: string;
  count: number;
}

interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  openRate: string;
  clickRate: string;
}

interface RecentSignup {
  id: number;
  childName: string;
  email: string;
  generatedAt: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  visitorId: string | null;
}

interface TrafficSources {
  bySource: Array<{ source: string; count: number }>;
  byMedium: Array<{ medium: string; count: number }>;
  byCampaign: Array<{ campaign: string; count: number }>;
}

interface PressLogo {
  id: number;
  name: string;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface VisitorJourneyEvent {
  id: number;
  eventType: string;
  eventData: any;
  source: string | null;
  pagePath: string | null;
  createdAt: string;
}

interface VisitorJourney {
  visitorId: string;
  events: VisitorJourneyEvent[];
  user?: { childName: string; email: string } | null;
  session?: { token: string; createdAt: string } | null;
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'stages' | 'emails' | 'assets' | 'landing' | 'reviews' | 'faqs' | 'copy' | 'images' | 'analytics' | 'press'>('analytics');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [stages, setStages] = useState<StageDefinition[]>([]);
  const [pressLogos, setPressLogos] = useState<PressLogo[]>([]);
  const [editingPressLogo, setEditingPressLogo] = useState<PressLogo | null>(null);
  const [stageContents, setStageContents] = useState<StageContent[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [landingHero, setLandingHero] = useState<LandingHero | null>(null);
  const [fairyUpdates, setFairyUpdates] = useState<FairyUpdate[]>([]);
  const [kikiProfile, setKikiProfile] = useState<KikiProfile | null>(null);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [faqsList, setFaqsList] = useState<FAQ[]>([]);
  const [copySections, setCopySections] = useState<CopySection[]>([]);
  const [landingImagesList, setLandingImagesList] = useState<LandingImage[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [importingSeo, setImportingSeo] = useState(false);
  const [signupsByDay, setSignupsByDay] = useState<SignupsByDay[]>([]);
  const [trackerViewsByDay, setTrackerViewsByDay] = useState<TrackerViewsByDay[]>([]);
  const [emailMetrics, setEmailMetrics] = useState<EmailMetrics | null>(null);
  const [recentSignups, setRecentSignups] = useState<RecentSignup[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSources | null>(null);
  const [selectedVisitorJourney, setSelectedVisitorJourney] = useState<VisitorJourney | null>(null);
  const [loadingJourney, setLoadingJourney] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingStage, setEditingStage] = useState<{ stage: StageDefinition; content: StageContent | null } | null>(null);
  const [editingEmail, setEditingEmail] = useState<EmailTemplate | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingCopy, setEditingCopy] = useState<CopySection | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const adminToken = localStorage.getItem('adminToken');

  const handleLogin = () => {
    localStorage.setItem('adminToken', password);
    setIsAuthenticated(true);
    setAuthError('');
  };

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken || password}`,
  });

  useEffect(() => {
    if (adminToken) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'blog') {
        const res = await fetch('/api/admin/blog-posts', { headers: getAuthHeaders() });
        if (res.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('adminToken');
          setAuthError('Invalid password');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setBlogPosts(data);
        }
      } else if (activeTab === 'stages') {
        const [stagesRes, contentRes] = await Promise.all([
          fetch('/api/admin/stages', { headers: getAuthHeaders() }),
          fetch('/api/admin/stage-content', { headers: getAuthHeaders() })
        ]);
        if (stagesRes.ok) setStages(await stagesRes.json());
        if (contentRes.ok) setStageContents(await contentRes.json());
      } else if (activeTab === 'emails') {
        const res = await fetch('/api/admin/email-templates', { headers: getAuthHeaders() });
        if (res.ok) setEmailTemplates(await res.json());
      } else if (activeTab === 'landing') {
        const [heroRes, updatesRes, profileRes] = await Promise.all([
          fetch('/api/admin/landing-hero', { headers: getAuthHeaders() }),
          fetch('/api/admin/fairy-updates', { headers: getAuthHeaders() }),
          fetch('/api/admin/kiki-profile', { headers: getAuthHeaders() })
        ]);
        if (heroRes.ok) setLandingHero(await heroRes.json());
        if (updatesRes.ok) setFairyUpdates(await updatesRes.json());
        if (profileRes.ok) setKikiProfile(await profileRes.json());
      } else if (activeTab === 'reviews') {
        const res = await fetch('/api/admin/reviews', { headers: getAuthHeaders() });
        if (res.ok) setReviewsList(await res.json());
      } else if (activeTab === 'faqs') {
        const res = await fetch('/api/admin/faqs', { headers: getAuthHeaders() });
        if (res.ok) setFaqsList(await res.json());
      } else if (activeTab === 'copy') {
        const res = await fetch('/api/admin/copy-sections', { headers: getAuthHeaders() });
        if (res.ok) setCopySections(await res.json());
      } else if (activeTab === 'images') {
        const res = await fetch('/api/admin/landing-images', { headers: getAuthHeaders() });
        if (res.ok) setLandingImagesList(await res.json());
      } else if (activeTab === 'press') {
        const res = await fetch('/api/admin/press-logos', { headers: getAuthHeaders() });
        if (res.ok) setPressLogos(await res.json());
      } else if (activeTab === 'analytics') {
        const [summaryRes, signupsRes, viewsRes, emailRes, recentRes, sourcesRes] = await Promise.all([
          fetch('/api/admin/analytics/summary', { headers: getAuthHeaders() }),
          fetch('/api/admin/analytics/signups-by-day', { headers: getAuthHeaders() }),
          fetch('/api/admin/analytics/tracker-views-by-day', { headers: getAuthHeaders() }),
          fetch('/api/admin/analytics/email-metrics', { headers: getAuthHeaders() }),
          fetch('/api/admin/analytics/recent-signups', { headers: getAuthHeaders() }),
          fetch('/api/admin/analytics/traffic-sources', { headers: getAuthHeaders() })
        ]);
        if (summaryRes.ok) setAnalyticsSummary(await summaryRes.json());
        if (signupsRes.ok) setSignupsByDay(await signupsRes.json());
        if (viewsRes.ok) setTrackerViewsByDay(await viewsRes.json());
        if (emailRes.ok) setEmailMetrics(await emailRes.json());
        if (recentRes.ok) setRecentSignups(await recentRes.json());
        if (sourcesRes.ok) setTrafficSources(await sourcesRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitorJourney = async (visitorId: string) => {
    if (!visitorId) return;
    setLoadingJourney(true);
    try {
      const res = await fetch(`/api/admin/visitor-journey/${visitorId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedVisitorJourney(data);
      }
    } catch (error) {
      console.error('Failed to fetch visitor journey:', error);
    } finally {
      setLoadingJourney(false);
    }
  };

  const saveBlogPost = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/blog-posts${post.id ? `/${post.id}` : ''}`, {
        method: post.id ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(post),
      });
      if (res.ok) {
        setEditingPost(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save blog post:', error);
    }
  };

  const deleteBlogPost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/admin/blog-posts/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Failed to delete blog post:', error);
    }
  };

  const saveStageContent = async (stageId: number, content: Partial<StageContent>) => {
    try {
      const res = await fetch(`/api/admin/stage-content/${stageId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setEditingStage(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save stage content:', error);
    }
  };

  const saveEmailTemplate = async (template: EmailTemplate) => {
    try {
      const res = await fetch(`/api/admin/email-templates${template.id ? `/${template.id}` : ''}`, {
        method: template.id ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(template),
      });
      if (res.ok) {
        setEditingEmail(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save email template:', error);
    }
  };

  const deleteEmailTemplate = async (id: number) => {
    if (!confirm('Are you sure you want to delete this email template?')) return;
    try {
      const res = await fetch(`/api/admin/email-templates/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Failed to delete email template:', error);
    }
  };

  const saveLandingHero = async (hero: LandingHero) => {
    try {
      const res = await fetch('/api/admin/landing-hero', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(hero),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Failed to save landing hero:', error);
    }
  };

  const saveKikiProfile = async (profile: KikiProfile) => {
    try {
      const res = await fetch('/api/admin/kiki-profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profile),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Failed to save Kiki profile:', error);
    }
  };

  const saveReview = async (review: Review) => {
    try {
      const res = await fetch(`/api/admin/reviews${review.id ? `/${review.id}` : ''}`, {
        method: review.id ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(review),
      });
      if (res.ok) {
        setEditingReview(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save review:', error);
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const saveFaq = async (faq: FAQ) => {
    try {
      const res = await fetch(`/api/admin/faqs${faq.id ? `/${faq.id}` : ''}`, {
        method: faq.id ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(faq),
      });
      if (res.ok) {
        setEditingFaq(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save FAQ:', error);
    }
  };

  const deleteFaq = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
    }
  };

  const saveCopySection = async (section: CopySection) => {
    try {
      const res = await fetch(`/api/admin/copy-sections${section.id ? `/${section.id}` : ''}`, {
        method: section.id ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(section),
      });
      if (res.ok) {
        setEditingCopy(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save copy section:', error);
    }
  };

  const deleteCopySection = async (id: number) => {
    if (!confirm('Are you sure you want to delete this copy section?')) return;
    try {
      const res = await fetch(`/api/admin/copy-sections/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Failed to delete copy section:', error);
    }
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'stages', label: 'Stage Content', icon: Video },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'landing', label: 'Landing Hero', icon: LayoutDashboard },
    { id: 'images', label: 'Site Images', icon: Image },
    { id: 'press', label: 'Press Logos', icon: Award },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'copy', label: 'Copy Sections', icon: Type },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {authError && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
              {authError}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="Enter admin password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </div>
          <p className="text-center text-slate-500 text-sm mt-4">
            <Link to="/" className="text-cyan-400 hover:text-cyan-300">Back to home</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold">Admin / CMS</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { localStorage.removeItem('adminToken'); setIsAuthenticated(false); }}
              className="text-sm text-slate-400 hover:text-white"
            >
              Logout
            </button>
            <Settings className="text-slate-400" size={20} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : activeTab === 'blog' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Blog Posts</h2>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (!confirm('Import SEO meta titles and descriptions from Shopify? This will update any matching blog posts.')) return;
                    setImportingSeo(true);
                    try {
                      const res = await fetch('/api/admin/import-shopify-blog-seo', {
                        method: 'POST',
                        headers: getAuthHeaders(),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        alert(data.message);
                        fetchData();
                      } else {
                        alert(data.error || 'Failed to import');
                      }
                    } catch (error) {
                      alert('Failed to import SEO from Shopify');
                    } finally {
                      setImportingSeo(false);
                    }
                  }}
                  disabled={importingSeo}
                  className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-slate-600 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  {importingSeo ? 'Importing...' : 'Import SEO from Shopify'}
                </button>
                <button
                  onClick={() => setEditingPost({ id: 0, slug: '', title: '', excerpt: '', content: '', featuredImageUrl: '', status: 'draft', publishedAt: null, metaTitle: '', metaDescription: '' })}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  New Post
                </button>
              </div>
            </div>

            {editingPost && (
              <BlogPostEditor
                post={editingPost}
                onSave={saveBlogPost}
                onCancel={() => setEditingPost(null)}
              />
            )}

            <div className="grid gap-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-slate-400">/{post.slug} - {post.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingPost(post)} className="p-2 text-slate-400 hover:text-white">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteBlogPost(post.id)} className="p-2 text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {blogPosts.length === 0 && (
                <p className="text-center py-8 text-slate-500">No blog posts yet. Create your first post!</p>
              )}
            </div>
          </div>
        ) : activeTab === 'stages' ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Stage Content</h2>
            
            {editingStage && (
              <StageContentEditor
                stage={editingStage.stage}
                content={editingStage.content}
                onSave={(content) => saveStageContent(editingStage.stage.id, content)}
                onCancel={() => setEditingStage(null)}
              />
            )}

            <div className="grid gap-4">
              {stages.map((stage) => {
                const content = stageContents.find(c => c.stageDefinitionId === stage.id);
                return (
                  <div key={stage.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{stage.label}</h3>
                      <p className="text-sm text-slate-400">{stage.dayPart} - Order: {stage.orderIndex}</p>
                      {content && (
                        <p className="text-xs text-cyan-400 mt-1">Has content</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingStage({ stage, content: content || null })}
                      className="p-2 text-slate-400 hover:text-white"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                );
              })}
              {stages.length === 0 && (
                <p className="text-center py-8 text-slate-500">No stage definitions found.</p>
              )}
            </div>
          </div>
        ) : activeTab === 'emails' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Email Templates</h2>
              <div className="flex gap-2">
                <Link
                  to="/emails"
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Preview Emails
                </Link>
                <button
                  onClick={() => setEditingEmail({ id: 0, slug: '', name: '', subject: '', preheader: '', headline: '', bodyText: '', ctaText: '', ctaUrl: '', footerText: '' })}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  New Template
                </button>
              </div>
            </div>

            {editingEmail && (
              <EmailTemplateEditor
                template={editingEmail}
                onSave={saveEmailTemplate}
                onCancel={() => setEditingEmail(null)}
              />
            )}

            <div className="grid gap-4">
              {emailTemplates.map((template) => (
                <div key={template.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-slate-400">Subject: {template.subject}</p>
                    <p className="text-xs text-cyan-400 mt-1">Slug: {template.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingEmail(template)} className="p-2 text-slate-400 hover:text-white">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteEmailTemplate(template.id)} className="p-2 text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {emailTemplates.length === 0 && (
                <p className="text-center py-8 text-slate-500">No email templates yet. Create your first template!</p>
              )}
            </div>
          </div>
        ) : activeTab === 'landing' ? (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Landing Page Content</h2>
            
            {/* Hero Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="font-medium mb-4">Hero Section</h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Headline</label>
                  <input
                    type="text"
                    value={landingHero?.headline || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLandingHero(prev => ({ headline: val, subheadline: prev?.subheadline || '', badgeText: prev?.badgeText || '', ctaText: prev?.ctaText || '', backgroundImageUrl: prev?.backgroundImageUrl || '' }));
                    }}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    placeholder="Main headline text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subheadline</label>
                  <textarea
                    value={landingHero?.subheadline || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLandingHero(prev => ({ headline: prev?.headline || '', subheadline: val, badgeText: prev?.badgeText || '', ctaText: prev?.ctaText || '', backgroundImageUrl: prev?.backgroundImageUrl || '' }));
                    }}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    rows={2}
                    placeholder="Supporting text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={landingHero?.badgeText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLandingHero(prev => ({ headline: prev?.headline || '', subheadline: prev?.subheadline || '', badgeText: val, ctaText: prev?.ctaText || '', backgroundImageUrl: prev?.backgroundImageUrl || '' }));
                      }}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      placeholder="FREE TRACKER"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={landingHero?.ctaText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLandingHero(prev => ({ headline: prev?.headline || '', subheadline: prev?.subheadline || '', badgeText: prev?.badgeText || '', ctaText: val, backgroundImageUrl: prev?.backgroundImageUrl || '' }));
                      }}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      placeholder="Start Tracking Now"
                    />
                  </div>
                </div>
                <button
                  onClick={() => saveLandingHero(landingHero || { headline: '', subheadline: '', badgeText: '', ctaText: '', backgroundImageUrl: '' })}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors w-fit"
                >
                  <Save size={18} className="inline mr-2" />
                  Save Hero
                </button>
              </div>
            </div>

            {/* Kiki Profile */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="font-medium mb-4">Meet Kiki - Profile</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={kikiProfile?.name || 'Kiki'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setKikiProfile(prev => ({ name: val, title: prev?.title || '', bio: prev?.bio || '', photoUrl: prev?.photoUrl || '', stats: prev?.stats || '' }));
                      }}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={kikiProfile?.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setKikiProfile(prev => ({ name: prev?.name || 'Kiki', title: val, bio: prev?.bio || '', photoUrl: prev?.photoUrl || '', stats: prev?.stats || '' }));
                      }}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      placeholder="Professional Tooth Fairy"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    value={kikiProfile?.bio || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setKikiProfile(prev => ({ name: prev?.name || 'Kiki', title: prev?.title || '', bio: val, photoUrl: prev?.photoUrl || '', stats: prev?.stats || '' }));
                    }}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    rows={3}
                    placeholder="Kiki's story..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Photo URL</label>
                  <input
                    type="text"
                    value={kikiProfile?.photoUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setKikiProfile(prev => ({ name: prev?.name || 'Kiki', title: prev?.title || '', bio: prev?.bio || '', photoUrl: val, stats: prev?.stats || '' }));
                    }}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    placeholder="/kiki-photo.png"
                  />
                </div>
                <button
                  onClick={() => saveKikiProfile(kikiProfile || { name: 'Kiki', title: '', bio: '', photoUrl: '', stats: '' })}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors w-fit"
                >
                  <Save size={18} className="inline mr-2" />
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'reviews' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Customer Reviews</h2>
              <button
                onClick={() => setEditingReview({ reviewerName: '', reviewerLocation: '', reviewText: '', rating: 5, photoUrl: '', isVerified: false, isFeatured: false, sortOrder: 0 })}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
              >
                <Plus size={18} />
                New Review
              </button>
            </div>

            {editingReview && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{editingReview.id ? 'Edit Review' : 'New Review'}</h3>
                  <button onClick={() => setEditingReview(null)} className="text-slate-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Reviewer Name</label>
                      <input
                        type="text"
                        value={editingReview.reviewerName}
                        onChange={(e) => setEditingReview({ ...editingReview, reviewerName: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <input
                        type="text"
                        value={editingReview.reviewerLocation}
                        onChange={(e) => setEditingReview({ ...editingReview, reviewerLocation: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                        placeholder="New York, USA"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Review Text</label>
                    <textarea
                      value={editingReview.reviewText}
                      onChange={(e) => setEditingReview({ ...editingReview, reviewText: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={editingReview.rating}
                        onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Sort Order</label>
                      <input
                        type="number"
                        value={editingReview.sortOrder}
                        onChange={(e) => setEditingReview({ ...editingReview, sortOrder: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Reviewer Photo</label>
                      <div className="flex items-center gap-3">
                        {editingReview.photoUrl && (
                          <img 
                            src={editingReview.photoUrl} 
                            alt="Reviewer" 
                            className="w-12 h-12 rounded-full object-cover border border-slate-600"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const urlRes = await fetch('/api/uploads/request-url', {
                                method: 'POST',
                                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                                body: JSON.stringify({ name: file.name, contentType: file.type }),
                              });
                              if (!urlRes.ok) throw new Error('Failed to get upload URL');
                              const { uploadURL, objectPath } = await urlRes.json();
                              const uploadRes = await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                              if (!uploadRes.ok) throw new Error('Failed to upload');
                              setEditingReview(prev => prev ? { ...prev, photoUrl: objectPath } : prev);
                            } catch (error) {
                              console.error('Photo upload failed:', error);
                              alert('Failed to upload photo');
                            }
                          }}
                          className="text-sm text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white file:cursor-pointer hover:file:bg-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingReview.isVerified}
                        onChange={(e) => setEditingReview({ ...editingReview, isVerified: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Verified</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingReview.isFeatured}
                        onChange={(e) => setEditingReview({ ...editingReview, isFeatured: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                  <button
                    onClick={() => saveReview(editingReview)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors w-fit"
                  >
                    <Save size={18} />
                    Save Review
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {reviewsList.map((review) => (
                <div key={review.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{review.reviewerName}</h3>
                    <p className="text-sm text-slate-400">{review.reviewerLocation} - {'⭐'.repeat(review.rating)}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{review.reviewText}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingReview(review)} className="p-2 text-slate-400 hover:text-white">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => review.id && deleteReview(review.id)} className="p-2 text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {reviewsList.length === 0 && (
                <p className="text-center py-8 text-slate-500">No reviews yet. Add your first review!</p>
              )}
            </div>
          </div>
        ) : activeTab === 'faqs' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">FAQs</h2>
              <button
                onClick={() => setEditingFaq({ question: '', answer: '', category: '', sortOrder: 0, isActive: true })}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
              >
                <Plus size={18} />
                New FAQ
              </button>
            </div>

            {editingFaq && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{editingFaq.id ? 'Edit FAQ' : 'New FAQ'}</h3>
                  <button onClick={() => setEditingFaq(null)} className="text-slate-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Question</label>
                    <input
                      type="text"
                      value={editingFaq.question}
                      onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Answer</label>
                    <textarea
                      value={editingFaq.answer}
                      onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <input
                        type="text"
                        value={editingFaq.category}
                        onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                        placeholder="General"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Sort Order</label>
                      <input
                        type="number"
                        value={editingFaq.sortOrder}
                        onChange={(e) => setEditingFaq({ ...editingFaq, sortOrder: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingFaq.isActive}
                          onChange={(e) => setEditingFaq({ ...editingFaq, isActive: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Active</span>
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => saveFaq(editingFaq)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors w-fit"
                  >
                    <Save size={18} />
                    Save FAQ
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {faqsList.map((faq) => (
                <div key={faq.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{faq.question}</h3>
                    <p className="text-sm text-slate-400 line-clamp-1">{faq.answer}</p>
                    <div className="flex gap-2 mt-1">
                      {faq.category && <span className="text-xs bg-slate-800 px-2 py-0.5 rounded">{faq.category}</span>}
                      <span className={`text-xs ${faq.isActive ? 'text-green-400' : 'text-red-400'}`}>
                        {faq.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingFaq(faq)} className="p-2 text-slate-400 hover:text-white">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => faq.id && deleteFaq(faq.id)} className="p-2 text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {faqsList.length === 0 && (
                <p className="text-center py-8 text-slate-500">No FAQs yet. Add your first FAQ!</p>
              )}
            </div>
          </div>
        ) : activeTab === 'copy' ? (
          <CopyEditor authHeaders={getAuthHeaders()} />
        ) : activeTab === 'images' ? (
          <LandingImagesEditor 
            images={landingImagesList} 
            onSave={async (id, imageUrl, mediaType) => {
              try {
                const res = await fetch(`/api/admin/landing-images/${id}`, {
                  method: 'PUT',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({ imageUrl, mediaType }),
                });
                if (res.ok) fetchData();
              } catch (error) {
                console.error('Failed to update image:', error);
              }
            }}
            onTitleSave={async (id, title) => {
              try {
                const res = await fetch(`/api/admin/landing-images/${id}`, {
                  method: 'PUT',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({ title }),
                });
                if (res.ok) fetchData();
              } catch (error) {
                console.error('Failed to update title:', error);
              }
            }}
            getAuthHeaders={getAuthHeaders}
          />
        ) : activeTab === 'press' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Press Logos</h2>
              <button
                onClick={() => setEditingPressLogo({ id: 0, name: '', imageUrl: '', linkUrl: null, sortOrder: pressLogos.length, isActive: true })}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors"
              >
                <Plus size={18} />
                Add Logo
              </button>
            </div>
            
            {editingPressLogo && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{editingPressLogo.id ? 'Edit Logo' : 'Add Logo'}</h3>
                  <button onClick={() => setEditingPressLogo(null)} className="text-slate-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={editingPressLogo.name}
                      onChange={(e) => setEditingPressLogo({ ...editingPressLogo, name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      placeholder="e.g., Forbes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Logo Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingPressLogo.imageUrl}
                        onChange={(e) => setEditingPressLogo({ ...editingPressLogo, imageUrl: e.target.value })}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                        placeholder="Image URL or upload"
                      />
                      <label className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const urlRes = await fetch('/api/uploads/request-url', {
                                method: 'POST',
                                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                                body: JSON.stringify({ name: file.name, contentType: file.type }),
                              });
                              if (!urlRes.ok) throw new Error('Failed to get upload URL');
                              const { uploadURL, objectPath } = await urlRes.json();
                              const uploadRes = await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                              if (!uploadRes.ok) throw new Error('Failed to upload');
                              setEditingPressLogo(prev => prev ? { ...prev, imageUrl: objectPath } : prev);
                            } catch (error) {
                              console.error('Logo upload failed:', error);
                              alert('Failed to upload logo');
                            }
                          }}
                        />
                      </label>
                    </div>
                    {editingPressLogo.imageUrl && (
                      <div className="mt-2 p-2 bg-slate-800 rounded inline-block">
                        <img src={editingPressLogo.imageUrl} alt="Preview" className="h-8 object-contain" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Link URL (optional)</label>
                    <input
                      type="text"
                      value={editingPressLogo.linkUrl || ''}
                      onChange={(e) => setEditingPressLogo({ ...editingPressLogo, linkUrl: e.target.value || null })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      placeholder="https://forbes.com/article-about-us"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={editingPressLogo.sortOrder}
                      onChange={(e) => setEditingPressLogo({ ...editingPressLogo, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingPressLogo.isActive}
                    onChange={(e) => setEditingPressLogo({ ...editingPressLogo, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm">Active (visible on site)</label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const method = editingPressLogo.id ? 'PUT' : 'POST';
                        const url = editingPressLogo.id 
                          ? `/api/admin/press-logos/${editingPressLogo.id}` 
                          : '/api/admin/press-logos';
                        const res = await fetch(url, {
                          method,
                          headers: getAuthHeaders(),
                          body: JSON.stringify(editingPressLogo),
                        });
                        if (res.ok) {
                          setEditingPressLogo(null);
                          fetchData();
                        }
                      } catch (error) {
                        console.error('Failed to save press logo:', error);
                      }
                    }}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPressLogo(null)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pressLogos.map((logo) => (
                <div key={logo.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-10 bg-slate-800 rounded flex items-center justify-center">
                      <img src={logo.imageUrl} alt={logo.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{logo.name}</p>
                      <p className={`text-xs ${logo.isActive ? 'text-green-400' : 'text-slate-500'}`}>
                        {logo.isActive ? 'Active' : 'Hidden'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPressLogo(logo)}
                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm('Delete this logo?')) return;
                          try {
                            const res = await fetch(`/api/admin/press-logos/${logo.id}`, {
                              method: 'DELETE',
                              headers: getAuthHeaders(),
                            });
                            if (res.ok) fetchData();
                          } catch (error) {
                            console.error('Failed to delete press logo:', error);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {pressLogos.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                No press logos yet. Add one to get started.
              </div>
            )}
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Users size={18} />
                  <span className="text-sm">Total Users</span>
                </div>
                <p className="text-2xl font-bold">{analyticsSummary?.totalUsers || 0}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Eye size={18} />
                  <span className="text-sm">Tracker Sessions</span>
                </div>
                <p className="text-2xl font-bold">{analyticsSummary?.totalSessions || 0}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Users size={18} />
                  <span className="text-sm">Signups (7d)</span>
                </div>
                <p className="text-2xl font-bold text-cyan-400">{analyticsSummary?.signups7d || 0}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Eye size={18} />
                  <span className="text-sm">Tracker Views (7d)</span>
                </div>
                <p className="text-2xl font-bold text-cyan-400">{analyticsSummary?.trackerViews7d || 0}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Eye size={18} />
                  <span className="text-sm">Page Views (7d)</span>
                </div>
                <p className="text-2xl font-bold text-fuchsia-400">{analyticsSummary?.pageViews7d || 0}</p>
              </div>
            </div>

            {/* Email Metrics */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Send size={20} />
                Email Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Sent</p>
                  <p className="text-xl font-bold">{emailMetrics?.sent || 0}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Delivered</p>
                  <p className="text-xl font-bold">{emailMetrics?.delivered || 0}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Opened</p>
                  <p className="text-xl font-bold text-green-400">{emailMetrics?.opened || 0}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Clicked</p>
                  <p className="text-xl font-bold text-cyan-400">{emailMetrics?.clicked || 0}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Open Rate</p>
                  <p className="text-xl font-bold">{emailMetrics?.openRate || '0%'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Click Rate</p>
                  <p className="text-xl font-bold">{emailMetrics?.clickRate || '0%'}</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Signups Chart */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Signups (Last 30 Days)</h3>
                <div className="h-48 flex items-end gap-1">
                  {signupsByDay.slice(-30).map((day, i) => {
                    const maxCount = Math.max(...signupsByDay.map(d => d.count), 1);
                    const height = (day.count / maxCount) * 100;
                    return (
                      <div 
                        key={i}
                        className="flex-1 bg-cyan-500 rounded-t hover:bg-cyan-400 transition-colors relative group"
                        style={{ height: `${Math.max(height, 2)}%` }}
                        title={`${day.date}: ${day.count} signups`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.date}: {day.count}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-slate-400 text-sm mt-2">Last 30 days</p>
              </div>

              {/* Tracker Views Chart */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Tracker Views (Last 30 Days)</h3>
                <div className="h-48 flex items-end gap-1">
                  {trackerViewsByDay.slice(-30).map((day, i) => {
                    const maxCount = Math.max(...trackerViewsByDay.map(d => d.count), 1);
                    const height = (day.count / maxCount) * 100;
                    return (
                      <div 
                        key={i}
                        className="flex-1 bg-fuchsia-500 rounded-t hover:bg-fuchsia-400 transition-colors relative group"
                        style={{ height: `${Math.max(height, 2)}%` }}
                        title={`${day.date}: ${day.count} views`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.date}: {day.count}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-slate-400 text-sm mt-2">Last 30 days</p>
              </div>
            </div>

            {/* Traffic Sources */}
            {trafficSources && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Traffic Sources (Last 30 Days)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-3">By Source</h4>
                    <div className="space-y-2">
                      {trafficSources.bySource.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-sm">{item.source}</span>
                          <span className="text-sm font-medium text-cyan-400">{item.count}</span>
                        </div>
                      ))}
                      {trafficSources.bySource.length === 0 && (
                        <p className="text-slate-500 text-sm">No data</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-3">By Medium</h4>
                    <div className="space-y-2">
                      {trafficSources.byMedium.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-sm">{item.medium}</span>
                          <span className="text-sm font-medium text-fuchsia-400">{item.count}</span>
                        </div>
                      ))}
                      {trafficSources.byMedium.length === 0 && (
                        <p className="text-slate-500 text-sm">No data</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-3">By Campaign</h4>
                    <div className="space-y-2">
                      {trafficSources.byCampaign.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-sm">{item.campaign}</span>
                          <span className="text-sm font-medium text-amber-400">{item.count}</span>
                        </div>
                      ))}
                      {trafficSources.byCampaign.length === 0 && (
                        <p className="text-slate-500 text-sm">No data</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Signups Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Signups</h3>
              <p className="text-slate-400 text-sm mb-4">Click on a row to view the visitor's journey</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-2 px-4 text-slate-400 font-medium">Child Name</th>
                      <th className="py-2 px-4 text-slate-400 font-medium">Parent Email</th>
                      <th className="py-2 px-4 text-slate-400 font-medium">Source</th>
                      <th className="py-2 px-4 text-slate-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSignups.map((signup) => (
                      <tr 
                        key={signup.id} 
                        className={`border-b border-slate-800 hover:bg-slate-800/50 ${signup.visitorId ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                        onClick={() => signup.visitorId && fetchVisitorJourney(signup.visitorId)}
                      >
                        <td className="py-2 px-4">{signup.childName}</td>
                        <td className="py-2 px-4 text-slate-400">{signup.email}</td>
                        <td className="py-2 px-4">
                          {signup.utmSource ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/20 text-cyan-300">
                              {signup.utmSource}
                              {signup.utmMedium && <span className="text-slate-500 ml-1">/ {signup.utmMedium}</span>}
                            </span>
                          ) : (
                            <span className="text-slate-500">Direct</span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-slate-400">
                          {new Date(signup.generatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {recentSignups.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          No signups yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visitor Journey Modal */}
            {(selectedVisitorJourney || loadingJourney) && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold">Visitor Journey</h3>
                    <button 
                      onClick={() => setSelectedVisitorJourney(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {loadingJourney ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-4 text-slate-400">Loading journey...</p>
                    </div>
                  ) : selectedVisitorJourney && (
                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                      {selectedVisitorJourney.user && (
                        <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                          <p className="text-sm text-slate-400">Converted User</p>
                          <p className="font-medium">{selectedVisitorJourney.user.childName}</p>
                          <p className="text-slate-400 text-sm">{selectedVisitorJourney.user.email}</p>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {selectedVisitorJourney.events.length === 0 ? (
                          <p className="text-slate-500 text-center py-4">No events recorded for this visitor</p>
                        ) : (
                          selectedVisitorJourney.events.map((event) => (
                            <div key={event.id} className="flex gap-3 p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-cyan-500"></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    event.eventType === 'signup' ? 'bg-green-500/20 text-green-300' :
                                    event.eventType === 'page_view' ? 'bg-blue-500/20 text-blue-300' :
                                    event.eventType === 'cta_click' ? 'bg-amber-500/20 text-amber-300' :
                                    'bg-slate-500/20 text-slate-300'
                                  }`}>
                                    {event.eventType.replace(/_/g, ' ')}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(event.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                {event.pagePath && (
                                  <p className="text-sm text-slate-400 mt-1">{event.pagePath}</p>
                                )}
                                {event.source && (
                                  <p className="text-xs text-slate-500 mt-1">Source: {event.source}</p>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Site Assets</h2>
            <p className="text-slate-400">Asset management coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BlogPostEditor = ({ post, onSave, onCancel }: { post: BlogPost; onSave: (post: BlogPost) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState(post);

  useEffect(() => {
    setFormData(post);
  }, [post.id]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{post.id ? 'Edit Post' : 'New Post'}</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <RichTextEditor
            content={formData.content}
            onChange={(html) => setFormData({ ...formData, content: html })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Featured Image URL</label>
          <input
            type="text"
            value={formData.featuredImageUrl}
            onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="border-t border-slate-700 pt-4 mt-4">
          <h4 className="text-md font-medium mb-3">Search engine listing</h4>
          <p className="text-sm text-slate-400 mb-4">Add a title and description to see how this blog post might appear in a search engine listing</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Page title</label>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value.slice(0, 70) })}
                maxLength={70}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="Enter SEO page title"
              />
              <p className="text-xs text-slate-500 mt-1">{(formData.metaTitle || '').length} of 70 characters used</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Meta description</label>
              <textarea
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value.slice(0, 160) })}
                maxLength={160}
                rows={3}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="Enter SEO meta description"
              />
              <p className="text-xs text-slate-500 mt-1">{(formData.metaDescription || '').length} of 160 characters used</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL handle</label>
              <div className="flex items-center">
                <span className="text-slate-400 text-sm mr-2">blogs/kikis-blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
        >
          <Save size={18} />
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const EmailTemplateEditor = ({ template, onSave, onCancel }: { template: EmailTemplate; onSave: (template: EmailTemplate) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState(template);

  useEffect(() => {
    setFormData(template);
  }, [template.id]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{template.id ? 'Edit Email Template' : 'New Email Template'}</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Template Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="e.g., Tracking Link Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug (unique identifier)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="e.g., tracking-link"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject Line</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="e.g., It's Happening! Track Kiki Live"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preheader (preview text)</label>
          <input
            type="text"
            value={formData.preheader || ''}
            onChange={(e) => setFormData({ ...formData, preheader: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="Short preview text shown in inbox"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Headline</label>
          <input
            type="text"
            value={formData.headline || ''}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="Main headline in email body"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body Text</label>
          <textarea
            value={formData.bodyText || ''}
            onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="Main email content. Use {{child_name}} and {{tracker_url}} as placeholders."
          />
          <p className="text-xs text-slate-500 mt-1">Available variables: {"{{child_name}}"}, {"{{tracker_url}}"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">CTA Button Text</label>
            <input
              type="text"
              value={formData.ctaText || ''}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="e.g., Track Kiki Live"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA URL</label>
            <input
              type="text"
              value={formData.ctaUrl || ''}
              onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="e.g., {{tracker_url}}"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Footer Text</label>
          <textarea
            value={formData.footerText || ''}
            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="Footer content (use | to separate lines)"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
        >
          <Save size={18} />
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const StageContentEditor = ({ stage, content, onSave, onCancel }: { 
  stage: StageDefinition; 
  content: StageContent | null; 
  onSave: (content: Partial<StageContent>) => void; 
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    videoUrl: content?.videoUrl || '',
    imageUrl: content?.imageUrl || '',
    messageText: content?.messageText || '',
    frontImageUrl: content?.frontImageUrl || '',
    locationText: content?.locationText || '',
    statusText: content?.statusText || '',
    selfieImageUrl: content?.selfieImageUrl || '',
    title: content?.title || '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSelfieUploading, setIsSelfieUploading] = useState(false);

  useEffect(() => {
    setFormData({
      videoUrl: content?.videoUrl || '',
      imageUrl: content?.imageUrl || '',
      messageText: content?.messageText || '',
      frontImageUrl: content?.frontImageUrl || '',
      locationText: content?.locationText || '',
      statusText: content?.statusText || '',
      selfieImageUrl: content?.selfieImageUrl || '',
      title: content?.title || '',
    });
  }, [stage.id, content]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const response = await fetch('/api/uploads/request-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });
      const { uploadURL, objectPath } = await response.json();
      
      await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      
      setFormData({ ...formData, frontImageUrl: objectPath });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Edit Content: {stage.label}</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="grid gap-4">
        <div className="p-4 bg-slate-800/50 border border-cyan-500/30 rounded-lg">
          <h4 className="text-sm font-semibold text-cyan-400 mb-3">Front Card Content</h4>
          <div className="grid gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Stage Title (Front of Card)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="e.g. ADVENTURE BEGINS"
              />
              <p className="text-xs text-slate-400 mt-1">This title appears on the front of the card and on the landing page</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Front Card Image</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={formData.frontImageUrl}
                  onChange={(e) => setFormData({ ...formData, frontImageUrl: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                  placeholder="Image URL or upload below"
                />
                <label className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${isUploading ? 'bg-slate-600' : 'bg-fuchsia-600 hover:bg-fuchsia-700'}`}>
                  {isUploading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*,video/webm,video/mp4,video/quicktime"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
              {formData.frontImageUrl && (
                <div className="mt-2">
                  {formData.frontImageUrl.endsWith('.webm') || formData.frontImageUrl.endsWith('.mp4') || formData.frontImageUrl.endsWith('.mov') ? (
                    <video src={formData.frontImageUrl} className="h-20 w-20 object-cover rounded-lg border border-slate-600" muted autoPlay loop playsInline />
                  ) : (
                    <img src={formData.frontImageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-slate-600" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Location (Back of Card)</label>
            <input
              type="text"
              value={formData.locationText}
              onChange={(e) => setFormData({ ...formData, locationText: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="e.g. North Star Portal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status (Back of Card)</label>
            <input
              type="text"
              value={formData.statusText}
              onChange={(e) => setFormData({ ...formData, statusText: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="e.g. En Route"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Video (Back of Card)</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Video URL or upload below"
            />
            <label className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${isUploading ? 'bg-slate-600' : 'bg-fuchsia-600 hover:bg-fuchsia-700'}`}>
              {isUploading ? 'Uploading...' : 'Upload Video'}
              <input
                type="file"
                accept="video/webm,video/mp4,video/quicktime"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploading(true);
                  try {
                    const urlRes = await fetch('/api/uploads/request-url', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
                    });
                    if (!urlRes.ok) throw new Error('Failed to get upload URL');
                    const { uploadURL, objectPath } = await urlRes.json();
                    const uploadRes = await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                    if (!uploadRes.ok) throw new Error('Failed to upload');
                    setFormData({ ...formData, videoUrl: objectPath });
                  } catch (error) {
                    console.error('Video upload failed:', error);
                    alert('Failed to upload video');
                  } finally {
                    setIsUploading(false);
                  }
                }}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
          {formData.videoUrl && (
            <div className="mt-2">
              <video src={formData.videoUrl} className="h-20 rounded-lg border border-slate-600" muted autoPlay loop playsInline />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Selfie Image (Back of Card)</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={formData.selfieImageUrl}
              onChange={(e) => setFormData({ ...formData, selfieImageUrl: e.target.value })}
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Image URL or upload below"
            />
            <label className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${isSelfieUploading ? 'bg-slate-600' : 'bg-amber-600 hover:bg-amber-700'}`}>
              {isSelfieUploading ? 'Uploading...' : 'Upload Selfie'}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsSelfieUploading(true);
                  try {
                    const urlRes = await fetch('/api/uploads/request-url', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
                    });
                    if (!urlRes.ok) throw new Error('Failed to get upload URL');
                    const { uploadURL, objectPath } = await urlRes.json();
                    const uploadRes = await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                    if (!uploadRes.ok) throw new Error('Failed to upload');
                    setFormData({ ...formData, selfieImageUrl: objectPath });
                  } catch (error) {
                    console.error('Selfie upload failed:', error);
                    alert('Failed to upload selfie image');
                  } finally {
                    setIsSelfieUploading(false);
                  }
                }}
                className="hidden"
                disabled={isSelfieUploading}
              />
            </label>
          </div>
          {formData.selfieImageUrl && (
            <div className="mt-2">
              <img src={formData.selfieImageUrl} alt="Selfie Preview" className="h-20 w-20 object-cover rounded-lg border border-slate-600" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message Text</label>
          <textarea
            value={formData.messageText}
            onChange={(e) => setFormData({ ...formData, messageText: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
        >
          <Save size={18} />
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

interface LandingImageWithTitle extends LandingImage {
  title?: string | null;
}

interface LandingImagesEditorProps {
  images: LandingImageWithTitle[];
  onSave: (id: number, imageUrl: string, mediaType?: string) => Promise<void>;
  onTitleSave?: (id: number, title: string) => Promise<void>;
  getAuthHeaders: () => HeadersInit;
}

const LandingImagesEditor = ({ images, onSave, onTitleSave, getAuthHeaders }: LandingImagesEditorProps) => {
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const handleFileUpload = async (id: number, file: File) => {
    setUploadingId(id);
    try {
      const urlRes = await fetch('/api/uploads/request-url', {
        method: 'POST',
        headers: { 
          ...getAuthHeaders() as Record<string, string>,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: file.name, 
          size: file.size,
          contentType: file.type 
        }),
      });
      
      if (!urlRes.ok) throw new Error('Failed to get upload URL');
      const { uploadURL, objectPath } = await urlRes.json();
      
      const uploadRes = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      
      if (!uploadRes.ok) throw new Error('Failed to upload file');
      
      const isVideo = file.type.startsWith('video/');
      await onSave(id, objectPath, isVideo ? 'video' : 'image');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Site Images</h2>
      <p className="text-slate-400">Upload images for different sections of your site. These images will be used across the landing page and other areas.</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {images.map((image) => {
          const isStageImage = image.key?.startsWith('stage_');
          return (
          <div key={image.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <div>
              <h3 className="font-medium text-white">{image.label}</h3>
              {image.description && (
                <p className="text-sm text-slate-400 mt-1">{image.description}</p>
              )}
            </div>
            
            {isStageImage && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Stage Title</label>
                <input
                  type="text"
                  defaultValue={image.title || ''}
                  placeholder="e.g. The Departure"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  onBlur={(e) => onTitleSave && onTitleSave(image.id, e.target.value)}
                />
              </div>
            )}
            
            <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
              {image.imageUrl ? (
                image.imageUrl.endsWith('.webm') || image.imageUrl.endsWith('.mp4') || image.imageUrl.endsWith('.mov') ? (
                  <video 
                    src={image.imageUrl} 
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img 
                    src={image.imageUrl} 
                    alt={image.label} 
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="text-slate-500 text-sm">No image uploaded</div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*,video/webm,video/mp4,video/quicktime"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(image.id, file);
                  }}
                  disabled={uploadingId === image.id}
                />
                <span className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  uploadingId === image.id 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}>
                  {uploadingId === image.id ? 'Uploading...' : 'Upload Media'}
                </span>
              </label>
              {image.imageUrl && (
                <button
                  onClick={() => onSave(image.id, '')}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  title="Remove image"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        );
        })}
        
        {images.length === 0 && (
          <p className="col-span-2 text-center py-8 text-slate-500">
            No image slots configured. Contact support to add new image slots.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
