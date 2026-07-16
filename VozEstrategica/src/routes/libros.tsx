import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { books, speakers } from "@/data/content";

export const Route = createFileRoute("/libros")({
  head: () => ({
    meta: [
      { title: "Libros de nuestros speakers — Voz Estratégica" },
      {
        name: "description",
        content:
          "Libros publicados por los conferencistas y autores de Voz Estratégica. Ideas que extienden sus charlas en papel.",
      },
      { property: "og:title", content: "Libros de nuestros speakers — Voz Estratégica" },
      {
        property: "og:description",
        content: "Catálogo editorial de nuestros autores.",
      },
      { property: "og:url", content: "https://vozestrategica.com/libros" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Libros de nuestros speakers — Voz Estratégica" },
      { name: "twitter:description", content: "Catálogo editorial de nuestros autores." },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/libros" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          books.map((b) => ({
            "@context": "https://schema.org",
            "@type": "Book",
            name: b.titulo,
            datePublished: String(b.anio),
            description: b.descripcion,
            image: b.portada,
          })),
        ),
      },
    ],
  }),

  component: LibrosPage,
});

function LibrosPage() {
  return (
    <>
      <PageHero
        badge="03 · Publicaciones"
        titulo={
          <>
            Ideas que se{" "}
            <span className="highlight-yellow">
              <span>imprimen</span>
              <span />
            </span>
            .
          </>
        }
        descripcion="Nuestros speakers escriben los libros que extienden sus conferencias. Cada portada es una puerta de entrada a su mundo."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((b, i) => {
            const autor = speakers.find((s) => s.slug === b.autorSlug);
            return (
              <Reveal key={b.id} delay={i * 80}>
                <article className="group">
                  <div className="overflow-hidden rounded-2xl bg-foreground/5">
                    <img
                      src={b.portada}
                      alt={`Portada de ${b.titulo}`}
                      loading="lazy"
                      width={768}
                      height={1024}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5">
                    <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      {b.anio}
                    </div>
                    <h2 className="mt-2 font-display text-2xl uppercase">{b.titulo}</h2>
                    {autor ? (
                      <Link
                        to="/speakers/$slug"
                        params={{ slug: autor.slug }}
                        className="mt-1 text-sm font-semibold hover:text-brand"
                      >
                        {autor.nombre} →
                      </Link>
                    ) : null}
                    <p className="mt-3 text-sm text-muted-foreground">{b.descripcion}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
