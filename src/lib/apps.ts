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

// Define a ordem do catálogo (posição = índice na lista). Reflete no catálogo público.
export async function reorderApps(ids: string[]): Promise<any> {
  const real = (ids || []).filter(isBackendId);
  if (!real.length) return null;
  return api('/apps/reorder', { method: 'POST', body: { ids: real } });
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

// ── Autoria manual: módulos, aulas e blocos persistem no backend ──
// Só para produto REAL (id UUID); o painel reconcilia o id real devolvido.
export async function createModule(appId: string, data: { title: string; summary?: string | null; position?: number }): Promise<any> {
  return api(`/apps/${appId}/modules`, { method: 'POST', body: { title: data.title, summary: data.summary ?? null, position: data.position ?? 0 } });
}
export async function patchModule(moduleId: string, fields: { title?: string; summary?: string | null; cover_show_title?: boolean }): Promise<any> {
  if (!isBackendId(moduleId)) return null;
  return api(`/modules/${moduleId}`, { method: 'PATCH', body: fields });
}
export async function deleteModule(moduleId: string): Promise<void> {
  if (!isBackendId(moduleId)) return;
  await api(`/modules/${moduleId}`, { method: 'DELETE' });
}
export async function createLesson(moduleId: string, data: { title: string; summary?: string | null; position?: number }): Promise<any> {
  return api(`/modules/${moduleId}/lessons`, { method: 'POST', body: { title: data.title, summary: data.summary ?? null, position: data.position ?? 0 } });
}
export async function patchLesson(lessonId: string, fields: { title?: string; summary?: string | null }): Promise<any> {
  if (!isBackendId(lessonId)) return null;
  return api(`/lessons/${lessonId}`, { method: 'PATCH', body: fields });
}
export async function deleteLesson(lessonId: string): Promise<void> {
  if (!isBackendId(lessonId)) return;
  await api(`/lessons/${lessonId}`, { method: 'DELETE' });
}
// Vídeo da aula = um bloco type='video' com a URL em external_ref (o player do aluno lê de lá).
export async function createVideoBlock(lessonId: string, url: string, position = 0): Promise<any> {
  return api(`/lessons/${lessonId}/blocks`, { method: 'POST', body: { type: 'video', text: null, attrs: {}, provider: 'embed', external_ref: url, position } });
}
export async function patchBlock(blockId: string, fields: any): Promise<any> {
  if (!isBackendId(blockId)) return null;
  return api(`/blocks/${blockId}`, { method: 'PATCH', body: fields });
}
export async function deleteBlock(blockId: string): Promise<void> {
  if (!isBackendId(blockId)) return;
  await api(`/blocks/${blockId}`, { method: 'DELETE' });
}
