import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Voz Estratégica" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async () => {
    // Verify admin session server-side
    try {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      if (!data.authenticated) {
        throw redirect({ to: "/auth" });
      }
    } catch (err) {
      throw redirect({ to: "/auth" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  // Verify session on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        if (data.authenticated) {
          setIsVerified(true);
        } else {
          navigate({ to: "/auth" });
        }
      } catch (err) {
        navigate({ to: "/auth" });
      }
    })();
  }, [navigate]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      toast.success("Sesión cerrada");
      navigate({ to: "/auth" });
    } catch (err) {
      toast.error("Error al cerrar sesión");
    }
  }

  if (!isVerified) {
    return <div className="px-6 py-32 text-center text-muted-foreground">Cargando…</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 pb-4">
          <div>
            <span className="bubble bubble-yellow">Panel admin</span>
            <h1 className="mt-3 font-display text-3xl uppercase">Voz Estratégica</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm font-semibold hover:bg-foreground hover:text-background"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>

        <nav className="mb-8 flex flex-wrap gap-2">
          {[
            ["/admin", "Solicitudes"],
            ["/admin/suscriptores", "Suscriptores"],
            ["/admin/pedidos-libros", "Pedidos de libros"],
            ["/admin/speakers", "Speakers"],
            ["/admin/libros", "Libros"],
            ["/admin/eventos", "Eventos"],
            ["/admin/galeria", "Galería"],
            ["/admin/intelligence", "Voz Intelligence"],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to as any}
              activeProps={{ className: "bg-foreground text-background" }}
              className="rounded-full border border-foreground/20 px-4 py-2 text-sm font-semibold transition-colors hover:bg-foreground/10"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
