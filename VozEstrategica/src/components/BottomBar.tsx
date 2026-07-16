import { useEffect } from "react";

const URL = "/masterclass-de-clientes-a-fans";
const HEIGHT = 76;

export function BottomBar() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bottombar-h", `${HEIGHT}px`);
    return () => {
      root.style.setProperty("--bottombar-h", "0px");
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[65] flex items-center gap-3 bg-black px-3 py-2 text-white sm:gap-4 sm:px-6"
      style={{ minHeight: HEIGHT }}
    >
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center text-center leading-tight">
        <span className="w-full truncate text-sm font-bold text-white sm:text-base">
          Masterclass: De Clientes a Fans
        </span>
        <span className="w-full truncate text-xs font-normal text-white/70 sm:text-sm">
          Con Carlos Laguna · 25 de julio · $20 USD
        </span>
      </div>
      <a
        href={URL}
        className="inline-flex shrink-0 items-center rounded-full bg-[#EAC945] px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105 sm:px-6 sm:py-3 sm:text-base"
      >
        Reservar →
      </a>
    </div>
  );
}
