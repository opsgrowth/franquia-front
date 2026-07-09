import React from 'react';
import { CoApp } from './co-screens';
import { DISP, Lockup, MONO, T, useIsMobile } from './kit';
import { loadStudentCourse, readStudentToken } from '../lib/student';

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
  const [state, setState] = React.useState<'loading' | 'ready' | 'error'>('loading');
  const [course, setCourse] = React.useState<any>(null);
  const [msg, setMsg] = React.useState('');

  React.useEffect(() => {
    const token = readStudentToken();
    if (!token) {
      setState('error');
      setMsg('Link inválido ou ausente. Abra o link que você recebeu por email.');
      return;
    }
    let alive = true;
    loadStudentCourse(token)
      .then(({ course }) => { if (alive) { setCourse(course); setState('ready'); } })
      .catch((e) => {
        if (!alive) return;
        const is401 = String(e?.message || '').includes('401');
        setState('error');
        setMsg(is401 ? 'Seu link expirou. Peça um novo acesso ao suporte.' : 'Não conseguimos carregar seu produto. Tente abrir o link de novo.');
      });
    return () => { alive = false; };
  }, []);

  if (state === 'loading') {
    return (
      <Center>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Lockup scale={0.55} /></div>
        <span style={{ width: 22, height: 22, border: '3px solid rgba(124,58,237,.25)', borderTopColor: '#7C3AED', borderRadius: '50%', display: 'inline-block', animation: 'fia-spin .7s linear infinite' }} />
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', color: T.dim, textTransform: 'uppercase', marginTop: 16 }}>Liberando seu acesso…</div>
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
  // 100dvh (não 100vh): no mobile evita a barra do navegador empurrar o layout e
  // fazer topo/rodapé rolarem. As barras ficam fixas; só o miolo rola.
  return <div style={{ height: '100dvh', overflow: 'hidden' }}><CoApp courses={[course]} narrow={mob} /></div>;
}
