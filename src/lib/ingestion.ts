// Ingestão por IA (PDF → curso). Liga o painel ao backend real:
// POST /ingestion/jobs (multipart) → worker processa → poll GET /ingestion/jobs/{id}.
import { api, apiUploadForm } from './api';

export type IngestionJob = {
  id: string;
  status: string; // queued|extracting|outlining|structuring|importing|done|failed|needs_confirmation
  app_id?: string | null;
  modules_done?: number;
  modules_total?: number;
  error_message?: string | null;
  error_category?: string | null;
  est_modules?: number | null;
  [k: string]: any;
};

export async function createJob(file: File, name?: string): Promise<{ job_id: string; status: string }> {
  const form = new FormData();
  form.append('file', file);
  if (name && name.trim()) form.append('name', name.trim());
  return apiUploadForm('/ingestion/jobs', form);
}

export async function getJob(jobId: string): Promise<IngestionJob> {
  return api(`/ingestion/jobs/${jobId}`);
}

// Guardrail de custo: libera um job pausado em 'needs_confirmation' (worker RESUME).
export async function confirmJob(jobId: string): Promise<IngestionJob> {
  return api(`/ingestion/jobs/${jobId}/confirm`, { method: 'POST' });
}

// Descarta um job pausado (→ failed/cancelled).
export async function cancelJob(jobId: string): Promise<IngestionJob> {
  return api(`/ingestion/jobs/${jobId}/cancel`, { method: 'POST' });
}

export const isTerminal = (s: string): boolean => s === 'done' || s === 'failed';

// Rótulo humano por status (pra barra de progresso da tela).
export function statusLabel(j: IngestionJob): string {
  switch (j.status) {
    case 'queued': return 'Na fila…';
    case 'extracting': return 'Lendo o PDF…';
    case 'outlining': return 'Planejando os módulos…';
    case 'structuring': {
      const d = j.modules_done ?? 0, t = j.modules_total ?? 0;
      return t ? `IA estruturando — módulo ${Math.min(d + 1, t)} de ${t}…` : 'IA estruturando…';
    }
    case 'importing': return 'Montando o curso…';
    case 'done': return 'Pronto!';
    case 'failed': return 'Falhou';
    case 'needs_confirmation': return 'Documento grande — confirmar?';
    default: return 'Processando…';
  }
}

export function progressPct(j: IngestionJob): number {
  if (j.status === 'done') return 100;
  const order = ['queued', 'extracting', 'outlining', 'structuring', 'importing'];
  const base = Math.max(0, order.indexOf(j.status)) / order.length;
  let frac = 0;
  if (j.status === 'structuring' && j.modules_total) frac = (j.modules_done ?? 0) / j.modules_total / order.length;
  return Math.min(96, Math.round((base + frac) * 100) + 4);
}
