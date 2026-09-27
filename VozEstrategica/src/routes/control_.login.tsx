import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/control_/login")({
  head: () => ({
    meta: [
      { title: "Acceso — Centro Maestro" },
      { name: "description", content: "Acceso al Centro Maestro Voz Estratégica." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ControlLoginPage,
});

function ControlLoginPage() {
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
          navigate({ to: "/control" });
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
      navigate({ to: "/control" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-brand/40 blur-3xl"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-foreground/10 bg-card p-8 shadow-xl">
        <Logo className="mx-auto h-14 w-auto" />
        <h1 className="mt-6 text-center font-display text-3xl uppercase">
          Centro Maestro
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Inteligencia estratégica de Voz Estratégica
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Contraseña institucional"
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
            {loading ? "Verificando..." : "Acceder"}
          </button>
        </form>
      </div>
    </div>
  );
}
