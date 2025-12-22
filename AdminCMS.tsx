import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Save, Loader, Plus, Trash2, Edit2, FileText, Eye, EyeOff, RefreshCw, Upload, BarChart3, Users, MousePointer, Mail, TrendingUp, Image, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnalyticsOverview {
  totalVisitors: number;
  totalPageViews: number;
  totalSignups: number;
  emailsSent: number;
  todayVisitors: number;
  todayPageViews: number;
  todaySignups: number;
}

interface TopPage {
  path: string;
  views: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
}

interface SignupData {
  date: string;
  signups: number;
}

interface Stage {
  id: number;
  slug: string;
  label: string;
  dayPart: string;
  orderIndex: number;
  content: {
    videoUrl?: string;
    imageUrl?: string;
    messageText?: string;
  } | null;
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface SiteAsset {
  id: number;
  key: string;
  type: 'hero_image' | 'background' | 'logo' | 'media_kit_item' | 'other';
  label: string;
  description?: string;
  url: string;
  downloadable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCMS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stages' | 'blogs' | 'assets' | 'analytics'>('stages');
  const [stages, setStages] = useState<Stage[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [assets, setAssets] = useState<SiteAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<number | null>(null);
  const [isCreatingAsset, setIsCreatingAsset] = useState(false);
  const [assetFormData, setAssetFormData] = useState({
    key: '',
    type: 'other' as SiteAsset['type'],
    label: '',
    description: '',
    url: '',
    downloadable: false,
    sortOrder: 0,
  });
  const assetFileInputRef = useRef<HTMLInputElement>(null);
  const [analyticsOverview, setAnalyticsOverview] = useState<AnalyticsOverview | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [signupsOverTime, setSignupsOverTime] = useState<SignupData[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [stageFormData, setStageFormData] = useState({
    videoUrl: '',
    imageUrl: '',
    messageText: '',
  });
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImageUrl: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft' as 'draft' | 'published',
  });
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stagesRes, blogsRes] = await Promise.all([
        fetch('/api/admin/stages'),
        fetch('/api/admin/blogs'),
      ]);
      const stagesData = await stagesRes.json();
      const blogsData = await blogsRes.json();
      setStages(stagesData);
      setBlogs(blogsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const [overviewRes, pagesRes, sourcesRes, signupsRes] = await Promise.all([
        fetch('/api/admin/analytics/overview'),
        fetch('/api/admin/analytics/top-pages'),
        fetch('/api/admin/analytics/traffic-sources'),
        fetch('/api/admin/analytics/signups-over-time?days=30'),
      ]);
      
      const [overview, pages, sources, signups] = await Promise.all([
        overviewRes.json(),
        pagesRes.json(),
        sourcesRes.json(),
        signupsRes.json(),
      ]);
      
      setAnalyticsOverview(overview);
      setTopPages(pages);
      setTrafficSources(sources);
      setSignupsOverTime(signups);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics' && !analyticsOverview) {
      fetchAnalytics();
    }
    if (activeTab === 'assets' && assets.length === 0) {
      fetchAssets();
    }
  }, [activeTab]);

  const fetchAssets = async () => {
    setLoadingAssets(true);
    try {
      const res = await fetch('/api/admin/assets');
      const data = await res.json();
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleEditAsset = (asset: SiteAsset) => {
    setEditingAssetId(asset.id);
    setIsCreatingAsset(false);
    setAssetFormData({
      key: asset.key,
      type: asset.type,
      label: asset.label,
      description: asset.description || '',
      url: asset.url,
      downloadable: asset.downloadable,
      sortOrder: asset.sortOrder,
    });
  };

  const handleCreateAsset = () => {
    setIsCreatingAsset(true);
    setEditingAssetId(null);
    setAssetFormData({
      key: '',
      type: 'other',
      label: '',
      description: '',
      url: '',
      downloadable: false,
      sortOrder: 0,
    });
  };

  const handleSaveAsset = async () => {
    setSaving(true);
    try {
      const url = isCreatingAsset ? '/api/admin/assets' : `/api/admin/assets/${editingAssetId}`;
      const method = isCreatingAsset ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetFormData),
      });

      if (res.ok) {
        setEditingAssetId(null);
        setIsCreatingAsset(false);
        fetchAssets();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save asset');
      }
    } catch (error) {
      console.error('Failed to save asset:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAsset = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const res = await fetch(`/api/admin/assets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAssets();
      }
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const handleAssetImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/objects/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAssetFormData(prev => ({ ...prev, url: data.url }));
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEditStage = (stage: Stage) => {
    setEditingStageId(stage.id);
    setStageFormData({
      videoUrl: stage.content?.videoUrl || '',
      imageUrl: stage.content?.imageUrl || '',
      messageText: stage.content?.messageText || '',
    });
  };

  const handleSaveStage = async () => {
    if (!editingStageId) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/stages/${editingStageId}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stageFormData),
      });

      if (res.ok) {
        setEditingStageId(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save stage:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setIsCreatingBlog(false);
    setBlogFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      featuredImageUrl: blog.featuredImageUrl || '',
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      status: blog.status,
    });
  };

  const handleNewBlog = () => {
    setIsCreatingBlog(true);
    setEditingBlogId(null);
    setBlogFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImageUrl: '',
      metaTitle: '',
      metaDescription: '',
      status: 'draft',
    });
  };

  const handleSaveBlog = async () => {
    setSaving(true);
    try {
      const url = isCreatingBlog 
        ? '/api/admin/blogs' 
        : `/api/admin/blogs/${editingBlogId}`;
      const method = isCreatingBlog ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogFormData),
      });

      if (res.ok) {
        setEditingBlogId(null);
        setIsCreatingBlog(false);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save blog post');
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSyncFromShopify = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/admin/blogs/sync-shopify', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok) {
        let message = `Synced from "${data.blogName}": ${data.stats.created} created, ${data.stats.updated} updated`;
        if (data.stats.skipped > 0) {
          message += `, ${data.stats.skipped} skipped (local posts preserved)`;
        }
        setSyncResult({
          success: true,
          message,
        });
        fetchData();
      } else {
        setSyncResult({
          success: false,
          message: data.error || 'Failed to sync from Shopify',
        });
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: 'Failed to connect to Shopify',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleImageUpload = async (file: File, target: 'blog' | 'stage') => {
    setUploading(true);
    try {
      const res = await fetch('/api/uploads/request-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL, objectPath } = await res.json();

      const uploadRes = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      if (target === 'blog') {
        setBlogFormData({ ...blogFormData, featuredImageUrl: objectPath });
      } else {
        setStageFormData({ ...stageFormData, imageUrl: objectPath });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cp-bg text-white flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cp-bg text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 text-cp-teal hover:text-cp-text transition"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-8 text-cp-teal">Content Management System</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('stages')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'stages'
                ? 'bg-cp-teal text-cp-black'
                : 'bg-cp-card text-cp-teal border border-cp-teal/30 hover:border-cp-teal'
            }`}
          >
            Stage Content
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'blogs'
                ? 'bg-cp-teal text-cp-black'
                : 'bg-cp-card text-cp-teal border border-cp-teal/30 hover:border-cp-teal'
            }`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'assets'
                ? 'bg-cp-teal text-cp-black'
                : 'bg-cp-card text-cp-teal border border-cp-teal/30 hover:border-cp-teal'
            }`}
          >
            <Image size={18} />
            Assets
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'analytics'
                ? 'bg-cp-teal text-cp-black'
                : 'bg-cp-card text-cp-teal border border-cp-teal/30 hover:border-cp-teal'
            }`}
          >
            <BarChart3 size={18} />
            Analytics
          </button>
        </div>

        {activeTab === 'stages' && (
          <div className="grid gap-6">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="bg-cp-card border border-cp-teal/30 rounded-lg p-6 hover:border-cp-teal/60 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-cp-teal">{stage.label}</h2>
                    <p className="text-cp-dimText text-sm">
                      {stage.dayPart === 'night' ? '🌙 Night' : '☀️ Morning'} • {stage.slug}
                    </p>
                  </div>
                  {editingStageId !== stage.id && (
                    <button
                      onClick={() => handleEditStage(stage)}
                      className="px-4 py-2 bg-cp-teal text-cp-black font-bold rounded hover:bg-cp-teal/80 transition"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingStageId === stage.id ? (
                  <div className="space-y-4 bg-cp-bg/50 p-4 rounded">
                    <div>
                      <label className="block text-sm font-bold text-cp-teal mb-2">YouTube Video URL</label>
                      <input
                        type="text"
                        value={stageFormData.videoUrl}
                        onChange={(e) =>
                          setStageFormData({ ...stageFormData, videoUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full bg-cp-card border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-cp-teal mb-2">Card Front Image</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={stageFormData.imageUrl}
                          onChange={(e) =>
                            setStageFormData({ ...stageFormData, imageUrl: e.target.value })
                          }
                          placeholder="https://... or upload an image"
                          className="flex-1 bg-cp-card border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                        />
                        <input
                          ref={stageFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'stage');
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => stageFileInputRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-500 transition disabled:opacity-50"
                        >
                          <Upload size={18} className={uploading ? 'animate-pulse' : ''} />
                          {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                      </div>
                      {stageFormData.imageUrl && (
                        <div className="mt-3 bg-cp-bg/70 p-3 rounded border border-cp-gray/50">
                          <p className="text-xs text-cp-dimText mb-2">Preview:</p>
                          <img 
                            src={stageFormData.imageUrl} 
                            alt="Card front preview" 
                            className="w-full h-auto rounded max-h-48 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-cp-teal mb-2">Message</label>
                      <textarea
                        value={stageFormData.messageText}
                        onChange={(e) =>
                          setStageFormData({ ...stageFormData, messageText: e.target.value })
                        }
                        placeholder="Enter the message for this stage..."
                        rows={4}
                        className="w-full bg-cp-card border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveStage}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-cp-teal text-cp-black font-bold rounded hover:bg-cp-teal/80 transition disabled:opacity-50"
                      >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingStageId(null)}
                        className="px-4 py-2 bg-cp-gray text-white font-bold rounded hover:bg-cp-lightGray transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    {stage.content?.videoUrl && (
                      <p>
                        <span className="text-cp-teal font-bold">Video:</span>{' '}
                        <span className="text-cp-dimText truncate">{stage.content.videoUrl}</span>
                      </p>
                    )}
                    {stage.content?.imageUrl && (
                      <p>
                        <span className="text-cp-teal font-bold">Image:</span>{' '}
                        <span className="text-cp-dimText truncate">{stage.content.imageUrl}</span>
                      </p>
                    )}
                    {stage.content?.messageText && (
                      <p>
                        <span className="text-cp-teal font-bold">Message:</span>{' '}
                        <span className="text-cp-dimText">{stage.content.messageText}</span>
                      </p>
                    )}
                    {!stage.content && (
                      <p className="text-cp-dimText italic">No content added yet</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cp-text">Blog Posts</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleSyncFromShopify}
                  disabled={syncing}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-500 transition disabled:opacity-50"
                >
                  <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Syncing...' : 'Sync from Shopify'}
                </button>
                <button
                  onClick={handleNewBlog}
                  className="flex items-center gap-2 px-4 py-2 bg-cp-teal text-cp-black font-bold rounded hover:bg-cp-teal/80 transition"
                >
                  <Plus size={18} />
                  New Blog Post
                </button>
              </div>
            </div>

            {syncResult && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  syncResult.success
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                }`}
              >
                {syncResult.message}
              </div>
            )}

            {(isCreatingBlog || editingBlogId) && (
              <div className="bg-cp-card border border-cp-teal/30 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-cp-teal mb-4">
                  {isCreatingBlog ? 'Create New Blog Post' : 'Edit Blog Post'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-cp-teal mb-2">Title</label>
                    <input
                      type="text"
                      value={blogFormData.title}
                      onChange={(e) => {
                        setBlogFormData({ 
                          ...blogFormData, 
                          title: e.target.value,
                          slug: isCreatingBlog ? generateSlug(e.target.value) : blogFormData.slug
                        });
                      }}
                      placeholder="Enter blog title..."
                      className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cp-teal mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={blogFormData.slug}
                      onChange={(e) =>
                        setBlogFormData({ ...blogFormData, slug: e.target.value })
                      }
                      placeholder="my-blog-post"
                      className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cp-teal mb-2">Excerpt (Short Description)</label>
                    <textarea
                      value={blogFormData.excerpt}
                      onChange={(e) =>
                        setBlogFormData({ ...blogFormData, excerpt: e.target.value })
                      }
                      placeholder="A brief summary of your blog post..."
                      rows={2}
                      className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cp-teal mb-2">Featured Image</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={blogFormData.featuredImageUrl}
                        onChange={(e) =>
                          setBlogFormData({ ...blogFormData, featuredImageUrl: e.target.value })
                        }
                        placeholder="https://... or upload an image"
                        className="flex-1 bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'blog');
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-500 transition disabled:opacity-50"
                      >
                        <Upload size={18} className={uploading ? 'animate-pulse' : ''} />
                        {uploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                    {blogFormData.featuredImageUrl && (
                      <div className="mt-3 bg-cp-bg/70 p-3 rounded border border-cp-gray/50">
                        <p className="text-xs text-cp-dimText mb-2">Preview:</p>
                        <img 
                          src={blogFormData.featuredImageUrl} 
                          alt="Featured image preview" 
                          className="w-full h-auto rounded max-h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cp-teal mb-2">Content</label>
                    <textarea
                      value={blogFormData.content}
                      onChange={(e) =>
                        setBlogFormData({ ...blogFormData, content: e.target.value })
                      }
                      placeholder="Write your blog content here..."
                      rows={10}
                      className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none resize-y font-mono text-sm"
                    />
                  </div>

                  <div className="border-t border-cp-gray/30 pt-4 mt-4">
                    <h4 className="text-lg font-bold text-cp-teal mb-4">Search Engine Listing</h4>
                    <p className="text-cp-dimText text-sm mb-4">
                      Add a title and description to see how this blog post might appear in search engine results.
                    </p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-cp-teal mb-2">Page Title</label>
                      <input
                        type="text"
                        value={blogFormData.metaTitle}
                        onChange={(e) =>
                          setBlogFormData({ ...blogFormData, metaTitle: e.target.value.slice(0, 70) })
                        }
                        placeholder="SEO title for search engines..."
                        maxLength={70}
                        className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                      />
                      <p className="text-xs text-cp-dimText mt-1">{blogFormData.metaTitle.length} of 70 characters used</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-bold text-cp-teal mb-2">Meta Description</label>
                      <textarea
                        value={blogFormData.metaDescription}
                        onChange={(e) =>
                          setBlogFormData({ ...blogFormData, metaDescription: e.target.value.slice(0, 160) })
                        }
                        placeholder="Brief description for search results..."
                        maxLength={160}
                        rows={3}
                        className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none resize-none"
                      />
                      <p className="text-xs text-cp-dimText mt-1">{blogFormData.metaDescription.length} of 160 characters used</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-cp-teal mb-2">URL Handle</label>
                      <p className="text-cp-dimText text-sm bg-cp-bg/50 p-3 rounded border border-cp-gray/30">
                        /blogs/kikis-blog/{blogFormData.slug || 'your-post-slug'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cp-teal mb-2">Status</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={blogFormData.status === 'draft'}
                          onChange={() => setBlogFormData({ ...blogFormData, status: 'draft' })}
                          className="accent-cp-teal"
                        />
                        <EyeOff size={16} className="text-cp-dimText" />
                        <span className="text-cp-text">Draft</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={blogFormData.status === 'published'}
                          onChange={() => setBlogFormData({ ...blogFormData, status: 'published' })}
                          className="accent-cp-teal"
                        />
                        <Eye size={16} className="text-cp-teal" />
                        <span className="text-cp-text">Published</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveBlog}
                      disabled={saving || !blogFormData.title || !blogFormData.slug || !blogFormData.content}
                      className="flex items-center gap-2 px-4 py-2 bg-cp-teal text-cp-black font-bold rounded hover:bg-cp-teal/80 transition disabled:opacity-50"
                    >
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingBlogId(null);
                        setIsCreatingBlog(false);
                      }}
                      className="px-4 py-2 bg-cp-gray text-white font-bold rounded hover:bg-cp-lightGray transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {blogs.length === 0 ? (
                <div className="bg-cp-card border border-cp-gray/30 rounded-lg p-8 text-center">
                  <FileText size={48} className="mx-auto mb-4 text-cp-dimText" />
                  <p className="text-cp-dimText">No blog posts yet. Create your first one!</p>
                </div>
              ) : (
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-cp-card border border-cp-teal/30 rounded-lg p-6 hover:border-cp-teal/60 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-cp-text">{blog.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded ${
                              blog.status === 'published'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {blog.status}
                          </span>
                        </div>
                        <p className="text-cp-dimText text-sm mb-2">/{blog.slug}</p>
                        {blog.excerpt && (
                          <p className="text-cp-dimText text-sm line-clamp-2">{blog.excerpt}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="p-2 bg-cp-teal/10 text-cp-teal rounded hover:bg-cp-teal/20 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="p-2 bg-cp-pink/10 text-cp-pink rounded hover:bg-cp-pink/20 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-cp-teal">Site Assets & Media Kit</h2>
              <div className="flex gap-2">
                <button
                  onClick={fetchAssets}
                  className="flex items-center gap-2 px-4 py-2 bg-cp-teal/10 text-cp-teal rounded hover:bg-cp-teal/20 transition"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
                <button
                  onClick={handleCreateAsset}
                  className="flex items-center gap-2 px-4 py-2 bg-cp-teal text-cp-black font-bold rounded hover:bg-cp-teal/80 transition"
                >
                  <Plus size={18} />
                  Add Asset
                </button>
              </div>
            </div>

            {loadingAssets ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-cp-teal" size={32} />
              </div>
            ) : (
              <div className="space-y-6">
                {(isCreatingAsset || editingAssetId !== null) && (
                  <div className="bg-cp-card border border-cp-teal/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-cp-teal mb-4">
                      {isCreatingAsset ? 'Create New Asset' : 'Edit Asset'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-cp-teal mb-2">
                          Key (unique identifier)
                        </label>
                        <input
                          type="text"
                          value={assetFormData.key}
                          onChange={(e) =>
                            setAssetFormData({ ...assetFormData, key: e.target.value })
                          }
                          placeholder="e.g., landing_hero_image"
                          className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-cp-teal mb-2">Type</label>
                        <select
                          value={assetFormData.type}
                          onChange={(e) =>
                            setAssetFormData({
                              ...assetFormData,
                              type: e.target.value as SiteAsset['type'],
                            })
                          }
                          className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                        >
                          <option value="hero_image">Hero Image</option>
                          <option value="background">Background</option>
                          <option value="logo">Logo</option>
                          <option value="media_kit_item">Media Kit Item</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-cp-teal mb-2">Label</label>
                        <input
                          type="text"
                          value={assetFormData.label}
                          onChange={(e) =>
                            setAssetFormData({ ...assetFormData, label: e.target.value })
                          }
                          placeholder="Display name"
                          className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-cp-teal mb-2">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          value={assetFormData.sortOrder}
                          onChange={(e) =>
                            setAssetFormData({
                              ...assetFormData,
                              sortOrder: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-cp-teal mb-2">
                        Description
                      </label>
                      <textarea
                        value={assetFormData.description}
                        onChange={(e) =>
                          setAssetFormData({ ...assetFormData, description: e.target.value })
                        }
                        placeholder="Optional description"
                        rows={2}
                        className="w-full bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-cp-teal mb-2">
                        File URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={assetFormData.url}
                          onChange={(e) =>
                            setAssetFormData({ ...assetFormData, url: e.target.value })
                          }
                          placeholder="URL or upload a file"
                          className="flex-1 bg-cp-bg border border-cp-gray text-white p-3 rounded focus:border-cp-teal outline-none"
                        />
                        <input
                          ref={assetFileInputRef}
                          type="file"
                          onChange={handleAssetImageUpload}
                          className="hidden"
                          accept="image/*,application/pdf,.zip"
                        />
                        <button
                          onClick={() => assetFileInputRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center gap-2 px-4 py-2 bg-cp-teal/10 text-cp-teal rounded hover:bg-cp-teal/20 transition disabled:opacity-50"
                        >
                          {uploading ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            <Upload size={16} />
                          )}
                          Upload
                        </button>
                      </div>
                    </div>
                    {assetFormData.url && (
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-cp-teal mb-2">
                          Preview
                        </label>
                        {assetFormData.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
                        assetFormData.url.includes('/objects/') ? (
                          <img
                            src={assetFormData.url}
                            alt="Preview"
                            className="max-h-32 rounded border border-cp-gray"
                          />
                        ) : (
                          <a
                            href={assetFormData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cp-teal hover:underline"
                          >
                            {assetFormData.url}
                          </a>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assetFormData.downloadable}
                          onChange={(e) =>
                            setAssetFormData({
                              ...assetFormData,
                              downloadable: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-cp-teal"
                        />
                        <span className="text-cp-text text-sm">
                          Downloadable (for media kit items)
                        </span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveAsset}
                        disabled={saving || !assetFormData.key || !assetFormData.label || !assetFormData.url}
                        className="flex items-center gap-2 px-4 py-2 bg-cp-teal text-cp-black font-bold rounded hover:bg-cp-teal/80 transition disabled:opacity-50"
                      >
                        {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingAsset(false);
                          setEditingAssetId(null);
                        }}
                        className="px-4 py-2 bg-cp-gray text-cp-text rounded hover:bg-cp-gray/80 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid gap-4">
                  {assets.length === 0 && !isCreatingAsset ? (
                    <div className="text-center py-12 bg-cp-card border border-cp-teal/30 rounded-lg">
                      <Image size={48} className="mx-auto mb-4 text-cp-dimText" />
                      <p className="text-cp-dimText">No assets yet. Add your first asset!</p>
                    </div>
                  ) : (
                    assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="bg-cp-card border border-cp-teal/30 rounded-lg p-4 hover:border-cp-teal/60 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {asset.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
                            asset.url.includes('/objects/') ? (
                              <img
                                src={asset.url}
                                alt={asset.label}
                                className="w-20 h-20 object-cover rounded border border-cp-gray"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-cp-bg rounded border border-cp-gray flex items-center justify-center">
                                <FileText size={32} className="text-cp-dimText" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-cp-teal">{asset.label}</h4>
                              <p className="text-sm text-cp-dimText font-mono">{asset.key}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 text-xs rounded bg-cp-teal/10 text-cp-teal">
                                  {asset.type.replace('_', ' ')}
                                </span>
                                {asset.downloadable && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-cp-pink/10 text-cp-pink">
                                    <Download size={12} />
                                    Downloadable
                                  </span>
                                )}
                              </div>
                              {asset.description && (
                                <p className="text-sm text-cp-dimText mt-1">{asset.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditAsset(asset)}
                              className="p-2 bg-cp-teal/10 text-cp-teal rounded hover:bg-cp-teal/20 transition"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(asset.id)}
                              className="p-2 bg-cp-pink/10 text-cp-pink rounded hover:bg-cp-pink/20 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {loadingAnalytics ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-cp-teal" size={32} />
              </div>
            ) : analyticsOverview ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-cp-teal">Analytics Overview</h2>
                  <button
                    onClick={fetchAnalytics}
                    className="flex items-center gap-2 px-4 py-2 bg-cp-teal/10 text-cp-teal rounded hover:bg-cp-teal/20 transition"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-cp-card border border-cp-teal/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="text-cp-teal" size={24} />
                      <span className="text-cp-dimText text-sm">Total Visitors</span>
                    </div>
                    <p className="text-3xl font-bold text-cp-text">{analyticsOverview.totalVisitors.toLocaleString()}</p>
                    <p className="text-sm text-cp-dimText mt-1">+{analyticsOverview.todayVisitors} today</p>
                  </div>

                  <div className="bg-cp-card border border-cp-teal/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MousePointer className="text-cp-pink" size={24} />
                      <span className="text-cp-dimText text-sm">Page Views</span>
                    </div>
                    <p className="text-3xl font-bold text-cp-text">{analyticsOverview.totalPageViews.toLocaleString()}</p>
                    <p className="text-sm text-cp-dimText mt-1">+{analyticsOverview.todayPageViews} today</p>
                  </div>

                  <div className="bg-cp-card border border-cp-teal/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-green-400" size={24} />
                      <span className="text-cp-dimText text-sm">Total Signups</span>
                    </div>
                    <p className="text-3xl font-bold text-cp-text">{analyticsOverview.totalSignups.toLocaleString()}</p>
                    <p className="text-sm text-cp-dimText mt-1">+{analyticsOverview.todaySignups} today</p>
                  </div>

                  <div className="bg-cp-card border border-cp-teal/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="text-purple-400" size={24} />
                      <span className="text-cp-dimText text-sm">Emails Sent</span>
                    </div>
                    <p className="text-3xl font-bold text-cp-text">{analyticsOverview.emailsSent.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-cp-card border border-cp-teal/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-cp-teal mb-4">Top Pages</h3>
                    {topPages.length === 0 ? (
                      <p className="text-cp-dimText text-sm">No page view data yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {topPages.map((page, i) => (
                          <div key={page.path} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-cp-dimText text-sm w-6">{i + 1}.</span>
                              <span className="text-cp-text text-sm truncate max-w-xs">{page.path}</span>
                            </div>
                            <span className="text-cp-teal font-bold">{page.views.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-cp-card border border-cp-teal/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-cp-teal mb-4">Traffic Sources</h3>
                    {trafficSources.length === 0 ? (
                      <p className="text-cp-dimText text-sm">No traffic source data yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {trafficSources.map((source, i) => (
                          <div key={source.source} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-cp-dimText text-sm w-6">{i + 1}.</span>
                              <span className="text-cp-text text-sm capitalize">{source.source}</span>
                            </div>
                            <span className="text-cp-pink font-bold">{source.visitors.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-cp-card border border-cp-teal/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-cp-teal mb-4">Signups Over Last 30 Days</h3>
                  {signupsOverTime.length === 0 ? (
                    <p className="text-cp-dimText text-sm">No signup data yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <div className="flex gap-1 min-w-max">
                        {signupsOverTime.map((day) => (
                          <div key={day.date} className="flex flex-col items-center">
                            <div 
                              className="w-8 bg-cp-teal/20 rounded-t"
                              style={{ 
                                height: `${Math.max(4, (day.signups / Math.max(...signupsOverTime.map(d => d.signups))) * 100)}px`,
                                backgroundColor: day.signups > 0 ? 'rgba(0, 255, 204, 0.6)' : 'rgba(0, 255, 204, 0.1)'
                              }}
                            />
                            <span className="text-xs text-cp-dimText mt-1 -rotate-45 origin-top-left w-12">
                              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BarChart3 size={48} className="mx-auto mb-4 text-cp-dimText" />
                <p className="text-cp-dimText">No analytics data available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
