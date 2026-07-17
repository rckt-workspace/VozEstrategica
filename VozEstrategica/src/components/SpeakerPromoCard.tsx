interface SpeakerPromoCardProps {
  badge: string;
  titulo: string;
  descripcion: string;
  textoBoton: string;
  link: string;
}

export function SpeakerPromoCard({ badge, titulo, descripcion, textoBoton, link }: SpeakerPromoCardProps) {
  return (
    <div className="rounded-3xl bg-brand p-8 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
            {badge}
          </span>
          <h3 className="mt-4 font-display text-2xl uppercase leading-tight md:text-3xl">{titulo}</h3>
          <p className="mt-3 max-w-xl text-sm text-foreground/75 md:text-base">{descripcion}</p>
        </div>
        <a
          href={link}
          className="bubble bubble-black w-fit shrink-0 transition-transform hover:scale-105"
        >
          {textoBoton}
        </a>
      </div>
    </div>
  );
}
