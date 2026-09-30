import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PublicAgentRequestSchema } from "@/lib/agent-schemas";
import { runPublicAgent } from "@/lib/agent-server-boundaries";

/**
 * POST /api/agent/chat
 * Public agent endpoint for website visitors.
 * No authentication required.
 */
export const Route = createFileRoute("/api/agent/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          // Validate input
          const parsed = PublicAgentRequestSchema.safeParse(body);
          if (!parsed.success) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Invalid request",
                details: parsed.error.flatten(),
              }),
              {
                status: 400,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          // Execute agent
          const response = await runPublicAgent(parsed.data);

          return new Response(
            JSON.stringify({
              success: true,
              data: response,
              timestamp: new Date().toISOString(),
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (err) {
          console.error("[AgentChat] Error:", err);

          const message = err instanceof Error ? err.message : "Error";

          if (message.includes("OPENROUTER_API_KEY")) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Agent service not configured",
              }),
              {
                status: 503,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          return new Response(
            JSON.stringify({
              success: false,
              error: "Agent error",
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
              },
            },
          );
        }
      },
    },
  },
});
