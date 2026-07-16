import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { speakers } from "@/data/content";
import { trackEvent } from "@/lib/meta-pixel";
import { trackGA4Event } from "@/lib/ga4";

const schema = z.object({
  organizacion: z.string().min(2, "Indica tu organización").max(200),
  contacto: z.string().min(2, "Tu nombre, por favor").max(120),
  cargo: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email("Email inválido").max(200),
  telefono: z.string().max(40).optional().or(z.literal("")),
  interes: z.enum(
    ["Conferencia", "Taller o workshop", "Programa o Escuela", "Consultoría"],
    { message: "Cuéntanos qué te interesa" },
  ),
  territorio: z.enum(
    ["Liderazgo", "Comunicación", "Cultura", "Transformación", "Ventas y cliente", "Aún no lo tengo claro"],
    { message: "Selecciona un territorio" },
  ),
  audiencia: z.string().max(120).optional().or(z.literal("")),
  fecha_evento: z.string().optional().or(z.literal("")),
  speaker: z.string().optional().or(z.literal("")),
  origen: z.string().max(120).optional().or(z.literal("")),
  presupuesto: z.string().max(120).optional().or(z.literal("")),
  mensaje: z.string().min(10, "Cuéntanos un poco más (mín. 10 caracteres)").max(2000),
});

type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/contratar")({
  validateSearch: (s: Record<string, unknown>) => ({
    speaker: typeof s.speaker === "string" ? s.speaker : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Solicitar propuesta — Voz Estratégica" },
      {
        name: "description",
        content:
          "Diseñamos conferencias, talleres y programas de aprendizaje corporativo a medida. Recibe una propuesta en menos de 48 horas.",
      },
      { property: "og:title", content: "Solicitar propuesta — Voz Estratégica" },
      {
        property: "og:description",
        content:
          "Firma de aprendizaje corporativo: conferencias, talleres, programas y consultoría a medida.",
      },
      { property: "og:url", content: "https://vozestrategica.com/contratar" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/contratar" }],
  }),

  component: ContratarPage,
});

