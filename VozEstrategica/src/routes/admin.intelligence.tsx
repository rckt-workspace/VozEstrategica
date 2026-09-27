import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/admin/intelligence")({
  component: IntelligencePage,
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

function IntelligencePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg }),
      });

      if (!res.ok) throw new Error("Error en el agente");

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.data.message }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error procesando consulta. Intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl uppercase">Voz Intelligence</h2>
        <p className="mt-1 text-muted-foreground">
          Inteligencia comercial y estratégica de Voz Estratégica
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Leads", value: "Pendiente" },
          { label: "Pedidos", value: "Pendiente" },
          { label: "Ingresos", value: "Pendiente" },
          { label: "Suscriptores", value: "Pendiente" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-foreground/10 bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="mt-2 font-display text-2xl">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Admin Agent Chat */}
      <div className="rounded-lg border border-foreground/10 bg-card p-6">
        <h3 className="font-semibold mb-4">Copiloto Ejecutivo</h3>

        <div className="flex h-96 flex-col gap-4">
          <div className="flex-1 overflow-y-auto space-y-4 border border-foreground/5 rounded-lg p-4 bg-background">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <p className="font-semibold">Copiloto Ejecutivo</p>
                  <p className="text-sm mt-1">
                    Pregunta sobre el negocio, tendencias y oportunidades
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-black text-white"
                        : "bg-neutral-100 text-neutral-900"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="¿Cómo estuvo el negocio?"
              disabled={isLoading}
              className="flex-1 rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-black disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 hover:bg-neutral-900"
            >
              →
            </button>
          </form>
        </div>
      </div>

      {/* Integrations Status */}
      <div className="rounded-lg border border-foreground/10 bg-card p-6">
        <h3 className="font-semibold mb-4">Estado de Integraciones</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Supabase</span>
            <span className="text-green-600">Conectado</span>
          </div>
          <div className="flex justify-between">
            <span>GA4 Data API</span>
            <span className="text-amber-600">Pendiente de configuración</span>
          </div>
          <div className="flex justify-between">
            <span>Google Ads API</span>
            <span className="text-amber-600">Pendiente de configuración</span>
          </div>
          <div className="flex justify-between">
            <span>Agent Metrics</span>
            <span className="text-amber-600">Pendiente de configuración</span>
          </div>
        </div>
      </div>
    </div>
  );
}
