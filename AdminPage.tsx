import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Image, Video, Settings, Plus, Trash2, Save, Edit2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  status: string;
  publishedAt: string | null;
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
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'stages' | 'assets'>('blog');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [stages, setStages] = useState<StageDefinition[]>([]);
  const [stageContents, setStageContents] = useState<StageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingStage, setEditingStage] = useState<{ stage: StageDefinition; content: StageContent | null } | null>(null);
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
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
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

  const tabs = [
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'stages', label: 'Stage Content', icon: Video },
    { id: 'assets', label: 'Site Assets', icon: Image },
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
              <button
                onClick={() => setEditingPost({ id: 0, slug: '', title: '', excerpt: '', content: '', featuredImageUrl: '', status: 'draft', publishedAt: null })}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
              >
                <Plus size={18} />
                New Post
              </button>
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
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
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
  });

  useEffect(() => {
    setFormData({
      videoUrl: content?.videoUrl || '',
      imageUrl: content?.imageUrl || '',
      messageText: content?.messageText || '',
    });
  }, [stage.id, content]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Edit Content: {stage.label}</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input
            type="text"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
          />
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

export default AdminPage;
