/**
 * Admin Authentication Module
 * Two mechanisms:
 * 1. INSTITUTIONAL PASSWORD (new) - for Agent APIs
 * 2. SUPABASE AUTH (existing) - for admin.tsx panel
 *
 * The institutional mechanism is independent.
 * Can coexist with Supabase Auth.
 */

import {
  verifyAdminSessionToken,
  extractSessionToken,
  parseCookies,
} from "./institutional-auth.server";
import { verifyAdminSession } from "../core/security.server";

export interface AdminContext {
  method: "institutional" | "supabase";
  authenticated: boolean;
}

/**
 * Verify admin via institutional password session.
 * Used by /api/admin/agent and /api/admin/* endpoints.
 */
export function verifyInstitutionalSession(
  cookieHeader: string | null,
): boolean {
  if (!cookieHeader) {
    return false;
  }

  const cookies = parseCookies(cookieHeader);
  const token = extractSessionToken(cookies);

  if (!token) {
    return false;
  }

  return verifyAdminSessionToken(token);
}

/**
 * Verify admin via existing Supabase Auth.
 * Used by /admin panel routes.
 */
export async function verifySupabaseAdminSession(
  userId: string | null,
): Promise<boolean> {
  return verifyAdminSession(userId);
}

/**
 * Determine which auth method to use for a request.
 * Priority: institutional > supabase
 */
export async function getAdminContext(
  cookieHeader: string | null,
  userId: string | null,
): Promise<AdminContext> {
  // Check institutional auth first (priority for new Agent APIs)
  if (verifyInstitutionalSession(cookieHeader)) {
    return {
      method: "institutional",
      authenticated: true,
    };
  }

  // Fall back to Supabase if available
  if (userId && (await verifySupabaseAdminSession(userId))) {
    return {
      method: "supabase",
      authenticated: true,
    };
  }

  return {
    method: "institutional",
    authenticated: false,
  };
}
