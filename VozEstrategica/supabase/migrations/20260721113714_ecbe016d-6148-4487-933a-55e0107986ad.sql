-- =====================================================
-- Unifica el contenido editorial (speakers, eventos, libros,
-- galerías) en Supabase para que deje de vivir duplicado en
-- src/data/content.ts y en imports estáticos de imágenes.
-- =====================================================

-- speakers: bio pasa de texto único a arreglo de párrafos
-- (así coincide con la estructura que ya usa el sitio), y se
-- agregan las columnas que hoy solo existen en el código.
ALTER TABLE public.speakers
  ALTER COLUMN bio TYPE TEXT[] USING (
    CASE WHEN bio IS NULL OR bio = '' THEN ARRAY[]::TEXT[] ELSE ARRAY[bio] END
  ),
  ALTER COLUMN bio SET DEFAULT '{}',
  ADD COLUMN charlas TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN quote TEXT,
  ADD COLUMN fuente TEXT;

-- events: soporta la promo de la masterclass (antes hardcodeada
-- por id de string en el frontend) de forma genérica.
ALTER TABLE public.events
  ADD COLUMN landing_url TEXT,
  ADD COLUMN cta_label TEXT;

-- books: precio/sku/formato pasan a ser la única fuente de verdad
-- para el checkout (antes vivían en un CATALOG hardcodeado,
-- desconectado de esta tabla).
ALTER TABLE public.books
  ADD COLUMN sku TEXT UNIQUE,
  ADD COLUMN precio INTEGER CHECK (precio IS NULL OR precio >= 0),
  ADD COLUMN formato TEXT CHECK (formato IS NULL OR formato IN ('fisico', 'digital'));

-- media_gallery_images: fotos de las landing pages editoriales
-- (galería de Carlos Laguna, fotos de Diego Camacho MX) que hoy
-- son punteros rotos a assets de Lovable.
-- slot_key identifica una foto específica dentro de una galería
-- (ej. "speaker", "mercedes2") para landing pages con diseño fijo
-- donde cada foto tiene su propio pie de foto en el código; queda
-- libre (NULL) para fotos sueltas que solo se listan/recorren.
CREATE TABLE public.media_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_key TEXT NOT NULL,
  slot_key TEXT,
  url TEXT NOT NULL,
  alt TEXT,
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media_gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Galería es pública" ON public.media_gallery_images
  FOR SELECT USING (true);
CREATE POLICY "Admins gestionan galería" ON public.media_gallery_images
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX media_gallery_images_gallery_key_idx
  ON public.media_gallery_images (gallery_key, orden);
CREATE UNIQUE INDEX media_gallery_images_gallery_slot_key
  ON public.media_gallery_images (gallery_key, slot_key)
  WHERE slot_key IS NOT NULL;
