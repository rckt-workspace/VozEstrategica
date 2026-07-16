import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Logo className="h-14 w-auto" />
            <p className="mt-6 max-w-xs text-sm text-background/70">
              Firma de aprendizaje corporativo, liderazgo y transformación. Las voces que cambian la conversación.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-brand">
              Navegación
            </h4>
            <ul className="mt-4 space-y-2 text-base font-semibold">
              {[
                ["/soluciones", "Soluciones"],
                ["/programas", "Programas"],
                ["/speakers", "Conferencistas"],
                
                ["/recursos", "Recursos"],
                ["/nosotros", "Nosotros"],
                ["/contratar", "Solicitar propuesta"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-brand">
                    {label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-brand">
              Contacto
            </h4>
            <ul className="mt-4 space-y-2 text-base">
              <li>
                <a href="mailto:contacto@vozestrategica.com" className="transition-colors hover:text-brand">
                  contacto@vozestrategica.com
                </a>
              </li>
              <li>
                <a href="tel:+573156568617" className="transition-colors hover:text-brand">
                  +57 315 6568617
                </a>
              </li>
              <li className="text-background/60">Bogotá · CDMX · Madrid</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-background/15 pt-8 text-xs text-background/60 md:flex-row">
          <p>© {new Date().getFullYear()} Voz Estratégica. Todos los derechos reservados.</p>
          <Link to="/auth" className="hover:text-brand">
            Acceso administrador
          </Link>
        </div>
      </div>
    </footer>
  );
}
