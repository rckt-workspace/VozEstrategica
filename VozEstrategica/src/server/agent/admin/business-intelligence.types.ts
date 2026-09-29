/**
 * Business Intelligence Data Types
 * Contracts for BI adapters to implement.
 * These are the interfaces data sources must provide.
 */

// ============ BUSINESS METRICS ============

export interface OrderMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
}

export interface LeadMetrics {
  totalLeads: number;
  newLeadsThisMonth: number;
  conversionRate: number;
  qualifiedLeads: number;
  averageLeadValue: number;
}

export interface SalesMetrics {
  totalBooksSold: number;
  bookRevenue: number;
  averageBookPrice: number;
  topSellingBook?: string;
  booksThisMonth: number;
}

export interface BusinessMetrics {
  period: string;
  orders: OrderMetrics;
  leads: LeadMetrics;
  sales: SalesMetrics;
  lastUpdated: string;
}

// ============ TRAFFIC & ENGAGEMENT ============

export interface TrafficMetrics {
  uniqueUsers: number;
  sessions: number;
  engagedSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
}

export interface PageMetrics {
  path: string;
  pageViews: number;
  uniqueUsers: number;
  avgTimeOnPage: number;
  conversionRate?: number;
}

export interface EngagementMetrics {
  traffic: TrafficMetrics;
  topPages: PageMetrics[];
  events: Record<string, number>;
  lastUpdated: string;
}

// ============ SPEAKER PERFORMANCE ============

export interface SpeakerMetrics {
  speakerId: string;
  name: string;
  inquiries: number;
  bookings: number;
  eventCount: number;
  avgRating?: number;
  conversionRate: number;
  revenue: number;
}

export interface ContentMetrics {
  speakers: SpeakerMetrics[];
  topSpeaker?: SpeakerMetrics;
  topicTrends: Record<string, number>;
  lastUpdated: string;
}

// ============ FUNNEL ANALYSIS ============

export interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
}

export interface FunnelMetrics {
  awareness: FunnelStage;
  consideration: FunnelStage;
  conversion: FunnelStage;
  dropoffPoints: string[];
  overallConversionRate: number;
  lastUpdated: string;
}

// ============ CAMPAIGN PERFORMANCE ============

export interface CampaignMetrics {
  campaignId: string;
  name: string;
  platform: "google_ads" | "social" | "email";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  cpa: number;
  roas?: number;
}

export interface CampaignsMetrics {
  campaigns: CampaignMetrics[];
  totalSpend: number;
  totalConversions: number;
  avgROAS?: number;
  bestPerformer?: CampaignMetrics;
  lastUpdated: string;
}

// ============ AGENT METRICS ============

export interface AgentConversationMetrics {
  totalConversations: number;
  byIntent: Record<string, number>;
  byStage: Record<string, number>;
  conversionRate: number;
  avgMessagesPerConversation: number;
}

export interface AgentMetrics {
  period: string;
  conversations: AgentConversationMetrics;
  leadGeneration: number;
  recommendationClicks: number;
  contactAttempts: number;
  lastUpdated: string;
}

// ============ INSIGHT & FORECAST ============

export interface MetricInsight {
  metric: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
  significance: "critical" | "high" | "medium" | "low";
}

export interface Projection {
  horizon: "week" | "month" | "quarter";
  metric: string;
  projected: number;
  confidence: number;
  assumptions: string[];
}

// ============ AGGREGATED BI SNAPSHOT ============

export interface BISnapshot {
  period: string;
  business: BusinessMetrics;
  engagement: EngagementMetrics;
  content: ContentMetrics;
  funnel: FunnelMetrics;
  campaigns?: CampaignsMetrics;
  agent?: AgentMetrics;
  insights: MetricInsight[];
  forecasts: Projection[];
  dataQuality: {
    completeFields: number;
    missingFields: number;
    lastSync: string;
  };
}
