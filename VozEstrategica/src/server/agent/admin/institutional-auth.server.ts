/**
 * Institutional Admin Authentication
 * Password-based authentication for admin panel.
 * Server-side only. Uses secure cookies.
 *
 * This is separate from Supabase Auth.
 * Can coexist with existing individual auth.
 */

import { createHash, randomBytes, timingSafeEqual } from "crypto";

const ADMIN_SESSION_COOKIE_NAME = "voz-admin-session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface AdminSession {
  timestamp: number;
  nonce: string;
}

/**
 * Validate institutional password.
 * Timing-safe comparison to prevent timing attacks.
 */
export function verifyInstitutionalPassword(inputPassword: string): boolean {
  const secretPassword = process.env.ADMIN_CONTROL_SECRET;

  if (!secretPassword) {
    console.error("[Institutional Auth] ADMIN_CONTROL_SECRET not configured");
    return false;
  }

  if (!inputPassword) {
    return false;
  }

  try {
    // Hash both to same length before comparing
    const inputHash = createHash("sha256").update(inputPassword).digest();
    const secretHash = createHash("sha256").update(secretPassword).digest();

    // Timing-safe comparison
    return timingSafeEqual(inputHash, secretHash);
  } catch (err) {
    console.error("[Institutional Auth] Error comparing password:", err);
    return false;
  }
}

/**
 * Create admin session token.
 * Signed with ADMIN_SESSION_SECRET.
 */
export function createAdminSessionToken(): string {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!sessionSecret) {
    throw new Error("ADMIN_SESSION_SECRET not configured");
  }

  const nonce = randomBytes(16).toString("hex");
  const timestamp = Date.now().toString();

  // Simple signature: hash(timestamp + nonce + secret)
  const toSign = `${timestamp}.${nonce}`;
  const signature = createHash("sha256")
    .update(toSign + sessionSecret)
    .digest("hex");

  return `${toSign}.${signature}`;
}

/**
 * Verify admin session token.
 * Returns true if valid and not expired.
 */
export function verifyAdminSessionToken(token: string): boolean {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!sessionSecret || !token) {
    return false;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    const [timestamp, nonce, providedSignature] = parts;
    const toSign = `${timestamp}.${nonce}`;
    const expectedSignature = createHash("sha256")
      .update(toSign + sessionSecret)
      .digest("hex");

    // Verify signature (timing-safe)
    const providedBuf = Buffer.from(providedSignature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (providedBuf.length !== expectedBuf.length) {
      return false;
    }

    if (!timingSafeEqual(providedBuf, expectedBuf)) {
      return false;
    }

    // Verify not expired
    const sessionTime = parseInt(timestamp);
    const now = Date.now();
    const isExpired = now - sessionTime > SESSION_DURATION_MS;

    return !isExpired;
  } catch (err) {
    console.error("[Institutional Auth] Error verifying token:", err);
    return false;
  }
}

/**
 * Extract session token from cookies object.
 */
export function extractSessionToken(cookies: Record<string, string>): string | null {
  return cookies[ADMIN_SESSION_COOKIE_NAME] || null;
}

/**
 * Cookie helper: create Set-Cookie header value for admin session.
 */
export function getSessionCookieHeader(token: string, secure: boolean): string {
  const isProduction = process.env.NODE_ENV === "production";
  const secureFla = isProduction || secure ? "Secure;" : "";

  return [
    `${ADMIN_SESSION_COOKIE_NAME}=${token}`,
    "HttpOnly",
    secureFla,
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${SESSION_DURATION_MS / 1000}`,
  ].join("; ");
}

/**
 * Cookie helper: clear admin session.
 */
export function getClearSessionCookieHeader(): string {
  return `${ADMIN_SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

/**
 * Parse cookies from Set-Cookie or Cookie header.
 */
export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}
