import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/suscriptores")({
  component: SuscriptoresPage,
});

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

function SuscriptoresPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .select("id, email, source, created_at")
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setSubs((data as Subscriber[] | null) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return subs;
    return subs.filter((s) => s.email.toLowerCase().includes(term));
  }, [q, subs]);

  function exportCsv() {
    const rows = [
      ["email", "fecha_suscripcion", "origen"],
      ...subs.map((s) => [
        s.email,
        new Date(s.created_at).toISOString(),
        s.source ?? "",
      ]),
    ];
    const csv = rows
      .map((r) =>
        r
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suscriptores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p className="text-muted-foreground">Cargando…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl uppercase">Suscriptores</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{subs.length}</span>
            {q ? ` · Filtrados: ${filtered.length}` : ""}
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={subs.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40"
        >
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por correo…"
          className="w-full rounded-full border border-foreground/20 bg-background py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {subs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/20 p-12 text-center">
          <h3 className="font-display text-xl uppercase">Sin suscriptores todavía</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Los correos del formulario del newsletter aparecen acá.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-foreground/10">
          <table className="w-full text-sm">
            <thead className="bg-foreground/5 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Origen</th>
                <th className="px-4 py-3">Fecha de suscripción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-foreground/10">
                  <td className="px-4 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {s.source ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleString("es-ES")}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Sin resultados para “{q}”.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
