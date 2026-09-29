// Shared types for Master Agent (Public & Admin)

export type AgentIntentCategory =
  | "general_information"
  | "speaker"
  | "training"
  | "program"
  | "consulting"
  | "content"
  | "event"
  | "book"
  | "payment_help"
  | "commercial"
  | "contact"
  | "unknown";

export type CommercialStage =
  | "exploring"
  | "considering"
  | "high_intent";

export interface AgentIntent {
  category: AgentIntentCategory;
  topic?: string;
  objective?: string;
  stage: CommercialStage;
}

export interface Recommendation {
  type:
    | "speaker"
    | "solution"
    | "program"
    | "resource"
    | "book"
    | "event"
    | "contact";

  slug?: string;
  title: string;
  reason: string;
}

export interface NextAction {
  type:
    | "navigate"
    | "whatsapp"
    | "contact"
    | "proposal"
    | "continue_conversation";

  label: string;
  href?: string;
}

export interface SafeSignals {
  interestCategory?: string;
  interestTopic?: string;
  commercialStage?: CommercialStage;
  recommendationType?: string;
  conversionIntent?: boolean;
}

export interface PublicAgentResponse {
  message: string;
  intent: AgentIntent;
  recommendations: Recommendation[];
  nextAction: NextAction | null;
  signals: SafeSignals;
}

export interface AdminAgentResponse {
  message: string;
  insights: ExecutiveInsight[];
  recommendations: string[];
  forecasts: Forecast[];
  sourcesUsed: DataSourceRef[];
  dataFreshness?: Record<string, string>;
}

export interface ExecutiveInsight {
  type:
    | "opportunity"
    | "risk"
    | "trend"
    | "anomaly"
    | "recommendation";

  title: string;
  explanation: string;
  evidence: string[];
  confidence?: number;
}

export interface Forecast {
  horizon: "short" | "medium" | "long";
  metric: string;
  projectedValue?: number;
  assumptions: string[];
  explanation: string;
}

export interface DataSourceRef {
  source:
    | "ga4"
    | "google_ads"
    | "supabase"
    | "agent_metrics"
    | "website"
    | "derived";

  updatedAt?: string;
}

export interface BusinessSnapshot {
  period: string;
  revenue?: number;
  orders?: number;
  leads?: number;
  qualifiedLeads?: number;
  conversionRate?: number;
}

export interface TrafficSnapshot {
  users?: number;
  sessions?: number;
  engagedSessions?: number;
  trafficSources?: unknown[];
  topPages?: unknown[];
}

export interface CampaignSnapshot {
  campaignId?: string;
  campaignName?: string;
  impressions?: number;
  clicks?: number;
  spend?: number;
  conversions?: number;
  conversionValue?: number;
}

export interface AgentSnapshot {
  conversations: number;
  usefulConversations?: number;
  interestByCategory: Record<string, number>;
  highIntentConversations?: number;
  contactConversions?: number;
}
