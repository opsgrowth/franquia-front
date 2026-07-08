import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Cliente Supabase preguiçoso — só para AUTH (login real). Nunca acessa banco/
// storage direto: todo dado vem da API FastAPI. Instanciado sob demanda.
let _client: SupabaseClient | null = null;

export function supabaseConfigured(): boolean {
  const env = (import.meta as any).env;
  return !!(env?.VITE_SUPABASE_URL && env?.VITE_SUPABASE_ANON_KEY);
}

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const env = (import.meta as any).env;
  const url = env?.VITE_SUPABASE_URL;
  const key = env?.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase não configurado (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  _client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _client;
}
