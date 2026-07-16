import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/casos")({
  head: () => ({
    meta: [
      { title: "Casos de impacto — Voz Estratégica" },
      {
        name: "description",
        content:
          "Resultados reales de organizaciones que desarrollan su talento con Voz Estratégica: reto, solución y resultado.",
      },
      { property: "og:title", content: "Casos de impacto — Voz Estratégica" },
      {
        property: "og:description",
        content: "Organizaciones que trabajan su desarrollo con nuestras conferencias, programas y escuelas.",
      },
      { property: "og:url", content: "https://vozestrategica.com/casos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/casos" }],
  }),
  component: CasosPage,
});

const CASOS = [
  { empresa: "Cliente 1", reto: "Reto del negocio.", solucion: "Unidad / programa aplicado.", resultado: "Resultado observable." },
  { empresa: "Cliente 2", reto: "Reto del negocio.", solucion: "Unidad / programa aplicado.", resultado: "Resultado observable." },
  { empresa: "Cliente 3", reto: "Reto del negocio.", solucion: "Unidad / programa aplicado.", resultado: "Resultado observable." },
];

function CasosPage() {
  return (
    <>
      <PageHero
        badge="Prueba social"
        titulo={
          <>
            Casos de{" "}
            <span className="highlight-yellow">
              <span>impacto</span>
              <span />
            </span>
            .
          </>
        }
        descripcion="Resultados reales de organizaciones que desarrollan su talento con Voz Estratégica."
      />

      {/* Logos */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 sm:grid-cols-3 md:grid-cols-6">
            {["Cliente 1", "Cliente 2", "Cliente 3", "Cliente 4", "Cliente 5", "Cliente 6"].map((c) => (
              <div key={c} className="grid h-28 place-items-center bg-background px-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {c}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Casos */}
      <section className="mx-auto max-w-7xl px-6 py-16 space-y-6">
        {CASOS.map((c, i) => (
          <Reveal key={i} delay={i * 100}>
            <article className="grid gap-8 rounded-3xl border border-foreground/10 bg-card p-8 md:grid-cols-[200px_1fr] md:p-10">
              <div className="grid h-32 w-full place-items-center rounded-2xl bg-foreground/5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:h-full">
                {c.empresa}
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Reto</div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.reto}</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Solución</div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.solucion}</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Resultado</div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.resultado}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-[60px] bg-brand px-8 py-20 text-center md:px-16">
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            ¿Listo para ser el próximo caso?
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
