import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { AdminAgentRequestSchema } from "@/lib/agent-schemas";
import { verifySession, runAdminAgent } from "@/lib/agent-server-boundaries";

/**
 * POST /api/admin/agent
 * Admin agent endpoint (CEO copilot).
 * REQUIRES institutional admin session cookie.
 * Authentication validated server-side.
 */
export const Route = createFileRoute("/api/admin/agent")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Verify admin session
          const cookieHeader = request.headers.get("Cookie");
          const isAuthenticated = await verifySession(cookieHeader);

          if (!isAuthenticated) {
            return new Response(
              JSON.stringify({ error: "Admin authentication required" }),
              {
                status: 401,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          // Parse request
          const body = await request.json();

          // Validate input
          const parsed = AdminAgentRequestSchema.safeParse(body);
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

          // Execute admin agent
          const response = await runAdminAgent(parsed.data);

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
          console.error("[AdminAgent] Error:", err);

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
