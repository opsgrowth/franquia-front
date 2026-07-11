import React from 'react';
import { LOCK_ICON } from './author-app';
import { ABtn, AIC, AuthorShell, CoverField } from './author-kit';
import { PhonePreview } from './author-preview';
import { ADM_ACCESS, ADM_COLORS, ADM_INIT, ADM_KINDS, ADM_PROGRESS, ADM_TYPES, AdmIconSquare, AdmStatus, BannerEditor, FRANQUIA_INIT, aid } from './co-admin';
import { LessonModal, ModuleModal, ProductModal } from './co-admin-modals';
import { coDarken, coTheme, moduleDuration } from './co-app';
import { DBtn, DShell } from './desktop-screens-1';
import { DISP, IC, Ico, MONO, T, useIsMobile } from './kit';
import { persistAppCover, persistBanners, persistModuleCover } from '../lib/covers';
import { isBackendId, loadProductModules, patchApp } from '../lib/apps';

// "R$ 397" / "R$ 1.997,00" → centavos (inteiro de reais * 100; ignora centavos do texto).
function parsePriceCents(s: any): number | null | undefined {
  const t = String(s == null ? '' : s).replace(/[^\d,.]/g, '');
  if (!t) return null; // vazio → limpa o preço
  const reais = parseInt(t.split(',')[0].replace(/\./g, ''), 10);
  return isNaN(reais) ? undefined : reais * 100;
}

// "Criar do zero" — ProductsAdminScreen (lista, produto, módulos & aulas, modais).

const { useState: useStateAdmS } = React;

