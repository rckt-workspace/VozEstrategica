// Envía un email a tatinsu83@gmail.com cuando un pedido de libro cambia a "aprobado".
// Disparado por trigger AFTER UPDATE en public.pedidos_libros vía pg_net.
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

  let p: {
    id?: string;
    nombre_completo?: string;
    email?: string;
    telefono?: string;
    libro?: string;
    formato?: string;
    cantidad?: number;
    total?: number;
    direccion?: string | null;
    ciudad?: string | null;
    departamento?: string | null;
    updated_at?: string;
  };
  try {
    p = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const monto = typeof p.total === "number"
    ? "$" + p.total.toLocaleString("es-CO") + " COP"
    : "—";
  const when = p.updated_at ?? new Date().toISOString();
  const fecha = new Date(when).toLocaleString("es-CO", { timeZone: "America/Bogota" });

  const envio = p.formato === "fisico"
    ? `<h3>Envío</h3><p>${p.direccion ?? ""}<br>${p.ciudad ?? ""}, ${p.departamento ?? ""}</p>`
    : "";

  const html = `<h2>Nueva compra de libro aprobada</h2>
<p><strong>Libro:</strong> ${p.libro ?? "—"} (${p.formato ?? "—"})</p>
<p><strong>Cantidad:</strong> ${p.cantidad ?? "—"}</p>
<p><strong>Monto:</strong> ${monto}</p>
<p><strong>Fecha:</strong> ${fecha} (hora Colombia)</p>
<h3>Comprador</h3>
<p>${p.nombre_completo ?? ""}<br>${p.email ?? ""}<br>${p.telefono ?? ""}</p>
${envio}
<p style="color:#666;font-size:12px">Pedido ${p.id ?? ""}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY_TO],
      subject: `Compra aprobada: ${p.libro ?? "libro"} — ${p.nombre_completo ?? ""}`,
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
