// Cliente da API FastAPI (franquia). Injeta Authorization: Bearer + X-Tenant-Id.
// A sessão (token + tenant) é SEMPRE do login real do Supabase (setSession no auth).

const BASE: string = (import.meta as any).env?.VITE_API_URL || '';
let _token = '';
let _tenant = '';

export function setSession(token: string, tenant: string) {
  _token = token;
  _tenant = tenant;
}
export function clearSession() {
  _token = '';
  _tenant = '';
}
export function hasSession(): boolean {
  return !!_token;
}
export const API_BASE = BASE;
export function authToken(): string {
  return _token;
}

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: any; tenant?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  if (opts.tenant !== false && _tenant) headers['X-Tenant-Id'] = _tenant;
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 204) return null as T;
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${detail}`);
  }
  return res.json();
}

// Upload multipart (capa/banner) — NÃO seta Content-Type (o browser põe o boundary).
// `file` é um Blob/File; o backend espera o campo `file` (UploadFile).
export async function apiUpload<T = any>(path: string, file: Blob, filename = 'upload'): Promise<T> {
  const fd = new FormData();
  fd.append('file', file, filename);
  return apiUploadForm<T>(path, fd);
}

// Upload de um FormData já montado (ex.: ingestão = file + name). Auth + tenant nos headers.
export async function apiUploadForm<T = any>(path: string, form: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  if (_tenant) headers['X-Tenant-Id'] = _tenant;
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: form });
  if (res.status === 204) return null as T;
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${detail}`);
  }
  return res.json();
}
