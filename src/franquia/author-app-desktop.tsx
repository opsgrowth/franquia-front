import React from 'react';
import { Cover, DEFAULT_OFFER, LOCK_ICON, PaywallModal, SUP_ICON } from './author-app';
import { AIC } from './author-kit';
import { MobileBlock } from './author-preview';
import { Perfil, Suporte } from './co-tabs';
import { DISP, IC, Ico, MONO, Mark, T } from './kit';

// App premium do aluno — versão DESKTOP (produto gerado pelo FranquIA).
// Sidebar padrão: Início · Mentor IA · Suporte · Perfil. Reusa Cover, MobileBlock, manual-kit, author-kit.

const { useState: useStateAppD } = React;

function DeskSidebar({ creator, active, onTab }) {
  const menu = [['inicio', 'Início', IC.home], ['mentor', 'Mentor IA', AIC.spark || IC.spark]];
  const you = [['suporte', 'Suporte', SUP_ICON], ['perfil', 'Perfil', IC.user]];
  const Row = ([k, label, d]) => {
    const on = k === active;
    const fg = on ? T.pill : 'rgba(246,241,251,.62)';
    return (
      <div key={k} onClick={() => onTab(k)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', borderRadius: 11, background: on ? 'rgba(124,58,237,.18)' : 'transparent', boxShadow: on ? `inset 0 0 0 1px rgba(196,163,255,.25)` : 'none', color: fg, fontFamily: DISP, fontWeight: on ? 600 : 500, fontSize: 14.5, cursor: 'pointer' }}>
        <Ico d={d} size={19} c={fg} />{label}
      </div>
    );
  };
  return (
    <div style={{ width: 256, flex: '0 0 auto', background: T.darkBg, display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 6px' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Mark size={20} front="#fff" ghost={T.pill} inner={T.accent} /></div>
        <div>
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15, color: T.darkText, letterSpacing: '-0.01em' }}>{creator?.name || 'FranquIA'}</div>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.16em', color: 'rgba(246,241,251,.45)' }}>ECOSSISTEMA</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(196,163,255,.14)', borderRadius: 11, padding: '11px 13px', margin: '20px 0 18px', color: 'rgba(246,241,251,.5)' }}>
        <Ico d={IC.search} size={17} c="rgba(246,241,251,.5)" /><span style={{ fontFamily: DISP, fontSize: 14 }}>Buscar</span>
      </div>

      <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.16em', color: 'rgba(246,241,251,.4)', padding: '0 8px 8px' }}>MENU</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{menu.map(Row)}</div>
      <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.16em', color: 'rgba(246,241,251,.4)', padding: '20px 8px 8px' }}>VOCÊ</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{you.map(Row)}</div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 6px 0', borderTop: '1px solid rgba(196,163,255,.12)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 14, flex: '0 0 auto' }}>M</div>
        <div><div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.darkText }}>Marina Souza</div><div style={{ fontFamily: MONO, fontSize: 10.5, color: 'rgba(246,241,251,.45)' }}>Aluno</div></div>
      </div>
    </div>
  );
}

