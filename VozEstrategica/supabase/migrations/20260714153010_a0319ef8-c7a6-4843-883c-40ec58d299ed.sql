
-- pg_net para hacer http_post desde triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- URL base y token compartido (token idéntico al secreto NOTIFY_WEBHOOK_TOKEN de las edge functions)
CREATE OR REPLACE FUNCTION public._notify_call(fn text, payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  url text := 'https://eyebjcvagagztrfsllir.supabase.co/functions/v1/' || fn;
  token text := 'ADjqAcBMUsAVwQ-sh3mv4j_1nJtoWdvtGH0dTfzuErcLVoqGPDeSKTdm2Q_IRWb5';
BEGIN
  PERFORM net.http_post(
    url := url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-token', token
    ),
    body := payload,
    timeout_milliseconds := 5000
  );
EXCEPTION WHEN OTHERS THEN
  -- Nunca romper el INSERT/UPDATE original si el envío falla
  RAISE WARNING 'notify % failed: %', fn, SQLERRM;
END;
$$;

-- Trigger: nuevo suscriptor
CREATE OR REPLACE FUNCTION public._notify_new_subscriber()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._notify_call('notify-subscriber', jsonb_build_object(
    'email', NEW.email,
    'source', NEW.source,
    'created_at', NEW.created_at
  ));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_subscriber ON public.subscribers;
CREATE TRIGGER trg_notify_new_subscriber
AFTER INSERT ON public.subscribers
FOR EACH ROW EXECUTE FUNCTION public._notify_new_subscriber();

-- Trigger: pedido de libro aprobado
CREATE OR REPLACE FUNCTION public._notify_book_order_paid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.estado_pago = 'aprobado' AND (OLD.estado_pago IS DISTINCT FROM 'aprobado') THEN
    PERFORM public._notify_call('notify-book-order', to_jsonb(NEW));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_book_order_paid ON public.pedidos_libros;
CREATE TRIGGER trg_notify_book_order_paid
AFTER UPDATE ON public.pedidos_libros
FOR EACH ROW EXECUTE FUNCTION public._notify_book_order_paid();
