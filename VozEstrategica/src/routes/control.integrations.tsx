import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/control/integrations")({
  component: ControlIntegrationsPage,
});

interface Integration {
  name: string;
  status: "connected" | "pending" | "error";
  description: string;
  lastCheck?: string;
}

function ControlIntegrationsPage() {
  const integrations: Integration[] = [
    {
      name: "Supabase",
      status: "connected",
      description: "Base de datos principal y autenticación",
      lastCheck: "Hace 2 min",
    },
    {
      name: "OpenRouter",
      status: "connected",
      description: "Proveedor de modelos LLM (agentes)",
      lastCheck: "Hace 5 min",
    },
    {
      name: "GA4",
      status: "pending",
      description: "Analytics y tracking de eventos",
      lastCheck: "No configurado",
    },
    {
      name: "Google Ads",
      status: "pending",
      description: "Métricas de publicidad y ROI",
      lastCheck: "No configurado",
    },
    {
      name: "Agent Metrics",
      status: "pending",
      description: "Tracking de interacciones del agente",
      lastCheck: "No configurado",
    },
  ];

  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusLabel = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "Conectado";
      case "pending":
        return "Pendiente";
      case "error":
        return "Error";
    }
  };

  const getStatusColor = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "pending":
        return "text-amber-600";
      case "error":
        return "text-red-600";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl uppercase">Integraciones</h1>
        <p className="mt-2 text-muted-foreground">Estado de servicios conectados</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-foreground/10 bg-card p-4">
          <p className="text-sm text-muted-foreground">Conectadas</p>
          <p className="mt-2 text-2xl font-bold">
            {integrations.filter((i) => i.status === "connected").length}
          </p>
        </div>
        <div className="rounded-lg border border-foreground/10 bg-card p-4">
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="mt-2 text-2xl font-bold">
            {integrations.filter((i) => i.status === "pending").length}
          </p>
        </div>
        <div className="rounded-lg border border-foreground/10 bg-card p-4">
          <p className="text-sm text-muted-foreground">Errores</p>
          <p className="mt-2 text-2xl font-bold">
            {integrations.filter((i) => i.status === "error").length}
          </p>
        </div>
      </div>

      {/* Integration List */}
      <div className="space-y-3">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex items-start justify-between rounded-lg border border-foreground/10 bg-card p-4"
          >
            <div className="flex items-start gap-3 flex-1">
              {getStatusIcon(integration.status)}
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{integration.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                {integration.lastCheck && (
                  <p className="text-xs text-muted-foreground mt-2">{integration.lastCheck}</p>
                )}
              </div>
            </div>
            <span className={`ml-4 text-sm font-medium whitespace-nowrap ${getStatusColor(integration.status)}`}>
              {getStatusLabel(integration.status)}
            </span>
          </div>
        ))}
      </div>

      {/* Setup Instructions */}
      <div className="rounded-lg border border-foreground/10 bg-card p-6">
        <h3 className="font-semibold mb-4">Próximos pasos</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Configurar GA4 Data API para métricas en tiempo real</li>
          <li>Conectar Google Ads para tracking de campañas</li>
          <li>Activar Agent Metrics para monitoreo de interacciones</li>
          <li>Validar todas las conexiones en dashboard</li>
        </ol>
      </div>
    </div>
  );
}
