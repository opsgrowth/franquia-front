import React from 'react';
import { ABtn, AIC, AuthorShell } from './author-kit';
import { DShell } from './desktop-screens-1';
import { DISP, IC, Ico, MONO, Mark, T, useIsMobile } from './kit';

// Tela 2 — Ingestão (subir ebook / criar do zero). Reusa author-kit.jsx.

const { useState: useStateIng, useEffect: useEffectIng } = React;

// Overlay de processamento da IA (extração → estrutura → aulas → finalização)
function IngestProcessing({ fileName, onDone }) {
  const steps = [
    ['Lendo o PDF', 'extraindo texto e imagens página a página'],
    ['Mapeando a estrutura', 'identificando módulos e aulas no conteúdo'],
    ['Gerando as aulas', 'transformando o material em blocos editáveis'],
    ['Quase lá', 'calculando a confiança e preparando a revisão'],
  ];
  const [stage, setStage] = useStateIng(0);
  const [pct, setPct] = useStateIng(4);
  useEffectIng(() => {
    const tick = setInterval(() => setPct((p) => Math.min(100, p + 2 + Math.random() * 4)), 180);
    return () => clearInterval(tick);
  }, []);
  useEffectIng(() => {
    if (pct >= 100) { const t = setTimeout(onDone, 600); return () => clearTimeout(t); }
    const s = pct < 28 ? 0 : pct < 56 ? 1 : pct < 84 ? 2 : 3;
    setStage(s);
  }, [pct]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: T.darkBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 92, height: 92, margin: '0 auto' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(196,163,255,.18)', borderTopColor: T.pill, animation: 'ing-spin 0.9s linear infinite' }}></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mark size={40} front={T.accent} ghost={T.pill} inner={T.darkBg} /></div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: T.pill, marginTop: 26 }}>GERANDO COM IA</div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em', color: '#F6F1FB', marginTop: 8 }}>{steps[stage][0]}</div>
        <div style={{ fontFamily: DISP, fontSize: 14.5, color: 'rgba(246,241,251,.6)', marginTop: 8 }}>{steps[stage][1]}</div>

        <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,.1)', marginTop: 28, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${T.accent}, ${T.pill})`, transition: 'width .18s linear' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: 'rgba(246,241,251,.5)' }}>{fileName || 'ebook.pdf'}</span>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.pill, fontWeight: 600 }}>{Math.round(pct)}%</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 30, textAlign: 'left' }}>
          {steps.map((s, i) => {
            const state = i < stage ? 'done' : i === stage ? 'now' : 'wait';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: state === 'wait' ? 0.4 : 1 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: state === 'done' ? T.accent : 'transparent', border: state === 'done' ? 'none' : `1.5px solid ${state === 'now' ? T.pill : 'rgba(246,241,251,.3)'}` }}>
                  {state === 'done' ? <Ico d={AIC.check} size={13} c="#fff" sw={2.6} /> : state === 'now' ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.pill, animation: 'ing-pulse 1s infinite' }}></span> : null}
                </span>
                <span style={{ fontFamily: DISP, fontWeight: state === 'now' ? 600 : 500, fontSize: 14, color: state === 'wait' ? 'rgba(246,241,251,.6)' : '#F6F1FB' }}>{s[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes ing-spin{to{transform:rotate(360deg)}}@keyframes ing-pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

function IngestScreen({ scope }) {
  const isFAdmin = scope === 'franquia';
  const mobile = useIsMobile();
  const [processing, setProcessing] = useStateIng(false);
  const reviewDest = isFAdmin ? 'fadmin-review' : 'review';
  if (isFAdmin) return (
    <DShell active="fadmin" sub="Admin · Catálogo Franquia" title="Novo produto da Franquia">
      <div style={{ flex: 1, overflow: 'auto', padding: mobile ? '24px 18px' : '40px 44px', position: 'relative' }}>
        {processing && <IngestProcessing fileName="metodo-renda-ia.pdf" onDone={() => { setProcessing(false); window.__go && window.__go('fadmin-review'); }} />}
        <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.035em', color: T.ink, margin: 0 }}>Importar PDF com IA</h1>
        <p style={{ fontFamily: DISP, fontSize: 16.5, lineHeight: 1.6, color: T.dim, margin: '12px 0 0', maxWidth: 560 }}>Arraste um PDF ou ebook — a IA monta os módulos e aulas. Você revisa antes de publicar no Catálogo Franquia.</p>
        <div style={{ maxWidth: 540, marginTop: mobile ? 24 : 36, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 20, padding: 30, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={IC.spark} size={20} c={T.accent} /></div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>Importar de um PDF</div>
          </div>
          <div style={{ marginTop: 22, border: `2px dashed rgba(124,58,237,.32)`, background: 'rgba(124,58,237,.04)', borderRadius: 16, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={AIC.upload} size={26} c={T.accent} /></div>
            <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 17, color: T.ink }}>Arraste seu PDF aqui</div>
            <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim }}>ou clique para escolher um ebook</div>
          </div>
          <div style={{ marginTop: 16, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 11, padding: '13px 15px', fontFamily: DISP, fontSize: 14.5, color: 'rgba(24,18,31,.4)' }}>nome do curso</div>
          <div style={{ marginTop: 16 }}><div onClick={() => setProcessing(true)} style={{ cursor: 'pointer' }}><ABtn icon={IC.spark}>Montar com a IA</ABtn></div></div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 12 }}>a IA gera os rascunhos · você revisa antes de publicar no Catálogo Franquia</div>
        </div>
      </div>
    </DShell>
  );

  return (
    <AuthorShell active="gen" sub="Gerar com IA" title="Novo curso" bleed plain>
      <div style={{ flex: 1, width: '100%', overflow: 'auto', padding: mobile ? '24px 18px' : '40px 44px', position: 'relative' }}>
        {processing && <IngestProcessing fileName="metodo-renda-ia.pdf" onDone={() => { setProcessing(false); window.__go && window.__go(reviewDest); }} />}
        <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.035em', color: T.ink, margin: 0 }}>Novo curso</h1>
        <p style={{ fontFamily: DISP, fontSize: 16.5, lineHeight: 1.6, color: T.dim, margin: '12px 0 0', maxWidth: 560 }}>
          Deixe a IA montar a partir de um PDF — ou comece do zero. Você revisa antes de publicar.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 22, marginTop: mobile ? 24 : 36, maxWidth: 920 }}>
          {/* Importar de um PDF */}
          <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 20, padding: 30, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico d={IC.spark} size={20} c={T.accent} />
              </div>
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>Importar de um PDF</div>
            </div>

            {/* dropzone */}
            <div style={{ marginTop: 22, border: `2px dashed rgba(124,58,237,.32)`, background: 'rgba(124,58,237,.04)', borderRadius: 16, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico d={AIC.upload} size={26} c={T.accent} />
              </div>
              <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 17, color: T.ink }}>Arraste seu PDF aqui</div>
              <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim }}>ou clique para escolher um ebook</div>
            </div>

            {/* nome do curso */}
            <div style={{ marginTop: 16, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 11, padding: '13px 15px', fontFamily: DISP, fontSize: 14.5, color: 'rgba(24,18,31,.4)' }}>
              nome do curso
            </div>

            <div style={{ marginTop: 16 }}>
              <div onClick={() => setProcessing(true)} style={{ cursor: 'pointer' }}>
                <ABtn icon={IC.spark}>Montar com a IA</ABtn>
              </div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 12 }}>a IA gera os rascunhos · você revisa antes de publicar</div>
          </div>

          {/* Criar do zero */}
          <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 20, padding: 30, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(24,18,31,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico d={AIC.pencil} size={19} c={T.ink} />
              </div>
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>Criar do zero</div>
            </div>
            <p style={{ fontFamily: DISP, fontSize: 14.5, lineHeight: 1.65, color: T.dim, margin: '18px 0 0' }}>
              Monte aula por aula você mesmo, sem IA. Adicione módulos, aulas e blocos de conteúdo (texto, vídeo, citação, lista, imagem) com liberdade total.
            </p>

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Módulos e aulas', AIC.list], ['Blocos de conteúdo', AIC.paragraph], ['Publica quando quiser', AIC.check]].map(([t, d], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <Ico d={d} size={15} c={T.accentDeep} />
                  </div>
                  <span style={{ fontFamily: DISP, fontSize: 14.5, color: T.ink }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 22 }}>
              <div onClick={() => window.__go && window.__go('manual')} style={{ cursor: 'pointer' }}>
                <ABtn variant="outline" icon={AIC.plus}>Começar do zero</ABtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthorShell>
  );
}

export { IngestScreen };
