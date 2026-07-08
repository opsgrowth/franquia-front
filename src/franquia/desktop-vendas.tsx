import React from 'react';
import { AIC } from './author-kit';
import { DShell } from './desktop-screens-1';
import { DISP, IC, Ico, MONO, T, useIsMobile } from './kit';

// Tela: Vendas — transações por webhook das plataformas (Digistore/Kiwify/Hotmart…).
// Reusa T/DISP/MONO/Ico/IC/AIC + DShell (desktop-screens-1).

function DVendas() {
  const vmob = useIsMobile();
  const [range, setRange] = React.useState('30d');
  const [plat, setPlat] = React.useState('Todas');

  // API: GET /sales?range=&platform=  → cada venda chega por webhook e libera o acesso
  const SALES = [
    { id: '#A92F', prod: 'Renda com IA — Método', buyer: 'marina.souza@email.com', plat: 'Kiwify', value: 'R$ 297', net: 'R$ 268', status: 'Acesso liberado', when: 'há 8 min', color: '#7C3AED' },
    { id: '#A92E', prod: 'Mentoria Alto Ticket', buyer: 'rafael.dias@email.com', plat: 'Hotmart', value: 'R$ 2.997', net: 'R$ 2.667', status: 'Acesso liberado', when: 'há 41 min', color: '#A23CD6' },
    { id: '#A92D', prod: 'Tráfego do Zero', buyer: 'lucas.f@email.com', plat: 'Digistore24', value: 'R$ 147', net: 'R$ 131', status: 'Pendente', when: 'há 1 h', color: '#5246E5' },
    { id: '#A92C', prod: 'Renda com IA — Método', buyer: 'paula.m@email.com', plat: 'Kiwify', value: 'R$ 297', net: 'R$ 268', status: 'Acesso liberado', when: 'há 2 h', color: '#7C3AED' },
    { id: '#A92B', prod: 'Marca que Posiciona', buyer: 'caio.r@email.com', plat: 'Hotmart', value: 'R$ 197', net: 'R$ 175', status: 'Reembolso', when: 'há 5 h', color: '#5246E5' },
    { id: '#A92A', prod: 'Closer de Alto Ticket', buyer: 'bia.nunes@email.com', plat: 'Digistore24', value: 'R$ 497', net: 'R$ 442', status: 'Acesso liberado', when: 'ontem', color: '#6429C9' },
    { id: '#A929', prod: 'Copy que Vende', buyer: 'tiago.s@email.com', plat: 'Kiwify', value: 'R$ 127', net: 'R$ 114', status: 'Acesso liberado', when: 'ontem', color: '#B5468A' },
  ];
  const metrics = [['Receita · 30 dias', 'R$ 18.420', '+22%'], ['Vendas', '64', '+11'], ['Ticket médio', 'R$ 288', '+R$24'], ['Reembolsos', '1,8%', '−0,4%']];
  const STAT = {
    'Acesso liberado': { fg: '#0E7A40', bg: 'rgba(14,154,80,.14)', dot: '#0E9A50' },
    'Pendente': { fg: '#9A6A12', bg: 'rgba(226,163,61,.16)', dot: T.warning },
    'Reembolso': { fg: '#B23A2E', bg: 'rgba(226,80,47,.12)', dot: '#E2502F' },
  };
  const ranges = [['7d', '7 dias'], ['30d', '30 dias'], ['90d', '90 dias']];
  const plats = ['Todas', 'Digistore24', 'Kiwify', 'Hotmart'];
  const rows = SALES.filter((s) => plat === 'Todas' || s.plat === plat);

  const Pill = ({ on, children, onClick }) => (
    <div onClick={onClick} style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, padding: '8px 15px', borderRadius: 99, cursor: 'pointer', background: on ? T.ink : '#fff', color: on ? '#fff' : T.dim, border: `1px solid ${on ? T.ink : T.line}`, whiteSpace: 'nowrap' }}>{children}</div>
  );

  const COLS = '1.1fr 2.2fr 1fr 0.9fr 1.2fr 0.7fr';

  return (
    <DShell active="sales" sub="Vendas" title="Vendas"
      action={<div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 10, padding: '10px 16px', fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink, cursor: 'pointer' }}><Ico d={'M12 15V4 M8 8l4-4 4 4 M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3'} size={16} c={T.ink} />Exportar CSV</div>}>
      {/* métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: vmob ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16 }}>
        {metrics.map(([k, v, d], i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim, letterSpacing: '0.04em' }}>{k.toUpperCase()}</div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 27, letterSpacing: '-0.03em', marginTop: 8 }}>{v}</div>
            <div style={{ fontFamily: DISP, fontSize: 12.5, color: i === 3 ? '#0E9A50' : T.accentDeep, marginTop: 4 }}>{d}</div>
          </div>
        ))}
      </div>

      {/* filtros */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, margin: '22px 0 14px' }}>
        <div style={{ display: 'flex', gap: 8 }}>{ranges.map(([k, l]) => <Pill key={k} on={range === k} onClick={() => setRange(k)}>{l}</Pill>)}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim, letterSpacing: '0.08em' }}>PLATAFORMA</span>
          {plats.map((p) => <Pill key={p} on={plat === p} onClick={() => setPlat(p)}>{p}</Pill>)}
        </div>
      </div>

      {/* tabela */}
      <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
        {!vmob && (
          <div style={{ display: 'grid', gridTemplateColumns: COLS, padding: '14px 22px', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em', color: T.dim, borderBottom: `1px solid ${T.line}` }}>
            <span>VENDA</span><span>PRODUTO · COMPRADOR</span><span>PLATAFORMA</span><span>VALOR</span><span>ACESSO</span><span style={{ textAlign: 'right' }}>QUANDO</span>
          </div>
        )}
        {rows.map((s, i) => {
          const st = STAT[s.status];
          if (vmob) return (
            <div key={s.id} style={{ padding: '14px 16px', borderBottom: i < rows.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink }}>{s.prod}</span>
                <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: s.color }}>{s.value}</span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 11.5, color: T.dim, marginTop: 3 }}>{s.buyer} · {s.plat}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, color: st.fg, background: st.bg, padding: '4px 9px', borderRadius: 6 }}>{s.status}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: T.dim }}>{s.when}</span>
              </div>
            </div>
          );
          return (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', padding: '14px 22px', borderBottom: i < rows.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <span style={{ fontFamily: MONO, fontSize: 12.5, color: T.dim }}>{s.id}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.prod}</div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.buyer}</div>
              </div>
              <span style={{ fontFamily: DISP, fontSize: 13.5, color: T.ink }}>{s.plat}</span>
              <div>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim }}>líq. {s.net}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 11, fontWeight: 600, color: st.fg, background: st.bg, padding: '5px 10px', borderRadius: 7, justifySelf: 'start' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }}></span>{s.status}</span>
              <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.dim, textAlign: 'right' }}>{s.when}</span>
            </div>
          );
        })}
      </div>

      {/* nota webhook */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, fontFamily: DISP, fontSize: 12.5, color: T.dim }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0E9A50' }}></span>
        Webhooks conectados — cada venda aprovada libera o acesso automaticamente pelo ID configurado no produto.
      </div>
    </DShell>
  );
}

export { DVendas };
