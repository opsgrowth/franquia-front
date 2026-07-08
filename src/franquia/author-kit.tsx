import React from 'react';
import { Cover } from './author-app';
import { DISP, IC, Ico, Lockup, MONO, Mark, T, useIsMobile } from './kit';

// Ferramenta FranquIA · Autoria — kit compartilhado (protótipo)
// Reusa T/DISP/MONO/Mark/Lockup (manual-kit.jsx) e Ico/IC (mobile-screens-1.jsx).

// ── ícones extras p/ autoria (24×24 stroke) ───────────────────────
const AIC = {
  play: 'M7 5l12 7-12 7z',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  plus: ['M12 5v14', 'M5 12h14'],
  chevron: 'M6 9l6 6 6-6',
  upload: ['M12 15V4', 'M8 8l4-4 4 4', 'M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3'],
  paragraph: ['M5 6h14', 'M5 11h14', 'M5 16h9'],
  quote: ['M9 7H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-3', 'M20 7h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-3'],
  list: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4.5 6h.01', 'M4.5 12h.01', 'M4.5 18h.01'],
  image: ['M4 5h16v14H4z', 'M4 16l4.5-4.5 3 3 4-4L20 14'],
  pencil: ['M4 20h4L19 9l-4-4L4 16z'],
  grip: ['M9 6h.01', 'M9 12h.01', 'M9 18h.01', 'M15 6h.01', 'M15 12h.01', 'M15 18h.01'],
  trash: ['M4 7h16', 'M9 7V5h6v2', 'M6 7l1 13h10l1-13'],
  text: ['M6 5h12', 'M12 5v14'],
  video: 'M4 6h11v12H4z M15 10l5-3v10l-5-3z',
};

// ── Sidebar (escura, idêntica à do app) ───────────────────────────
function ASidebar({ active = 'gen' }) {
  const nav = [['home', 'Início', IC.home], ['cat', 'Catálogo', IC.grid], ['gen', 'Estúdio', IC.spark], ['sales', 'Vendas', IC.chart], ['cfg', 'Configurações', IC.cfg]];
  return (
    <div style={{ width: 248, flex: '0 0 auto', background: T.darkBg, display: 'flex', flexDirection: 'column', padding: '26px 18px' }}>
      <div style={{ padding: '0 8px 8px' }}>
        <Lockup scale={0.46} color={T.darkText} ia={T.pill} front={T.accent} ghost={T.pill} inner={T.darkBg} />
      </div>
      <div style={{ height: 1, background: 'rgba(196,163,255,.14)', margin: '18px 6px' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {nav.map(([k, label, d]) => {
          const on = k === active;
          const fg = on ? '#fff' : 'rgba(246,241,251,.62)';
          return (
            <div key={k} onClick={() => window.__go && window.__go(k)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 11, background: on ? T.accent : 'transparent', color: fg, fontFamily: DISP, fontWeight: on ? 600 : 500, fontSize: 14.5, cursor: 'pointer' }}>
              {d ? <Ico d={d} size={20} c={fg} /> : <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 16, height: 16, borderRadius: 5, border: `1.8px solid ${fg}` }}></div></div>}
              {label}
              {k === 'gen' && <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 9, fontWeight: 600, color: on ? '#fff' : T.pill, background: on ? 'rgba(255,255,255,.2)' : 'rgba(196,163,255,.16)', padding: '2px 6px', borderRadius: 5 }}>IA</span>}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', background: T.surface, borderRadius: 14, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: T.pill, letterSpacing: '0.06em' }}>ACESSO VITALÍCIO</div>
        <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.darkText, marginTop: 6 }}>Tudo liberado</div>
        <div style={{ fontFamily: DISP, fontSize: 12, color: 'rgba(246,241,251,.5)', marginTop: 2 }}>3 cursos no catálogo</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '0 4px' }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 14 }}>C</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.darkText }}>Camila</div>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: 'rgba(246,241,251,.45)' }}>franquia.ia/camila</div>
        </div>
      </div>
    </div>
  );
}

// botões
function ABtn({ children, icon, variant = 'solid', size = 'md', onClick }) {
  const pad = size === 'sm' ? '8px 14px' : '11px 18px';
  const fs = size === 'sm' ? 13.5 : 14.5;
  const map = {
    solid: { bg: T.accent, c: '#fff', b: 'none', sh: '0 8px 20px rgba(124,58,237,.32)' },
    outline: { bg: '#fff', c: T.accent, b: `1.5px solid ${T.accent}`, sh: 'none' },
    soft: { bg: T.halo, c: T.accentDeep, b: 'none', sh: 'none' },
    ghost: { bg: 'transparent', c: T.dim, b: `1px solid ${T.line}`, sh: 'none' },
  }[variant];
  return (
    <div onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: map.bg, color: map.c, border: map.b, borderRadius: 10, padding: pad, fontFamily: DISP, fontWeight: 600, fontSize: fs, boxShadow: map.sh, whiteSpace: 'nowrap', cursor: onClick ? 'pointer' : 'default' }}>
      {icon && <Ico d={icon} size={17} c={map.c} fill="none" />}{children}
    </div>
  );
}

