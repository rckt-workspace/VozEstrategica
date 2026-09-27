/**
 * Google Ads Data Source
 * NOT YET CONFIGURED
 *
 * When ready, implement:
 * - Google Ads API authentication
 * - Campaign metrics retrieval
 * - Spend tracking
 * - Conversion attribution
 */

import type { CampaignsMetrics } from "../admin/business-intelligence.types";

export async function getAdsMetrics(): Promise<CampaignsMetrics> {
  return {
    campaigns: [],
    totalSpend: 0,
    totalConversions: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export function isAdsConfigured(): boolean {
  return !!process.env.GOOGLE_ADS_CUSTOMER_ID;
}
