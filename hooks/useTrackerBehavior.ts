import { useEffect, useCallback, useRef } from 'react';
import { 
  initTrackerBehavior, 
  trackStageView, 
  trackCardFlip, 
  trackVideoStart, 
  trackVideoComplete,
  trackStageComplete,
  endTrackerVisit,
  getBehaviorForApi
} from '../lib/trackerBehavior';

function sendEventToServer(trackerToken: string, eventType: string, stageSlug: string, metadata?: Record<string, any>) {
  fetch('/api/tracker-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trackerToken, eventType, stageSlug, metadata }),
  }).catch(err => console.warn('[TrackerBehavior] Failed to send event:', err));
}

export function useTrackerBehavior(trackerToken: string | null) {
  const visitSent = useRef(false);
  
  useEffect(() => {
    if (!trackerToken) return;
    
    initTrackerBehavior(trackerToken);
    
    if (!visitSent.current) {
      sendEventToServer(trackerToken, 'tracker_visit', 'page');
      visitSent.current = true;
    }
    
    const handleBeforeUnload = () => {
      endTrackerVisit(trackerToken);
      const behavior = getBehaviorForApi(trackerToken);
      if (behavior) {
        const blob = new Blob([JSON.stringify({
          trackerToken,
          eventType: 'tracker_exit',
          stageSlug: 'page',
          metadata: {
            totalVisits: behavior.totalVisits,
            totalTimeSeconds: behavior.totalTimeSeconds,
            stagesViewed: behavior.stagesViewed,
            videosStarted: behavior.videosStarted,
          }
        })], { type: 'application/json' });
        navigator.sendBeacon('/api/tracker-events', blob);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endTrackerVisit(trackerToken);
    };
  }, [trackerToken]);
  
  const onStageView = useCallback((stageSlug: string) => {
    if (!trackerToken) return;
    trackStageView(trackerToken, stageSlug);
    sendEventToServer(trackerToken, 'stage_view', stageSlug);
  }, [trackerToken]);
  
  const onCardFlip = useCallback((stageSlug: string) => {
    if (!trackerToken) return;
    trackCardFlip(trackerToken, stageSlug);
    sendEventToServer(trackerToken, 'card_flip', stageSlug);
  }, [trackerToken]);
  
  const onVideoStart = useCallback((stageSlug: string) => {
    if (!trackerToken) return;
    trackVideoStart(trackerToken, stageSlug);
    sendEventToServer(trackerToken, 'video_start', stageSlug);
  }, [trackerToken]);
  
  const onVideoComplete = useCallback((stageSlug: string, watchTimeSeconds: number) => {
    if (!trackerToken) return;
    trackVideoComplete(trackerToken, stageSlug, watchTimeSeconds);
    sendEventToServer(trackerToken, 'video_complete', stageSlug, { watchTimeSeconds });
  }, [trackerToken]);
  
  const onStageComplete = useCallback((stageSlug: string) => {
    if (!trackerToken) return;
    trackStageComplete(trackerToken, stageSlug);
    sendEventToServer(trackerToken, 'stage_complete', stageSlug);
  }, [trackerToken]);
  
  const getBehavior = useCallback(() => {
    if (!trackerToken) return null;
    return getBehaviorForApi(trackerToken);
  }, [trackerToken]);
  
  return {
    onStageView,
    onCardFlip,
    onVideoStart,
    onVideoComplete,
    onStageComplete,
    getBehavior,
  };
}