// "select" estilizado (curso)
function ASelect({ value }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 10, padding: '9px 13px', fontFamily: DISP, fontSize: 14, color: T.ink, minWidth: 180, justifyContent: 'space-between' }}>
      {value}<Ico d={AIC.chevron} size={16} c={T.dim} />
    </div>
  );
}

// ── Shell de autoria ──────────────────────────────────────────────
// topbar = sub + title (esq) · curso + Novo curso + sair (dir)
// toolbar = faixa opcional abaixo do topbar (ex.: botão Testar)
// bleed = conteúdo sem padding (colunas full-height)
function AuthorShell({ active = 'gen', sub, title, courseName = 'Curso Demo', toolbar, bleed = false, plain = false, children }) {
  const mobile = useIsMobile();
  const [drawer, setDrawer] = React.useState(false);
  return (
    <div style={{ display: 'flex', height: '100%', background: T.paper, fontFamily: DISP, color: T.ink, overflow: 'hidden' }}>
      {!mobile && <ASidebar active={active} />}
      {/* drawer mobile */}
      {mobile && drawer && (
        <div onClick={() => setDrawer(false)} style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(20,16,25,.5)', display: 'flex' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ height: '100%' }}><ASidebar active={active} /></div>
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: mobile ? '14px 16px' : '20px 30px', borderBottom: `1px solid ${T.line}`, background: 'rgba(255,255,255,.6)', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            {mobile && (
              <div onClick={() => setDrawer(true)} style={{ width: 38, height: 38, borderRadius: 10, background: T.darkBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', cursor: 'pointer' }}>
                <div style={{ width: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>{[0, 1, 2].map((i) => <div key={i} style={{ height: 2, background: '#fff', borderRadius: 2 }}></div>)}</div>
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              {sub && <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', color: T.accentDeep, textTransform: 'uppercase' }}>{sub}</div>}
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: mobile ? 19 : 23, letterSpacing: '-0.03em', marginTop: sub ? 3 : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
            </div>
          </div>
          {!mobile && !plain && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', color: T.dim, textTransform: 'uppercase' }}>Curso</span>
              <ASelect value={courseName} />
              <ABtn icon={AIC.plus}>Novo curso</ABtn>
              <span style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim, fontWeight: 500 }}>sair</span>
            </div>
          )}
          {mobile && !plain && <div onClick={() => window.__go && window.__go('gen')} style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', cursor: 'pointer' }}><Ico d={AIC.plus} size={19} c="#fff" /></div>}
        </div>
        {/* toolbar opcional */}
        {toolbar && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: mobile ? '10px 16px' : '12px 30px', borderBottom: `1px solid ${T.line}`, background: 'rgba(255,255,255,.35)', flexWrap: 'wrap' }}>
            {toolbar}
          </div>
        )}
        {/* conteúdo */}
        <div style={{ flex: 1, minHeight: 0, overflowX: mobile ? 'hidden' : 'auto', overflowY: mobile ? 'auto' : 'hidden', padding: bleed ? 0 : (mobile ? 16 : 30), display: 'flex', flexDirection: mobile ? 'column' : 'row' }}>{children}</div>
      </div>
    </div>
  );
}

// ── Blocos de conteúdo (reuso Tela 1 + Tela 3) ────────────────────
function PageNote({ n }) {
  return <div style={{ width: 34, flex: '0 0 auto', fontFamily: MONO, fontSize: 11, color: 'rgba(24,18,31,.35)', paddingTop: 6, textAlign: 'right', marginRight: 16 }}>{n ? `p. ${n}` : ''}</div>;
}

function BlockHeading({ children, note }) {
  return (
    <div style={{ display: 'flex', marginTop: 30 }}>
      <PageNote n={note} />
      <h2 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 27, letterSpacing: '-0.03em', color: T.ink, margin: 0, lineHeight: 1.15 }}>{children}</h2>
    </div>
  );
}

function BlockParagraph({ children, note }) {
  return (
    <div style={{ display: 'flex', marginTop: 16 }}>
      <PageNote n={note} />
      <p style={{ fontFamily: DISP, fontSize: 16.5, lineHeight: 1.7, color: 'rgba(24,18,31,.78)', margin: 0, maxWidth: 600 }}>{children}</p>
    </div>
  );
}

function BlockList({ items, note }) {
  return (
    <div style={{ display: 'flex', marginTop: 16 }}>
      <PageNote n={note} />
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => (
          <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: DISP, fontSize: 16.5, lineHeight: 1.5, color: 'rgba(24,18,31,.78)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.accent, marginTop: 9, flex: '0 0 auto' }}></span>{it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlockQuote({ children, cite, note }) {
  return (
    <div style={{ display: 'flex', marginTop: 22 }}>
      <PageNote n={note} />
      <div style={{ borderLeft: `3px solid ${T.accent}`, paddingLeft: 20 }}>
        <div style={{ fontFamily: DISP, fontWeight: 500, fontSize: 21, lineHeight: 1.4, letterSpacing: '-0.01em', color: T.ink }}>{children}</div>
        {cite && <div style={{ fontFamily: MONO, fontSize: 12, color: T.dim, marginTop: 10 }}>{cite}</div>}
      </div>
    </div>
  );
}

function BlockVideo({ title, meta, hint, warn, note }) {
  return (
    <div style={{ display: 'flex', marginTop: 22 }}>
      <PageNote n={note} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: 16, flex: 1, maxWidth: 600, minWidth: 0 }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Ico d={AIC.play} size={22} c={T.accent} fill={T.accent} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15.5, color: warn ? T.warning : T.ink }}>{title}</div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: T.dim, marginTop: 3 }}>{meta}</div>
          {hint && <div style={{ fontFamily: DISP, fontSize: 12.5, color: 'rgba(24,18,31,.45)', marginTop: 4 }}>{hint}</div>}
        </div>
      </div>
    </div>
  );
}

