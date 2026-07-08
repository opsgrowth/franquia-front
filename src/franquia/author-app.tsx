import React from 'react';
import { AIC } from './author-kit';
import { MobileBlock } from './author-preview';
import { Perfil, Suporte } from './co-tabs';
import { DISP, IC, Ico, MONO, Mark, T } from './kit';

// App premium do aluno (produto gerado pelo FranquIA) — navegável.
// Início (ecossistema) → Curso (módulos com capa) → Aula. Reusa manual-kit, author-kit, MobileBlock.

const { useState: useStateApp } = React;
const SUP_ICON = 'M12 17h.01 M12 13.6a1.8 1.8 0 0 0 1.8-1.8 1.8 1.8 0 1 0-3.6 0 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z';

// capas (gradientes premium; no produto real, foto enviada pelo criador)
const COVERS = [
  'linear-gradient(135deg, #2A1E3C 0%, #7C3AED 100%)',
  'linear-gradient(135deg, #1A1422 0%, #4B2E83 100%)',
  'linear-gradient(140deg, #3B2A5A 0%, #9D7BE0 100%)',
  'linear-gradient(135deg, #241B30 0%, #6429C9 100%)',
];
const coverBg = (seed) => COVERS[((seed || 0) % COVERS.length + COVERS.length) % COVERS.length];
const STRIPES = 'repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 14px, rgba(255,255,255,0) 14px 28px)';

