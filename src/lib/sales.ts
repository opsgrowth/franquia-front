// Vendas REAIS do franqueado logado (GET /sales, isolado por tenant no backend).
import { api } from './api';

const STATUS: Record<string, string> = {
  access_granted: 'Acesso liberado',
  refunded: 'Reembolso',
  pending: 'Pendente',
  failed: 'Falhou',
};

function daysAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}
function relTime(iso: string): string {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} dia${d > 1 ? 's' : ''}`;
}
function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Mapeia p/ o shape que a tela de Vendas usa (id, d, prod, buyer, plat, value, net,
// status, when, color) + _val numérico p/ as métricas.
export async function loadSales(): Promise<any[]> {
  const rows: any[] = await api('/sales');
  return rows.map((s) => {
    const val = s.amount_cents ? s.amount_cents / 100 : 0;
    return {
      id: '#' + String(s.id).replace(/-/g, '').slice(0, 4).toUpperCase(),
      _val: val,
      d: daysAgo(s.created_at),
      prod: s.product,
      buyer: s.buyer_name ? `${s.buyer_name} · ${s.buyer_email}` : s.buyer_email,
      plat: cap(s.platform || 'kiwify'),
      value: val ? `R$ ${val.toFixed(0)}` : '—',
      net: val ? `R$ ${(val * 0.91).toFixed(0)}` : '—',
      status: STATUS[s.status] || s.status,
      when: relTime(s.created_at),
      color: s.color || '#7C3AED',
    };
  });
}
