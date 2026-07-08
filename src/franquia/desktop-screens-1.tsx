import React from 'react';
import { AIC } from './author-kit';
import { PhonePreview } from './author-preview';
import { FRANQUIA_INIT } from './co-admin';
import { MaterialsSheet } from './desktop-materiais';
import { DISP, IC, Ico, Lockup, MONO, Mark, T, Wordmark, useIsMobile } from './kit';

// Ferramenta FranquIA · desktop (parte 1) — Shell + Dashboard + Catálogo
// Reusa T/DISP/MONO/Mark/Wordmark + Ico/IC (de mobile-screens-1.jsx).

// ── Shell: sidebar + topbar ───────────────────────────────────────
function DShell({ active = 'home', title, sub, action, bleed = false, search, onSearch, searchPlaceholder = 'Buscar…', children }) {
  const nav = [['home', 'Início', IC.home], ['cat', 'Catálogo', IC.grid], ['gen', 'Estúdio', IC.spark], ['sales', 'Vendas', IC.chart], ['cfg', 'Configurações', IC.cfg]];
  const IS_ADMIN = true; // API: trocar por check de role do usuário
  const mobile = useIsMobile();
  const [drawer, setDrawer] = React.useState(false);
  return (
    <div style={{ display: 'flex', height: '100%', background: T.paper, fontFamily: DISP, color: T.ink }}>
      {mobile && drawer && <div onClick={() => setDrawer(false)} style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(20,16,25,.5)' }}></div>}
      {/* sidebar */}
      <div style={{ width: 248, flex: '0 0 auto', background: T.darkBg, display: (mobile && !drawer) ? 'none' : 'flex', flexDirection: 'column', padding: '26px 18px', position: mobile ? 'fixed' : 'relative', top: 0, bottom: 0, left: 0, zIndex: mobile ? 71 : 'auto' }}>
        <div style={{ padding: '0 8px 8px' }}>
          <Lockup scale={0.46} color={T.darkText} ia={T.pill} front={T.accent} ghost={T.pill} inner={T.darkBg} />
        </div>
        <div style={{ height: 1, background: 'rgba(196,163,255,.14)', margin: '18px 6px 18px' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map(([k, label, d]) => {
            const on = k === active;
            return (
              <div key={k} onClick={() => window.__go && window.__go(k)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 11, background: on ? T.accent : 'transparent', color: on ? '#fff' : 'rgba(246,241,251,.62)', fontFamily: DISP, fontWeight: on ? 600 : 500, fontSize: 14.5, cursor: 'pointer' }}>
                {d ? <Ico d={d} size={20} c={on ? '#fff' : 'rgba(246,241,251,.62)'} /> : <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 16, height: 16, borderRadius: 5, border: `1.8px solid ${on ? '#fff' : 'rgba(246,241,251,.62)'}` }}></div></div>}
                {label}
                {k === 'gen' && <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 9, fontWeight: 600, color: on ? '#fff' : T.pill, background: on ? 'rgba(255,255,255,.2)' : 'rgba(196,163,255,.16)', padding: '2px 6px', borderRadius: 5 }}>IA</span>}
                {k === 'fadmin' && <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 9, fontWeight: 600, color: on ? T.darkBg : T.pill, background: on ? T.pill : 'rgba(196,163,255,.22)', padding: '2px 6px', borderRadius: 5 }}>ADM</span>}
              </div>
            );
          })}
        </div>
        {/* admin separator */}
        {IS_ADMIN && <React.Fragment>
          <div style={{ height: 1, background: 'rgba(196,163,255,.14)', margin: '10px 6px 8px' }}></div>
          <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.16em', color: 'rgba(196,163,255,.5)', padding: '0 12px 6px' }}>ADMIN</div>
          {[['fadmin', 'Catálogo Franquia', 'M4 6h16M4 12h10M4 18h7']].map(([k, label, d]) => {
            const on = k === active;
            return <div key={k} onClick={() => window.__go && window.__go(k)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 11, background: on ? T.accent : 'transparent', color: on ? '#fff' : 'rgba(246,241,251,.62)', fontFamily: DISP, fontWeight: on ? 600 : 500, fontSize: 14.5, cursor: 'pointer' }}><Ico d={d} size={20} c={on ? '#fff' : 'rgba(246,241,251,.62)'} />{label}<span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 9, fontWeight: 600, color: on ? T.darkBg : T.pill, background: on ? T.pill : 'rgba(196,163,255,.22)', padding: '2px 6px', borderRadius: 5 }}>ADM</span></div>;
          })}
        </React.Fragment>}
        {/* upgrade / status card */}
        <div style={{ marginTop: 'auto', background: T.surface, borderRadius: 14, padding: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: T.pill, letterSpacing: '0.06em' }}>ACESSO VITALÍCIO</div>
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.darkText, marginTop: 6 }}>Tudo liberado</div>
          <div style={{ fontFamily: DISP, fontSize: 12, color: 'rgba(246,241,251,.5)', marginTop: 2 }}>23 produtos no catálogo</div>
        </div>
        <div onClick={() => window.__go && window.__go('logout')} title="Sair da conta" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '8px 4px', borderRadius: 10, cursor: 'pointer' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 14 }}>C</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.darkText }}>Camila</div>
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: 'rgba(246,241,251,.45)' }}>franquia.ia/camila</div>
          </div>
          <Ico d={'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3 M10 17l5-5-5-5 M15 12H3'} size={17} c={'rgba(246,241,251,.5)'} />
        </div>
      </div>

      {/* main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: mobile ? '14px 16px' : '22px 32px', borderBottom: `1px solid ${T.line}`, background: 'rgba(255,255,255,.7)', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            {mobile && <div onClick={() => setDrawer(true)} style={{ width: 38, height: 38, borderRadius: 10, background: T.darkBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', cursor: 'pointer' }}><div style={{ width: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>{[0, 1, 2].map((i) => <div key={i} style={{ height: 2, background: '#fff', borderRadius: 2 }}></div>)}</div></div>}
            <div style={{ minWidth: 0 }}>
              {sub && <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: T.accentDeep, textTransform: 'uppercase' }}>{sub}</div>}
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: mobile ? 19 : 24, letterSpacing: '-0.03em', marginTop: sub ? 3 : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {!mobile && onSearch && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 10, padding: '9px 14px', width: 240 }}>
                <Ico d={IC.search} size={17} c={T.dim} />
                <input value={search || ''} onChange={(e) => onSearch(e.target.value)} placeholder={searchPlaceholder} style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: DISP, fontSize: 14, color: T.ink, width: '100%' }} />
              </div>
            )}
            {action}
          </div>
        </div>
        {/* content */}
        <div style={{ flex: 1, overflow: 'auto', padding: bleed ? 0 : (mobile ? 16 : 32), display: bleed ? 'flex' : 'block' }}>{children}</div>
      </div>
    </div>
  );
}

