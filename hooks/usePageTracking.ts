import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrCreateVisitorId } from '../lib/visitor';
import { captureAttribution, getStoredAttribution, deriveSourceFromReferrer } from '../lib/attribution';

export function usePageTracking() {
  const location = useLocation();
  const lastTrackedPath = useRef<string>('');

  useEffect(() => {
    captureAttribution();
    
    const currentPath = location.pathname;
    
    if (currentPath === lastTrackedPath.current) return;
    if (currentPath.startsWith('/admin')) return;
    
    lastTrackedPath.current = currentPath;

    const visitorId = getOrCreateVisitorId();
    const attribution = getStoredAttribution();
    const currentReferrer = document.referrer || '';
    
    let source = attribution?.derivedSource || 'direct';
    if (source === 'direct' && currentReferrer) {
      const derivedFromReferrer = deriveSourceFromReferrer(currentReferrer);
      if (derivedFromReferrer !== 'direct') {
        source = derivedFromReferrer;
      }
    }

    fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: currentPath,
        visitorId,
        source,
        referrer: currentReferrer || attribution?.referrer || null,
        utmSource: attribution?.utmSource,
        utmMedium: attribution?.utmMedium,
        utmCampaign: attribution?.utmCampaign,
        landingPage: attribution?.landingPage,
      }),
    }).catch(() => {});
  }, [location.pathname]);
}

export function trackEvent(eventType: string, metadata?: Record<string, unknown>) {
  const visitorId = getOrCreateVisitorId();
  const attribution = getStoredAttribution();
  
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      eventType,
      source: attribution?.derivedSource || 'direct',
      metadata,
    }),
  }).catch(() => {});
}
