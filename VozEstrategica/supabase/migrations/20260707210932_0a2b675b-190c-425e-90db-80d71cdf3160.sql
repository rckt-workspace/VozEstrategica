DROP POLICY IF EXISTS "Anyone can read book orders" ON public.pedidos_libros;
CREATE POLICY "Admins can read book orders"
ON public.pedidos_libros
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
REVOKE SELECT ON public.pedidos_libros FROM anon;