// App do comprador (aluno) — carrega o produto pelo LINK MÁGICO (token na URL).
// Usa um token PRÓPRIO do aluno (separado da sessão do painel).
import { API_BASE } from './api';

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

// Login por email: pede um link de acesso pro email da compra. Resposta genérica.
export async function requestAccess(slug: string, email: string): Promise<{ ok: boolean; detail: string }> {
  const res = await fetch(`${API_BASE}/student/request-access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, email }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || `${res.status}`);
  }
  return res.json();
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
    case 'heading': return { kind: 'heading', text: b.text };
    case 'list': return { kind: 'list', items: attrs.items || [] };
    case 'quote': return { kind: 'quote', text: b.text, cite: attrs.cite };
    case 'video': return { kind: 'video', title: b.text || attrs.title };
    case 'image': return { kind: 'image', caption: attrs.caption };
    case 'divider': return { kind: 'divider' };
    case 'paragraph':
    case 'text':
    default: return { kind: 'paragraph', text: b.text || '' };
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
    coverImg: null,
    students: 0,
    banners: [],
    modules: (content.modules || []).map((m: any, mi: number) => ({
      id: m.id,
      title: m.title,
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
