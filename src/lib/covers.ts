// Persistência de CAPAS no backend (produto / módulo / banners). O editor do admin
// já mostra o base64 localmente (feedback instantâneo); aqui gravamos server-side pra
// ficar consistente (aparece no catálogo pra todos, sobrevive reload/outro device).
// Só grava p/ itens REAIS do backend (id UUID) — produtos premium mock são ignorados.
import { api, apiUpload } from './api';

export const isBackendId = (id: any): boolean =>
  typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}/i.test(id);

const isB64 = (v: any): boolean => typeof v === 'string' && v.startsWith('data:');

// data: URL (base64) → Blob, p/ enviar como multipart (o backend valida por magic bytes).
export function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(',');
  const head = dataUrl.slice(0, comma);
  const b64 = dataUrl.slice(comma + 1);
  const mime = (head.match(/data:([^;]+)/) || [])[1] || 'image/jpeg';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

// base64 → upload; índice/null → remove (volta ao padrão determinístico).
export function persistModuleCover(moduleId: string, v: any): void {
  if (!isBackendId(moduleId)) return;
  if (isB64(v)) {
    apiUpload(`/modules/${moduleId}/cover`, dataUrlToBlob(v), 'cover').catch((e: any) =>
      console.warn('capa módulo:', e?.message || e));
  } else {
    api(`/modules/${moduleId}/cover`, { method: 'DELETE' }).catch(() => {});
  }
}

export function persistAppCover(appId: string, v: any): void {
  if (!isBackendId(appId)) return;
  if (isB64(v)) {
    apiUpload(`/apps/${appId}/cover`, dataUrlToBlob(v), 'cover').catch((e: any) =>
      console.warn('capa produto:', e?.message || e));
  } else {
    api(`/apps/${appId}/cover`, { method: 'DELETE' }).catch(() => {});
  }
}

// Banners: diff de UMA mudança por vez (o BannerEditor dispara onChange por ação).
// Novo base64 → POST (anexa); removido → DELETE pelo índice na lista de banners reais.
export function persistBanners(appId: string, oldArr: any[], newArr: any[]): void {
  if (!isBackendId(appId)) return;
  const oldB = (oldArr || []).filter(isB64);
  const newB = (newArr || []).filter(isB64);
  const added = newB.filter((x) => !oldB.includes(x));
  const removed = oldB.filter((x) => !newB.includes(x));
  (async () => {
    for (const x of added) {
      try { await apiUpload(`/apps/${appId}/banners`, dataUrlToBlob(x), 'banner'); }
      catch (e: any) { console.warn('banner:', e?.message || e); }
    }
    for (const x of removed) {
      const idx = oldB.indexOf(x);
      if (idx >= 0) { try { await api(`/apps/${appId}/banners/${idx}`, { method: 'DELETE' }); } catch (e) {} }
    }
  })();
}