// badge de estado (rascunho IA, etc.)
function DraftBadge({ children = 'rascunho IA', tone = 'warn' }) {
  const c = tone === 'ok'
    ? { fg: '#0E7A40', bg: 'rgba(14,154,80,.14)', dot: T.success }
    : tone === 'accent'
    ? { fg: T.accentDeep, bg: 'rgba(124,58,237,.1)', dot: T.accent }
    : { fg: '#9A6A12', bg: 'rgba(226,163,61,.16)', dot: T.warning };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.02em', color: c.fg, background: c.bg, padding: '5px 11px', borderRadius: 99 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }}></span>{children}
    </span>
  );
}

// picker de capa (gradientes + enviar imagem)
function CoverField({ value, onPick, h = 88, radius = 12, label, title }) {
  const [open, setOpen] = React.useState(false);
  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { onPick(r.result); setOpen(false); };
    r.readAsDataURL(f);
  };
  return (
    <div style={{ position: 'relative' }}>
      <div onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }} style={{ position: 'relative', cursor: 'pointer' }}>
        <Cover seed={value} h={h} radius={radius} label={label} title={title} />
        {h <= 46 ? (
          <span style={{ position: 'absolute', bottom: 3, right: 3, width: 16, height: 16, borderRadius: 5, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={AIC.image} size={10} c="#fff" /></span>
        ) : (
          <span style={{ position: 'absolute', top: 8, right: 8, display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DISP, fontWeight: 600, fontSize: 10.5, color: '#fff', background: 'rgba(0,0,0,.45)', padding: '4px 8px', borderRadius: 7 }}><Ico d={AIC.image} size={12} c="#fff" />{value == null ? 'adicionar capa' : 'trocar'}</span>
        )}
      </div>
      {open && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 40, width: 236, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, boxShadow: '0 16px 40px rgba(24,18,31,.18)', padding: 14 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', color: T.dim, textTransform: 'uppercase', marginBottom: 10 }}>Escolher capa</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} onClick={() => { onPick(i); setOpen(false); }} style={{ borderRadius: 8, cursor: 'pointer', boxShadow: value === i ? `0 0 0 2px #fff, 0 0 0 4px ${T.accent}` : 'none' }}><Cover seed={i} h={40} radius={8} /></div>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, border: `1.5px dashed rgba(124,58,237,.35)`, borderRadius: 10, padding: '10px', fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.accent, cursor: 'pointer' }}>
            <Ico d={AIC.upload} size={16} c={T.accent} />Enviar imagem
            <input type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
          </label>
        </div>
      )}
    </div>
  );
}

export { AIC, ASidebar, ABtn, ASelect, AuthorShell, PageNote, BlockHeading, BlockParagraph, BlockList, BlockQuote, BlockVideo, DraftBadge, CoverField };
