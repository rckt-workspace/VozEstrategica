import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mic2, GraduationCap, Users, BookOpen } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/soluciones")({
  head: () => ({
    meta: [
      { title: "Soluciones — Voz Estratégica" },
      {
        name: "description",
        content:
          "Conferencias, formación, consultoría y contenido: del descubrimiento a la transformación. Elige el formato según el nivel de profundidad que necesitas.",
      },
      { property: "og:title", content: "Soluciones — Voz Estratégica" },
      {
        property: "og:description",
        content: "4 unidades de negocio y un portafolio en escalera para desarrollar a tu organización.",
      },
      { property: "og:url", content: "https://vozestrategica.com/soluciones" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/soluciones" }],
  }),
  component: SolucionesPage,
});

const UNIDADES = [
  {
    icon: Mic2,
    titulo: "Conferencias",
    desc: "Charlas de 60–90 minutos con nuestras 8 voces para inspirar y abrir la conversación.",
  },
  {
    icon: GraduationCap,
    titulo: "Formación corporativa",
    desc: "Talleres, workshops y programas que instalan capacidades concretas.",
  },
  {
    icon: Users,
    titulo: "Consultoría",
    desc: "Acompañamiento a medida en cultura, comunicación y liderazgo.",
  },
  {
    icon: BookOpen,
    titulo: "Contenido",
    desc: "Libros, newsletter y recursos que extienden el aprendizaje en el tiempo.",
  },
];

const ESCALERA = [
  ["Conferencia", "60–90 min", "Inspirar y abrir la conversación."],
  ["Taller", "2–4 h", "Practicar una habilidad clave."],
  ["Workshop", "4–8 h", "Profundizar con un equipo."],
  ["Programa", "4–12 semanas", "Instalar capacidades y hábitos."],
  ["Escuela", "6–12 meses", "Formación integral por áreas."],
  ["Consultoría", "Por proyecto", "Acompañamiento estratégico."],
];

const TERRITORIOS = [
  { titulo: "Liderazgo", desc: "Liderazgo humano, adaptativo y comercial." },
  { titulo: "Comunicación", desc: "Conversaciones difíciles y presentaciones de alto impacto." },
  { titulo: "Cultura", desc: "Bienestar, propósito y trabajo intergeneracional." },
  { titulo: "Transformación", desc: "IA, innovación, cambio y adaptación." },
  { titulo: "Ventas y cliente", desc: "Experiencia, servicio y mentalidad comercial." },
];

function SolucionesPage() {
  return (
    <>
      <PageHero
        badge="Portafolio"
        titulo={
          <>
            Soluciones de{" "}
            <span className="highlight-yellow">
              <span>aprendizaje</span>
              <span />
            </span>
            .
          </>
        }
        descripcion="Del descubrimiento a la transformación: elige el formato según el nivel de profundidad que necesitas."
      />

      {/* Unidades */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">01 · Las 4 unidades</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {UNIDADES.map((u, i) => (
            <Reveal key={u.titulo} delay={i * 80}>
              <div className="h-full rounded-3xl border border-foreground/10 bg-card p-6">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-foreground text-brand">
                  <u.icon className="h-6 w-6" />
                </div>
                <div className="mt-5 font-display text-2xl uppercase leading-tight">{u.titulo}</div>
                <p className="mt-3 text-sm text-muted-foreground">{u.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Escalera */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">02 · Portafolio en escalera</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>
        <div className="mt-10 space-y-3">
          {ESCALERA.map(([label, dur, para], i) => (
            <Reveal key={label} delay={i * 60}>
              <div className="grid gap-4 rounded-2xl border border-foreground/10 bg-background px-6 py-5 md:grid-cols-[80px_1fr_auto_1fr] md:items-center">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-brand">
                  0{i + 1}
                </div>
                <div className="font-display text-xl uppercase">{label}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {dur}
                </div>
                <div className="text-sm text-muted-foreground">{para}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Territorios */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">03 · Los 5 territorios</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {TERRITORIOS.map((t, i) => (
            <Reveal key={t.titulo} delay={i * 60}>
              <div className="h-full rounded-3xl border border-foreground/10 bg-card p-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
                  0{i + 1}
                </div>
                <div className="mt-3 font-display text-2xl uppercase leading-tight">{t.titulo}</div>
                <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-[60px] bg-brand px-8 py-20 text-center md:px-16">
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Diseñemos tu solución
          </h2>
          <Link
            to="/contratar"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-bold text-background transition-transform hover:scale-105"
          >
            Solicitar propuesta <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
