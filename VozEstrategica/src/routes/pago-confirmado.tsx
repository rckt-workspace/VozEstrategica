import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, XCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import { recordBookOrderStatus } from "@/lib/book-orders.functions";

export const Route = createFileRoute("/pago-confirmado")({
  head: () => ({
    meta: [
      { title: "Confirmación de pago — Voz Estratégica" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: typeof search.orderId === "string" ? search.orderId : undefined,
    "bold-order-id": typeof search["bold-order-id"] === "string" ? (search["bold-order-id"] as string) : undefined,
    "bold-tx-status": typeof search["bold-tx-status"] === "string" ? (search["bold-tx-status"] as string) : undefined,
  }),
  errorComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl uppercase">Algo salió mal</h1>
      <Link to="/recursos" className="mt-6 inline-block underline">Volver a /recursos</Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl uppercase">Página no encontrada</h1>
    </div>
  ),
  component: PagoConfirmadoPage,
});

type Pedido = {
  libro: string;
  formato: string;
  nombre_completo: string;
  cantidad: number;
  total: number;
  direccion: string | null;
  ciudad: string | null;
  departamento: string | null;
  estado_pago: string;
};

function PagoConfirmadoPage() {
  const search = Route.useSearch();
  const orderId = search["bold-order-id"] ?? search.orderId;
  const rawStatus = search["bold-tx-status"] ?? "";
  const record = useServerFn(recordBookOrderStatus);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [state, setState] = useState<"loading" | "aprobado" | "rechazado" | "pendiente" | "unknown">("loading");

  useEffect(() => {
    if (!orderId) {
      setState("unknown");
      return;
    }
    record({ data: { orderId, status: rawStatus } })
      .then((r) => {
        if (r.pedido) setPedido(r.pedido as Pedido);
        const s = (r.pedido?.estado_pago ?? "pendiente") as string;
        if (s === "aprobado" || s === "rechazado" || s === "pendiente") setState(s);
        else setState("unknown");
      })
      .catch(() => setState("unknown"));
  }, [orderId, rawStatus, record]);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      {state === "loading" && (
        <>
          <Loader2 className="mb-6 h-12 w-12 animate-spin text-foreground/50" />
          <h1 className="font-display text-3xl uppercase">Confirmando tu pago...</h1>
        </>
      )}

      {state === "aprobado" && (
        <>
          <CheckCircle2 className="mb-6 h-16 w-16 text-green-600" strokeWidth={1.5} />
          <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-widest text-green-700">
            Pago aprobado
          </p>
          <h1 className="font-display text-4xl uppercase leading-tight md:text-5xl">
            ¡Gracias por tu compra!
          </h1>
          {pedido && (
            <div className="mt-8 w-full rounded-2xl border border-foreground/10 bg-card p-6 text-left">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resumen</div>
              <div className="mt-2 flex justify-between">
                <span>{pedido.cantidad}× {pedido.libro}</span>
                <span className="font-semibold">${pedido.total.toLocaleString("es-CO")}</span>
              </div>
              {pedido.formato === "fisico" && pedido.direccion && (
                <div className="mt-4 rounded-lg bg-foreground/5 p-4 text-sm">
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Envío a</div>
                  <div>{pedido.nombre_completo}</div>
                  <div>{pedido.direccion}</div>
                  <div>{pedido.ciudad}, {pedido.departamento}</div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Tu pedido será empacado y despachado a esta dirección en los próximos días hábiles.
                  </p>
                </div>
              )}
              {pedido.formato === "digital" && (
                <p className="mt-4 rounded-lg bg-foreground/5 p-4 text-sm">
                  Te enviaremos el enlace de descarga a tu correo en los próximos minutos.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {state === "rechazado" && (
        <>
          <XCircle className="mb-6 h-16 w-16 text-red-500" strokeWidth={1.5} />
          <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-widest text-red-600">
            Pago no procesado
          </p>
          <h1 className="font-display text-3xl uppercase leading-tight md:text-4xl">
            No pudimos cobrar tu pago
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Puedes intentarlo de nuevo desde /recursos, o escríbenos a contacto@vozestrategica.com.
          </p>
        </>
      )}

      {(state === "pendiente" || state === "unknown") && (
        <>
          <Clock className="mb-6 h-16 w-16 text-yellow-500" strokeWidth={1.5} />
          <h1 className="font-display text-3xl uppercase">Estamos verificando tu pago</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            En cuanto se confirme la transacción te enviaremos un correo con los siguientes pasos.
          </p>
        </>
      )}

      {orderId && (
        <p className="mt-8 rounded-full border border-foreground/15 px-4 py-1.5 text-xs text-muted-foreground">
          Referencia: <span className="font-mono">{orderId}</span>
        </p>
      )}

      <Link
        to="/recursos"
        className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest underline"
      >
        Volver a Recursos <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
