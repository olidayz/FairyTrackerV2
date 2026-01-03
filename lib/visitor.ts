const VISITOR_ID_KEY = 'kiki_visitor_id';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch (e) {
    console.warn('[Visitor] Failed to get/create visitor ID:', e);
    return crypto.randomUUID();
  }
}

export function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(VISITOR_ID_KEY);
  } catch (e) {
    return null;
  }
}
