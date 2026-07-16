import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Ear,
  Stethoscope,
  HandCoins,
  Users,
  TrendingDown,
  ChevronDown,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  Download,
  Globe,
  Smartphone,
  Languages,
  Award,
  Loader2,
} from "lucide-react";
import carlosImg from "@/assets/speaker-carlos-laguna.jpg";
import logoVozEstrategica from "@/assets/logo-voz-estrategica-masterclass.png";
import gallerySpeaker from "@/assets/carlos-gallery/speaker.jpg.asset.json";
import galleryExma from "@/assets/carlos-gallery/exma.jpg.asset.json";
import galleryCreators from "@/assets/carlos-gallery/creators.jpg.asset.json";
import galleryPanel from "@/assets/carlos-gallery/panel.jpg.asset.json";
import galleryRichbot from "@/assets/carlos-gallery/richbot.jpg.asset.json";
import galleryEden from "@/assets/carlos-gallery/eden.jpg.asset.json";
import galleryMercedes from "@/assets/carlos-gallery/mercedes.jpg.asset.json";
import galleryMercedes2 from "@/assets/carlos-gallery/mercedes2.jpg.asset.json";
import galleryColsanitas from "@/assets/carlos-gallery/colsanitas.jpg.asset.json";
import galleryCrehana from "@/assets/carlos-gallery/crehana.jpg.asset.json";
import { trackEvent } from "@/lib/meta-pixel";
import { trackGA4Event } from "@/lib/ga4";
import { openBoldEmbeddedCheckout } from "@/lib/bold-checkout";
import { validateDiscountCode } from "@/lib/bold.functions";
import { toast } from "sonner";

const MASTERCLASS_AMOUNT_USD = 20;
const MASTERCLASS_DESCRIPTION = "Masterclass: De clientes a fans";

// Module-level discount state shared by all CheckoutButton instances on the page.
let activeDiscountCode: string | null = null;
const discountListeners = new Set<() => void>();
function setActiveDiscountCode(code: string | null) {
  activeDiscountCode = code;
  discountListeners.forEach((l) => l());
}
function useActiveDiscount() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    discountListeners.add(l);
    return () => {
      discountListeners.delete(l);
    };
  }, []);
  return activeDiscountCode;
}

const startBoldCheckout = async () => {
  const discountCode = activeDiscountCode ?? undefined;
  const displayAmount = discountCode ? MASTERCLASS_AMOUNT_USD / 2 : MASTERCLASS_AMOUNT_USD;
  trackEvent("InitiateCheckout", {
    content_name: MASTERCLASS_DESCRIPTION,
    value: displayAmount,
    currency: "USD",
  });
  trackGA4Event("begin_checkout", {
    content_name: MASTERCLASS_DESCRIPTION,
    value: displayAmount,
    currency: "USD",
  });
  try {
    await openBoldEmbeddedCheckout({
      amount: MASTERCLASS_AMOUNT_USD,
      currency: "USD",
      description: MASTERCLASS_DESCRIPTION,
      redirectionUrl: `${window.location.origin}/masterclass/gracias`,
      discountCode,
    });
  } catch (err) {
    console.error(err);
    toast.error("No pudimos abrir el pago. Intenta de nuevo en unos segundos.");
  }
};

const FECHA = "Sábado 25 de julio";
const HORA = "10:00 a.m. hora Colombia (UTC-5)";
const BURGUNDY = "#40ed51"; // brand green
const BURGUNDY_LIGHT = "rgba(64, 237, 81, 0.12)"; // dim green tint for dark bg
const CREAM = "rgba(64, 237, 81, 0.07)"; // very subtle highlight for dark bg
const BLACK = "#0e0f0c";

const MASTERCLASS_URL = "https://vozestrategica.com/masterclass-de-clientes-a-fans";

export const Route = createFileRoute("/masterclass-de-clientes-a-fans")({
  head: () => ({
    meta: [
      { title: `Masterclass: De Clientes a Fans · Carlos Laguna · ${FECHA}` },
      {
        name: "description",
        content:
          "2 horas en vivo con Carlos Laguna. El sistema que aplica con Mercedes Benz, Nespresso y Bancolombia para vender sin perseguir clientes. $20 USD.",
      },
      { property: "og:title", content: "Masterclass: De Clientes a Fans · Carlos Laguna" },
      {
        property: "og:description",
        content: "Aprende a vender sin perseguir clientes. 2 horas en vivo. $20 USD.",
      },
      { property: "og:url", content: MASTERCLASS_URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_CO" },
      { name: "twitter:title", content: "Masterclass: De Clientes a Fans · Carlos Laguna" },
      { name: "twitter:description", content: "Vender sin perseguir clientes. 2 horas en vivo. $20 USD." },
    ],
    links: [
      { rel: "canonical", href: MASTERCLASS_URL },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Masterclass: De Clientes a Fans",
          description:
            "2 horas en vivo con Carlos Laguna. Sistema para vender sin perseguir clientes, aplicado en Mercedes Benz, Nespresso y Bancolombia.",
          startDate: "2026-07-25T10:00:00-05:00",
          endDate: "2026-07-25T12:00:00-05:00",
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "VirtualLocation",
            url: MASTERCLASS_URL,
          },
          organizer: {
            "@type": "Organization",
            name: "Voz Estratégica",
            url: "https://vozestrategica.com",
          },
          performer: { "@type": "Person", name: "Carlos Laguna" },
          offers: {
            "@type": "Offer",
            price: "20",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: MASTERCLASS_URL,
          },
        }),
      },
    ],
  }),
  component: MasterclassPage,
});



