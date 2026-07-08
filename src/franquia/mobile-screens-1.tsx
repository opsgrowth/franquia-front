import React from 'react';
import { Perfil } from './co-tabs';
import { IOSDevice } from './ios-frame';
import { DISP, MONO, Mark, T, Wordmark } from './kit';

// Ferramenta FranquIA · telas mobile. Reusa T/DISP/MONO/Mark/Wordmark do manual-kit.
// Cada componente é o CONTEÚDO de uma tela, para ir dentro de <IOSDevice> (sem title).

const SThin = { fontFamily: DISP };

// ── tiny line icons ───────────────────────────────────────────────
function Ico({ d, size = 22, c = 'currentColor', fill = 'none', sw = 1.9 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  grid: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  chart: ['M4 20V4', 'M4 20h16', 'M8 16v-4M12 16V8M16 16v-7'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'M21 21l-4.3-4.3'],
  spark: ['M12 3l1.8 4.9L19 9.6l-4.4 2.3L12 17l-2.6-5.1L5 9.6l5.2-1.7z'],
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6z',
  link: ['M9 15l6-6', 'M10 6l1-1a4 4 0 0 1 6 6l-1 1', 'M14 18l-1 1a4 4 0 0 1-6-6l1-1'],
  share: ['M12 3v12', 'M8 7l4-4 4 4', 'M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6'],
  check: 'M5 12.5l4.5 4.5L19 7',
  arrow: 'M5 12h14M13 5l7 7-7 7',
  copy: ['M9 9h10v10H9z', 'M5 15V5h10'],
  cfg: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M19.14 12.94a7.49 7.49 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.3 7.3 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.58.24-1.12.55-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.49 7.49 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.39 1.04.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.58-.24 1.12-.55 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64Z'],
};

// ── shared chrome ─────────────────────────────────────────────────
function Screen({ children, bg = T.paper }) {
  return <div style={{ height: '100%', background: bg, display: 'flex', flexDirection: 'column', fontFamily: DISP, color: T.ink }}>{children}</div>;
}
function Head({ children, sub, right, pad = '58px 20px 14px' }) {
  return (
    <div style={{ padding: pad, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
      <div>
        {sub && <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.08em', color: T.accentDeep, textTransform: 'uppercase' }}>{sub}</div>}
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 27, letterSpacing: '-0.03em', marginTop: sub ? 4 : 0 }}>{children}</div>
      </div>
      {right}
    </div>
  );
}
function TabBar({ active = 'home' }) {
  const tabs = [['home', 'Início', IC.home], ['grid', 'Catálogo', IC.grid], ['gen', 'Gerar', IC.spark], ['chart', 'Vendas', IC.chart], ['user', 'Perfil', IC.user]];
  return (
    <div style={{ marginTop: 'auto', paddingBottom: 26, paddingTop: 10, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${T.line}`, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
      {tabs.map(([k, label, d]) => {
        const on = k === active;
        if (k === 'gen') {
          return (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transform: 'translateY(-6px)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 17, background: T.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(124,58,237,.45)' }}><Ico d={d} size={26} fill={on ? '#fff' : 'none'} /></div>
            </div>
          );
        }
        return (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, color: on ? T.accent : 'rgba(24,18,31,.4)' }}>
            <Ico d={d} size={23} />
            <span style={{ fontFamily: DISP, fontSize: 10.5, fontWeight: on ? 600 : 500 }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
function PrimaryBtn({ children, icon }) {
  return (
    <div style={{ background: T.accent, color: '#fff', borderRadius: 14, padding: '15px 20px', fontFamily: DISP, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 10px 26px rgba(124,58,237,.4)' }}>
      {icon && <Ico d={icon} size={20} fill="none" />}{children}
    </div>
  );
}

// ── 1 · Onboarding ────────────────────────────────────────────────
function SOnboarding() {
  return (
    <Screen bg={T.darkBg}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '62px 30px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -60, top: 80, opacity: 0.5 }}>
          <div style={{ position: 'absolute', right: 50, width: 180, height: 180, borderRadius: 24, background: T.accent, opacity: 0.12 }}></div>
          <div style={{ position: 'absolute', right: 10, top: 50, width: 120, height: 120, borderRadius: 16, background: T.accent, opacity: 0.18 }}></div>
        </div>
        <div style={{ position: 'relative' }}>
          <Mark size={64} front={T.accent} ghost={T.pill} inner={T.darkBg} />
          <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.035em', lineHeight: 1.08, color: T.darkText, margin: '24px 0 0' }}>
            Bem-vinda à<br />sua <span style={{ color: T.pill }}>franquia</span>.
          </h1>
          <p style={{ fontFamily: DISP, fontSize: 16, lineHeight: 1.55, color: 'rgba(246,241,251,.6)', margin: '16px 0 0' }}>
            Seu catálogo já está pronto. Em 3 passos você publica seu primeiro produto e começa a vender.
          </p>
          <div style={{ marginTop: 30 }}>
            {[
              ['Escolher', 'Pegue um produto que já vende'],
              ['Personalizar com IA', 'Gere sua versão em segundos'],
              ['Publicar', 'No ar — 100% da venda é sua'],
            ].map(([s, d], i) => (
              <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < 2 ? 4 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flex: '0 0 auto', background: 'rgba(124,58,237,.16)', border: '1px solid rgba(196,163,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 15, color: T.pill }}>{i + 1}</div>
                  {i < 2 && <div style={{ width: 2, flex: 1, minHeight: 22, background: 'linear-gradient(rgba(196,163,255,.45), rgba(196,163,255,.12))' }}></div>}
                </div>
                <div style={{ paddingTop: 6 }}>
                  <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 16, color: T.darkText, letterSpacing: '-0.01em' }}>{s}</div>
                  <div style={{ fontFamily: DISP, fontSize: 13, color: 'rgba(246,241,251,.55)', marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '0 24px 50px' }}>
        <PrimaryBtn icon={IC.arrow}>Começar agora</PrimaryBtn>
        <div style={{ textAlign: 'center', fontFamily: DISP, fontSize: 13.5, color: 'rgba(246,241,251,.5)', marginTop: 16 }}>Já tenho conta · Entrar</div>
      </div>
    </Screen>
  );
}

// ── 2 · Dashboard ─────────────────────────────────────────────────
function SHome() {
  return (
    <Screen>
      <Head sub="Olá, Camila" right={<div style={{ width: 40, height: 40, borderRadius: '50%', background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accentDeep, fontWeight: 700, fontFamily: DISP }}>C</div>}>Seu painel</Head>
      <div style={{ flex: 1, overflow: 'hidden', padding: '4px 20px 0' }}>
        {/* hero metric */}
        <div style={{ background: T.ink, borderRadius: 20, padding: 22, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -20, opacity: 0.16 }}><Mark size={130} front={T.accent} ghost={T.pill} inner={T.ink} /></div>
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: T.pill }}>VENDAS · ÚLTIMOS 30 DIAS</div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 38, letterSpacing: '-0.03em', color: '#fff', marginTop: 8 }}>R$ 4.218</div>
            <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
              {[['Comissão', '100%'], ['Vendas', '34'], ['Ticket méd.', 'R$124']].map(([k, v], i) => (
                <div key={i}>
                  <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'rgba(246,241,251,.5)' }}>{k}</div>
                  <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15, color: '#fff', marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* quick action */}
        <div style={{ marginTop: 16 }}><PrimaryBtn icon={IC.spark}>Gerar nova versão com IA</PrimaryBtn></div>
        {/* recent */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '24px 0 12px' }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 17 }}>Seus produtos no ar</div>
          <div style={{ fontFamily: DISP, fontSize: 13, color: T.accent, fontWeight: 600 }}>Ver tudo</div>
        </div>
        {[['E-book · Renda com IA', 'R$ 97', '12 vendas'], ['Combo Mentoria', 'R$ 197', '7 vendas'], ['Template Premium', 'R$ 67', '15 vendas']].map(([n, p, s], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: 13, marginBottom: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mark size={20} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14.5 }}>{n}</div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 2 }}>{s}</div>
            </div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15, color: T.accent }}>{p}</div>
          </div>
        ))}
      </div>
      <TabBar active="home" />
    </Screen>
  );
}

// ── 3 · Catálogo ──────────────────────────────────────────────────
function SCatalogo() {
  const items = [
    ['E-book · Renda com IA', 'R$ 97', 'No ar', true],
    ['Combo Mentoria 1:1', 'R$ 197', 'No ar', true],
    ['Template Premium', 'R$ 67', 'No ar', true],
    ['Masterclass Tráfego', 'R$ 147', 'Validado', false],
    ['Pack de Reels', 'R$ 47', 'Validado', false],
    ['Planner Digital', 'R$ 37', 'Validado', false],
  ];
  return (
    <Screen>
      <Head sub="23 produtos validados">Catálogo</Head>
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 12, padding: '11px 14px', color: T.dim }}>
          <Ico d={IC.search} size={18} c={T.dim} /><span style={{ fontFamily: DISP, fontSize: 14.5 }}>Buscar no catálogo</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {['Todos', 'No ar', 'Validados'].map((c, i) => (
            <div key={i} style={{ fontFamily: DISP, fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 99, background: i === 0 ? T.ink : '#fff', color: i === 0 ? '#fff' : T.dim, border: `1px solid ${i === 0 ? T.ink : T.line}` }}>{c}</div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
        {items.map(([n, p, st, live], i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 12 }}>
            <div style={{ height: 78, borderRadius: 10, background: i % 2 ? T.ink : T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Mark size={30} front={i % 2 ? T.accent : T.accent} ghost={i % 2 ? T.pill : T.accent} inner={i % 2 ? T.ink : T.halo} />
              <span style={{ position: 'absolute', top: 7, right: 7, fontFamily: MONO, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.04em', color: live ? '#0E9A50' : T.accentDeep, background: live ? 'rgba(14,154,80,.12)' : 'rgba(124,58,237,.1)', padding: '3px 6px', borderRadius: 5 }}>{st.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, marginTop: 10, lineHeight: 1.25 }}>{n}</div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15, color: T.accent, marginTop: 4 }}>{p}</div>
          </div>
        ))}
      </div>
      <TabBar active="grid" />
    </Screen>
  );
}

export { Ico, IC, Screen, Head, TabBar, PrimaryBtn, SOnboarding, SHome, SCatalogo };
