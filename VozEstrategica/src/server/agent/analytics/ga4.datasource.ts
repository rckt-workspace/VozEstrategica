/**
 * GA4 Data Source
 * NOT YET CONFIGURED
 *
 * When ready, implement:
 * - GA4 Data API authentication
 * - Traffic metrics
 * - User engagement
 * - Event tracking
 */

import type { EngagementMetrics } from "../admin/business-intelligence.types";

export async function getGA4Metrics(): Promise<EngagementMetrics> {
  return {
    traffic: {
      uniqueUsers: 0,
      sessions: 0,
      engagedSessions: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
    },
    topPages: [],
    events: {},
    lastUpdated: new Date().toISOString(),
  };
}

export function isGA4Configured(): boolean {
  return !!process.env.GA4_PROPERTY_ID;
}
