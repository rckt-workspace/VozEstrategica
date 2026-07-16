import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/programas")({
  head: () => ({
    meta: [
      { title: "Escuela Voz Estratégica — Programas" },
      {
        name: "description",
        content:
          "Programas de liderazgo, comunicación, cultura, ventas e innovación. Un método de 5 pasos que garantiza que el aprendizaje se aplique y se mida.",
      },
      { property: "og:title", content: "Escuela Voz Estratégica — Programas" },
      {
        property: "og:description",
        content: "Producto estrella: programas que convierten el conocimiento en capacidades medibles.",
      },
      { property: "og:url", content: "https://vozestrategica.com/programas" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/programas" }],
  }),
  component: ProgramasPage,
});

const METODO = [
  { paso: "Diagnóstico", desc: "Entender la brecha entre lo que hay y lo que se necesita." },
  { paso: "Conferencia", desc: "Inspirar y alinear a toda la organización." },
  { paso: "Talleres", desc: "Practicar la habilidad en grupos pequeños." },
  { paso: "Seguimiento", desc: "Sostener el cambio con acompañamiento." },
  { paso: "Medición", desc: "Demostrar resultados y ajustar." },
];

const PROGRAMAS = [
  { titulo: "Liderazgo", desc: "Liderazgo humano, adaptativo y comercial." },
  { titulo: "Comunicación", desc: "Conversaciones difíciles y presentaciones de alto impacto." },
  { titulo: "Cultura", desc: "Bienestar, propósito y trabajo intergeneracional." },
  { titulo: "Ventas y cliente", desc: "Experiencia, servicio y mentalidad comercial." },
  { titulo: "Innovación", desc: "IA, cambio y adaptación." },
];

const PARA_QUIEN = ["Talento Humano", "Gerencia", "Comercial", "Aprendizaje y Desarrollo"];

function ProgramasPage() {
  return (
    <>
      {/* Hero oscuro */}
      <section className="relative overflow-hidden bg-foreground pt-32 pb-20 text-background md:pt-44 md:pb-28">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6">
          <span className="bubble bubble-yellow mb-8">Producto estrella</span>
          <h1 className="font-display text-5xl uppercase leading-[0.9] md:text-7xl lg:text-8xl">
            Escuela<br />
            <span className="text-brand">Voz Estratégica</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-background/75 md:text-xl">
            Programas que convierten el conocimiento en capacidades medibles.
          </p>
          <div className="mt-8 font-mono text-sm uppercase tracking-widest text-background/60">
            Programas de 3, 6 y 12 meses
          </div>
        </div>
      </section>

      {/* Método */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">Método · 5 pasos</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {METODO.map((m, i) => (
            <Reveal key={m.paso} delay={i * 60}>
              <div className="h-full rounded-3xl border border-foreground/10 bg-card p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand font-display text-lg">
                  {i + 1}
                </div>
                <div className="mt-4 font-display text-xl uppercase">{m.paso}</div>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Programas */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">Programas por territorio</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {PROGRAMAS.map((p, i) => (
            <Reveal key={p.titulo} delay={i * 60}>
              <div className="h-full rounded-3xl border border-foreground/10 bg-background p-6">
                <div className="font-display text-2xl uppercase leading-tight">{p.titulo}</div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["3 meses", "6 meses", "12 meses"].map((d) => (
                    <span key={d} className="rounded-full border border-foreground/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Para quién */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">Para quién</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {PARA_QUIEN.map((p) => (
            <div key={p} className="rounded-2xl border border-foreground/10 bg-card px-6 py-8 text-center">
              <div className="font-display text-xl uppercase">{p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-[60px] bg-brand px-8 py-20 text-center md:px-16">
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Diseñemos un programa para tu equipo
          </h2>
          <Link
            to="/contratar"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-bold text-background transition-transform hover:scale-105"
          >
            Diseñar un programa <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