function DBtn({ children, icon, variant = 'solid', onClick }) {
  const s = variant === 'solid' ? { bg: T.accent, c: '#fff', b: 'none', sh: '0 8px 20px rgba(124,58,237,.35)' } : { bg: '#fff', c: T.accent, b: `1.5px solid ${T.accent}`, sh: 'none' };
  return (
    <div onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: s.bg, color: s.c, border: s.b, borderRadius: 11, padding: '11px 18px', fontFamily: DISP, fontWeight: 600, fontSize: 14.5, boxShadow: s.sh, cursor: onClick ? 'pointer' : 'default' }}>
      {icon && <Ico d={icon} size={18} c={s.c} />}{children}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────
function DDashboard() {
  const dmob = useIsMobile();
  const [period, setPeriod] = React.useState('30d');
  const [custom, setCustom] = React.useState(false);
  const [cFrom, setCFrom] = React.useState('2026-05-20');
  const [cTo, setCTo] = React.useState('2026-06-19');

  const DATA = {
    'hoje': {
      label: 'hoje', chartTitle: 'Vendas por hora', chartNote: 'hoje, por hora',
      metrics: [['Vendas · hoje', 'R$ 14.968', '+12%'], ['Comissão', '100%', 'sempre'], ['Produtos no ar', '8', '—'], ['Ticket médio', 'R$ 159', '+R$5']],
      bars: [22, 35, 48, 41, 67, 58, 79, 100], barLabels: ['8h', '10h', '12h', '13h', '15h', '17h', '18h', '19h'],
      rows: [['Renda com IA — Método', 'No ar', 'R$ 297', '20', 'R$ 5.940'], ['Reconquista 360', 'No ar', 'R$ 147', '28', 'R$ 4.116'], ['Modo Viral', 'No ar', 'R$ 97', '31', 'R$ 3.007'], ['Radar de Anúncios', 'No ar', 'R$ 127', '15', 'R$ 1.905']],
    },
    '7d': {
      label: '7 dias', chartTitle: 'Vendas por dia', chartNote: 'últimos 7 dias',
      metrics: [['Vendas · 7 dias', 'R$ 83.489', '+19%'], ['Comissão', '100%', 'sempre'], ['Produtos no ar', '8', '+1'], ['Ticket médio', 'R$ 158', '+R$6']],
      bars: [54, 62, 48, 71, 80, 67, 100], barLabels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      rows: [['Renda com IA — Método', 'No ar', 'R$ 297', '110', 'R$ 32.670'], ['Reconquista 360', 'No ar', 'R$ 147', '154', 'R$ 22.638'], ['Modo Viral', 'No ar', 'R$ 97', '174', 'R$ 16.878'], ['Radar de Anúncios', 'No ar', 'R$ 127', '89', 'R$ 11.303']],
    },
    '15d': {
      label: '15 dias', chartTitle: 'Vendas por dia', chartNote: 'últimos 15 dias',
      metrics: [['Vendas · 15 dias', 'R$ 177.677', '+21%'], ['Comissão', '100%', 'sempre'], ['Produtos no ar', '8', '+1'], ['Ticket médio', 'R$ 158', '+R$6']],
      bars: [40, 52, 47, 61, 55, 70, 64, 76, 72, 84, 80, 91, 88, 95, 100], barLabels: Array.from({length:15}, (_,i)=>`${i+1}`),
      rows: [['Renda com IA — Método', 'No ar', 'R$ 297', '235', 'R$ 69.795'], ['Reconquista 360', 'No ar', 'R$ 147', '326', 'R$ 47.922'], ['Modo Viral', 'No ar', 'R$ 97', '372', 'R$ 36.084'], ['Radar de Anúncios', 'No ar', 'R$ 127', '188', 'R$ 23.876']],
    },
    '30d': {
      label: '30 dias', chartTitle: 'Vendas por semana', chartNote: 'últimas 8 semanas',
      metrics: [['Vendas · 30 dias', 'R$ 349.743', '+24%'], ['Comissão', '100%', 'sempre'], ['Produtos no ar', '8', '+2'], ['Ticket médio', 'R$ 158', '+R$7']],
      bars: [34, 41, 52, 60, 71, 83, 92, 100], barLabels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
      rows: [['Renda com IA — Método', 'No ar', 'R$ 297', '462', 'R$ 137.214'], ['Reconquista 360', 'No ar', 'R$ 147', '640', 'R$ 94.080'], ['Modo Viral', 'No ar', 'R$ 97', '738', 'R$ 71.586'], ['Radar de Anúncios', 'No ar', 'R$ 127', '369', 'R$ 46.863']],
    },
  };
  DATA['custom'] = { ...DATA['30d'], label: 'personalizado', chartNote: `${cFrom.split('-').reverse().slice(0,2).join('/')} – ${cTo.split('-').reverse().slice(0,2).join('/')}`, metrics: [['Vendas · período', 'R$ 349.743', '+24%'], ...DATA['30d'].metrics.slice(1)] };

  const d = DATA[period];
  const metrics = d.metrics;
  const rows = d.rows;

  const periods = [['hoje', 'Hoje'], ['7d', '7 dias'], ['15d', '15 dias'], ['30d', '30 dias']];

  return (
    <DShell active="home" sub="Olá, Camila" title="Seu painel">
      {/* seletor de período */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap', position: 'relative' }}>
        <div style={{ display: 'inline-flex', background: '#fff', border: `1px solid ${T.line}`, borderRadius: 11, padding: 4, gap: 2 }}>
          {periods.map(([k, lbl]) => {
            const on = period === k;
            return <div key={k} onClick={() => { setPeriod(k); setCustom(false); }} style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, padding: '8px 15px', borderRadius: 8, cursor: 'pointer', background: on ? T.accent : 'transparent', color: on ? '#fff' : T.dim }}>{lbl}</div>;
          })}
        </div>
        <div onClick={() => { setPeriod('custom'); setCustom((c) => !c); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: DISP, fontWeight: 600, fontSize: 13.5, padding: '9px 15px', borderRadius: 11, cursor: 'pointer', background: period === 'custom' ? T.accent : '#fff', color: period === 'custom' ? '#fff' : T.dim, border: `1px solid ${period === 'custom' ? T.accent : T.line}` }}>
          <Ico d={IC.cal || 'M7 4v3M17 4v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z'} size={15} c={period === 'custom' ? '#fff' : T.dim} />{period === 'custom' && cFrom && cTo ? `${cFrom.split('-').reverse().slice(0,2).join('/')} – ${cTo.split('-').reverse().slice(0,2).join('/')}` : 'Personalizado'}
        </div>
        {custom && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: dmob ? 0 : 'auto', right: dmob ? 'auto' : 0, zIndex: 30, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, boxShadow: '0 16px 40px rgba(24,18,31,.16)', padding: 18, display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', color: T.dim, textTransform: 'uppercase', marginBottom: 6 }}>De</div>
              <input type="date" value={cFrom} onChange={(e) => setCFrom(e.target.value)} style={{ fontFamily: DISP, border: `1px solid ${T.line}`, borderRadius: 9, padding: '9px 11px', fontSize: 14, color: T.ink, outline: 'none' }} />
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', color: T.dim, textTransform: 'uppercase', marginBottom: 6 }}>Até</div>
              <input type="date" value={cTo} onChange={(e) => setCTo(e.target.value)} style={{ fontFamily: DISP, border: `1px solid ${T.line}`, borderRadius: 9, padding: '9px 11px', fontSize: 14, color: T.ink, outline: 'none' }} />
            </div>
            <div onClick={() => setCustom(false)} style={{ cursor: 'pointer' }}><DBtn icon={IC.check || 'M5 12.5l4.5 4.5L19 7'}>Aplicar</DBtn></div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: dmob ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16 }}>
        {metrics.map(([k, v, t], i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim, letterSpacing: '0.04em' }}>{k.toUpperCase()}</div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 23, letterSpacing: '-0.03em', marginTop: 8, whiteSpace: 'nowrap' }}>{v}</div>
            <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.accentDeep, marginTop: 4 }}>{t}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: dmob ? '1fr' : '1.6fr 1fr', gap: 16, marginTop: 16 }}>
        {/* chart */}
        <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16 }}>{d.chartTitle}</div>
            <div style={{ fontFamily: MONO, fontSize: 11.5, color: T.dim }}>{d.chartNote}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: d.bars.length > 10 ? 5 : 12, height: 150, marginTop: 22 }}>
            {d.bars.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'flex-end', height: '100%' }}>
                <div style={{ width: '100%', height: `${Math.round(h * 1.18)}px`, borderRadius: d.bars.length > 10 ? 4 : 7, background: i === d.bars.length - 1 ? T.accent : 'rgba(124,58,237,.18)' }}></div>
                <span style={{ fontFamily: MONO, fontSize: d.bars.length > 10 ? 8 : 9.5, color: T.dim }}>{d.barLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
        {/* IA suggestion */}
        <div style={{ background: T.ink, borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.16 }}><Mark size={150} front={T.accent} ghost={T.pill} inner={T.ink} /></div>
          <div style={{ position: 'relative', flex: 1 }}>
            <Ico d={IC.spark} size={22} c={T.pill} />
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 19, color: T.darkText, marginTop: 16, lineHeight: 1.25, letterSpacing: '-0.02em' }}>Seu “Renda com IA — Método” é o que mais vende.</div>
            <div style={{ fontFamily: DISP, fontSize: 13.5, color: 'rgba(246,241,251,.6)', marginTop: 10 }}>Gere uma versão para um novo público e dobre o alcance do que já funciona.</div>
          </div>
          <div style={{ position: 'relative', marginTop: 18 }}><DBtn icon={IC.arrow} onClick={() => window.__go && window.__go('generator')}>Gerar versão</DBtn></div>
        </div>
      </div>

      {/* table */}
      <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, marginTop: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr 1fr 0.8fr 1fr', padding: '14px 22px', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em', color: T.dim, borderBottom: `1px solid ${T.line}` }}>
          <span>PRODUTO</span><span>STATUS</span><span>PREÇO</span><span>VENDAS</span><span style={{ textAlign: 'right' }}>RECEITA</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr 1fr 0.8fr 1fr', padding: '14px 22px', alignItems: 'center', borderBottom: i < 3 ? `1px solid ${T.line}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mark size={16} /></div>
              <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14 }}>{r[0]}</span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, color: r[1] === 'No ar' ? '#0E9A50' : T.dim, background: r[1] === 'No ar' ? 'rgba(14,154,80,.1)' : 'rgba(24,18,31,.05)', padding: '4px 9px', borderRadius: 6, justifySelf: 'start' }}>{r[1].toUpperCase()}</span>
            <span style={{ fontFamily: DISP, fontSize: 14, color: T.ink }}>{r[2]}</span>
            <span style={{ fontFamily: DISP, fontSize: 14, color: T.dim }}>{r[3]}</span>
            <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: T.accent, textAlign: 'right' }}>{r[4]}</span>
          </div>
        ))}
      </div>
    </DShell>
  );
}

