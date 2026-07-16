import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { speakers, type Speaker } from "@/data/content";

export const Route = createFileRoute("/speakers/")({
  head: () => ({
    meta: [
      { title: "Speakers y conferencistas — Voz Estratégica" },
      {
        name: "description",
        content:
          "Conocé a los conferencistas, autores y pensadores que representamos. Marketing, liderazgo, ventas, IA, finanzas y más.",
      },
      { property: "og:title", content: "Speakers y conferencistas — Voz Estratégica" },
      {
        property: "og:description",
        content: "Catálogo curado de speakers para eventos en Colombia y Latinoamérica.",
      },
      { property: "og:url", content: "https://vozestrategica.com/speakers" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Speakers y conferencistas — Voz Estratégica" },
      { name: "twitter:description", content: "Catálogo curado de speakers." },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/speakers" }],
  }),

  component: SpeakersPage,
});

type CategoryId =
  | "todas"
  | "marketing"
  | "liderazgo"
  | "ventas"
  | "finanzas"
  | "ia"
  | "comunicacion"
  | "inspiracion";

const CATEGORIES: { id: CategoryId; label: string; match: (s: Speaker) => boolean }[] = [
  { id: "todas", label: "Todas", match: () => true },
  {
    id: "marketing",
    label: "Marketing & marca",
    match: (s) => s.tematicas.some((t) => /marketing|marca|brand|creatividad|investigaci/i.test(t)),
  },
  {
    id: "liderazgo",
    label: "Liderazgo",
    match: (s) => s.tematicas.some((t) => /liderazgo/i.test(t)),
  },
  {
    id: "ventas",
    label: "Ventas & negocios",
    match: (s) => s.tematicas.some((t) => /ventas|negocio|experiencia de cliente|comportamiento/i.test(t)),
  },
  {
    id: "finanzas",
    label: "Finanzas",
    match: (s) => s.tematicas.some((t) => /finan/i.test(t)),
  },
  {
    id: "ia",
    label: "IA & transformación digital",
    match: (s) => s.tematicas.some((t) => /inteligencia artificial|transformaci|innovaci|digital/i.test(t)),
  },
  {
    id: "comunicacion",
    label: "Comunicación",
    match: (s) => s.tematicas.some((t) => /comunicaci|narraci|storytelling/i.test(t)),
  },
  {
    id: "inspiracion",
    label: "Inspiración & propósito",
    match: (s) => s.tematicas.some((t) => /resiliencia|inclusi|prop[oó]sito|motivaci|transformaci[oó]n$/i.test(t)),
  },
];

function SpeakersPage() {
  const [category, setCategory] = useState<CategoryId>("todas");
  const activeCat = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];
  const list = speakers.filter(activeCat.match);

  return (
    <>
      <PageHero
        badge="Catálogo · Conferencistas"
        titulo={
          <>
            Voces que{" "}
            <span className="highlight-yellow">
              <span>importan</span>
              <span />
            </span>
            .
          </>
        }
        descripcion="Nuestras voces son la puerta de entrada al aprendizaje. Cada conferencista conecta negocio y factor humano, y puede extender su charla en talleres y programas a medida."
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => {
            const count = c.id === "todas" ? speakers.length : speakers.filter(c.match).length;
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`bubble ${active ? "bubble-black" : "bubble-outline"}`}
              >
                {c.label}
                <span className={`ml-2 text-[10px] font-bold ${active ? "opacity-70" : "opacity-50"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>


        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <Reveal key={s.slug} delay={i * 60}>
              <Link
                to="/speakers/$slug"
                params={{ slug: s.slug }}
                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-foreground/5"
              >
                <img
                  src={s.foto}
                  alt={`Retrato de ${s.nombre}`}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                  <div className="text-xs font-bold uppercase tracking-widest text-brand">
                    {s.especialidad}
                  </div>
                  <div className="mt-2 font-display text-3xl uppercase">
                    {s.nombre}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.tematicas.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-background/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100">
                    Ver perfil <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            No hay speakers en esa temática todavía.
          </p>
        ) : null}
      </section>
    </>
  );
}
