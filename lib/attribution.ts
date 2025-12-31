const STORAGE_KEY = 'kiki_attribution';
const STORAGE_VERSION = 2;

export interface AttributionData {
  version?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  referrerDomain?: string;
  derivedSource?: string;
  landingPage?: string;
  capturedAt?: string;
}

function extractDomain(url: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

function deriveSource(data: { utmSource?: string; referrerDomain?: string }): string {
  if (data.utmSource) {
    return data.utmSource;
  }
  
  if (!data.referrerDomain) {
    return 'direct';
  }
  
  const domain = data.referrerDomain.toLowerCase();
  
  if (domain.includes('google')) return 'google';
  if (domain.includes('bing')) return 'bing';
  if (domain.includes('yahoo')) return 'yahoo';
  if (domain.includes('duckduckgo')) return 'duckduckgo';
  if (domain.includes('facebook') || domain.includes('fb.com')) return 'facebook';
  if (domain.includes('instagram')) return 'instagram';
  if (domain.includes('twitter') || domain.includes('x.com') || domain.includes('t.co')) return 'twitter';
  if (domain.includes('pinterest')) return 'pinterest';
  if (domain.includes('tiktok')) return 'tiktok';
  if (domain.includes('linkedin')) return 'linkedin';
  if (domain.includes('reddit')) return 'reddit';
  if (domain.includes('youtube')) return 'youtube';
  
  return domain;
}

function isInternalDomain(domain: string | undefined): boolean {
  if (!domain) return false;
  const internal = [
    'kikithetoothfairy.co',
    'kiki-the-tooth-fairy-tracker',
    'replit.dev',
    'repl.co',
    window.location.hostname
  ];
  return internal.some(d => domain.includes(d));
}

export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  
  const existing = getStoredAttribution();
  const urlParams = new URLSearchParams(window.location.search);
  const rawReferrer = document.referrer || '';
  const referrerDomain = extractDomain(rawReferrer);
  const isInternal = isInternalDomain(referrerDomain);
  
  const utmSource = urlParams.get('utm_source') || undefined;
  const newDerivedSource = deriveSource({ 
    utmSource, 
    referrerDomain: isInternal ? undefined : referrerDomain 
  });
  
  if (existing && existing.capturedAt && existing.version === STORAGE_VERSION) {
    const hasNewUtm = urlParams.get('utm_source') || urlParams.get('utm_campaign');
    const existingIsDirect = existing.derivedSource === 'direct';
    const newSourceIsBetter = newDerivedSource !== 'direct';
    
    if (hasNewUtm) {
      console.log('[Attribution] New UTM params detected, updating attribution');
    } else if (existingIsDirect && newSourceIsBetter) {
      console.log('[Attribution] Upgrading from "direct" to better source:', newDerivedSource);
    } else {
      console.log('[Attribution] Already captured (v' + STORAGE_VERSION + '), skipping. Stored:', existing);
      return;
    }
  }
  
  const attribution: AttributionData = {
    version: STORAGE_VERSION,
    utmSource,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined,
    utmTerm: urlParams.get('utm_term') || undefined,
    utmContent: urlParams.get('utm_content') || undefined,
    referrer: isInternal ? undefined : (rawReferrer || undefined),
    referrerDomain: isInternal ? undefined : referrerDomain,
    derivedSource: newDerivedSource,
    landingPage: existing?.landingPage || (window.location.pathname + window.location.search),
    capturedAt: existing?.capturedAt || new Date().toISOString(),
  };
  
  console.log('[Attribution] Capturing:', {
    rawReferrer,
    referrerDomain,
    isInternal,
    derivedSource: newDerivedSource,
    utmSource: attribution.utmSource,
    landingPage: attribution.landingPage,
  });
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    console.log('[Attribution] Stored to localStorage:', attribution);
  } catch (e) {
    console.warn('[Attribution] Failed to store attribution data:', e);
  }
}

export function getStoredAttribution(): AttributionData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    const sessionStored = sessionStorage.getItem(STORAGE_KEY);
    if (sessionStored) {
      const data = JSON.parse(sessionStored);
      localStorage.setItem(STORAGE_KEY, sessionStored);
      sessionStorage.removeItem(STORAGE_KEY);
      return data;
    }
  } catch (e) {
    console.warn('[Attribution] Failed to read attribution data:', e);
  }
  
  return null;
}

export function getAttributionForSignup(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  derivedSource?: string;
  landingPage?: string;
} {
  const stored = getStoredAttribution();
  const urlParams = new URLSearchParams(window.location.search);
  
  const result = {
    utmSource: stored?.utmSource || urlParams.get('utm_source') || undefined,
    utmMedium: stored?.utmMedium || urlParams.get('utm_medium') || undefined,
    utmCampaign: stored?.utmCampaign || urlParams.get('utm_campaign') || undefined,
    referrer: stored?.referrer || undefined,
    derivedSource: stored?.derivedSource || 'direct',
    landingPage: stored?.landingPage || window.location.pathname,
  };
  
  console.log('[Attribution] For signup:', result);
  
  return result;
}

export function clearAttribution(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('[Attribution] Failed to clear attribution data:', e);
  }
}

export function debugAttribution(): AttributionData | null {
  const stored = getStoredAttribution();
  console.log('[Attribution] Debug - Current stored data:', stored);
  return stored;
}
