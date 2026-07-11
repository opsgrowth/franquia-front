import React from 'react';
import { ABtn, AIC, AuthorShell } from './author-kit';
import { DShell } from './desktop-screens-1';
import { DISP, IC, Ico, MONO, Mark, T, useIsMobile } from './kit';
import { cancelJob, confirmJob, createJob, getJob, progressPct, statusLabel } from '../lib/ingestion';

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

// Overlay de processamento REAL — dirigido pelo status do job (não animação fake).
function IngestLive({ label, pct, fileName }: { label: string; pct: number; fileName?: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: T.darkBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 92, height: 92, margin: '0 auto' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(196,163,255,.18)', borderTopColor: T.pill, animation: 'ing-spin 0.9s linear infinite' }}></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mark size={40} front={T.accent} ghost={T.pill} inner={T.darkBg} /></div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: T.pill, marginTop: 26 }}>GERANDO COM IA</div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em', color: '#F6F1FB', marginTop: 10 }}>{label}</div>
        <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,.1)', marginTop: 24, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${T.accent}, ${T.pill})`, transition: 'width .3s' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: 'rgba(246,241,251,.5)' }}>{fileName || 'ebook.pdf'}</span>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.pill, fontWeight: 600 }}>{pct}%</span>
        </div>
        <div style={{ fontFamily: DISP, fontSize: 13, color: 'rgba(246,241,251,.5)', marginTop: 22 }}>A IA continua no servidor mesmo se você sair. Leva ~1–2 min.</div>
      </div>
      <style>{`@keyframes ing-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// Popup: funcionalidade exclusiva para alunos do sistema Recorrência
function RecorrenciaPaywall({ onClose }) {
  const [stage, setStage] = useStateIng('offer');
  const [nome, setNome] = useStateIng('Camila Oliveira');
  const [email, setEmail] = useStateIng('camila@franquia.ia');
  const [zap, setZap] = useStateIng('');
  const [sent, setSent] = useStateIng(false);
  const perks = [
    'Gere aplicativos que faturam todo mês, no automático',
    'Venda uma vez e receba de forma recorrente',
    'Catálogo de produtos validados + IA que multiplica',
    'Comunidade seleta e acesso vitalício às atualizações',
  ];
  const fld = { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(196,163,255,.22)', borderRadius: 11, padding: '13px 15px', fontFamily: DISP, fontSize: 15, color: '#F6F1FB', outline: 'none' };
  const lbl = { fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em', color: T.pill, textTransform: 'uppercase', margin: '0 0 7px', display: 'block' };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(20,16,25,.62)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, background: T.darkBg, borderRadius: 24, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.5)', position: 'relative' }}>
        <div onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, zIndex: 3, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.12)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer' }}>✕</div>
        <div style={{ padding: '38px 32px 30px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -30, opacity: 0.16 }}><Mark size={200} front={T.accent} ghost={T.pill} inner={T.darkBg} /></div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(196,163,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ico d="M6 10V7a6 6 0 0 1 12 0v3 M5 10h14v11H5z" size={28} c={T.pill} />
            </div>

            {stage === 'offer' ? (
              <React.Fragment>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: T.pill, marginTop: 22 }}>ACESSO EXCLUSIVO</div>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 28, letterSpacing: '-0.03em', color: '#F6F1FB', marginTop: 8, lineHeight: 1.1 }}>
                  Criar aplicativos é para alunos do <span style={{ color: T.pill }}>RecorrêncIA</span>
                </div>
                <div style={{ fontFamily: DISP, fontSize: 15, lineHeight: 1.55, color: 'rgba(246,241,251,.65)', marginTop: 12 }}>
                  Faça parte do grupo seleto que fatura todos os meses de forma recorrente — vendendo uma vez e recebendo por meses.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                  {perks.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', marginTop: 1 }}><Ico d={AIC.check} size={13} c="#fff" sw={2.6} /></span>
                      <span style={{ fontFamily: DISP, fontSize: 14.5, lineHeight: 1.45, color: '#F6F1FB' }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div onClick={() => setStage('form')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 28, background: T.accent, color: '#fff', borderRadius: 14, padding: '17px', fontFamily: DISP, fontWeight: 700, fontSize: 16.5, boxShadow: '0 12px 30px rgba(124,58,237,.45)', cursor: 'pointer' }}>
                  Quero fazer parte do RecorrêncIA →
                </div>
                <div style={{ fontFamily: DISP, fontSize: 12.5, color: 'rgba(246,241,251,.5)', textAlign: 'center', marginTop: 14 }}>Vagas limitadas · acesso imediato após a compra</div>
              </React.Fragment>
            ) : sent ? (
              <React.Fragment>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em', color: '#F6F1FB', marginTop: 22, lineHeight: 1.12 }}>
                  Tudo certo, <span style={{ color: T.pill }}>{nome.split(' ')[0]}</span>! 🎉
                </div>
                <div style={{ fontFamily: DISP, fontSize: 15, lineHeight: 1.55, color: 'rgba(246,241,251,.65)', marginTop: 12 }}>
                  Você entrou na lista do <b style={{ color: '#F6F1FB', fontWeight: 600 }}>RecorrêncIA</b>. Nossa equipe vai te chamar no WhatsApp com as próximas instruções assim que as vagas abrirem.
                </div>
                <div onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 28, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(196,163,255,.25)', color: '#fff', borderRadius: 14, padding: '15px', fontFamily: DISP, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                  Fechar
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: T.pill, marginTop: 22 }}>LISTA DE ESPERA · RECORRÊNCIA</div>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em', color: '#F6F1FB', marginTop: 8, lineHeight: 1.12 }}>
                  Garanta seu lugar
                </div>
                <div style={{ fontFamily: DISP, fontSize: 14.5, lineHeight: 1.5, color: 'rgba(246,241,251,.6)', marginTop: 10 }}>
                  Confirme seus dados — a gente te chama no WhatsApp assim que as vagas abrirem.
                </div>
                <div style={{ marginTop: 22 }}>
                  <label style={lbl}>Nome</label>
                  <input value={nome} onChange={(e) => setNome(e.target.value)} style={fld} />
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={lbl}>E-mail</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} style={fld} />
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={lbl}>WhatsApp</label>
                  <input value={zap} onChange={(e) => setZap(e.target.value)} placeholder="(00) 00000-0000" style={fld} />
                </div>
                <div onClick={() => { if (zap.trim()) setSent(true); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, background: zap.trim() ? T.accent : 'rgba(124,58,237,.4)', color: '#fff', borderRadius: 14, padding: '17px', fontFamily: DISP, fontWeight: 700, fontSize: 16, boxShadow: zap.trim() ? '0 12px 30px rgba(124,58,237,.45)' : 'none', cursor: zap.trim() ? 'pointer' : 'default' }}>
                  Entrar na lista de espera
                </div>
                <div style={{ fontFamily: DISP, fontSize: 12, color: 'rgba(246,241,251,.45)', textAlign: 'center', marginTop: 12 }}>Seus dados estão seguros · sem spam</div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IngestScreen({ scope }) {
  const isFAdmin = scope === 'franquia';
  const mobile = useIsMobile();
  const [processing, setProcessing] = useStateIng(false);
  const [paywall, setPaywall] = useStateIng(false);
  const reviewDest = isFAdmin ? 'fadmin-review' : 'review';
  // ── ingestão REAL (usada no branch isFAdmin) ──────────────────────────
  const [file, setFile] = useStateIng<any>(null);
  const [cname, setCname] = useStateIng('');
  const [jobId, setJobId] = useStateIng<string | null>(null);
  const [job, setJob] = useStateIng<any>(null);
  const [err, setErr] = useStateIng('');
  const [busy, setBusy] = useStateIng(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  useEffectIng(() => {
    if (!jobId) return;
    let alive = true;
    const tick = async () => {
      if (!alive) return;
      try {
        const j = await getJob(jobId);
        if (!alive) return;
        setJob(j);
        if (j.status === 'done') { try { if ((window as any).__refreshApps) await (window as any).__refreshApps(); } catch (e) {} if (j.app_id) (window as any).__openProduct = j.app_id; window.__go && window.__go('fadmin'); return; }
        if (j.status === 'failed') { setErr(j.error_message || 'A IA não conseguiu processar este arquivo. Tente outro PDF.'); setBusy(false); return; }
        setTimeout(tick, 2200);
      } catch (e) { if (alive) setTimeout(tick, 3500); }
    };
    tick();
    return () => { alive = false; };
  }, [jobId]);
  const onPick = (e: any) => { const f = e.target.files && e.target.files[0]; if (f) { setFile(f); setErr(''); if (!cname) setCname((f.name || '').replace(/\.pdf$/i, '').slice(0, 80)); } };
  const startIngest = async () => {
    if (!file || busy) return;
    setBusy(true); setErr('');
    try { const r = await createJob(file, cname); setJobId(r.job_id); setJob({ id: r.job_id, status: r.status || 'queued' }); }
    catch (e: any) { setErr(e?.message || 'Erro ao enviar o arquivo.'); setBusy(false); }
  };
  const doConfirm = async () => { try { const j = await confirmJob(jobId!); setJob(j); } catch (e) {} };
  const doCancel = async () => { try { await cancelJob(jobId!); } catch (e) {} setJobId(null); setJob(null); setFile(null); setBusy(false); setErr(''); };
  const resetIngest = () => { setErr(''); setJobId(null); setJob(null); setBusy(false); };

  if (isFAdmin) {
    const st = job && job.status;
    const live = !!jobId && st && st !== 'failed' && st !== 'needs_confirmation';
    return (
    <DShell active="fadmin" sub="Admin · Catálogo Franquia" title="Novo produto da Franquia">
      <div style={{ flex: 1, overflow: 'auto', padding: mobile ? '24px 18px' : '40px 44px', position: 'relative' }}>
        {live && <IngestLive label={statusLabel(job)} pct={progressPct(job)} fileName={file && file.name} />}
        <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.035em', color: T.ink, margin: 0 }}>Importar PDF com IA</h1>
        <p style={{ fontFamily: DISP, fontSize: 16.5, lineHeight: 1.6, color: T.dim, margin: '12px 0 0', maxWidth: 560 }}>Arraste um PDF ou ebook — a IA monta os módulos e aulas. Você revisa antes de publicar no Catálogo Franquia.</p>
        <div style={{ maxWidth: 540, marginTop: mobile ? 24 : 36, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 20, padding: 30, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={IC.spark} size={20} c={T.accent} /></div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>Importar de um PDF</div>
          </div>
          {err ? (
            <div style={{ marginTop: 20, background: 'rgba(216,90,48,.07)', border: '1px solid rgba(216,90,48,.28)', borderRadius: 14, padding: 20 }}>
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: '#B23A16' }}>Não deu certo</div>
              <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim, marginTop: 6, lineHeight: 1.5 }}>{err}</div>
              <div onClick={resetIngest} style={{ cursor: 'pointer', marginTop: 14, display: 'inline-block' }}><ABtn icon={IC.spark}>Tentar de novo</ABtn></div>
            </div>
          ) : st === 'needs_confirmation' ? (
            <div style={{ marginTop: 20, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 14, padding: 20 }}>
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: T.ink }}>Documento grande{job && job.est_modules ? ` (~${job.est_modules} módulos)` : ''}</div>
              <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim, marginTop: 6, lineHeight: 1.5 }}>Vai levar um pouco mais de tempo pra montar. Quer continuar?</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 14, alignItems: 'center' }}>
                <div onClick={doConfirm} style={{ cursor: 'pointer' }}><ABtn icon={IC.spark}>Continuar</ABtn></div>
                <div onClick={doCancel} style={{ cursor: 'pointer', fontFamily: DISP, fontWeight: 600, fontSize: 14, color: T.dim }}>Cancelar</div>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <input ref={fileRef} type="file" accept="application/pdf,.pdf" onChange={onPick} style={{ display: 'none' }} />
              <div onClick={() => fileRef.current && fileRef.current.click()} style={{ marginTop: 22, border: `2px dashed ${file ? T.accent : 'rgba(124,58,237,.32)'}`, background: 'rgba(124,58,237,.04)', borderRadius: 16, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={file ? AIC.check : AIC.upload} size={26} c={T.accent} /></div>
                <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 17, color: T.ink, wordBreak: 'break-word' }}>{file ? file.name : 'Arraste seu PDF aqui'}</div>
                <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim }}>{file ? 'clique para trocar' : 'ou clique para escolher um ebook'}</div>
              </div>
              <input value={cname} onChange={(e) => setCname(e.target.value)} placeholder="nome do curso (opcional)" style={{ marginTop: 16, background: '#fff', border: `1px solid ${T.line}`, borderRadius: 11, padding: '13px 15px', fontFamily: DISP, fontSize: 14.5, color: T.ink, outline: 'none' }} />
              <div style={{ marginTop: 16 }}><div onClick={startIngest} style={{ cursor: file && !busy ? 'pointer' : 'default', opacity: file && !busy ? 1 : 0.5 }}><ABtn icon={IC.spark}>{busy ? 'Enviando…' : 'Montar com a IA'}</ABtn></div></div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: T.dim, marginTop: 12 }}>a IA gera os rascunhos · você revisa antes de publicar no Catálogo Franquia</div>
            </React.Fragment>
          )}
        </div>
      </div>
    </DShell>
    );
  }

  return (
    <AuthorShell active="gen" sub="Gerar com IA" title="Novo aplicativo" bleed plain>
      <div style={{ flex: 1, width: '100%', overflow: 'auto', padding: mobile ? '24px 18px' : '40px 44px', position: 'relative' }}>
        {processing && <IngestProcessing fileName="metodo-renda-ia.pdf" onDone={() => { setProcessing(false); window.__go && window.__go(reviewDest); }} />}
        {paywall && <RecorrenciaPaywall onClose={() => setPaywall(false)} />}
        <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.035em', color: T.ink, margin: 0 }}>Novo aplicativo</h1>
        <p style={{ fontFamily: DISP, fontSize: 16.5, lineHeight: 1.6, color: T.dim, margin: '12px 0 0', maxWidth: 560 }}>
          Crie um aplicativo que fatura de forma recorrente: você vende uma vez e recebe por meses. A IA monta a partir de um PDF, ou comece do zero — você revisa antes de publicar.
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
              <div onClick={() => setPaywall(true)} style={{ cursor: 'pointer' }}>
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
              <div onClick={() => setPaywall(true)} style={{ cursor: 'pointer' }}>
                <ABtn variant="outline" icon={AIC.plus}>Começar do zero</ABtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthorShell>
  );
}

export { IngestScreen, RecorrenciaPaywall };
