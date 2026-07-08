import React from 'react';
import './cover-assets';
import { ABtn, AIC, AuthorShell, CoverField } from './author-kit';
import { PhonePreview } from './author-preview';
import { CoCover, allLessons, coLighten, coTheme, courseProgress, moduleDuration } from './co-app';
import { DISP, Ico, MONO, Mark, T } from './kit';

// "Criar do zero" — admin Produtos & Cursos (gerenciar produtos > módulos > aulas).
// Padrão do README, identidade FranquIA (violeta/Sora). Reusa T/DISP/MONO/Ico/AIC,
// AuthorShell, ABtn, CoCover/coTheme, PhonePreview, allLessons/courseProgress/moduleDuration.

const { useState: useStateAdm } = React;

const ADM_COLORS = ['#7C3AED', '#5246E5', '#A23CD6', '#6429C9', '#4B2E83', '#B5468A', '#1F8A5B', '#3F6FD8'];
const ADM_KINDS = ['Curso flagship', 'Lançamento', 'Bônus', 'Premium'];
const ADM_ACCESS = ['Liberado', 'Premium (upsell)'];
const ADM_PLATFORMS = ['Digistore24', 'Kiwify', 'Hotmart', 'Eduzz', 'Cartpanda'];
const ADM_TYPES = [['video', 'Vídeo', AIC.play], ['audio', 'Áudio', 'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14'], ['leitura', 'Leitura', 'M5 4h14v16H5z M8 8h8 M8 12h8 M8 16h5']];

let admSeq = 1;
const aid = (p) => `${p}-${Date.now().toString(36)}-${admSeq++}`;

const ADM_INIT = [
  { id: 'p1', title: 'FranquIA — Catálogo que Vende', subtitle: 'Comece com produtos validados e a IA multiplicando o que funciona', kind: 'Curso flagship', color: '#7C3AED', access: 'Liberado', status: 'Publicado', students: 90240, showTitle: true,
    modules: [
      { id: 'm1', title: 'Fundamentos da Franquia', lessons: [{ id: 'l1', title: 'Bem-vinda à FranquIA', type: 'video', duration: '8 min' }, { id: 'l2', title: 'Como o catálogo já vende', type: 'video', duration: '11 min' }, { id: 'l3', title: 'Seu primeiro produto no ar', type: 'video', duration: '9 min' }] },
      { id: 'm2', title: 'IA que multiplica', lessons: [{ id: 'l4', title: 'Gerando novas versões', type: 'video', duration: '13 min' }, { id: 'l5', title: 'Personalizando por público', type: 'audio', duration: '10 min' }] },
      { id: 'm3', title: 'Vendas no piloto', lessons: [{ id: 'l6', title: 'Publicando a página', type: 'video', duration: '7 min' }, { id: 'l7', title: 'Recebendo 100% da venda', type: 'leitura', duration: '6 min' }] },
    ] },
  { id: 'p2', title: 'Tráfego que Converte', subtitle: 'Leve as pessoas certas até a oferta sem queimar orçamento', kind: 'Lançamento', color: '#5246E5', access: 'Liberado', status: 'Publicado', students: 21800, showTitle: true,
    modules: [
      { id: 'm4', title: 'Estrutura da campanha', lessons: [{ id: 'l8', title: 'Antes de gastar', type: 'video', duration: '9 min' }, { id: 'l9', title: 'Público e objetivo', type: 'video', duration: '12 min' }] },
      { id: 'm5', title: 'Criativos que param o feed', lessons: [{ id: 'l10', title: 'O primeiro segundo', type: 'video', duration: '8 min' }, { id: 'l11', title: 'Legenda e gancho', type: 'leitura', duration: '10 min' }] },
    ] },
  { id: 'p3', title: 'Mentoria Alto Ticket', subtitle: 'Venda de R$5k a R$50k com método', kind: 'Premium', color: '#A23CD6', access: 'Premium (upsell)', status: 'Premium', students: 1240, showTitle: true, saleIds: [{ platform: 'Hotmart', id: 'PR-9921' }, { platform: 'Kiwify', id: 'kw_4f7a' }],
    modules: [{ id: 'm6', title: 'Sistema de alto valor', lessons: [{ id: 'l12', title: 'A sessão estratégica', type: 'video', duration: '18 min', sample: true }, { id: 'l13', title: 'Quebra de objeções', type: 'video', duration: '15 min' }] }] },
];

