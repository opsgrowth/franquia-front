// ── FranquIA · kit base (port fiel de manual-kit.jsx) ──────────────
// Sistema · paleta Violeta · wordmark Sora. Tokens + primitivas de marca.
import React from 'react';

export const T = {
  ink: '#18121F',        // Ametista — text / base
  surface: '#272031',    // Berinjela — dark surface
  accent: '#7C3AED',     // Violeta — primary
  accentDeep: '#6429C9', // hover / support
  halo: '#E8DBFF',       // Lavanda — tints / blocks
  paper: '#F8F5FB',      // background light
  darkBg: '#1A1422',     // dark canvas
  darkText: '#F6F1FB',   // text on dark
  pill: '#C4A3FF',       // light accent on dark
  line: 'rgba(24,18,31,.12)',
  dim: 'rgba(24,18,31,.55)',
  success: '#0E9A50',
  warning: '#E2A33D',
} as const;

export const DISP = '"Sora", sans-serif';
export const MONO = '"JetBrains Mono", ui-monospace, monospace';

type CSS = React.CSSProperties;

// the multiplying-square symbol
export function Mark({ size = 88, front = T.accent, ghost = T.accent, inner = T.paper }: { size?: number; front?: string; ghost?: string; inner?: string }) {
  const t = size * 0.62, r = size * 0.1;
  return (
    <div style={{ width: size, height: size, position: 'relative', flex: '0 0 auto' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, width: t, height: t, borderRadius: r, background: ghost, opacity: 0.25 }}></div>
      <div style={{ position: 'absolute', right: size * 0.1, top: size * 0.1, width: t, height: t, borderRadius: r, background: ghost, opacity: 0.5 }}></div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: t, height: t, borderRadius: r, background: front, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: size * 0.2, height: size * 0.2, borderRadius: 2, background: inner }}></div>
      </div>
    </div>
  );
}

// FranquIA wordmark — Sora, IA in accent with weight bump and tight join.
export function Wordmark({ scale = 1, color = T.ink, ia = T.accent }: { scale?: number; color?: string; ia?: string }) {
  return (
    <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 56 * scale, letterSpacing: '-0.04em', color, display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
      <span>Franqu</span><span style={{ color: ia, fontWeight: 700, marginLeft: '-0.085em' }}>IA</span>
    </div>
  );
}

// full lockup: mark + wordmark
export function Lockup({ scale = 1, color = T.ink, ia = T.accent, front = T.accent, ghost = T.accent, inner = T.paper, gap = 20 }: { scale?: number; color?: string; ia?: string; front?: string; ghost?: string; inner?: string; gap?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: gap * scale }}>
      <Mark size={64 * scale} front={front} ghost={ghost} inner={inner} />
      <Wordmark scale={scale} color={color} ia={ia} />
    </div>
  );
}

export function Kicker({ children, color = T.accentDeep }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color, fontWeight: 600 }}>{children}</div>
  );
}

// ── ícones (port fiel: Ico + IC de mobile-screens-1.jsx) ──────────
export function Ico({ d, size = 22, c = 'currentColor', fill = 'none', sw = 1.9, style }: { d: string | string[]; size?: number; c?: string; fill?: string; sw?: number; style?: CSS }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
export const IC = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  grid: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  chart: ['M4 20V4', 'M4 20h16', 'M8 16v-4M12 16V8M16 16v-7'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'M21 21l-4.3-4.3'],
  spark: ['M12 3l1.8 4.9L19 9.6l-4.4 2.3L12 17l-2.6-5.1L5 9.6l5.2-1.7z'],
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6z',
  link: ['M9 15l6-6', 'M10 6l1-1a4 4 0 0 1 6 6l-1 1', 'M14 18l-1 1a4 4 0 0 1-6-6l1-1'],
  share: ['M12 3v12', 'M8 7l4-4 4 4', 'M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6'],
  check: 'M5 12.5l4.5 4.5L19 7',
  arrow: 'M5 12h14M13 5l7 7-7 7',
  copy: ['M9 9h10v10H9z', 'M5 15V5h10'],
  cfg: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M19.14 12.94a7.49 7.49 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.3 7.3 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.58.24-1.12.55-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.49 7.49 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.39 1.04.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.58-.24 1.12-.55 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64Z'],
} as const;

export function useIsMobile(bp?: number) {
  const b = bp || 820;
  const [m, setM] = React.useState(typeof window !== 'undefined' && window.innerWidth < b);
  React.useEffect(() => {
    const f = () => setM(window.innerWidth < b);
    window.addEventListener('resize', f); f();
    return () => window.removeEventListener('resize', f);
  }, [b]);
  return m;
}
