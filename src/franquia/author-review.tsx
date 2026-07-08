import React from 'react';
import { ABtn, AIC, AuthorShell, CoverField, DraftBadge } from './author-kit';
import { PhonePreview } from './author-preview';
import { DBtn, DShell } from './desktop-screens-1';
import { DISP, Ico, MONO, T, useIsMobile } from './kit';

// Tela 1 — Mesa de revisão (interativa + edição de conteúdo). Reusa author-kit + author-preview.

const { useState: useStateRev, useRef: useRefRev } = React;

// API: GET /courses/:id/lessons?status=draft  (+ conteúdo e proveniência)
const REVIEW_INIT = [
  {
    title: 'Estruturando a primeira campanha',
    subtitle: 'Como montar a estrutura inicial sem queimar orçamento.',
    blocks: [
      { kind: 'video', title: 'vídeo sem legenda', meta: 'strapcast · sem referência', hint: 'tocará no app do aluno', warn: true },
      { kind: 'heading', text: 'Antes de gastar', page: 2 },
      { kind: 'text', text: 'Defina o público antes do anúncio. Comece amplo e deixe o algoritmo otimizar nos primeiros dias antes de estreitar a segmentação.', page: 2 },
      { kind: 'list', items: ['1 campanha por objetivo', '2 a 3 conjuntos de anúncios', 'Orçamento diário baixo para testar'], page: 2 },
      { kind: 'quote', text: 'Quem testa pequeno aprende rápido e erra barato.', cite: '— do material-fonte, p. 3', page: 3 },
    ],
    provenance: { pages: 'p. 2, 3', confidence: 0.78, note: 'Texto-fonte lado a lado chega na v2 — depende da orquestração persistir o texto extraído do PDF.' },
  },
  {
    title: 'Criativos que convertem no feed',
    subtitle: 'O que faz alguém parar de rolar e prestar atenção.',
    blocks: [
      { kind: 'heading', text: 'O primeiro segundo', page: 5 },
      { kind: 'text', text: 'O criativo precisa entregar a promessa nos primeiros instantes. Som, legenda e um gancho visual claro decidem se a pessoa fica.', page: 5 },
      { kind: 'list', items: ['Gancho nos 3 primeiros segundos', 'Legenda sempre embutida', 'Uma ideia por criativo'], page: 6 },
      { kind: 'quote', text: 'Criativo bom não é o mais bonito — é o mais claro.', cite: '— do material-fonte, p. 6', page: 6 },
    ],
    provenance: { pages: 'p. 5, 6', confidence: 0.64, note: 'Confiança menor: a fonte tem trechos manuscritos. Vale revisar a lista com atenção.' },
  },
];

const PALETTE_R = [['Texto', 'text', AIC.paragraph], ['Título', 'heading', AIC.text], ['Vídeo', 'video', AIC.video], ['Citação', 'quote', AIC.quote], ['Lista', 'list', AIC.list], ['Imagem', 'image', AIC.image]];
function newBlockR(kind) {
  if (kind === 'heading') return { kind, text: 'Novo título' };
  if (kind === 'list') return { kind, items: ['Novo item'] };
  if (kind === 'quote') return { kind, text: '', cite: '' };
  if (kind === 'video') return { kind, title: 'novo-video.mp4', meta: 'enviar arquivo' };
  if (kind === 'image') return { kind, caption: 'legenda da imagem' };
  return { kind: 'text', text: '' };
}
const grow = (e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; };
const setH = (el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } };
const fldR = { fontFamily: DISP, width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'none', padding: 0, color: 'rgba(24,18,31,.82)' };

