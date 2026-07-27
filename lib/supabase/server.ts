import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Cliente de Supabase con Service Role (solo para uso en servidor).
 * Tiene permisos totales, nunca exponer al cliente.
 */
export function createServerSupabaseClient() {
  const url = supabaseUrl || 'https://dummy.supabase.co';
  const key = supabaseServiceKey || 'dummy_key';
  
  if ((!supabaseUrl || !supabaseServiceKey) && process.env.NODE_ENV === 'production') {
    console.warn('WARNING: Missing Supabase environment variables.');
  }

  return createClient(url, key);
}
