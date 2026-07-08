import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './franquia/cover-assets';
import { FRANQUIA_INIT } from './franquia/co-admin';
import { DDashboard, DCatalogo } from './franquia/desktop-screens-1';
import { DGerador, DEditor } from './franquia/desktop-screens-2';
import { DVendas } from './franquia/desktop-vendas';
import { DConfig } from './franquia/desktop-config';
import { LoginScreen } from './franquia/desktop-login';
import { IngestScreen } from './franquia/author-ingest';
import { ReviewDeskScreen } from './franquia/author-review';
import { ProductsAdminScreen } from './franquia/co-admin-screen';

// nav-key / cta-key → screen id  (port fiel do switcher do protótipo)
const SCREEN_FOR: Record<string, string> = {
  home: 'dashboard', cat: 'catalog', gen: 'ingest', sales: 'sales', cfg: 'config',
  fadmin: 'fadmin', 'fadmin-gen': 'fadmin-gen', 'fadmin-review': 'fadmin-review',
  dashboard: 'dashboard', catalog: 'catalog', generator: 'generator', editor: 'editor',
  ingest: 'ingest', review: 'review', manual: 'manual', logout: 'login', login: 'login',
};

export default function App() {
  const [screen, setScreen] = useState('dashboard');
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
      const t = SCREEN_FOR[key];
      if (t) setScreen(t);
    };
    return () => { delete window.__go; };
  }, []);

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
  const Current = SCREENS[screen];
  return <Current />;
}