function DeskHome({ course, onOpenCourse, onLocked }) {
  const accesses = [
    { label: 'CURSO', title: course.title, seed: course.cover || 0, primary: true },
    { label: 'LANÇAMENTO', title: 'Marca que Posiciona', seed: 2 },
    { label: 'BÔNUS', title: 'Kit de Criativos', seed: 3 },
    { label: 'PREMIUM', title: 'Mentoria Alto Ticket', seed: 1, locked: true },
  ];
  return (
    <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
      {/* hero banner */}
      <div style={{ padding: 28 }}>
        <Cover seed={(course.banner != null ? course.banner : course.cover) || 0} h={300} radius={20}>
          <div style={{ position: 'absolute', inset: 0, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 560 }}>
            <span style={{ alignSelf: 'flex-start', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: T.ink, background: T.pill, padding: '6px 12px', borderRadius: 8 }}>● AO VIVO</span>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 44, letterSpacing: '-0.03em', color: '#fff', marginTop: 16, lineHeight: 1.04 }}>Plantão de Tráfego ao Vivo</div>
            <div style={{ fontFamily: DISP, fontSize: 17, color: 'rgba(255,255,255,.82)', marginTop: 8 }}>Terça, 20h — reserve seu lugar</div>
            <div style={{ alignSelf: 'flex-start', marginTop: 22, background: '#fff', color: T.accent, fontFamily: DISP, fontWeight: 700, fontSize: 16, padding: '13px 22px', borderRadius: 12, cursor: 'pointer' }}>Reservar lugar →</div>
          </div>
          <div style={{ position: 'absolute', right: 24, bottom: 22, display: 'flex', gap: 7 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: i === 0 ? 22 : 8, height: 8, borderRadius: 99, background: i === 0 ? '#fff' : 'rgba(255,255,255,.45)' }}></div>)}
          </div>
        </Cover>

        {/* greeting + quick cards */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.03em', color: T.ink }}>Boa noite, Marina.</div>
            <div style={{ fontFamily: DISP, fontSize: 16.5, color: T.dim, marginTop: 6 }}>Sua trilha é <span style={{ color: T.accent, fontWeight: 600 }}>{course.title}</span> — vamos avançar mais uma etapa hoje.</div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[['Minha jornada', 'Trilha gamificada', AIC.list], ['Mentor IA', 'Tire dúvidas agora', AIC.spark || IC.spark]].map(([t, s, d], i) => (
              <div key={i} style={{ width: 220, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 18, display: 'flex', alignItems: 'center', gap: 13, boxShadow: '0 2px 10px rgba(24,18,31,.05)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={d} size={20} c={T.accentDeep} /></div>
                <div><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15, color: T.ink }}>{t}</div><div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim, marginTop: 2 }}>{s}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* acessos */}
        <div style={{ marginTop: 34 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: T.accentDeep, fontWeight: 600 }}>SEU ECOSSISTEMA</div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em', color: T.ink, marginTop: 2 }}>Acessos</div>
          <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
            {['Tudo', 'Curso flagship', 'Lançamento', 'Premium', 'Bônus'].map((c, i) => (
              <span key={i} style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, padding: '8px 16px', borderRadius: 99, background: i === 0 ? T.accent : '#fff', color: i === 0 ? '#fff' : T.dim, border: `1px solid ${i === 0 ? T.accent : T.line}`, cursor: 'pointer' }}>{c}</span>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 18 }}>
            {accesses.map((a, i) => (
              <div key={i} onClick={a.primary ? onOpenCourse : (a.locked ? () => onLocked && onLocked(DEFAULT_OFFER) : undefined)} style={{ cursor: (a.primary || a.locked) ? 'pointer' : 'default' }}>
                <Cover seed={a.seed} h={210} radius={16} label={a.label} title={a.title}>
                  {a.locked && <div style={{ position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={AIC.bookmark} size={14} c={T.accent} /></div>}
                </Cover>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 20 }}></div>
      </div>
    </div>
  );
}

function DeskCourse({ course, onBack, onOpenLesson, onLocked }) {
  const total = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  return (
    <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
      <Cover seed={course.cover || 0} h={240} radius={0}>
        <div style={{ position: 'absolute', top: 24, left: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Ico d={AIC.chevron} size={18} c="#fff" style={{ transform: 'rotate(90deg)' }} /></div>
          <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', color: 'rgba(255,255,255,.85)', textTransform: 'uppercase' }}>Curso</span>
        </div>
        <div style={{ position: 'absolute', left: 28, bottom: 26, right: 28 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.03em', color: '#fff' }}>{course.title}</div>
          <div style={{ fontFamily: DISP, fontSize: 14, color: 'rgba(255,255,255,.8)', marginTop: 6 }}>{course.modules.length} módulos · {total} aulas</div>
        </div>
      </Cover>
      <div style={{ padding: 28, maxWidth: 900 }}>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, color: T.ink, marginBottom: 16 }}>Conteúdo</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {course.modules.map((m, mi) => m.locked ? (
            <div key={mi} onClick={() => onLocked && onLocked(m.offer || DEFAULT_OFFER)} style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: 12 }}>
              <div style={{ position: 'relative', width: 92, flex: '0 0 auto' }}>
                <Cover seed={(m.cover != null ? m.cover : (course.cover || 0) + mi + 1)} h={56} radius={12} style={{ width: 92 }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'rgba(20,16,25,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={LOCK_ICON} size={20} c="#fff" /></div>
              </div>
              <div style={{ flex: 1 }}><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: T.ink }}>{m.name}</div><div style={{ fontFamily: MONO, fontSize: 11, color: T.accentDeep, marginTop: 3, letterSpacing: '0.04em' }}>● BLOQUEADO · CLIQUE PARA DESBLOQUEAR</div></div>
              <Ico d={LOCK_ICON} size={18} c={T.accent} />
            </div>
          ) : (
            <div key={mi}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                <Cover seed={(m.cover != null ? m.cover : (course.cover || 0) + mi + 1)} h={56} radius={12} style={{ width: 92 }} />
                <div><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: T.ink }}>{m.name}</div><div style={{ fontFamily: MONO, fontSize: 11.5, color: T.dim, marginTop: 2 }}>{m.lessons.length} aulas</div></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {m.lessons.map((l, li) => (
                  <div key={li} onClick={() => onOpenLesson(mi, li)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px', borderRadius: 10, cursor: 'pointer', background: mi === 0 && li === 0 ? T.halo : 'transparent' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: mi === 0 && li === 0 ? T.accent : 'rgba(24,18,31,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={AIC.play} size={13} c={mi === 0 && li === 0 ? '#fff' : T.dim} fill={mi === 0 && li === 0 ? '#fff' : T.dim} /></div>
                    <span style={{ flex: 1, fontFamily: DISP, fontWeight: 500, fontSize: 14.5, color: T.ink }}>{l.title}</span>
                    <Ico d={AIC.chevron} size={15} c={T.dim} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeskLesson({ lesson, moduleName, onBack }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', minWidth: 0, background: '#fff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 32px 60px' }}>
        <div onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: T.accent, fontFamily: DISP, fontWeight: 600, fontSize: 14 }}>
          <Ico d={AIC.chevron} size={17} c={T.accent} style={{ transform: 'rotate(90deg)' }} />Voltar ao curso
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', color: T.accentDeep, textTransform: 'uppercase', marginTop: 22 }}>{moduleName}</div>
        <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 40, letterSpacing: '-0.035em', lineHeight: 1.05, color: T.ink, margin: '8px 0 0' }}>{lesson.title}</h1>
        {lesson.subtitle && <p style={{ fontFamily: DISP, fontSize: 17, lineHeight: 1.5, color: T.dim, margin: '12px 0 0' }}>{lesson.subtitle}</p>}
        <div style={{ marginTop: 8 }}>{(lesson.blocks || []).map((b, i) => <MobileBlock key={i} b={b} />)}</div>
        <div style={{ marginTop: 30, background: T.accent, color: '#fff', borderRadius: 13, padding: '15px', textAlign: 'center', fontFamily: DISP, fontWeight: 600, fontSize: 15.5, maxWidth: 280 }}>Concluir aula</div>
      </div>
    </div>
  );
}

function StudentStubDesk({ title, icon }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={icon} size={32} c={T.accent} /></div>
      <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 24, color: T.ink }}>{title}</div>
      <div style={{ fontFamily: DISP, fontSize: 15, color: T.dim }}>Parte do app do aluno · disponível na versão final.</div>
    </div>
  );
}

