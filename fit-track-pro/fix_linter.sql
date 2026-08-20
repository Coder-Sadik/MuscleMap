-- Fix for function_search_path_mutable
-- Enforce search_path to prevent search path injection attacks
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Fix for anon_security_definer_function_executable & authenticated_security_definer_function_executable
-- Since handle_new_user is only triggered internally by Supabase Auth (via postgres triggers), 
-- it should not be callable by external users via the REST API.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- Do the same for rls_auto_enable if it exists in your schema
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    ALTER FUNCTION public.rls_auto_enable() SET search_path = public;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
  END IF;
END $$;
