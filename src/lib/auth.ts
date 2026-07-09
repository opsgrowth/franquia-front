// Auth do painel — login real via Supabase (email/senha) com auto-provisão.
// SEM dev-bearer: o login é sempre o do usuário (evita sessão fantasma de token fixo).
import { api, clearSession, setSession } from './api';
import { getSupabase, supabaseConfigured } from './supabase';

let _authed = false;
let _me: any = null;
let _booted = false;
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }
export function onAuthChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
export function isAuthed(): boolean { return _authed; }
export function getMe(): any { return _me; }

async function loadMe(token: string): Promise<void> {
  setSession(token, '');
  let me: any;
  try {
    me = await api('/me', { tenant: false });
  } catch (e: any) {
    // creator não provisionado (403) → cria tenant e tenta de novo (1ª entrada)
    if (String(e?.message || '').startsWith('403')) {
      await api('/signup', { method: 'POST', tenant: false, body: { tenant_name: 'Meu Estúdio', creator_name: null } });
      me = await api('/me', { tenant: false });
    } else {
      throw e;
    }
  }
  setSession(token, me.tenant.id);
  _me = me;
  _authed = true;
  emit();
}

// Chamado uma vez no boot do app. Resolve a sessão persistida do Supabase (se houver).
export async function bootstrapAuth(): Promise<void> {
  if (_booted) return;
  _booted = true;

  if (!supabaseConfigured()) return;

  try {
    const { data } = await getSupabase().auth.getSession();
    const jwt = data.session?.access_token;
    // !_authed: se o usuário logou durante este await, NÃO sobrescreve com a sessão antiga.
    if (jwt && !_authed) await loadMe(jwt);
  } catch (e) {
    console.warn('sessão inicial falhou', e);
  }
  // reage só a logout e refresh de token (o login em si é tratado no loginWithPassword,
  // de forma determinística — não dependemos do evento pra transicionar).
  getSupabase().auth.onAuthStateChange((evt, session) => {
    if (evt === 'SIGNED_OUT') {
      _authed = false; _me = null; clearSession(); emit();
      return;
    }
    // TOKEN_REFRESHED / USER_UPDATED: mantém a sessão viva sem re-buscar tudo
    if (session?.access_token && _me) setSession(session.access_token, _me.tenant.id);
  });
}

export async function loginWithPassword(email: string, password: string): Promise<void> {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  const jwt = data.session?.access_token;
  if (!jwt) throw new Error('Sessão não retornada pelo Supabase.');
  await loadMe(jwt); // determinístico: ao resolver, _authed=true e o App já transiciona
}

export async function logout(): Promise<void> {
  try { if (supabaseConfigured()) await getSupabase().auth.signOut(); } catch {}
  _authed = false; _me = null; clearSession(); emit();
}
