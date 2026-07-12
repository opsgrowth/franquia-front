// App do comprador (aluno) — carrega o produto pelo LINK MÁGICO (token na URL).
// Usa um token PRÓPRIO do aluno (separado da sessão do painel).
import { API_BASE } from './api';
import { videoEmbed } from './video';

const isB64 = (v: any): boolean => typeof v === 'string' && v.startsWith('data:');

const KEY = 'fia_student_token';

// Lê o token do ?token= (link mágico) e persiste; limpa a query da URL.
export function readStudentToken(): string | null {
  try {
    const u = new URL(window.location.href);
    const q = u.searchParams.get('token');
    if (q) {
      localStorage.setItem(KEY, q);
      u.searchParams.delete('token');
      window.history.replaceState({}, '', u.pathname + (u.search || ''));
      return q;
    }
  } catch (e) {}
  return localStorage.getItem(KEY);
}
export function clearStudentToken() {
  try { localStorage.removeItem(KEY); } catch (e) {}
}
export function setStudentToken(token: string) {
  try { localStorage.setItem(KEY, token); } catch (e) {}
}

// Login por EMAIL da compra → devolve e persiste o token de sessão (email = login).
// Erro claro se o email não tem acesso (o comprador precisa saber pra tentar de novo).
export async function studentLogin(slug: string, email: string): Promise<string> {
  const res = await fetch(`${API_BASE}/student/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, email }),
  });
  if (!res.ok) {
    let detail = 'Não foi possível entrar. Tente de novo.';
    try { const j = await res.json(); if (j && j.detail) detail = j.detail; } catch (e) {}
    throw new Error(detail);
  }
  const data = await res.json();
  if (data && data.token) setStudentToken(data.token);
  return data && data.token;
}

async function sfetch(path: string, token: string): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function mapBlock(b: any) {
  const attrs = b.attrs || {};
  switch (b.type) {
    case 'heading': return { id: b.id, kind: 'heading', text: b.text };
    case 'list': return { id: b.id, kind: 'list', items: attrs.items || [] };
    case 'quote': return { id: b.id, kind: 'quote', text: b.text, cite: attrs.cite };
    case 'video': { const url = b.external_ref || attrs.url || null; return { id: b.id, kind: 'video', title: b.text || attrs.title, url, embed: videoEmbed(url) }; }
    case 'image': return { id: b.id, kind: 'image', caption: attrs.caption };
    case 'divider': return { id: b.id, kind: 'divider' };
    case 'paragraph':
    case 'text':
    default: return { id: b.id, kind: 'paragraph', text: b.text || '' };
  }
}

// Retorna { student, course } no shape que o CoApp consome.
export async function loadStudentCourse(token: string): Promise<{ student: any; course: any }> {
  const [me, content] = await Promise.all([
    sfetch('/student/me', token),
    sfetch('/student/content', token),
  ]);
  const p = content.product;
  const course = {
    id: p.id,
    slug: p.slug,
    title: p.name,
    subtitle: '',
    kind: 'Meu produto',
    color: p.accent_color || '#7C3AED',
    coverImg: isB64(p.cover_image_url) ? p.cover_image_url : null,
    students: 0,
    banners: (p.banners || []).filter(isB64),
    modules: (content.modules || []).map((m: any, mi: number) => ({
      id: m.id,
      title: m.title,
      coverImg: isB64(m.cover_image_url) ? m.cover_image_url : null,
      cover: mi,
      lessons: (m.lessons || []).map((l: any, li: number) => ({
        id: l.id,
        title: l.title,
        type: 'video',
        duration: `${6 + ((li * 3) % 9)} min`,
        sample: false,
        desc: l.summary || undefined,
        blocks: (l.blocks || []).map(mapBlock),
      })),
    })),
  };
  return { student: me, course };
}
