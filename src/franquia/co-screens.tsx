import React from 'react';
import { DEFAULT_OFFER, LOCK_ICON, PaywallModal, StudentTabBar } from './author-app';
import { DeskSidebar } from './author-app-desktop';
import { AIC } from './author-kit';
import { CO_COURSES, CoCover, Row, allLessons, coDarken, coLighten, coRgba, coTheme, courseProgress, firstOpenLessonInModule, lessonLocked, moduleDuration, moduleProgress, nextLessonInModule } from './co-app';
import { MentorIA, Perfil, Suporte } from './co-tabs';
import { DISP, IC, Ico, MONO, Mark, T } from './kit';

const { useState: useStateCO } = React;

// Produtos & Cursos — telas (Vitrine · Curso · Player) + container. Reusa co-app.jsx.

function CoVitrine({ courses, progress, openCourse, studentName }) {
  const primeiroNome = (studentName || '').trim().split(' ')[0] || 'que bom te ver';
  const [slide, setSlide] = React.useState(0);
  const [chip, setChip] = React.useState('Tudo');
  const kinds = [];
  courses.forEach((c) => { if (!kinds.includes(c.kind)) kinds.push(c.kind); });
  const chips = ['Tudo', ...kinds];
  const slides = [];
  courses.forEach((c) => { const bs = (c.banners && c.banners.length) ? c.banners : [null]; bs.forEach((img) => slides.push({ c, img })); });
  const cur = slides[slide % slides.length];
  const feat = cur.c;
  const bannerImg = cur.img;
  const shown = chip === 'Tudo' ? courses : courses.filter((c) => c.kind === chip);
  React.useEffect(() => { if (slides.length < 2) return; const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000); return () => clearInterval(t); }, [slides.length]);

  return (
    <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
      {/* banner carrossel */}
      <div style={{ padding: '24px 28px 0' }}>
        <div style={{ position: 'relative', height: 220, borderRadius: 20, overflow: 'hidden', background: bannerImg ? `center/cover no-repeat url("${bannerImg}")` : coTheme(feat.color) }}>
          {!bannerImg && <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 16px, rgba(255,255,255,0) 16px 32px)' }}></div>}
          {bannerImg && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,.6), rgba(0,0,0,.15))' }}></div>}
          {!bannerImg && <div style={{ position: 'absolute', right: -20, top: 0, opacity: 0.18 }}><Mark size={180} front="#fff" ghost="#fff" inner="transparent" /></div>}
          <div style={{ position: 'absolute', inset: 0, padding: '30px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 560 }}>
            <span style={{ alignSelf: 'flex-start', fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: coDarken(feat.color, .35), background: '#fff', padding: '5px 11px', borderRadius: 8 }}>● {feat.kind.toUpperCase()}</span>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em', color: '#fff', marginTop: 12, lineHeight: 1.05 }}>{feat.title}</div>
            <div style={{ fontFamily: DISP, fontSize: 14.5, color: 'rgba(255,255,255,.82)', marginTop: 6 }}>{feat.subtitle}</div>
            <button onClick={() => openCourse(feat.id)} style={{ alignSelf: 'flex-start', marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: coDarken(feat.color, .3), border: 'none', borderRadius: 11, padding: '11px 20px', fontFamily: DISP, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Acessar <Ico d={AIC.chevron} size={15} c={coDarken(feat.color, .3)} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
          {/* setas */}
          <div onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Ico d={AIC.chevron} size={20} c="#fff" style={{ transform: 'rotate(90deg)' }} /></div>
          <div onClick={() => setSlide((s) => (s + 1) % slides.length)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Ico d={AIC.chevron} size={20} c="#fff" style={{ transform: 'rotate(-90deg)' }} /></div>
          {/* dots */}
          <div style={{ position: 'absolute', right: 22, bottom: 16, display: 'flex', gap: 7 }}>
            {slides.map((_, i) => <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide % slides.length ? 22 : 8, height: 8, borderRadius: 99, background: i === slide % slides.length ? '#fff' : 'rgba(255,255,255,.45)', cursor: 'pointer', transition: 'width .2s' }}></div>)}
          </div>
        </div>
      </div>

      {/* saudação */}
      <div style={{ padding: '24px 28px 0' }}>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 28, letterSpacing: '-0.03em', color: T.ink }}>Olá, {primeiroNome}.</div>
        <div style={{ fontFamily: DISP, fontSize: 15, color: T.dim, marginTop: 5 }}>Sua trilha é <span style={{ color: T.accent, fontWeight: 600 }}>{courses[0] ? courses[0].title : 'seu curso'}</span> — vamos avançar mais uma etapa hoje.</div>
      </div>

      {/* quick cards */}
      <div style={{ display: 'flex', gap: 14, padding: '16px 28px 0', flexWrap: 'wrap' }}>
        {[['Minha jornada', 'Trilha gamificada', AIC.list], ['Mentor IA', 'Tire dúvidas agora', AIC.spark || IC.spark]].map(([t, s, d], i) => (
          <div key={i} style={{ flex: '1 1 240px', minWidth: 200, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 13, boxShadow: '0 2px 10px rgba(24,18,31,.04)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={d} size={20} c={T.accentDeep} /></div>
            <div><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15, color: T.ink }}>{t}</div><div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim, marginTop: 2 }}>{s}</div></div>
          </div>
        ))}
      </div>

      {/* ecossistema */}
      <div style={{ padding: '28px 28px 8px' }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', color: T.accentDeep, fontWeight: 600 }}>SEU ECOSSISTEMA</div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em', color: T.ink, marginTop: 2 }}>Acessos</div>
        <div style={{ display: 'flex', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
          {chips.map((c) => {
            const on = c === chip;
            return <span key={c} onClick={() => setChip(c)} style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, padding: '8px 16px', borderRadius: 99, cursor: 'pointer', background: on ? T.accent : '#fff', color: on ? '#fff' : T.dim, border: `1px solid ${on ? T.accent : T.line}` }}>{c}</span>;
          })}
        </div>
      </div>
      <div style={{ padding: '4px 28px 24px' }}>
        <Row>
          {shown.map((c) => {
            const pct = courseProgress(c, progress);
            return (
              <div key={c.id} onClick={() => openCourse(c.id)} style={{ width: 220, flex: '0 0 auto', cursor: 'pointer' }}>
                <CoCover color={c.color} img={c.coverImg || null} label={c.kind} title={c.title} h={150} locked={c.locked} progress={pct} />
                <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim, marginTop: 8 }}>{pct > 0 ? `${pct}% concluído` : `${allLessons(c).length} aulas`}</div>
              </div>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

function CoCourse({ course, progress, app }) {
  const pct = courseProgress(course, progress);
  const totalLessons = allLessons(course).length;
  const totalMin = course.modules.reduce((a, m) => a + moduleDuration(m), 0);
  const started = pct > 0;
  let resumeMod = null, resumeLesson = null;
  for (const m of course.modules) { const nx = m.lessons.find((l) => !progress[l.id]); if (nx) { resumeMod = m; resumeLesson = nx; break; } }
  const locked = course.locked && !app.unlocked[course.id];
  const moduleHasSample = (m) => m.lessons.some((l) => l.sample);
  const openModule = (m) => {
    if (!locked) return app.openLesson(course.id, nextLessonInModule(m, progress).id, m.id);
    const s = firstOpenLessonInModule(course, m, app.unlocked);
    return s ? app.openLesson(course.id, s.id, m.id) : app.openPaywall(course.id);
  };
  const cont = () => { if (locked) return app.openPaywall(course.id); const m = resumeMod || course.modules[0], l = resumeLesson || m.lessons[0]; app.openLesson(course.id, l.id, m.id); };

  return (
    <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
      {/* hero */}
      <div style={{ position: 'relative', padding: '0', background: coTheme(course.color) }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 16px, rgba(255,255,255,0) 16px 32px)' }}></div>
        <div style={{ position: 'absolute', right: -30, top: 10, opacity: 0.18 }}><Mark size={220} front="#fff" ghost="#fff" inner="transparent" /></div>
        <div style={{ position: 'relative', padding: '26px 36px 32px', maxWidth: 720 }}>
          <button onClick={() => app.go('home')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,.28)', color: '#fff', border: 'none', borderRadius: 99, padding: '8px 14px', fontFamily: DISP, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}><Ico d={AIC.chevron} size={16} c="#fff" style={{ transform: 'rotate(90deg)' }} />Voltar ao início</button>
          <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.12em', color: 'rgba(255,255,255,.85)', textTransform: 'uppercase', marginTop: 22 }}>{course.kind}</div>
          <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 40, letterSpacing: '-0.035em', lineHeight: 1.04, color: '#fff', margin: '6px 0 0' }}>{course.title}</h1>
          <div style={{ fontFamily: DISP, fontSize: 16.5, color: 'rgba(255,255,255,.82)', marginTop: 10, maxWidth: 560 }}>{course.subtitle}</div>
          <div style={{ display: 'flex', gap: 22, marginTop: 18, fontFamily: DISP, fontSize: 13.5, color: 'rgba(255,255,255,.8)' }}>
            <span><b style={{ color: '#fff' }}>{course.modules.length}</b> módulos</span>
            <span><b style={{ color: '#fff' }}>{totalLessons}</b> aulas</span>
            <span><b style={{ color: '#fff' }}>{Math.round(totalMin / 60 * 10) / 10}h</b> de conteúdo</span>
            <span><b style={{ color: '#fff' }}>{course.students.toLocaleString('pt-BR')}</b> alunos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 22 }}>
            <button onClick={cont} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', color: coDarken(course.color, .3), border: 'none', borderRadius: 12, padding: '14px 24px', fontFamily: DISP, fontWeight: 700, fontSize: 15.5, cursor: 'pointer', boxShadow: '0 12px 30px rgba(0,0,0,.25)' }}>
              <Ico d={AIC.play} size={17} c={coDarken(course.color, .3)} fill={coDarken(course.color, .3)} />{started ? 'Continuar de onde parou' : 'Começar agora'}
            </button>
            {started && resumeLesson && <span style={{ color: 'rgba(255,255,255,.85)', fontFamily: DISP, fontSize: 13.5, fontWeight: 600 }}>{resumeLesson.title}</span>}
            {locked && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#fff', fontFamily: DISP, fontSize: 13.5, fontWeight: 600 }}><Ico d={LOCK_ICON} size={15} c="#fff" />Premium</span>}
          </div>
          {started && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, maxWidth: 420 }}>
              <div style={{ flex: 1, height: 7, borderRadius: 99, background: 'rgba(255,255,255,.25)', overflow: 'hidden' }}><div style={{ width: pct + '%', height: '100%', background: `linear-gradient(90deg, ${coLighten(course.color, .2)}, #fff)` }}></div></div>
              <span style={{ fontFamily: MONO, fontSize: 12.5, color: '#fff', fontWeight: 600 }}>{pct}%</span>
            </div>
          )}
        </div>
      </div>

      {/* módulos */}
      <div style={{ padding: '26px 32px 30px' }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', color: T.accentDeep, fontWeight: 600 }}>CONTEÚDO DO CURSO</div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: T.ink, margin: '2px 0 14px' }}>Módulos</div>
        <Row>
          {course.modules.map((m, i) => {
            const mp = moduleProgress(m, progress);
            const allDone = mp === 100;
            const mLocked = locked && !moduleHasSample(m);
            const mSample = locked && moduleHasSample(m);
            const state = mLocked ? 'Desbloquear' : mSample ? 'Ver amostra' : allDone ? 'Revisar módulo' : mp > 0 ? 'Continuar módulo' : 'Começar módulo';
            return (
              <div key={m.id} onClick={() => openModule(m)} style={{ width: 240, flex: '0 0 auto', cursor: 'pointer' }}>
                <CoCover color={course.color} img={m.coverImg} num={`Módulo ${String(i + 1).padStart(2, '0')}`} h={130} progress={mLocked ? null : mp}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={mLocked ? LOCK_ICON : AIC.play} size={20} c={course.color} fill={mLocked ? 'none' : course.color} /></span></div>
                  {mSample && <span style={{ position: 'absolute', top: 10, right: 10, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', color: '#fff', background: 'rgba(0,0,0,.45)', padding: '4px 8px', borderRadius: 6 }}>AMOSTRA</span>}
                </CoCover>
                <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15, color: T.ink, marginTop: 10 }}>{m.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 4 }}>
                  <span>{m.lessons.length} aulas</span><span style={{ width: 3, height: 3, borderRadius: '50%', background: T.dim }}></span><span>{moduleDuration(m)} min</span>{mp > 0 && !allDone && !mLocked && <><span style={{ width: 3, height: 3, borderRadius: '50%', background: T.dim }}></span><span>{mp}%</span></>}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DISP, fontWeight: 600, fontSize: 12.5, color: course.color, marginTop: 6 }}><Ico d={mLocked ? LOCK_ICON : allDone ? AIC.check : AIC.play} size={13} c={course.color} />{state}</div>
              </div>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

// Render dos blocos reais da aula (semente do app do aluno) — tema escuro do player.
function StudentBlocks({ blocks, color }) {
  if (!blocks || !blocks.length) return null;
  return (
    <div style={{ maxWidth: 620, marginTop: 8 }}>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'heading':
            return <h3 key={i} style={{ fontFamily: DISP, fontWeight: 700, fontSize: 19, letterSpacing: '-0.02em', color: T.darkText, margin: '26px 0 0' }}>{b.text}</h3>;
          case 'list':
            return (
              <ul key={i} style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(b.items || []).map((it, j) => (
                  <li key={j} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontFamily: DISP, fontSize: 15, lineHeight: 1.5, color: 'rgba(246,241,251,.8)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: coLighten(color, .2), marginTop: 8, flex: '0 0 auto' }} />{it}
                  </li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <div key={i} style={{ margin: '20px 0 0', borderLeft: `3px solid ${coLighten(color, .2)}`, paddingLeft: 16 }}>
                <div style={{ fontFamily: DISP, fontWeight: 500, fontSize: 17, lineHeight: 1.45, color: T.darkText }}>{b.text}</div>
                {b.cite && <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(246,241,251,.5)', marginTop: 8 }}>{b.cite}</div>}
              </div>
            );
          case 'video':
            return (
              <div key={i} style={{ margin: '18px 0 0', borderRadius: 12, overflow: 'hidden', aspectRatio: '16 / 9', background: '#000', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, ${coRgba(color, .4)}, rgba(0,0,0,.3) 65%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={AIC.play} size={22} c={color} fill={color} /></span>
                </div>
              </div>
            );
          case 'divider':
            return <div key={i} style={{ height: 1, background: 'rgba(246,241,251,.12)', margin: '24px 0 6px' }} />;
          case 'paragraph':
          default:
            return b.text ? <p key={i} style={{ fontFamily: DISP, fontSize: 15.5, lineHeight: 1.68, color: 'rgba(246,241,251,.82)', margin: '14px 0 0', maxWidth: 620 }}>{b.text}</p> : null;
        }
      })}
    </div>
  );
}

function CoPlayer({ course, lesson, progress, app, narrow }) {
  const flat = course.modules.flatMap((m) => m.lessons.map((l) => ({ l, m })));
  const idx = flat.findIndex((x) => x.l.id === lesson.id);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;
  const activeMod = course.modules.find((m) => m.id === app.route.moduleId) || course.modules.find((m) => m.lessons.some((l) => l.id === lesson.id)) || course.modules[0];
  const mIdx = course.modules.indexOf(activeMod);
  const done = !!progress[lesson.id];

  const Side = (
    <div style={{ width: narrow ? '100%' : 320, flex: '0 0 auto', borderLeft: narrow ? 'none' : `1px solid ${T.line}`, borderTop: narrow ? `1px solid ${T.line}` : 'none', background: '#fff', overflow: 'auto' }}>
      <div style={{ padding: '18px 20px 8px' }}>
        <button onClick={() => app.openCourse(course.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: T.accent, fontFamily: DISP, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', padding: 0 }}><Ico d={AIC.chevron} size={15} c={T.accent} style={{ transform: 'rotate(90deg)' }} />{course.title}</button>
        <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', color: T.accentDeep, textTransform: 'uppercase', marginTop: 14 }}>Módulo {String(mIdx + 1).padStart(2, '0')}</div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 17, color: T.ink }}>{activeMod.title}</div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 2 }}>{activeMod.lessons.length} aulas · {moduleDuration(activeMod)} min</div>
      </div>
      <div style={{ padding: '6px 12px' }}>
        {activeMod.lessons.map((l) => {
          const ld = !!progress[l.id];
          const on = l.id === lesson.id;
          const llock = lessonLocked(course, l, app.unlocked);
          return (
            <div key={l.id} onClick={() => llock ? app.openPaywall(course.id) : app.openLesson(course.id, l.id, activeMod.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 10px', borderRadius: 10, cursor: 'pointer', background: on ? coRgba(course.color, .1) : 'transparent', opacity: llock ? 0.7 : 1 }}>
              {llock
                ? <span style={{ width: 24, height: 24, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={LOCK_ICON} size={15} c={T.dim} /></span>
                : <button onClick={(e) => { e.stopPropagation(); app.toggleLesson(l.id); }} style={{ width: 24, height: 24, borderRadius: '50%', flex: '0 0 auto', border: `1.5px solid ${ld ? course.color : T.line}`, background: ld ? course.color : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{ld && <Ico d={AIC.check} size={13} c="#fff" sw={2.6} />}</button>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim, marginTop: 1 }}>{l.sample && course.locked ? 'Amostra · ' : ''}{l.type === 'video' ? 'Vídeo' : l.type === 'audio' ? 'Áudio' : 'Leitura'} · {l.duration}</div>
              </div>
            </div>
          );
        })}
      </div>
      {mIdx < course.modules.length - 1 && (
        <div style={{ padding: '4px 20px 24px' }}>
          <button onClick={() => { const nm = course.modules[mIdx + 1]; app.openLesson(course.id, nextLessonInModule(nm, progress).id, nm.id); }} style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', border: `1.5px solid ${T.line}`, borderRadius: 11, padding: '12px', fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink, cursor: 'pointer' }}>Próximo módulo <Ico d={AIC.chevron} size={15} c={T.ink} style={{ transform: 'rotate(-90deg)' }} /></button>
        </div>
      )}
    </div>
  );

  const Stage = (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: T.darkBg, overflow: 'auto' }}>
      {(lesson.type === 'video' || lesson.type === 'audio') && (
      <div style={{ position: 'relative', background: '#000', aspectRatio: '16 / 9', flex: '0 0 auto' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, ${coRgba(course.color, .5)}, rgba(0,0,0,.4) 65%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(0,0,0,.4)' }}><Ico d={AIC.play} size={30} c={course.color} fill={course.color} /></span>
        </div>
        <div style={{ position: 'absolute', left: 18, top: 16, fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', color: 'rgba(255,255,255,.8)' }}>{course.title.toUpperCase()}</div>
      </div>
      )}
      {/* barra */}
      <div style={{ padding: '14px 20px', flex: '0 0 auto' }}>
        <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,.16)', overflow: 'hidden' }}><div style={{ width: done ? '100%' : '34%', height: '100%', background: coLighten(course.color, .25) }}></div></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button disabled={!prev} onClick={() => prev && app.openLesson(course.id, prev.l.id, prev.m.id)} style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid rgba(255,255,255,.2)`, background: 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: prev ? 'pointer' : 'default', opacity: prev ? 1 : 0.4 }}><Ico d={AIC.chevron} size={18} c="#fff" style={{ transform: 'rotate(90deg)' }} /></button>
            <button disabled={!next} onClick={() => next && app.openLesson(course.id, next.l.id, next.m.id)} style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid rgba(255,255,255,.2)`, background: 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: next ? 'pointer' : 'default', opacity: next ? 1 : 0.4 }}><Ico d={AIC.chevron} size={18} c="#fff" style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
          <button onClick={() => app.toggleLesson(lesson.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: done ? 'rgba(255,255,255,.14)' : coLighten(course.color, .05), color: '#fff', border: 'none', borderRadius: 11, padding: '11px 18px', fontFamily: DISP, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}><Ico d={AIC.check} size={16} c="#fff" sw={2.4} />{done ? 'Concluída' : 'Marcar como concluída'}</button>
        </div>
      </div>
      <div style={{ padding: '8px 20px 24px', flex: 1 }}>
        <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', color: coLighten(course.color, .35), textTransform: 'uppercase' }}>{lesson.type === 'video' ? 'Vídeo' : 'Aula'} · {lesson.duration}</div>
        <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em', color: T.darkText, margin: '8px 0 12px' }}>{lesson.title}</h1>
        {lesson.blocks && lesson.blocks.length
          ? <StudentBlocks blocks={lesson.blocks} color={course.color} />
          : <p style={{ fontFamily: DISP, fontSize: 14.5, lineHeight: 1.6, color: 'rgba(246,241,251,.6)', marginTop: 10, maxWidth: 560 }}>{lesson.desc || 'Conteúdo da aula. No produto final, aqui toca o vídeo/áudio ou aparece o texto da aula.'}</p>}
      </div>
    </div>
  );

  if (narrow) return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>{Stage}{Side}</div>;
  return <div style={{ height: '100%', display: 'flex' }}>{Stage}{Side}</div>;
}

// ── container ─────────────────────────────────────────────────────
// Header de topo do app do aluno no MOBILE — FIXO (não rola). Marca + busca + tema.
function MobileTopBar({ creator }) {
  const MOON = 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z';
  return (
    <div style={{ flex: '0 0 auto', background: T.darkBg, display: 'flex', alignItems: 'center', gap: 11, padding: 'calc(env(safe-area-inset-top, 0px) + 13px) 16px 13px', borderBottom: '1px solid rgba(196,163,255,.12)' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Mark size={17} front="#fff" ghost={T.pill} inner={T.accent} /></div>
      <div style={{ flex: 1, minWidth: 0, fontFamily: DISP, fontWeight: 600, fontSize: 16.5, color: T.darkText, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{creator?.name || 'FranquIA'}</div>
      <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={IC.search} size={19} c="rgba(246,241,251,.72)" /></div>
      <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={MOON} size={19} c="rgba(246,241,251,.72)" /></div>
    </div>
  );
}

function CoApp({ courses, narrow, creator, studentName, onLogout }) {
  const data = courses && courses.length ? courses : CO_COURSES;
  const [progress, setProgress] = useStateCO({ 'fia-1': true, 'fia-2': true });
  const [unlocked, setUnlocked] = useStateCO({});
  const [route, setRoute] = useStateCO({ name: 'home' });
  const [pay, setPay] = useStateCO(null);
  const [tab, setTab] = useStateCO('inicio');

  const app = {
    route,
    unlocked,
    go: (name) => setRoute({ name }),
    openCourse: (courseId) => setRoute({ name: 'course', courseId }),
    openLesson: (courseId, lessonId, moduleId) => setRoute({ name: 'player', courseId, lessonId, moduleId }),
    openPaywall: (courseId) => setPay(courseId),
    toggleLesson: (id) => setProgress((p) => ({ ...p, [id]: !p[id] })),
  };
  const course = data.find((c) => c.id === route.courseId);

  let body;
  if (tab !== 'inicio') {
    const accent = (data[0] && data[0].color) || T.accent;
    if (tab === 'mentor') body = <MentorIA accent={accent} />;
    else if (tab === 'suporte') body = <Suporte accent={accent} />;
    else if (tab === 'perfil') body = <Perfil accent={accent} courses={data} progress={progress} onLogout={onLogout} />;
    else body = <CoVitrine courses={data} progress={progress} openCourse={app.openCourse} studentName={studentName} />;
  } else if (route.name === 'course' && course) {
    body = <CoCourse course={course} progress={progress} app={app} />;
  } else if (route.name === 'player' && course) {
    const lesson = allLessons(course).find((l) => l.id === route.lessonId) || course.modules[0].lessons[0];
    body = <CoPlayer course={course} lesson={lesson} progress={progress} app={app} narrow={narrow} />;
  } else {
    body = <CoVitrine courses={data} progress={progress} openCourse={app.openCourse} studentName={studentName} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', height: '100%', background: T.paper, fontFamily: DISP, position: 'relative', overflow: 'hidden' }}>
      {narrow && <MobileTopBar creator={creator || { name: 'Camila Oliveira' }} />}
      {!narrow && <DeskSidebar creator={creator || { name: 'Camila Oliveira' }} studentName={studentName} active={tab} onTab={(t) => { setTab(t); if (t === 'inicio') setRoute({ name: 'home' }); }} />}
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', overflow: 'hidden' }}>{body}</div>
      {pay && <PaywallModal offer={(data.find((c) => c.id === pay) || {}).offer || DEFAULT_OFFER} onClose={() => setPay(null)} />}
      {narrow && <StudentTabBar active={tab} onTab={(t) => { setTab(t); if (t === 'inicio') setRoute({ name: 'home' }); }} />}
    </div>
  );
}

export { CoApp };