// Module-level state to open the pre-checkout dialog.
let openDialog: (() => void) | null = null;
function requestOpenCheckoutDialog() {
  if (openDialog) openDialog();
}

function CheckoutButton({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const discount = useActiveDiscount();
  const label = children ?? (discount ? "Reservar mi cupo · $10 USD" : "Reservar mi cupo · $20 USD");

  return (
    <button
      type="button"
      onClick={() => requestOpenCheckoutDialog()}
      className={`inline-flex min-h-[56px] cursor-pointer items-center justify-center gap-2 rounded-[6px] px-8 py-4 text-base font-bold uppercase tracking-wide text-[#0e0f0c] shadow-[0_8px_24px_-12px_rgba(64,237,81,0.55)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgba(64,237,81,0.85)] active:translate-y-0 active:scale-[0.96] active:brightness-110 active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      style={{ backgroundColor: BURGUNDY, fontFamily: "'Montserrat', sans-serif" }}
    >
      {label}
    </button>
  );
}

function PreCheckoutDialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const active = useActiveDiscount();

  useEffect(() => {
    openDialog = () => {
      setOpen(true);
      setCode("");
    };
    return () => {
      openDialog = null;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const applyCode = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Escribe un código.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await validateDiscountCode({ data: { code: trimmed } });
      if (res.valid) {
        setActiveDiscountCode(trimmed);
        toast.success(`Código aplicado · ${res.percentOff}% de descuento`);
        setCode("");
      } else {
        setActiveDiscountCode(null);
        toast.error("Código no válido.");
      }
    } catch {
      toast.error("No pudimos validar el código. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const proceed = async () => {
    if (paying) return;
    setPaying(true);
    try {
      await startBoldCheckout();
      setOpen(false);
    } finally {
      setPaying(false);
    }
  };

  if (!open) return null;

  const finalPrice = active ? 10 : 20;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={() => !paying && setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-[6px] border border-white/15 bg-[#16181a] p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: BURGUNDY }}>
              Reservar mi cupo
            </p>
            <p className="mt-1 text-lg font-bold text-white">Masterclass · De clientes a fans</p>
          </div>
          <button
            type="button"
            onClick={() => !paying && setOpen(false)}
            className="text-white/50 hover:text-white"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          {active && (
            <span className="text-2xl font-bold text-white/40 line-through">$20</span>
          )}
          <span className="text-5xl font-bold text-white">${finalPrice}</span>
          <span className="text-base font-bold text-white/60">USD</span>
        </div>

        {active ? (
          <div
            className="mt-4 flex items-center justify-between gap-3 rounded-[4px] border-2 border-dashed px-3 py-2"
            style={{ borderColor: BURGUNDY }}
          >
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4" style={{ color: BURGUNDY }} />
              <span className="text-white">
                Código <span style={{ color: BURGUNDY }}>{active.toUpperCase()}</span> · 50% OFF
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveDiscountCode(null)}
              className="text-xs uppercase tracking-wider text-white/60 hover:text-white"
            >
              Quitar
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              ¿Tienes un código de descuento?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyCode();
                  }
                }}
                placeholder="XXX-XXX"
                autoFocus
                className="min-w-0 flex-1 rounded-[4px] border border-white/20 bg-black/40 px-4 py-3 text-base uppercase tracking-wider text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={applyCode}
                disabled={submitting}
                className="rounded-[4px] border border-white/30 bg-transparent px-4 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black disabled:opacity-60"
              >
                {submitting ? "..." : "Aplicar"}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={proceed}
          disabled={paying}
          className="mt-6 inline-flex w-full min-h-[56px] cursor-pointer items-center justify-center gap-2 rounded-[6px] px-6 py-4 text-base font-bold uppercase tracking-wide text-[#0e0f0c] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ backgroundColor: BURGUNDY }}
        >
          {paying ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Abriendo pago...
            </>
          ) : (
            `Continuar al pago · $${finalPrice} USD`
          )}
        </button>
        <p className="mt-3 text-center text-[11px] text-white/50">
          Pago seguro vía Bold · tarjeta internacional · PSE
        </p>
      </div>
    </div>
  );
}

// ─────────── Promo sticky banner ───────────
// Real countdown anclado a una fecha fija UTC (no se reinicia por usuario).
// Promoción activa por 72h desde PROMO_START_UTC.
const PROMO_START_UTC = Date.UTC(2026, 5, 16, 0, 0, 0); // 16 jun 2026, 00:00 UTC
const PROMO_DURATION_MS = 72 * 60 * 60 * 1000;
const PROMO_DEADLINE = PROMO_START_UTC + PROMO_DURATION_MS;
const CUPOS_INICIALES = 100;
const CUPOS_MINIMOS = 17;

function computeCuposLeft(now: number) {
  if (now <= PROMO_START_UTC) return CUPOS_INICIALES;
  if (now >= PROMO_DEADLINE) return CUPOS_MINIMOS;
  const elapsed = now - PROMO_START_UTC;
  // Decrecimiento lineal hasta el mínimo a lo largo de las 72h.
  const consumed = Math.floor(((CUPOS_INICIALES - CUPOS_MINIMOS) * elapsed) / PROMO_DURATION_MS);
  return Math.max(CUPOS_MINIMOS, CUPOS_INICIALES - consumed);
}

function formatTimeLeft(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return {
    hh: String(h).padStart(2, "0"),
    mm: String(m).padStart(2, "0"),
    ss: String(s).padStart(2, "0"),
  };
}

function PromoBanner() {
  const [now, setNow] = useState(() => Date.now());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const msLeft = PROMO_DEADLINE - now;
  const cupos = computeCuposLeft(now);
  const expired = msLeft <= 0 || cupos <= CUPOS_MINIMOS;

  if (dismissed || expired) return null;

  const { hh, mm, ss } = formatTimeLeft(msLeft);

  return (
    <div
      className="sticky top-0 z-[60] w-full border-b border-white/10 text-[#0e0f0c]"
      style={{
        background: "linear-gradient(90deg, #40ed51 0%, #5cf76c 50%, #40ed51 100%)",
        fontFamily: "'Montserrat', sans-serif",
      }}
      role="region"
      aria-label="Promoción por tiempo limitado"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 md:py-2.5">
        <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-bold uppercase leading-tight tracking-wide md:text-[13px]">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0e0f0c] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0e0f0c]" />
            </span>
            100 cupos · 50% OFF
          </span>
          <span className="opacity-70">·</span>
          <span>
            Usa código{" "}
            <span className="rounded bg-[#0e0f0c] px-1.5 py-0.5 font-mono text-[11px] text-[#40ed51] md:text-[12px]">
              VOZ-50
            </span>
          </span>
          <span className="opacity-70">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="opacity-80">Termina en</span>
            <span className="inline-flex items-center gap-0.5 font-mono tabular-nums">
              <span className="rounded bg-[#0e0f0c] px-1.5 py-0.5 text-[#40ed51]">{hh}</span>
              <span>:</span>
              <span className="rounded bg-[#0e0f0c] px-1.5 py-0.5 text-[#40ed51]">{mm}</span>
              <span>:</span>
              <span className="rounded bg-[#0e0f0c] px-1.5 py-0.5 text-[#40ed51]">{ss}</span>
            </span>
          </span>
          <span className="opacity-70">·</span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <span className="font-extrabold">{cupos}</span>
            <span className="opacity-80">cupos disponibles</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => requestOpenCheckoutDialog()}
            className="inline-flex cursor-pointer items-center justify-center rounded-[6px] bg-[#0e0f0c] px-4 py-2 text-[12px] font-extrabold uppercase tracking-wide text-[#40ed51] shadow-[0_4px_14px_-6px_rgba(0,0,0,0.5)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-black active:translate-y-0 active:scale-[0.97] md:text-[13px]"
          >
            Reservar con 50% OFF
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Cerrar promoción"
            className="hidden h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#0e0f0c]/70 transition hover:bg-[#0e0f0c]/10 hover:text-[#0e0f0c] md:inline-flex"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}



function DiscountCodeField() {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const active = useActiveDiscount();

  const onApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Escribe un código.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await validateDiscountCode({ data: { code: trimmed } });
      if (res.valid) {
        setActiveDiscountCode(trimmed);
        toast.success(`Código aplicado · ${res.percentOff}% de descuento`);
      } else {
        setActiveDiscountCode(null);
        toast.error("Código no válido.");
      }
    } catch {
      toast.error("No pudimos validar el código. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const onRemove = () => {
    setActiveDiscountCode(null);
    setCode("");
  };

  return (
    <div className="mt-6">
      {active ? (
        <div
          className="flex items-center justify-between gap-3 rounded-[3px] border-2 border-dashed px-4 py-3"
          style={{ borderColor: BURGUNDY }}
        >
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-5 w-5" style={{ color: BURGUNDY }} />
            <span className="font-semibold text-white">
              Código <span style={{ color: BURGUNDY }}>{active.toUpperCase()}</span> aplicado · 50% OFF
            </span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs uppercase tracking-wider text-white/60 underline-offset-2 hover:text-white hover:underline"
          >
            Quitar
          </button>
        </div>
      ) : (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            ¿Tienes un código de descuento?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onApply();
                }
              }}
              placeholder="XXX-XXX"
              className="min-w-0 flex-1 rounded-[4px] border border-white/20 bg-black/40 px-4 py-3 text-base uppercase tracking-wider text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={onApply}
              disabled={submitting}
              className="rounded-[4px] border border-white/30 bg-transparent px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black disabled:opacity-60"
            >
              {submitting ? "..." : "Aplicar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MasterclassPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const activeDiscount = useActiveDiscount();


  // Smooth fade on mount
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const pageStyle = {
    fontFamily: "'Montserrat', sans-serif",
    color: "#ffffff",
    backgroundColor: BLACK,
  } as const;
  const serif = { fontFamily: "'Montserrat', sans-serif", letterSpacing: "-0.01em" } as const;

  const problemas = [
    { icon: TrendingDown, text: "Tienes un equipo comercial pero los resultados dependen del ánimo del día" },
    { icon: Stethoscope, text: "Sientes que improvisas cada negociación y cada cliente es una sorpresa" },
    { icon: Users, text: "Tu base de datos crece pero no sabes cómo trabajarla con sistema" },
    { icon: HandCoins, text: "Te cuesta sostener tu precio cuando el cliente empieza a regatear" },
    { icon: Ear, text: "Eres el mejor vendedor de tu propia empresa · y eso te tiene saturado" },
  ];

  const promesas = [
    "Un sistema claro para entrar a cada negociación con plan · no con esperanza",
    "El framework que aplica Carlos para que los clientes paguen más sin pelear precio",
    "Cinco prompts de IA listos para usar el lunes con tu equipo comercial",
    "El caso real de Mercedes Benz Colombia explicado paso a paso por su autor",
    "Las dos matrices (Canvas + seguimiento) que cambian la conversación de descuento a experiencia",
  ];

  const modulos = [
    {
      n: "01",
      titulo: "Mindset comercial",
      desc: "La diferencia entre el vendedor que persigue y el profesional que cierra. El cambio mental que viene antes de la técnica.",
    },
    {
      n: "02",
      titulo: "Los 4 tipos de cliente",
      desc: "Cómo identificar al cliente analítico, expresivo, amigable o conductor en los primeros 60 segundos. Y cómo adaptar tu estilo a cada uno.",
    },
    {
      n: "03",
      titulo: "Tu perfil negociador",
      desc: "Quiz auto-aplicado en vivo. Sales sabiendo cuál es tu estilo natural · y dónde lo tienes que ajustar.",
    },
    {
      n: "04",
      titulo: "Tipos de preguntas que cierran ventas",
      desc: "Las 5 categorías de preguntas (apertura, calificación, dolor, validación, compromiso) con ejemplos aplicables esta semana. Más 5 prompts de IA usando LIAgu en vivo.",
    },
    {
      n: "05",
      titulo: "ADD On Factor + caso Mercedes Benz Colombia",
      desc: "El sistema completo para convertir clientes que pelean precio en clientes que pagan más sin descuento.",
      destacado: true,
    },
  ];

  const paraQuien = [
    { rol: "Emprendedores", desc: "que necesitan escalar sin que todo dependa de ellos" },
    { rol: "Líderes comerciales", desc: "que quieren un equipo que cierre con sistema · no con suerte" },
    { rol: "Gerentes de experiencia al cliente", desc: "que necesitan cumplir objetivos comerciales · no solo de satisfacción" },
    { rol: "Vendedores B2B y consultivos", desc: "que están listos para subir un nivel" },
  ];

  const logistica = [
    { icon: Calendar, label: "Fecha", value: FECHA },
    { icon: Clock, label: "Hora", value: HORA },
    { icon: Video, label: "Duración", value: "2 horas en vivo + 30 min de Q&A abierto" },
    { icon: Globe, label: "Modalidad", value: "100% virtual en Zoom · enlace tras compra" },
    { icon: Download, label: "Grabación", value: "Incluida · acceso por 48 horas posteriores" },
    { icon: Smartphone, label: "Compatibilidad", value: "Celular · tablet · laptop" },
    { icon: Languages, label: "Idioma", value: "Español" },
  ];

  const incluye = [
    "Acceso a la masterclass en vivo (2 horas)",
    "Q&A en vivo de 30 minutos con Carlos",
    "Grabación completa por 48 horas",
    "Ejercicio práctico descargable de seguimiento",
    "Bonus: invitación prioritaria al workshop completo (precio reservado solo para asistentes)",
  ];

  const testimonios = [
    {
      cita: "En 2 horas con Carlos vi más sobre cómo cerrar ventas que en cinco cursos juntos. El día siguiente apliqué lo de la pregunta antes del precio y cerré una venta que llevaba tres meses parada.",
      nombre: "Andrea M.",
      cargo: "Gerente Comercial · Sector salud",
    },
    {
      cita: "Carlos no enseña teoría. Enseña lo que aplica con marcas que conoces. Eso cambia todo. Salgo de cada sesión con cosas que puedo usar el lunes en la mañana.",
      nombre: "Juan C.",
      cargo: "Director de Ventas · Industria B2B",
    },
    {
      cita: "Lideré equipos comerciales durante 15 años y siempre faltaba el método. Carlos lo trae con números, con casos reales y con una claridad que pocos especialistas tienen.",
      nombre: "María F.",
      cargo: "Consultora Senior · LATAM",
    },
  ];

  const faqs = [
    {
      q: "¿Habrá grabación si no puedo asistir en vivo?",
      a: "Sí. Tendrás acceso a la grabación por 48 horas después del evento. Si quieres acceso permanente, en la masterclass te abrimos el workshop completo que incluye la grabación vitalicia y 40 horas más de contenido.",
    },
    {
      q: "¿Necesito tener equipo comercial para que me sirva?",
      a: "No. La masterclass funciona igual de bien si vendes solo, lideras un equipo o eres consultor. Los principios y herramientas se adaptan a cualquier estructura.",
    },
    { q: "¿En qué idioma es?", a: "100% en español. Los ejemplos y casos son de marcas que operan en LATAM." },
    {
      q: "¿Puedo participar desde el celular?",
      a: "Sí. Zoom funciona desde cualquier dispositivo. Te recomendamos auriculares para mejor experiencia.",
    },
    {
      q: "¿Y si quiero llevar a mi equipo?",
      a: "Para grupos de 5 o más personas escríbenos a contacto@vozestrategica.com — tenemos tarifa corporativa.",
    },
    {
      q: "¿Cómo funciona la garantía?",
      a: "Si en los primeros 30 minutos sientes que la masterclass no te aporta, escribe a contacto@vozestrategica.com y te devolvemos los $20 USD. Sin trámites.",
    },
  ];

  const logos = ["Mercedes Benz", "Nespresso", "Bancolombia", "Kimberly Clark", "Pepsi", "Pernod Ricard"];

  return (
    <div style={pageStyle} className="min-h-screen">
      <PreCheckoutDialog />
      <PromoBanner />
      {/* Minimal top bar — sin menú */}
      <div className="border-b border-white/15 bg-[#0e0f0c]/80 backdrop-blur">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:py-4">
          <img
            src={logoVozEstrategica}
            alt="Voz Estratégica"
            className="h-8 w-auto md:h-10"
            loading="eager"
            decoding="async"
          />
          <CheckoutButton className="hidden !min-h-0 !px-4 !py-2 !text-sm !shadow-none hover:!shadow-none sm:inline-flex">
            Reservar · $20 USD
          </CheckoutButton>
        </div>
      </div>

      {/* ─────────── BLOQUE 01 · HERO ─────────── */}
      <section className="relative overflow-hidden bg-[#16181a]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-24">
          <div className="animate-fade-up">
            <span
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ borderColor: BURGUNDY, color: BURGUNDY }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-rec-led"
                style={{ backgroundColor: "#ff1a1a", boxShadow: "0 0 6px rgba(255,26,26,0.9)" }}
              />
              Masterclass en vivo · {FECHA}
            </span>
            <h1
              style={serif}
              className="text-[40px] font-bold leading-[1.05] tracking-tight text-white md:text-[64px] lg:text-[72px]"
            >
              Aprende a vender{" "}
              <em className="italic" style={{ color: BURGUNDY }}>
                sin perseguir
              </em>{" "}
              clientes.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              En 2 horas. Con el sistema que aplica <strong>Carlos Laguna</strong> con Mercedes Benz, Nespresso y Bancolombia.
            </p>
            <p className="mt-4 text-sm text-white/60">
              Masterclass virtual en vivo · {FECHA} · {HORA.replace(" (UTC-5)", "")} · <strong>$20 USD</strong>
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <CheckoutButton />
              <p className="text-xs text-white/60">Cupos limitados · garantía de devolución</p>
            </div>
          </div>
          <div className="relative">
            <img
              src={galleryCrehana.url}
              alt="Carlos Laguna, autor de De clientes a fans"
              className="aspect-[4/5] w-full rounded-[3px] object-cover shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* ─────────── BLOQUE 02 · AUTORIDAD ─────────── */}
      <section className="border-y border-white/15 bg-[#0e0f0c]">
        <div className="mx-auto max-w-6xl px-5 py-10 md:py-12">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Carlos ha entrenado a los equipos comerciales de
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-14">
            {logos.map((l) => (
              <span
                key={l}
                className="text-base font-semibold tracking-wide text-white/80 opacity-70 md:text-lg"
                style={serif}
              >
                {l}
              </span>
            ))}
          </div>
          <div className="mt-10 border-t border-white/10 pt-8">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Su libro <em className="not-italic">De clientes a fans</em> ha sido destacado en
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12">
              <span
                className="text-xl font-bold tracking-tight text-white md:text-2xl"
                style={serif}
              >
                Forbes Colombia
              </span>
              <span className="h-5 w-px bg-white/20" aria-hidden />
              <a
                href="https://www.semana.com/cultura/articulo/fragmento-del-libro-de-clientes-a-fans-de-carlos-laguna/202623/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold tracking-tight text-white underline-offset-4 transition hover:underline md:text-2xl"
                style={serif}
              >
                Semana ↗
              </a>
            </div>
            <p className="mt-4 text-center text-xs text-white/50">
              Lee el fragmento publicado en{" "}
              <a
                href="https://www.semana.com/cultura/articulo/fragmento-del-libro-de-clientes-a-fans-de-carlos-laguna/202623/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 underline underline-offset-2 hover:text-white"
              >
                Revista Semana
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 03 · PROBLEMA ─────────── */}
      <section className="bg-[#16181a]">
        <div className="mx-auto max-w-3xl px-5 py-20 md:py-28">
          <h2 style={serif} className="text-3xl font-bold leading-tight md:text-5xl">
            Si te suena conocido alguno de estos,{" "}
            <span style={{ color: BURGUNDY }}>esta masterclass es para ti</span>:
          </h2>
          <ul className="mt-10 space-y-6">
            {problemas.map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: BURGUNDY_LIGHT, color: BURGUNDY }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="text-lg leading-relaxed text-white md:text-xl">{text}</span>
              </li>
            ))}
          </ul>
          <p
            style={serif}
            className="mt-12 text-center text-2xl italic md:text-3xl"
          >
            No son problemas de habilidad.{" "}
            <span style={{ color: BURGUNDY }}>Son problemas de sistema.</span>
          </p>
        </div>
      </section>

      {/* ─────────── BLOQUE 04 · PROMESA ─────────── */}
      <section className="bg-[#0e0f0c]">
        <div className="mx-auto max-w-3xl px-5 py-20 md:py-28">
          <h2 style={serif} className="text-4xl font-bold leading-tight md:text-6xl">
            En 2 horas vas a tener:
          </h2>
          <ul className="mt-10 space-y-5">
            {promesas.map((p, i) => (
              <li key={i} className="flex items-start gap-4 border-b border-white/15 pb-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" style={{ color: BURGUNDY }} strokeWidth={2} />
                <span className="text-lg leading-relaxed md:text-xl">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <CheckoutButton>Quiero esto · $20 USD</CheckoutButton>
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 05 · AGENDA ─────────── */}
      <section className="bg-[#16181a]">
        <div className="mx-auto max-w-5xl px-5 py-20 md:py-28">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: BURGUNDY }}>
              El programa
            </p>
            <h2 style={serif} className="text-3xl font-bold leading-tight md:text-5xl">
              El programa de la masterclass
            </h2>
            <p className="mt-4 text-base text-white/60 md:text-lg">
              2 horas en vivo con Carlos · 5 módulos concentrados · una sola sesión
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {modulos.map((m) => (
              <article
                key={m.n}
                className={`rounded-[3px] border p-6 transition-all md:p-8 ${
                  m.destacado ? "md:col-span-2" : ""
                }`}
                style={{
                  borderColor: m.destacado ? BURGUNDY : "rgba(255,255,255,0.15)",
                  backgroundColor: m.destacado ? CREAM : "#16181a",
                }}
              >
                <div className="flex items-start gap-5">
                  <span
                    style={{ ...serif, color: BURGUNDY }}
                    className="text-4xl font-bold leading-none md:text-5xl"
                  >
                    {m.n}
                  </span>
                  <div>
                    <h3 style={serif} className="text-xl font-bold md:text-2xl">
                      {m.titulo}
                    </h3>
                    <p className="mt-2 leading-relaxed text-white/80">{m.desc}</p>
                    {m.destacado && (
                      <span
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                        style={{ backgroundColor: BLACK, color: BURGUNDY }}
                      >
                        <Award className="h-3 w-3" /> Clímax de la sesión
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 06 · BIO ─────────── */}
      <section className="bg-[#0e0f0c]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.3fr] md:items-center md:py-28">
          <div>
            <div className="relative">
              <img
                src={galleryMercedes2.url}
                alt="Carlos Laguna frente a concesionario Mercedes-Benz Autoland"
                className="aspect-[4/5] w-full rounded-[3px] object-cover shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: BURGUNDY }}>
              Quién te va a enseñar
            </p>
            <h2 style={serif} className="text-3xl font-bold leading-tight md:text-5xl">
              Carlos Laguna
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-white/80 md:text-lg">
              <p>
                Carlos Laguna lleva 20 años entrenando equipos comerciales en algunas de las marcas más exigentes
                de LATAM: Mercedes Benz, Nespresso, Bancolombia, Kimberly Clark Professional, Pepsi y Pernod
                Ricard, entre otras.
              </p>
              <p>
                Es autor del libro <em>De clientes a fans</em>, reseñado por Forbes Colombia como{" "}
                <em>"el libro que propone reemplazar la guerra de precios con experiencia de cliente"</em>.
              </p>
              <p>
                Su metodología propia · el <strong>ADD On Factor</strong> · ha sido aplicada en casos reales de
                marcas tier-1 para cambiar la conversación comercial de descuento a valor percibido.
              </p>
              <p>Es speaker oficial de Crehana y especialista en negociación de la Universidad de Los Andes.</p>
            </div>
            <blockquote
              className="mt-8 border-l-4 p-6"
              style={{ borderColor: BURGUNDY, backgroundColor: CREAM }}
            >
              <p style={serif} className="text-xl italic leading-snug md:text-2xl">
                "El libro que propone reemplazar la guerra de precios con experiencia de cliente."
              </p>
              <footer className="mt-3 text-sm font-bold uppercase tracking-wider" style={{ color: BURGUNDY }}>
                — Forbes Colombia
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 06.5 · CARLOS EN ACCIÓN ─────────── */}
      <section className="bg-[#16181a]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: BURGUNDY }}>
              Carlos en acción
            </p>
            <h2 style={serif} className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
              No es teoría de aula.<br className="hidden md:block" />
              <em className="italic" style={{ color: BURGUNDY }}>Es escenario, marca y cliente real.</em>
            </h2>
            <p className="mt-5 text-base text-white/60 md:text-lg">
              Conferencias internacionales, activaciones con marcas tier-1 y experiencias de cliente que hoy
              se enseñan como caso de estudio.
            </p>
          </div>

          {/* Bento grid editorial */}
          <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-4">
            {/* Hero - speaker (2x2) */}
            <figure className="group relative col-span-2 row-span-2 overflow-hidden rounded-[3px] bg-black">
              <img
                src={gallerySpeaker.url}
                alt="Carlos Laguna en conferencia frente a auditorio lleno"
                className="aspect-square h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: "50% 35%" }}
                loading="lazy"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Keynote</p>
                <p style={serif} className="mt-1 text-lg font-bold text-white md:text-2xl">
                  Auditorios llenos. Cero filtros.
                </p>
              </figcaption>
            </figure>

            {/* EXMA */}
            <figure className="group relative overflow-hidden rounded-[3px] bg-black">
              <img
                src={galleryExma.url}
                alt="Carlos Laguna en EXMA explicando la curva de adopción de la innovación"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">EXMA</p>
                <p className="mt-0.5 text-[11px] text-white/70 md:text-xs">Marketing & innovación</p>
              </figcaption>
            </figure>

            {/* Creators */}
            <figure className="group relative overflow-hidden rounded-[3px] bg-black">
              <img
                src={galleryCreators.url}
                alt="Carlos Laguna firmando su libro De clientes a fans con asistentes"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Creators Summit</p>
                <p className="mt-0.5 text-[11px] text-white/70 md:text-xs">Firma de libros</p>
              </figcaption>
            </figure>

            {/* Panel */}
            <figure className="group relative overflow-hidden rounded-[3px] bg-black">
              <img
                src={galleryPanel.url}
                alt="Carlos Laguna como moderador en panel sobre comercio y experiencia"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Día del Comerciante</p>
                <p className="mt-0.5 text-[11px] text-white/70 md:text-xs">Panel & conversación</p>
              </figcaption>
            </figure>

            {/* Richbot */}
            <figure className="group relative overflow-hidden rounded-[3px] bg-black">
              <img
                src={galleryRichbot.url}
                alt="Carlos Laguna con equipo presentando el proyecto Richbot"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Richbot · Apostar</p>
                <p className="mt-0.5 text-[11px] text-white/70 md:text-xs">Caso de marca</p>
              </figcaption>
            </figure>

            {/* Mercedes / wide */}
            <figure className="group relative col-span-2 overflow-hidden rounded-[3px] bg-black">
              <img
                src={galleryMercedes.url}
                alt="Activación de marca Mercedes Benz con clientes y equipo de CPC Group"
                className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Mercedes-Benz · Motorysa</p>
                <p className="mt-0.5 text-xs text-white/70 md:text-sm">Activación premium · experiencia de cliente real</p>
              </figcaption>
            </figure>

            {/* Edentainment */}
            <figure className="group relative overflow-hidden rounded-[3px] bg-black">
              <img
                src={galleryEden.url}
                alt="Carlos Laguna en lanzamiento Edentainment con equipo de centro comercial El Edén"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Edentainment</p>
                <p className="mt-0.5 text-[11px] text-white/70 md:text-xs">Lanzamiento de marca</p>
              </figcaption>
            </figure>

            {/* Colsanitas */}
            <figure className="group relative overflow-hidden rounded-[3px] bg-black">
              <img
                src={galleryColsanitas.url}
                alt="Carlos Laguna con equipo de Colsanitas en experiencia el ingrediente perfecto"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Colsanitas</p>
                <p className="mt-0.5 text-[11px] text-white/70 md:text-xs">Experiencia corporativa</p>
              </figcaption>
            </figure>
          </div>

          {/* Segunda fila · cierre con más escenarios */}
          <div className="mt-3 grid grid-cols-1 gap-3 md:mt-4 md:gap-4">
            <figure className="group relative overflow-hidden rounded-[3px] bg-black">
              <img
                src={galleryCrehana.url}
                alt="Carlos Laguna como speaker oficial de Crehana"
                className="aspect-[16/7] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Crehana</p>
                <p className="mt-0.5 text-xs text-white/70 md:text-sm">Speaker oficial · formación digital</p>
              </figcaption>
            </figure>
          </div>


          <p className="mt-10 text-center text-sm text-white/50 md:mt-12">
            Estos son algunos de los escenarios y marcas con los que Carlos ha trabajado en los últimos años.
          </p>
        </div>
      </section>

      {/* ─────────── BLOQUE 07 · PARA QUIÉN ─────────── */}
      <section className="bg-[#16181a]">
        <div className="mx-auto max-w-4xl px-5 py-20 md:py-28">
          <div className="text-center">
            <h2 style={serif} className="text-4xl font-bold md:text-6xl">
              ¿Es para ti?
            </h2>
            <p className="mt-4 text-base text-white/60 md:text-lg">
              Esta masterclass es para profesionales que vivan al menos una de estas situaciones:
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {paraQuien.map((p) => (
              <div
                key={p.rol}
                className="rounded-[3px] border border-white/15 bg-[#0e0f0c] p-6 transition-colors hover:border-[#40ed51]"
              >
                <h3 className="text-lg font-bold text-white">{p.rol}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60 md:text-base">{p.desc}</p>
              </div>
            ))}
          </div>
          <p style={serif} className="mt-12 text-center text-xl italic text-white/80 md:text-2xl">
            Si vas a vender algo en los próximos 6 meses · y quieres hacerlo mejor · esta masterclass está
            diseñada para ti.
          </p>
        </div>
      </section>

      {/* ─────────── BLOQUE 08 · LOGÍSTICA ─────────── */}
      <section className="bg-[#0e0f0c]">
        <div className="mx-auto max-w-4xl px-5 py-20 md:py-28">
          <h2 style={serif} className="text-center text-3xl font-bold md:text-5xl">
            Logística de la masterclass
          </h2>
          <div className="mt-12 grid gap-x-8 gap-y-5 md:grid-cols-2">
            {logistica.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 border-b border-white/15 pb-5">
                <span
                  className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: BURGUNDY_LIGHT, color: BURGUNDY }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    {label}
                  </p>
                  <p className="mt-0.5 text-base font-medium text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <CheckoutButton />
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 09 · OFERTA ─────────── */}
      <section id="reservar" className="bg-[#16181a]">
        <div className="mx-auto max-w-3xl px-5 py-20 md:py-28">
          <div
            className="rounded-[4px] border-2 p-8 md:p-12"
            style={{ borderColor: BURGUNDY, backgroundColor: CREAM }}
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: BURGUNDY }}>
              La inversión
            </p>
            <div className="flex items-baseline gap-3">
              {activeDiscount ? (
                <>
                  <span
                    style={serif}
                    className="text-4xl font-bold text-white/40 line-through md:text-5xl"
                  >
                    $20
                  </span>
                  <span style={serif} className="text-7xl font-bold md:text-8xl" >
                    $10
                  </span>
                </>
              ) : (
                <span style={serif} className="text-7xl font-bold md:text-8xl" >
                  $20
                </span>
              )}
              <span className="text-2xl font-bold text-white/60">USD</span>
            </div>
            <p className="text-sm text-white/60">
              {activeDiscount
                ? `50% de descuento aplicado con el código ${activeDiscount.toUpperCase()}`
                : "Una sola entrega · acceso completo"}
            </p>

            <DiscountCodeField />


            <div className="my-8 h-px bg-white/15" />

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white">
              Qué incluye tu inversión
            </p>
            <ul className="space-y-3">
              {incluye.map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: BURGUNDY }} />
                  <span className="text-base leading-relaxed">{i}</span>
                </li>
              ))}
            </ul>

            <div
              className="mt-8 flex items-start gap-4 rounded-[3px] border-2 border-dashed p-5"
              style={{ borderColor: BURGUNDY }}
            >
              <ShieldCheck className="h-10 w-10 shrink-0" style={{ color: BURGUNDY }} strokeWidth={1.5} />
              <div>
                <p className="font-bold text-white">Garantía de devolución total</p>
                <p className="mt-1 text-sm leading-relaxed text-white/80">
                  Si en los primeros 30 minutos consideras que la masterclass no te aporta valor real, te
                  devolvemos el dinero. Sin preguntas. Sin trámites.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <CheckoutButton className="w-full !min-h-[64px] !text-lg" />
              <p className="mt-3 text-center text-xs text-white/60">
                Pago seguro · tarjeta internacional · PSE Colombia · 2 cuotas sin interés disponibles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 10 · TESTIMONIOS ─────────── */}
      <section className="bg-[#0e0f0c]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <h2 style={serif} className="text-center text-3xl font-bold leading-tight md:text-5xl">
            Lo que dicen quienes han trabajado con Carlos
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonios.map((t, i) => (
              <figure
                key={i}
                className="flex flex-col rounded-[3px] border border-white/15 bg-[#16181a] p-7"
              >
                <span
                  style={{ ...serif, color: BURGUNDY }}
                  className="text-5xl font-bold leading-none"
                >
                  "
                </span>
                <blockquote style={serif} className="mt-2 flex-1 text-base italic leading-relaxed text-white md:text-lg">
                  {t.cita}
                </blockquote>
                <figcaption className="mt-6 border-t border-white/15 pt-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                      style={{ backgroundColor: BURGUNDY_LIGHT, color: BURGUNDY }}
                    >
                      {t.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{t.nombre}</p>
                      <p className="text-xs text-white/60">{t.cargo}</p>
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 11 · FAQ ─────────── */}
      <section className="bg-[#16181a]">
        <div className="mx-auto max-w-3xl px-5 py-20 md:py-28">
          <h2 style={serif} className="text-center text-3xl font-bold md:text-5xl">
            Preguntas que recibimos seguido
          </h2>
          <div className="mt-12 divide-y divide-white/15 border-y border-white/15">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-base font-bold text-white md:text-lg">{f.q}</span>
                    <ChevronDown
                      className={`mt-1 h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                      style={{ color: BURGUNDY }}
                    />
                  </button>
                  {open && (
                    <p className="pb-5 pr-9 text-base leading-relaxed text-white/80">{f.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 12 · CIERRE ─────────── */}
      <section style={{ backgroundColor: BLACK }}>
        <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: BURGUNDY }}>
            Te lo recuerdo en una sola frase
          </p>
          <h2 style={serif} className="text-3xl font-extrabold leading-tight text-white md:text-5xl">
            Dos horas en vivo con Carlos Laguna. El sistema que aplica con Mercedes Benz, Nespresso y
            Bancolombia. <em className="not-italic" style={{ color: BURGUNDY }}>Por $20 USD.</em>
          </h2>
          <p className="mt-6 text-lg text-white/90">
            {FECHA} a las {HORA.replace(" (UTC-5)", "")}.
          </p>
          <p className="mt-2 text-sm text-white/60">
            Cupos limitados · garantía de devolución · grabación incluida.
          </p>
          <div className="mt-10 flex justify-center">
            <CheckoutButton className="!min-h-[64px] !px-10 !py-5 !text-lg shadow-2xl hover:-translate-y-0.5">
              Reservar mi cupo · $20 USD
            </CheckoutButton>
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 13 · P.D. ─────────── */}
      <section className="bg-[#0e0f0c]">
        <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
          <div className="flex items-start gap-5">
            <img
              src={carlosImg}
              alt="Carlos Laguna"
              className="h-16 w-16 shrink-0 rounded-full object-cover md:h-20 md:w-20"
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: BURGUNDY }}>
                P.D. de Carlos
              </p>
              <p className="mt-1 text-sm text-white/60">Un mensaje personal antes de cerrar</p>
            </div>
          </div>
          <div className="mt-8 space-y-5 pl-0 text-lg leading-relaxed text-white md:pl-[84px] md:text-xl" style={serif}>
            <p>Si llegaste hasta acá es porque algo te resonó.</p>
            <p>
              Voy a serte directo: estas dos horas no te van a convertir en otra persona. Pero te van a dar
              herramientas concretas que puedes usar el lunes y un cambio de perspectiva sobre cómo ves la
              venta.
            </p>
            <p>
              Si los $20 USD te detienen, probablemente esta masterclass no es para ti. Si los $20 USD te
              parecen poco para 2 horas con alguien que entrena a marcas tier-1, entonces te espero adentro.
            </p>
            <p>Nos vemos el {FECHA.toLowerCase()}.</p>
          </div>
          <div className="mt-10 pl-0 md:pl-[84px]">
            <p style={{ ...serif, color: BURGUNDY }} className="text-3xl italic md:text-4xl">
              Carlos Laguna
            </p>
            <p className="mt-1 text-sm text-white/60">Autor de <em>De clientes a fans</em></p>
          </div>
        </div>
      </section>

      {/* ─────────── BLOQUE 14 · FOOTER ─────────── */}
      <footer className="bg-[#1a1a1a] text-white/80">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-col items-center gap-4 text-center text-xs md:flex-row md:justify-between md:text-left">
            <p>
              <strong className="text-white">Voz Estratégica</strong> · +57 310 6598108 ·
              contacto@vozestrategica.com
            </p>
            <p className="space-x-3 text-white/60">
              <a href="#" className="hover:text-white">Términos y condiciones</a>
              <span>·</span>
              <a href="#" className="hover:text-white">Política de privacidad</a>
              <span>·</span>
              <a href="#" className="hover:text-white">Política de devoluciones</a>
            </p>
          </div>
          <p className="mt-6 text-center text-[11px] text-white/50">
            © 2026 Voz Estratégica · Todos los derechos reservados ·{" "}
            <Link to="/" className="underline hover:text-white">
              Ir al sitio principal
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
