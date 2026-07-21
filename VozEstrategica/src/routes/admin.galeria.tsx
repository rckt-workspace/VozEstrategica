import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/galeria")({
  component: AdminGaleria,
});

interface GalleryImage {
  id: string;
  gallery_key: string;
  slot_key: string | null;
  url: string;
  alt: string | null;
  orden: number;
}

const GALLERIES = [
  { value: "carlos-masterclass", label: "Carlos Laguna — Masterclass" },
  { value: "diego-mx", label: "Diego Camacho — México" },
];

function AdminGaleria() {
  const [list, setList] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState({
    gallery_key: GALLERIES[0].value,
    slot_key: "",
    alt: "",
    orden: "0",
  });

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("media_gallery_images")
      .select("*")
      .order("gallery_key", { ascending: true })
      .order("orden", { ascending: true });
    if (error) toast.error(error.message);
    setList((data as GalleryImage[] | null) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function upload(file: File) {
    setUploading(true);
    const path = `gallery/${draft.gallery_key}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return;
    }
    const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
    const { error } = await supabase.from("media_gallery_images").insert({
      gallery_key: draft.gallery_key,
      slot_key: draft.slot_key.trim() || null,
      url,
      alt: draft.alt || null,
      orden: Number(draft.orden) || 0,
    });
    setUploading(false);
    if (error) return toast.error(error.message);
    toast.success("Foto agregada");
    setDraft({ ...draft, slot_key: "", alt: "", orden: "0" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta foto?")) return;
    const { error } = await supabase.from("media_gallery_images").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-foreground/10 bg-card p-6">
        <h2 className="font-display text-2xl uppercase">Nueva foto</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Las landing pages de Carlos y de Diego (México) buscan cada foto por su "slot" — usá el
          mismo nombre que ya tenía la foto que estás reemplazando (ej. <code>speaker</code>,{" "}
          <code>mercedes2</code>, <code>hero</code>, <code>booking</code>) para que se vea en el
          lugar correcto. Dejalo vacío si es una foto suelta que no reemplaza ninguna existente.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Galería</span>
            <select
              value={draft.gallery_key}
              onChange={(e) => setDraft({ ...draft, gallery_key: e.target.value })}
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
            >
              {GALLERIES.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Slot (opcional)</span>
            <input
              value={draft.slot_key}
              onChange={(e) => setDraft({ ...draft, slot_key: e.target.value })}
              placeholder="speaker, mercedes2, hero..."
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Texto alternativo</span>
            <input
              value={draft.alt}
              onChange={(e) => setDraft({ ...draft, alt: e.target.value })}
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Orden</span>
            <input
              value={draft.orden}
              onChange={(e) => setDraft({ ...draft, orden: e.target.value })}
              className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3"
            />
          </label>
        </div>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-bold text-background disabled:opacity-60">
          <Plus className="h-4 w-4" />
          {uploading ? "Subiendo..." : "Subir foto"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
      </section>

      <section>
        <h2 className="font-display text-2xl uppercase">Existentes ({list.length})</h2>
        {loading ? (
          <p className="mt-4 text-muted-foreground">Cargando…</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-2xl border border-foreground/10 bg-card">
                <img src={img.url} alt={img.alt ?? ""} className="aspect-square w-full object-cover" />
                <div className="flex items-center justify-between gap-2 p-3">
                  <div className="text-xs">
                    <div className="font-bold uppercase tracking-widest text-muted-foreground">{img.gallery_key}</div>
                    {img.slot_key ? <div className="text-brand">#{img.slot_key}</div> : null}
                  </div>
                  <button
                    onClick={() => remove(img.id)}
                    className="rounded-full border border-destructive/40 p-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    aria-label="Eliminar"
                  >
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
