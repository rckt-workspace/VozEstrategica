import { useState, useRef, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { useLocation } from "@tanstack/react-router";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Recommendation {
  slug?: string;
  title: string;
  reason: string;
  type: string;
}

interface NextAction {
  type: string;
  label: string;
  href?: string;
}

export function PublicVozAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const abortControllerRef = useRef<AbortController | null>(null);

  const normalizedPath = (location.pathname.replace(/\/+$/, "") || "/").toLowerCase();
  const isAuth = normalizedPath === "/auth";
  const isAdmin = normalizedPath.startsWith("/admin");
  const shouldHide = isAuth || isAdmin;

  // Show initial message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hola. Soy el asistente virtual de Voz Estratégica.\n\nPuedo ayudarte a encontrar speakers, conferencias, programas, contenidos o la solución adecuada para tu organización.\n\n¿Qué quieres lograr?",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          history: messages,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Error en el agente");
      }

      const agentMsg = data.data.message;
      setMessages((prev) => [...prev, { role: "assistant", content: agentMsg }]);

      // Handle recommendations if present
      if (data.data.recommendations?.length > 0) {
        // Recommendations are shown as part of the assistant message flow
        // Render them as clickable cards below
      }

      // Handle next action if present
      if (data.data.nextAction) {
        handleNextAction(data.data.nextAction);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Agent error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Disculpa, estoy teniendo dificultades técnicas. Por favor intenta de nuevo.",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextAction = (action: NextAction) => {
    switch (action.type) {
      case "navigate":
        if (action.href) window.location.href = action.href;
        break;
      case "whatsapp":
        if (action.href) window.open(action.href, "_blank");
        break;
      case "contact":
        window.location.href = "/contratar";
        break;
      case "proposal":
        window.location.href = "/contratar";
        break;
    }
  };

  if (shouldHide) return null;

  return (
    <>
      {/* Assistant Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
          style={{ bottom: "calc(5.5rem + var(--bottombar-h, 0px))" }}
          aria-label="Asistente Voz Estratégica"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed right-6 bottom-20 z-40 flex h-[32rem] w-96 flex-col rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 sm:w-[calc(100vw-2rem)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                VOZ ESTRATÉGICA
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Asistente virtual
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg px-3 py-2">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-neutral-500 animate-bounce" />
                    <div
                      className="h-2 w-2 rounded-full bg-neutral-500 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-neutral-500 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-black px-3 py-2 text-white disabled:opacity-50 hover:bg-neutral-900"
              >
                →
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