// progresso fake (para a coluna conclusão / preview)
const ADM_PROGRESS = { l1: true, l2: true, l4: true };

// ── Modal genérico ────────────────────────────────────────────────
function AdmModal({ title, onClose, onSave, saveLabel = 'Salvar', children, width = 520 }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(20,16,25,.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: width, maxHeight: '92%', overflow: 'auto', background: '#fff', borderRadius: 20, boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 26px', borderBottom: `1px solid ${T.line}`, position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: T.ink }}>{title}</div>
          <div onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T.dim, fontSize: 18 }}>✕</div>
        </div>
        <div style={{ padding: '24px 26px' }}>{children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 26px', borderTop: `1px solid ${T.line}`, position: 'sticky', bottom: 0, background: '#fff' }}>
          <div onClick={onClose} style={{ cursor: 'pointer', fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 11, padding: '11px 20px' }}>Cancelar</div>
          <div onClick={onSave} style={{ cursor: 'pointer' }}><ABtn icon={AIC.check}>{saveLabel}</ABtn></div>
        </div>
      </div>
    </div>
  );
}

const admLbl = { fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.ink, display: 'block', margin: '0 0 7px' };
const admInput = { fontFamily: DISP, width: '100%', border: `1px solid ${T.line}`, borderRadius: 11, padding: '12px 14px', fontSize: 15, color: T.ink, outline: 'none', background: '#fff', boxSizing: 'border-box' };

function AdmIconSquare({ color, size = 52, r = 14 }) {
  return <div style={{ width: size, height: size, borderRadius: r, background: coTheme(color), display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Mark size={size * 0.46} front="#fff" ghost={coLighten(color, .4)} inner="transparent" /></div>;
}

function AdmStatus({ status }) {
  const map = { 'Publicado': { fg: '#0E7A40', bg: 'rgba(14,154,80,.14)' }, 'Premium': { fg: T.accentDeep, bg: 'rgba(124,58,237,.12)' }, 'Rascunho': { fg: T.dim, bg: 'rgba(24,18,31,.06)' } };
  const s = map[status] || map['Rascunho'];
  return <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 12.5, color: s.fg, background: s.bg, padding: '5px 13px', borderRadius: 99 }}>{status}</span>;
}

