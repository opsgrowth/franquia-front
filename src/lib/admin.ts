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

export async function createFranchisee(data: { email: string; name?: string; password: string }): Promise<Franchisee> {
  return api('/admin/franchisees', { method: 'POST', body: data });
}
