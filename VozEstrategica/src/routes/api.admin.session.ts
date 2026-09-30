import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  verifyPassword,
  createSessionToken,
  getSessionCookie,
  getClearSessionCookie,
  parseCookiesFromHeader,
  getSessionTokenFromCookies,
  verifySessionToken,
} from "@/lib/agent-server-boundaries";

/**
 * POST /api/admin/session
 * Login with institutional password
 * Returns: { authenticated: true } + HttpOnly cookie
 *
 * DELETE /api/admin/session
 * Logout (clear session cookie)
 *
 * GET /api/admin/session
 * Check session status
 * Returns: { authenticated: true/false }
 */
export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json() as { password?: string };
          const password = body?.password;

          if (!password) {
            return new Response(
              JSON.stringify({ error: "Password required" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // Verify password
          const isValid = await verifyPassword(password);
          if (!isValid) {
            return new Response(
              JSON.stringify({ error: "Invalid password" }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          // Create session token
          const token = await createSessionToken();
          const isSecure = request.url.startsWith("https");
          const setCookieHeader = await getSessionCookie(token, isSecure);

          // Return with Set-Cookie header
          return new Response(
            JSON.stringify({ authenticated: true }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie": setCookieHeader,
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (err) {
          console.error("[AdminSession] POST error:", err);
          return new Response(
            JSON.stringify({ error: "Server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      DELETE: async ({ request }) => {
        try {
          const setCookieHeader = await getClearSessionCookie();

          // Clear session cookie
          return new Response(
            JSON.stringify({ authenticated: false }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie": setCookieHeader,
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (err) {
          console.error("[AdminSession] DELETE error:", err);
          return new Response(
            JSON.stringify({ error: "Server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      GET: async ({ request }) => {
        try {
          const cookieHeader = request.headers.get("Cookie");

          if (!cookieHeader) {
            return new Response(
              JSON.stringify({ authenticated: false }),
              {
                status: 200,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          const cookies = await parseCookiesFromHeader(cookieHeader);
          const token = await getSessionTokenFromCookies(cookies);
          const isValid = token ? await verifySessionToken(token) : false;

          return new Response(
            JSON.stringify({ authenticated: isValid }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (err) {
          console.error("[AdminSession] GET error:", err);
          return new Response(
            JSON.stringify({ authenticated: false }),
            {
              status: 200,
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
