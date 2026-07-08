import React from 'react';
import { AIC } from './author-kit';
import { DISP, IC, Ico, MONO, Mark, T } from './kit';

// App do aluno — abas Mentor IA · Suporte · Perfil. Reusa T/DISP/MONO/Ico/IC/AIC/Mark + helpers do co-app.
const { useState: useStateCT } = React;

// ── Mentor IA — chat ──────────────────────────────────────────────
function MentorIA({ accent = T.accent }) {
  const [msgs, setMsgs] = useStateCT([
    { me: false, t: 'Oi! Sou o Mentor IA do seu ecossistema. Posso tirar dúvidas das aulas, sugerir o próximo passo e revisar suas ideias. Por onde começamos?' },
  ]);
  const [val, setVal] = useStateCT('');
  const sugg = ['Resumir a última aula', 'Qual meu próximo passo?', 'Revisar minha copy'];
  const send = (txt) => {
    const m = (txt || val).trim(); if (!m) return;
    setMsgs((x) => [...x, { me: true, t: m }, { me: false, t: 'Ótima pergunta! No produto final, eu respondo com base no conteúdo das suas aulas e no seu progresso. (resposta de demonstração)' }]);
    setVal('');
  };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.paper, minHeight: 0 }}>
      <div style={{ background: T.darkBg, padding: '50px 18px 16px', flex: '0 0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={AIC.spark || IC.spark} size={21} c="#fff" /></div>
          <div><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 17, color: '#F6F1FB' }}>Mentor IA</div><div style={{ fontFamily: MONO, fontSize: 10.5, color: '#7CD9A8' }}>● online</div></div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '82%', background: m.me ? accent : '#fff', color: m.me ? '#fff' : T.ink, border: m.me ? 'none' : `1px solid ${T.line}`, borderRadius: 16, borderBottomRightRadius: m.me ? 4 : 16, borderBottomLeftRadius: m.me ? 16 : 4, padding: '12px 15px', fontFamily: DISP, fontSize: 14.5, lineHeight: 1.5 }}>{m.t}</div>
        ))}
      </div>
      <div style={{ flex: '0 0 auto', padding: '10px 16px 18px', borderTop: `1px solid ${T.line}`, background: T.paper }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10 }}>
          {sugg.map((s) => <div key={s} onClick={() => send(s)} style={{ flex: '0 0 auto', fontFamily: DISP, fontWeight: 600, fontSize: 12.5, color: accent, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 99, padding: '8px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{s}</div>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: '8px 8px 8px 16px' }}>
          <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Pergunte ao Mentor IA…" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: DISP, fontSize: 14.5, background: 'transparent', color: T.ink }} />
          <div onClick={() => send()} style={{ width: 40, height: 40, borderRadius: 11, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: '0 0 auto' }}><Ico d={'M12 19V5 M5 12l7-7 7 7'} size={19} c="#fff" /></div>
        </div>
      </div>
    </div>
  );
}

// ── Suporte ───────────────────────────────────────────────────────
function Suporte({ accent = T.accent }) {
  const faqs = [
    ['Como acesso os produtos que comprei?', 'Tudo que você adquire aparece automaticamente no Início, na seção Acessos. A liberação é na hora do pagamento.'],
    ['Comprei e não liberou. E agora?', 'Pode levar alguns minutos. Se passar de 30 min, fale com o suporte pelo botão abaixo com o e-mail da compra.'],
    ['Posso assistir pelo computador?', 'Sim. O mesmo acesso funciona no app e no navegador, é só entrar com seu e-mail.'],
    ['Como funciona a garantia?', 'Cada produto tem sua política, exibida na página de compra. Em geral, 7 dias.'],
  ];
  const [open, setOpen] = useStateCT(0);
  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.paper, minHeight: 0 }}>
      <div style={{ background: T.darkBg, padding: '50px 18px 18px' }}>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, color: '#F6F1FB' }}>Suporte</div>
        <div style={{ fontFamily: DISP, fontSize: 13.5, color: 'rgba(246,241,251,.6)', marginTop: 4 }}>Estamos aqui para ajudar você a destravar.</div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(37,211,102,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={'M12 21a9 9 0 1 0-8-4.9L3 21l4.9-1A9 9 0 0 0 12 21z'} size={19} c="#1FA567" /></div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14.5, color: T.ink }}>WhatsApp</div>
            <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim }}>Resposta em até 1 dia útil.</div>
          </div>
          <div style={{ flex: 1, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(124,58,237,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={'M4 5h16v14H4z M4 7l8 6 8-6'} size={19} c={accent} /></div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14.5, color: T.ink }}>E-mail</div>
            <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim }}>ajuda@franquia.ia</div>
          </div>
        </div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: T.ink, margin: '24px 0 12px' }}>Perguntas frequentes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map(([q, a], i) => {
            const on = i === open;
            return (
              <div key={i} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 12, overflow: 'hidden' }}>
                <div onClick={() => setOpen(on ? -1 : i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 15px', cursor: 'pointer' }}>
                  <span style={{ flex: 1, fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink }}>{q}</span>
                  <Ico d={AIC.chevron} size={16} c={T.dim} style={{ transform: on ? 'rotate(180deg)' : 'none' }} />
                </div>
                {on && <div style={{ padding: '0 15px 15px', fontFamily: DISP, fontSize: 13.5, lineHeight: 1.55, color: T.dim }}>{a}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, background: accent, color: '#fff', borderRadius: 13, padding: '15px', textAlign: 'center', fontFamily: DISP, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Falar com o suporte</div>
      </div>
    </div>
  );
}

// ── Perfil ────────────────────────────────────────────────────────
function Perfil({ accent = T.accent, courses = [], progress = {} }) {
  const done = courses.reduce((n, c) => n + c.modules.flatMap((m) => m.lessons).filter((l) => progress[l.id]).length, 0);
  const stats = [['Cursos', String(courses.length)], ['Aulas feitas', String(done)], ['Sequência', '4 dias']];
  const items = [['Editar perfil', AIC.pencil], ['Meus acessos', AIC.grid], ['Notificações', 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0'], ['Sair', 'M16 17l5-5-5-5 M21 12H9 M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4']];
  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.paper, minHeight: 0 }}>
      <div style={{ background: T.darkBg, padding: '50px 18px 22px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: 10, opacity: 0.16 }}><Mark size={120} front="#fff" ghost="#fff" inner="transparent" /></div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 30, margin: '0 auto', border: '3px solid rgba(255,255,255,.2)' }}>M</div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 21, color: '#F6F1FB', marginTop: 12 }}>Marina Souza</div>
          <div style={{ fontFamily: MONO, fontSize: 11.5, color: 'rgba(246,241,251,.55)', marginTop: 2 }}>marina.souza@email.com</div>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {stats.map(([k, v], i) => (
            <div key={i} style={{ flex: 1, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: T.ink }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.dim, letterSpacing: '0.04em', marginTop: 3 }}>{k.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, overflow: 'hidden' }}>
          {items.map(([t, d], i) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 16px', borderTop: i ? `1px solid ${T.line}` : 'none', cursor: 'pointer' }}>
              <Ico d={d} size={19} c={t === 'Sair' ? '#B23A2E' : accent} />
              <span style={{ flex: 1, fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: t === 'Sair' ? '#B23A2E' : T.ink }}>{t}</span>
              {t !== 'Sair' && <Ico d={AIC.chevron} size={15} c={T.dim} style={{ transform: 'rotate(-90deg)' }} />}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim, textAlign: 'center', marginTop: 18 }}>FranquIA · app.franquia.ia/camila</div>
      </div>
    </div>
  );
}

export { MentorIA, Suporte, Perfil };
