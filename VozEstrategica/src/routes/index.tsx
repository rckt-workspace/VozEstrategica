import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Users, Mic2, GraduationCap, BookOpen } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { FlowDiagram } from "@/components/FlowDiagram";

import { speakers, events, books } from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voz Estratégica — Aprendizaje corporativo, liderazgo y transformación" },
      {
        name: "description",
        content:
          "Firma de aprendizaje corporativo en Colombia, México y España. Conferencias, talleres, programas y escuelas que desarrollan personas, fortalecen equipos y generan resultados de negocio.",
      },
      { property: "og:title", content: "Voz Estratégica — Aprendizaje corporativo, liderazgo y transformación" },
      {
        property: "og:description",
        content:
          "Diseñamos experiencias de aprendizaje —conferencias, talleres, programas y escuelas— que generan resultados de negocio.",
      },
      { property: "og:url", content: "https://vozestrategica.com/" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Voz Estratégica — Aprendizaje corporativo" },
      {
        name: "twitter:description",
        content: "Conferencias, talleres, programas y escuelas que transforman organizaciones.",
      },
    ],
    links: [{ rel: "canonical", href: "https://vozestrategica.com/" }],
  }),

  component: Home,
});

const TERRITORIOS = [
  { titulo: "Liderazgo", desc: "Liderazgo humano, adaptativo y comercial." },
  { titulo: "Comunicación", desc: "Conversaciones difíciles y presentaciones de alto impacto." },
  { titulo: "Cultura", desc: "Bienestar, propósito y trabajo intergeneracional." },
  { titulo: "Transformación", desc: "IA, innovación, cambio y adaptación." },
  { titulo: "Ventas y cliente", desc: "Experiencia, servicio y mentalidad comercial." },
];

const SOLUCIONES = [
  { icon: Mic2, titulo: "Conferencias", desc: "La chispa. 60–90 min con una de nuestras 8 voces." },
  { icon: GraduationCap, titulo: "Formación", desc: "Talleres, workshops y programas que instalan capacidades." },
  { icon: Users, titulo: "Consultoría", desc: "Acompañamiento a medida en cultura, comunicación y liderazgo." },
  { icon: BookOpen, titulo: "Contenido", desc: "Libros, newsletter y recursos que extienden el aprendizaje." },
];

const ESCALERA = [
  ["Conferencia", "60–90 min"],
  ["Taller", "2–4 h"],
  ["Workshop", "4–8 h"],
  ["Programa", "4–12 semanas"],
  ["Escuela", "6–12 meses"],
  ["Consultoría", "Por proyecto"],
];

const METODO = ["Diagnóstico", "Conferencia", "Talleres", "Seguimiento", "Medición"];

