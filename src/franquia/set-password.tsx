import React from 'react';
import { DISP, Lockup, T } from './kit';
import { setFranchiseePassword } from '../lib/admin';
import { getSupabase } from '../lib/supabase';

// Tela do CONVITE do franqueado: /definir-senha?token=... → define a senha → auto-login
// → vai pro Início do painel.
export function SetPasswordScreen() {
  const token = (() => { try { return new URL(window.location.href).searchParams.get('token') || ''; } catch { return ''; } })();
  const [pw, setPw] = React.useState('');
  const [pw2, setPw2] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const submit = async () => {
    if (busy) return;
    if (pw.length < 6) { setMsg('A senha precisa de ao menos 6 caracteres.'); return; }
    if (pw !== pw2) { setMsg('As senhas não conferem.'); return; }
    setBusy(true); setMsg('');
    try {
      const { email } = await setFranchiseePassword(token, pw);
      try { await getSupabase().auth.signInWithPassword({ email, password: pw }); } catch (e) {}
      window.location.href = '/'; // App boota autenticado → Início
    } catch (e: any) { setMsg(e?.message || 'Não foi possível definir a senha.'); setBusy(false); }
  };
  const center: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.paper, padding: 24 };
  const inp: React.CSSProperties = { width: '100%', boxSizing: 'border-box', border: `1px solid ${T.line}`, borderRadius: 12, padding: '14px 16px', fontFamily: DISP, fontSize: 16, color: T.ink, outline: 'none', marginTop: 10 };
  if (!token) {
    return <div style={center}><div style={{ maxWidth: 360, textAlign: 'center', fontFamily: DISP, color: T.dim }}>Convite inválido ou expirado. Peça um novo link ao admin.</div></div>;
  }
  return (
    <div style={center}>
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Lockup scale={0.6} /></div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, color: T.ink }}>Defina sua senha</div>
        <div style={{ fontFamily: DISP, fontSize: 14.5, color: T.dim, marginTop: 8 }}>Bem-vindo(a) à FranquIA! Crie sua senha de acesso ao painel.</div>
        <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="Nova senha" style={inp} />
        <input value={pw2} onChange={(e) => setPw2(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} type="password" placeholder="Repita a senha" style={inp} />
        <div onClick={submit} style={{ marginTop: 14, background: busy ? 'rgba(124,58,237,.6)' : T.accent, color: '#fff', borderRadius: 12, padding: '14px', fontFamily: DISP, fontWeight: 700, fontSize: 15.5, cursor: busy ? 'default' : 'pointer' }}>{busy ? 'Salvando…' : 'Entrar na FranquIA'}</div>
        {msg && <div style={{ fontFamily: DISP, fontSize: 13, color: '#B23A16', marginTop: 12, lineHeight: 1.5 }}>{msg}</div>}
      </div>
    </div>
  );
}
