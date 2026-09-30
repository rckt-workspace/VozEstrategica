import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ControlOverviewResponseSchema, type ControlOverviewResponse } from "@/lib/control-overview-schema";
import { verifySession, fetchControlOverview } from "@/lib/agent-server-boundaries";

/**
 * GET /api/control/overview
 * Fetch KPIs for Centro Maestro dashboard.
 * REQUIRES institutional admin session cookie.
 *
 * Calls Supabase Edge Function with RCKT_INTERNAL_SECRET.
 * The Edge Function runs inside Supabase with full SERVICE_ROLE access.
 * Never expose credentials to browser.
 */
export const Route = createFileRoute("/api/control/overview")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          // 1. Verify admin session (institutional auth)
          const cookieHeader = request.headers.get("Cookie");
          const isAuthenticated = await verifySession(cookieHeader);

          if (!isAuthenticated) {
            return new Response(
              JSON.stringify({ success: false, error: "Unauthorized" }),
              {
                status: 401,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          // 2. Call Supabase Edge Function with internal secret
          const result = await fetchControlOverview();

          // 3. Parse and validate response
          const validated = ControlOverviewResponseSchema.safeParse(result);

          if (!validated.success) {
            console.error("[ControlOverview] Invalid response schema:", validated.error);
            return new Response(
              JSON.stringify({ success: false, error: "Unable to load control overview" }),
              {
                status: 500,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          // 4. Return validated data
          return new Response(JSON.stringify(validated.data as ControlOverviewResponse), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          });
        } catch (error) {
          console.error(
            "[ControlOverview] Error:",
            error instanceof Error ? error.message : "Unknown error"
          );

          return new Response(
            JSON.stringify({ success: false, error: "Unable to load control overview" }),
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
