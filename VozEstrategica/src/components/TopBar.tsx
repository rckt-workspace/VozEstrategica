import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KEY = "ve_topbar_dismissed";
const URL = "/masterclass-de-clientes-a-fans";
const HEIGHT = 52;

export function TopBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = typeof window !== "undefined" && sessionStorage.getItem(KEY) === "1";
    setVisible(!dismissed);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--topbar-h", visible ? `${HEIGHT}px` : "0px");
    return () => {
      root.style.setProperty("--topbar-h", "0px");
    };
  }, [visible]);

  if (!visible) return null;

  const close = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] flex items-center justify-center bg-[#EAC945] text-black"
      style={{ minHeight: HEIGHT }}
    >
      <a
        href={URL}
        className="flex-1 px-4 py-2 text-center text-sm font-bold leading-tight sm:text-base"
      >
        Masterclass en vivo con Carlos Laguna · 25 de julio · Reserva tu cupo →
      </a>
      <button
        onClick={close}
        aria-label="Cerrar aviso"
        className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black hover:bg-black/10"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