function ContratarPage() {
  const { speaker: prefSpeaker } = useSearch({ from: "/contratar" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { speaker: prefSpeaker ?? "" },
  });

  async function onSubmit(values: FormData) {
    const spk = values.speaker
      ? speakers.find((s) => s.slug === values.speaker)
      : null;

    const mensajeCompleto =
      `¿Qué te interesa?: ${values.interes}` +
      `\nTerritorio: ${values.territorio}` +
      (values.cargo ? `\nCargo: ${values.cargo}` : "") +
      (values.audiencia ? `\nAudiencia: ${values.audiencia}` : "") +
      (values.origen ? `\n¿Dónde nos conociste?: ${values.origen}` : "") +
      `\n\n${values.mensaje}`;

    const { error } = await supabase.from("booking_requests").insert({
      organizacion: values.organizacion,
      contacto: values.contacto,
      email: values.email,
      telefono: values.telefono || null,
      fecha_evento: values.fecha_evento || null,
      tipo_evento: values.interes,
      presupuesto: values.presupuesto || null,
      mensaje: mensajeCompleto,
      speaker_id: null,
      estado: "nuevo",
    });


    if (error) {
      toast.error("No pudimos enviar tu solicitud. Inténtalo de nuevo.");
      return;
    }
    trackEvent("Lead", {
      content_name: "Solicitud de contratación",
      speaker: spk?.nombre ?? null,
    });
    trackGA4Event("generate_lead", {
      content_name: "Solicitud de contratación",
      speaker: spk?.nombre ?? null,
    });
    toast.success(
      spk
        ? `¡Recibido! Te contactamos pronto sobre ${spk.nombre}.`
        : "¡Recibido! Te contactamos en menos de 48 horas.",
    );
    reset();
  }

  return (
    <>
      <PageHero
        badge="Solicitar propuesta"
        titulo={
          <>
            Diseñemos el aprendizaje de tu{" "}
            <span className="highlight-yellow">
              <span>equipo</span>
              <span />
            </span>
            .
          </>
        }
        descripcion="Conferencias, talleres, programas y consultoría a medida para líderes y organizaciones. Respondemos en menos de 48 horas con una propuesta a la medida de tu reto."
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Organización" error={errors.organizacion?.message}>
                <input className={input} {...register("organizacion")} />
              </Field>
              <Field label="Persona de contacto" error={errors.contacto?.message}>
                <input className={input} {...register("contacto")} />
              </Field>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Cargo (opcional)" error={errors.cargo?.message}>
                <input
                  className={input}
                  placeholder="Head of L&D, CHRO, Dir. Comunicaciones..."
                  {...register("cargo")}
                />
              </Field>
              <Field label="Email corporativo" error={errors.email?.message}>
                <input type="email" className={input} {...register("email")} />
              </Field>
            </div>

            <Field label="Teléfono (opcional)" error={errors.telefono?.message}>
              <input className={input} {...register("telefono")} />
            </Field>

            <Field label="¿Qué te interesa?" error={errors.interes?.message}>
              <div className="relative">
                <select
                  className={`${input} appearance-none pr-12 cursor-pointer`}
                  defaultValue=""
                  {...register("interes")}
                >
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="Conferencia">Conferencia (keynote / charla)</option>
                  <option value="Taller o workshop">Taller o workshop</option>
                  <option value="Programa o Escuela">Programa o Escuela (multisesión)</option>
                  <option value="Consultoría">Consultoría a medida</option>
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
                </svg>
              </div>
            </Field>

            <Field label="Territorio de aprendizaje" error={errors.territorio?.message}>
              <div className="relative">
                <select
                  className={`${input} appearance-none pr-12 cursor-pointer`}
                  defaultValue=""
                  {...register("territorio")}
                >
                  <option value="" disabled>Selecciona un territorio</option>
                  <option value="Liderazgo">Liderazgo</option>
                  <option value="Comunicación">Comunicación</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Transformación">Transformación</option>
                  <option value="Ventas y cliente">Ventas y cliente</option>
                  <option value="Aún no lo tengo claro">Aún no lo tengo claro</option>
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
                </svg>
              </div>
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Audiencia (opcional)" error={errors.audiencia?.message}>
                <input
                  className={input}
                  placeholder="Comité directivo, líderes, fuerza comercial..."
                  {...register("audiencia")}
                />
              </Field>
              <Field label="Fecha tentativa (opcional)" error={errors.fecha_evento?.message}>
                <input type="date" className={input} {...register("fecha_evento")} />
              </Field>
            </div>

            <Field label="Conferencista de interés (opcional)" error={errors.speaker?.message}>
              <div className="relative">
                <select
                  className={`${input} appearance-none pr-12 cursor-pointer`}
                  {...register("speaker")}
                  defaultValue={prefSpeaker ?? ""}
                >
                  <option value="">Sin preferencia — recomiéndennos</option>
                  {speakers.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
                </svg>
              </div>
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="¿Dónde nos conociste? (opcional)" error={errors.origen?.message}>
                <input
                  className={input}
                  placeholder="Google, LinkedIn, referido..."
                  {...register("origen")}
                />
              </Field>
              <Field label="Presupuesto estimado (opcional)" error={errors.presupuesto?.message}>
                <input
                  className={input}
                  placeholder="Rango USD / EUR"
                  {...register("presupuesto")}
                />
              </Field>
            </div>

            <Field label="Cuéntanos el reto o contexto" error={errors.mensaje?.message}>
              <textarea
                rows={6}
                className={input}
                placeholder="¿Qué quieres que tu equipo aprenda, transforme o logre?"
                {...register("mensaje")}
              />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bubble bubble-yellow w-full justify-center py-4 text-base disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Solicitar propuesta →"}
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}


const input =
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
