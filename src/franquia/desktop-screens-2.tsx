import React from 'react';
import { DBtn, DShell } from './desktop-screens-1';
import { DISP, IC, Ico, Lockup, MONO, Mark, T, useIsMobile } from './kit';

// Ferramenta FranquIA · desktop (parte 2) — Gerador de IA + Editor/Publicar

// ── Gerador de IA ─────────────────────────────────────────────────
function DGerador() {
  const gmob = useIsMobile();
  return (
    <DShell active="gen" sub="IA · em cima do validado" title="Gerar nova versão" action={<DBtn variant="ghost" icon={IC.spark}>Histórico</DBtn>}>
      <div style={{ display: 'grid', gridTemplateColumns: gmob ? '1fr' : '1fr 1fr', gap: 16, height: gmob ? 'auto' : '100%' }}>
        {/* left: controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
          <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim, letterSpacing: '0.06em' }}>BASE VALIDADA</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 11, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mark size={24} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15.5 }}>E-book · Renda com IA</div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 2 }}>12 vendas · R$97</div>
              </div>
              <DBtn variant="ghost">Trocar</DBtn>
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 20, flex: 1 }}>
            <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15 }}>Para qual público?</div>
            <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 12, padding: 16, marginTop: 12, minHeight: 86 }}>
              <span style={{ fontFamily: DISP, fontSize: 15, lineHeight: 1.5 }}>Mães que querem renda extra no celular, com tom acolhedor e linguagem simples<span style={{ color: T.accent }}>|</span></span>
            </div>
            <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.dim, margin: '18px 0 10px' }}>Estilo</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Iniciante', 'Acolhedor', 'Direto', 'Premium', 'Jovem'].map((c, i) => (
                <div key={i} style={{ fontFamily: DISP, fontSize: 13, fontWeight: 600, padding: '8px 15px', borderRadius: 99, background: i === 1 ? T.accent : '#fff', color: i === 1 ? '#fff' : T.dim, border: `1px solid ${i === 1 ? T.accent : T.line}` }}>{c}</div>
              ))}
            </div>
            <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.dim, margin: '20px 0 10px' }}>O que gerar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Nova página de vendas', true], ['Variação do e-book', true], ['Criativos para anúncio', false]].map(([t, on], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: on ? T.accent : '#fff', border: `1.5px solid ${on ? T.accent : T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && <Ico d={IC.check} size={13} c="#fff" sw={2.6} />}</div>
                  <span style={{ fontFamily: DISP, fontSize: 14.5, color: T.ink }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div><DBtn icon={IC.spark}>Gerar nova versão</DBtn></div>
        </div>

        {/* right: preview */}
        <div style={{ background: T.ink, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Ico d={IC.spark} size={17} c={T.pill} />
            <span style={{ fontFamily: MONO, fontSize: 11, color: T.pill, letterSpacing: '0.06em' }}>GERANDO PRÉVIA…</span>
            <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 11, color: 'rgba(246,241,251,.5)' }}>v2 · iniciante</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,.04)', borderRadius: 12, marginTop: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 54, height: 54, borderRadius: 14, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mark size={28} front="#fff" ghost={T.halo} inner={T.accent} /></div>
            <div style={{ height: 16, borderRadius: 6, background: 'rgba(196,163,255,.5)', width: '85%' }}></div>
            <div style={{ height: 16, borderRadius: 6, background: 'rgba(196,163,255,.3)', width: '65%' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 6 }}>
              {[92, 80, 86, 70].map((w, i) => <div key={i} style={{ height: 9, borderRadius: 5, background: 'rgba(246,241,251,.12)', width: `${w}%` }}></div>)}
            </div>
            <div style={{ marginTop: 'auto', height: 44, borderRadius: 10, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontWeight: 600, fontSize: 14, color: '#fff', opacity: 0.9 }}>Quero esse · R$97</div>
          </div>
        </div>
      </div>
    </DShell>
  );
}

// ── Editor / Publicar ─────────────────────────────────────────────
function DEditor() {
  const emob = useIsMobile();
  return (
    <DShell active="cat" sub="Produto · #23" title="Editar página" action={<div style={{ display: 'flex', gap: 10 }}><DBtn variant="ghost" onClick={() => window.__go && window.__go('cat')}>Pré-visualizar</DBtn><DBtn icon={IC.link} onClick={() => window.__go && window.__go('cat')}>Publicar página</DBtn></div>}>
      <div style={{ display: 'grid', gridTemplateColumns: emob ? '1fr' : '300px 1fr', gap: 16, height: emob ? 'auto' : '100%' }}>
        {/* left: fields */}
        <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 20, overflow: 'hidden' }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15 }}>Conteúdo</div>
          {[['Título', 'Renda com IA do zero'], ['Subtítulo', 'O passo a passo no celular'], ['Preço', 'R$ 97'], ['Botão', 'Quero começar']].map(([k, v], i) => (
            <div key={i} style={{ marginTop: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.dim, letterSpacing: '0.04em' }}>{k.toUpperCase()}</div>
              <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 10, padding: '11px 13px', marginTop: 6, fontFamily: DISP, fontSize: 14, color: T.ink }}>{v}</div>
            </div>
          ))}
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.dim, margin: '20px 0 10px' }}>Tema</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[T.accent, T.ink, '#0E9A50', '#E2502F'].map((c, i) => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: 9, background: c, boxShadow: i === 0 ? `0 0 0 2px #fff, 0 0 0 4px ${T.accent}` : 'none' }}></div>
            ))}
          </div>
        </div>

        {/* right: live preview */}
        <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14 }}>
            <div style={{ display: 'flex', gap: 6 }}>{['#E2502F', '#E2A33D', '#0E9A50'].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }}></div>)}</div>
            <div style={{ flex: 1, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 7, padding: '6px 12px', fontFamily: MONO, fontSize: 11, color: T.dim, textAlign: 'center' }}>franquia.ia/camila/renda-com-ia</div>
          </div>
          {/* rendered landing preview */}
          <div style={{ flex: 1, background: T.darkBg, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -30, top: 30, opacity: 0.2 }}><Mark size={170} front={T.accent} ghost={T.pill} inner={T.darkBg} /></div>
            <div style={{ position: 'relative', padding: 36 }}>
              <Lockup scale={0.42} color={T.darkText} ia={T.pill} front={T.accent} ghost={T.pill} inner={T.darkBg} />
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 38, letterSpacing: '-0.035em', color: T.darkText, marginTop: 40, lineHeight: 1.05, maxWidth: 460 }}>Renda com IA <span style={{ color: T.pill }}>do zero</span>.</div>
              <div style={{ fontFamily: DISP, fontSize: 16, color: 'rgba(246,241,251,.6)', marginTop: 14 }}>O passo a passo no celular, em poucos minutos por dia.</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 28, background: T.accent, color: '#fff', borderRadius: 12, padding: '14px 26px', fontFamily: DISP, fontWeight: 600, fontSize: 16, boxShadow: '0 12px 30px rgba(124,58,237,.45)' }}>Quero começar →</div>
              <div style={{ fontFamily: MONO, fontSize: 11.5, color: 'rgba(246,241,251,.5)', marginTop: 18 }}>R$ 97 · acesso imediato</div>
            </div>
          </div>
        </div>
      </div>
    </DShell>
  );
}

export { DGerador, DEditor };