function ReviewDeskScreen({ scope }) {
  const isFAdmin = scope === 'franquia';
  const [lessons, setLessons] = useStateRev(REVIEW_INIT);
  const [sel, setSel] = useStateRev(0);
  const [banner, setBanner] = useStateRev(0);
  const [modCover, setModCover] = useStateRev(1);
  const [approved, setApproved] = useStateRev([false, false]);
  const [preview, setPreview] = useStateRev(false);
  const [dragIdx, setDragIdx] = useStateRev(null);
  const dragRef = useRefRev(null);
  const mobile = useIsMobile();

  const lesson = lessons[sel];
  const conf = Math.round(lesson.provenance.confidence * 100);
  const doneCount = approved.filter(Boolean).length;
  const isApproved = approved[sel];

  const approve = () => setApproved((a) => a.map((v, i) => (i === sel ? true : v)));
  const updateLesson = (fn) => setLessons((ls) => ls.map((l, i) => (i === sel ? fn(l) : l)));
  const updateBlocks = (fn) => updateLesson((l) => ({ ...l, blocks: fn(l.blocks) }));
  const addBlock = (kind) => updateBlocks((bs) => [...bs, newBlockR(kind)]);
  const delBlock = (bi) => updateBlocks((bs) => bs.filter((_, i) => i !== bi));
  const patchBlock = (bi, patch) => updateBlocks((bs) => bs.map((b, i) => (i === bi ? { ...b, ...patch } : b)));
  const moveBlock = (from, to) => updateBlocks((bs) => { const a = [...bs]; const [x] = a.splice(from, 1); a.splice(to, 0, x); return a; });
  const startDrag = (e, index) => {
    e.preventDefault(); dragRef.current = index; setDragIdx(index);
    const onMove = (ev) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const row = el && el.closest && el.closest('[data-rbidx]');
      if (!row) return;
      const to = Number(row.getAttribute('data-rbidx')); const from = dragRef.current;
      if (!Number.isNaN(to) && to !== from) { moveBlock(from, to); dragRef.current = to; setDragIdx(to); }
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); dragRef.current = null; setDragIdx(null); };
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  };

  const EditB = ({ bi, label, page, children }) => (
    <div data-rbidx={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14, opacity: dragIdx === bi ? 0.4 : 1, borderRadius: 13, boxShadow: dragIdx === bi ? `inset 0 0 0 1.5px ${T.accent}` : 'none' }}>
      <div onMouseDown={(e) => startDrag(e, bi)} title="arraste para reordenar" style={{ width: 22, flex: '0 0 auto', display: 'flex', justifyContent: 'center', paddingTop: 16, color: 'rgba(24,18,31,.3)', cursor: 'grab' }}><Ico d={AIC.grip} size={16} c="rgba(24,18,31,.3)" /></div>
      <div style={{ flex: 1, minWidth: 0, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 12, padding: '13px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim, letterSpacing: '0.06em' }}>{label}</span>
          {page && <span style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(24,18,31,.35)' }}>fonte p.{page}</span>}
        </div>
        {children}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8, flex: '0 0 auto' }}>
        <div onClick={() => { if (bi > 0) moveBlock(bi, bi - 1); }} title="mover para cima" style={{ width: 30, height: 26, borderRadius: 8, background: T.paper, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: bi > 0 ? 'pointer' : 'default', opacity: bi > 0 ? 1 : 0.35 }}><Ico d="M6 15l6-6 6 6" size={14} c={T.dim} /></div>
        <div onClick={() => { if (bi < lesson.blocks.length - 1) moveBlock(bi, bi + 1); }} title="mover para baixo" style={{ width: 30, height: 26, borderRadius: 8, background: T.paper, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: bi < lesson.blocks.length - 1 ? 'pointer' : 'default', opacity: bi < lesson.blocks.length - 1 ? 1 : 0.35 }}><Ico d="M6 9l6 6 6-6" size={14} c={T.dim} /></div>
        <div onClick={() => delBlock(bi)} title="excluir" style={{ width: 30, height: 26, borderRadius: 8, background: T.paper, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Ico d={AIC.trash} size={14} c={T.dim} /></div>
      </div>
    </div>
  );

  const renderBlock = (b, bi) => {
    if (b.kind === 'heading') return <EditB key={bi} bi={bi} label="TÍTULO" page={b.page}><input value={b.text} onChange={(e) => patchBlock(bi, { text: e.target.value })} style={{ ...fldR, fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', color: T.ink }} /></EditB>;
    if (b.kind === 'text') return <EditB key={bi} bi={bi} label="TEXTO" page={b.page}><textarea value={b.text} placeholder="Escreva o texto…" onChange={(e) => patchBlock(bi, { text: e.target.value })} onInput={grow} ref={setH} style={{ ...fldR, fontSize: 16, lineHeight: 1.65 }} /></EditB>;
    if (b.kind === 'list') return (
      <EditB key={bi} bi={bi} label="LISTA" page={b.page}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {b.items.map((it, ii) => (
            <div key={ii} style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, flex: '0 0 auto' }}></span>
              <input value={it} onChange={(e) => patchBlock(bi, { items: b.items.map((x, k) => (k === ii ? e.target.value : x)) })} style={{ ...fldR, fontSize: 15.5 }} />
              <div onClick={() => patchBlock(bi, { items: b.items.filter((_, k) => k !== ii) })} style={{ cursor: 'pointer', flex: '0 0 auto' }}><Ico d={AIC.trash} size={13} c={T.dim} /></div>
            </div>
          ))}
          <div onClick={() => patchBlock(bi, { items: [...b.items, 'Novo item'] })} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: DISP, fontWeight: 600, fontSize: 12.5, color: T.accent, cursor: 'pointer', marginTop: 2 }}><Ico d={AIC.plus} size={13} c={T.accent} />item</div>
        </div>
      </EditB>
    );
    if (b.kind === 'quote') return (
      <EditB key={bi} bi={bi} label="CITAÇÃO" page={b.page}>
        <div style={{ borderLeft: `3px solid ${T.accent}`, paddingLeft: 14 }}>
          <textarea value={b.text} placeholder="Texto da citação…" onChange={(e) => patchBlock(bi, { text: e.target.value })} onInput={grow} ref={setH} style={{ ...fldR, fontSize: 19, fontWeight: 500, color: T.ink, lineHeight: 1.4 }} />
          <input value={b.cite} placeholder="— fonte (opcional)" onChange={(e) => patchBlock(bi, { cite: e.target.value })} style={{ ...fldR, fontFamily: MONO, fontSize: 12, color: T.dim, marginTop: 8 }} />
        </div>
      </EditB>
    );
    if (b.kind === 'video') return (
      <EditB key={bi} bi={bi} label="VÍDEO" page={b.page}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 11, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={AIC.play} size={20} c={T.accent} fill={T.accent} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <input value={b.title} onChange={(e) => patchBlock(bi, { title: e.target.value })} style={{ ...fldR, fontWeight: 600, fontSize: 15, color: b.warn ? T.warning : T.ink }} />
            <div style={{ fontFamily: MONO, fontSize: 11.5, color: T.dim, marginTop: 2 }}>{b.meta}</div>
          </div>
        </div>
      </EditB>
    );
    if (b.kind === 'image') return (
      <EditB key={bi} bi={bi} label="IMAGEM" page={b.page}>
        <div style={{ height: 120, borderRadius: 10, background: 'repeating-linear-gradient(135deg, rgba(24,18,31,.05) 0 10px, rgba(24,18,31,.08) 10px 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={AIC.image} size={22} c="rgba(24,18,31,.4)" /></div>
        <input value={b.caption} onChange={(e) => patchBlock(bi, { caption: e.target.value })} style={{ ...fldR, fontFamily: MONO, fontSize: 11.5, color: T.dim, marginTop: 8 }} />
      </EditB>
    );
    return null;
  };

  if (isFAdmin) return (
    <DShell active="fadmin" sub="Admin · Catálogo Franquia" title="Mesa de revisão" bleed
      action={<React.Fragment>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(124,58,237,.08)', border: `1px solid rgba(124,58,237,.22)`, borderRadius: 10, padding: '9px 14px', fontFamily: DISP, fontSize: 13.5, color: T.ink }}><Ico d={'M13 16h-1v-4h-1m1-4h.01'} size={16} c={T.accent} /><span>Ao aprovar, <b style={{ fontWeight: 600 }}>publica no Catálogo Franquia</b>.</span></div>
        <div onClick={() => setPreview(true)} style={{ cursor: 'pointer' }}><DBtn variant="ghost" icon={AIC.play}>Testar</DBtn></div>
      </React.Fragment>}>
      {/* 3 colunas — mesmo layout da revisão normal */}
      <div style={{ width: mobile ? '100%' : 300, flex: '0 0 auto', minWidth: 0, borderRight: mobile ? 'none' : `1px solid ${T.line}`, borderBottom: mobile ? `1px solid ${T.line}` : 'none', padding: '22px 18px', overflow: mobile ? 'visible' : 'auto' }}>
        <div style={{ marginBottom: 18 }}><CoverField value={banner} onPick={setBanner} h={84} title="Banner do app" /></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>Revisão de conteúdo</div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: T.dim }}>{doneCount}/{lessons.length}</div>
        </div>
        <div style={{ height: 4, borderRadius: 99, background: 'rgba(24,18,31,.08)', marginTop: 12 }}>
          <div style={{ width: `${(doneCount / lessons.length) * 100}%`, height: '100%', borderRadius: 99, background: T.accent, transition: 'width .3s ease' }}></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28 }}>
          <div style={{ width: 44, flex: '0 0 auto' }}><CoverField value={modCover} onPick={setModCover} h={34} radius={8} /></div>
          <span style={{ flex: 1, fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: T.dim, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tráfego pago para infopro…</span>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(14,154,80,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={AIC.bookmark} size={15} c={T.success} fill={T.success} /></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {lessons.map((l, i) => {
            const on = i === sel;
            return (
              <div key={i} onClick={() => setSel(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: on ? '#fff' : 'transparent', border: `1px solid ${on ? 'transparent' : T.line}`, boxShadow: on ? `inset 0 0 0 1.5px ${T.accent}, 0 6px 16px rgba(124,58,237,.1)` : 'none', borderRadius: 12, padding: '13px 14px' }}>
                <span style={{ flex: 1, fontFamily: DISP, fontWeight: on ? 600 : 500, fontSize: 14, color: on ? T.ink : 'rgba(24,18,31,.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                {approved[i] ? <DraftBadge tone="ok">aprovada</DraftBadge> : <DraftBadge />}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ flex: mobile ? '0 0 auto' : 1, width: mobile ? '100%' : 'auto', minWidth: mobile ? 0 : 440, padding: mobile ? '22px 18px' : '26px 34px', overflow: mobile ? 'visible' : 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          {isApproved ? <DraftBadge tone="ok">aprovada</DraftBadge> : <DraftBadge />}
          {isApproved ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: T.success, fontFamily: DISP, fontWeight: 600, fontSize: 14.5 }}><Ico d={AIC.check} size={18} c={T.success} sw={2.4} />Aula aprovada</div>
          ) : (
            <div onClick={approve} style={{ cursor: 'pointer' }}><DBtn>Aprovar aula</DBtn></div>
          )}
        </div>
        <input value={lesson.title} onChange={(e) => updateLesson((l) => ({ ...l, title: e.target.value }))} style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.035em', lineHeight: 1.1, color: T.ink, border: 'none', outline: 'none', background: 'transparent', padding: 0, margin: '20px 0 0', width: '100%', maxWidth: 560 }} />
        <textarea value={lesson.subtitle} onChange={(e) => updateLesson((l) => ({ ...l, subtitle: e.target.value }))} onInput={grow} ref={setH} style={{ ...fldR, fontSize: 16.5, lineHeight: 1.5, color: T.dim, margin: '12px 0 0', maxWidth: 520 }} />
        {lesson.blocks.map((b, bi) => renderBlock(b, bi))}
        <div style={{ marginTop: 24, marginLeft: 30, borderTop: `1px dashed ${T.line}`, paddingTop: 18 }}>
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.dim, marginBottom: 12 }}>Adicionar bloco</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{PALETTE_R.map(([label, kind, d]) => (<div key={kind} onClick={() => addBlock(kind)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 10, padding: '10px 15px', fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.ink, cursor: 'pointer' }}><Ico d={d} size={16} c={T.accent} />{label}</div>))}</div>
        </div>
        <div style={{ height: 30 }}></div>
      </div>
      <div style={{ width: mobile ? '100%' : 290, flex: '0 0 auto', minWidth: 0, borderLeft: mobile ? 'none' : `1px solid ${T.line}`, borderTop: mobile ? `1px solid ${T.line}` : 'none', padding: '22px 18px', overflow: mobile ? 'visible' : 'auto' }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', color: T.dim, textTransform: 'uppercase' }}>Proveniência</div>
        <div style={{ marginTop: 24 }}><div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim }}>Páginas-fonte</div><div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 17, color: T.ink, marginTop: 4 }}>{lesson.provenance.pages}</div></div>
        <div style={{ marginTop: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim }}>Confiança da IA</div><div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: T.ink }}>{lesson.provenance.confidence.toFixed(2)}</div></div>
          <div style={{ height: 8, borderRadius: 99, background: 'rgba(24,18,31,.08)', marginTop: 10, overflow: 'hidden' }}><div style={{ width: `${conf}%`, height: '100%', borderRadius: 99, background: conf >= 70 ? `linear-gradient(90deg, ${T.success}, #54C98A)` : `linear-gradient(90deg, ${T.warning}, #E8B860)`, transition: 'width .3s ease' }}></div></div>
        </div>
        <div style={{ marginTop: 26, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 12, padding: 16 }}><div style={{ fontFamily: DISP, fontSize: 13, lineHeight: 1.6, color: 'rgba(24,18,31,.6)' }}>{lesson.provenance.note}</div></div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 11, color: 'rgba(24,18,31,.4)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: T.warning }}></span>gerado por IA · revise antes de aprovar</div>
      </div>
      <PhonePreview open={preview} onClose={() => setPreview(false)} course={{ title: 'Tráfego pago para infoprodutores', cover: modCover, banner: banner, creator: { name: 'Camila Oliveira' }, modules: [{ name: 'Módulo 1 · Tráfego pago', cover: modCover, lessons: lessons }, { name: 'Módulo Premium · Mentoria Alto Ticket', cover: 1, locked: true, lessons: [] }] }} />
    </DShell>
  );

  return (
    <AuthorShell active="home" sub="Conteúdo" title="Mesa de revisão" plain
      toolbar={<div onClick={() => setPreview(true)} style={{ cursor: 'pointer' }}><ABtn variant="outline" icon={AIC.play} size="sm">Testar</ABtn></div>} bleed>
      {/* ── Col 1 · lista de aulas ── */}
      <div style={{ width: mobile ? '100%' : 300, flex: '0 0 auto', minWidth: 0, borderRight: mobile ? 'none' : `1px solid ${T.line}`, borderBottom: mobile ? `1px solid ${T.line}` : 'none', padding: '22px 18px', overflow: mobile ? 'visible' : 'auto' }}>
        <div style={{ marginBottom: 18 }}><CoverField value={banner} onPick={setBanner} h={84} title="Banner do app" /></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>Revisão de conteúdo</div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: T.dim }}>{doneCount}/{lessons.length}</div>
        </div>
        <div style={{ height: 4, borderRadius: 99, background: 'rgba(24,18,31,.08)', marginTop: 12 }}>
          <div style={{ width: `${(doneCount / lessons.length) * 100}%`, height: '100%', borderRadius: 99, background: T.accent, transition: 'width .3s ease' }}></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28 }}>
          <div style={{ width: 44, flex: '0 0 auto' }}><CoverField value={modCover} onPick={setModCover} h={34} radius={8} /></div>
          <span style={{ flex: 1, fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: T.dim, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tráfego pago para infopro…</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {lessons.map((l, i) => {
            const on = i === sel;
            return (
              <div key={i} onClick={() => setSel(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: on ? '#fff' : 'transparent', border: `1px solid ${on ? 'transparent' : T.line}`, boxShadow: on ? `inset 0 0 0 1.5px ${T.accent}, 0 6px 16px rgba(124,58,237,.1)` : 'none', borderRadius: 12, padding: '13px 14px' }}>
                <span style={{ flex: 1, fontFamily: DISP, fontWeight: on ? 600 : 500, fontSize: 14, color: on ? T.ink : 'rgba(24,18,31,.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                {approved[i] ? <DraftBadge tone="ok">aprovada</DraftBadge> : <DraftBadge />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Col 2 · conteúdo editável ── */}
      <div style={{ flex: mobile ? '0 0 auto' : 1, width: mobile ? '100%' : 'auto', minWidth: mobile ? 0 : 440, padding: mobile ? '22px 18px' : '26px 34px', overflow: mobile ? 'visible' : 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          {isApproved ? <DraftBadge tone="ok">aprovada</DraftBadge> : <DraftBadge />}
          {isApproved ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: T.success, fontFamily: DISP, fontWeight: 600, fontSize: 14.5 }}><Ico d={AIC.check} size={18} c={T.success} sw={2.4} />Aula aprovada</div>
          ) : (
            <div onClick={approve} style={{ cursor: 'pointer' }}><ABtn icon={AIC.check}>Aprovar aula</ABtn></div>
          )}
        </div>

        <input value={lesson.title} onChange={(e) => updateLesson((l) => ({ ...l, title: e.target.value }))} style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.035em', lineHeight: 1.1, color: T.ink, border: 'none', outline: 'none', background: 'transparent', padding: 0, margin: '20px 0 0', width: '100%', maxWidth: 560 }} />
        <textarea value={lesson.subtitle} onChange={(e) => updateLesson((l) => ({ ...l, subtitle: e.target.value }))} onInput={grow} ref={setH} style={{ ...fldR, fontSize: 16.5, lineHeight: 1.5, color: T.dim, margin: '12px 0 0', maxWidth: 520 }} />

        {lesson.blocks.map((b, bi) => renderBlock(b, bi))}

        <div style={{ marginTop: 24, marginLeft: 30, borderTop: `1px dashed ${T.line}`, paddingTop: 18 }}>
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.dim, marginBottom: 12 }}>Adicionar bloco</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PALETTE_R.map(([label, kind, d]) => (
              <div key={kind} onClick={() => addBlock(kind)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 10, padding: '10px 15px', fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.ink, cursor: 'pointer' }}><Ico d={d} size={16} c={T.accent} />{label}</div>
            ))}
          </div>
        </div>
        <div style={{ height: 30 }}></div>
      </div>

      {/* ── Col 3 · proveniência ── */}
      <div style={{ width: mobile ? '100%' : 290, flex: '0 0 auto', minWidth: 0, borderLeft: mobile ? 'none' : `1px solid ${T.line}`, borderTop: mobile ? `1px solid ${T.line}` : 'none', padding: '22px 18px', overflow: mobile ? 'visible' : 'auto' }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', color: T.dim, textTransform: 'uppercase' }}>Proveniência</div>
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim }}>Páginas-fonte</div>
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 17, color: T.ink, marginTop: 4 }}>{lesson.provenance.pages}</div>
        </div>
        <div style={{ marginTop: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim }}>Confiança da IA</div>
            <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: T.ink }}>{lesson.provenance.confidence.toFixed(2)}</div>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: 'rgba(24,18,31,.08)', marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: `${conf}%`, height: '100%', borderRadius: 99, background: conf >= 70 ? `linear-gradient(90deg, ${T.success}, #54C98A)` : `linear-gradient(90deg, ${T.warning}, #E8B860)`, transition: 'width .3s ease' }}></div>
          </div>
        </div>
        <div style={{ marginTop: 26, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontFamily: DISP, fontSize: 13, lineHeight: 1.6, color: 'rgba(24,18,31,.6)' }}>{lesson.provenance.note}</div>
        </div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 11, color: 'rgba(24,18,31,.4)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.warning }}></span>gerado por IA · revise antes de aprovar
        </div>
      </div>

      <PhonePreview open={preview} onClose={() => setPreview(false)} course={{ title: 'Tráfego pago para infoprodutores', cover: modCover, banner: banner, creator: { name: 'Camila Oliveira' }, modules: [{ name: 'Módulo 1 · Tráfego pago', cover: modCover, lessons: lessons }, { name: 'Módulo Premium · Mentoria Alto Ticket', cover: 1, locked: true, lessons: [] }] }} />
    </AuthorShell>
  );
}

export { ReviewDeskScreen };
