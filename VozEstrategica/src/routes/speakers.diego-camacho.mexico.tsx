import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Sparkles, Mic2, Users, Award, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { getSpeaker } from "@/data/content";
import { trackEvent } from "@/lib/meta-pixel";
import { trackGA4Event } from "@/lib/ga4";

const CANONICAL = "https://vozestrategica.com/speakers/diego-camacho/mexico";
const WHATSAPP_NUMBER = "573046464644"; // mismo contacto comercial
const SOURCE_TAG = "sem-mx-diego";

const schema = z.object({
  organizacion: z.string().trim().min(2, "Indica tu empresa u organización").max(200),
  contacto: z.string().trim().min(2, "Tu nombre, por favor").max(120),
  email: z.string().trim().email("Email inválido").max(200),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  ciudad: z.string().trim().max(120).optional().or(z.literal("")),
  fecha_evento: z.string().optional().or(z.literal("")),
  tipo_evento: z.string().trim().max(120).optional().or(z.literal("")),
  asistentes: z.string().trim().max(40).optional().or(z.literal("")),
  mensaje: z.string().trim().min(10, "Cuéntanos un poco más (mín. 10 caracteres)").max(2000),
});
type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/speakers/diego-camacho/mexico")({
  head: () => ({
    meta: [
      { title: "Contratar a Diego Camacho · Speaker IA y Ventas en CDMX | Voz Estratégica" },
      {
        name: "description",
        content:
          "Conferencista internacional experto en inteligencia artificial, ventas y marketing digital. Líder de Google Ads para Hispanoamérica. Disponible para eventos corporativos en Ciudad de México y todo México. Solicita cotización en menos de 48 horas.",
      },
      { name: "keywords", content: "diego camacho speaker, conferencista IA México, speaker inteligencia artificial CDMX, conferencista ventas Ciudad de México, contratar speaker IA México, keynote IA México" },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Diego Camacho · Speaker IA y Ventas · México" },
      {
        property: "og:description",
        content:
          "Líder de Google Ads Hispanoamérica. Conferencias en español para empresas mexicanas sobre IA, ventas y marketing digital.",
      },
      { property: "og:url", content: CANONICAL },
      { property: "og:locale", content: "es_MX" },
      { property: "og:site_name", content: "Voz Estratégica" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Diego Camacho · Speaker IA y Ventas · México" },
      {
        name: "twitter:description",
        content: "Contrata al speaker internacional experto en IA y ventas para tu evento en México.",
      },
    ],
    links: [
      { rel: "canonical", href: CANONICAL },
      { rel: "alternate", hrefLang: "es-MX", href: CANONICAL },
      { rel: "alternate", hrefLang: "es-CO", href: "https://vozestrategica.com/speakers/diego-camacho" },
      { rel: "alternate", hrefLang: "es", href: "https://vozestrategica.com/speakers/diego-camacho" },
      { rel: "alternate", hrefLang: "x-default", href: "https://vozestrategica.com/speakers/diego-camacho" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": `${CANONICAL}#person`,
              name: "Diego Camacho",
              jobTitle: "International Business Speaker · Líder Google Ads Hispanoamérica",
              description:
                "Experto en impulsar el crecimiento de empresas y startups con estrategias digitales, IA, ventas y marketing.",
              knowsAbout: [
                "Inteligencia Artificial",
                "Ventas",
                "Marketing Digital",
                "Liderazgo",
                "Transformación Digital",
                "Google Ads",
              ],
              worksFor: { "@type": "Organization", name: "Google" },
              memberOf: { "@type": "Organization", name: "Endeavor" },
            },
            {
              "@type": "Service",
              "@id": `${CANONICAL}#service`,
              name: "Conferencias de Diego Camacho en México",
              serviceType: "Speaker / Conferencista corporativo",
              provider: {
                "@type": "Organization",
                name: "Voz Estratégica",
                url: "https://vozestrategica.com",
              },
              areaServed: [
                { "@type": "Country", name: "México" },
                { "@type": "City", name: "Ciudad de México" },
              ],
              offers: {
                "@type": "Offer",
                priceCurrency: "MXN",
                availability: "https://schema.org/InStock",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Formatos disponibles",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Conferencia magistral (45–60 min)" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Keynote para convenciones corporativas" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Workshop ejecutivo" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Panel / moderación" } },
                ],
              },
            },
            {
              "@type": "FAQPage",
              "@id": `${CANONICAL}#faq`,
              mainEntity: [
                {
                  "@type": "Question",
                  name: "¿Diego viaja a Ciudad de México y otras ciudades de México?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sí. Diego realiza eventos presenciales en CDMX, Monterrey, Guadalajara y cualquier ciudad de México, además de formato virtual.",
                  },
                },
                {
                  "@type": "Question",
                  name: "¿En qué idioma da sus conferencias?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Español neutro adaptado a audiencias mexicanas. También disponible en inglés.",
                  },
                },
                {
                  "@type": "Question",
                  name: "¿Cuál es la tarifa para contratar a Diego como speaker?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "La tarifa depende del formato, ciudad, fecha y audiencia. Solicita cotización personalizada y respondemos en menos de 48 horas.",
                  },
                },
                {
                  "@type": "Question",
                  name: "¿Con cuánta anticipación debo reservar?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Recomendamos reservar con al menos 6–8 semanas de anticipación para asegurar disponibilidad de fecha.",
                  },
                },
              ],
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: "https://vozestrategica.com/" },
                { "@type": "ListItem", position: 2, name: "Speakers", item: "https://vozestrategica.com/speakers" },
                { "@type": "ListItem", position: 3, name: "Diego Camacho", item: "https://vozestrategica.com/speakers/diego-camacho" },
                { "@type": "ListItem", position: 4, name: "México", item: CANONICAL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: DiegoMexicoLanding,
});

