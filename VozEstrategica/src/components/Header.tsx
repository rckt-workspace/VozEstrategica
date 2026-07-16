import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/soluciones", label: "Soluciones" },
  { to: "/programas", label: "Programas" },
  { to: "/speakers", label: "Conferencistas" },
  
  { to: "/recursos", label: "Recursos" },
  { to: "/nosotros", label: "Nosotros" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-foreground/10" : ""
      }`}
      style={{ top: "var(--topbar-h, 0px)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center" aria-label="Voz Estratégica — Inicio">
          <Logo className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              activeProps={{ className: "rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider bg-black text-white" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/contratar"
          className="hidden lg:inline-flex bubble bubble-yellow ml-2 hover:scale-105 transition-transform"
        >
          Solicitar propuesta →
        </Link>

        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-full border border-foreground/20 p-2 lg:hidden"
          aria-label="Abrir menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-foreground/10 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-3 text-sm font-semibold uppercase tracking-wider"
                activeProps={{ className: "rounded-full px-4 py-3 text-sm font-semibold uppercase tracking-wider bg-black text-white" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contratar"
              onClick={() => setOpen(false)}
              className="bubble bubble-yellow mt-2 justify-center"
            >
              Solicitar propuesta →
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
