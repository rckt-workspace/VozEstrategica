import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BookPurchaseModal } from "@/components/BookPurchaseModal";
import { subscribeToNewsletter } from "@/lib/subscribers.functions";
import { books, type Book } from "@/data/content";

export const Route = createFileRoute("/recursos")({
  head: () => ({
    meta: [
      { title: "Recursos — Voz Estratégica" },
      {
        name: "description",
        content: "Newsletter, libros y recursos para desarrollar a tu equipo. Ideas, lecturas y herramientas.",
      },
      { property: "og:title", content: "Recursos — Voz Estratégica" },
      {
        property: "og:description",
        content: "Ideas, lecturas y herramientas para desarrollar a tu equipo.",
      },
      { property: "og:url", content: "https://vozestrategica.com/recursos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/recursos" }],
  }),
  component: RecursosPage,
});

function RecursosPage() {
  const subscribe = useServerFn(subscribeToNewsletter);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [openBook, setOpenBook] = useState<Book | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await subscribe({ data: { email, source: "recursos" } });
      if (res.duplicate) {
        toast.info("Ese correo ya estaba suscrito.");
      } else {
        toast.success("¡Gracias por suscribirte!");
      }
      setEmail("");
    } catch {
      toast.error("No pudimos registrarte. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        badge="Recursos"
        titulo={
          <>
            Ideas y{" "}
            <span className="highlight-yellow">
              <span>lecturas</span>
              <span />
            </span>
            .
          </>
        }
        descripcion="Ideas, lecturas y herramientas para desarrollar a tu equipo."
      />

      {/* Newsletter */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <div className="rounded-3xl bg-foreground p-8 text-background md:p-12">
            <span className="section-badge section-badge-dark">Newsletter</span>
            <h2 className="mt-6 font-display text-4xl uppercase leading-[0.95] md:text-5xl">
              La conversación
            </h2>
            <p className="mt-4 max-w-lg text-background/70">
              Nuestra newsletter con las mejores ideas de nuestras voces, cada quince días.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-full border border-background/20 bg-background/10 px-6 py-3 text-base text-background placeholder:text-background/40 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="bubble bubble-yellow shrink-0 justify-center disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Suscribirme →"}
              </button>
            </form>
          </div>
        </Reveal>
      </section>

      {/* Libros */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">Libros</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((b, i) => (
            <Reveal key={b.id} delay={i * 60}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-foreground/5">
                <img
                  src={b.portada}
                  alt={`Portada de ${b.titulo}`}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="flex flex-1 flex-col p-4">
                  <div className="font-display text-lg uppercase leading-tight">{b.titulo}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {b.anio}
                  </div>
                  {b.sku && b.precio ? (
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-base font-bold">${b.precio.toLocaleString("es-CO")}</div>
                      {b.sku === "ebook-paola" ? (
                        <a
                          href="https://pay.hotmart.com/U99654992V?sck=HOTMART_SITE&off=vi04neq9&hotfeature=32&bid=1775133064192"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-foreground px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
                        >
                          Comprar →
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setOpenBook(b)}
                          className="rounded-full bg-foreground px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
                        >
                          Comprar →
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Estudios */}
      <section className="mx-auto max-w-7xl px-6 py-16 pb-24">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">Estudios e informes</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl border border-dashed border-foreground/20 bg-card p-8 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Próximamente
              </div>
              <div className="mt-3 font-display text-xl uppercase">Informe #{n}</div>
            </div>
          ))}
        </div>
      </section>

      {openBook && openBook.sku && openBook.precio && openBook.formato && (
        <BookPurchaseModal
          open={!!openBook}
          onClose={() => setOpenBook(null)}
          sku={openBook.sku}
          titulo={openBook.titulo}
          precio={openBook.precio}
          formato={openBook.formato}
        />
      )}
    </>
  );
}
