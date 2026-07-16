import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/meta-pixel";
import { trackGA4Event } from "@/lib/ga4";
import { recordOrder } from "@/lib/orders.functions";

type BoldStatus = "approved" | "rejected" | "pending" | "failed" | "unknown";

type StoredOrder = {
  orderId: string;
  amount: string;
  currency: "USD" | "COP";
  description: string;
};

export const Route = createFileRoute("/masterclass/gracias")({
  head: () => ({
    meta: [
      { title: "Gracias · Masterclass De Clientes a Fans" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    "bold-order-id": typeof search["bold-order-id"] === "string" ? (search["bold-order-id"] as string) : undefined,
    "bold-tx-status": typeof search["bold-tx-status"] === "string" ? (search["bold-tx-status"] as string) : undefined,
  }),
  component: GraciasPage,
});

const BRAND = "#40ed51";
const BLACK = "#0e0f0c";

function normalizeStatus(s?: string): BoldStatus {
  if (!s) return "unknown";
  const v = s.toLowerCase();
  if (v.includes("approv")) return "approved";
  if (v.includes("reject")) return "rejected";
  if (v.includes("pend")) return "pending";
  if (v.includes("fail") || v.includes("error")) return "failed";
  return "unknown";
}

function GraciasPage() {
  const search = Route.useSearch();
  const orderId = search["bold-order-id"];
  const status = useMemo(() => normalizeStatus(search["bold-tx-status"]), [search]);
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [orderLoaded, setOrderLoaded] = useState(false);
  const saveOrder = useServerFn(recordOrder);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("bold:last-order");
      if (raw) setOrder(JSON.parse(raw) as StoredOrder);
    } catch {
      /* ignore */
    }
    setOrderLoaded(true);
  }, []);

  // Register order in our database (once per orderId+status), only after
  // the persisted order details have been read from sessionStorage.
  useEffect(() => {
    if (!orderId || !orderLoaded) return;
    // If the stored order matches this orderId, wait until it's populated
    // so we don't persist a row without amount/currency/description.
    const key = `bold:order-recorded:${orderId}:${status}`;
    if (sessionStorage.getItem(key)) return;
    saveOrder({
      data: {
        orderId,
        status,
        amount: order?.amount ? Number(order.amount) : undefined,
        currency: order?.currency,
        description: order?.description,
      },
    })
      .then(() => sessionStorage.setItem(key, "1"))
      .catch(() => {
        /* allow retry on next mount */
      });
  }, [orderId, status, order, orderLoaded, saveOrder]);

  // Fire conversion events once on success
  useEffect(() => {
    if (status !== "approved" || !orderId) return;
    const firedKey = `bold:purchase-fired:${orderId}`;
    if (sessionStorage.getItem(firedKey)) return;

    const value = order?.currency === "USD" ? Number(order.amount) : 20;
    const currency = order?.currency ?? "USD";

    trackEvent("Purchase", {
      value,
      currency,
      content_name: order?.description ?? "Masterclass: De clientes a fans",
      order_id: orderId,
    });
    trackGA4Event("purchase", {
      transaction_id: orderId,
      value,
      currency,
      items: [
        {
          item_id: "masterclass-clientes-a-fans",
          item_name: order?.description ?? "Masterclass: De clientes a fans",
          price: value,
          quantity: 1,
        },
      ],
    });
    sessionStorage.setItem(firedKey, "1");
  }, [status, orderId, order]);

  const isApproved = status === "approved";
  const isPending = status === "pending";
  const isFail = status === "rejected" || status === "failed";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: BLACK, color: "#fff", fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
        {isApproved && (
          <>
            <CheckCircle2 className="mb-6 h-16 w-16" style={{ color: BRAND }} strokeWidth={1.5} />
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: BRAND }}>
              Pago aprobado
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              ¡Tu cupo está reservado!
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
              En los próximos minutos te llega un correo con el enlace de Zoom, el calendario y los recursos
              de la masterclass. Si no lo ves, revisa tu carpeta de Promociones o Spam.
            </p>
          </>
        )}

        {isPending && (
          <>
            <Clock className="mb-6 h-16 w-16 text-yellow-400" strokeWidth={1.5} />
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-400">
              Pago en revisión
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Estamos confirmando tu pago</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
              Tu transacción quedó en proceso. En cuanto se apruebe te enviaremos por correo el acceso a la
              masterclass. No hace falta volver a pagar.
            </p>
          </>
        )}

        {isFail && (
          <>
            <XCircle className="mb-6 h-16 w-16 text-red-400" strokeWidth={1.5} />
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">
              Pago no procesado
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">No pudimos cobrar tu pago</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
              La transacción no se completó. Puedes intentarlo de nuevo con la misma tarjeta u otro método de
              pago. Si el problema persiste, escríbenos a contacto@vozestrategica.com.
            </p>
          </>
        )}

        {status === "unknown" && (
          <>
            <Clock className="mb-6 h-16 w-16 text-white/60" strokeWidth={1.5} />
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Estamos verificando tu pago</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
              Si completaste el pago, recibirás el acceso por correo en unos minutos.
            </p>
          </>
        )}

        {orderId && (
          <p className="mt-8 rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/60">
            Referencia: <span className="font-mono text-white/80">{orderId}</span>
          </p>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {isFail ? (
            <Link
              to="/masterclass-de-clientes-a-fans"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[6px] px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#0e0f0c]"
              style={{ backgroundColor: BRAND }}
            >
              Reintentar el pago <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/masterclass-de-clientes-a-fans"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[6px] border border-white/20 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/5"
            >
              Volver a la masterclass
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex min-h-[52px] items-center justify-center px-6 py-3 text-sm font-semibold text-white/60 hover:text-white"
          >
            Ir al sitio principal
          </Link>
        </div>
      </div>
    </div>
  );
}