// editor de até 3 banners (rotacionam no início do app)
function BannerEditor({ banners, onChange }) {
  const list = banners || [];
  const setAt = (i, v) => onChange(list.map((x, k) => (k === i ? v : x)));
  const add = () => onChange([...list, 0]);
  const remove = (i) => onChange(list.filter((_, k) => k !== i));
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {list.map((b, i) => (
          <div key={i} style={{ position: 'relative', width: 'calc(33.3% - 7px)', minWidth: 140 }}>
            <CoverField value={b} onPick={(v) => setAt(i, v)} h={80} radius={10} />
            <div onClick={() => remove(i)} style={{ position: 'absolute', top: 6, left: 6, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12 }}>✕</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.dim, marginTop: 5, textAlign: 'center' }}>Banner {i + 1}</div>
          </div>
        ))}
        {list.length < 3 && (
          <div onClick={add} style={{ width: 'calc(33.3% - 7px)', minWidth: 140, height: 80, borderRadius: 10, border: `1.5px dashed rgba(124,58,237,.4)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: T.accent }}>
            <Ico d={AIC.plus} size={18} c={T.accent} /><span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 12.5 }}>Adicionar banner</span>
          </div>
        )}
      </div>
      <div style={{ fontFamily: DISP, fontSize: 12, color: T.dim, marginTop: 8 }}>Até 3 banners — rotacionam no início do app.</div>
    </div>
  );
}

// editor de IDs de venda (Plataforma + ID, repetível) — a chave que liga venda → acesso
function PlatformIds({ value, onChange }) {
  const list = value || [];
  const setAt = (i, patch) => onChange(list.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const add = () => onChange([...list, { platform: ADM_PLATFORMS[0], id: '' }]);
  const remove = (i) => onChange(list.filter((_, k) => k !== i));
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {list.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
            <select value={row.platform} onChange={(e) => setAt(i, { platform: e.target.value })} style={{ ...admInput, width: 168, flex: '0 0 auto', cursor: 'pointer' }}>{ADM_PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select>
            <input value={row.id} onChange={(e) => setAt(i, { id: e.target.value })} placeholder="ID do produto/oferta" style={{ ...admInput, fontFamily: MONO, fontSize: 13 }} />
            <div onClick={() => remove(i)} style={{ width: 38, height: 38, flex: '0 0 auto', borderRadius: 9, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Ico d={AIC.trash} size={15} c={T.dim} /></div>
          </div>
        ))}
      </div>
      <div onClick={add} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: list.length ? 10 : 0, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.ink }}><Ico d={AIC.plus} size={15} c={T.ink} />Adicionar ID de venda</div>
      <div style={{ fontFamily: DISP, fontSize: 12, color: T.dim, marginTop: 8 }}>O mesmo produto pode ser vendido em várias plataformas/ofertas. Cada ID liga uma venda à liberação de acesso (via webhook em Vendas).</div>
    </div>
  );
}

// Produtos da Franquia (criados pelo admin — aparecem para todos os franqueados)
const FRANQUIA_INIT = [
  { id: 'f1', displayPrice: 'R$ 297', title: 'Renda com IA — Método', subtitle: 'O sistema completo para vender produtos digitais com IA', kind: 'Curso flagship', color: '#7C3AED', access: 'Liberado', status: 'Publicado', students: 90240, showTitle: true, saleIds: [{ platform: 'Kiwify', id: 'kw_ria01' }, { platform: 'Hotmart', id: 'HT_9921' }],
    modules: [
      { id: 'fm1', title: 'Fundamentos da Franquia', cover: 0, lessons: [{ id: 'fl1', title: 'Bem-vinda à FranquIA', type: 'video', duration: '8 min' }, { id: 'fl2', title: 'Como o catálogo já vende', type: 'video', duration: '11 min' }] },
      { id: 'fm2', title: 'IA que multiplica', cover: 1, lessons: [{ id: 'fl3', title: 'Gerando novas versões', type: 'video', duration: '13 min' }] },
    ] },
  { id: 'f2', displayPrice: 'R$ 147', title: 'Reconquista 360', subtitle: 'O plano completo da reconquista', kind: 'Lançamento', color: '#E2502F', access: 'Liberado', status: 'Publicado', students: 21800, showTitle: false, coverImg: (window.COVER && window.COVER.reconquista360) || null, saleIds: [],
    modules: [{ id: 'fm3', title: 'Estrutura da campanha', cover: 2, lessons: [{ id: 'fl4', title: 'Antes de gastar', type: 'video', duration: '9 min' }] }] },
  { id: 'f4', displayPrice: 'Premium', title: 'Oferta Milionária', subtitle: 'O produto de 7 dígitos · sociedade exclusiva', kind: 'Premium', color: '#C9A227', access: 'Premium (upsell)', status: 'Premium', students: 1820, showTitle: false, coverImg: (window.COVER && window.COVER.ofertaMilionaria) || null, saleIds: [{ platform: 'Hotmart', id: 'HT_oferta' }],
    modules: [{ id: 'fm5', title: 'A mentalidade dos 7 dígitos', cover: 0, lessons: [{ id: 'fl7', title: 'O destrave milionário', type: 'video', duration: '20 min', sample: true }, { id: 'fl8', title: 'Estrutura da oferta', type: 'video', duration: '16 min' }] }] },
];

export { ADM_COLORS, ADM_KINDS, ADM_ACCESS, ADM_PLATFORMS, ADM_TYPES, ADM_INIT, FRANQUIA_INIT, ADM_PROGRESS, aid, AdmModal, admLbl, admInput, AdmIconSquare, AdmStatus, BannerEditor, PlatformIds };
