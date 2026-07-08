import React from 'react';
import { AIC } from './author-kit';
import { CoApp } from './co-screens';
import { IOSDevice } from './ios-frame';
import { DISP, Ico, MONO, Mark, T } from './kit';

// Preview do app do aluno (modal com iPhone) — usado por "Testar" (revisão) e
// "Pré-visualizar" (criação manual). Reusa IOSDevice (ios-frame.jsx), manual-kit, author-kit.

// ── render de bloco no formato mobile (app do aluno) ──────────────
function MobileBlock({ b }) {
  switch (b.kind) {
    case 'heading':
      return <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 19, letterSpacing: '-0.02em', color: T.ink, margin: '22px 0 0' }}>{b.text}</h3>;
    case 'text':
    case 'paragraph':
      return <p style={{ fontFamily: DISP, fontSize: 15, lineHeight: 1.62, color: 'rgba(24,18,31,.8)', margin: '14px 0 0' }}>{b.text || 'Texto da aula…'}</p>;
    case 'list':
      return (
        <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {(b.items || []).map((it, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: DISP, fontSize: 15, lineHeight: 1.45, color: 'rgba(24,18,31,.8)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, marginTop: 8, flex: '0 0 auto' }}></span>{it}
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <div style={{ margin: '18px 0 0', borderLeft: `3px solid ${T.accent}`, paddingLeft: 14 }}>
          <div style={{ fontFamily: DISP, fontWeight: 500, fontSize: 16.5, lineHeight: 1.4, color: T.ink }}>{b.text || 'Citação…'}</div>
          {b.cite && <div style={{ fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 7 }}>{b.cite}</div>}
        </div>
      );
    case 'video':
      return (
        <div style={{ margin: '16px 0 0', borderRadius: 14, overflow: 'hidden', background: '#000', aspectRatio: '16 / 9', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, rgba(124,58,237,.4), rgba(0,0,0,.2) 60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, marginLeft: 4, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: `15px solid ${T.accent}` }}></div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 10, bottom: 9, fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.85)' }}>{b.title || 'vídeo'}</div>
        </div>
      );
    case 'image':
      return (
        <div style={{ margin: '16px 0 0' }}>
          <div style={{ height: 150, borderRadius: 12, background: 'repeating-linear-gradient(135deg, rgba(24,18,31,.05) 0 10px, rgba(24,18,31,.08) 10px 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ico d={AIC.image} size={22} c="rgba(24,18,31,.4)" />
          </div>
          {b.caption && <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim, marginTop: 6 }}>{b.caption}</div>}
        </div>
      );
    default:
      return null;
  }
}

// ── tela da aula no app do aluno ──────────────────────────────────
function StudentLessonView({ lesson, moduleName }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* header */}
      <div style={{ background: T.darkBg, padding: '50px 18px 18px', position: 'relative', overflow: 'hidden', flex: '0 0 auto' }}>
        <div style={{ position: 'absolute', right: -30, top: 30, opacity: 0.2 }}><Mark size={110} front={T.accent} ghost={T.pill} inner={T.darkBg} /></div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ico d={AIC.chevron} size={18} c={T.pill} style={{ transform: 'rotate(90deg)' }} />
            <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 13, color: T.darkText, letterSpacing: '-0.01em' }}>FranquIA</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: T.pill, textTransform: 'uppercase', marginTop: 18 }}>{moduleName || 'Aula'}</div>
          <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 23, letterSpacing: '-0.03em', lineHeight: 1.12, color: T.darkText, margin: '6px 0 0' }}>{lesson.title || 'Sem título'}</h1>
          {lesson.subtitle && <p style={{ fontFamily: DISP, fontSize: 13, lineHeight: 1.45, color: 'rgba(246,241,251,.6)', margin: '8px 0 0' }}>{lesson.subtitle}</p>}
        </div>
      </div>
      {/* blocos */}
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 18px 16px' }}>
        {(lesson.blocks || []).map((b, i) => <MobileBlock key={i} b={b} />)}
        {(!lesson.blocks || lesson.blocks.length === 0) && (
          <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, marginTop: 30, textAlign: 'center' }}>Esta aula ainda não tem conteúdo.</div>
        )}
        <div style={{ height: 14 }}></div>
      </div>
      {/* cta */}
      <div style={{ flex: '0 0 auto', padding: '12px 16px 30px', borderTop: `1px solid ${T.line}` }}>
        <div style={{ background: T.accent, color: '#fff', borderRadius: 13, padding: '14px', textAlign: 'center', fontFamily: DISP, fontWeight: 600, fontSize: 15 }}>Concluir aula</div>
      </div>
    </div>
  );
}

// ── modal de pré-visualização (Mobile / Desktop) ──────────────────
function PhonePreview({ open, onClose, courses }) {
  const [mode, setMode] = React.useState('mobile');
  if (!open) return null;
  const Seg = ({ id, label }) => (
    <div onClick={() => setMode(id)} style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, padding: '7px 16px', borderRadius: 99, cursor: 'pointer', color: mode === id ? T.ink : 'rgba(255,255,255,.7)', background: mode === id ? '#fff' : 'transparent' }}>{label}</div>
  );
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(20,16,25,.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 99, padding: 4 }}>
          <Seg id="mobile" label="Celular" /><Seg id="desktop" label="Desktop" />
        </div>
        {mode === 'mobile' ? (
          <div style={{ width: 266, height: 548, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) scale(0.625)', transformOrigin: 'top center' }}>
              <IOSDevice><CoApp narrow courses={courses} /></IOSDevice>
            </div>
          </div>
        ) : (() => {
          const s = Math.min(Math.min(window.innerWidth * 0.86, 1180) / 1180, Math.min(window.innerHeight * 0.72, 740) / 740);
          return (
            <div style={{ width: 1180 * s, height: 740 * s, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 1180, height: 740, transform: `scale(${s})`, transformOrigin: 'top left' }}>
                <div style={{ width: 1180, height: 740, background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
                  <div style={{ height: 36, background: '#211E2A', display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px' }}>
                    {['#E2502F', '#E2A33D', '#0E9A50'].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }}></div>)}
                    <div style={{ flex: 1, maxWidth: 360, margin: '0 auto', background: 'rgba(255,255,255,.1)', borderRadius: 7, padding: '4px 12px', fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,.6)', textAlign: 'center' }}>app.franquia.ia/camila</div>
                  </div>
                  <div style={{ height: 704 }}><CoApp courses={courses} /></div>
                </div>
              </div>
            </div>
          );
        })()}
        <div onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.25)', color: '#fff', borderRadius: 99, padding: '10px 20px', fontFamily: DISP, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          Fechar pré-visualização
        </div>
      </div>
    </div>
  );
}

export { MobileBlock, StudentLessonView, PhonePreview };
