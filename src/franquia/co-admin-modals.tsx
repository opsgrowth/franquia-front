import React from 'react';
import { AIC, CoverField } from './author-kit';
import { ADM_ACCESS, ADM_COLORS, ADM_KINDS, ADM_TYPES, AdmModal, BannerEditor, PlatformIds, admInput, admLbl } from './co-admin';
import { coRgba, coTheme } from './co-app';
import { DISP, Ico, MONO, T } from './kit';

// "Criar do zero" — modais (Produto, Módulo, Aula).

const { useState: useStateMod } = React;

function ProductModal({ init, editId, onClose, onSave }) {
  const [d, setD] = useStateMod(init);
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  return (
    <AdmModal title={editId ? 'Editar produto' : 'Novo produto'} onClose={onClose} onSave={() => onSave(d)}>
      <label style={admLbl}>Nome do produto</label>
      <input value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex.: VA — Vendedor Automático" style={admInput} />
      <div style={{ height: 16 }}></div>
      <label style={admLbl}>Subtítulo</label>
      <input value={d.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="Ex.: O método que já formou +90 mil alunos" style={admInput} />
      <div style={{ height: 16 }}></div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={admLbl}>Categoria</label>
          <select value={d.kind} onChange={(e) => set('kind', e.target.value)} style={{ ...admInput, cursor: 'pointer' }}>{ADM_KINDS.map((k) => <option key={k}>{k}</option>)}</select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={admLbl}>Acesso</label>
          <select value={d.access} onChange={(e) => set('access', e.target.value)} style={{ ...admInput, cursor: 'pointer' }}>{ADM_ACCESS.map((k) => <option key={k}>{k}</option>)}</select>
        </div>
      </div>
      <div style={{ height: 16 }}></div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={admLbl}>Preço</label>
          <input value={d.displayPrice || ''} onChange={(e) => set('displayPrice', e.target.value)} placeholder="Ex.: R$ 297" style={admInput} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={admLbl}>Preço parcelado</label>
          <input value={d.priceInstallment || ''} onChange={(e) => set('priceInstallment', e.target.value)} placeholder="Ex.: 12x R$ 29" style={admInput} />
        </div>
      </div>
      <div style={{ height: 16 }}></div>
      <label style={admLbl}>Descrição</label>
      <textarea value={d.desc} onChange={(e) => set('desc', e.target.value)} placeholder="O que a aluna alcança com este produto" style={{ ...admInput, minHeight: 90, resize: 'vertical' }} />
      <div style={{ height: 18 }}></div>
      <label style={admLbl}>Cor do produto</label>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {ADM_COLORS.map((c) => (
          <div key={c} onClick={() => set('color', c)} style={{ width: 46, height: 46, borderRadius: 12, background: coTheme(c), cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: d.color === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none' }}>{d.color === c && <Ico d={AIC.check} size={18} c="#fff" sw={2.6} />}</div>
        ))}
      </div>
      <div style={{ height: 18 }}></div>
      <label style={admLbl}>Capa do produto</label>
      <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim, marginBottom: 10 }}>Imagem que aparece no card do catálogo. Se não definida, usa o gradiente da cor acima.</div>
      <CoverField value={d.coverImg == null ? null : d.coverImg} onPick={(v) => set('coverImg', v)} h={120} title={d.title || 'Capa do produto'} />
      <div style={{ height: 18 }}></div>
      <label style={admLbl}>Banners do app</label>
      <BannerEditor banners={d.banners || []} onChange={(v) => set('banners', v)} />
      <div style={{ height: 18 }}></div>
      <label style={admLbl}>IDs da plataforma de vendas</label>
      <PlatformIds value={d.saleIds || []} onChange={(v) => set('saleIds', v)} />
      <div style={{ height: 18 }}></div>
      <div onClick={() => set('showTitle', !d.showTitle)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div style={{ width: 44, height: 26, borderRadius: 99, background: d.showTitle ? T.accent : 'rgba(24,18,31,.18)', position: 'relative', transition: 'background .15s', flex: '0 0 auto' }}>
          <div style={{ position: 'absolute', top: 3, left: d.showTitle ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></div>
        </div>
        <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: T.ink }}>Mostrar título sobre a capa</span>
      </div>
    </AdmModal>
  );
}

function ModuleModal({ init, editId, onClose, onSave }) {
  const [t, setT] = useStateMod(init.title);
  const [cover, setCover] = useStateMod(init.cover == null ? null : init.cover);
  return (
    <AdmModal title={editId ? 'Editar módulo' : 'Novo módulo'} onClose={onClose} onSave={() => onSave({ title: t || 'Novo módulo', cover })}>
      <label style={admLbl}>Título do módulo</label>
      <input autoFocus value={t} onChange={(e) => setT(e.target.value)} placeholder="Ex.: Fundamentos do Vendedor Automático" style={{ ...admInput, borderColor: T.accent }} />
      <div style={{ height: 18 }}></div>
      <label style={admLbl}>Capa do módulo</label>
      <CoverField value={cover} onPick={setCover} h={110} title={t || 'Módulo'} />
    </AdmModal>
  );
}

function LessonModal({ init, editId, accent, productLocked, onClose, onSave }) {
  const [d, setD] = useStateMod(init);
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  return (
    <AdmModal title={editId ? 'Editar aula' : 'Nova aula'} onClose={onClose} onSave={() => onSave(d)} width={620}>
      <label style={admLbl}>Título da aula</label>
      <input autoFocus value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex.: Estrutura de campanha do zero" style={admInput} />
      <div style={{ height: 16 }}></div>
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={admLbl}>Tipo</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {ADM_TYPES.map(([k, label, ic]) => {
              const on = d.type === k;
              return <div key={k} onClick={() => set('type', k)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 6px', borderRadius: 12, cursor: 'pointer', background: on ? coRgba(accent, .1) : T.paper, border: `1.5px solid ${on ? accent : T.line}` }}><Ico d={ic} size={18} c={on ? accent : T.dim} fill={k === 'video' && on ? accent : 'none'} /><span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, color: on ? T.ink : T.dim }}>{label}</span></div>;
            })}
          </div>
        </div>
        <div style={{ width: 150 }}>
          <label style={admLbl}>Duração</label>
          <input value={d.duration} onChange={(e) => set('duration', e.target.value)} placeholder="10 min" style={admInput} />
        </div>
      </div>
      <div style={{ height: 16 }}></div>
      <label style={admLbl}>{d.type === 'leitura' ? 'Conteúdo da aula' : `Link do ${d.type === 'audio' ? 'áudio' : 'vídeo'} (YouTube, Vimeo ou MP4)`}</label>
      {d.type !== 'leitura' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 46, height: 46, borderRadius: 11, background: coRgba(accent, .12), display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={AIC.play} size={18} c={accent} fill={accent} /></div>
          <input value={d.link} onChange={(e) => set('link', e.target.value)} placeholder="https://…" style={admInput} />
        </div>
      )}
      <div style={{ height: 8 }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: DISP, fontSize: 12.5, color: T.dim }}><Ico d={AIC.upload} size={15} c={T.dim} />Ou faça upload do arquivo de mídia (na produção, integra ao seu storage)</div>
      <div style={{ height: 16 }}></div>
      <label style={admLbl}>Notas / transcrição</label>
      <textarea value={d.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Resumo, transcrição ou notas de apoio…" style={{ ...admInput, minHeight: 110, resize: 'vertical' }} />
      {productLocked && (
        <React.Fragment>
          <div style={{ height: 18 }}></div>
          <div onClick={() => set('sample', !d.sample)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: T.paper, border: `1px solid ${T.line}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ width: 44, height: 26, borderRadius: 99, background: d.sample ? T.accent : 'rgba(24,18,31,.18)', position: 'relative', transition: 'background .15s', flex: '0 0 auto' }}>
              <div style={{ position: 'absolute', top: 3, left: d.sample ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: T.ink }}>Aula-amostra (liberada como degustação)</div>
              <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim, marginTop: 2 }}>Este produto é bloqueado. Com isto ativo, esta aula abre sem o paywall — para instigar a compra do resto.</div>
            </div>
          </div>
        </React.Fragment>
      )}
    </AdmModal>
  );
}

// ── Editor de CONTEÚDO (blocos) — dados REAIS + persistência (o onSave grava no backend) ──
const BLOCK_KINDS = [['text', 'Texto'], ['heading', 'Título'], ['quote', 'Citação'], ['list', 'Lista'], ['video', 'Vídeo']];
const BLK_LABEL = { heading: 'Título', quote: 'Citação', list: 'Lista', video: 'Vídeo', image: 'Imagem', divider: 'Divisória', paragraph: 'Texto', text: 'Texto' };
function newBlk(kind) {
  if (kind === 'heading') return { kind: 'heading', text: '' };
  if (kind === 'quote') return { kind: 'quote', text: '', cite: '' };
  if (kind === 'list') return { kind: 'list', items: [''] };
  if (kind === 'video') return { kind: 'video', title: '', url: '' };
  return { kind: 'paragraph', text: '' };
}

function BlockEditorModal({ lesson, onClose, onSave }) {
  const [blocks, setBlocks] = React.useState(() => (lesson.blocks || []).map((b) => ({ ...b })));
  const [desc, setDesc] = React.useState(lesson.desc || '');
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState('');
  const upd = (i, patch) => setBlocks((bs) => bs.map((b, k) => (k === i ? { ...b, ...patch } : b)));
  const del = (i) => setBlocks((bs) => bs.filter((_, k) => k !== i));
  const move = (i, dir) => setBlocks((bs) => { const j = i + dir; if (j < 0 || j >= bs.length) return bs; const a = [...bs]; [a[i], a[j]] = [a[j], a[i]]; return a; });
  const add = (kind) => setBlocks((bs) => [...bs, newBlk(kind)]);
  const save = async () => {
    setSaving(true); setErr('');
    try { await onSave({ blocks, desc }); onClose(); }
    catch (e) { setErr((e && e.message) || 'Falha ao salvar. Tente de novo.'); setSaving(false); }
  };
  return (
    <AdmModal title="Conteúdo da aula" onClose={onClose} onSave={save} saveLabel={saving ? 'Salvando…' : 'Salvar conteúdo'} width={640}>
      <div style={{ fontFamily: DISP, fontSize: 13, color: T.dim, marginBottom: 14, lineHeight: 1.5 }}>Edite, reordene ou <b style={{ color: T.ink }}>remova</b> blocos. Ao salvar, isto substitui o conteúdo REAL que o comprador vê.</div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ ...admLbl, fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: T.dim }}>Descrição da aula (subtítulo)</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Subtítulo curto — deixe vazio para remover" style={{ ...admInput, minHeight: 50, resize: 'vertical' }} />
      </div>
      {err &&<div style={{ fontFamily: DISP, fontSize: 13, color: '#B4231F', background: 'rgba(180,35,31,.08)', border: '1px solid rgba(180,35,31,.25)', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>{err}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {blocks.length === 0 && <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, textAlign: 'center', padding: '18px 0' }}>Sem blocos — adicione conteúdo abaixo.</div>}
        {blocks.map((b, i) => (
          <div key={i} style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em', color: T.dim, textTransform: 'uppercase' }}>{BLK_LABEL[b.kind] || b.kind}</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                <div onClick={() => move(i, -1)} title="Subir" style={{ cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1 }}><Ico d="M6 15l6-6 6 6" size={16} c={T.dim} /></div>
                <div onClick={() => move(i, 1)} title="Descer" style={{ cursor: i === blocks.length - 1 ? 'default' : 'pointer', opacity: i === blocks.length - 1 ? 0.3 : 1 }}><Ico d="M6 9l6 6 6-6" size={16} c={T.dim} /></div>
                <div onClick={() => del(i)} title="Remover bloco" style={{ cursor: 'pointer' }}><Ico d={AIC.trash} size={16} c="#B4231F" /></div>
              </div>
            </div>
            {b.kind === 'heading' && <input value={b.text || ''} onChange={(e) => upd(i, { text: e.target.value })} placeholder="Título da seção" style={{ ...admInput, fontWeight: 700 }} />}
            {(b.kind === 'paragraph' || b.kind === 'text') && <textarea value={b.text || ''} onChange={(e) => upd(i, { text: e.target.value })} placeholder="Texto da aula…" style={{ ...admInput, minHeight: 80, resize: 'vertical' }} />}
            {b.kind === 'quote' && <React.Fragment><textarea value={b.text || ''} onChange={(e) => upd(i, { text: e.target.value })} placeholder="Citação…" style={{ ...admInput, minHeight: 56, resize: 'vertical' }} /><input value={b.cite || ''} onChange={(e) => upd(i, { cite: e.target.value })} placeholder="— fonte (opcional)" style={{ ...admInput, marginTop: 8, fontFamily: MONO, fontSize: 13 }} /></React.Fragment>}
            {b.kind === 'list' && <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{(b.items || []).map((it, ii) => (<div key={ii} style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input value={it} onChange={(e) => upd(i, { items: (b.items || []).map((x, k) => (k === ii ? e.target.value : x)) })} style={admInput} /><div onClick={() => upd(i, { items: (b.items || []).filter((_, k) => k !== ii) })} style={{ cursor: 'pointer', flex: '0 0 auto' }}><Ico d={AIC.trash} size={14} c={T.dim} /></div></div>))}<div onClick={() => upd(i, { items: [...(b.items || []), ''] })} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DISP, fontWeight: 600, fontSize: 12.5, color: T.accent, cursor: 'pointer', marginTop: 2 }}><Ico d={AIC.plus} size={13} c={T.accent} />item</div></div>}
            {b.kind === 'video' && <input value={b.url || ''} onChange={(e) => upd(i, { url: e.target.value })} placeholder="URL do vídeo (YouTube / Vimeo / link direto)" style={{ ...admInput, fontFamily: MONO, fontSize: 13 }} />}
            {(b.kind === 'image' || b.kind === 'divider') && <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim }}>{b.kind === 'divider' ? 'Divisória visual.' : 'Bloco de imagem.'}</div>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {BLOCK_KINDS.map(([k, label]) => (<div key={k} onClick={() => add(k)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: `1px solid ${T.line}`, borderRadius: 9, padding: '8px 12px', fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.ink, cursor: 'pointer' }}><Ico d={AIC.plus} size={14} c={T.accent} />{label}</div>))}
      </div>
    </AdmModal>
  );
}

export { ProductModal, ModuleModal, LessonModal, BlockEditorModal };
