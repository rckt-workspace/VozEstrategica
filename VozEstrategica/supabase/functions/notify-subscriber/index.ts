// Envía un email a tatinsu83@gmail.com cuando alguien se suscribe al newsletter.
// Disparado por trigger AFTER INSERT en public.subscribers vía pg_net.
const NOTIFY_TO = "tatinsu83@gmail.com";
const FROM = "Voz Estratégica <onboarding@resend.dev>";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secret = Deno.env.get("NOTIFY_WEBHOOK_TOKEN");
  if (!secret || req.headers.get("x-webhook-token") !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const RESEND = Deno.env.get("RESEND_API_KEY");
  if (!RESEND) return new Response("Missing RESEND_API_KEY", { status: 500 });

  let payload: { email?: string; source?: string; created_at?: string };
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const email = String(payload.email ?? "").trim();
  if (!email) return new Response("Missing email", { status: 400 });
  const source = payload.source ?? "—";
  const when = payload.created_at ?? new Date().toISOString();
  const fechaLegible = new Date(when).toLocaleString("es-CO", { timeZone: "America/Bogota" });

  const html = `<h2>Nuevo suscriptor al newsletter</h2>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Origen:</strong> ${source}</p>
<p><strong>Fecha:</strong> ${fechaLegible} (hora Colombia)</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY_TO],
      subject: `Nuevo suscriptor: ${email}`,
      html,
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    console.error("Resend error", res.status, body);
    return new Response(body, { status: 502 });
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
});
