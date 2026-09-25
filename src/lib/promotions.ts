// Promoção do franqueado → URL de webhook REAL (backend /promotions).
// A tela de Integrações mostra essa URL pra colar na Hubla. Um evento nessa URL
// libera (compra paga), mantém (renovação) ou bloqueia (reembolso / assinatura
// desativada) o acesso do comprador ao produto.
import { api } from './api';

export type ProductKind = 'sale' | 'subscription';

export type Promotion = {
  id: string;
  app_id: string;
  app_name: string;
  app_slug: string;
  platform: string;
  webhook_token: string;
  webhook_url: string;
  sales_count: number;
  // IDs de produto/oferta da Hubla aceitos nesta URL ([] = qualquer um)
  hubla_product_ids: string[];
  // null = detecta pelo evento da Hubla (assinatura recorrente x venda avulsa)
  product_kind: ProductKind | null;
};

// Sem cache de módulo: cada chamada busca fresco. Um cache singleton aqui vazaria a URL
// de um tenant para outro entre logins (sobrevive no módulo até o hard refresh). O POST
// é idempotente no backend, então buscar sempre é seguro e barato.
function firstRealProductId(): string | null {
  const cat: any[] = (window as any).__franquiaProducts || [];
  const real = cat.find((p) => p && p.id && !String(p.id).startsWith('prem-'));
  return real ? real.id : null;
}

// Cria (idempotente) a promoção do produto e devolve a URL de webhook real.
export async function getWebhookUrl(appId?: string): Promise<string> {
  const id = appId || firstRealProductId();
  if (!id) throw new Error('nenhum produto real para promover');
  const promo: Promotion = await api('/promotions', { method: 'POST', body: { app_id: id } });
  return promo.webhook_url;
}

// { [appId]: Promotion } para TODOS os ids de uma vez. Usa GET /promotions (lista as
// promoções do franqueado) e cria a promoção (POST, idempotente) só para as faltantes.
// Fail-open: erro numa não derruba as outras.
export async function loadAllPromotions(appIds: string[]): Promise<Record<string, Promotion>> {
  const map: Record<string, Promotion> = {};
  try {
    const existing: Promotion[] = await api('/promotions');
    for (const p of existing || []) if (p && p.app_id) map[p.app_id] = p;
  } catch (e) { /* segue e cria on-demand */ }
  const missing = (appIds || []).filter((id) => id && !map[id]);
  await Promise.all(missing.map(async (id) => {
    try {
      const promo: Promotion = await api('/promotions', { method: 'POST', body: { app_id: id } });
      if (promo && promo.webhook_url) map[id] = promo;
    } catch (e) { /* produto sem promoção → fica sem URL, UI mostra "Gerando…" */ }
  }));
  return map;
}

// { [appId]: webhook_url } — atalho de loadAllPromotions p/ quem só precisa da URL.
export async function loadAllWebhookUrls(appIds: string[]): Promise<Record<string, string>> {
  const promos = await loadAllPromotions(appIds);
  const map: Record<string, string> = {};
  for (const [id, p] of Object.entries(promos)) map[id] = p.webhook_url;
  return map;
}

// De-para com a Hubla. Só os campos enviados mudam; hubla_product_ids: [] limpa.
export async function updatePromotion(
  id: string,
  patch: { hubla_product_ids?: string[]; product_kind?: ProductKind | null },
): Promise<Promotion> {
  return api(`/promotions/${id}`, { method: 'PATCH', body: patch });
}
