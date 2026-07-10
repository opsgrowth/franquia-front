// Gestão de produtos do ADMIN (dono dos apps do catálogo).
// PATCH /apps/{id}: publicar/despublicar, tagline, preço, premium, camuflar.
import { api } from './api';

export const isBackendId = (id: any): boolean =>
  typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}/i.test(id);

export type AppPatch = {
  name?: string;
  accent_color?: string;
  catalog_published?: boolean;
  tagline?: string;
  suggested_price_cents?: number | null;
  is_premium?: boolean;
  camouflaged?: boolean;
};

// Grava no backend só p/ produto REAL (id UUID). Devolve a promise (o chamador decide
// otimista/aguardar). Erros sobem pra quem chamou tratar (toast/rollback).
export async function patchApp(appId: string, fields: AppPatch): Promise<any> {
  if (!isBackendId(appId)) return null;
  return api(`/apps/${appId}`, { method: 'PATCH', body: fields });
}

// Lista TODOS os apps do admin (inclui rascunhos não publicados) — metadados + flags.
export async function loadMyApps(): Promise<any[]> {
  try {
    return await api('/apps');
  } catch {
    return [];
  }
}
