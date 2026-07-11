import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './franquia/cover-assets';
import { FRANQUIA_INIT } from './franquia/co-admin';
import { loadFranchiseCatalog } from './lib/catalog';
import { loadMyAppsMapped } from './lib/apps';
import { bootstrapAuth, isAuthed, onAuthChange, logout, getMe } from './lib/auth';
import { DDashboard, DCatalogo } from './franquia/desktop-screens-1';
import { DGerador, DEditor } from './franquia/desktop-screens-2';
import { DVendas } from './franquia/desktop-vendas';
import { DConfig } from './franquia/desktop-config';
import { LoginScreen } from './franquia/desktop-login';
import { IngestScreen } from './franquia/author-ingest';
import { ReviewDeskScreen } from './franquia/author-review';
import { ProductsAdminScreen } from './franquia/co-admin-screen';
import { FranchiseesScreen, LeadsScreen, ProductLinksScreen } from './franquia/admin-screens';

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
  home: 'dashboard', cat: 'catalog', gen: 'ingest', sales: 'sales', cfg: 'config', config: 'config',
  fadmin: 'fadmin', 'fadmin-gen': 'fadmin-gen', 'fadmin-review': 'fadmin-review',
  franqueados: 'franqueados', applinks: 'applinks', interessados: 'interessados',
  dashboard: 'dashboard', catalog: 'catalog', generator: 'generator', editor: 'editor',
  ingest: 'ingest', review: 'review', manual: 'manual', logout: 'login', login: 'login',
};

