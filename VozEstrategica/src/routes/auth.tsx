import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Sesión iniciada");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Verificá tu correo para activarla.");
      }
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
          {mode === "signin" ? "Acceso administrador" : "Crear cuenta"}
        </h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="email@vozestrategica.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none focus:border-brand"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={loading}
            className="bubble bubble-black w-full justify-center py-3 disabled:opacity-60"
          >
            {loading
              ? "Procesando..."
              : mode === "signin"
                ? "Ingresar"
                : "Crear cuenta"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin"
            ? "¿Sos nuevo? Crear cuenta"
            : "¿Ya tienes cuenta? Ingresar"}
        </button>
      </div>
    </div>
  );
}
