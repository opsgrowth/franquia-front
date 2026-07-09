import React from 'react';
import { AIC } from './author-kit';
import { DShell } from './desktop-screens-1';
import { DISP, IC, Ico, MONO, T, useIsMobile } from './kit';

// Tela: Vendas — transações por webhook das plataformas (Digistore/Kiwify/Hotmart…).
// Reusa T/DISP/MONO/Ico/IC/AIC + DShell (desktop-screens-1).

function DVendas() {
  const vmob = useIsMobile();
  const [range, setRange] = React.useState('hoje');
  const [plat, setPlat] = React.useState('Todas');

  // API: GET /sales?range=&platform=  → cada venda chega por webhook e libera o acesso
  // d = janela: 0 = hoje. Produtos batem com os de maior receita no Início.
  const SALES = [
    { id: '#B417', d: 0, prod: 'Renda com IA — Método', buyer: 'marinasouza91@gmail.com', plat: 'Kiwify', value: 'R$ 297', net: 'R$ 268', status: 'Acesso liberado', when: 'há 2 min', color: '#7C3AED' },
    { id: '#B416', d: 0, prod: 'Modo Viral', buyer: 'ju_martins@hotmail.com', plat: 'Kiwify', value: 'R$ 97', net: 'R$ 87', status: 'Acesso liberado', when: 'há 6 min', color: '#3F6FD8' },
    { id: '#B415', d: 0, prod: 'Reconquista 360', buyer: 'amandargomes@gmail.com', plat: 'Kiwify', value: 'R$ 147', net: 'R$ 131', status: 'Acesso liberado', when: 'há 9 min', color: '#E2502F' },
    { id: '#B414', d: 0, prod: 'Renda com IA — Método', buyer: 'carladias.adm@hotmail.com', plat: 'Kiwify', value: 'R$ 297', net: 'R$ 268', status: 'Acesso liberado', when: 'há 14 min', color: '#7C3AED' },
    { id: '#B413', d: 0, prod: 'Modo Viral', buyer: 'brunocorrea22@gmail.com', plat: 'Kiwify', value: 'R$ 97', net: 'R$ 87', status: 'Acesso liberado', when: 'há 21 min', color: '#3F6FD8' },
    { id: '#B412', d: 0, prod: 'Radar de Anúncios', buyer: 'fernandomelo.rj@hotmail.com', plat: 'Kiwify', value: 'R$ 127', net: 'R$ 113', status: 'Acesso liberado', when: 'há 27 min', color: '#1F8A5B' },
    { id: '#B411', d: 0, prod: 'Reconquista 360', buyer: 'paty.gonc@gmail.com', plat: 'Kiwify', value: 'R$ 147', net: 'R$ 131', status: 'Acesso liberado', when: 'há 34 min', color: '#E2502F' },
    { id: '#B410', d: 0, prod: 'Renda com IA — Método', buyer: 'thiagoalmeida07@hotmail.com', plat: 'Kiwify', value: 'R$ 297', net: 'R$ 268', status: 'Pendente', when: 'há 48 min', color: '#7C3AED' },
    { id: '#B40F', d: 2, prod: 'Modo Viral', buyer: 'lucasferreira.mkt@gmail.com', plat: 'Kiwify', value: 'R$ 97', net: 'R$ 87', status: 'Acesso liberado', when: 'há 2 dias', color: '#3F6FD8' },
    { id: '#B40E', d: 4, prod: 'Reconquista 360', buyer: 'caior.oliveira@hotmail.com', plat: 'Kiwify', value: 'R$ 147', net: 'R$ 131', status: 'Reembolso', when: 'há 4 dias', color: '#E2502F' },
    { id: '#B40D', d: 12, prod: 'Radar de Anúncios', buyer: 'bianunes.10@gmail.com', plat: 'Kiwify', value: 'R$ 127', net: 'R$ 113', status: 'Acesso liberado', when: 'há 12 dias', color: '#1F8A5B' },
    { id: '#B40C', d: 24, prod: 'Renda com IA — Método', buyer: 'tsantos.contato@hotmail.com', plat: 'Kiwify', value: 'R$ 297', net: 'R$ 268', status: 'Acesso liberado', when: 'há 24 dias', color: '#7C3AED' },
  ];
  const METRICS = {
    'hoje': [['Receita · hoje', 'R$ 16.936', '+14%'], ['Vendas', '108', '+16'], ['Ticket médio', 'R$ 157', '+R$4'], ['Reembolsos', '0%', '—']],
    '7d': [['Receita · 7 dias', 'R$ 97.240', '+19%'], ['Vendas', '620', '+74'], ['Ticket médio', 'R$ 157', '+R$6'], ['Reembolsos', '1,2%', '−0,3%']],
    '30d': [['Receita · 30 dias', 'R$ 408.510', '+24%'], ['Vendas', '2.577', '+310'], ['Ticket médio', 'R$ 158', '+R$7'], ['Reembolsos', '1,8%', '−0,4%']],
  };
  const metrics = METRICS[range] || METRICS['30d'];
  const STAT = {
    'Acesso liberado': { fg: '#0E7A40', bg: 'rgba(14,154,80,.14)', dot: '#0E9A50' },
    'Pendente': { fg: '#9A6A12', bg: 'rgba(226,163,61,.16)', dot: T.warning },
    'Reembolso': { fg: '#B23A2E', bg: 'rgba(226,80,47,.12)', dot: '#E2502F' },
  };
  const ranges = [['hoje', 'Hoje'], ['7d', '7 dias'], ['30d', '30 dias']];
  const plats = ['Todas', 'Kiwify'];
  const maxD = range === 'hoje' ? 0 : range === '7d' ? 7 : 30;
  const rows = SALES.filter((s) => (plat === 'Todas' || s.plat === plat) && s.d <= maxD);

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
