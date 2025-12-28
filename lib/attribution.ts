const STORAGE_KEY = 'kiki_attribution';

export interface AttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
  capturedAt?: string;
}

export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  
  const existing = getStoredAttribution();
  if (existing && existing.capturedAt) {
    return;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  
  const attribution: AttributionData = {
    utmSource: urlParams.get('utm_source') || undefined,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined,
    utmTerm: urlParams.get('utm_term') || undefined,
    utmContent: urlParams.get('utm_content') || undefined,
    referrer: document.referrer || undefined,
    landingPage: window.location.pathname,
    capturedAt: new Date().toISOString(),
  };
  
  const hasExternalReferrer = attribution.referrer && 
    !attribution.referrer.includes(window.location.hostname) &&
    !attribution.referrer.includes('replit.dev') &&
    !attribution.referrer.includes('replit.com');
  
  const hasUtmParams = attribution.utmSource || attribution.utmMedium || attribution.utmCampaign;
  
  if (hasExternalReferrer || hasUtmParams) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    } catch (e) {
      console.warn('[Attribution] Failed to store attribution data:', e);
    }
  } else if (!existing) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        landingPage: window.location.pathname,
        capturedAt: new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('[Attribution] Failed to store attribution data:', e);
    }
  }
}

export function getStoredAttribution(): AttributionData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
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
} {
  const stored = getStoredAttribution();
  const urlParams = new URLSearchParams(window.location.search);
  
  // First-touch attribution: prioritize stored values over current URL
  return {
    utmSource: stored?.utmSource || urlParams.get('utm_source') || undefined,
    utmMedium: stored?.utmMedium || urlParams.get('utm_medium') || undefined,
    utmCampaign: stored?.utmCampaign || urlParams.get('utm_campaign') || undefined,
    referrer: stored?.referrer || document.referrer || undefined,
  };
}

export function clearAttribution(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('[Attribution] Failed to clear attribution data:', e);
  }
}