function StudentAppDesktop({ course }) {
  const [view, setView] = useStateAppD('home');
  const [mi, setMi] = useStateAppD(0);
  const [li, setLi] = useStateAppD(0);
  const [tab, setTab] = useStateAppD('inicio');
  const [pay, setPay] = useStateAppD(null);
  const mod = course.modules[mi];
  const lesson = mod && mod.lessons[li];
  const openLesson = (m, l) => { setMi(m); setLi(l); setView('lesson'); };

  let body;
  if (tab !== 'inicio') {
    const stub = { mentor: ['Mentor IA', AIC.spark || IC.spark], suporte: ['Suporte', SUP_ICON], perfil: ['Perfil', IC.user] }[tab];
    body = <StudentStubDesk title={stub[0]} icon={stub[1]} />;
  } else if (view === 'home') body = <DeskHome course={course} onOpenCourse={() => setView('course')} onLocked={(o) => setPay(o)} />;
  else if (view === 'course') body = <DeskCourse course={course} onBack={() => setView('home')} onOpenLesson={openLesson} onLocked={(o) => setPay(o)} />;
  else body = <DeskLesson lesson={lesson} moduleName={(mod.name || '').split(' · ').slice(-1)[0]} onBack={() => setView('course')} />;

  return (
    <div style={{ display: 'flex', height: '100%', background: T.paper, fontFamily: DISP, position: 'relative' }}>
      <DeskSidebar creator={course.creator} active={tab} onTab={(t) => { setTab(t); if (t === 'inicio') setView('home'); }} />
      {body}
      {pay && <PaywallModal offer={pay} onClose={() => setPay(null)} />}
    </div>
  );
}

export { StudentAppDesktop, DeskSidebar };
