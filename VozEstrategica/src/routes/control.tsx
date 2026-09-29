import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BarChart3, LogOut } from "lucide-react";

export const Route = createFileRoute("/control")({
  head: () => ({
    meta: [
      { title: "Centro Maestro — Voz Estratégica" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async () => {
    try {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      if (!data.authenticated) {
        throw redirect({ to: "/control/login" });
      }
    } catch (err) {
      throw redirect({ to: "/control/login" });
    }
  },
  component: ControlLayout,
});

function ControlLayout() {
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
          navigate({ to: "/control/login" });
        }
      } catch (err) {
        navigate({ to: "/control/login" });
      }
    })();
  }, [navigate]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      toast.success("Sesión cerrada");
      navigate({ to: "/" });
    } catch (err) {
      toast.error("Error al cerrar sesión");
    }
  }

  if (!isVerified) {
    return <div className="flex min-h-dvh items-center justify-center text-muted-foreground">Cargando…</div>;
  }

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-foreground/10 bg-card p-6">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white font-bold text-sm">
            VOZ
          </div>
          <div>
            <div className="font-display font-bold text-sm uppercase">Voz Control</div>
            <div className="text-xs text-muted-foreground">Centro Maestro</div>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { href: "/control", label: "Resumen", icon: "📊" },
            { href: "/control/intelligence", label: "Intelligence", icon: "🧠" },
            { href: "/control/documents", label: "Documentos", icon: "📄" },
            { href: "/control/integrations", label: "Integraciones", icon: "🔌" },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href as any}
              activeProps={{ className: "bg-foreground text-background" }}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/10"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