// ── Catálogo (duas seções: Franquia / Meus produtos) ──────────────
function DCatalogo() {
  const cmob = useIsMobile();
  const [tab, setTab] = React.useState('franquia');
  const [previewCourse, setPreviewCourse] = React.useState(null);
  const [sheetItem, setSheetItem] = React.useState(null);
  const [q, setQ] = React.useState('');
  const [, forceUpdate] = React.useState(0);

  // sync with shared franquia store
  React.useEffect(() => {
    const id = setInterval(() => {
      if (window.__franquiaProducts) forceUpdate((n) => n + 1);
    }, 300);
    return () => clearInterval(id);
  }, []);

  const rawFran = (window.__franquiaProducts || (typeof FRANQUIA_INIT !== 'undefined' ? FRANQUIA_INIT : []));
  const FRAN = rawFran.map((p) => ({ n: p.title, p: p.displayPrice || (p.access === 'Premium (upsell)' ? 'Premium' : 'R$ —'), c: p.color, id: p.id, raw: p, coverImg: typeof p.coverImg === 'string' ? p.coverImg : null }));
  const MEUS = [
    { n: 'Meu Curso de Copy', p: 'R$ 67', c: '#1F8A5B', status: 'No ar' }, { n: 'Pack de Reels Pro', p: 'R$ 47', c: '#3F6FD8', status: 'No ar' },
    { n: 'Planner Digital', p: 'R$ 37', c: '#A23CD6', status: 'Rascunho' },
  ];
  const coT = (c) => `linear-gradient(135deg, ${c}99 0%, ${c} 100%)`;
  const STRIP = 'repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 12px, rgba(255,255,255,0) 12px 24px)';
  const isF = tab === 'franquia';
  const listAll = isF ? FRAN : MEUS;
  const list = q.trim() ? listAll.filter((it) => (it.n || '').toLowerCase().includes(q.trim().toLowerCase())) : listAll;
  // monta um curso mínimo p/ o preview do app do aluno (Franquia = só visualizar)
  const toCourse = (it) => {
    const raw = it.raw;
    if (raw) return { id: raw.id, title: raw.title, subtitle: raw.subtitle || 'Produto da Franquia — pronto para vender', kind: raw.kind || 'Curso flagship', color: raw.color, coverImg: typeof raw.coverImg === 'string' ? raw.coverImg : null, students: raw.students || 0, banners: (raw.banners || []).filter(Boolean), modules: (raw.modules || []).map((m) => ({ ...m, coverImg: typeof m.cover === 'string' ? m.cover : null })) };
    return { id: it.id || 'prev', title: it.n, subtitle: 'Produto da Franquia — pronto para vender', kind: 'Curso flagship', color: it.c, students: 0, banners: [], modules: [
      { id: 'a', title: 'Módulo 1 · Fundamentos', lessons: [{ id: 'a1', title: 'Bem-vinda', type: 'video', duration: '8 min' }, { id: 'a2', title: 'Visão geral', type: 'video', duration: '11 min' }] },
      { id: 'b', title: 'Módulo 2 · Na prática', lessons: [{ id: 'b1', title: 'Primeiro passo', type: 'video', duration: '9 min' }] },
    ] };
  };

  const Capa = ({ c, img, children }) => (
    <div style={{ height: 120, borderRadius: 12, background: img ? `center/cover no-repeat url("${img}")` : coT(c), position: 'relative', overflow: 'hidden' }}>
      {!img && <div style={{ position: 'absolute', inset: 0, background: STRIP }}></div>}
      {!img && <div style={{ position: 'absolute', right: -10, bottom: -14, opacity: 0.25 }}><Mark size={70} front="#fff" ghost="#fff" inner="transparent" /></div>}
      {img && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.45))' }}></div>}
      {children}
    </div>
  );

  return (
    <DShell active="cat" sub="Catálogo" title="Catálogo" search={q} onSearch={setQ} searchPlaceholder="Buscar produto…">
      {/* abas */}
      <div style={{ display: 'flex', gap: 6, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 12, padding: 5, width: 'fit-content' }}>
        {[['franquia', 'Produtos da Franquia', FRAN.length], ['meus', 'Meus produtos', MEUS.length]].map(([k, label, n]) => {
          const on = tab === k;
          return <div key={k} onClick={() => setTab(k)} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: DISP, fontWeight: 600, fontSize: 14, padding: '9px 18px', borderRadius: 9, cursor: 'pointer', background: on ? T.ink : 'transparent', color: on ? '#fff' : T.dim }}>{label}<span style={{ fontFamily: MONO, fontSize: 11, opacity: 0.7 }}>{n}</span></div>;
        })}
      </div>

      {/* microcópia de ação por aba */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '16px 0 18px', fontFamily: DISP, fontSize: 13.5, color: T.dim }}>
        {isF
          ? <><Ico d={'M6 10V7a6 6 0 0 1 12 0v3 M5 10h14v11H5z'} size={15} c={T.accentDeep} />Conteúdo mantido pela Franquia — você <b style={{ color: T.ink, fontWeight: 600 }}>visualiza e vende</b>, não edita.</>
          : <><Ico d={AIC.pencil} size={15} c={'#1F8A5B'} />Seus produtos — <b style={{ color: T.ink, fontWeight: 600 }}>edite</b> conteúdo, módulos e aulas livremente.</>}
      </div>

      {/* grid */}
      <div style={{ display: 'grid', gridTemplateColumns: cmob ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16, alignContent: 'start' }}>
        {list.map((it, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 14 }}>
            <Capa c={it.c} img={it.coverImg}>
              {isF
                ? <span style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={IC.search} size={14} c={it.c} /></span>
                : <span style={{ position: 'absolute', top: 10, right: 10, fontFamily: MONO, fontSize: 9, fontWeight: 600, color: it.status === 'No ar' ? '#0E9A50' : T.accentDeep, background: it.status === 'No ar' ? 'rgba(14,154,80,.16)' : 'rgba(124,58,237,.12)', padding: '4px 8px', borderRadius: 6 }}>{(it.status || '').toUpperCase()}</span>}
            </Capa>
            <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15, marginTop: 12 }}>{it.n}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: it.c }}>{it.p}</span>
              <span onClick={() => isF ? setSheetItem(it) : (window.__go && window.__go('manual'))} style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 600, color: T.dim, cursor: 'pointer' }}>{isF ? 'Abrir →' : 'Editar →'}</span>
            </div>
          </div>
        ))}
        {!isF && (
          <div onClick={() => window.__go && window.__go('gen')} style={{ border: `1.5px dashed ${T.line}`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 200, color: T.accent, cursor: 'pointer' }}>
            <Ico d={AIC.plus} size={24} c={T.accent} /><span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14 }}>Criar produto</span>
          </div>
        )}
      </div>
      {previewCourse && <PhonePreview open={true} onClose={() => setPreviewCourse(null)} courses={[previewCourse]} />}
      {sheetItem && <MaterialsSheet item={sheetItem} course={toCourse(sheetItem)} onClose={() => setSheetItem(null)} />}
    </DShell>
  );
}

export { DShell, DBtn, DDashboard, DCatalogo };
