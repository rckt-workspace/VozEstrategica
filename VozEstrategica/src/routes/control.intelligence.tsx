import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const Route = createFileRoute("/control/intelligence")({
  component: ControlIntelligencePage,
});

const QUICK_QUESTIONS = [
  "Resumen del negocio",
  "¿Qué cambió esta semana?",
  "Oportunidades comerciales",
  "¿Qué debería priorizar?",
];

function ControlIntelligencePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="flex h-[calc(100dvh-2rem)] flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl uppercase">Copiloto Ejecutivo</h1>
        <p className="mt-1 text-muted-foreground">Inteligencia estratégica en tiempo real</p>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col rounded-lg border border-foreground/10 bg-card">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
              <div>
                <p className="font-semibold">Copiloto Ejecutivo</p>
                <p className="text-sm mt-2 text-muted-foreground">Pregunta sobre el negocio, tendencias y oportunidades</p>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 w-full">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      handleSend({ preventDefault: () => {}, currentTarget: { value: q } } as any);
                    }}
                    className="rounded-lg border border-foreground/10 bg-background px-4 py-2 text-sm text-left hover:bg-foreground/5 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xl rounded-lg px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-foreground/10 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="¿Cómo estuvo el negocio?"
              disabled={isLoading}
              className="flex-1 rounded-lg border border-foreground/10 bg-background px-4 py-2 text-sm outline-none focus:border-black disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-black p-2 text-white disabled:opacity-50 hover:bg-neutral-900"
              aria-label="Enviar"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
