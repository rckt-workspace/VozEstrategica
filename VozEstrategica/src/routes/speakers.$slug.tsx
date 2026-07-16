import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import {
  getSpeaker,
  speakers,
  eventsForSpeaker,
  booksForSpeaker,
} from "@/data/content";

export const Route = createFileRoute("/speakers/$slug")({
  loader: ({ params }) => {
    const speaker = getSpeaker(params.slug);
    if (!speaker) throw notFound();
    return { speaker };
  },
  head: ({ params, loaderData }) => {
    const s = loaderData?.speaker;
    if (!s) return { meta: [] };
    const bioText = s.bio.join(" ");
    const canonical = `https://vozestrategica.com/speakers/${params.slug}`;
    const isDiego = params.slug === "diego-camacho";
    return {
      meta: [
        { title: `${s.nombre} — ${s.especialidad} | Voz Estratégica` },
        { name: "description", content: `${s.nombre}, ${s.especialidad}. ${bioText.slice(0, 130)}` },
        { property: "og:title", content: `${s.nombre} — ${s.especialidad}` },
        { property: "og:description", content: bioText.slice(0, 160) },
        { property: "og:image", content: s.foto },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${s.nombre} — ${s.especialidad}` },
        { name: "twitter:description", content: bioText.slice(0, 160) },
        { name: "twitter:image", content: s.foto },
      ],
      links: [
        { rel: "canonical", href: canonical },
        ...(isDiego
          ? [
              { rel: "alternate", hrefLang: "es-CO", href: canonical },
              {
                rel: "alternate",
                hrefLang: "es-MX",
                href: "https://vozestrategica.com/speakers/diego-camacho/mexico",
              },
              { rel: "alternate", hrefLang: "x-default", href: canonical },
            ]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": `${canonical}#person`,
                name: s.nombre,
                jobTitle: s.especialidad,
                description: bioText,
                image: s.foto,
                url: canonical,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Inicio", item: "https://vozestrategica.com/" },
                  { "@type": "ListItem", position: 2, name: "Speakers", item: "https://vozestrategica.com/speakers" },
                  { "@type": "ListItem", position: 3, name: s.nombre, item: canonical },
                ],
              },
            ],
          }),
        },
      ],
    };
  },

  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="font-display text-5xl uppercase">Speaker no encontrado</h1>
      <Link to="/speakers" className="bubble bubble-black mt-8 inline-flex">
        Ver catálogo →
      </Link>
    </div>
  ),
  component: SpeakerDetail,
});

function SpeakerDetail() {
  const { speaker } = Route.useLoaderData();
  const evs = eventsForSpeaker(speaker.slug);
  const bks = booksForSpeaker(speaker.slug);
  const others = speakers.filter((s) => s.slug !== speaker.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-foreground/10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-brand/40 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pt-24 pb-20 md:grid-cols-[1.1fr_1fr] md:pt-32">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-foreground/5">
              <img
                src={speaker.foto}
                alt={`Retrato editorial de ${speaker.nombre}`}
                width={768}
                height={1024}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div>
              <span className="bubble bubble-outline">{speaker.especialidad}</span>
              <h1 className="mt-6 font-display text-6xl uppercase md:text-7xl">
                {speaker.nombre}
              </h1>
              <div className="mt-6 flex flex-wrap gap-2">
                {speaker.tematicas.map((t: string) => (
                  <span key={t} className="bubble bubble-yellow">
                    {t}
                  </span>
                ))}
              </div>
              {speaker.quote ? (
                <blockquote className="mt-10 border-l-4 border-brand pl-6 font-display text-2xl uppercase leading-tight md:text-3xl">
                  “{speaker.quote}”
                </blockquote>
              ) : null}
              <div className="mt-8 space-y-5 text-lg text-muted-foreground">
                {speaker.bio.map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/contratar"
                  search={{ speaker: speaker.slug }}
                  className="bubble bubble-black inline-flex items-center gap-2"
                >
                  Contratar a {speaker.nombre.split(" ")[0]}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {speaker.slug === "carlos-laguna" ? (
                  <a
                    href="/masterclass-de-clientes-a-fans"
                    className="bubble bubble-yellow inline-flex items-center gap-2"
                  >
                    Masterclass: De clientes a fans
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Charlas / temáticas insignia */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-center gap-4">
          <span className="section-badge">Charlas</span>
          <div className="h-px flex-1 bg-foreground/15" />
        </div>
        <h2 className="mt-8 font-display text-4xl uppercase md:text-6xl">
          Conferencias insignia
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {speaker.charlas.map((c: string, i: number) => (
            <Reveal key={c} delay={i * 80}>
              <div className="group h-full border-l-2 border-foreground/15 pl-6 transition-colors hover:border-brand">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Conferencia · 0{i + 1}
                </div>
                <div className="mt-3 font-display text-2xl uppercase leading-tight">
                  {c}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {evs.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <span className="section-badge">Agenda</span>
          <h2 className="mt-6 font-display text-4xl uppercase md:text-5xl">
            Próximas charlas
          </h2>
          <ul className="mt-10 divide-y divide-foreground/15">
            {evs.map((ev) => (
              <li key={ev.id} className="flex flex-col gap-2 py-6 md:flex-row md:items-center md:gap-10">
                <div className="font-mono text-sm font-bold uppercase tracking-widest text-foreground/60 md:w-40">
                  {new Date(ev.fecha + "T00:00:00").toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="flex-1">
                  <div className="font-display text-xl uppercase md:text-2xl">
                    {ev.titulo}
                  </div>
                  <div className="text-sm text-muted-foreground">{ev.ciudad}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {bks.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <span className="section-badge">Publicaciones</span>
          <h2 className="mt-6 font-display text-4xl uppercase md:text-5xl">Libros</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bks.map((b) => (
              <div key={b.id} className="overflow-hidden rounded-2xl bg-foreground/5">
                <img
                  src={b.portada}
                  alt={`Portada de ${b.titulo}`}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="aspect-[3/4] w-full object-cover"
                />
                <div className="p-4">
                  <div className="font-display text-lg uppercase">{b.titulo}</div>
                  <div className="text-xs text-muted-foreground">{b.anio}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-3xl uppercase md:text-4xl">Otras voces</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {others.map((s) => (
            <Link
              key={s.slug}
              to="/speakers/$slug"
              params={{ slug: s.slug }}
              className="group relative block aspect-[3/4] overflow-hidden rounded-3xl"
            >
              <img
                src={s.foto}
                alt={s.nombre}
                loading="lazy"
                width={768}
                height={1024}
                className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-background">
                <div className="text-xs uppercase tracking-widest text-brand">
                  {s.especialidad}
                </div>
                <div className="font-display text-2xl uppercase">{s.nombre}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
