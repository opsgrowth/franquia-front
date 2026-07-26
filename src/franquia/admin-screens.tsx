import React from 'react';
import { DShell } from './desktop-screens-1';
import { DISP, IC, Ico, MONO, T, useIsMobile } from './kit';
import { bulkFranchisees, createFranchisee, deleteFranchisee, listWebhookEvents, loadFranchisees, loadLeads } from '../lib/admin';

// TXT (email, nome por linha; separador , ; ou tab) → [{email, name}]. Detecta o email pelo @.
function parseBulk(text: string): { email: string; name?: string }[] {
  return (text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const parts = line.split(/[,;\t]+/).map((s) => s.trim()).filter(Boolean);
    const email = (parts.find((p) => p.includes('@')) || parts[0] || '').toLowerCase();
    const name = parts.find((p) => p !== email && !p.includes('@')) || '';
    return { email, name: name || undefined };
  }).filter((x) => x.email.includes('@'));
}

// ── Gestão de FRANQUEADOS (admin) ────────────────────────────────────
function fmtLast(s: string | null): string {
  if (!s) return 'Nunca acessou';
  try {
    const diff = (Date.now() - new Date(s).getTime()) / 86400000;
    if (diff < 0.04) return 'Agora há pouco';
    if (diff < 1) return 'Hoje';
    if (diff < 2) return 'Ontem';
    if (diff < 30) return `há ${Math.floor(diff)} dias`;
    return new Date(s).toLocaleDateString('pt-BR');
  } catch { return '—'; }
}

