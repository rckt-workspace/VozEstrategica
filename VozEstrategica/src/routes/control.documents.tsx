import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileText, File } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/control/documents")({
  component: ControlDocumentsPage,
});

function ControlDocumentsPage() {
  const [documents, setDocuments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setUploading(true);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1000));

    Array.from(files).forEach((file) => {
      setDocuments((prev) => [...prev, file.name]);
    });

    setUploading(false);
  };

  const supportedTypes = [
    { type: "PDF", icon: "📄" },
    { type: "CSV", icon: "📊" },
    { type: "XLSX", icon: "📊" },
    { type: "TXT", icon: "📝" },
    { type: "JSON", icon: "⚙️" },
    { type: "DOCX", icon: "📘" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl uppercase">Gestor de Documentos</h1>
        <p className="mt-2 text-muted-foreground">Analiza, resume y extrae información de documentos</p>
      </div>

      {/* Upload Zone */}
      <div className="rounded-lg border-2 border-dashed border-foreground/20 bg-card p-12">
        <label className="flex flex-col items-center gap-4 cursor-pointer">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="font-semibold">Carga documentos para analizar</p>
            <p className="text-sm text-muted-foreground mt-1">
              Soportados: {supportedTypes.map((t) => t.type).join(", ")}
            </p>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            accept=".pdf,.csv,.xlsx,.txt,.json,.docx"
          />
        </label>
      </div>

      {/* Supported Types */}
      <div>
        <h3 className="font-semibold mb-4">Formatos soportados</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {supportedTypes.map((type) => (
            <div key={type.type} className="rounded-lg border border-foreground/10 bg-card p-4 text-center">
              <div className="text-3xl mb-2">{type.icon}</div>
              <p className="text-sm font-medium">{type.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Documentos cargados ({documents.length})</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc} className="flex items-center gap-3 rounded-lg border border-foreground/10 bg-card p-4">
                <File className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon */}
      <div className="rounded-lg border border-foreground/10 bg-card p-6">
        <h3 className="font-semibold">Funcionalidades disponibles próximamente</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>✓ Análisis automático de documentos</li>
          <li>✓ Resúmenes inteligentes</li>
          <li>✓ Extracción de datos clave</li>
          <li>✓ Comparación entre documentos</li>
          <li>✓ Generación de reportes</li>
        </ul>
      </div>
    </div>
  );
}
