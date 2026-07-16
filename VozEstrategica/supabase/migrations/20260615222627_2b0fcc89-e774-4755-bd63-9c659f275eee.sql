
-- Remove permissive public INSERT policy on orders; inserts happen via server (service_role) only
DROP POLICY IF EXISTS "Cualquiera puede crear órdenes" ON public.orders;
REVOKE INSERT ON public.orders FROM anon;
REVOKE INSERT ON public.orders FROM authenticated;

-- Lock down has_role: only service_role needs direct EXECUTE; RLS policies that reference it
-- still work because SECURITY DEFINER bypasses the EXECUTE check at policy evaluation time.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
