import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Verify admin session server-side.
 * DO NOT trust client-sent role or admin flags.
 * Validate against actual Supabase session and user_roles table.
 */
export async function verifyAdminSession(userId: string | null): Promise<boolean> {
  if (!userId) return false;

  try {
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !roles) return false;
    return roles.role === "admin";
  } catch (err) {
    console.error("[Agent Security] Error verifying admin role:", err);
    return false;
  }
}

/**
 * Extract user ID from Supabase auth token (server-side only).
 * For TanStack Start / Nitro context.
 */
export function extractUserFromToken(token?: string): string | null {
  if (!token) return null;

  try {
    // JWT is typically stored in Authorization: Bearer <token>
    // Supabase session tokens are JWTs with user info in payload
    // Decode without verification at this layer (Supabase client handles verification)
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return payload.sub || null;
  } catch (err) {
    return null;
  }
}

/**
 * Security assertion: ensures admin authorization.
 * Throws on failure — prevents accidental non-admin access to admin tools.
 */
export async function requireAdminAccess(userId: string | null): Promise<void> {
  const isAdmin = await verifyAdminSession(userId);
  if (!isAdmin) {
    throw new Error("Admin access required");
  }
}
