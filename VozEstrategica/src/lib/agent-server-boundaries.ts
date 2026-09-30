/**
 * Server-Only Boundaries for Agent Operations
 *
 * These functions use createServerOnlyFn to ensure server-side logic
 * and imports from @/server/** are tree-shaken from the client bundle.
 * The compiler recognizes createServerOnlyFn and eliminates both the
 * function and its dependencies from the client graph.
 */

import { createServerOnlyFn } from "@tanstack/react-start";
import type { PublicAgentRequest, AdminAgentRequest } from "./agent-schemas";

/**
 * Verify institutional password (for admin login)
 */
export const verifyPassword = createServerOnlyFn(
  async (password: string): Promise<boolean> => {
    const { verifyInstitutionalPassword } = await import(
      "@/server/agent/admin/institutional-auth.server"
    );
    return verifyInstitutionalPassword(password);
  }
);

/**
 * Create admin session token
 */
export const createSessionToken = createServerOnlyFn(
  async (): Promise<string> => {
    const { createAdminSessionToken } = await import(
      "@/server/agent/admin/institutional-auth.server"
    );
    return createAdminSessionToken();
  }
);

/**
 * Get Set-Cookie header for session
 */
export const getSessionCookie = createServerOnlyFn(
  async (token: string, isSecure: boolean): Promise<string> => {
    const { getSessionCookieHeader } = await import(
      "@/server/agent/admin/institutional-auth.server"
    );
    return getSessionCookieHeader(token, isSecure);
  }
);

/**
 * Get Set-Cookie header to clear session
 */
export const getClearSessionCookie = createServerOnlyFn(
  async (): Promise<string> => {
    const { getClearSessionCookieHeader } = await import(
      "@/server/agent/admin/institutional-auth.server"
    );
    return getClearSessionCookieHeader();
  }
);

/**
 * Parse cookies from header
 */
export const parseCookiesFromHeader = createServerOnlyFn(
  async (cookieHeader: string): Promise<Record<string, string>> => {
    const { parseCookies } = await import(
      "@/server/agent/admin/institutional-auth.server"
    );
    return parseCookies(cookieHeader);
  }
);

/**
 * Extract session token from parsed cookies
 */
export const getSessionTokenFromCookies = createServerOnlyFn(
  async (cookies: Record<string, string>): Promise<string | null> => {
    const { extractSessionToken } = await import(
      "@/server/agent/admin/institutional-auth.server"
    );
    return extractSessionToken(cookies);
  }
);

/**
 * Verify admin session token
 */
export const verifySessionToken = createServerOnlyFn(
  async (token: string): Promise<boolean> => {
    const { verifyAdminSessionToken } = await import(
      "@/server/agent/admin/institutional-auth.server"
    );
    return verifyAdminSessionToken(token);
  }
);

/**
 * Verify institutional session from cookie header
 */
export const verifySession = createServerOnlyFn(
  async (cookieHeader: string | null): Promise<boolean> => {
    const { verifyInstitutionalSession } = await import(
      "@/server/agent/admin/admin-auth.server"
    );
    return verifyInstitutionalSession(cookieHeader);
  }
);

/**
 * Execute public agent
 */
export const runPublicAgent = createServerOnlyFn(
  async (request: PublicAgentRequest): Promise<unknown> => {
    const { executePublicAgent } = await import(
      "@/server/agent/public/public-agent.service.server"
    );
    return executePublicAgent(request);
  }
);

/**
 * Execute admin agent
 */
export const runAdminAgent = createServerOnlyFn(
  async (request: AdminAgentRequest): Promise<unknown> => {
    const { executeAdminAgent } = await import(
      "@/server/agent/admin/admin-agent.service.server"
    );
    return executeAdminAgent(request);
  }
);

/**
 * Call control overview edge function
 */
export const fetchControlOverview = createServerOnlyFn(
  async (): Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }> => {
    const RCKT_INTERNAL_SECRET = process.env.RCKT_INTERNAL_SECRET;
    const SUPABASE_URL = process.env.SUPABASE_URL;

    if (!RCKT_INTERNAL_SECRET || !SUPABASE_URL) {
      return {
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
      };
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
      return {
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
      };
    }

    return {
      success: true,
      data: await edgeResponse.json(),
    };
  }
);