function Cover({ seed = 0, h = 150, radius = 16, label, title, children, style }) {
  const isImg = typeof seed === 'string';
  return (
    <div style={{ height: h, borderRadius: radius, background: isImg ? `center/cover no-repeat url("${seed}")` : coverBg(seed), position: 'relative', overflow: 'hidden', flex: '0 0 auto', ...style }}>
      {!isImg && <div style={{ position: 'absolute', inset: 0, background: STRIPES }}></div>}
      {!isImg && <div style={{ position: 'absolute', right: -20, bottom: -24, opacity: 0.22 }}><Mark size={Math.round(h * 0.7)} front="#fff" ghost="#fff" inner="transparent" /></div>}
      {isImg && (label || title) && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.55))' }}></div>}
      {label && <span style={{ position: 'absolute', top: 12, left: 12, fontFamily: MONO, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.08em', color: '#fff', background: 'rgba(0,0,0,.4)', padding: '5px 9px', borderRadius: 7 }}>{label}</span>}
      {title && <div style={{ position: 'absolute', left: 14, bottom: 13, right: 14, fontFamily: DISP, fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.1 }}>{title}</div>}
      {children}
    </div>
  );
}

// ── barra de abas ─────────────────────────────────────────────────
function StudentTabBar({ active, onTab }) {
  const tabs = [['inicio', 'Início', IC.home], ['mentor', 'Mentor', AIC.spark || IC.spark], ['suporte', 'Suporte', SUP_ICON], ['perfil', 'Perfil', IC.user]];
  return (
    <div style={{ flex: '0 0 auto', background: T.darkBg, borderTop: '1px solid rgba(196,163,255,.14)', padding: '11px 8px 26px', display: 'flex', justifyContent: 'space-around' }}>
      {tabs.map(([k, label, d]) => {
        const on = k === active;
        const c = on ? T.pill : 'rgba(246,241,251,.5)';
        return (
          <div key={k} onClick={() => onTab(k)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            <Ico d={d} size={21} c={c} />
            <span style={{ fontFamily: DISP, fontSize: 10, fontWeight: on ? 600 : 500, color: c }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Início (ecossistema) ──────────────────────────────────────────
function StudentHome({ course, student, onOpenCourse, onLocked }) {
  const accesses = [
    { label: 'CURSO', title: course.title, seed: course.cover || 0, primary: true },
    { label: 'LANÇAMENTO', title: 'Marca que Posiciona', seed: 2 },
    { label: 'PREMIUM', title: 'Mentoria Alto Ticket', seed: 1, locked: true },
    { label: 'BÔNUS', title: 'Kit de Criativos', seed: 3 },
  ];
  return (
    <div style={{ height: '100%', overflow: 'auto', background: T.paper }}>
      {/* header */}
      <div style={{ background: T.darkBg, padding: '50px 18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mark size={18} front="#fff" ghost={T.pill} inner={T.accent} /></div>
          <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 16, color: T.darkText, letterSpacing: '-0.01em' }}>{course.creator?.name || 'FranquIA'}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, color: 'rgba(246,241,251,.75)' }}>
          <Ico d={IC.search} size={19} c="rgba(246,241,251,.75)" /><Ico d={AIC.spark || IC.spark} size={19} c="rgba(246,241,251,.75)" />
        </div>
      </div>

      <div style={{ padding: '16px 18px 22px' }}>
        {/* hero ao vivo */}
        <Cover seed={(course.banner != null ? course.banner : course.cover) || 0} h={172} radius={18}>
          <div style={{ position: 'absolute', inset: 0, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <span style={{ alignSelf: 'flex-start', fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: T.ink, background: T.pill, padding: '5px 10px', borderRadius: 7 }}>AO VIVO</span>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: '#fff', marginTop: 10, lineHeight: 1.08 }}>Plantão de Tráfego ao Vivo</div>
            <div style={{ fontFamily: DISP, fontSize: 13, color: 'rgba(255,255,255,.8)', marginTop: 4 }}>Terça, 20h — reserve seu lugar</div>
            <div style={{ alignSelf: 'flex-start', marginTop: 12, background: '#fff', color: T.accent, fontFamily: DISP, fontWeight: 700, fontSize: 13, padding: '10px 16px', borderRadius: 10 }}>Reservar lugar →</div>
          </div>
        </Cover>

        {/* greeting */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em', color: T.ink }}>Boa noite, {student || 'Marina'}.</div>
          <div style={{ fontFamily: DISP, fontSize: 14.5, lineHeight: 1.5, color: T.dim, marginTop: 6 }}>Sua trilha é <span style={{ color: T.accent, fontWeight: 600 }}>{course.title}</span> — vamos avançar mais uma etapa hoje.</div>
        </div>

        {/* quick cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
          {[['Minha jornada', 'Trilha gamificada', AIC.list], ['Mentor IA', 'Tire dúvidas agora', AIC.spark || IC.spark]].map(([t, s, d], i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: 14, boxShadow: '0 2px 8px rgba(24,18,31,.04)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={d} size={18} c={T.accentDeep} /></div>
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14.5, color: T.ink, marginTop: 10 }}>{t}</div>
              <div style={{ fontFamily: DISP, fontSize: 12, color: T.dim, marginTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>

        {/* acessos */}
        <div style={{ marginTop: 26 }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', color: T.accentDeep, fontWeight: 600 }}>SEU ECOSSISTEMA</div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: T.ink, marginTop: 2 }}>Acessos</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {['Tudo', 'Curso', 'Lançamento', 'Bônus'].map((c, i) => (
              <span key={i} style={{ fontFamily: DISP, fontWeight: 600, fontSize: 12.5, padding: '7px 13px', borderRadius: 99, background: i === 0 ? T.accent : '#fff', color: i === 0 ? '#fff' : T.dim, border: `1px solid ${i === 0 ? T.accent : T.line}` }}>{c}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 14, overflowX: 'auto', overflowY: 'hidden', paddingBottom: 6, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {accesses.map((a, i) => (
              <div key={i} onClick={a.primary ? onOpenCourse : (a.locked ? () => onLocked && onLocked(DEFAULT_OFFER) : undefined)} style={{ width: 150, flex: '0 0 auto', cursor: (a.primary || a.locked) ? 'pointer' : 'default', position: 'relative' }}>
                <Cover seed={a.seed} h={130} radius={14} label={a.label} title={a.title} />
                {a.locked && <div style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={LOCK_ICON} size={14} c={T.accent} /></div>}
              </div>
            ))}
          </div>
        </div>

        {/* recomendado */}
        <div style={{ marginTop: 26 }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', color: T.accentDeep, fontWeight: 600 }}>CURADORIA</div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: T.ink, marginTop: 2 }}>Recomendado para você</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 14, overflowX: 'auto', overflowY: 'hidden', paddingBottom: 6, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {[['CONTINUE', AIC.play], ['EM ALTA', AIC.chart || IC.chart]].map(([l, d], i) => (
              <div key={i} style={{ flex: 1 }}><Cover seed={i + 1} h={104} radius={14} label={l}><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={d} size={26} c="rgba(255,255,255,.92)" fill={i === 0 ? '#fff' : 'none'} /></div></Cover></div>
            ))}
          </div>
        </div>
        <div style={{ height: 10 }}></div>
      </div>
    </div>
  );
}

// ── Curso (módulos com capa) ──────────────────────────────────────
const LOCK_ICON = 'M6 10V7a6 6 0 0 1 12 0v3 M5 10h14v11H5z';
const DEFAULT_OFFER = {
  seed: 1, tag: 'PREMIUM', title: 'Mentoria Alto Ticket', subtitle: 'Venda de R$5k a R$50k com método',
  features: ['Sistema completo de vendas de alto valor', 'Modelos de aplicação e sessão estratégica', 'Grupo fechado de alto ticket', 'Acompanhamento por 12 meses'],
  parcelado: { n: '12x R$ 297', sub: 'no cartão' }, vista: { n: 'R$ 2.997', sub: 'no Pix' },
  bump: { title: 'Templates de Call (order bump)', sub: '20 roteiros de fechamento prontos', price: '+ R$ 97' },
  footer: 'Pagamento seguro via Hubla · Garantia de 7 dias',
};

function StudentCourse({ course, onBack, onOpenLesson, onLocked }) {
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  return (
    <div style={{ height: '100%', overflow: 'auto', background: T.paper }}>
      {/* header */}
      <div style={{ position: 'relative' }}>
        <Cover seed={course.cover || 0} h={210} radius={0}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '50px 18px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div onClick={onBack} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Ico d={AIC.chevron} size={18} c="#fff" style={{ transform: 'rotate(90deg)' }} /></div>
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,.85)', textTransform: 'uppercase' }}>Curso</span>
          </div>
          <div style={{ position: 'absolute', left: 18, bottom: 16, right: 18 }}>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.05 }}>{course.title}</div>
            <div style={{ fontFamily: DISP, fontSize: 13, color: 'rgba(255,255,255,.8)', marginTop: 6 }}>{course.modules.length} módulos · {totalLessons} aulas</div>
          </div>
        </Cover>
      </div>

      <div style={{ padding: '20px 18px 22px' }}>
        {/* progresso */}
        <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink }}>Seu progresso</span>
            <span style={{ fontFamily: MONO, fontSize: 12, color: T.dim }}>1/{totalLessons}</span>
          </div>
          <div style={{ height: 7, borderRadius: 99, background: 'rgba(24,18,31,.08)', marginTop: 10, overflow: 'hidden' }}><div style={{ width: `${(1 / totalLessons) * 100}%`, height: '100%', background: T.accent, borderRadius: 99 }}></div></div>
        </div>

        {/* módulos */}
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 17, color: T.ink, margin: '22px 0 12px' }}>Conteúdo</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {course.modules.map((m, mi) => (
            <div key={mi}>
              {m.locked ? (
                <div onClick={() => onLocked && onLocked(m.offer || DEFAULT_OFFER)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: 10 }}>
                  <div style={{ position: 'relative', width: 76, flex: '0 0 auto' }}>
                    <Cover seed={(m.cover != null ? m.cover : (course.cover || 0) + mi + 1)} h={54} radius={11} style={{ width: 76 }} />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 11, background: 'rgba(20,16,25,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={LOCK_ICON} size={20} c="#fff" /></div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.accentDeep, marginTop: 3, letterSpacing: '0.04em' }}>● BLOQUEADO · TOQUE PARA DESBLOQUEAR</div>
                  </div>
                  <Ico d={LOCK_ICON} size={17} c={T.accent} />
                </div>
              ) : (
                <React.Fragment>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Cover seed={(m.cover != null ? m.cover : (course.cover || 0) + mi + 1)} h={54} radius={11} style={{ width: 76 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 2 }}>{m.lessons.length} aulas</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
                    {m.lessons.map((l, li) => (
                      <div key={li} onClick={() => onOpenLesson(mi, li)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 10px', borderRadius: 10, cursor: 'pointer', background: mi === 0 && li === 0 ? T.halo : 'transparent' }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: mi === 0 && li === 0 ? T.accent : 'rgba(24,18,31,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={AIC.play} size={12} c={mi === 0 && li === 0 ? '#fff' : T.dim} fill={mi === 0 && li === 0 ? '#fff' : T.dim} /></div>
                        <span style={{ flex: 1, fontFamily: DISP, fontWeight: 500, fontSize: 14, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                        <Ico d={AIC.chevron} size={15} c={T.dim} style={{ transform: 'rotate(-90deg)' }} />
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Aula (tela cheia de leitura) ──────────────────────────────────
function StudentLesson({ lesson, moduleName, onBack }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ background: T.darkBg, padding: '50px 18px 18px', position: 'relative', overflow: 'hidden', flex: '0 0 auto' }}>
        <div style={{ position: 'absolute', right: -30, top: 30, opacity: 0.2 }}><Mark size={110} front={T.accent} ghost={T.pill} inner={T.darkBg} /></div>
        <div style={{ position: 'relative' }}>
          <div onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <Ico d={AIC.chevron} size={18} c={T.pill} style={{ transform: 'rotate(90deg)' }} />
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: T.pill, textTransform: 'uppercase' }}>{moduleName || 'Aula'}</span>
          </div>
          <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 23, letterSpacing: '-0.03em', lineHeight: 1.12, color: T.darkText, margin: '14px 0 0' }}>{lesson.title || 'Sem título'}</h1>
          {lesson.subtitle && <p style={{ fontFamily: DISP, fontSize: 13, lineHeight: 1.45, color: 'rgba(246,241,251,.6)', margin: '8px 0 0' }}>{lesson.subtitle}</p>}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 18px 16px' }}>
        {(lesson.blocks || []).map((b, i) => <MobileBlock key={i} b={b} />)}
        {(!lesson.blocks || lesson.blocks.length === 0) && <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, marginTop: 30, textAlign: 'center' }}>Esta aula ainda não tem conteúdo.</div>}
        <div style={{ height: 14 }}></div>
      </div>
      <div style={{ flex: '0 0 auto', padding: '12px 16px 30px', borderTop: `1px solid ${T.line}` }}>
        <div style={{ background: T.accent, color: '#fff', borderRadius: 13, padding: '14px', textAlign: 'center', fontFamily: DISP, fontWeight: 600, fontSize: 15 }}>Concluir aula</div>
      </div>
    </div>
  );
}

// stub premium p/ abas secundárias
function StudentStub({ title, icon }) {
  return (
    <div style={{ height: '100%', background: T.paper, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 30 }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={icon} size={28} c={T.accent} /></div>
      <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, color: T.ink }}>{title}</div>
      <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, textAlign: 'center' }}>Parte do app do aluno · disponível na versão final.</div>
    </div>
  );
}

// ── Paywall (módulo bloqueado · upsell) ───────────────────────────
function PaywallModal({ offer, onClose }) {
  const [stage, setStage] = React.useState('offer');
  const [bump, setBump] = React.useState(false);
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(20,16,25,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 360, maxHeight: '96%', overflow: 'auto', background: '#fff', borderRadius: 22, position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
        <div onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, zIndex: 3, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontSize: 15, cursor: 'pointer' }}>✕</div>
        {/* header */}
        <div style={{ background: coverBg(offer.seed || 1), padding: '26px 22px 22px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: STRIPES }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 58, height: 58, borderRadius: 16, background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><Ico d={LOCK_ICON} size={26} c="#fff" /></div>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,.85)', marginTop: 14 }}>{offer.tag}</div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 27, letterSpacing: '-0.02em', color: '#fff', marginTop: 6 }}>{offer.title}</div>
            <div style={{ fontFamily: DISP, fontSize: 14.5, color: 'rgba(255,255,255,.8)', marginTop: 6 }}>{offer.subtitle}</div>
          </div>
        </div>

        {stage === 'offer' ? (
          <div style={{ padding: '22px 20px 22px' }}>
            {offer.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 16 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: T.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={AIC.check} size={15} c="#fff" sw={2.6} /></span>
                <span style={{ fontFamily: DISP, fontSize: 15, color: T.ink }}>{f}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <div style={{ flex: 1, position: 'relative', background: 'rgba(124,58,237,.06)', border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: '16px 14px' }}>
                <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: '#fff', background: T.accent, padding: '4px 9px', borderRadius: 7, whiteSpace: 'nowrap' }}>MELHOR VALOR</span>
                <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.dim }}>Parcelado</div>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: T.ink, marginTop: 4 }}>{offer.parcelado.n}</div>
                <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim, marginTop: 2 }}>{offer.parcelado.sub}</div>
              </div>
              <div style={{ flex: 1, background: '#F4F0FA', border: `1px solid ${T.line}`, borderRadius: 14, padding: '16px 14px' }}>
                <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.dim }}>À vista</div>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: T.ink, marginTop: 4 }}>{offer.vista.n}</div>
                <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim, marginTop: 2 }}>{offer.vista.sub}</div>
              </div>
            </div>
            {offer.bump && (
              <div onClick={() => setBump((b) => !b)} style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 14, border: `1.5px dashed ${T.line}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', background: bump ? 'rgba(124,58,237,.05)' : 'transparent' }}>
                <span style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${bump ? T.accent : T.line}`, background: bump ? T.accent : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{bump && <Ico d={AIC.check} size={13} c="#fff" sw={2.6} />}</span>
                <div style={{ flex: 1 }}><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: T.ink }}>{offer.bump.title}</div><div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim }}>{offer.bump.sub}</div></div>
                <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15, color: T.accent }}>{offer.bump.price}</span>
              </div>
            )}
            <div onClick={() => setStage('checkout')} style={{ marginTop: 18, background: T.accent, color: '#fff', borderRadius: 14, padding: '16px', textAlign: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', boxShadow: '0 12px 28px rgba(124,58,237,.4)' }}><Ico d={LOCK_ICON} size={18} c="#fff" />Desbloquear agora</div>
            <div style={{ fontFamily: DISP, fontSize: 12, color: T.dim, textAlign: 'center', marginTop: 14 }}>{offer.footer}</div>
          </div>
        ) : (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', border: `3px solid ${T.halo}`, borderTopColor: T.accent, margin: '0 auto', animation: 'fia-spin 0.9s linear infinite' }}></div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 18, color: T.ink, marginTop: 22 }}>Abrindo checkout seguro…</div>
            <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, marginTop: 8 }}>Você está sendo redirecionado para o pagamento via Hubla.</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: T.accentDeep, marginTop: 18 }}>{offer.parcelado.n} · garantia de 7 dias</div>
            <style>{`@keyframes fia-spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
      </div>
    </div>
  );
}

// ── App container ─────────────────────────────────────────────────
function StudentApp({ course, start }) {
  const [view, setView] = useStateApp(start ? 'lesson' : 'home');
  const [mi, setMi] = useStateApp(start ? start.m : 0);
  const [li, setLi] = useStateApp(start ? start.l : 0);
  const [tab, setTab] = useStateApp('inicio');
  const [pay, setPay] = useStateApp(null);

  const mod = course.modules[mi];
  const lesson = mod && mod.lessons[li];
  const openLesson = (m, l) => { setMi(m); setLi(l); setView('lesson'); };

  let content;
  if (tab === 'inicio' && view === 'lesson' && lesson) {
    content = <StudentLesson lesson={lesson} moduleName={(mod.name || '').split(' · ').slice(-1)[0]} onBack={() => setView('course')} />;
  } else {
    let body;
    if (tab !== 'inicio') {
      const stub = { mentor: ['Mentor IA', AIC.spark || IC.spark], suporte: ['Suporte', SUP_ICON], perfil: ['Perfil', IC.user] }[tab];
      body = <StudentStub title={stub[0]} icon={stub[1]} />;
    } else if (view === 'home') {
      body = <StudentHome course={course} onOpenCourse={() => setView('course')} onLocked={(o) => setPay(o)} />;
    } else {
      body = <StudentCourse course={course} onBack={() => setView('home')} onOpenLesson={openLesson} onLocked={(o) => setPay(o)} />;
    }
    content = (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{body}</div>
        <StudentTabBar active={tab} onTab={(t) => { setTab(t); if (t === 'inicio') setView('home'); }} />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      {content}
      {pay && <PaywallModal offer={pay} onClose={() => setPay(null)} />}
    </div>
  );
}

export { Cover, StudentApp, StudentHome, StudentCourse, StudentLesson, PaywallModal, DEFAULT_OFFER, LOCK_ICON };
