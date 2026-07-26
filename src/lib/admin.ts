// Painel do ADMIN — gestão de franqueados (só admin acessa; backend valida is_admin).
import { api } from './api';

export type Franchisee = {
  creator_id: string;
  tenant_id: string;
  email: string;
  name: string | null;
  last_active_at: string | null;
  promotions: number;
  sales: number;
};

export async function loadFranchisees(): Promise<Franchisee[]> {
  return api('/admin/franchisees');
}

// Formulário de interesse (Estúdio) → salva o lead (qualquer criador logado).
export async function saveLead(data: { name?: string; email?: string; whatsapp?: string }): Promise<any> {
  return api('/leads', { method: 'POST', body: data });
}

export type Lead = { id: string; name: string | null; email: string | null; whatsapp: string | null; created_at: string };
export async function loadLeads(): Promise<Lead[]> {
  try { return await api('/admin/leads'); } catch { return []; }
}

// Observabilidade do webhook Kiwify (admin). Query string no path; catch → [] (padrão getLeads).
export type WebhookEvent = {
  id: string; received_at: string; webhook_token: string; franchisee_name: string | null;
  outcome: string; error_detail: string | null; sale_id: string | null; student_id: string | null;
  raw_payload: any;
};
export async function listWebhookEvents(outcome?: string, limit = 50, offset = 0): Promise<WebhookEvent[]> {
  const qs = new URLSearchParams();
  if (outcome) qs.set('outcome', outcome);
  qs.set('limit', String(limit));
  qs.set('offset', String(offset));
  try { return await api(`/admin/webhook-events?${qs.toString()}`); } catch { return []; }
}

// Convite: cria o franqueado (sem senha) → ele recebe email pra definir a senha.
export async function createFranchisee(data: { email: string; name?: string }): Promise<Franchisee> {
  return api('/admin/franchisees', { method: 'POST', body: data });
}

// Em massa: lista de {email, name} → convida cada um.
export async function bulkFranchisees(items: { email: string; name?: string }[]): Promise<any> {
  return api('/admin/franchisees/bulk', { method: 'POST', body: { items } });
}

// Exclui o franqueado (acesso + creator/tenant + promoções/vendas). Comprador mantém acesso.
export async function deleteFranchisee(creatorId: string): Promise<void> {
  await api(`/admin/franchisees/${creatorId}`, { method: 'DELETE' });
}

// Franqueado define a senha pelo link do convite (público). Devolve o email.
export async function setFranchiseePassword(token: string, password: string): Promise<{ ok: boolean; email: string }> {
  const res = await fetch(`${(import.meta as any).env?.VITE_API_URL || ''}/admin/set-password`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) {
    let d = 'Não foi possível definir a senha.';
    try { const j = await res.json(); if (j && j.detail) d = j.detail; } catch (e) {}
    throw new Error(d);
  }
  return res.json();
}
