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
    console.log('[Attribution] Already captured, skipping. Stored:', existing);
    return;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const rawReferrer = document.referrer || '';
  
  const attribution: AttributionData = {
    utmSource: urlParams.get('utm_source') || undefined,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined,
    utmTerm: urlParams.get('utm_term') || undefined,
    utmContent: urlParams.get('utm_content') || undefined,
    referrer: rawReferrer || undefined,
    landingPage: window.location.pathname + window.location.search,
    capturedAt: new Date().toISOString(),
  };
  
  const isInternalReferrer = rawReferrer && (
    rawReferrer.includes(window.location.hostname) ||
    rawReferrer.includes('kikithetoothfairy.co')
  );
  
  const hasExternalReferrer = rawReferrer && !isInternalReferrer;
  const hasUtmParams = attribution.utmSource || attribution.utmMedium || attribution.utmCampaign;
  
  console.log('[Attribution] Capturing:', {
    referrer: rawReferrer,
    isInternalReferrer,
    hasExternalReferrer,
    hasUtmParams,
    utmSource: attribution.utmSource,
    landingPage: attribution.landingPage,
  });
  
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    console.log('[Attribution] Stored:', attribution);
  } catch (e) {
    console.warn('[Attribution] Failed to store attribution data:', e);
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
  const currentReferrer = document.referrer || undefined;
  
  const result = {
    utmSource: stored?.utmSource || urlParams.get('utm_source') || undefined,
    utmMedium: stored?.utmMedium || urlParams.get('utm_medium') || undefined,
    utmCampaign: stored?.utmCampaign || urlParams.get('utm_campaign') || undefined,
    referrer: stored?.referrer || currentReferrer,
  };
  
  console.log('[Attribution] For signup:', result);
  
  return result;
}

export function clearAttribution(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('[Attribution] Failed to clear attribution data:', e);
  }
}
