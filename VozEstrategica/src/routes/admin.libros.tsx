import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/libros")({
  component: AdminLibros,
});

interface Book {
  id: string;
  titulo: string;
  portada_url: string | null;
  descripcion: string | null;
  anio: number | null;
  link_compra: string | null;
  autor_speaker_id: string | null;
}
interface SpkOpt { id: string; nombre: string }

function AdminLibros() {
  const [list, setList] = useState<Book[]>([]);
  const [spks, setSpks] = useState<SpkOpt[]>([]);
  const [draft, setDraft] = useState({
    titulo: "", portada_url: "", descripcion: "", anio: "", link_compra: "", autor_speaker_id: "",
  });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [b, s] = await Promise.all([
      supabase.from("books").select("*").order("anio", { ascending: false }),
      supabase.from("speakers").select("id, nombre").order("nombre"),
    ]);
    if (b.error) toast.error(b.error.message);
    setList((b.data as Book[] | null) ?? []);
    setSpks((s.data as SpkOpt[] | null) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function upload(file: File): Promise<string | null> {
    const path = `books/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { toast.error(error.message); return null; }
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  }

  async function save() {
    if (!draft.titulo) return toast.error("Falta título.");
    const { error } = await supabase.from("books").insert({
      titulo: draft.titulo,
      portada_url: draft.portada_url || null,
      descripcion: draft.descripcion || null,
      anio: draft.anio ? Number(draft.anio) : null,
      link_compra: draft.link_compra || null,
      autor_speaker_id: draft.autor_speaker_id || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Libro creado");
    setDraft({ titulo: "", portada_url: "", descripcion: "", anio: "", link_compra: "", autor_speaker_id: "" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar libro?")) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-foreground/10 bg-card p-6">
        <h2 className="font-display text-2xl uppercase">Nuevo libro</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <I label="Título" v={draft.titulo} on={(v) => setDraft({ ...draft, titulo: v })} />
          <I label="Año" v={draft.anio} on={(v) => setDraft({ ...draft, anio: v })} />
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Autor</span>
            <select
              value={draft.autor_speaker_id}
              onChange={(e) => setDraft({ ...draft, autor_speaker_id: e.target.value })}
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
            >
              <option value="">—</option>
              {spks.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </label>
          <I label="Link de compra" v={draft.link_compra} on={(v) => setDraft({ ...draft, link_compra: v })} />
          <div className="md:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Descripción</span>
            <textarea rows={3} value={draft.descripcion} onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })} className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3" />
          </div>
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Portada</span>
            <input type="file" accept="image/*" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const url = await upload(f);
              if (url) setDraft({ ...draft, portada_url: url });
            }} className="text-sm" />
            {draft.portada_url ? <img src={draft.portada_url} alt="" className="mt-2 h-24 w-auto rounded-lg" /> : null}
          </div>
        </div>
        <button onClick={save} className="bubble bubble-yellow mt-6 inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Crear libro
        </button>
      </section>

      <section>
        <h2 className="font-display text-2xl uppercase">Existentes ({list.length})</h2>
        {loading ? <p className="mt-4 text-muted-foreground">Cargando…</p> : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => (
              <div key={b.id} className="rounded-2xl border border-foreground/10 bg-card p-4">
                <div className="flex gap-4">
                  {b.portada_url ? <img src={b.portada_url} alt="" className="h-24 w-16 rounded object-cover" /> : <div className="h-24 w-16 rounded bg-foreground/10" />}
                  <div className="flex-1">
                    <div className="font-display text-lg uppercase">{b.titulo}</div>
                    <div className="text-xs text-muted-foreground">{b.anio ?? ""}</div>
                  </div>
                  <button onClick={() => remove(b.id)} className="self-start rounded-full border border-destructive/40 p-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function I({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input value={v} onChange={(e) => on(e.target.value)} className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3" />
    </label>
  );
}
