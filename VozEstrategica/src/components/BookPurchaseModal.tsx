import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { createBookOrder, getConfiguracion } from "@/lib/book-orders.functions";
import type { BookSku, BookFormato } from "@/data/content";

const BOLD_SCRIPT_SRC = "https://checkout.bold.co/library/boldPaymentButton.js";

type BoldCheckoutInstance = { open: () => void };
declare global {
  interface Window {
    BoldCheckout?: new (config: Record<string, string>) => BoldCheckoutInstance;
  }
}

function loadBoldLibrary(): Promise<void> {
  if (window.BoldCheckout) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${BOLD_SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.BoldCheckout) return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Bold checkout failed to load")), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = BOLD_SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Bold checkout failed to load"));
    document.head.appendChild(s);
  });
}

const fmt = (n: number) => "$" + n.toLocaleString("es-CO");

type Props = {
  open: boolean;
  onClose: () => void;
  sku: BookSku;
  titulo: string;
  precio: number;
  formato: BookFormato;
};

export function BookPurchaseModal({ open, onClose, sku, titulo, precio, formato }: Props) {
  const create = useServerFn(createBookOrder);
  const getConfig = useServerFn(getConfiguracion);
  const [flete, setFlete] = useState(12000);
  const [cantidad, setCantidad] = useState(1);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    getConfig().then((r) => setFlete(r.flete_nacional)).catch(() => {});
  }, [open, getConfig]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const subtotal = useMemo(() => precio * cantidad, [precio, cantidad]);
  const fleteAplicado = formato === "fisico" ? flete : 0;
  const total = subtotal + fleteAplicado;

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      toast.error("Email no válido");
      return;
    }
    if (telefono.replace(/\D/g, "").length < 7) {
      toast.error("Teléfono no válido");
      return;
    }

    setLoading(true);
    try {
      await loadBoldLibrary();
      const order = await create({
        data: {
          sku,
          cantidad,
          nombre_completo: nombre,
          email,
          telefono,
          direccion: formato === "fisico" ? direccion : undefined,
          ciudad: formato === "fisico" ? ciudad : undefined,
          departamento: formato === "fisico" ? departamento : undefined,
        },
      });
      if (!window.BoldCheckout) throw new Error("Bold no disponible");
      const checkout = new window.BoldCheckout({
        apiKey: order.apiKey,
        amount: order.amount,
        currency: order.currency,
        orderId: order.orderId,
        integritySignature: order.integritySignature,
        description: order.description,
        redirectionUrl: `${window.location.origin}/pago-confirmado`,
        originUrl: window.location.href,
        renderMode: "embedded",
      });
      checkout.open();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      toast.error(msg);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative flex max-h-[95vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-background shadow-2xl sm:rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-foreground/5 p-2 hover:bg-foreground/10"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="border-b border-foreground/10 px-6 py-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Comprar libro
          </div>
          <h2 className="mt-1 font-display text-2xl uppercase leading-tight">{titulo}</h2>
          <div className="mt-1 text-lg font-semibold">{fmt(precio)} <span className="text-xs font-normal text-muted-foreground">c/u</span></div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          {/* Cantidad */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Cantidad
            </label>
            <div className="inline-flex items-center gap-1 rounded-full border border-foreground/15">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="rounded-full p-2 hover:bg-foreground/5 disabled:opacity-40"
                disabled={cantidad <= 1}
                aria-label="Disminuir"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-mono text-base font-bold">{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(20, c + 1))}
                className="rounded-full p-2 hover:bg-foreground/5"
                aria-label="Aumentar"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            <Field label="Nombre completo" value={nombre} onChange={setNombre} required autoComplete="name" />
            <Field label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
            <Field label="Teléfono (WhatsApp)" type="tel" value={telefono} onChange={setTelefono} required autoComplete="tel" />

            {formato === "fisico" && (
              <>
                <div className="mt-2 rounded-lg bg-foreground/5 px-3 py-2 text-xs text-muted-foreground">
                  Envío disponible solo dentro de Colombia.
                </div>
                <Field label="Dirección de envío" value={direccion} onChange={setDireccion} required autoComplete="street-address" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ciudad" value={ciudad} onChange={setCiudad} required autoComplete="address-level2" />
                  <Field label="Departamento" value={departamento} onChange={setDepartamento} required autoComplete="address-level1" />
                </div>
              </>
            )}
          </div>

          {/* Resumen */}
          <div className="mt-6 rounded-xl border border-foreground/10 bg-foreground/5 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{fmt(precio)} × {cantidad}</span>
              <span className="font-semibold">{fmt(subtotal)}</span>
            </div>
            {formato === "fisico" && (
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Envío nacional</span>
                <span className="font-semibold">{fmt(fleteAplicado)}</span>
              </div>
            )}
            <div className="mt-3 flex items-baseline justify-between border-t border-foreground/10 pt-3">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</span>
              <span className="font-display text-2xl">{fmt(total)}</span>
            </div>
          </div>
        </form>

        <div className="border-t border-foreground/10 bg-background px-6 py-4">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bubble bubble-yellow w-full justify-center disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</>
            ) : (
              <>Pagar {fmt(total)} →</>
            )}
          </button>
          <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            Pago seguro con Bold
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required, autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-foreground/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
    </label>
  );
}
