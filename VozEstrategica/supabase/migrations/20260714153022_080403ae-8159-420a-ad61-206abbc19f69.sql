
REVOKE ALL ON FUNCTION public._notify_call(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._notify_new_subscriber() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._notify_book_order_paid() FROM PUBLIC, anon, authenticated;