function scrollToForm() {
  const el = document.getElementById("cotizar");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function whatsappLink() {
  const msg = encodeURIComponent(
    "Hola, vengo de la página de Diego Camacho México. Quiero solicitar una cotización para contratarlo como speaker.",
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function DiegoMexicoLanding() {
  const diego = getSpeaker("diego-camacho");
  if (!diego) return null;

  return (
    <main lang="es-MX" data-source={SOURCE_TAG}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/10 via-background to-background" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Disponible para eventos en México
            </span>
            <h1 className="mt-5 font-display text-4xl uppercase leading-[0.95] md:text-6xl">
              Contrata a <span className="text-brand">Diego Camacho</span> como speaker en{" "}
              <span className="highlight-yellow"><span>Ciudad de México</span><span /></span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              International Business Speaker. Líder del equipo comercial de{" "}
              <strong>Google Ads para Hispanoamérica</strong>. Conferencias de impacto sobre{" "}
              <strong>inteligencia artificial, ventas y marketing digital</strong> para empresas mexicanas.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToForm}
                className="bubble bubble-yellow inline-flex items-center gap-2 px-6 py-4 text-base"
              >
                Solicitar cotización <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("Contact", { source: SOURCE_TAG, channel: "whatsapp" });
                  trackGA4Event("contact", { method: "whatsapp", source: SOURCE_TAG });
                }}
                className="bubble bubble-black inline-flex items-center gap-2 px-6 py-4 text-base"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Award className="h-4 w-4 text-brand" /> Google · Endeavor · Angel Investor</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-brand" /> +20 países</span>
            </div>
          </Reveal>

          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-2xl">
              <img
                src={diego.foto}
                alt="Diego Camacho, conferencista internacional especializado en IA, ventas y marketing digital, disponible para eventos en Ciudad de México"
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
                <p className="font-display text-2xl uppercase text-white">Diego Camacho</p>
                <p className="text-sm text-white/80">IA · Ventas · Marketing digital</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRUEBA SOCIAL · LOGOS DE RESPALDO */}
      <section className="border-y border-foreground/10 bg-card/40 py-10">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Respaldado por
          </p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
            <li>
              <img
                src={new URL("@/assets/logos/google.svg", import.meta.url).href}
                alt="Google"
                loading="lazy"
                className="h-7 w-auto opacity-80 transition-opacity hover:opacity-100 md:h-8"
              />
            </li>
            <li>
              <img
                src={new URL("@/assets/logos/google-ads.svg", import.meta.url).href}
                alt="Google Ads"
                loading="lazy"
                className="h-7 w-auto opacity-80 transition-opacity hover:opacity-100 md:h-8"
              />
            </li>
            <li>
              <img
                src={new URL("@/assets/logos/google-for-startups.svg", import.meta.url).href}
                alt="Google for Startups (Launchpad)"
                loading="lazy"
                className="h-7 w-auto opacity-80 transition-opacity hover:opacity-100 md:h-8"
              />
            </li>
            <li>
              <img
                src={new URL("@/assets/logos/endeavor.png", import.meta.url).href}
                alt="Endeavor"
                loading="lazy"
                className="h-7 w-auto opacity-80 transition-opacity hover:opacity-100 md:h-8"
              />
            </li>
          </ul>

          <p className="mt-8 text-xs uppercase tracking-widest text-muted-foreground/70">
            Conferencias en México · Panamá · Chile · Argentina · Colombia · Sudeste Asiático · Australia
          </p>
        </div>
      </section>



      {/* CONFERENCIAS / TEMAS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Conferencias</p>
          <h2 className="mt-3 font-display text-3xl uppercase md:text-5xl">
            Tres temas que <span className="highlight-yellow"><span>transforman</span><span /></span> tu evento
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {diego.charlas.map((charla, i) => (
            <Reveal key={charla}>
              <article className="group h-full rounded-3xl border border-foreground/10 bg-card p-7 transition-all hover:border-brand/40 hover:shadow-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 font-display text-lg text-brand">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 font-display text-xl uppercase leading-tight">{charla}</h3>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* POR QUÉ DIEGO */}
      <section className="bg-card/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1.1fr_1fr] md:items-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Por qué Diego</p>
            <h2 className="mt-3 font-display text-3xl uppercase md:text-5xl">
              Experiencia real, no teoría
            </h2>
            <ul className="mt-8 space-y-4 text-base text-foreground/90">
              <li className="flex gap-3"><Mic2 className="mt-1 h-5 w-5 flex-none text-brand" /> Lidera el equipo comercial de Nuevos Negocios de <strong>Google Ads para Hispanoamérica</strong>.</li>
              <li className="flex gap-3"><Mic2 className="mt-1 h-5 w-5 flex-none text-brand" /> StartUp Coach en <strong>Google Launchpad</strong> y mentor de la red <strong>Endeavor</strong>.</li>
              <li className="flex gap-3"><Mic2 className="mt-1 h-5 w-5 flex-none text-brand" /> Angel investor y socio de varias startups en Latinoamérica.</li>
              <li className="flex gap-3"><Mic2 className="mt-1 h-5 w-5 flex-none text-brand" /> Posiciones de liderazgo en tecnología y consumo masivo en LatAm, Sudeste Asiático y Australia.</li>
            </ul>
          </Reveal>

          <Reveal>
            <blockquote className="relative rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm md:p-10">
              <p className="font-display text-2xl uppercase leading-tight md:text-3xl">
                "La IA no reemplaza a tu equipo comercial: lo libera para{" "}
                <span className="text-brand">vender mejor</span>."
              </p>
              <footer className="mt-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                — Diego Camacho
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* FORMATOS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Formatos</p>
          <h2 className="mt-3 font-display text-3xl uppercase md:text-5xl">
            Adaptable a <span className="highlight-yellow"><span>tu evento</span><span /></span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Conferencia magistral", d: "45–60 minutos · audiencias hasta 5,000 personas" },
            { t: "Keynote corporativa", d: "Convenciones anuales, lanzamientos, eventos C-level" },
            { t: "Workshop ejecutivo", d: "Sesiones de 2–4 horas con equipos directivos" },
            { t: "Panel / moderación", d: "Conducción experta de paneles sobre IA y negocios" },
          ].map((f) => (
            <Reveal key={f.t}>
              <div className="h-full rounded-2xl border border-foreground/10 bg-card p-6">
                <h3 className="font-display text-lg uppercase leading-tight">{f.t}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="cotizar" className="bg-foreground text-background py-20 scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Cotización</p>
            <h2 className="mt-3 font-display text-3xl uppercase md:text-5xl">
              Solicita tu propuesta para <span className="text-brand">México</span>
            </h2>
            <p className="mt-4 text-base text-background/70">
              Respondemos en menos de 48 horas con disponibilidad, formato sugerido y propuesta económica.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-10 rounded-3xl bg-background p-6 text-foreground md:p-10">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Preguntas frecuentes</p>
          <h2 className="mt-3 font-display text-3xl uppercase md:text-5xl">Lo que más nos preguntan</h2>
        </Reveal>

        <div className="mt-10 space-y-4">
          {[
            {
              q: "¿Diego viaja a CDMX y otras ciudades de México?",
              a: "Sí. Diego realiza eventos presenciales en Ciudad de México, Monterrey, Guadalajara y cualquier ciudad de México, además de formato virtual.",
            },
            {
              q: "¿En qué idioma da sus conferencias?",
              a: "Español neutro adaptado a audiencias mexicanas. También disponible en inglés.",
            },
            {
              q: "¿Cuál es la tarifa para contratarlo como speaker?",
              a: "La tarifa depende del formato, ciudad, fecha y tamaño de audiencia. Solicita cotización y respondemos en menos de 48 horas con propuesta a medida.",
            },
            {
              q: "¿Con cuánta anticipación debo reservar?",
              a: "Recomendamos al menos 6–8 semanas de anticipación para asegurar disponibilidad de fecha.",
            },
          ].map((item) => (
            <Reveal key={item.q}>
              <details className="group rounded-2xl border border-foreground/10 bg-card p-6 open:shadow-sm">
                <summary className="cursor-pointer list-none font-display text-base uppercase">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}

function LeadForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    const extras: string[] = [];
    if (values.ciudad) extras.push(`Ciudad: ${values.ciudad}`);
    if (values.asistentes) extras.push(`Asistentes: ${values.asistentes}`);
    extras.push(`Origen: ${SOURCE_TAG}`);
    extras.push("Speaker solicitado: Diego Camacho (México)");

    const mensaje = `${values.mensaje}\n\n— Datos adicionales —\n${extras.join("\n")}`;

    const { error } = await supabase.from("booking_requests").insert({
      organizacion: values.organizacion,
      contacto: values.contacto,
      email: values.email,
      telefono: values.telefono || null,
      fecha_evento: values.fecha_evento || null,
      tipo_evento: values.tipo_evento || null,
      presupuesto: null,
      mensaje,
      speaker_id: null,
      estado: "nuevo",
    });

    if (error) {
      toast.error("No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.");
      return;
    }

    trackEvent("Lead", {
      content_name: "Cotización Diego Camacho México",
      source: SOURCE_TAG,
      currency: "MXN",
    });
    trackGA4Event("generate_lead", {
      content_name: "Cotización Diego Camacho México",
      source: SOURCE_TAG,
      currency: "MXN",
    });

    toast.success("¡Recibido! Te contactamos en menos de 48 horas.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Empresa u organización" error={errors.organizacion?.message}>
        <input className={inputCls} {...register("organizacion")} autoComplete="organization" />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Tu nombre" error={errors.contacto?.message}>
          <input className={inputCls} {...register("contacto")} autoComplete="name" />
        </Field>
        <Field label="Email corporativo" error={errors.email?.message}>
          <input type="email" className={inputCls} {...register("email")} autoComplete="email" />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="WhatsApp (opcional)" error={errors.telefono?.message}>
          <input className={inputCls} placeholder="+52 ..." {...register("telefono")} autoComplete="tel" />
        </Field>
        <Field label="Ciudad" error={errors.ciudad?.message}>
          <input className={inputCls} placeholder="Ciudad de México" {...register("ciudad")} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Fecha tentativa" error={errors.fecha_evento?.message}>
          <input type="date" className={inputCls} {...register("fecha_evento")} />
        </Field>
        <Field label="Tipo de evento" error={errors.tipo_evento?.message}>
          <input className={inputCls} placeholder="Convención, keynote, workshop..." {...register("tipo_evento")} />
        </Field>
      </div>

      <Field label="Número de asistentes (aprox.)" error={errors.asistentes?.message}>
        <input className={inputCls} placeholder="200, 1,000, 5,000..." {...register("asistentes")} />
      </Field>

      <Field label="Cuéntanos sobre tu evento" error={errors.mensaje?.message}>
        <textarea rows={5} className={inputCls} {...register("mensaje")} />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bubble bubble-yellow w-full justify-center py-4 text-base disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar solicitud de cotización →"}
      </button>

      <p className="pt-1 text-center text-xs text-muted-foreground">
        ¿Prefieres WhatsApp?{" "}
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-brand underline">
          Escríbenos directo
        </a>
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-2xl border border-foreground/15 bg-card px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
