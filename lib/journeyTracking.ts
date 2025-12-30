const JOURNEY_KEY = 'kiki_journey';
const JOURNEY_VERSION = 1;

export interface PageView {
  path: string;
  title: string;
  enteredAt: string;
  exitedAt?: string;
  timeOnPage?: number;
  scrollDepth?: number;
}

export interface CtaClick {
  element: string;
  page: string;
  timestamp: string;
  text?: string;
}

export interface JourneyData {
  version: number;
  sessionId: string;
  startedAt: string;
  pageViews: PageView[];
  ctaClicks: CtaClick[];
  totalPages: number;
  totalTimeSeconds: number;
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function initJourney(): JourneyData {
  if (typeof window === 'undefined') {
    return createEmptyJourney();
  }
  
  const existing = getStoredJourney();
  if (existing && existing.version === JOURNEY_VERSION) {
    return existing;
  }
  
  const journey = createEmptyJourney();
  saveJourney(journey);
  return journey;
}

function createEmptyJourney(): JourneyData {
  return {
    version: JOURNEY_VERSION,
    sessionId: generateSessionId(),
    startedAt: new Date().toISOString(),
    pageViews: [],
    ctaClicks: [],
    totalPages: 0,
    totalTimeSeconds: 0,
  };
}

export function getStoredJourney(): JourneyData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(JOURNEY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[Journey] Failed to read journey data:', e);
  }
  
  return null;
}

function saveJourney(journey: JourneyData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(journey));
  } catch (e) {
    console.warn('[Journey] Failed to save journey data:', e);
  }
}

export function trackPageView(path: string, title: string): void {
  if (typeof window === 'undefined') return;
  
  const journey = getStoredJourney() || initJourney();
  
  if (journey.pageViews.length > 0) {
    const lastPage = journey.pageViews[journey.pageViews.length - 1];
    if (!lastPage.exitedAt) {
      lastPage.exitedAt = new Date().toISOString();
      lastPage.timeOnPage = Math.round(
        (new Date(lastPage.exitedAt).getTime() - new Date(lastPage.enteredAt).getTime()) / 1000
      );
    }
  }
  
  journey.pageViews.push({
    path,
    title,
    enteredAt: new Date().toISOString(),
  });
  
  journey.totalPages = journey.pageViews.length;
  journey.totalTimeSeconds = journey.pageViews.reduce((sum, pv) => sum + (pv.timeOnPage || 0), 0);
  
  saveJourney(journey);
  console.log('[Journey] Page view tracked:', path);
}

export function trackScrollDepth(depth: number): void {
  if (typeof window === 'undefined') return;
  
  const journey = getStoredJourney();
  if (!journey || journey.pageViews.length === 0) return;
  
  const lastPage = journey.pageViews[journey.pageViews.length - 1];
  lastPage.scrollDepth = Math.max(lastPage.scrollDepth || 0, Math.round(depth));
  
  saveJourney(journey);
}

export function trackCtaClick(element: string, text?: string): void {
  if (typeof window === 'undefined') return;
  
  const journey = getStoredJourney() || initJourney();
  
  journey.ctaClicks.push({
    element,
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    text,
  });
  
  saveJourney(journey);
  console.log('[Journey] CTA click tracked:', element, text);
}

export function getJourneyForSignup(): JourneyData | null {
  if (typeof window === 'undefined') return null;
  
  const journey = getStoredJourney();
  if (!journey) return null;
  
  if (journey.pageViews.length > 0) {
    const lastPage = journey.pageViews[journey.pageViews.length - 1];
    if (!lastPage.exitedAt) {
      lastPage.exitedAt = new Date().toISOString();
      lastPage.timeOnPage = Math.round(
        (new Date(lastPage.exitedAt).getTime() - new Date(lastPage.enteredAt).getTime()) / 1000
      );
    }
  }
  
  journey.totalTimeSeconds = journey.pageViews.reduce((sum, pv) => sum + (pv.timeOnPage || 0), 0);
  
  saveJourney(journey);
  
  console.log('[Journey] For signup:', journey);
  return journey;
}

export function clearJourney(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(JOURNEY_KEY);
  } catch (e) {
    console.warn('[Journey] Failed to clear journey data:', e);
  }
}
