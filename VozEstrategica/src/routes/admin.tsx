import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Voz Estratégica" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  component: AdminLayout,
});


function AdminLayout() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/auth" });
        return;
      }
      setEmail(user.email ?? null);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    })();
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate({ to: "/" });
  }

  if (isAdmin === null) {
    return <div className="px-6 py-32 text-center text-muted-foreground">Cargando…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <span className="bubble bubble-yellow">Acceso restringido</span>
        <h1 className="mt-6 font-display text-4xl uppercase">Falta rol de administrador</h1>
        <p className="mt-4 text-muted-foreground">
          Tu cuenta <span className="font-bold">{email}</span> no tiene el rol{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">admin</code>. Pedile
          al equipo que lo agregue desde la base de datos.
        </p>
        <button onClick={signOut} className="bubble bubble-black mt-8">
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 pb-4">
          <div>
            <span className="bubble bubble-yellow">Panel admin</span>
            <h1 className="mt-3 font-display text-3xl uppercase">Voz Estratégica</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{email}</span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm font-semibold hover:bg-foreground hover:text-background"
            >
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        </div>

        <nav className="mb-8 flex flex-wrap gap-2">
          {[
            ["/admin", "Solicitudes"],
            ["/admin/suscriptores", "Suscriptores"],
            ["/admin/pedidos-libros", "Pedidos de libros"],
            // Ocultas por pedido del cliente (rutas siguen activas):
            // ["/admin/eventos", "Eventos"],
            // ["/admin/speakers", "Speakers"],
            // ["/admin/libros", "Libros"],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/admin" }}
              className="rounded-full border border-foreground/15 px-4 py-2 text-sm font-semibold hover:bg-foreground/5"
              activeProps={{
                className:
                  "rounded-full px-4 py-2 text-sm font-semibold bg-foreground text-background",
              }}
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

