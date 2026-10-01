import React from 'react';
import { AIC } from './author-kit';
import { Perfil } from './co-tabs';
import { DShell } from './desktop-screens-1';
import { DISP, IC, Ico, MONO, Mark, T, useIsMobile } from './kit';
import { loadAllWebhookUrls } from '../lib/promotions';
import { isBackendId } from '../lib/apps';
import { getMe, setMeName } from '../lib/auth';
import { api } from '../lib/api';

// Tela: Config — conta, identidade do app do aluno, integrações (webhooks), preferências.
// Reusa T/DISP/MONO/Ico/IC/AIC/Mark + DShell (desktop-screens-1).

function DConfig() {
  const cmob = useIsMobile();
  const [sec, setSec] = React.useState(() => (typeof window !== 'undefined' && window.__cfgSection) ? window.__cfgSection : 'conta');
  const [color, setColor] = React.useState('#7C3AED');
  const [whMap, setWhMap] = React.useState<Record<string, string>>({});
  const [copied, setCopied] = React.useState('');
  const [, _forceCfg] = React.useState(0);
  const _me = getMe();
  const _nome = (_me && _me.creator && _me.creator.name) || 'Você';
  const _email = (_me && _me.creator && _me.creator.email) || '';
  const [nomeEdit, setNomeEdit] = React.useState(_nome);
  const [savingConta, setSavingConta] = React.useState<'idle' | 'saving' | 'ok'>('idle');
  const _inicial = (nomeEdit || _nome).charAt(0).toUpperCase();
  const saveConta = async () => {
    setSavingConta('saving');
    try {
      await api('/me', { method: 'PATCH', tenant: false, body: { name: nomeEdit.trim() } });
      setMeName(nomeEdit.trim());
      setSavingConta('ok');
      setTimeout(() => setSavingConta('idle'), 1800);
    } catch (e) {
      setSavingConta('idle');
    }
  };
  const [notif, setNotif] = React.useState({ venda: true, acesso: true, resumo: false, mkt: false });
  const franqProds = (typeof window !== 'undefined' && window.__franquiaProducts) ? window.__franquiaProducts : [];
  // Produtos REAIS que o franqueado pode vender (id UUID, publicado, não-premium).
  const promotable = franqProds.filter((p: any) => p && isBackendId(p.id) && !p.isPremium && p.access !== 'Premium (upsell)' && p.catalogPublished !== false && !p.camouflaged);
  // Uma URL de webhook REAL por produto (backend /promotions, idempotente).
  React.useEffect(() => {
    let alive = true;
    const ids = promotable.map((p: any) => p.id);
    if (!ids.length) return;
    loadAllWebhookUrls(ids).then((m) => { if (alive) setWhMap(m); }).catch(() => {});
    return () => { alive = false; };
  }, [promotable.map((p: any) => p.id).join(',')]);
  // window.__franquiaProducts chega assíncrono → re-render curto até a lista popular.
  React.useEffect(() => {
    if (promotable.length) return;
    const id = setInterval(() => { if ((window as any).__franquiaProducts && (window as any).__franquiaProducts.length) _forceCfg((n: number) => n + 1); }, 500);
    return () => clearInterval(id);
  }, [promotable.length]);
  const copyWebhook = (url: string, id: string) => {
    try { navigator.clipboard.writeText(url); } catch (e) {}
    setCopied(id); setTimeout(() => setCopied(''), 1600);
  };

  const SECTIONS = [
    ['conta', 'Conta', IC.user],
    ['app', 'Identidade do app', AIC.image],
    ['integ', 'Integrações', 'M9 2v4 M15 2v4 M7 6h10v3a5 5 0 0 1-10 0z M12 14v6'],
    ['prefs', 'Preferências', 'M12 3l2 6 6 .2-4.8 3.6L17 19l-5-3.5L7 19l1.8-6.2L4 9.2 10 9z'],
  ];
  const COLORS = ['#7C3AED', '#5246E5', '#A23CD6', '#6429C9', '#1F8A5B', '#B5468A', '#3F6FD8', '#E2632F'];

  const lbl = { fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.ink, display: 'block', margin: '0 0 7px' };
  const inp = { fontFamily: DISP, width: '100%', border: `1px solid ${T.line}`, borderRadius: 11, padding: '12px 14px', fontSize: 15, color: T.ink, outline: 'none', background: '#fff', boxSizing: 'border-box' };
  const Card = ({ children, pad = 26 }) => <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 18, padding: pad }}>{children}</div>;
  const CardTitle = ({ children, sub }) => <div style={{ marginBottom: 18 }}><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', color: T.ink }}>{children}</div>{sub && <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim, marginTop: 3 }}>{sub}</div>}</div>;
  const Toggle = ({ on, onClick }) => (
    <div onClick={onClick} style={{ width: 44, height: 26, borderRadius: 99, background: on ? T.accent : 'rgba(24,18,31,.18)', position: 'relative', transition: 'background .15s', flex: '0 0 auto', cursor: 'pointer' }}><div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></div></div>
  );
  const Save = () => <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.accent, color: '#fff', borderRadius: 11, padding: '12px 20px', fontFamily: DISP, fontWeight: 600, fontSize: 14.5, boxShadow: '0 8px 20px rgba(124,58,237,.32)', cursor: 'pointer' }}><Ico d={AIC.check} size={17} c="#fff" />Salvar alterações</div>;

  const Conta = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <CardTitle sub="Como você aparece na ferramenta.">Perfil do criador</CardTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 26, flex: '0 0 auto' }}>{_inicial}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${T.line}`, borderRadius: 10, padding: '9px 15px', fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.ink, cursor: 'pointer' }}><Ico d={AIC.upload} size={15} c={T.ink} />Trocar foto</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cmob ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div><label style={lbl}>Nome</label><input value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} style={inp} /></div>
          <div><label style={lbl}>E-mail</label><input value={_email} readOnly style={{ ...inp, background: T.paper, color: T.dim, cursor: 'not-allowed' }} /></div>
        </div>
      </Card>
      <Card>
        <CardTitle sub="Atualize sua senha de acesso.">Segurança</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: cmob ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div><label style={lbl}>Nova senha</label><input type="password" defaultValue="••••••••" style={inp} /></div>
          <div><label style={lbl}>Confirmar senha</label><input type="password" defaultValue="••••••••" style={inp} /></div>
        </div>
      </Card>
      <Card>
        <CardTitle sub="Encerre sua sessão neste dispositivo.">Sessão</CardTitle>
        <div onClick={() => window.__go && window.__go('logout')} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: `1.5px solid #D9534F`, color: '#C0392B', borderRadius: 11, padding: '12px 20px', fontFamily: DISP, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          <Ico d={'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3 M10 17l5-5-5-5 M15 12H3'} size={17} c={'#C0392B'} />Sair da conta
        </div>
      </Card>
      <div onClick={saveConta} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: savingConta === 'ok' ? '#0E9A50' : T.accent, color: '#fff', borderRadius: 11, padding: '12px 20px', fontFamily: DISP, fontWeight: 600, fontSize: 14.5, boxShadow: '0 8px 20px rgba(124,58,237,.32)', cursor: 'pointer', opacity: savingConta === 'saving' ? 0.7 : 1 }}><Ico d={AIC.check} size={17} c="#fff" />{savingConta === 'ok' ? 'Salvo!' : savingConta === 'saving' ? 'Salvando…' : 'Salvar alterações'}</div>
    </div>
  );

  const AppId = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <CardTitle sub="O app que seus alunos abrem — logo, cor e endereço.">Identidade do app do aluno</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: cmob ? '1fr' : '1.1fr 1fr', gap: 24 }}>
          <div>
            <label style={lbl}>Logo do app</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Mark size={28} front="#fff" ghost="#fff" inner="transparent" /></div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${T.line}`, borderRadius: 10, padding: '9px 15px', fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: T.ink, cursor: 'pointer' }}><Ico d={AIC.upload} size={15} c={T.ink} />Enviar logo</div>
            </div>
            <label style={{ ...lbl, marginTop: 22 }}>Cor da marca</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {COLORS.map((c) => <div key={c} onClick={() => setColor(c)} style={{ width: 38, height: 38, borderRadius: 10, background: c, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: color === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none' }}>{color === c && <Ico d={AIC.check} size={16} c="#fff" sw={2.6} />}</div>)}
            </div>
            <label style={{ ...lbl, marginTop: 22 }}>Endereço do app</label>
            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${T.line}`, borderRadius: 11, overflow: 'hidden' }}>
              <input defaultValue="camila" style={{ ...inp, border: 'none', borderRadius: 0, flex: 1 }} />
              <span style={{ fontFamily: MONO, fontSize: 13.5, color: T.dim, padding: '0 14px', background: T.paper, alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>.franquia.ia</span>
            </div>
            <div style={{ fontFamily: DISP, fontSize: 12, color: T.dim, marginTop: 8 }}>Domínio próprio disponível no plano avançado.</div>
          </div>
          {/* preview do header do app */}
          <div>
            <label style={lbl}>Pré-visualização</label>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.line}` }}>
              <div style={{ background: '#1A1422', padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mark size={18} front="#fff" ghost="#fff" inner="transparent" /></div>
                <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15, color: '#F6F1FB' }}>{_nome}</span>
              </div>
              <div style={{ padding: 16, background: '#F8F5FB' }}>
                <div style={{ height: 90, borderRadius: 12, background: `linear-gradient(135deg, ${color}99, ${color})`, position: 'relative', overflow: 'hidden' }}><div style={{ position: 'absolute', right: -8, bottom: -10, opacity: 0.25 }}><Mark size={50} front="#fff" ghost="#fff" inner="transparent" /></div></div>
                <div style={{ height: 9, width: '60%', borderRadius: 6, background: 'rgba(24,18,31,.12)', marginTop: 12 }}></div>
                <div style={{ height: 9, width: '40%', borderRadius: 6, background: 'rgba(24,18,31,.08)', marginTop: 8 }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div><Save /></div>
    </div>
  );

  const Integ = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <CardTitle sub="Cada produto tem uma URL PRÓPRIA. Na sua plataforma de vendas (Kiwify), cole a URL do produto que você está vendendo.">Suas URLs de webhook</CardTitle>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(224,99,47,.08)', border: '1px solid rgba(224,99,47,.25)', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
          <Ico d={'M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'} size={17} c={'#C2521F'} />
          <span style={{ fontFamily: DISP, fontSize: 13, color: '#8A3A12', lineHeight: 1.5 }}><b style={{ fontWeight: 700 }}>Use a URL do produto certo.</b> Colar a URL de um produto na venda de outro libera o produto errado pro comprador.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {promotable.length === 0 && <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, padding: '20px 0', textAlign: 'center' }}>Publique um produto no catálogo para gerar as URLs.</div>}
          {promotable.map((p: any) => {
            const url = whMap[p.id];
            const on = copied === p.id;
            return (
              <div key={p.id} style={{ border: `1px solid ${T.line}`, borderRadius: 14, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 7, background: (typeof p.coverImg === 'string' && p.coverImg) ? `center/cover no-repeat url("${p.coverImg}")` : (p.color || T.accent), flex: '0 0 auto' }} />
                  <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 11, padding: '10px 12px' }}>
                  <Ico d={AIC.link} size={15} c={T.dim} />
                  <span style={{ flex: 1, fontFamily: MONO, fontSize: 12.5, color: url ? T.ink : T.dim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url || 'Gerando…'}</span>
                  <div onClick={() => url && copyWebhook(url, p.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: on ? '#0E9A50' : '#fff', border: `1px solid ${on ? '#0E9A50' : T.line}`, borderRadius: 8, padding: '7px 12px', fontFamily: DISP, fontWeight: 600, fontSize: 12.5, color: on ? '#fff' : (url ? T.ink : T.dim), cursor: url ? 'pointer' : 'default' }}><Ico d={AIC.copy} size={14} c={on ? '#fff' : (url ? T.ink : T.dim)} />{on ? 'Copiado!' : 'Copiar'}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: DISP, fontSize: 12.5, color: T.dim, marginTop: 16, lineHeight: 1.6 }}><b style={{ color: T.ink, fontWeight: 600 }}>Como configurar:</b> 1) Copie a URL do produto. 2) Na Kiwify, vá em <b style={{ color: T.ink, fontWeight: 600 }}>Webhooks</b> e cole. 3) Pronto — cada venda desse produto libera o acesso automaticamente.</div>
      </Card>
    </div>
  );

  const Prefs = (
    <Card>
      <CardTitle sub="Escolha o que quer receber por e-mail.">Notificações</CardTitle>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[['venda', 'Nova venda', 'Avisar a cada compra aprovada.'], ['acesso', 'Acesso liberado', 'Quando um aluno entra pela primeira vez.'], ['resumo', 'Resumo semanal', 'Um panorama de vendas toda segunda.'], ['mkt', 'Novidades da Franquia', 'Novos produtos no catálogo e dicas.']].map(([k, t, d], i) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderTop: i ? `1px solid ${T.line}` : 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15, color: T.ink }}>{t}</div>
              <div style={{ fontFamily: DISP, fontSize: 13, color: T.dim, marginTop: 2 }}>{d}</div>
            </div>
            <Toggle on={notif[k]} onClick={() => setNotif((n) => ({ ...n, [k]: !n[k] }))} />
          </div>
        ))}
      </div>
    </Card>
  );

  const BODY = { conta: Conta, app: AppId, integ: Integ, prefs: Prefs }[sec];

  return (
    <DShell active="cfg" sub="Conta" title="Configurações">
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexDirection: cmob ? 'column' : 'row' }}>
        {/* nav de seções */}
        <div style={{ width: cmob ? '100%' : 230, flex: '0 0 auto', display: 'flex', flexDirection: cmob ? 'row' : 'column', gap: 4, overflowX: cmob ? 'auto' : 'visible' }}>
          {SECTIONS.map(([k, label, d]) => {
            const on = k === sec;
            return <div key={k} onClick={() => setSec(k)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderRadius: 11, cursor: 'pointer', background: on ? '#fff' : 'transparent', boxShadow: on ? `inset 0 0 0 1.5px ${T.accent}` : 'none', color: on ? T.ink : T.dim, fontFamily: DISP, fontWeight: on ? 600 : 500, fontSize: 14.5, whiteSpace: 'nowrap', flex: '0 0 auto' }}><Ico d={d} size={18} c={on ? T.accent : T.dim} />{label}</div>;
          })}
        </div>
        {/* conteúdo */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 720 }}>{BODY}</div>
      </div>
    </DShell>
  );
}

export { DConfig };
