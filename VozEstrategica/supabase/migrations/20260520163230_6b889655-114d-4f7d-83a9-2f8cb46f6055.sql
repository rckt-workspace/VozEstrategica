
-- Fix search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Restrict has_role execution
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

-- Replace public select policy with safer scoped one
DROP POLICY IF EXISTS "Media público lectura" ON storage.objects;
CREATE POLICY "Media lectura archivos conocidos" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] IN ('speakers','books','events')
  );
