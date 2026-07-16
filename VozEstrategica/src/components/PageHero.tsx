import type { ReactNode } from "react";

interface PageHeroProps {
  badge: string;
  titulo: ReactNode;
  descripcion?: string;
  children?: ReactNode;
}

export function PageHero({ badge, titulo, descripcion, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-foreground/10">
      {/* halo amarillo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-20 h-[28rem] w-[28rem] rounded-full bg-brand/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-foreground/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:pt-44 md:pb-28">
        <span className="bubble bubble-outline mb-8 animate-fade-in">{badge}</span>
        <h1 className="font-display text-5xl uppercase md:text-7xl lg:text-8xl animate-fade-up max-w-5xl">
          {titulo}
        </h1>
        {descripcion ? (
          <p
            className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            {descripcion}
          </p>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
