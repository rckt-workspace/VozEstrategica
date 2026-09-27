import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { useLocation } from "@tanstack/react-router";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface NextAction {
  type: string;
  label: string;
  href?: string;
}

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      elements.push(<br key={`br-${i}`} />);
      i++;
      continue;
    }

    const boldMatch = line.match(/\*\*(.+?)\*\*/g);
    if (boldMatch) {
      const parts = line.split(/(\*\*.+?\*\*)/);
      const rendered = parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={idx}>{part.slice(2, -2)}</strong>
          );
        }
        return <span key={idx}>{part}</span>;
      });
      elements.push(
        <div key={`line-${i}`} className="mb-2">
          {rendered}
        </div>
      );
      i++;
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <div key={`list-${i}`} className="ml-4 mb-1">
          • {line.replace(/^[-•]\s+/, "")}
        </div>
      );
      i++;
      continue;
    }

    elements.push(
      <div key={`text-${i}`} className="mb-2">
        {line}
      </div>
    );
    i++;
  }

  return elements;
}

const QUICK_ACTIONS = [
  { label: "Encontrar un speaker", action: "speaker" },
  { label: "Capacitar a mi equipo", action: "training" },
  { label: "Explorar programas", action: "programs" },
  { label: "Solicitar una propuesta", action: "proposal" },
];

export function PublicVozAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showQuickActions, setShowQuickActions] = useState(true);
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
            "Hola 👋 Soy el asistente virtual de Voz Estratégica.\n\nPuedo ayudarte a encontrar speakers, conferencias, programas o la solución adecuada para tu organización.\n\n¿Qué quieres lograr?",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickAction = (action: string) => {
    const actionText = QUICK_ACTIONS.find((a) => a.action === action)?.label || action;
    handleSendMessage(actionText);
  };

  const handleSendMessage = async (messageText: string) => {
    const userMessage = messageText.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    setShowQuickActions(false);
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

      if (data.data.nextAction) {
        handleNextAction(data.data.nextAction);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Disculpa, estoy teniendo dificultades técnicas. Por favor intenta de nuevo.",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
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
      case "proposal":
        window.location.href = "/contratar";
        break;
    }
  };

  if (shouldHide) return null;

  const widgetBottom = "calc(1.5rem + var(--bottombar-h, 0px))";

  return (
    <>
      {/* Launcher Button — Left side */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-6 z-[80] flex items-center gap-2 rounded-full bg-black px-4 py-3 text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl sm:left-3"
          style={{ bottom: widgetBottom }}
          aria-label="Asistente Voz Estratégica"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-semibold hidden sm:inline">Asistente</span>
        </button>
      )}

      {/* Chat Panel — Shares exact position with launcher */}
      {isOpen && (
        <div
          className="fixed left-6 z-[100] flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-950 sm:left-3 sm:right-3"
          style={{
            width: "390px",
            maxWidth: "calc(100vw - 48px)",
            height: "min(520px, calc(100dvh - 48px))",
            maxHeight: "calc(100dvh - 48px)",
            bottom: widgetBottom,
            transformOrigin: "bottom left",
            animation: "fadeInScale 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          <style>{`
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: scale(0.96);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
          {/* Header */}
          <div className="border-b border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex items-start justify-between gap-3">
              {/* Left: Brand Icon + Title */}
              <div className="flex min-w-0 items-start gap-3">
                {/* Brand Badge */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white font-bold text-xs tracking-wider">
                  VOZ
                </div>

                {/* Text Content */}
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-display font-bold text-neutral-900 dark:text-white uppercase text-sm tracking-wide leading-none">
                    Voz Estratégica
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5">
                    Orientación estratégica
                  </p>
                </div>
              </div>

              {/* Right: Close Button */}
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsOpen(false);
                  setShowQuickActions(true);
                }}
                className="relative z-[110] pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Cerrar asistente"
              >
                <X className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-neutral-950">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  }`}
                >
                  {msg.role === "assistant" ? parseMarkdown(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 py-3">
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

            {/* Quick Actions */}
            {showQuickActions && messages.length === 1 && !isLoading && (
              <div className="mt-6 space-y-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.action}
                    onClick={() => handleQuickAction(action.action)}
                    className="w-full text-left rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-yellow-50 hover:border-yellow-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className="border-t border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-black p-2 text-white transition-colors hover:bg-neutral-900 disabled:opacity-50 dark:hover:bg-neutral-800"
                aria-label="Enviar"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
