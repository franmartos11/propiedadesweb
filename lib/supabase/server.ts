import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase con Service Role (solo para uso en servidor).
 * Tiene permisos totales, nunca exponer al cliente.
 */
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';
  
  if ((!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) && process.env.NODE_ENV === 'production') {
    console.warn('WARNING: Missing Supabase environment variables.');
  }

  return createClient(url, key);
}
