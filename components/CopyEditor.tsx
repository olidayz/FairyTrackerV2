import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { clearCopyCache } from '../lib/useCopy';

interface CopySection {
  id: number;
  key: string;
  label: string;
  content: string;
  page: string;
}

interface CopyEditorProps {
  authHeaders: Record<string, string>;
}

const PAGE_LABELS: Record<string, string> = {
  form: 'Form Fields',
  errors: 'Error Messages',
  landing: 'Landing Page',
  contact: 'Contact Page',
  faq: 'FAQ Page',
  footer: 'Footer',
  tracker: 'Tracker Page',
  misc: 'Miscellaneous',
};

const PAGE_ORDER = ['form', 'errors', 'landing', 'tracker', 'contact', 'faq', 'footer', 'misc'];

export default function CopyEditor({ authHeaders }: CopyEditorProps) {
  const [sections, setSections] = useState<CopySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    fetchSections();
    return () => {
      debounceTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/copy-sections', { headers: authHeaders });
      if (res.ok) {
        setSections(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch copy sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSection = useCallback(async (section: CopySection) => {
    setSavingIds(prev => new Set(prev).add(section.id));
    setSavedIds(prev => {
      const next = new Set(prev);
      next.delete(section.id);
      return next;
    });

    try {
      const res = await fetch(`/api/admin/copy-sections/${section.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ content: section.content }),
      });
      
      if (res.ok) {
        clearCopyCache(); // Invalidate cache so landing page gets fresh copy
        setSavedIds(prev => new Set(prev).add(section.id));
        setTimeout(() => {
          setSavedIds(prev => {
            const next = new Set(prev);
            next.delete(section.id);
            return next;
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to save section:', error);
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(section.id);
        return next;
      });
    }
  }, [authHeaders]);

  const handleContentChange = (id: number, newContent: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
    
    const existingTimer = debounceTimers.current.get(id);
    if (existingTimer) clearTimeout(existingTimer);
    
    const timer = setTimeout(() => {
      const section = sections.find(s => s.id === id);
      if (section) {
        saveSection({ ...section, content: newContent });
      }
      debounceTimers.current.delete(id);
    }, 800);
    
    debounceTimers.current.set(id, timer);
  };

  const groupedSections = PAGE_ORDER.reduce((acc, page) => {
    const pageSections = sections.filter(s => s.page === page);
    if (pageSections.length > 0) {
      acc[page] = pageSections;
    }
    return acc;
  }, {} as Record<string, CopySection[]>);

  const filteredGroups = searchQuery
    ? Object.entries(groupedSections).reduce((acc, [page, secs]) => {
        const filtered = secs.filter(s => 
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.key.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) acc[page] = filtered;
        return acc;
      }, {} as Record<string, CopySection[]>)
    : groupedSections;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-cyan-400" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Copy Editor</h2>
          <p className="text-sm text-slate-400 mt-1">Click any text to edit. Changes save automatically.</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search copy..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-slate-500"
      />

      <div className="space-y-8">
        {Object.entries(filteredGroups).map(([page, pageSections]) => (
          <div key={page} className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800">
              <h3 className="font-semibold text-cyan-400">{PAGE_LABELS[page] || page}</h3>
            </div>
            <div className="divide-y divide-slate-800/50">
              {pageSections.map((section) => (
                <div key={section.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        {section.label}
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) => handleContentChange(section.id, e.target.value)}
                        className="w-full bg-transparent text-white text-base resize-none focus:outline-none focus:bg-slate-800/50 rounded px-2 py-1 -mx-2 -my-1 border border-transparent focus:border-cyan-500/50 transition-all"
                        rows={Math.max(1, Math.ceil((section.content?.length || 0) / 60))}
                        style={{ minHeight: '2rem' }}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      {savingIds.has(section.id) && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Loader2 className="animate-spin" size={12} />
                          Saving
                        </span>
                      )}
                      {savedIds.has(section.id) && (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <Check size={12} />
                          Saved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(filteredGroups).length === 0 && (
        <div className="text-center py-12 text-slate-500">
          {searchQuery ? 'No copy matches your search.' : 'No copy sections found.'}
        </div>
      )}
    </div>
  );
}
