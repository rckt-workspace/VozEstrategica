import { Calendar, Target, Mic, Lightbulb, RotateCcw, MessageSquareMore } from "lucide-react";
import { Reveal } from "@/components/Reveal";

type Item = {
  icon: React.ReactNode;
  title: string;
  body: string;
};

const left: Item[] = [
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Tu evento",
    body: "Una fecha que importa: convención, lanzamiento o congreso.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Tu objetivo",
    body: "Mover a tu equipo, impulsar ventas o posicionar tu marca.",
  },
];

const right: Item[] = [
  {
    icon: <Mic className="h-6 w-6" />,
    title: "Un escenario que conecta",
    body: "Voces que unen negocio y factor humano.",
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Impacto que se aplica",
    body: "Ideas que tu equipo usa el lunes.",
  },
  {
    icon: <RotateCcw className="h-6 w-6" />,
    title: "Una capacidad instalada",
    body: "Programas y escuelas que convierten la charla en desarrollo continuo.",
  },
];

const HUB = { x: 500, y: 360 };

// Left paths drawn from card → hub so particles flow INTO the hub
const leftPaths = [
  `M 0 180 C 220 180, 320 ${HUB.y - 40}, ${HUB.x} ${HUB.y}`,
  `M 0 540 C 220 540, 320 ${HUB.y + 40}, ${HUB.x} ${HUB.y}`,
];

const rightPaths = [
  `M ${HUB.x} ${HUB.y} C 680 ${HUB.y - 40}, 780 120, 1000 120`,
  `M ${HUB.x} ${HUB.y} C 700 ${HUB.y}, 800 360, 1000 360`,
  `M ${HUB.x} ${HUB.y} C 680 ${HUB.y + 40}, 780 600, 1000 600`,
];



function Card({ item, align, index = 0 }: { item: Item; align: "left" | "right"; index?: number }) {
  const animate = align === "right";
  const iconAnims = ["animate-pulse-soft", "animate-bob", "animate-spin-slow"];
  const iconAnim = animate ? iconAnims[index % iconAnims.length] : "";
  return (
    <div
      className={`group flex items-start gap-4 rounded-3xl border border-foreground/10 bg-background p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] ${
        align === "right" ? "md:flex-row-reverse md:text-right" : ""
      }`}
    >
      <div className={`relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-foreground text-brand`}>
        {animate && (
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand/30 to-transparent animate-shimmer" />
        )}
        <span className={iconAnim}>{item.icon}</span>
      </div>
      <div>
        <div className="font-display text-lg uppercase leading-tight md:text-xl">{item.title}</div>
        <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
      </div>
    </div>
  );
}


export function FlowDiagram() {
  return (
    <section className="relative overflow-hidden bg-[#f7f3e7] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              Cómo trabajamos contigo
            </div>
            <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] md:text-6xl">
              De tu evento a una<br />conversación que perdura
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] md:gap-8">
          <Reveal>
            <div className="hidden md:block">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Lo que traes
              </div>
            </div>
          </Reveal>
          <div />
          <Reveal>
            <div className="hidden md:block md:text-right">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Lo que te llevas
              </div>
            </div>
          </Reveal>
        </div>

        <div className="relative mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_1.2fr_1fr] md:gap-8">
          {/* Left column */}
          <div className="flex flex-col justify-around gap-6 md:h-[520px]">
            {left.map((it) => (
              <Reveal key={it.title}>
                <Card item={it} align="left" />
              </Reveal>
            ))}
          </div>

          {/* Center column with SVG */}
          <div className="relative order-first md:order-none md:h-[520px]">
            <svg
              viewBox="0 0 1000 720"
              className="absolute inset-0 hidden h-full w-full md:block"
              preserveAspectRatio="xMidYMid meet"
              overflow="visible"
              style={{ overflow: "visible" }}
              aria-hidden
            >
              <defs>
                <filter id="tube-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                  <feOffset dy="1" result="off" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Tubes — outer subtle stroke + inner white fill */}
              <g filter="url(#tube-shadow)">
                {[...leftPaths, ...rightPaths].map((d, i) => (
                  <path
                    key={`tube-outer-${i}`}
                    d={d}
                    fill="none"
                    stroke="#e9e3d2"
                    strokeWidth="42"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {[...leftPaths, ...rightPaths].map((d, i) => (
                  <path
                    key={`tube-inner-${i}`}
                    d={d}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="38"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </g>

              {/* Particles flowing along left paths into hub */}
              {leftPaths.map((path, i) =>
                Array.from({ length: 8 }).map((_, j) => {
                  const colors = ["#0A0A0A", "#9a9a9a", "#E63946", "#F08A4B"];
                  const color = colors[(i + j) % colors.length];
                  const r = 3 + ((i + j) % 2);
                  const dur = 4.5 + ((i * 0.6 + j * 0.5) % 2.5);
                  const begin = -(j * (dur / 8));
                  return (
                    <circle key={`lp-${i}-${j}`} r={r} fill={color}>
                      <animateMotion
                        dur={`${dur}s`}
                        repeatCount="indefinite"
                        begin={`${begin}s`}
                        path={path}
                        rotate="auto"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.1;0.85;1"
                        dur={`${dur}s`}
                        begin={`${begin}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                }),
              )}


              {/* Particles flowing along right paths */}
              {rightPaths.map((_, i) =>
                Array.from({ length: 10 }).map((_, j) => {
                  const colors = ["#0A0A0A", "#FFD400", "#9a9a9a", "#E63946"];
                  const color = colors[(i + j) % colors.length];
                  const r = 3 + ((i + j) % 3);
                  const dur = 4 + ((i * 0.7 + j * 0.4) % 3);
                  const begin = -(j * (dur / 10));
                  return (
                    <circle key={`p-${i}-${j}`} r={r} fill={color}>
                      <animateMotion
                        dur={`${dur}s`}
                        repeatCount="indefinite"
                        begin={`${begin}s`}
                        path={rightPaths[i]}
                        rotate="auto"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.1;0.85;1"
                        dur={`${dur}s`}
                        begin={`${begin}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                }),
              )}
            </svg>

            {/* Hub */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center py-10">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Voz Estratégica
              </div>
              <div className="mt-3 grid h-24 w-24 place-items-center rounded-3xl bg-brand shadow-[0_18px_40px_-12px_rgba(255,212,0,0.6)] ring-1 ring-foreground/20">
                <MessageSquareMore className="h-12 w-12 text-foreground" strokeWidth={2.5} />
              </div>
              <div className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground/70">
                Curamos · Programamos · Extendemos
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-around gap-6 md:h-[520px]">
            {right.map((it, i) => (
              <Reveal key={it.title}>
                <Card item={it} align="right" index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
