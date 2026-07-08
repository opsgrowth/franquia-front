import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './franquia/cover-assets';
import { FRANQUIA_INIT } from './franquia/co-admin';
import { loadFranchiseCatalog } from './lib/catalog';
import { bootstrapAuth, isAuthed, onAuthChange, logout } from './lib/auth';
import { DDashboard, DCatalogo } from './franquia/desktop-screens-1';
import { DGerador, DEditor } from './franquia/desktop-screens-2';
import { DVendas } from './franquia/desktop-vendas';
import { DConfig } from './franquia/desktop-config';
import { LoginScreen } from './franquia/desktop-login';
import { IngestScreen } from './franquia/author-ingest';
import { ReviewDeskScreen } from './franquia/author-review';
import { ProductsAdminScreen } from './franquia/co-admin-screen';

// Blindagem: qualquer erro de render vira uma mensagem legível (nunca tela preta).
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { err: Error | null }> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#18121F', color: '#F6F1FB', fontFamily: 'Sora, system-ui, sans-serif', padding: 24 }}>
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Algo travou nesta tela</div>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 20, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-word' }}>{String(this.state.err?.message || this.state.err)}</div>
          <button onClick={() => { this.setState({ err: null }); if (window.__go) window.__go('dashboard'); }} style={{ background: '#7C3AED', color: '#fff', border: 0, borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Voltar ao início</button>
        </div>
      </div>
    );
  }
}

// nav-key / cta-key → screen id  (port fiel do switcher do protótipo)
const SCREEN_FOR: Record<string, string> = {
  home: 'dashboard', cat: 'catalog', gen: 'ingest', sales: 'sales', cfg: 'config',
  fadmin: 'fadmin', 'fadmin-gen': 'fadmin-gen', 'fadmin-review': 'fadmin-review',
  dashboard: 'dashboard', catalog: 'catalog', generator: 'generator', editor: 'editor',
  ingest: 'ingest', review: 'review', manual: 'manual', logout: 'login', login: 'login',
};

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [authed, setAuthed] = useState(isAuthed());
  const [booting, setBooting] = useState(true);
  const [franquiaProducts, setFranquiaProducts] = useState(() => {
    let base: any[] = typeof FRANQUIA_INIT !== 'undefined' ? FRANQUIA_INIT : [];
    try {
      const saved = localStorage.getItem('fia_products');
      if (saved) base = JSON.parse(saved);
    } catch (e) {}
    try {
      const init: any[] = typeof FRANQUIA_INIT !== 'undefined' ? FRANQUIA_INIT : [];
      const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
      base = base.map((p: any) => {
        const fixed = init.find((i: any) => (i.id === p.id || norm(i.title) === norm(p.title)) && typeof i.coverImg === 'string');
        if (fixed) return { ...p, coverImg: fixed.coverImg };
        if (typeof window.FIXED_COVERS !== 'undefined' && window.FIXED_COVERS[norm(p.title)]) {
          return { ...p, coverImg: window.FIXED_COVERS[norm(p.title)] };
        }
        return p;
      });
      init.forEach((i: any) => {
        if (!base.some((p: any) => p.id === i.id || norm(p.title) === norm(i.title))) base.push(i);
      });
    } catch (e) {}
    return base;
  });

  useEffect(() => {
    window.__franquiaProducts = franquiaProducts;
    window.__setFranquiaProducts = setFranquiaProducts;
    try { localStorage.setItem('fia_products', JSON.stringify(franquiaProducts)); } catch (e) {}
  }, [franquiaProducts]);

  useEffect(() => {
    window.__go = (key: string) => {
      if (key === 'logout') { logout(); setScreen('dashboard'); return; }
      const t = SCREEN_FOR[key];
      if (t) setScreen(t);
    };
    return () => { delete window.__go; };
  }, []);

  // Boot de auth: resolve sessão (Supabase ou dev bearer) e reage a login/logout.
  useEffect(() => {
    const off = onAuthChange(() => setAuthed(isAuthed()));
    bootstrapAuth().finally(() => { setAuthed(isAuthed()); setBooting(false); });
    return off;
  }, []);

  // Catálogo REAL: assim que autenticado, busca do backend e substitui o mock.
  // Falha → mantém FRANQUIA_INIT (degrada sem quebrar a tela).
  useEffect(() => {
    if (!authed) return;
    let alive = true;
    loadFranchiseCatalog()
      .then((real) => { if (alive && real && real.length) setFranquiaProducts(real); })
      .catch((e) => { console.warn('catálogo real indisponível, usando mock:', e); });
    return () => { alive = false; };
  }, [authed]);

  const SCREENS: Record<string, any> = {
    dashboard: DDashboard,
    catalog: DCatalogo,
    generator: DGerador,
    editor: DEditor,
    ingest: IngestScreen,
    review: ReviewDeskScreen,
    manual: ProductsAdminScreen,
    login: LoginScreen,
    sales: DVendas,
    config: DConfig,
    fadmin: () => React.createElement(ProductsAdminScreen, { scope: 'franquia', sharedProducts: window.__franquiaProducts, setSharedProducts: window.__setFranquiaProducts }),
    'fadmin-gen': () => React.createElement(IngestScreen, { scope: 'franquia' }),
    'fadmin-review': () => React.createElement(ReviewDeskScreen, { scope: 'franquia' }),
  };
  // Splash enquanto resolve a sessão (evita piscar o login).
  if (booting) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#18121F' }}>
        <span style={{ width: 22, height: 22, border: '3px solid rgba(255,255,255,.25)', borderTopColor: '#7C3AED', borderRadius: '50%', display: 'inline-block', animation: 'fia-spin .7s linear infinite' }} />
        <style>{`@keyframes fia-spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Não autenticado → tela de login (mesmo que o screen aponte pra outra coisa).
  if (!authed) {
    return (
      <ErrorBoundary key="login">
        <LoginScreen />
      </ErrorBoundary>
    );
  }

  const Current = SCREENS[screen] || SCREENS.dashboard;
  return (
    <ErrorBoundary key={screen}>
      <Current />
    </ErrorBoundary>
  );
}
