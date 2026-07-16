import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { events, speakers } from "@/data/content";

export const Route = createFileRoute("/eventos")({
  head: () => ({
    meta: [
      { title: "Eventos y conferencias 2026 — Voz Estratégica" },
      {
        name: "description",
        content:
          "Agenda 2026 de conferencias y eventos con los speakers de Voz Estratégica en Colombia y Latinoamérica.",
      },
      { property: "og:title", content: "Eventos y conferencias 2026 — Voz Estratégica" },
      {
        property: "og:description",
        content: "Próximos eventos con nuestros speakers en Colombia y Latinoamérica.",
      },
      { property: "og:url", content: "https://vozestrategica.com/eventos" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Eventos y conferencias 2026 — Voz Estratégica" },
      { name: "twitter:description", content: "Agenda 2026 de nuestros speakers." },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/eventos" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          events.map((ev) => ({
            "@context": "https://schema.org",
            "@type": "Event",
            name: ev.titulo,
            startDate: ev.fecha,
            location: { "@type": "Place", name: ev.ciudad },
            description: ev.descripcion,
          })),
        ),
      },
    ],
  }),

  component: EventosPage,
});

function EventosPage() {
  return (
    <>
      <PageHero
        badge="02 · Agenda"
        titulo={
          <>
            Próximos{" "}
            <span className="highlight-yellow">
              <span>eventos</span>
              <span />
            </span>
            .
          </>
        }
        descripcion="Conferencias, cumbres y foros donde nuestros speakers comparten sus ideas con audiencias en vivo."
      />

      <section className="bg-foreground py-20 text-background">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="divide-y divide-background/15">
            {events.map((ev, i) => {
              const spk = speakers.find((s) => s.slug === ev.speakerSlug);
              return (
                <Reveal as="li" key={ev.id} delay={i * 80}>
                  <div className="group flex flex-col gap-4 py-10 transition-all duration-500 hover:bg-background/5 hover:px-6 md:flex-row md:items-center md:gap-10">
                    <div className="font-mono text-sm font-bold uppercase tracking-widest text-brand md:w-44">
                      {new Date(ev.fecha + "T00:00:00").toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-3xl uppercase md:text-4xl">
                        {ev.titulo}
                      </div>
                      <div className="mt-2 text-sm text-background/70">
                        {ev.ciudad} · {ev.descripcion}
                      </div>
                      {spk ? (
                        <Link
                          to="/speakers/$slug"
                          params={{ slug: spk.slug }}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand hover:underline"
                        >
                          Con {spk.nombre} →
                        </Link>
                      ) : null}
                      {ev.landingUrl ? (
                        <div className="mt-3">
                          <a
                            href={ev.landingUrl}
                            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-background hover:text-brand"
                          >
                            {ev.ctaLabel ?? "Ver detalles"} →
                          </a>
                        </div>
                      ) : null}
                    </div>
                    <ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
