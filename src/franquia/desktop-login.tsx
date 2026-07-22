import React from 'react';
import { DISP, Lockup, MONO, Mark, T, useIsMobile } from './kit';
import { forgotPassword, loginWithPassword } from '../lib/auth';

// Tela: Login premium (email + senha). Reusa T/DISP/MONO/Mark/Lockup.
function LoginScreen() {
  const lmob = useIsMobile();
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  // "Esqueci a senha": modal de recuperação. fpDone → mensagem FIXA (nunca revela se o email existe).
  const [showForgot, setShowForgot] = React.useState(false);
  const [fpEmail, setFpEmail] = React.useState('');
  const [fpBusy, setFpBusy] = React.useState(false);
  const [fpDone, setFpDone] = React.useState(false);
  const fld = { width: '100%', background: T.paper, border: `1.5px solid ${T.line}`, borderRadius: 12, padding: '14px 15px', fontFamily: DISP, fontSize: 16, color: T.ink, outline: 'none' };
  const submit = async (e) => {
    e && e.preventDefault();
    setErr('');
    if (!email.trim() || !senha.trim()) { setErr('Preencha email e senha.'); return; }
    setBusy(true);
    try {
      await loginWithPassword(email.trim(), senha);
      // sucesso → o App transiciona pro painel via onAuthChange (esta tela desmonta)
    } catch (e2) {
      setErr('Email ou senha inválidos.');
      setBusy(false);
    }
  };
  // Recuperação: dispara e SEMPRE mostra a mesma mensagem (fpDone), independente do resultado —
  // sucesso, erro HTTP ou rede caída. Nunca revela se o email existe (anti-enumeração).
  const submitForgot = async (e) => {
    e && e.preventDefault();
    if (fpBusy || fpDone || !fpEmail.trim()) return;
    setFpBusy(true);
    try { await forgotPassword(fpEmail.trim()); } catch (e2) { /* silencioso de propósito */ }
    setFpBusy(false);
    setFpDone(true);
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
            <span onClick={() => { setFpEmail(email.trim()); setFpDone(false); setShowForgot(true); }} style={{ fontFamily: DISP, fontSize: 12.5, color: T.accent, cursor: 'pointer' }}>Esqueci a senha</span>
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

      {/* Modal "Esqueci a senha" — dispara forgotPassword e mostra SEMPRE a mesma mensagem. */}
      {showForgot && (
        <div onClick={() => setShowForgot(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,16,25,.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 400, background: T.paper, borderRadius: 20, padding: '32px 28px', boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
            {fpDone ? (
              <>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, color: T.ink }}>Verifique seu email</div>
                <p style={{ fontFamily: DISP, fontSize: 14.5, color: T.dim, lineHeight: 1.6, marginTop: 10 }}>Se este email tiver uma conta, enviamos as instruções para redefinir a senha.</p>
                <button onClick={() => setShowForgot(false)} style={{ width: '100%', marginTop: 22, background: T.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontFamily: DISP, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Voltar ao login</button>
              </>
            ) : (
              <form onSubmit={submitForgot}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, color: T.ink }}>Recuperar senha</div>
                <p style={{ fontFamily: DISP, fontSize: 14, color: T.dim, lineHeight: 1.6, margin: '8px 0 20px' }}>Informe o email da sua conta e enviaremos um link para redefinir a senha.</p>
                <input value={fpEmail} onChange={(e) => setFpEmail(e.target.value)} type="email" placeholder="voce@email.com" inputMode="email" autoFocus style={{ ...fld }} />
                <button type="submit" disabled={fpBusy || !fpEmail.trim()} style={{ width: '100%', marginTop: 18, background: T.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontFamily: DISP, fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: (fpBusy || !fpEmail.trim()) ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
                  {fpBusy && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'fia-spin .7s linear infinite' }}></span>}
                  {fpBusy ? 'Enviando…' : 'Enviar link'}
                </button>
                <div onClick={() => setShowForgot(false)} style={{ fontFamily: DISP, fontSize: 13, color: T.dim, textAlign: 'center', marginTop: 16, cursor: 'pointer' }}>Cancelar</div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { LoginScreen };
