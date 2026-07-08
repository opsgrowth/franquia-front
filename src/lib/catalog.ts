// Carrega o catálogo REAL da franquia e mapeia p/ o shape que a vitrine/preview usam.
import { api } from './api';

function mapBlock(b: any) {
  const attrs = b.attrs || {};
  switch (b.type) {
    case 'heading':
      return { kind: 'heading', text: b.text };
    case 'list':
      return { kind: 'list', items: attrs.items || [] };
    case 'quote':
      return { kind: 'quote', text: b.text, cite: attrs.cite };
    case 'video':
      return { kind: 'video', title: b.text || attrs.title };
    case 'image':
      return { kind: 'image', caption: attrs.caption };
    case 'paragraph':
    case 'text':
    default:
      return { kind: 'paragraph', text: b.text || '' };
  }
}

function mapProduct(d: any) {
  const modules = (d.modules || []).map((m: any, mi: number) => ({
    id: m.id,
    title: m.title,
    cover: mi, // índice → família de cor determinística (coverArt)
    lessons: (m.lessons || []).map((l: any, li: number) => ({
      id: l.id,
      title: l.title,
      type: 'video',
      duration: `${6 + ((li * 3) % 9)} min`,
      sample: mi === 0 && li === 0, // 1ª aula do 1º módulo = amostra liberada
      desc: l.summary || undefined,
      blocks: (l.blocks || []).map(mapBlock),
    })),
  }));
  const priceCents = d.suggested_price_cents;
  return {
    id: d.id,
    slug: d.slug,
    title: d.name,
    subtitle: d.tagline || 'Produto da Franquia — pronto para vender',
    kind: 'Curso da Franquia',
    color: d.accent_color || '#7C3AED',
    coverImg: null,
    students: d.students_count || 0,
    displayPrice: priceCents ? `R$ ${Math.round(priceCents / 100)}` : 'R$ —',
    access: 'Liberado',
    status: 'Publicado',
    banners: [],
    modules,
  };
}

// Grade: /catalog (leve). Preview: /catalog/{slug} (com módulos/aulas/blocos).
export async function loadFranchiseCatalog(): Promise<any[]> {
  const items: any[] = await api('/catalog');
  const full = await Promise.all(
    items.map((it) =>
      api(`/catalog/${it.slug}`).catch(() => ({ ...it, modules: [] })),
    ),
  );
  return full.map(mapProduct);
}