// Tela a partir da URL (#catalog etc.) — reload mantém a aba atual. 'login' nunca é
// restaurada (o gate de auth cuida disso).
function screenFromHash(): string {
  try {
    const h = (window.location.hash || '').replace(/^#\/?/, '');
    const s = SCREEN_FOR[h];
    if (s && s !== 'login') return s;
  } catch (e) {}
  return 'dashboard';
}

export default function App() {
  const [screen, setScreen] = useState<string>(screenFromHash);
  const [authed, setAuthed] = useState(isAuthed());
  const [booting, setBooting] = useState(true);
  // Vazio no in\u00edcio \u2014 a fonte REAL (admin = /apps com rascunhos; franqueado = /catalog)
  // carrega logo ap\u00f3s o auth. Evita o "flash" de dados velhos/mock do localStorage.
  const [franquiaProducts, setFranquiaProducts] = useState<any[]>(() => {
    // Hidrata do cache local (produtos REAIS da ultima sessao) -> cards aparecem NA HORA
    // no refresh; o load() logo apos o auth refresca com a fonte real. Sem mock no cache,
    // entao nada de "flash" de dado falso -- so ~1s de eventual staleness ate o refetch.
    try { const c = JSON.parse(localStorage.getItem('fia_products') || '[]'); return Array.isArray(c) ? c : []; } catch (e) { return []; }
  });

  useEffect(() => {
    window.__franquiaProducts = franquiaProducts;
    window.__setFranquiaProducts = setFranquiaProducts;
    try { localStorage.setItem('fia_products', JSON.stringify(franquiaProducts)); } catch (e) {}
  }, [franquiaProducts]);

  useEffect(() => {
    window.__go = (key: string) => {
      if (key === 'logout') { try { localStorage.removeItem('fia_products'); } catch (e) {} logout(); setScreen('dashboard'); return; }
      const t = SCREEN_FOR[key];
      if (t) setScreen(t);
    };
    return () => { delete window.__go; };
  }, []);

  // Persiste a tela atual na URL (#catalog etc.) → reload mantém a aba.
  useEffect(() => {
    try {
      const target = '#' + screen;
      if (screen !== 'login' && window.location.hash !== target) {
        window.history.replaceState(null, '', target);
      }
    } catch (e) {}
  }, [screen]);
  // Reage a mudança de hash (voltar/avançar do navegador ou editar a URL).
  useEffect(() => {
    const onHash = () => setScreen(screenFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Boot de auth: resolve sessão (Supabase ou dev bearer) e reage a login/logout.
  useEffect(() => {
    const off = onAuthChange(() => setAuthed(isAuthed()));
    bootstrapAuth().finally(() => { setAuthed(isAuthed()); setBooting(false); });
    return off;
  }, []);

  // Catálogo: produtos ABERTOS = reais (backend); + 4 PREMIUM (mockup, travados =
  // popup "libera em 7 dias"). O design marca os ÚLTIMOS 4 como premium, então os
  // mock entram por último. Falha no backend → mantém o mock (não quebra a tela).
  useEffect(() => {
    if (!authed) return;
    let alive = true;
    // Fallback de capa de PRODUTO: se o backend ainda não tem capa (antes do criador
    // subir), reusa a capa fixa atual (FIXED_COVERS) p/ não regredir o visual. Capa
    // do backend (base64) SEMPRE ganha.
    const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    const isB64 = (v: any) => typeof v === 'string' && v.startsWith('data:');
    const init: any[] = typeof FRANQUIA_INIT !== 'undefined' ? FRANQUIA_INIT : [];
    let saved: any[] = [];
    try { saved = JSON.parse(localStorage.getItem('fia_products') || '[]'); } catch (e) {}
    const savedOf = (p: any) => saved.find((x: any) => x.id === p.id || norm(x.title) === norm(p.title));
    const withLocalCovers = (p: any) => {
      const s = savedOf(p);
      let coverImg = isB64(s && s.coverImg) ? s.coverImg : (isB64(p.coverImg) ? p.coverImg : null);
      if (!coverImg) {
        const fixed = init.find((i: any) => norm(i.title) === norm(p.title) && typeof i.coverImg === 'string');
        if (fixed) coverImg = fixed.coverImg;
        else if (window.FIXED_COVERS && window.FIXED_COVERS[norm(p.title)]) coverImg = window.FIXED_COVERS[norm(p.title)];
      }
      const savedBanners = s && (s.banners || []).filter(isB64);
      const banners = (savedBanners && savedBanners.length) ? savedBanners : p.banners;
      const modules = (p.modules || []).map((m: any) => {
        const sm = s && (s.modules || []).find((mm: any) => mm.id === m.id || norm(mm.title) === norm(m.title));
        return (sm && isB64(sm.cover)) ? { ...m, cover: sm.cover } : m;
      });
      return { ...p, coverImg, banners, modules };
    };
    // ADMIN vê TODOS os seus produtos (inclui rascunhos, via /apps) pra publicar/editar;
    // FRANQUEADO vê o catálogo publicado (cross-tenant, via /catalog).
    const load = async () => {
      try {
        const me = getMe();
        const isAdmin = !!(me && me.is_admin);
        const real = isAdmin ? await loadMyAppsMapped() : await loadFranchiseCatalog();
        if (!alive) return;
        const list = (real && real.length) ? real.map(withLocalCovers) : [];
        // PRESERVA módulos já carregados: o /apps só traz metadados (modules: []).
        // Sem isto, cada load() ZERA o conteúdo do produto aberto → "some ao atualizar".
        setFranquiaProducts((prev: any[]) => {
          const byId = new Map((prev || []).map((p: any) => [p.id, p]));
          return list.map((p: any) => {
            const old = byId.get(p.id);
            if (old && old.modules && old.modules.length && (!p.modules || !p.modules.length)) {
              return { ...p, modules: old.modules };
            }
            return p;
          });
        });
      } catch (e) { console.warn('catálogo indisponível:', e); }
    };
    (window as any).__refreshApps = load;
    load();
    return () => { alive = false; try { delete (window as any).__refreshApps; } catch (e) {} };
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
    franqueados: FranchiseesScreen,
    applinks: ProductLinksScreen,
    interessados: LeadsScreen,
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

  // Globais SINCRONAMENTE (não em effect) → o painel lê a lista JÁ atual neste render
  // (corrige "some no refresh, só volta ao navegar").
  (window as any).__franquiaProducts = franquiaProducts;
  (window as any).__setFranquiaProducts = setFranquiaProducts;
  const Current = SCREENS[screen] || SCREENS.dashboard;
  // fadmin* são FÁBRICAS de elemento (arrow → createElement). Renderizar via Current()
  // mantém o TIPO estável (ProductsAdminScreen) → NÃO remonta → preserva view/selId
  // (corrige "volta pra lista em qualquer ação"). <Current /> trataria a arrow nova de
  // cada render como um componente novo e remontaria.
  const isFactory = screen === 'fadmin' || screen === 'fadmin-gen' || screen === 'fadmin-review';
  return (
    <ErrorBoundary key={screen}>
      {isFactory ? Current() : <Current />}
    </ErrorBoundary>
  );
}