function Home() {
  const destacados = speakers;
  const marqueeNames = [...speakers, ...speakers].map((s) => s.nombre);

  return (
    <>
      {/* 1. HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-32 top-10 h-[36rem] w-[36rem] rounded-full bg-brand/45 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-foreground/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-28 md:pt-28 md:pb-36">
          <Reveal>
            <span className="bubble bubble-outline inline-flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-brand" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              Aprendizaje corporativo · Liderazgo · Transformación
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-10 font-display text-[3rem] uppercase leading-[0.9] [hyphens:auto] sm:text-6xl sm:leading-[0.85] md:text-8xl lg:text-[10rem]">
              Las voces que{" "}
              <span className="highlight-yellow">
                <span>cambian</span>
                <span />
              </span>{" "}
              la conversación.
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <p className="mt-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Diseñamos experiencias de aprendizaje —conferencias, talleres, programas y escuelas— que desarrollan personas, fortalecen equipos y generan resultados de negocio.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to="/soluciones"
                className="bubble bubble-black group inline-flex items-center gap-2 px-6 py-3 text-base transition-transform hover:scale-105"
              >
                Explorar soluciones
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contratar"
                className="bubble bubble-yellow group inline-flex items-center gap-2 px-6 py-3 text-base transition-transform hover:scale-105"
              >
                Solicitar propuesta
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="mt-24 grid grid-cols-2 gap-px overflow-hidden border-y border-foreground/15 bg-foreground/15 md:grid-cols-4">
              {[
                ["+1.500", "Conferencias dictadas"],
                ["14", "Países"],
                ["+500K", "Vidas impactadas"],
                ["8", "Voces curadas"],
              ].map(([n, l]) => (
                <div key={l} className="bg-background px-2 py-6">
                  <div className="font-display text-4xl md:text-5xl">{n}</div>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. TERRITORIOS */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <span className="section-badge">Propuesta de valor</span>
            <h2 className="mt-6 font-display text-4xl uppercase leading-[0.95] md:text-6xl">
              Desarrollamos capacidades que transforman organizaciones
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              No vendemos un evento: diseñamos procesos de aprendizaje que se aplican y se miden. Trabajamos cinco territorios donde el negocio se cruza con el factor humano.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {TERRITORIOS.map((t, i) => (
            <Reveal key={t.titulo} delay={i * 60}>
              <div className="h-full rounded-3xl border border-foreground/10 bg-card p-6 transition-colors hover:border-foreground/30">
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

      {/* 3. FLOW DIAGRAM */}
      <FlowDiagram />

      {/* 4. SOLUCIONES */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-28">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-badge">Soluciones</span>
              <h2 className="mt-6 font-display text-4xl uppercase leading-[0.95] md:text-6xl">
                Del descubrimiento a<br />la transformación
              </h2>
            </div>
            <Link to="/soluciones" className="bubble bubble-outline w-fit">
              Ver soluciones →
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUCIONES.map((s, i) => (
            <Reveal key={s.titulo} delay={i * 80}>
              <div className="h-full rounded-3xl border border-foreground/10 bg-background p-6">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-foreground text-brand">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="mt-5 font-display text-2xl uppercase leading-tight">{s.titulo}</div>
                <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Escalera */}
        <Reveal delay={200}>
          <div className="mt-12 overflow-x-auto">
            <div className="flex min-w-max items-stretch gap-2 rounded-3xl border border-foreground/10 bg-card p-3">
              {ESCALERA.map(([label, dur], i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="rounded-2xl bg-background px-4 py-3 text-center">
                    <div className="font-display text-sm uppercase">{label}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {dur}
                    </div>
                  </div>
                  {i < ESCALERA.length - 1 ? (
                    <ArrowRight className="h-4 w-4 text-foreground/40" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 5. ESCUELA VOZ ESTRATÉGICA */}
      <section className="relative overflow-hidden bg-foreground py-24 text-background md:py-32">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-brand/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <span className="section-badge section-badge-dark">Producto estrella</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[0.9] md:text-7xl lg:text-8xl">
              Escuela<br />
              <span className="text-brand">Voz Estratégica</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg text-background/75 md:text-xl">
              Nuestros programas de liderazgo, comunicación, cultura, ventas e innovación. Un método que garantiza que el aprendizaje se aplique y se mida —no que se olvide al salir del auditorio.
            </p>
          </Reveal>

          {/* Método 5 pasos */}
          <Reveal delay={300}>
            <div className="mt-14 overflow-x-auto">
              <div className="flex min-w-max items-center gap-3">
                {METODO.map((paso, i) => (
                  <div key={paso} className="flex items-center gap-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-background/20 bg-background/5 px-5 py-4">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-brand font-display text-sm text-foreground">
                        {i + 1}
                      </div>
                      <div className="font-display text-lg uppercase">{paso}</div>
                    </div>
                    {i < METODO.length - 1 ? (
                      <ArrowRight className="h-5 w-5 text-brand" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <p className="font-mono text-sm uppercase tracking-widest text-background/60">
                Programas de 3, 6 y 12 meses
              </p>
              <Link
                to="/programas"
                className="bubble bubble-yellow inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                Conocer la Escuela <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. MARQUEE */}
      <section className="relative overflow-hidden border-y border-foreground/15 bg-background py-10">
        <div className="flex w-[200%] animate-marquee items-center whitespace-nowrap">
          {marqueeNames.map((name, i) => {
            const treatment = i % 4;
            const cls =
              treatment === 0
                ? "text-foreground"
                : treatment === 1
                ? "text-brand"
                : treatment === 2
                ? "text-transparent [-webkit-text-stroke:1.5px_var(--foreground)]"
                : "text-foreground/25";
            return (
              <span key={`${name}-${i}`} className="flex items-center">
                <span className={`mx-8 font-display text-5xl uppercase md:text-8xl ${cls}`}>{name}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-7 w-7 md:h-10 md:w-10 shrink-0 ${
                    treatment % 2 === 0 ? "text-foreground" : "text-brand"
                  } ${treatment === 3 ? "opacity-20" : ""}`}
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z" />
                </svg>
              </span>
            );
          })}
        </div>
      </section>

      {/* 7. CONFERENCISTAS */}
      <section className="relative mx-auto max-w-7xl px-6 py-28">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-badge">01 · Conferencistas</span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal delay={100}>
            <h2 className="font-display text-5xl uppercase leading-[0.85] md:text-7xl">
              Nuestras<br />voces
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="max-w-md text-muted-foreground md:text-lg">
              Nuestras 8 voces son la puerta de entrada. Cada una conecta negocio y factor humano —y abre la conversación que después se convierte en un programa a medida.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {destacados.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <Link
                to="/speakers/$slug"
                params={{ slug: s.slug }}
                className={`group block ${i === 1 ? "md:mt-24" : ""}`}
              >
                <div className="relative mb-6 aspect-[3/4] overflow-hidden bg-foreground/5">
                  <img
                    src={s.foto}
                    alt={`Retrato de ${s.nombre}`}
                    loading="lazy"
                    width={768}
                    height={1024}
                    className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-background/90 px-3 py-1 font-mono text-[10px] font-bold tracking-widest backdrop-blur">
                    0{i + 1} / 0{destacados.length}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                      {s.especialidad}
                    </div>
                    <div className="mt-2 font-display text-3xl uppercase leading-none md:text-4xl">
                      {s.nombre}
                    </div>
                    <div className="mt-3 h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div className="mt-20 text-center">
            <Link to="/speakers" className="bubble bubble-outline">
              Ver todos los conferencistas →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 8. AGENDA */}
      <section className="relative overflow-hidden bg-foreground py-28 text-background">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="section-badge section-badge-dark">02 · Agenda</span>
              <div className="h-px flex-1 bg-background/15" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-8 font-display text-5xl uppercase md:text-8xl">
              Conferencias y webinars
            </h2>
          </Reveal>

          <ul className="mt-16 divide-y divide-background/15">
            {events.map((ev, i) => {
              const isMasterclass = ev.id === "ev-0";
              if (isMasterclass) {
                return (
                  <Reveal as="li" key={ev.id} delay={i * 80}>
                    <a
                      href="https://vozestrategica.com/masterclass-de-clientes-a-fans"
                      className="group flex flex-col gap-4 bg-[#16A34A] py-8 transition-all duration-500 hover:bg-[#15803D] hover:px-6 md:flex-row md:items-center md:gap-10"
                    >
                      <div className="font-mono text-sm font-bold uppercase tracking-widest text-white md:w-40 md:pl-6">
                        {formatDate(ev.fecha)}
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-2xl uppercase text-white md:text-3xl">
                          {ev.titulo}
                        </div>
                        <div className="mt-2 text-sm text-white/80">
                          {ev.ciudad} · {ev.descripcion}
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center rounded-full bg-white px-3 py-1 text-xs font-bold text-[#16A34A] md:mr-6">
                        Cupos abiertos
                      </span>
                      <ArrowUpRight className="h-6 w-6 text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:mr-6" />
                    </a>
                  </Reveal>
                );
              }
              return (
                <Reveal as="li" key={ev.id} delay={i * 80}>
                  <Link
                    to="/eventos"
                    className="group flex flex-col gap-4 py-8 transition-all duration-500 hover:bg-background/5 hover:px-6 md:flex-row md:items-center md:gap-10"
                  >
                    <div className="font-mono text-sm font-bold uppercase tracking-widest text-brand md:w-40">
                      {formatDate(ev.fecha)}
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-2xl uppercase md:text-3xl">
                        {ev.titulo}
                      </div>
                      <div className="mt-2 text-sm text-background/60">
                        {ev.ciudad} · {ev.descripcion}
                      </div>
                    </div>
                    <ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 9. CASOS — oculto temporalmente hasta contar con clientes/testimonios reales */}

      {/* 10. RECURSOS / LIBROS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="section-badge">03 · Recursos</span>
                <div className="h-px flex-1 bg-foreground/15" />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-8 font-display text-5xl uppercase md:text-6xl">
                Libros publicados
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {books.map((b, i) => (
                <Reveal key={b.id} delay={i * 80}>
                  <Link
                    to="/recursos"
                    className="group block overflow-hidden rounded-2xl bg-foreground/5"
                  >
                    <img
                      src={b.portada}
                      alt={`Portada de ${b.titulo}`}
                      loading="lazy"
                      width={768}
                      height={1024}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={200}>
            <div className="flex aspect-square flex-col justify-between rounded-[60px] bg-brand p-10 md:p-14">
              <span className="bubble bubble-black w-fit">Voz Editorial</span>
              <div>
                <h3 className="font-display text-5xl uppercase leading-[0.9] md:text-7xl">
                  Escribir el futuro hoy.
                </h3>
                <p className="mt-6 max-w-md text-foreground/80 md:text-lg">
                  Acompañamos a nuestros conferencistas a convertir sus ideas en libros, ensayos y manifiestos que extienden la conversación más allá del escenario.
                </p>
                <Link
                  to="/recursos"
                  className="mt-8 inline-flex items-center gap-2 font-bold underline underline-offset-4 hover:gap-3 transition-all"
                >
                  Ver recursos <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 11. CTA FINAL */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[60px] bg-brand px-8 py-24 text-center md:px-16 md:py-32">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-foreground/10 blur-3xl" />
            <h2 className="relative font-display text-4xl uppercase leading-tight md:text-7xl">
              ¿Listo para desarrollar<br />a tu equipo?
            </h2>
            <p className="relative mx-auto mt-6 max-w-2xl text-foreground/80 md:text-lg">
              Cuéntanos el reto de tu organización y te armamos una propuesta a medida —conferencia, programa o escuela— en menos de 48 horas.
            </p>
            <Link
              to="/contratar"
              className="relative mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-bold text-background transition-transform hover:scale-105"
            >
              Solicitar propuesta <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d
    .toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase()
    .replace(/\./g, "");
}
