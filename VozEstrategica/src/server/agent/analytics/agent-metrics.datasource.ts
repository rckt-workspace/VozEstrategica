/**
 * Agent Metrics Data Source
 * Tracks Public Agent performance and engagement.
 *
 * In future, will integrate with:
 * - Agent conversation logs
 * - Intent tracking
 * - Recommendation effectiveness
 * - Lead generation attribution
 */

import type { AgentMetrics } from "../admin/business-intelligence.types";

export async function getAgentMetrics(period: string): Promise<AgentMetrics> {
  // Placeholder: no agent metrics storage yet
  // In future, create agent_conversations table to track:
  // - conversation_id
  // - user_session_id
  // - intent_category
  // - commercial_stage
  // - recommendations_shown
  // - actions_taken
  // - converted_to_contact
  // - timestamp

  return {
    period,
    conversations: {
      totalConversations: 0,
      byIntent: {},
      byStage: {},
      conversionRate: 0,
      avgMessagesPerConversation: 0,
    },
    leadGeneration: 0,
    recommendationClicks: 0,
    contactAttempts: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export function isAgentMetricsConfigured(): boolean {
  // In future, check if agent_conversations table exists
  return false;
}
