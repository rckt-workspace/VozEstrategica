
DROP POLICY IF EXISTS "Cualquiera puede crear solicitudes" ON public.booking_requests;
CREATE POLICY "Cualquiera puede crear solicitudes"
ON public.booking_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(contacto)) > 0
  AND length(btrim(email)) BETWEEN 5 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(organizacion)) > 0
  AND (mensaje IS NULL OR length(mensaje) <= 5000)
  AND estado = 'nuevo'
);
