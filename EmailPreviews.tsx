import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmailTemplate {
  id: number;
  slug: string;
  name: string;
  subject: string;
  preheader: string | null;
  headline: string | null;
  bodyText: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  footerText: string | null;
}

const EmailContainer = ({ subject, preheader, children }: { subject: string, preheader?: string | null, children: React.ReactNode }) => (
  <div className="max-w-2xl mx-auto my-12 font-sans text-slate-900">
    <div className="bg-slate-100 rounded-lg p-4 mb-4 text-sm text-slate-500 border border-slate-200">
      <div><strong>Subject:</strong> {subject}</div>
      {preheader && <div className="mt-1 text-xs text-slate-400"><strong>Preheader:</strong> {preheader}</div>}
    </div>
    <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      {children}
    </div>
  </div>
);

const renderBodyWithPlaceholder = (text: string | null, childName = "Oliver") => {
  if (!text) return null;
  return text.replace(/\{\{child_name\}\}/g, childName).replace(/\{\{tracker_url\}\}/g, '#');
};

const TrackingLinkEmail = ({ template }: { template: EmailTemplate }) => {
  const bodyText = renderBodyWithPlaceholder(template.bodyText);
  const footerLines = template.footerText?.split('|') || [];

  return (
    <EmailContainer subject={template.subject} preheader={template.preheader}>
      <div className="bg-[#020617] p-8 text-center border-b border-white/10">
        <img src="/kiki-logo.png" alt="Kiki" className="w-16 h-16 rounded-xl mx-auto mb-4" />
        <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">Tooth Fairy Tracker</p>
      </div>

      <div className="bg-slate-900 p-8 pt-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Tracker Activated
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
          {template.headline || 'Kiki is Airborne!'}
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto mb-8">
          {bodyText || "The Fairyland Control Center has confirmed lift-off. We've detected magical signals nearby."}
        </p>

        {template.ctaText && (
          <a href={template.ctaUrl || '#'} className="inline-block bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-base px-8 py-4 rounded-lg uppercase tracking-wide shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all">
            {template.ctaText}
          </a>
        )}
      </div>

      <div className="p-8 bg-[#0f172a]">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
          <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            Mission Checklist
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-400 text-sm">
              <CheckCircle size={16} className="text-cyan-500 mt-0.5" />
              <span>Tooth placed securely under the pillow</span>
            </li>
            <li className="flex items-start gap-3 text-slate-400 text-sm">
              <CheckCircle size={16} className="text-cyan-500 mt-0.5" />
              <span>Lights out and eyes closed (fairies are shy!)</span>
            </li>
            <li className="flex items-start gap-3 text-slate-400 text-sm">
              <CheckCircle size={16} className="text-cyan-500 mt-0.5" />
              <span>Tracker ready on parent's device</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#020617] p-6 text-center text-slate-500 text-xs">
        {footerLines.map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : ''}>{line.trim()}</p>
        ))}
      </div>
    </EmailContainer>
  );
};

const MorningUnlockEmail = ({ template }: { template: EmailTemplate }) => {
  const bodyText = renderBodyWithPlaceholder(template.bodyText);
  const footerLines = template.footerText?.split('|') || [];

  return (
    <EmailContainer subject={template.subject} preheader={template.preheader}>
      <div className="bg-[#020617] p-8 text-center border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 to-transparent opacity-50" />
        <img src="/kiki-logo.png" alt="Kiki" className="w-16 h-16 rounded-xl mx-auto mb-4 relative z-10" />
        <p className="text-fuchsia-300 text-xs font-bold uppercase tracking-[0.2em] relative z-10">Mission Update</p>
      </div>

      <div className="bg-slate-900 p-8 pt-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles size={12} />
          Delivery Confirmed
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
          {template.headline || 'Mission Complete!'}
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto mb-8">
          {bodyText || "Good morning! Kiki visited last night while the house was sleeping."}
        </p>

        {template.ctaText && (
          <a href={template.ctaUrl || '#'} className="inline-block bg-[#d946ef] hover:bg-[#c026d3] text-white font-bold text-base px-8 py-4 rounded-lg uppercase tracking-wide shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all">
            {template.ctaText}
          </a>
        )}
      </div>

      <div className="p-8 bg-[#0f172a]">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5 text-center">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            "The tooth was perfect! I've left a little something special behind. Can you find it?"
          </p>
          <p className="text-cyan-400 font-bold text-xs uppercase tracking-widest">
            — Kiki
          </p>
        </div>
      </div>

      <div className="bg-[#020617] p-6 text-center text-slate-500 text-xs">
        <div className="flex justify-center gap-4 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        </div>
        {footerLines.length > 0 ? (
          footerLines.map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>{line.trim()}</p>
          ))
        ) : (
          <p>Hope you had a magical night!</p>
        )}
      </div>
    </EmailContainer>
  );
};

const GenericEmail = ({ template }: { template: EmailTemplate }) => {
  const bodyText = renderBodyWithPlaceholder(template.bodyText);
  const footerLines = template.footerText?.split('|') || [];

  return (
    <EmailContainer subject={template.subject} preheader={template.preheader}>
      <div className="bg-[#020617] p-8 text-center border-b border-white/10">
        <img src="/kiki-logo.png" alt="Kiki" className="w-16 h-16 rounded-xl mx-auto mb-4" />
        <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">{template.name}</p>
      </div>

      <div className="bg-slate-900 p-8 pt-10 text-center">
        {template.headline && (
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
            {template.headline}
          </h1>
        )}
        {bodyText && (
          <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto mb-8">
            {bodyText}
          </p>
        )}
        {template.ctaText && (
          <a href={template.ctaUrl || '#'} className="inline-block bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-base px-8 py-4 rounded-lg uppercase tracking-wide shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all">
            {template.ctaText}
          </a>
        )}
      </div>

      {footerLines.length > 0 && (
        <div className="bg-[#020617] p-6 text-center text-slate-500 text-xs">
          {footerLines.map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>{line.trim()}</p>
          ))}
        </div>
      )}
    </EmailContainer>
  );
};

const EmailPreviews = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/email-templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const renderEmail = (template: EmailTemplate) => {
    switch (template.slug) {
      case 'tracking-link':
        return <TrackingLinkEmail key={template.id} template={template} />;
      case 'morning-unlock':
        return <MorningUnlockEmail key={template.id} template={template} />;
      default:
        return <GenericEmail key={template.id} template={template} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-2xl mx-auto mb-8">
        <Link to="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft size={18} />
          Back to Admin
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-4">Email Templates</h1>
      <p className="text-center text-slate-500 mb-12">
        Preview how your emails will look. Edit templates in the Admin CMS.
      </p>

      {loading ? (
        <p className="text-center text-slate-400">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-center text-slate-400">No email templates found. Create some in the Admin CMS.</p>
      ) : (
        templates.map(renderEmail)
      )}
    </div>
  );
};

export default EmailPreviews;