function ProductsAdminScreen({ scope, sharedProducts, setSharedProducts }) {
  const isFranquia = scope === 'franquia';
  // franquia mode: bypass local state entirely — read/write via window globals
  const [localProducts, setLocalProducts] = useStateAdmS(isFranquia ? [] : ADM_INIT);
  const [, forceUpdate] = useStateAdmS(0);

  const products = isFranquia
    ? (window.__franquiaProducts || [])
    : localProducts;

  const setProducts = (fn) => {
    if (isFranquia) {
      const prev = window.__franquiaProducts || [];
      const next = typeof fn === 'function' ? fn(prev) : fn;
      if (window.__setFranquiaProducts) window.__setFranquiaProducts(next);
      forceUpdate((n) => n + 1); // trigger local re-render
    } else {
      setLocalProducts(fn);
    }
  };
  const [view, setView] = useStateAdmS('list'); // list | product
  const [selId, setSelId] = useStateAdmS(null);
  const [expanded, setExpanded] = useStateAdmS({});
  const [preview, setPreview] = useStateAdmS(false);
  const [modal, setModal] = useStateAdmS(null); // {type, ...}
  const mobile = useIsMobile();

  const sel = products.find((p) => p.id === selId);

  // Carrega o CONTEÚDO (módulos/aulas) do produto aberto sob demanda — o /apps traz só
  // metadados. Sem isso, um produto real (ex. gerado pela IA) abre "vazio".
  React.useEffect(() => {
    if (!isFranquia || !sel || !isBackendId(sel.id)) return;
    if ((sel.modules && sel.modules.length) || !((sel.modulesCount || 0) > 0)) return;
    let alive = true;
    loadProductModules(sel.id)
      .then((mods) => { if (alive && mods) setProducts((ps) => ps.map((p) => (p.id === sel.id ? { ...p, modules: mods } : p))); })
      .catch(() => {});
    return () => { alive = false; };
  }, [selId]);

  // ── mutations ──
  const addProduct = (data) => { const id = aid('p'); setProducts((ps) => [...ps, { id, students: 0, status: data.access === 'Premium (upsell)' ? 'Premium' : 'Rascunho', modules: [], ...data }]); setSelId(id); setView('product'); };
  const updateProduct = (id, data) => {
    const cur = products.find((p) => p.id === id);
    // capa do produto: persiste no backend só se mudou (evita re-upload em cada save)
    if (cur && data.coverImg !== cur.coverImg) persistAppCover(id, data.coverImg);
    // metadados no backend (nome, tagline, preço, cor, premium) — só o que mudou
    if (isBackendId(id) && cur) {
      const f: any = {};
      if (data.title != null && data.title !== cur.title) f.name = data.title;
      if (data.subtitle !== cur.subtitle) f.tagline = data.subtitle || null;
      if (data.color && data.color !== cur.color) f.accent_color = data.color;
      const cents = parsePriceCents(data.displayPrice);
      if (cents !== undefined) f.suggested_price_cents = cents;
      const prem = data.access === 'Premium (upsell)';
      if (prem !== (!!cur.isPremium || cur.access === 'Premium (upsell)')) f.is_premium = prem;
      if (Object.keys(f).length) patchApp(id, f).catch((e: any) => console.warn('patchApp produto:', e?.message || e));
    }
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...data, status: data.access === 'Premium (upsell)' ? 'Premium' : (p.status === 'Premium' ? 'Publicado' : p.status), } : p)));
  };
  // Toggle de vitrine (publicar/premium/camuflar) — grava direto no backend + otimista.
  const setAppFlag = (pid, field, value) => {
    const uiKey = { catalog_published: 'catalogPublished', is_premium: 'isPremium', camouflaged: 'camouflaged' }[field] || field;
    setProducts((ps) => ps.map((p) => (p.id === pid
      ? { ...p, [uiKey]: value, ...(field === 'is_premium' ? { access: value ? 'Premium (upsell)' : 'Liberado' } : {}) }
      : p)));
    patchApp(pid, { [field]: value }).catch((e) => console.warn('patchApp flag:', field, e?.message || e));
  };
  const delProduct = (id) => setProducts((ps) => ps.filter((p) => p.id !== id));
  const dupProduct = (id) => setProducts((ps) => { const src = ps.find((p) => p.id === id); if (!src) return ps; const dup = { ...src, id: aid('p'), title: src.title + ' (cópia)', status: 'Rascunho', students: 0, modules: src.modules.map((m) => ({ ...m, id: aid('m'), lessons: m.lessons.map((l) => ({ ...l, id: aid('l') })) })) }; return [...ps, dup]; });
  const addModule = (pid, data) => setProducts((ps) => ps.map((p) => (p.id === pid ? { ...p, modules: [...p.modules, { id: aid('m'), title: data.title, cover: data.cover, lessons: [] }] } : p)));
  const updateModule = (pid, mid, data) => {
    const cur = products.find((p) => p.id === pid);
    const m0 = cur && cur.modules.find((mm) => mm.id === mid);
    if (m0 && data.cover !== m0.cover) persistModuleCover(mid, data.cover);
    setProducts((ps) => ps.map((p) => (p.id === pid ? { ...p, modules: p.modules.map((m) => (m.id === mid ? { ...m, title: data.title, cover: data.cover } : m)) } : p)));
  };
  const delModule = (pid, mid) => setProducts((ps) => ps.map((p) => (p.id === pid ? { ...p, modules: p.modules.filter((m) => m.id !== mid) } : p)));
  const moveModule = (pid, mid, dir) => setProducts((ps) => ps.map((p) => { if (p.id !== pid) return p; const i = p.modules.findIndex((m) => m.id === mid); const j = i + dir; if (j < 0 || j >= p.modules.length) return p; const a = [...p.modules]; [a[i], a[j]] = [a[j], a[i]]; return { ...p, modules: a }; }));
  const addLesson = (pid, mid, data) => setProducts((ps) => ps.map((p) => (p.id === pid ? { ...p, modules: p.modules.map((m) => (m.id === mid ? { ...m, lessons: [...m.lessons, { id: aid('l'), ...data }] } : m)) } : p)));
  const updateLesson = (pid, mid, lid, data) => setProducts((ps) => ps.map((p) => (p.id === pid ? { ...p, modules: p.modules.map((m) => (m.id === mid ? { ...m, lessons: m.lessons.map((l) => (l.id === lid ? { ...l, ...data } : l)) } : m)) } : p)));
  const delLesson = (pid, mid, lid) => setProducts((ps) => ps.map((p) => (p.id === pid ? { ...p, modules: p.modules.map((m) => (m.id === mid ? { ...m, lessons: m.lessons.filter((l) => l.id !== lid) } : m)) } : p)));
  const setProdBanner = (pid, v) => setProducts((ps) => ps.map((p) => (p.id === pid ? { ...p, banner: v } : p)));
  const setProdBanners = (pid, arr) => {
    const cur = products.find((p) => p.id === pid);
    persistBanners(pid, (cur && cur.banners) || [], arr);
    setProducts((ps) => ps.map((p) => (p.id === pid ? { ...p, banners: arr } : p)));
  };
  const setModCover = (pid, mid, v) => {
    persistModuleCover(mid, v);
    setProducts((ps) => ps.map((p) => (p.id === pid ? { ...p, modules: p.modules.map((m) => (m.id === mid ? { ...m, cover: v } : m)) } : p)));
  };
  const imgOf = (v) => (typeof v === 'string' ? v : null);

  // ── list view ──
  const ListView = (
    <div style={{ overflow: 'auto', height: '100%' }}>
      {isFranquia && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: mobile ? '16px 16px 0' : '24px 30px 0', background: 'rgba(124,58,237,.08)', border: `1px solid rgba(124,58,237,.22)`, borderRadius: 14, padding: '14px 18px' }}>
          <Ico d={'M13 16h-1v-4h-1m1-4h.01'} size={20} c={T.accent} />
          <span style={{ fontFamily: DISP, fontSize: 14.5, color: T.ink }}><b style={{ fontWeight: 600 }}>Catálogo Franquia</b> — alterações aqui <b style={{ fontWeight: 600 }}>refletem para todos os franqueados</b>. Revise antes de publicar.</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, padding: mobile ? '16px 16px 0' : '22px 30px 0' }}>
        <div style={{ fontFamily: DISP, fontSize: 15.5, color: T.dim }}>{products.length} produtos{isFranquia ? ' · catálogo compartilhado' : ' · gerencie módulos, aulas e acesso'}</div>
        <div onClick={() => setModal({ type: isFranquia ? 'doors' : 'product', data: { title: '', subtitle: '', kind: ADM_KINDS[0], access: ADM_ACCESS[0], desc: '', color: ADM_COLORS[0], saleIds: [], showTitle: true } })} style={{ cursor: 'pointer' }}><ABtn icon={AIC.plus}>{isFranquia ? 'Novo produto da Franquia' : 'Novo produto'}</ABtn></div>
      </div>

      <div style={{ margin: mobile ? '18px 16px' : '24px 30px', background: '#fff', border: `1px solid ${T.line}`, borderRadius: 18, overflow: 'hidden' }}>
        {!mobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 0.8fr 1fr 1.3fr 1fr 90px', padding: '14px 22px', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em', color: T.dim, borderBottom: `1px solid ${T.line}` }}>
            <span>PRODUTO</span><span>MÓDULOS</span><span>ALUNOS</span><span>CONCLUSÃO</span><span>STATUS</span><span></span>
          </div>
        )}
        {products.map((p, i) => {
          const lessons = p.lessonsCount != null ? p.lessonsCount : p.modules.reduce((n, m) => n + m.lessons.length, 0);
          const nMods = p.modulesCount != null ? p.modulesCount : p.modules.length;
          const pct = ADM_progressPct(p);
          return (
            <div key={p.id} style={{ display: mobile ? 'flex' : 'grid', gridTemplateColumns: mobile ? undefined : '2.4fr 0.8fr 1fr 1.3fr 1fr 90px', alignItems: 'center', gap: mobile ? 12 : 0, padding: '16px 22px', borderBottom: i < products.length - 1 ? `1px solid ${T.line}` : 'none', cursor: 'pointer' }} onClick={() => { setSelId(p.id); setView('product'); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: mobile ? 1 : 'unset' }}>
                <AdmIconSquare color={p.color} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: T.ink, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ fontFamily: DISP, fontSize: 13, color: T.dim, marginTop: 2 }}>{p.kind} · {lessons} aulas</div>
                </div>
              </div>
              {!mobile && <span style={{ fontFamily: DISP, fontSize: 15, color: T.ink }}>{nMods}</span>}
              {!mobile && <span style={{ fontFamily: DISP, fontSize: 15, color: T.ink }}>{p.students.toLocaleString('pt-BR')}</span>}
              {!mobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 14 }}>
                  <div style={{ flex: 1, height: 7, borderRadius: 99, background: 'rgba(24,18,31,.08)', overflow: 'hidden' }}><div style={{ width: pct + '%', height: '100%', background: coTheme(p.color) }}></div></div>
                  <span style={{ fontFamily: MONO, fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{pct}%</span>
                </div>
              )}
              {!mobile && <AdmStatus status={p.status} />}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                {isFranquia && <div onClick={() => dupProduct(p.id)} title="Duplicar" style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${T.line}` }}><Ico d={AIC.copy} size={15} c={T.dim} /></div>}
                <div onClick={() => setModal({ type: 'product', editId: p.id, data: { title: p.title, subtitle: p.subtitle, kind: p.kind, access: p.access, desc: p.desc || '', color: p.color, displayPrice: p.displayPrice || '', priceInstallment: p.priceInstallment || '', coverImg: p.coverImg == null ? null : p.coverImg, saleIds: p.saleIds || [], banners: p.banners || (p.banner != null ? [p.banner] : []), showTitle: p.showTitle !== false } })} style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${T.line}` }}><Ico d={AIC.pencil} size={16} c={T.dim} /></div>
                <div onClick={() => delProduct(p.id)} style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${T.line}` }}><Ico d={AIC.trash} size={16} c={T.dim} /></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── product detail ──
  const ProductView = sel && (
    <div style={{ overflow: 'auto', height: '100%', padding: mobile ? '18px 16px' : '24px 30px' }}>
      <div onClick={() => setView('list')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.ink }}><Ico d={AIC.chevron} size={16} c={T.ink} style={{ transform: 'rotate(90deg)' }} />Todos os produtos</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 20, marginTop: 18 }}>
        <AdmIconSquare color={sel.color} size={62} r={16} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', color: T.ink }}>{sel.title}</div>
          <div style={{ fontFamily: DISP, fontSize: 14.5, color: T.dim, marginTop: 2 }}>{sel.subtitle}</div>
        </div>
        <div onClick={() => setModal({ type: 'product', editId: sel.id, data: { title: sel.title, subtitle: sel.subtitle, kind: sel.kind, access: sel.access, desc: sel.desc || '', color: sel.color, displayPrice: sel.displayPrice || '', priceInstallment: sel.priceInstallment || '', coverImg: sel.coverImg == null ? null : sel.coverImg, saleIds: sel.saleIds || [], banners: sel.banners || (sel.banner != null ? [sel.banner] : []), showTitle: sel.showTitle !== false } })} style={{ cursor: 'pointer' }}><ABtn variant="ghost" icon={AIC.pencil}>Editar produto</ABtn></div>
      </div>

      {/* vitrine no catálogo — publicar / premium / camuflar (grava no backend) */}
      {isBackendId(sel.id) && (
        <div style={{ marginTop: 16, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: '14px 18px' }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em', color: T.dim, textTransform: 'uppercase', marginBottom: 10 }}>Vitrine no catálogo</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {([
              ['catalog_published', sel.catalogPublished !== false, 'Publicado', 'Aparece no catálogo dos franqueados'],
              ['is_premium', !!sel.isPremium || sel.access === 'Premium (upsell)', 'Premium', 'Tag dourada + popup "libera em 7 dias"'],
              ['camouflaged', !!sel.camouflaged, 'Camuflado', 'Aparece embaçado (segura do público)'],
            ] as [string, boolean, string, string][]).map(([field, on, label, hint]) => (
              <div key={field} onClick={() => setAppFlag(sel.id, field, !on)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, border: `1.5px solid ${on ? T.accent : T.line}`, background: on ? T.halo : '#fff', borderRadius: 12, padding: '11px 14px', flex: '1 1 220px', minWidth: 200 }}>
                <div style={{ width: 38, height: 22, borderRadius: 99, background: on ? T.accent : 'rgba(24,18,31,.15)', position: 'relative', flex: '0 0 auto' }}>
                  <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }} />
                </div>
                <div>
                  <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: T.ink }}>{label}</div>
                  <div style={{ fontFamily: DISP, fontSize: 11.5, color: T.dim, marginTop: 1 }}>{hint}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* banners do app */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em', color: T.dim, textTransform: 'uppercase', marginBottom: 8 }}>Banners do app</div>
        <BannerEditor banners={sel.banners || []} onChange={(v) => setProdBanners(sel.id, v)} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '26px 0 14px' }}>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: T.ink }}>Módulos & Aulas</div>
        <div onClick={() => setModal({ type: 'module', data: { title: '' } })} style={{ cursor: 'pointer' }}><ABtn icon={AIC.plus}>Módulo</ABtn></div>
      </div>

      {sel.modules.length === 0 ? (
        <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: '54px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <Ico d="M12 3l9 5-9 5-9-5z M3 12l9 5 9-5 M3 17l9 5 9-5" size={34} c="rgba(24,18,31,.3)" />
          <div style={{ fontFamily: DISP, fontSize: 15.5, color: T.dim }}>Nenhum módulo ainda. Crie o primeiro.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sel.modules.map((m, mi) => {
            const open = expanded[m.id] !== false;
            const dur = moduleDuration(m);
            return (
              <div key={m.id} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div onClick={() => moveModule(sel.id, m.id, -1)} style={{ cursor: 'pointer', height: 16, display: 'flex', alignItems: 'center', opacity: mi > 0 ? 1 : 0.3 }}><Ico d="M6 15l6-6 6 6" size={16} c={T.ink} /></div>
                    <div onClick={() => moveModule(sel.id, m.id, 1)} style={{ cursor: 'pointer', height: 16, display: 'flex', alignItems: 'center', opacity: mi < sel.modules.length - 1 ? 1 : 0.3 }}><Ico d="M6 9l6 6 6-6" size={16} c={T.ink} /></div>
                  </div>
                  <div style={{ width: 56, flex: '0 0 auto' }}><CoverField value={m.cover == null ? null : m.cover} onPick={(v) => setModCover(sel.id, m.id, v)} h={40} radius={9} /></div>
                  <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setExpanded((e) => ({ ...e, [m.id]: !open }))}>
                    <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: T.ink }}><span style={{ color: sel.color }}>{String(mi + 1).padStart(2, '0')}</span> · {m.title}</div>
                    <div style={{ fontFamily: MONO, fontSize: 11.5, color: T.dim, marginTop: 2 }}>{m.lessons.length} aulas · {dur} min</div>
                  </div>
                  <div onClick={() => setModal({ type: 'module', editId: m.id, data: { title: m.title, cover: m.cover } })} style={{ cursor: 'pointer', width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={AIC.pencil} size={16} c={T.dim} /></div>
                  <div onClick={() => delModule(sel.id, m.id)} style={{ cursor: 'pointer', width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={AIC.trash} size={16} c={T.dim} /></div>
                </div>
                {open && (
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {m.lessons.map((l) => {
                      const ic = (ADM_TYPES.find((t) => t[0] === l.type) || ADM_TYPES[0])[2];
                      return (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: T.paper, borderRadius: 11, padding: '12px 14px' }}>
                          <Ico d={ic} size={17} c={sel.color} fill={l.type === 'video' ? sel.color : 'none'} />
                          <span style={{ flex: 1, fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                          {sel.access === 'Premium (upsell)' && (l.sample
                            ? <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', color: '#0E7A40', background: 'rgba(14,154,80,.14)', padding: '4px 8px', borderRadius: 6 }}>AMOSTRA</span>
                            : <Ico d={LOCK_ICON} size={15} c={T.dim} />)}
                          <span style={{ fontFamily: MONO, fontSize: 12, color: T.dim }}>{l.duration}</span>
                          <div onClick={() => setModal({ type: 'lesson', mid: m.id, editId: l.id, data: { title: l.title, type: l.type, duration: l.duration, link: l.link || '', notes: l.notes || '', sample: !!l.sample } })} style={{ cursor: 'pointer' }}><Ico d={AIC.pencil} size={15} c={T.dim} /></div>
                          <div onClick={() => delLesson(sel.id, m.id, l.id)} style={{ cursor: 'pointer' }}><Ico d={AIC.trash} size={15} c={T.dim} /></div>
                        </div>
                      );
                    })}
                    <div onClick={() => setModal({ type: 'lesson', mid: m.id, data: { title: '', type: 'video', duration: '10 min', link: '', notes: '', sample: false } })} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', background: T.paper, border: `1px solid ${T.line}`, borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.ink }}><Ico d={AIC.plus} size={15} c={T.ink} />Adicionar aula</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // preview: produtos -> cursos (mesma shape; locked = acesso premium)
  const previewCourses = products.map((p) => ({ id: p.id, title: p.title, subtitle: p.subtitle, kind: p.kind, color: p.color, color2: coDarken(p.color, .45), locked: p.access === 'Premium (upsell)', students: p.students, coverImg: imgOf(p.coverImg), bannerImg: ((p.banners || []).map(imgOf).find(Boolean)) || imgOf(p.banner), banners: (p.banners && p.banners.length ? p.banners : (p.banner != null ? [p.banner] : [])).map(imgOf), modules: p.modules.map((m) => ({ ...m, coverImg: imgOf(m.cover), lessons: m.lessons.map((l) => ({ ...l, sample: !!l.sample })) })) }));

  if (isFranquia) return (
      <DShell active="fadmin" sub="Admin · Catálogo Franquia" title="Catálogo Franquia">
        <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
          {view === 'list' ? <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: mobile ? '16px 16px 0' : '24px 30px 0', background: 'rgba(124,58,237,.08)', border: `1px solid rgba(124,58,237,.22)`, borderRadius: 14, padding: '14px 18px' }}>
              <Ico d={'M13 16h-1v-4h-1m1-4h.01'} size={20} c={T.accent} />
              <span style={{ fontFamily: DISP, fontSize: 14.5, color: T.ink }}><b style={{ fontWeight: 600 }}>Catálogo Franquia</b> — alterações aqui <b style={{ fontWeight: 600 }}>refletem para todos os franqueados</b>. Revise antes de publicar.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, padding: mobile ? '16px 16px 0' : '22px 30px 0' }}>
              <div style={{ fontFamily: DISP, fontSize: 15.5, color: T.dim }}>{products.length} produtos · catálogo compartilhado</div>
              <div onClick={() => setModal({ type: 'doors', data: { title: '', subtitle: '', kind: ADM_KINDS[0], access: ADM_ACCESS[0], desc: '', color: ADM_COLORS[0], saleIds: [], showTitle: true } })} style={{ cursor: 'pointer' }}><DBtn icon={IC.spark}>Novo produto da Franquia</DBtn></div>
            </div>
            <div style={{ margin: mobile ? '18px 16px' : '24px 30px', background: '#fff', border: `1px solid ${T.line}`, borderRadius: 18, overflow: 'hidden' }}>
              {!mobile && (<div style={{ display: 'grid', gridTemplateColumns: '2.4fr 0.8fr 1fr 1.3fr 1fr 110px', padding: '14px 22px', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em', color: T.dim, borderBottom: `1px solid ${T.line}` }}><span>PRODUTO</span><span>MÓDULOS</span><span>ALUNOS</span><span>CONCLUSÃO</span><span>STATUS</span><span></span></div>)}
              {products.map((p, i) => {
                const lessons = p.lessonsCount != null ? p.lessonsCount : p.modules.reduce((n, m) => n + m.lessons.length, 0);
          const nMods = p.modulesCount != null ? p.modulesCount : p.modules.length;
                const pct = ADM_progressPct(p);
                return (
                  <div key={p.id} style={{ display: mobile ? 'flex' : 'grid', gridTemplateColumns: mobile ? undefined : '2.4fr 0.8fr 1fr 1.3fr 1fr 110px', alignItems: 'center', gap: mobile ? 12 : 0, padding: '16px 22px', borderBottom: i < products.length - 1 ? `1px solid ${T.line}` : 'none', cursor: 'pointer' }} onClick={() => { setSelId(p.id); setView('product'); }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: mobile ? 1 : 'unset' }}>
                      <AdmIconSquare color={p.color} />
                      <div style={{ minWidth: 0 }}><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: T.ink, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div><div style={{ fontFamily: DISP, fontSize: 13, color: T.dim, marginTop: 2 }}>{p.kind} · {lessons} aulas</div></div>
                    </div>
                    {!mobile && <span style={{ fontFamily: DISP, fontSize: 15, color: T.ink }}>{nMods}</span>}
                    {!mobile && <span style={{ fontFamily: DISP, fontSize: 15, color: T.ink }}>{p.students.toLocaleString('pt-BR')}</span>}
                    {!mobile && (<div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 14 }}><div style={{ flex: 1, height: 7, borderRadius: 99, background: 'rgba(24,18,31,.08)', overflow: 'hidden' }}><div style={{ width: pct + '%', height: '100%', background: `linear-gradient(90deg,${p.color}99,${p.color})` }}></div></div><span style={{ fontFamily: MONO, fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{pct}%</span></div>)}
                    {!mobile && <AdmStatus status={p.status} />}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                      <div onClick={() => dupProduct(p.id)} title="Duplicar" style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${T.line}`, marginRight: 4 }}><Ico d={IC.copy} size={15} c={T.dim} /></div>
                      <div onClick={() => setModal({ type: 'product', editId: p.id, data: { title: p.title, subtitle: p.subtitle, kind: p.kind, access: p.access, desc: p.desc || '', color: p.color, displayPrice: p.displayPrice || '', priceInstallment: p.priceInstallment || '', coverImg: p.coverImg == null ? null : p.coverImg, saleIds: p.saleIds || [], banners: p.banners || [], showTitle: p.showTitle !== false } })} style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${T.line}` }}><Ico d={AIC.pencil} size={16} c={T.dim} /></div>
                      <div onClick={() => delProduct(p.id)} style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${T.line}` }}><Ico d={AIC.trash} size={16} c={T.dim} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment> : ProductView}
          {modal && modal.type === 'doors' && (
            <div onClick={() => setModal(null)} style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(20,16,25,.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
                <div style={{ padding: '22px 26px', borderBottom: `1px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: T.ink }}>Novo produto da Franquia</div>
                  <div onClick={() => setModal(null)} style={{ cursor: 'pointer', fontSize: 17, color: T.dim }}>✕</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 24 }}>
                  <div onClick={() => { setModal(null); window.__go && window.__go('fadmin-gen'); }} style={{ background: T.paper, border: `1.5px solid rgba(124,58,237,.22)`, borderRadius: 16, padding: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={IC.spark} size={22} c={T.accent} /></div>
                    <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 17, color: T.ink }}>Criar com IA</div>
                    <div style={{ fontFamily: DISP, fontSize: 13.5, lineHeight: 1.55, color: T.dim }}>Importa um PDF e a IA monta módulos e aulas. Você revisa antes de publicar.</div>
                    <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.accent }}>Importar PDF →</span>
                  </div>
                  <div onClick={() => setModal({ type: 'product', data: modal.data })} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(24,18,31,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={AIC.pencil} size={20} c={T.ink} /></div>
                    <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 17, color: T.ink }}>Criar do zero</div>
                    <div style={{ fontFamily: DISP, fontSize: 13.5, lineHeight: 1.55, color: T.dim }}>Define título, módulos e aulas manualmente. Controle total sobre a estrutura.</div>
                    <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.ink }}>Começar →</span>
                  </div>
                </div>
                <div style={{ padding: '0 24px 20px', fontFamily: DISP, fontSize: 12.5, color: T.dim }}>O produto criado aqui entra no Catálogo Franquia e é compartilhado com todos os franqueados.</div>
              </div>
            </div>
          )}
          {modal && modal.type === 'product' && <ProductModal init={modal.data} editId={modal.editId} onClose={() => setModal(null)} onSave={(d) => { if (modal.editId) updateProduct(modal.editId, d); else addProduct(d); setModal(null); }} />}
          {modal && modal.type === 'module' && <ModuleModal init={modal.data} editId={modal.editId} onClose={() => setModal(null)} onSave={(d) => { if (modal.editId) updateModule(selId, modal.editId, d); else addModule(selId, d); setModal(null); }} />}
          {modal && modal.type === 'lesson' && <LessonModal init={modal.data} editId={modal.editId} accent={sel && sel.color} productLocked={sel && sel.access === 'Premium (upsell)'} onClose={() => setModal(null)} onSave={(d) => { if (modal.editId) updateLesson(selId, modal.mid, modal.editId, d); else addLesson(selId, modal.mid, d); setModal(null); }} />}
          <PhonePreview open={preview} onClose={() => setPreview(false)} courses={previewCourses} />
        </div>
      </DShell>
  );

  return (
    <AuthorShell active="gen" sub="Gerar com IA · sem IA" title="Produtos & Cursos" plainn
      toolbar={<div onClick={() => setPreview(true)} style={{ cursor: 'pointer' }}><ABtn variant="outline" icon={AIC.play} size="sm">Pré-visualizar</ABtn></div>} bleed>
      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        {view === 'list' ? ListView : ProductView}

        {modal && modal.type === 'doors' && (
          <div onClick={() => setModal(null)} style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(20,16,25,.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
              <div style={{ padding: '22px 26px', borderBottom: `1px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: T.ink }}>Novo produto da Franquia</div>
                <div onClick={() => setModal(null)} style={{ cursor: 'pointer', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.dim, fontSize: 17 }}>✕</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 24 }}>
                <div onClick={() => { setModal(null); window.__go && window.__go('gen'); }} style={{ background: T.paper, border: `1.5px solid rgba(124,58,237,.22)`, borderRadius: 16, padding: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={IC.spark} size={22} c={T.accent} /></div>
                  <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 17, color: T.ink }}>Criar com IA</div>
                  <div style={{ fontFamily: DISP, fontSize: 13.5, lineHeight: 1.55, color: T.dim }}>Importa um PDF/ebook e a IA monta os módulos e aulas. Você revisa antes de publicar.</div>
                  <div style={{ alignSelf: 'flex-start', fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.accent }}>Importar PDF →</div>
                </div>
                <div onClick={() => setModal({ type: 'product', data: modal.data })} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(24,18,31,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={AIC.pencil} size={20} c={T.ink} /></div>
                  <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 17, color: T.ink }}>Criar do zero</div>
                  <div style={{ fontFamily: DISP, fontSize: 13.5, lineHeight: 1.55, color: T.dim }}>Define título, módulos e aulas manualmente. Controle total sobre a estrutura.</div>
                  <div style={{ alignSelf: 'flex-start', fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.ink }}>Começar →</div>
                </div>
              </div>
              <div style={{ padding: '0 24px 20px', fontFamily: DISP, fontSize: 12.5, color: T.dim }}>O produto criado aqui entra no Catálogo Franquia e é compartilhado com todos os franqueados.</div>
            </div>
          </div>
        )}
        {modal && modal.type === 'product' && <ProductModal init={modal.data} editId={modal.editId} onClose={() => setModal(null)} onSave={(d) => { if (modal.editId) updateProduct(modal.editId, d); else addProduct(d); setModal(null); }} />}
        {modal && modal.type === 'module' && <ModuleModal init={modal.data} editId={modal.editId} onClose={() => setModal(null)} onSave={(d) => { if (modal.editId) updateModule(sel.id, modal.editId, d); else addModule(sel.id, d); setModal(null); }} />}
        {modal && modal.type === 'lesson' && <LessonModal init={modal.data} editId={modal.editId} accent={sel.color} productLocked={sel.access === 'Premium (upsell)'} onClose={() => setModal(null)} onSave={(d) => { if (modal.editId) updateLesson(sel.id, modal.mid, modal.editId, d); else addLesson(sel.id, modal.mid, d); setModal(null); }} />}

        <PhonePreview open={preview} onClose={() => setPreview(false)} courses={previewCourses} />
      </div>
    </AuthorShell>
  );
}

function ADM_progressPct(p) {
  const ls = p.modules.flatMap((m) => m.lessons);
  if (!ls.length) return 0;
  const d = ls.filter((l) => ADM_PROGRESS[l.id]).length;
  // produtos seed mostram conclusão de "turma": usa students hash p/ variar
  if (p.id === 'p1') return 71; if (p.id === 'p2') return 38; if (p.id === 'p3') return 0;
  return Math.round(d / ls.length * 100);
}

export { ProductsAdminScreen };
