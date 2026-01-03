import { db } from './db';
import { analyticsEvents, emailEvents } from '../shared/schema';

export type EventType = 
  | 'signup'
  | 'tracker_view'
  | 'stage_view'
  | 'stage_complete'
  | 'page_view'
  | 'cta_click'
  | 'form_start'
  | 'form_submit';

export interface TrackEventParams {
  eventType: EventType;
  visitorId?: string;
  trackerSessionId?: number;
  userId?: number;
  stageDefinitionId?: number;
  source?: string;
  referrer?: string;
  userAgent?: string;
  pagePath?: string;
  metadata?: Record<string, any>;
}

export async function trackEvent(params: TrackEventParams): Promise<void> {
  try {
    await db.insert(analyticsEvents).values({
      eventType: params.eventType,
      visitorId: params.visitorId,
      trackerSessionId: params.trackerSessionId,
      userId: params.userId,
      stageDefinitionId: params.stageDefinitionId,
      source: params.source,
      referrer: params.referrer,
      userAgent: params.userAgent,
      pagePath: params.pagePath,
      metadata: params.metadata,
      occurredAt: new Date(),
    });
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error);
  }
}

export type EmailEventType = 
  | 'sent'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'bounced'
  | 'complained';

export interface TrackEmailEventParams {
  resendEventId?: string;
  trackerSessionId?: number;
  email: string;
  eventType: EmailEventType;
  payload?: Record<string, any>;
}

export async function trackEmailEvent(params: TrackEmailEventParams): Promise<void> {
  try {
    await db.insert(emailEvents).values({
      resendEventId: params.resendEventId,
      trackerSessionId: params.trackerSessionId,
      email: params.email,
      eventType: params.eventType,
      payload: params.payload,
      occurredAt: new Date(),
    });
  } catch (error) {
    console.error('[Analytics] Failed to track email event:', error);
  }
}
