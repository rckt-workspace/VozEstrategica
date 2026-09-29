import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { verifyInstitutionalSession } from "@/server/agent/admin/admin-auth.server";
import { ControlOverviewResponseSchema, type ControlOverviewResponse } from "@/lib/control-overview-schema";

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
          const isAuthenticated = verifyInstitutionalSession(cookieHeader);

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
          const RCKT_INTERNAL_SECRET = process.env.RCKT_INTERNAL_SECRET;
          const SUPABASE_URL = process.env.SUPABASE_URL;

          if (!RCKT_INTERNAL_SECRET || !SUPABASE_URL) {
            console.error("[ControlOverview] Missing internal secret or Supabase URL");
            return new Response(
              JSON.stringify({ success: false, error: "Unable to load control overview" }),
              {
                status: 503,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/control-overview`;
          const edgeResponse = await fetch(edgeFunctionUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RCKT_INTERNAL_SECRET}`,
              "Cache-Control": "no-store",
            },
          });

          if (!edgeResponse.ok) {
            console.error(
              `[ControlOverview] Edge Function error: ${edgeResponse.status}`,
              await edgeResponse.text()
            );

            // Still return valid response structure but mark as unavailable
            return new Response(
              JSON.stringify({
                success: true,
                data: {
                  timestamp: new Date().toISOString(),
                  kpis: {
                    solicitudes: { available: false, total: null },
                    subscribers: { available: false, total: null },
                    pedidos: { available: false, total: null, aprobados: null, pendientes: null },
                    speakers: { available: false, total: null },
                    books: { available: false, total: null },
                    events: { available: false, total: null },
                  },
                  series: {},
                },
              }),
              {
                status: 200,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          // 3. Parse and validate response
          const data = await edgeResponse.json();
          const validated = ControlOverviewResponseSchema.safeParse({ success: true, data });

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
