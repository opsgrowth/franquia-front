// Gestão de produtos do ADMIN (dono dos apps do catálogo).
// PATCH /apps/{id}: publicar/despublicar, tagline, preço, premium, camuflar.
import { api } from './api';
import { mapBlock } from './catalog';

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

const isB64 = (v: any): boolean => typeof v === 'string' && v.startsWith('data:');

// AppOut (backend) → shape que o catálogo/painel usam. Conteúdo (módulos) é carregado
// sob demanda no editor; aqui vêm metadados + flags + capa/banners.
export function mapMyApp(a: any): any {
  const priceCents = a.suggested_price_cents;
  return {
    id: a.id,
    slug: a.slug,
    title: a.name,
    subtitle: a.tagline || 'Produto da Franquia — pronto para vender',
    color: a.accent_color || '#7C3AED',
    coverImg: isB64(a.cover_image_url) ? a.cover_image_url : null,
    banners: (a.banners || []).filter(isB64),
    displayPrice: priceCents ? `R$ ${Math.round(priceCents / 100)}` : (a.is_premium ? 'Premium' : 'R$ —'),
    access: a.is_premium ? 'Premium (upsell)' : 'Liberado',
    isPremium: !!a.is_premium,
    camouflaged: !!a.camouflaged,
    kind: a.is_premium ? 'Premium' : 'Curso da Franquia',
    status: a.catalog_published ? 'Publicado' : 'Rascunho',
    catalogPublished: !!a.catalog_published,
    students: 0,
    modulesCount: a.modules_count || 0,
    lessonsCount: a.lessons_count || 0,
    modules: [],
  };
}

export async function loadMyAppsMapped(): Promise<any[]> {
  const apps = await loadMyApps();
  return apps.map(mapMyApp);
}

// Conteúdo (módulos + aulas) de UM produto, sob demanda — quando o admin abre pra editar.
// A capa do módulo vem como URL gated (não exibe direto no front); cai no determinístico
// (índice). O upload novo de capa persiste no backend e aparece na vitrine/catálogo.
export async function loadProductModules(appId: string): Promise<any[]> {
  const mods: any[] = await api(`/apps/${appId}/modules`);
  return (mods || []).map((m: any, mi: number) => ({
    id: m.id,
    title: m.title,
    cover: isB64(m.cover_image_url) ? m.cover_image_url : mi,
    lessons: (m.lessons || []).map((l: any, li: number) => {
      const blocks = (l.blocks || []).map(mapBlock);
      // tipo pelo conteúdo real: vídeo/áudio se houver bloco de mídia; senão LEITURA (texto)
      const hasVideo = blocks.some((b: any) => b.kind === 'video');
      const hasAudio = blocks.some((b: any) => b.kind === 'audio');
      return {
        id: l.id,
        title: l.title,
        type: hasVideo ? 'video' : hasAudio ? 'audio' : 'leitura',
        duration: `${6 + ((li * 3) % 9)} min`,
        sample: mi === 0 && li === 0,
        desc: l.summary || undefined,
        blocks,
      };
    }),
  }));
}
