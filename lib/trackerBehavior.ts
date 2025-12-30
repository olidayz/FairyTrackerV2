const TRACKER_KEY = 'kiki_tracker_behavior';

export interface StageInteraction {
  stageSlug: string;
  viewedAt: string;
  videoStarted?: boolean;
  videoCompleted?: boolean;
  videoWatchTime?: number;
  cardFlipped?: boolean;
  timeSpentSeconds?: number;
}

export interface TrackerVisit {
  visitedAt: string;
  exitedAt?: string;
  durationSeconds?: number;
  stageInteractions: StageInteraction[];
}

export interface TrackerBehavior {
  trackerToken: string;
  firstVisitAt: string;
  totalVisits: number;
  totalTimeSeconds: number;
  visits: TrackerVisit[];
  stagesViewed: string[];
  stagesCompleted: string[];
  videosStarted: string[];
  videosCompleted: string[];
}

export function initTrackerBehavior(trackerToken: string): TrackerBehavior {
  if (typeof window === 'undefined') {
    return createEmptyBehavior(trackerToken);
  }
  
  const existing = getStoredBehavior(trackerToken);
  if (existing) {
    const newVisit: TrackerVisit = {
      visitedAt: new Date().toISOString(),
      stageInteractions: [],
    };
    existing.visits.push(newVisit);
    existing.totalVisits++;
    saveBehavior(existing);
    return existing;
  }
  
  const behavior = createEmptyBehavior(trackerToken);
  behavior.visits.push({
    visitedAt: new Date().toISOString(),
    stageInteractions: [],
  });
  behavior.totalVisits = 1;
  saveBehavior(behavior);
  return behavior;
}

function createEmptyBehavior(trackerToken: string): TrackerBehavior {
  return {
    trackerToken,
    firstVisitAt: new Date().toISOString(),
    totalVisits: 0,
    totalTimeSeconds: 0,
    visits: [],
    stagesViewed: [],
    stagesCompleted: [],
    videosStarted: [],
    videosCompleted: [],
  };
}

export function getStoredBehavior(trackerToken: string): TrackerBehavior | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(`${TRACKER_KEY}_${trackerToken}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[TrackerBehavior] Failed to read behavior data:', e);
  }
  
  return null;
}

function saveBehavior(behavior: TrackerBehavior): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`${TRACKER_KEY}_${behavior.trackerToken}`, JSON.stringify(behavior));
  } catch (e) {
    console.warn('[TrackerBehavior] Failed to save behavior data:', e);
  }
}

function getCurrentVisit(behavior: TrackerBehavior): TrackerVisit | null {
  if (behavior.visits.length === 0) return null;
  return behavior.visits[behavior.visits.length - 1];
}

export function trackStageView(trackerToken: string, stageSlug: string): void {
  if (typeof window === 'undefined') return;
  
  const behavior = getStoredBehavior(trackerToken);
  if (!behavior) return;
  
  const visit = getCurrentVisit(behavior);
  if (!visit) return;
  
  const existingInteraction = visit.stageInteractions.find(s => s.stageSlug === stageSlug);
  if (!existingInteraction) {
    visit.stageInteractions.push({
      stageSlug,
      viewedAt: new Date().toISOString(),
    });
  }
  
  if (!behavior.stagesViewed.includes(stageSlug)) {
    behavior.stagesViewed.push(stageSlug);
  }
  
  saveBehavior(behavior);
  console.log('[TrackerBehavior] Stage viewed:', stageSlug);
}

export function trackCardFlip(trackerToken: string, stageSlug: string): void {
  if (typeof window === 'undefined') return;
  
  const behavior = getStoredBehavior(trackerToken);
  if (!behavior) return;
  
  const visit = getCurrentVisit(behavior);
  if (!visit) return;
  
  let interaction = visit.stageInteractions.find(s => s.stageSlug === stageSlug);
  if (!interaction) {
    interaction = {
      stageSlug,
      viewedAt: new Date().toISOString(),
    };
    visit.stageInteractions.push(interaction);
  }
  
  interaction.cardFlipped = true;
  
  saveBehavior(behavior);
  console.log('[TrackerBehavior] Card flipped:', stageSlug);
}

export function trackVideoStart(trackerToken: string, stageSlug: string): void {
  if (typeof window === 'undefined') return;
  
  const behavior = getStoredBehavior(trackerToken);
  if (!behavior) return;
  
  const visit = getCurrentVisit(behavior);
  if (!visit) return;
  
  let interaction = visit.stageInteractions.find(s => s.stageSlug === stageSlug);
  if (!interaction) {
    interaction = {
      stageSlug,
      viewedAt: new Date().toISOString(),
    };
    visit.stageInteractions.push(interaction);
  }
  
  interaction.videoStarted = true;
  
  if (!behavior.videosStarted.includes(stageSlug)) {
    behavior.videosStarted.push(stageSlug);
  }
  
  saveBehavior(behavior);
  console.log('[TrackerBehavior] Video started:', stageSlug);
}

export function trackVideoComplete(trackerToken: string, stageSlug: string, watchTimeSeconds: number): void {
  if (typeof window === 'undefined') return;
  
  const behavior = getStoredBehavior(trackerToken);
  if (!behavior) return;
  
  const visit = getCurrentVisit(behavior);
  if (!visit) return;
  
  let interaction = visit.stageInteractions.find(s => s.stageSlug === stageSlug);
  if (!interaction) {
    interaction = {
      stageSlug,
      viewedAt: new Date().toISOString(),
    };
    visit.stageInteractions.push(interaction);
  }
  
  interaction.videoCompleted = true;
  interaction.videoWatchTime = watchTimeSeconds;
  
  if (!behavior.videosCompleted.includes(stageSlug)) {
    behavior.videosCompleted.push(stageSlug);
  }
  
  saveBehavior(behavior);
  console.log('[TrackerBehavior] Video completed:', stageSlug, watchTimeSeconds);
}

export function trackStageComplete(trackerToken: string, stageSlug: string): void {
  if (typeof window === 'undefined') return;
  
  const behavior = getStoredBehavior(trackerToken);
  if (!behavior) return;
  
  if (!behavior.stagesCompleted.includes(stageSlug)) {
    behavior.stagesCompleted.push(stageSlug);
  }
  
  saveBehavior(behavior);
  console.log('[TrackerBehavior] Stage completed:', stageSlug);
}

export function endTrackerVisit(trackerToken: string): void {
  if (typeof window === 'undefined') return;
  
  const behavior = getStoredBehavior(trackerToken);
  if (!behavior) return;
  
  const visit = getCurrentVisit(behavior);
  if (!visit) return;
  
  visit.exitedAt = new Date().toISOString();
  visit.durationSeconds = Math.round(
    (new Date(visit.exitedAt).getTime() - new Date(visit.visitedAt).getTime()) / 1000
  );
  
  behavior.totalTimeSeconds = behavior.visits.reduce((sum, v) => sum + (v.durationSeconds || 0), 0);
  
  saveBehavior(behavior);
  console.log('[TrackerBehavior] Visit ended, duration:', visit.durationSeconds);
}

export function getBehaviorForApi(trackerToken: string): TrackerBehavior | null {
  return getStoredBehavior(trackerToken);
}
