import { callOpenRouter } from "../llm/openrouter.provider.server";
import { getVozKnowledgeContext } from "../knowledge/voz.knowledge.server";
import { PUBLIC_SYSTEM_PROMPT } from "./public-system.prompt.server";
import { buildPublicTools } from "./public-tools.server";
import type {
  PublicAgentResponse,
  AgentIntent,
  Recommendation,
  SafeSignals,
} from "../core/agent.types";

export interface PublicAgentInput {
  message: string;
  sessionId?: string;
  history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

/**
 * Execute Public Agent conversation.
 * This is the main orchestrator for the public-facing AI assistant.
 */
export async function executePublicAgent(
  input: PublicAgentInput,
): Promise<PublicAgentResponse> {
  try {
    // 1. Build knowledge context
    const knowledgeContext = await getVozKnowledgeContext();

    // 2. Prepare system message
    const systemPrompt = PUBLIC_SYSTEM_PROMPT + "\n\n" + knowledgeContext;

    // 3. Build message history
    const messages: Array<{ role: string; content: string }> = [
      ...((input.history ?? []) as Array<{ role: string; content: string }>),
      { role: "user", content: input.message },
    ];

    // 4. Call LLM
    const response = await callOpenRouter([
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ]);

    // 5. Parse response and extract signals
    const intent = parseIntent(input.message);
    const recommendations = parseRecommendations(response, intent);
    const nextAction = determineNextAction(intent, recommendations);
    const signals = extractSafeSignals(intent, recommendations, nextAction);

    return {
      message: response,
      intent,
      recommendations,
      nextAction,
      signals,
    };
  } catch (err) {
    console.error("[PublicAgent] Error:", err);

    // Return graceful error response
    return {
      message: "Disculpa, estoy teniendo dificultades técnicas. ¿Puedo ayudarte de otra forma?",
      intent: {
        category: "unknown",
        stage: "exploring",
      },
      recommendations: [],
      nextAction: {
        type: "contact",
        label: "Contactar equipo",
        href: "https://wa.me/573106598108",
      },
      signals: {},
    };
  }
}

/**
 * Parse user intent from message.
 * Simple heuristics — can be enhanced with NLP later.
 */
function parseIntent(message: string): AgentIntent {
  const lower = message.toLowerCase();

  // Simple keyword matching
  if (
    lower.includes("speaker") ||
    lower.includes("conferencista") ||
    lower.includes("quien habla")
  ) {
    return {
      category: "speaker",
      stage: "exploring",
    };
  }

  if (
    lower.includes("programa") ||
    lower.includes("formación") ||
    lower.includes("capacitación")
  ) {
    return {
      category: "training",
      stage: "considering",
    };
  }

  if (
    lower.includes("libro") ||
    lower.includes("recurso") ||
    lower.includes("contenido")
  ) {
    return {
      category: "content",
      stage: "exploring",
    };
  }

  if (
    lower.includes("evento") ||
    lower.includes("conferencia") ||
    lower.includes("masterclass")
  ) {
    return {
      category: "event",
      stage: "exploring",
    };
  }

  if (
    lower.includes("contratar") ||
    lower.includes("presupuesto") ||
    lower.includes("propuesta")
  ) {
    return {
      category: "commercial",
      stage: "high_intent",
    };
  }

  if (
    lower.includes("pago") ||
    lower.includes("compra") ||
    lower.includes("checkout")
  ) {
    return {
      category: "payment_help",
      stage: "high_intent",
    };
  }

  return {
    category: "general_information",
    stage: "exploring",
  };
}

/**
 * Extract recommendations from response.
 * Simple extraction — can be enhanced with structured outputs.
 */
function parseRecommendations(
  _response: string,
  _intent: AgentIntent,
): Recommendation[] {
  // Placeholder: extract recommendations from LLM response
  // For now, return empty array — will be enhanced in next phase
  return [];
}

/**
 * Determine next action based on intent and context.
 */
function determineNextAction(
  intent: AgentIntent,
  recommendations: Recommendation[],
) {
  if (intent.stage === "high_intent") {
    if (intent.category === "commercial" || intent.category === "payment_help") {
      return {
        type: "whatsapp",
        label: "Contactar vía WhatsApp",
        href: "https://wa.me/573106598108",
      };
    }
  }

  if (recommendations.length > 0) {
    return {
      type: "navigate",
      label: "Ver recomendación",
      href: `/speakers/${recommendations[0].slug || ""}`,
    };
  }

  return null;
}

/**
 * Extract safe signals for analytics (NO sensitive data).
 */
function extractSafeSignals(
  intent: AgentIntent,
  recommendations: Recommendation[],
  nextAction: ReturnType<typeof determineNextAction>,
): SafeSignals {
  return {
    interestCategory: intent.category,
    commercialStage: intent.stage,
    recommendationType:
      recommendations.length > 0 ? recommendations[0].type : undefined,
    conversionIntent: intent.stage === "high_intent",
  };
}
