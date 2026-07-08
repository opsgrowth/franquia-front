import React from 'react';
import { DISP, Lockup, MONO, Mark, T, useIsMobile } from './kit';

// Tela: Login premium (email + senha). Reusa T/DISP/MONO/Mark/Lockup.
function LoginScreen() {
  const lmob = useIsMobile();
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const fld = { width: '100%', background: T.paper, border: `1.5px solid ${T.line}`, borderRadius: 12, padding: '14px 15px', fontFamily: DISP, fontSize: 16, color: T.ink, outline: 'none' };
  const submit = (e) => {
    e && e.preventDefault();
    setErr('');
    if (!email.trim() || !senha.trim()) { setErr('Preencha email e senha.'); return; }
    setBusy(true);
    setTimeout(() => { window.__go && window.__go('home'); }, 900);
  };
  return (
    <div style={{ display: 'flex', height: '100%', background: T.paper, fontFamily: DISP, color: T.ink }}>
      {/* lado escuro (marca) */}
      {!lmob && (
        <div style={{ width: '46%', flex: '0 0 auto', background: T.darkBg, position: 'relative', overflow: 'hidden', padding: '48px 46px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', right: -60, top: 40, opacity: 0.16 }}><Mark size={300} front={T.accent} ghost={T.pill} inner={T.darkBg} /></div>
          <div style={{ position: 'relative' }}><Lockup scale={0.5} color={T.darkText} ia={T.pill} front={T.accent} ghost={T.pill} inner={T.darkBg} /></div>
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: T.pill, textTransform: 'uppercase' }}>Sua operação digital</div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, letterSpacing: '-0.03em', color: T.darkText, lineHeight: 1.1, marginTop: 14 }}>Produtos que já vendem,<br />multiplicados por IA.</div>
            <div style={{ fontFamily: DISP, fontSize: 14.5, lineHeight: 1.6, color: 'rgba(246,241,251,.6)', marginTop: 16, maxWidth: 360 }}>Entre no seu estúdio, gerencie o catálogo e acompanhe suas vendas — tudo num só lugar.</div>
          </div>
          <div style={{ position: 'relative', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em', color: 'rgba(246,241,251,.4)' }}>© 2026 · FranquIA</div>
        </div>
      )}
      {/* lado do formulário */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: lmob ? '32px 20px' : '48px' }}>
        <form onSubmit={submit} style={{ width: '100%', maxWidth: 400 }}>
          {lmob && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}><Lockup scale={0.5} /></div>}
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: T.accentDeep, textTransform: 'uppercase' }}>Bem-vinda de volta</div>
          <h1 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em', margin: '8px 0 4px' }}>Entrar na FranquIA</h1>
          <p style={{ fontFamily: DISP, fontSize: 14.5, color: T.dim, marginBottom: 28 }}>Acesse seu estúdio e seu catálogo.</p>

          <label style={{ display: 'block', fontFamily: DISP, fontWeight: 600, fontSize: 13.5, marginBottom: 8 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="voce@email.com" inputMode="email" style={{ ...fld, marginBottom: 18 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5 }}>Senha</label>
            <span style={{ fontFamily: DISP, fontSize: 12.5, color: T.accent, cursor: 'pointer' }}>Esqueci a senha</span>
          </div>
          <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" placeholder="••••••••" style={{ ...fld }} />

          {err && <div style={{ fontFamily: DISP, fontSize: 12.5, color: '#B23A2E', marginTop: 12 }}>{err}</div>}

          <button type="submit" disabled={busy} style={{ width: '100%', marginTop: 24, background: T.accent, color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontFamily: DISP, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 12px 30px rgba(124,58,237,.34)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: busy ? 0.7 : 1 }}>
            {busy && <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'fia-spin .7s linear infinite' }}></span>}
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
          <div style={{ fontFamily: DISP, fontSize: 13.5, color: T.dim, textAlign: 'center', marginTop: 22 }}>Ainda não tem conta? <span style={{ color: T.accent, fontWeight: 600, cursor: 'pointer' }}>Falar com a Franquia</span></div>
          <style>{`@keyframes fia-spin{to{transform:rotate(360deg)}}`}</style>
        </form>
      </div>
    </div>
  );
}

export { LoginScreen };
