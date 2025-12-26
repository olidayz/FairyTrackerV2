import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Frequently Asked Questions | Kiki the Tooth Fairy';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Find answers to common questions about Kiki the Tooth Fairy Tracker. Learn how the magical tooth fairy tracking experience works for your child.');
    }
  }, []);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          setFaqs(data);
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const defaultFaqs = [
    {
      q: "How does the tracker work?",
      a: "Bedtime updates unlock as soon as you sign up. Morning updates unlock later to feel like a real overnight journey—but parents can unlock them anytime."
    },
    {
      q: "How will I know when Morning Updates are ready?",
      a: "We'll send you an email when they're available. You can also unlock morning updates anytime directly on the tracker page."
    },
    {
      q: "Does my child need a phone or tablet?",
      a: "No. Parents control everything. Kids simply watch the videos with you."
    },
    {
      q: "Do you need my address or payment details?",
      a: "No. The tracker is completely free, and we don't collect your address or payment information."
    },
    {
      q: "What if my child loses a tooth at an inconvenient time?",
      a: "No problem. The tracker stays active, and you can start the experience whenever it works for your family."
    },
    {
      q: "Does this replace the coin under the pillow?",
      a: "No. The tracker adds to the magic—the classic reward stays the same. Kiki never mentions what gift she left, so parents keep full control."
    }
  ];

  const displayFaqs = faqs.length > 0 
    ? faqs.map(f => ({ q: f.question, a: f.answer }))
    : defaultFaqs;

  return (
    <div className="min-h-screen bg-[#0a1020] text-white font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0c1428] to-[#080e1a]" />
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-fuchsia-500/8 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <Header />

      <div className="relative z-10 pt-28 max-w-4xl mx-auto px-4 pb-16">
        <div className="mb-12">
          <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest">Got Questions?</span>
          <h1 className="font-chrome text-4xl md:text-5xl text-white uppercase tracking-normal mt-2">
            Frequently Asked
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="space-y-4">
            {displayFaqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="font-semibold text-white">{faq.q}</span>
                  <span className="text-cyan-400 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FAQPage;
