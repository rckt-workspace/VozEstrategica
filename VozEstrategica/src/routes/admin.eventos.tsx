import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/eventos")({
  component: AdminEventos,
});

interface EventRow {
  id: string;
  titulo: string;
  fecha: string;
  ciudad: string;
  descripcion: string | null;
  speaker_id: string | null;
}
interface SpkOpt { id: string; nombre: string }

function AdminEventos() {
  const [list, setList] = useState<EventRow[]>([]);
  const [spks, setSpks] = useState<SpkOpt[]>([]);
  const [draft, setDraft] = useState({
    titulo: "", fecha: "", ciudad: "", descripcion: "", speaker_id: "",
  });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [e, s] = await Promise.all([
      supabase.from("events").select("*").order("fecha", { ascending: true }),
      supabase.from("speakers").select("id, nombre").order("nombre"),
    ]);
    if (e.error) toast.error(e.error.message);
    setList((e.data as EventRow[] | null) ?? []);
    setSpks((s.data as SpkOpt[] | null) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!draft.titulo || !draft.fecha || !draft.ciudad) {
      toast.error("Completá título, fecha y ciudad.");
      return;
    }
    const { error } = await supabase.from("events").insert({
      ...draft,
      speaker_id: draft.speaker_id || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Evento creado");
    setDraft({ titulo: "", fecha: "", ciudad: "", descripcion: "", speaker_id: "" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar evento?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-foreground/10 bg-card p-6">
        <h2 className="font-display text-2xl uppercase">Nuevo evento</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <I label="Título" v={draft.titulo} on={(v) => setDraft({ ...draft, titulo: v })} />
          <I label="Fecha" type="date" v={draft.fecha} on={(v) => setDraft({ ...draft, fecha: v })} />
          <I label="Ciudad" v={draft.ciudad} on={(v) => setDraft({ ...draft, ciudad: v })} />
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Speaker</span>
            <select
              value={draft.speaker_id}
              onChange={(e) => setDraft({ ...draft, speaker_id: e.target.value })}
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
            >
              <option value="">—</option>
              {spks.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </label>
          <div className="md:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Descripción</span>
            <textarea
              rows={3}
              value={draft.descripcion}
              onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })}
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
            />
          </div>
        </div>
        <button onClick={save} className="bubble bubble-yellow mt-6 inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Crear evento
        </button>
      </section>

      <section>
        <h2 className="font-display text-2xl uppercase">Existentes ({list.length})</h2>
        {loading ? <p className="mt-4 text-muted-foreground">Cargando…</p> : (
          <ul className="mt-4 divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card">
            {list.map((ev) => (
              <li key={ev.id} className="flex items-center gap-4 p-4">
                <div className="w-32 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {new Date(ev.fecha + "T00:00:00").toLocaleDateString("es-ES")}
                </div>
                <div className="flex-1">
                  <div className="font-display text-lg uppercase">{ev.titulo}</div>
                  <div className="text-xs text-muted-foreground">{ev.ciudad}</div>
                </div>
                <button onClick={() => remove(ev.id)} className="rounded-full border border-destructive/40 p-2 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function I({ label, v, on, type = "text" }: { label: string; v: string; on: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type={type} value={v} onChange={(e) => on(e.target.value)} className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3" />
    </label>
  );
}
