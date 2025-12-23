import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const getVisitorId = (): string => {
  const key = 'kiki_visitor_id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

export function usePageTracking() {
  const location = useLocation();
  const lastTrackedPath = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname;
    
    if (currentPath === lastTrackedPath.current) return;
    if (currentPath.startsWith('/admin')) return;
    
    lastTrackedPath.current = currentPath;

    const visitorId = getVisitorId();

    fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: currentPath,
        visitorId,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  }, [location.pathname]);
}
