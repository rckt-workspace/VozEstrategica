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
  imagen_url: string | null;
  landing_url: string | null;
  cta_label: string | null;
}
interface SpkOpt { id: string; nombre: string }

function AdminEventos() {
  const [list, setList] = useState<EventRow[]>([]);
  const [spks, setSpks] = useState<SpkOpt[]>([]);
  const [draft, setDraft] = useState({
    titulo: "", fecha: "", ciudad: "", descripcion: "", speaker_id: "",
    imagen_url: "", landing_url: "", cta_label: "",
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

  async function uploadImage(file: File): Promise<string | null> {
    const path = `events/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { toast.error(error.message); return null; }
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  }

  async function save() {
    if (!draft.titulo || !draft.fecha || !draft.ciudad) {
      toast.error("Completá título, fecha y ciudad.");
      return;
    }
    const { error } = await supabase.from("events").insert({
      titulo: draft.titulo,
      fecha: draft.fecha,
      ciudad: draft.ciudad,
      descripcion: draft.descripcion || null,
      speaker_id: draft.speaker_id || null,
      imagen_url: draft.imagen_url || null,
      landing_url: draft.landing_url || null,
      cta_label: draft.cta_label || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Evento creado");
    setDraft({
      titulo: "", fecha: "", ciudad: "", descripcion: "", speaker_id: "",
      imagen_url: "", landing_url: "", cta_label: "",
    });
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
          <I label="Link externo (opcional)" v={draft.landing_url} on={(v) => setDraft({ ...draft, landing_url: v })} placeholder="/masterclass-de-clientes-a-fans" />
          <I label="Texto del botón (opcional)" v={draft.cta_label} on={(v) => setDraft({ ...draft, cta_label: v })} placeholder="Reservar mi cupo" />
          <div className="md:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Descripción</span>
            <textarea
              rows={3}
              value={draft.descripcion}
              onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })}
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
            />
          </div>
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Imagen (opcional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await uploadImage(f);
                if (url) setDraft({ ...draft, imagen_url: url });
              }}
              className="text-sm"
            />
            {draft.imagen_url ? <img src={draft.imagen_url} alt="" className="mt-2 h-24 w-auto rounded-lg" /> : null}
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

function I({ label, v, on, type = "text", placeholder }: { label: string; v: string; on: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type={type} value={v} placeholder={placeholder} onChange={(e) => on(e.target.value)} className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3" />
    </label>
  );
}
