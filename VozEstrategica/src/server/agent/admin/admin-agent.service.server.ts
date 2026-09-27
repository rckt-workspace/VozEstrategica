import { callOpenRouter } from "../llm/openrouter.provider.server";
import { ADMIN_SYSTEM_PROMPT } from "./admin-system.prompt.server";
import type {
  AdminAgentResponse,
  ExecutiveInsight,
  Forecast,
  DataSourceRef,
} from "../core/agent.types";

export interface AdminAgentInput {
  query: string;
  context?: {
    period?: string;
    metric?: string;
    datasources?: string[];
  };
}

/**
 * Execute Admin Agent conversation.
 * CEO copilot with access to business intelligence.
 * SECURITY: Always verify admin access before calling this.
 */
export async function executeAdminAgent(
  input: AdminAgentInput,
): Promise<AdminAgentResponse> {
  try {
    // 1. Build context (would include BI data when datasources are ready)
    const adminContext = buildAdminContext(input.context);

    // 2. Prepare system message
    const systemPrompt = ADMIN_SYSTEM_PROMPT + "\n\n" + adminContext;

    // 3. Call LLM
    const response = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: input.query },
    ]);

    // 4. Extract insights and recommendations
    const insights = parseInsights(response);
    const recommendations = parseRecommendations(response);
    const forecasts = parseForecasts(response);
    const sourcesUsed = determineSourcesUsed(input.context?.datasources);

    return {
      message: response,
      insights,
      recommendations,
      forecasts,
      sourcesUsed,
      dataFreshness: {
        supabase: new Date().toISOString(),
        // ga4: "pending configuration",
        // google_ads: "pending configuration",
      },
    };
  } catch (err) {
    console.error("[AdminAgent] Error:", err);

    return {
      message:
        "Error procesando consulta. Por favor intenta de nuevo o contacta soporte.",
      insights: [],
      recommendations: [],
      forecasts: [],
      sourcesUsed: [],
    };
  }
}

/**
 * Build context for admin agent.
 * In full implementation, this would fetch BI data from datasources.
 */
function buildAdminContext(
  context?: AdminAgentInput["context"],
): string {
  const sections: string[] = [];

  sections.push(`
=== COPILOTO EJECUTIVO - VOZ ESTRATÉGICA ===
Eres asesor estratégico basado en datos de la empresa.
Periodo: ${context?.period || "últimos 30 días"}
Métricas enfocadas: ${context?.metric || "general"}
Fuentes disponibles: ${context?.datasources?.join(", ") || "supabase"}

=== DATOS DISPONIBLES EN ESTA FASE ===
✓ Leads y solicitudes de contratación (booking_requests)
✓ Pedidos de libros (pedidos_libros)
✓ Órdenes de pago (orders)
✓ Suscriptores (subscribers)
✓ Catálogo: speakers, libros, eventos

⏳ Próximamente:
- GA4 traffic analytics
- Google Ads campaign metrics
- Funnel de conversión
- Métricas del agente

=== CAPACIDADES INICIALES ===
- Analizar leads y oportunidades
- Revisar tendencias de ventas
- Evaluar desempeño de programas
- Sugerir prioridades
- Detectar anomalías
- Proyectar escenarios
- NO ejecutar cambios (requiere aprobación humana)

=== HORIZONTES DE TIEMPO ===
- Corto plazo (7-30 días)
- Mediano plazo (1-6 meses)
- Largo plazo (6-24 meses)
`);

  return sections.join("\n");
}

/**
 * Parse insights from LLM response.
 * Simple extraction — will be enhanced with structured outputs.
 */
function parseInsights(_response: string): ExecutiveInsight[] {
  // Placeholder: extract insights from LLM response
  // In full implementation, use structured outputs or semantic parsing
  return [];
}

/**
 * Parse recommendations from response.
 */
function parseRecommendations(_response: string): string[] {
  // Placeholder
  return [];
}

/**
 * Parse forecasts from response.
 */
function parseForecasts(_response: string): Forecast[] {
  // Placeholder
  return [];
}

/**
 * Determine which data sources were used.
 */
function determineSourcesUsed(
  datasources?: string[],
): DataSourceRef[] {
  const used: DataSourceRef[] = [
    {
      source: "supabase",
      updatedAt: new Date().toISOString(),
    },
  ];

  if (datasources?.includes("ga4")) {
    used.push({
      source: "ga4",
      updatedAt: "not configured",
    });
  }

  if (datasources?.includes("google_ads")) {
    used.push({
      source: "google_ads",
      updatedAt: "not configured",
    });
  }

  return used;
}
