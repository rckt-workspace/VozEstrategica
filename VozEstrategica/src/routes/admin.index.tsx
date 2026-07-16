import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: BookingInbox,
});

interface Request {
  id: string;
  organizacion: string;
  contacto: string;
  email: string;
  telefono: string | null;
  fecha_evento: string | null;
  tipo_evento: string | null;
  presupuesto: string | null;
  mensaje: string | null;
  estado: string;
  created_at: string;
}

const ESTADOS = ["nuevo", "contactado", "cerrado"] as const;

function BookingInbox() {
  const [reqs, setReqs] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setReqs((data as Request[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateEstado(id: string, estado: string) {
    const { error } = await supabase
      .from("booking_requests")
      .update({ estado })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Estado actualizado");
    setReqs((r) => r.map((x) => (x.id === id ? { ...x, estado } : x)));
  }

  if (loading) return <p className="text-muted-foreground">Cargando…</p>;
  if (reqs.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-foreground/20 p-12 text-center">
        <h2 className="font-display text-2xl uppercase">Sin solicitudes todavía</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Las solicitudes del formulario público aparecen acá.
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl uppercase">Bandeja ({reqs.length})</h2>
      <div className="overflow-x-auto rounded-2xl border border-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Organización</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Mensaje</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {reqs.map((r) => (
              <tr key={r.id} className="border-t border-foreground/10 align-top">
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("es-ES")}
                </td>
                <td className="px-4 py-3 font-semibold">{r.organizacion}</td>
                <td className="px-4 py-3">
                  <div>{r.contacto}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                  {r.telefono ? (
                    <div className="text-xs text-muted-foreground">{r.telefono}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-xs">{r.tipo_evento ?? "—"}</td>
                <td className="px-4 py-3 max-w-sm text-xs text-muted-foreground">
                  {r.mensaje}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={r.estado}
                    onChange={(e) => updateEstado(r.id, e.target.value)}
                    className="rounded-full border border-foreground/20 bg-background px-3 py-1.5 text-xs font-semibold"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
