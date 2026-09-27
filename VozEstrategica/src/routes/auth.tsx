import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso — Voz Estratégica" },
      { name: "description", content: "Acceso al panel administrador." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        if (data.authenticated) {
          navigate({ to: "/admin" });
        }
      } catch (err) {
        // Not authenticated, continue
      }
    })();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Contraseña inválida");
      }

      setPassword("");
      toast.success("Sesión iniciada");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-brand/40 blur-3xl"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-foreground/10 bg-card p-8 shadow-xl">
        <Logo className="mx-auto h-14 w-auto" />
        <h1 className="mt-6 text-center font-display text-3xl uppercase">
          Acceso administrativo
        </h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Contraseña institucional
            </label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none focus:border-brand disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="bubble bubble-black w-full justify-center py-3 disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