function FranchiseesScreen() {
  const mobile = useIsMobile();
  const [list, setList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({ email: '', name: '' });
  const [bulkText, setBulkText] = React.useState('');
  const [bulkBusy, setBulkBusy] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [ok, setOk] = React.useState('');
  const load = () => { setLoading(true); loadFranchisees().then(setList).catch(() => setList([])).finally(() => setLoading(false)); };
  React.useEffect(() => { load(); }, []);
  const add = async () => {
    if (busy || !form.email.trim()) return;
    setBusy(true); setMsg(''); setOk('');
    try {
      await createFranchisee({ email: form.email.trim(), name: form.name.trim() || undefined });
      setOk(`Convite enviado! ${form.email.trim()} vai receber um email pra definir a senha.`);
      setForm({ email: '', name: '' });
      load();
    } catch (e: any) { setMsg((e?.message || 'Erro ao convidar.').replace(/^\d+:\s*/, '')); }
    finally { setBusy(false); }
  };
  const addBulk = async () => {
    const items = parseBulk(bulkText);
    if (bulkBusy) return;
    if (!items.length) { setMsg('Nenhum email válido no texto.'); return; }
    setBulkBusy(true); setMsg(''); setOk('');
    try {
      const r = await bulkFranchisees(items);
      const errN = (r.errors || []).length;
      setOk(`${r.created_count} de ${items.length} convidados${errN ? ` · ${errN} já existiam ou inválidos` : ''}.`);
      setBulkText('');
      load();
    } catch (e: any) { setMsg((e?.message || 'Erro no envio em massa.').replace(/^\d+:\s*/, '')); }
    finally { setBulkBusy(false); }
  };
  const del = async (f: any) => {
    if (!window.confirm(`Excluir ${f.name || f.email}? Remove o acesso dele à franquia. Os compradores dos produtos MANTÊM o acesso.`)) return;
    try { await deleteFranchisee(f.creator_id); setList((l) => l.filter((x) => x.creator_id !== f.creator_id)); }
    catch (e: any) { setMsg((e?.message || 'Erro ao excluir.').replace(/^\d+:\s*/, '')); }
  };
  const inp = { fontFamily: DISP, width: '100%', boxSizing: 'border-box' as const, border: `1px solid ${T.line}`, borderRadius: 11, padding: '12px 14px', fontSize: 15, color: T.ink, outline: 'none', background: '#fff' };
  return (
    <DShell active="franqueados" sub="Admin · Franqueados" title="Franqueados">
      <div style={{ overflow: 'auto', height: '100%', padding: mobile ? '18px 16px' : '24px 30px' }}>
        {/* adicionar */}
        <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 18, padding: mobile ? 18 : 24, maxWidth: 720 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 18, color: T.ink }}>Adicionar franqueado</div>
          <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim, marginTop: 3 }}>Cria um acesso independente. Ele recebe um <b style={{ color: T.ink, fontWeight: 600 }}>email pra definir a senha</b> e já entra no painel.</div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1.4fr 1.4fr 1fr', gap: 12, marginTop: 16 }}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome do franqueado" style={inp} />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && add()} type="email" autoCapitalize="none" placeholder="email@dele.com" style={inp} />
            <div onClick={add} style={{ cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1, background: T.accent, color: '#fff', borderRadius: 11, padding: '12px', fontFamily: DISP, fontWeight: 700, fontSize: 15, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Ico d={IC.plus || 'M12 5v14 M5 12h14'} size={17} c="#fff" />{busy ? 'Enviando…' : 'Convidar'}</div>
          </div>
          <div style={{ marginTop: 18, borderTop: `1px solid ${T.line}`, paddingTop: 16 }}>
            <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: T.ink }}>Adicionar em massa</div>
            <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim, marginTop: 2 }}>Um por linha: <span style={{ fontFamily: MONO }}>email, nome</span> (cole a lista do seu TXT).</div>
            <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={5} placeholder={'joao@email.com, João Silva\nmaria@email.com, Maria Souza'} style={{ ...inp, resize: 'vertical', fontFamily: MONO, fontSize: 13, marginTop: 10 }} />
            <div onClick={addBulk} style={{ marginTop: 10, display: 'inline-flex', cursor: bulkBusy ? 'default' : 'pointer', opacity: bulkBusy ? 0.6 : 1, background: T.ink, color: '#fff', borderRadius: 11, padding: '11px 18px', fontFamily: DISP, fontWeight: 700, fontSize: 14, alignItems: 'center', gap: 8 }}>{bulkBusy ? 'Convidando…' : `Convidar em massa${parseBulk(bulkText).length ? ` (${parseBulk(bulkText).length})` : ''}`}</div>
          </div>
          {ok && <div style={{ marginTop: 12, background: 'rgba(14,122,64,.1)', border: '1px solid rgba(14,122,64,.28)', borderRadius: 10, padding: '11px 14px', fontFamily: DISP, fontSize: 13.5, color: '#0E7A40' }}>{ok}</div>}
          {msg && <div style={{ marginTop: 12, background: 'rgba(216,90,48,.08)', border: '1px solid rgba(216,90,48,.28)', borderRadius: 10, padding: '11px 14px', fontFamily: DISP, fontSize: 13.5, color: '#B23A16' }}>{msg}</div>}
        </div>

        {/* lista */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '26px 0 12px' }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, color: T.ink }}>Franqueados ativos</div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: T.dim }}>{list.length} no total</div>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 18, overflow: 'hidden' }}>
          {!mobile && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 2fr 1.2fr 0.9fr 0.9fr 44px', padding: '14px 22px', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em', color: T.dim, borderBottom: `1px solid ${T.line}` }}>
              <span>NOME</span><span>EMAIL</span><span>ÚLTIMO ACESSO</span><span>PROMOÇÕES</span><span>VENDAS</span><span></span>
            </div>
          )}
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', fontFamily: DISP, color: T.dim }}>Carregando…</div>
          ) : list.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', fontFamily: DISP, fontSize: 15, color: T.dim }}>Nenhum franqueado ainda. Adicione o primeiro acima.</div>
          ) : list.map((f, i) => (
            <div key={f.creator_id} style={{ display: mobile ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: '1.6fr 2fr 1.2fr 0.9fr 0.9fr 44px', alignItems: mobile ? 'flex-start' : 'center', gap: mobile ? 4 : 0, padding: '15px 22px', borderBottom: i < list.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: T.ink }}>{f.name || '—'}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, color: T.dim, overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.email}</span>
              <span style={{ fontFamily: DISP, fontSize: 13.5, color: f.last_active_at ? T.ink : T.dim }}>{fmtLast(f.last_active_at)}</span>
              <span style={{ fontFamily: DISP, fontSize: 14, color: T.ink }}>{mobile ? 'Promoções: ' : ''}{f.promotions}</span>
              <span style={{ fontFamily: DISP, fontSize: 14, fontWeight: 700, color: f.sales ? '#0E7A40' : T.dim }}>{mobile ? 'Vendas: ' : ''}{f.sales}</span>
              <div onClick={() => del(f)} title="Excluir franqueado" style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${T.line}`, marginLeft: mobile ? 0 : 'auto' }}><Ico d="M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={15} c="#B23A2E" /></div>
            </div>
          ))}
        </div>
      </div>
    </DShell>
  );
}

// ── LINKS dos apps dos produtos (admin) ──────────────────────────────
function ProductLinksScreen() {
  const mobile = useIsMobile();
  const [copied, setCopied] = React.useState('');
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const prods = ((typeof window !== 'undefined' && (window as any).__franquiaProducts) || []).filter((p: any) => p.slug && p.catalogPublished !== false);
  const copy = (url: string, id: string) => { try { navigator.clipboard.writeText(url); } catch (e) {} setCopied(id); setTimeout(() => setCopied(''), 1500); };
  return (
    <DShell active="applinks" sub="Admin · Links dos apps" title="Links dos apps">
      <div style={{ overflow: 'auto', height: '100%', padding: mobile ? '18px 16px' : '24px 30px' }}>
        <div style={{ fontFamily: DISP, fontSize: 14.5, color: T.dim, marginBottom: 18, maxWidth: 640, lineHeight: 1.55 }}>Cada produto publicado tem sua <b style={{ color: T.ink }}>área de membros própria</b>. O comprador acessa por esta URL e entra com o email da compra.</div>
        {prods.length === 0 ? (
          <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 40, textAlign: 'center', fontFamily: DISP, color: T.dim }}>Nenhum produto publicado ainda. Publique um produto no Catálogo Franquia.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 820 }}>
            {prods.map((p: any) => {
              const url = `${base}/p/${p.slug}`;
              return (
                <div key={p.id} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: p.color || T.accent, flex: '0 0 auto' }} />
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15.5, color: T.ink }}>{p.title}</div>
                    <div style={{ fontFamily: MONO, fontSize: 12.5, color: T.accent, marginTop: 3, wordBreak: 'break-all' }}>{url}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div onClick={() => copy(url, p.id)} style={{ cursor: 'pointer', background: copied === p.id ? '#0E7A40' : T.ink, color: '#fff', borderRadius: 10, padding: '10px 16px', fontFamily: DISP, fontWeight: 600, fontSize: 13.5 }}>{copied === p.id ? 'Copiado!' : 'Copiar link'}</div>
                    <a href={url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: '#fff', color: T.ink, border: `1px solid ${T.line}`, borderRadius: 10, padding: '10px 14px', fontFamily: DISP, fontWeight: 600, fontSize: 13.5 }}>Abrir</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DShell>
  );
}

// ── INTERESSADOS (leads do formulário do Estúdio) — admin ────────────
function LeadsScreen() {
  const mobile = useIsMobile();
  const [list, setList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { loadLeads().then(setList).catch(() => setList([])).finally(() => setLoading(false)); }, []);
  const fmt = (s: string) => { try { return new Date(s).toLocaleString('pt-BR'); } catch { return '—'; } };
  return (
    <DShell active="interessados" sub="Admin · Interessados" title="Interessados">
      <div style={{ overflow: 'auto', height: '100%', padding: mobile ? '18px 16px' : '24px 30px' }}>
        <div style={{ fontFamily: DISP, fontSize: 14.5, color: T.dim, marginBottom: 18, maxWidth: 660 }}>Quem preencheu o formulário de interesse no Estúdio (lista de espera do RecorrêncIA).</div>
        <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 18, overflow: 'hidden' }}>
          {!mobile && <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 2fr 1.4fr 1.4fr', padding: '14px 22px', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em', color: T.dim, borderBottom: `1px solid ${T.line}` }}><span>NOME</span><span>EMAIL</span><span>WHATSAPP</span><span>QUANDO</span></div>}
          {loading ? <div style={{ padding: 32, textAlign: 'center', fontFamily: DISP, color: T.dim }}>Carregando…</div>
            : list.length === 0 ? <div style={{ padding: 40, textAlign: 'center', fontFamily: DISP, color: T.dim }}>Ninguém preencheu ainda.</div>
            : list.map((l, i) => (
              <div key={l.id} style={{ display: mobile ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: '1.4fr 2fr 1.4fr 1.4fr', gap: mobile ? 3 : 0, padding: '15px 22px', borderBottom: i < list.length - 1 ? `1px solid ${T.line}` : 'none' }}>
                <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: T.ink }}>{l.name || '—'}</span>
                <span style={{ fontFamily: MONO, fontSize: 13, color: T.dim, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.email || '—'}</span>
                <span style={{ fontFamily: DISP, fontSize: 14, fontWeight: 600, color: T.ink }}>{l.whatsapp || '—'}</span>
                <span style={{ fontFamily: DISP, fontSize: 13, color: T.dim }}>{fmt(l.created_at)}</span>
              </div>
            ))}
        </div>
      </div>
    </DShell>
  );
}

// ── WEBHOOKS (observabilidade do webhook Kiwify) — admin ─────────────
const WH_OUTCOMES = ['access_granted', 'unknown_token', 'product_gone', 'ignored_status', 'no_email', 'duplicate', 'error'];
function whColor(o: string): string {
  if (o === 'access_granted') return '#0E7A40';               // verde: acesso liberado
  if (o === 'unknown_token' || o === 'product_gone' || o === 'error') return '#B23A2E'; // vermelho: falha
  if (o === 'no_email') return '#C77700';                     // âmbar: falha branda
  return T.dim;                                               // neutro: ignored_status, duplicate, received
}
function WebhookEvents() {
  const mobile = useIsMobile();
  const LIMIT = 50;
  const [list, setList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [outcome, setOutcome] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  React.useEffect(() => {
    setLoading(true);
    listWebhookEvents(outcome || undefined, LIMIT, offset).then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }, [outcome, offset]);
  const fmt = (s: string) => { try { return new Date(s).toLocaleString('pt-BR'); } catch { return '—'; } };
  const chips: [string, string][] = [['', 'Todos'], ...WH_OUTCOMES.map((o) => [o, o] as [string, string])];
  return (
    <DShell active="webhooks" sub="Admin · Webhooks" title="Webhooks">
      <div style={{ overflow: 'auto', height: '100%', padding: mobile ? '18px 16px' : '24px 30px' }}>
        <div style={{ fontFamily: DISP, fontSize: 14.5, color: T.dim, marginBottom: 16, maxWidth: 720 }}>Cada venda que chega da Kiwify vira um evento aqui — sucesso e falhas. Filtre pelo desfecho e abra "ver detalhes" pra inspecionar o payload.</div>
        {/* filtro por outcome */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {chips.map(([val, label]) => {
            const on = outcome === val;
            return <div key={val || 'all'} onClick={() => { setOutcome(val); setOffset(0); setExpanded(null); }} style={{ cursor: 'pointer', fontFamily: DISP, fontWeight: 600, fontSize: 12.5, padding: '7px 13px', borderRadius: 99, border: `1px solid ${on ? T.accent : T.line}`, background: on ? T.accent : '#fff', color: on ? '#fff' : T.dim }}>{label}</div>;
          })}
        </div>
        {/* lista */}
        <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 18, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', fontFamily: DISP, color: T.dim }}>Carregando…</div>
          ) : list.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', fontFamily: DISP, fontSize: 15, color: T.dim }}>Nenhum evento{outcome ? ` com desfecho "${outcome}"` : ''}.</div>
          ) : list.map((ev, i) => {
            const open = expanded === ev.id;
            const col = whColor(ev.outcome);
            return (
              <div key={ev.id} style={{ borderBottom: i < list.length - 1 ? `1px solid ${T.line}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: MONO, fontSize: 12.5, color: T.dim, flex: '0 0 auto' }}>{fmt(ev.received_at)}</span>
                  <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink, flex: 1, minWidth: 120 }}>{ev.franchisee_name || '—'}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: col, border: `1px solid ${col}`, padding: '3px 9px', borderRadius: 7, flex: '0 0 auto' }}>{ev.outcome}</span>
                  <span onClick={() => setExpanded(open ? null : ev.id)} style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 600, color: T.accent, cursor: 'pointer', flex: '0 0 auto' }}>{open ? 'ocultar' : 'ver detalhes'}</span>
                </div>
                {ev.error_detail && <div style={{ padding: '0 22px 12px', marginTop: -4, fontFamily: MONO, fontSize: 12, color: '#B23A2E', wordBreak: 'break-word' }}>{ev.error_detail}</div>}
                {open && (
                  <div style={{ padding: '0 22px 16px' }}>
                    <pre style={{ margin: 0, background: '#18121F', color: '#E8E0F5', borderRadius: 12, padding: 16, fontFamily: MONO, fontSize: 12, lineHeight: 1.5, overflow: 'auto', maxHeight: 360 }}>{JSON.stringify(ev.raw_payload, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* paginação */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div onClick={() => offset > 0 && setOffset(Math.max(0, offset - LIMIT))} style={{ cursor: offset > 0 ? 'pointer' : 'default', opacity: offset > 0 ? 1 : 0.4, fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 10, padding: '9px 16px', background: '#fff' }}>← Anterior</div>
          <span style={{ fontFamily: MONO, fontSize: 12, color: T.dim }}>{list.length ? `${offset + 1}–${offset + list.length}` : '—'}</span>
          <div onClick={() => list.length >= LIMIT && setOffset(offset + LIMIT)} style={{ cursor: list.length >= LIMIT ? 'pointer' : 'default', opacity: list.length >= LIMIT ? 1 : 0.4, fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 10, padding: '9px 16px', background: '#fff' }}>Próximo →</div>
        </div>
      </div>
    </DShell>
  );
}

export { FranchiseesScreen, LeadsScreen, ProductLinksScreen, WebhookEvents };
