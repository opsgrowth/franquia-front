import React from 'react';
import { CoApp } from './co-screens';
import { DISP, Lockup, MONO, T, useIsMobile } from './kit';
import { clearStudentToken, loadStudentCourse, readStudentToken, studentLogin } from '../lib/student';

// App do COMPRADOR — aberto pelo link mágico (/p/{slug}?token=...). Não passa pelo
// login do painel: a sessão é o próprio token do aluno. Renderiza o CoApp (mesma
// vitrine/curso/aula do preview) com o CONTEÚDO REAL do produto comprado.
function Center({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.paper, padding: 24, textAlign: 'center' }}>
      <div style={{ maxWidth: 380 }}>{children}</div>
      <style>{`@keyframes fia-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function StudentApp() {
  const mob = useIsMobile();
  const [state, setState] = React.useState<'loading' | 'ready' | 'error' | 'login' | 'sent'>('loading');
  const [course, setCourse] = React.useState<any>(null);
  const [student, setStudent] = React.useState<any>(null);
  const [msg, setMsg] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const slug = (typeof window !== 'undefined' ? (window.location.pathname.match(/\/p\/([^/?#]+)/) || [])[1] : '') || '';
  // Altura REAL da viewport (px) via JS — funciona em qualquer navegador mobile
  // (100dvh quebra em iOS antigo → tela em branco). Atualiza ao mostrar/esconder a
  // barra do navegador e ao girar a tela. As barras ficam fixas; só o miolo rola.
  const [vh, setVh] = React.useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  React.useEffect(() => {
    const on = () => setVh(window.innerHeight);
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => { window.removeEventListener('resize', on); window.removeEventListener('orientationchange', on); };
  }, []);

  React.useEffect(() => {
    const token = readStudentToken();
    if (!token) {
      setState('login'); // sem token → tela de login por email da compra
      return;
    }
    let alive = true;
    loadStudentCourse(token)
      .then(({ course, student }) => { if (alive) { setCourse(course); setStudent(student); setState('ready'); } })
      .catch((e) => {
        if (!alive) return;
        const is401 = String(e?.message || '').includes('401');
        setState('error');
        setMsg(is401 ? 'Seu link expirou. Peça um novo acesso ao suporte.' : 'Não conseguimos carregar seu produto. Tente abrir o link de novo.');
      });
    return () => { alive = false; };
  }, []);

  const submitAccess = async () => {
    if (!email.trim() || sending) return;
    setSending(true); setMsg('');
    try {
      const token = await studentLogin(slug, email.trim());
      if (!token) throw new Error('Não foi possível entrar.');
      setState('loading');
      const { course, student } = await loadStudentCourse(token);
      setCourse(course); setStudent(student); setState('ready');
    } catch (e: any) {
      setMsg(e?.message || 'Não foi possível entrar.'); setState('login');
    } finally { setSending(false); }
  };
  const logout = () => { clearStudentToken(); setCourse(null); setStudent(null); setEmail(''); setMsg(''); setState('login'); };

  if (state === 'loading') {
    return (
      <Center>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Lockup scale={0.55} /></div>
        <span style={{ width: 22, height: 22, border: '3px solid rgba(124,58,237,.25)', borderTopColor: '#7C3AED', borderRadius: '50%', display: 'inline-block', animation: 'fia-spin .7s linear infinite' }} />
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', color: T.dim, textTransform: 'uppercase', marginTop: 16 }}>Liberando seu acesso…</div>
      </Center>
    );
  }
  if (state === 'login') {
    return (
      <Center>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Lockup scale={0.6} /></div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, color: T.ink }}>Acesse seu produto</div>
        <div style={{ fontFamily: DISP, fontSize: 14.5, lineHeight: 1.6, color: T.dim, marginTop: 8 }}>Entre com o <b style={{ color: T.ink, fontWeight: 600 }}>email que você usou na compra</b>.</div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitAccess()} type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" placeholder="seu@email.com" style={{ width: '100%', marginTop: 18, boxSizing: 'border-box', border: `1px solid ${T.line}`, borderRadius: 12, padding: '14px 16px', fontFamily: DISP, fontSize: 16, color: T.ink, outline: 'none', textAlign: 'center' }} />
        <div onClick={submitAccess} style={{ marginTop: 12, background: sending ? 'rgba(124,58,237,.6)' : T.accent, color: '#fff', borderRadius: 12, padding: '14px', fontFamily: DISP, fontWeight: 700, fontSize: 15.5, cursor: sending ? 'default' : 'pointer' }}>{sending ? 'Entrando…' : 'Entrar'}</div>
        {msg && <div style={{ fontFamily: DISP, fontSize: 13, color: '#B23A16', marginTop: 10, lineHeight: 1.5 }}>{msg}</div>}
      </Center>
    );
  }
  if (state === 'error') {
    return (
      <Center>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Lockup scale={0.55} /></div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, color: T.ink }}>Ops!</div>
        <div style={{ fontFamily: DISP, fontSize: 14.5, lineHeight: 1.6, color: T.dim, marginTop: 8 }}>{msg}</div>
      </Center>
    );
  }
  return (
    <div style={{ height: vh, overflow: 'hidden' }}>
      <CoApp courses={[course]} narrow={mob} studentName={student?.name} creator={{ name: course?.title || 'FranquIA' }} onLogout={logout} />
    </div>
  );
}
