// Supabase Edge Function for Centro Maestro overview
// Called by Hostinger backend with RCKT_INTERNAL_SECRET
// Returns aggregated business metrics

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const RCKT_INTERNAL_SECRET = Deno.env.get("RCKT_INTERNAL_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!RCKT_INTERNAL_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("[control-overview] Missing environment variables");
}

interface Metric {
  available: boolean;
  total: number | null;
  last7Days?: number | null;
  last30Days?: number | null;
}

interface PedidoMetric extends Metric {
  aprobados?: number | null;
  pendientes?: number | null;
  rechazados?: number | null;
}

interface ResponseData {
  timestamp: string;
  kpis: {
    solicitudes: Metric;
    subscribers: Metric;
    pedidos: PedidoMetric;
    speakers: Metric;
    books: Metric;
    events: Metric;
    revenue?: { available: boolean; total: number | null; aprobado: number | null };
  };
  series: Record<string, unknown>;
}

Deno.serve(async (req) => {
  // Only accept POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "content-type": "application/json" } });
  }

  // Verify internal secret
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!RCKT_INTERNAL_SECRET || token !== RCKT_INTERNAL_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  try {
    // Create Supabase admin client (has SERVICE_ROLE_KEY access)
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all metrics in parallel
    const [
      bookingRequestsRes,
      subscribersRes,
      pedidosRes,
      speakersRes,
      booksRes,
      eventsRes,
    ] = await Promise.all([
      supabase.from("booking_requests").select("id,created_at,estado"),
      supabase.from("subscribers").select("id,created_at"),
      supabase.from("pedidos_libros").select("id,created_at,estado"),
      supabase.from("speakers").select("id"),
      supabase.from("books").select("id"),
      supabase.from("events").select("id,fecha"),
    ]);

    // Parse data
    const bookingRequests = bookingRequestsRes.data || [];
    const subscribers = subscribersRes.data || [];
    const pedidos = pedidosRes.data || [];
    const speakers = speakersRes.data || [];
    const books = booksRes.data || [];
    const events = eventsRes.data || [];

    // Calculate metrics
    const requestsLast7 = bookingRequests.filter(
      (s) => new Date(s.created_at) > last7Days
    ).length;
    const requestsLast30 = bookingRequests.filter(
      (s) => new Date(s.created_at) > last30Days
    ).length;

    const subscribersLast7 = subscribers.filter(
      (s) => new Date(s.created_at) > last7Days
    ).length;
    const subscribersLast30 = subscribers.filter(
      (s) => new Date(s.created_at) > last30Days
    ).length;

    const pedidosAprobados = pedidos.filter((p) => p.estado === "aprobado").length;
    const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length;
    const pedidosRechazados = pedidos.filter((p) => p.estado === "rechazado").length;

    const response: ResponseData = {
      timestamp: now.toISOString(),
      kpis: {
        solicitudes: {
          available: bookingRequestsRes.error === null,
          total: bookingRequests.length || null,
          last7Days: requestsLast7 || null,
          last30Days: requestsLast30 || null,
        },
        subscribers: {
          available: subscribersRes.error === null,
          total: subscribers.length || null,
          last7Days: subscribersLast7 || null,
          last30Days: subscribersLast30 || null,
        },
        pedidos: {
          available: pedidosRes.error === null,
          total: pedidos.length || null,
          aprobados: pedidosAprobados || null,
          pendientes: pedidosPendientes || null,
          rechazados: pedidosRechazados || null,
        },
        speakers: {
          available: speakersRes.error === null,
          total: speakers.length || null,
        },
        books: {
          available: booksRes.error === null,
          total: books.length || null,
        },
        events: {
          available: eventsRes.error === null,
          total: events.length || null,
        },
      },
      series: {},
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("[control-overview] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
});
