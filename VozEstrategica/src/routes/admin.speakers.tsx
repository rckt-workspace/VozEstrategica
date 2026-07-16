import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/speakers")({
  component: AdminSpeakers,
});

interface Speaker {
  id: string;
  slug: string;
  nombre: string;
  especialidad: string;
  foto_url: string | null;
  bio: string | null;
  tematicas: string[];
  destacado: boolean;
  orden: number;
}

const empty: Omit<Speaker, "id"> = {
  slug: "",
  nombre: "",
  especialidad: "",
  foto_url: "",
  bio: "",
  tematicas: [],
  destacado: false,
  orden: 0,
};

function AdminSpeakers() {
  const [list, setList] = useState<Speaker[]>([]);
  const [draft, setDraft] = useState(empty);
  const [tematicasStr, setTematicasStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .order("orden", { ascending: true });
    if (error) toast.error(error.message);
    setList((data as Speaker[] | null) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function uploadPhoto(file: File): Promise<string | null> {
    const path = `speakers/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) {
      toast.error(error.message);
      return null;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function save() {
    if (!draft.slug || !draft.nombre || !draft.especialidad) {
      toast.error("Completá slug, nombre y especialidad.");
      return;
    }
    setSaving(true);
    const tematicas = tematicasStr.split(",").map((t) => t.trim()).filter(Boolean);
    const { error } = await supabase.from("speakers").insert({ ...draft, tematicas });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Speaker creado");
    setDraft(empty);
    setTematicasStr("");
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este speaker?")) return;
    const { error } = await supabase.from("speakers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Eliminado");
    load();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-foreground/10 bg-card p-6">
        <h2 className="font-display text-2xl uppercase">Nuevo speaker</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="Slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} placeholder="julian-giraldo" />
          <Input label="Nombre" value={draft.nombre} onChange={(v) => setDraft({ ...draft, nombre: v })} />
          <Input label="Especialidad" value={draft.especialidad} onChange={(v) => setDraft({ ...draft, especialidad: v })} />
          <Input label="Temáticas (coma)" value={tematicasStr} onChange={setTematicasStr} placeholder="Liderazgo, Cultura" />
          <div className="md:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Bio</span>
            <textarea
              rows={4}
              value={draft.bio ?? ""}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
            />
          </div>
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Foto</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await uploadPhoto(f);
                if (url) setDraft({ ...draft, foto_url: url });
              }}
              className="text-sm"
            />
            {draft.foto_url ? (
              <img src={draft.foto_url} alt="" className="mt-2 h-24 w-auto rounded-lg" />
            ) : null}
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={draft.destacado}
                onChange={(e) => setDraft({ ...draft, destacado: e.target.checked })}
              />
              Destacado
            </label>
            <Input label="Orden" value={String(draft.orden)} onChange={(v) => setDraft({ ...draft, orden: Number(v) || 0 })} />
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="bubble bubble-yellow mt-6 inline-flex items-center gap-2 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> {saving ? "Guardando..." : "Crear speaker"}
        </button>
      </section>

      <section>
        <h2 className="font-display text-2xl uppercase">Existentes ({list.length})</h2>
        {loading ? (
          <p className="mt-4 text-muted-foreground">Cargando…</p>
        ) : (
          <div className="mt-4 space-y-3">
            {list.map((s) => (
              <div key={s.id} className="flex items-center gap-4 rounded-2xl border border-foreground/10 bg-card p-3">
                {s.foto_url ? (
                  <img src={s.foto_url} alt="" className="h-14 w-14 rounded-xl object-cover" />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-foreground/10" />
                )}
                <div className="flex-1">
                  <div className="font-display text-lg uppercase">{s.nombre}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.especialidad} · /{s.slug} {s.destacado ? "· ⭐ destacado" : ""}
                  </div>
                </div>
                <button
                  onClick={() => remove(s.id)}
                  className="rounded-full border border-destructive/40 p-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Input({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
      />
    </label>
  );
}
