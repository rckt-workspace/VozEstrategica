import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros — Voz Estratégica" },
      {
        name: "description",
        content:
          "Somos una firma de aprendizaje corporativo, liderazgo y transformación. Presencia en Colombia, México y España.",
      },
      { property: "og:title", content: "Nosotros — Voz Estratégica" },
      {
        property: "og:description",
        content: "Las voces que cambian la conversación. Colombia · México · España.",
      },
      { property: "og:url", content: "https://vozestrategica.com/nosotros" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/nosotros" }],
  }),
  component: NosotrosPage,
});

const TERRITORIOS = [
  { titulo: "Liderazgo", desc: "Liderazgo humano, adaptativo y comercial." },
  { titulo: "Comunicación", desc: "Conversaciones difíciles y presentaciones de alto impacto." },
  { titulo: "Cultura", desc: "Bienestar, propósito y trabajo intergeneracional." },
  { titulo: "Transformación", desc: "IA, innovación, cambio y adaptación." },
  { titulo: "Ventas y cliente", desc: "Experiencia, servicio y mentalidad comercial." },
];

function NosotrosPage() {
  return (
    <>
      <PageHero
        badge="Somos"
        titulo={
          <>
            Somos{" "}
            <span className="highlight-yellow">
              <span>Voz Estratégica</span>
              <span />
            </span>
            .
          </>
        }
        descripcion="Una firma de aprendizaje corporativo, liderazgo y transformación. Las voces que cambian la conversación."
      />

      {/* Misión y visión */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-foreground/10 bg-card p-8 md:p-10">
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Misión</div>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Impulsamos el crecimiento de las organizaciones a través de experiencias de aprendizaje, conferencias y programas de desarrollo que fortalecen el liderazgo, la comunicación y las capacidades del talento humano.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-3xl border border-foreground/10 bg-card p-8 md:p-10">
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Visión</div>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Ser la compañía referente en Latinoamérica en formación corporativa y experiencias de aprendizaje que transforman personas, equipos y organizaciones.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Territorios */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">Territorios</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {TERRITORIOS.map((t, i) => (
            <Reveal key={t.titulo} delay={i * 60}>
              <div className="h-full rounded-3xl border border-foreground/10 bg-background p-6">
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

      {/* Cara visible */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="grid gap-8 rounded-3xl bg-foreground p-8 text-background md:grid-cols-[280px_1fr] md:p-12">
            <div className="aspect-square w-full max-w-[280px] rounded-2xl bg-background/5 grid place-items-center font-mono text-[10px] uppercase tracking-widest text-background/40">
              Foto Tatiana
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Cara visible</div>
              <h3 className="mt-3 font-display text-4xl uppercase leading-[0.95] md:text-5xl">
                Tatiana Suárez Peralta
              </h3>
              <p className="mt-6 text-background/75 md:text-lg">
                Líder y cara visible de Voz Estratégica. Lidera la gestión y el desarrollo de conferencistas y la creación de programas formativos, con trayectoria en experiencias de alto impacto para organizaciones de distintas industrias.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Presencia */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="text-center">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Presencia</div>
            <h2 className="mt-4 font-display text-5xl uppercase md:text-7xl">
              Colombia · México · España
            </h2>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-[60px] bg-brand px-8 py-20 text-center md:px-16">
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Trabajemos juntos
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
