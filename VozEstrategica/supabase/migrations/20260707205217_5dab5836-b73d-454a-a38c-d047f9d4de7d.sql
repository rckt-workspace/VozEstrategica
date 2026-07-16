
-- =====================================================
-- Tabla: pedidos_libros
-- =====================================================
CREATE TABLE public.pedidos_libros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  libro TEXT NOT NULL,
  formato TEXT NOT NULL CHECK (formato IN ('fisico', 'digital')),
  nombre_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  direccion TEXT,
  ciudad TEXT,
  departamento TEXT,
  cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad >= 1),
  precio_unitario INTEGER NOT NULL CHECK (precio_unitario >= 0),
  flete INTEGER NOT NULL DEFAULT 0 CHECK (flete >= 0),
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  bold_order_id TEXT UNIQUE,
  estado_pago TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'aprobado', 'rechazado')),
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.pedidos_libros TO anon;
GRANT SELECT, INSERT, UPDATE ON public.pedidos_libros TO authenticated;
GRANT ALL ON public.pedidos_libros TO service_role;

ALTER TABLE public.pedidos_libros ENABLE ROW LEVEL SECURITY;

-- Anyone can create an order (public checkout)
CREATE POLICY "Anyone can create book orders"
  ON public.pedidos_libros
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can look up an order by bold_order_id (needed for the confirmation page)
CREATE POLICY "Anyone can read book orders"
  ON public.pedidos_libros
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can update orders (payment status updates happen via service_role in server functions)
CREATE POLICY "Admins can update book orders"
  ON public.pedidos_libros
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER pedidos_libros_set_updated_at
  BEFORE UPDATE ON public.pedidos_libros
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX pedidos_libros_bold_order_id_idx ON public.pedidos_libros (bold_order_id);
CREATE INDEX pedidos_libros_fecha_creacion_idx ON public.pedidos_libros (fecha_creacion DESC);
CREATE INDEX pedidos_libros_estado_pago_idx ON public.pedidos_libros (estado_pago);

-- =====================================================
-- Tabla: configuracion
-- =====================================================
CREATE TABLE public.configuracion (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flete_nacional INTEGER NOT NULL DEFAULT 15000 CHECK (flete_nacional >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.configuracion TO anon;
GRANT SELECT, UPDATE ON public.configuracion TO authenticated;
GRANT ALL ON public.configuracion TO service_role;

ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read configuration"
  ON public.configuracion
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update configuration"
  ON public.configuracion
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER configuracion_set_updated_at
  BEFORE UPDATE ON public.configuracion
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial row
INSERT INTO public.configuracion (flete_nacional) VALUES (15000);
