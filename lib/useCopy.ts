import { useState, useEffect, useMemo, useCallback } from 'react';

interface CopyData {
  [key: string]: string;
}

let cachedCopy: CopyData | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 30000; // 30 seconds - short enough for quick updates

async function fetchCopy(forceRefresh = false): Promise<CopyData> {
  const now = Date.now();
  
  // Return cached if valid and not forcing refresh
  if (!forceRefresh && cachedCopy && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedCopy;
  }
  
  try {
    const res = await fetch('/api/copy');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    cachedCopy = data;
    cacheTimestamp = Date.now(); // Update timestamp AFTER successful fetch
    return data;
  } catch {
    // On force refresh failure, return defaults to ensure fresh data
    if (forceRefresh) {
      return DEFAULTS;
    }
    return cachedCopy || DEFAULTS;
  }
}

const DEFAULTS: CopyData = {
  form_child_name_label: "Child's First Name",
  form_child_name_desc: "We use the name to customize the experience.",
  form_email_label: "Your Email",
  form_email_desc: "We'll send your tracker link. Nothing else.",
  form_submit_button: "Start the Journey",
  form_submit_button_loading: "Creating your tracker...",
  error_name_required: "Please enter your child's name",
  error_email_required: "Please enter your email",
  error_email_invalid: "Please enter a valid email address",
  error_generic: "Something went wrong. Please try again.",
  landing_badge: "The World's #1 Tooth Fairy Experience",
  landing_headline: "Track the Tooth Fairy, Bring the Magic to Life",
  landing_subheadline: "A magical experience where the Tooth Fairy sends videos and updates as she flies to pick up their tooth.",
  landing_cta_primary: "Start the Journey",
  landing_cta_secondary: "How It Works",
  landing_social_proof: "Trusted by hundreds of parents",
  landing_no_credit_card: "No credit card required",
  landing_no_download: "No Download",
  how_step1_title: "Enter Child's Name",
  how_step1_desc: "Quick 10-second signup",
  how_step2_title: "Get Your Tracker Link",
  how_step2_desc: "Delivered instantly by email",
  how_step3_title: "Track the Fairy's Journey",
  how_step3_desc: "Live map + nighttime updates",
  how_step4_title: "Wake Up to Magic",
  how_step4_desc: "Morning updates reveal what happened",
  section_start_magic: "Start the Magic",
  section_start_magic_desc: "Enter your details and the Tooth Fairy will begin preparing for her big adventure.",
  section_ready_launch: "Ready to Launch",
  section_live_tracking: "Live Tracking",
  section_fairy_updates: "Fairy Updates",
  feature_live_map: "Live Tracking Map",
  feature_live_map_desc: "Watch Kiki fly across the globe in real-time.",
  feature_video_updates: "Video Updates",
  feature_video_updates_desc: "Vlog-Style Updates from the Fairy",
  feature_personalized: "Made for Your Child",
  feature_personalized_desc: "A Page Personalized with their Name",
  feature_stats: "Speed & Stats",
  feature_stats_desc: "Live Mission Stats",
  feature_morning: "Morning Reveal",
  feature_morning_desc: "See What the Fairy Did Overnight",
  contact_title: "Say Hello",
  contact_name_label: "Your Name",
  contact_email_label: "Email Address",
  contact_message_label: "Message",
  contact_submit: "Send Message",
  faq_badge: "Got Questions?",
  faq_title: "Frequently Asked Questions",
  footer_explore_title: "Explore",
  footer_support_title: "Support",
  footer_copyright: "2024 Kiki the Tooth Fairy. All rights reserved.",
  tracker_badge: "Live Tracking Active",
  tracker_mission_status: "Mission Status",
  tracker_speed_label: "Current Speed",
  tracker_eta_label: "Estimated Arrival",
  live_counter: "48 families tracking tonight",
};

export function useCopy() {
  const [copy, setCopy] = useState<CopyData>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  const loadCopy = useCallback((forceRefresh = false) => {
    fetchCopy(forceRefresh).then(data => {
      setCopy({ ...DEFAULTS, ...data });
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    loadCopy();
    
    // Refetch when tab becomes visible (user returns from admin)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCopy(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loadCopy]);

  const get = useMemo(() => {
    return (key: string, fallback?: string): string => {
      return copy[key] || fallback || DEFAULTS[key] || '';
    };
  }, [copy]);

  return { copy, get, loaded, refresh: () => loadCopy(true) };
}

export function clearCopyCache() {
  cachedCopy = null;
  cacheTimestamp = 0;
}
