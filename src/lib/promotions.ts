// Promoção do franqueado → URL de webhook REAL (backend /promotions).
// A tela de Integrações mostra essa URL pra colar na Kiwify. Uma venda nessa URL
// dispara o loop (cria aluno + email + acesso).
import { api } from './api';

let _cache: { url: string; appId: string } | null = null;

function firstRealProductId(): string | null {
  const cat: any[] = (window as any).__franquiaProducts || [];
  const real = cat.find((p) => p && p.id && !String(p.id).startsWith('prem-'));
  return real ? real.id : null;
}

// Cria (idempotente) a promoção do produto e devolve a URL de webhook real.
export async function getWebhookUrl(appId?: string): Promise<string> {
  const id = appId || firstRealProductId();
  if (!id) throw new Error('nenhum produto real para promover');
  if (_cache && _cache.appId === id) return _cache.url;
  const promo: any = await api('/promotions', { method: 'POST', body: { app_id: id } });
  _cache = { url: promo.webhook_url, appId: id };
  return promo.webhook_url;
}

// { [appId]: webhook_url } para TODOS os ids de uma vez. Usa GET /promotions (lista as
// promoções do franqueado) e cria a promoção (POST, idempotente) só para as faltantes.
// Fail-open: erro numa não derruba as outras.
export async function loadAllWebhookUrls(appIds: string[]): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  try {
    const existing: any[] = await api('/promotions');
    for (const p of existing || []) if (p && p.app_id) map[p.app_id] = p.webhook_url;
  } catch (e) { /* segue e cria on-demand */ }
  const missing = (appIds || []).filter((id) => id && !map[id]);
  await Promise.all(missing.map(async (id) => {
    try {
      const promo: any = await api('/promotions', { method: 'POST', body: { app_id: id } });
      if (promo && promo.webhook_url) map[id] = promo.webhook_url;
    } catch (e) { /* produto sem promoção → fica sem URL, UI mostra "Gerando…" */ }
  }));
  return map;
}
