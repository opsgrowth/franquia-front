import React from 'react';
import { DEFAULT_OFFER, LOCK_ICON, PaywallModal } from './author-app';
import { AIC } from './author-kit';
import { DISP, IC, Ico, MONO, Mark, T } from './kit';

// Produtos & Cursos — navegação Netflix de 3 níveis (vitrine → curso → player).
// Lógica reaproveitada do padrão; visual na identidade FranquIA (violeta/Sora).
// Reusa T/DISP/MONO/Ico/AIC/IC/Mark, DeskSidebar, PaywallModal, DEFAULT_OFFER, SUP_ICON.

const { useState: useStateCO } = React;

// ── cor do tema do produto ────────────────────────────────────────
function coLighten(hex, a){const n=parseInt(hex.slice(1),16);let r=(n>>16)&255,g=(n>>8)&255,b=n&255;r=Math.min(255,Math.round(r+(255-r)*a));g=Math.min(255,Math.round(g+(255-g)*a));b=Math.min(255,Math.round(b+(255-b)*a));return`rgb(${r},${g},${b})`;}
function coDarken(hex, a){const n=parseInt(hex.slice(1),16);let r=(n>>16)&255,g=(n>>8)&255,b=n&255;r=Math.round(r*(1-a));g=Math.round(g*(1-a));b=Math.round(b*(1-a));return`rgb(${r},${g},${b})`;}
function coRgba(hex, a){const n=parseInt(hex.slice(1),16);return`rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
const coTheme = (c) => `linear-gradient(135deg, ${coDarken(c, .45)} 0%, ${c} 100%)`;

// ── helpers de progresso ──────────────────────────────────────────
function allLessons(c){return c.modules.flatMap(m=>m.lessons);}
function courseProgress(c,p){const ls=allLessons(c);const d=ls.filter(l=>p[l.id]).length;return ls.length?Math.round(d/ls.length*100):0;}
function moduleProgress(m,p){const d=m.lessons.filter(l=>p[l.id]).length;return m.lessons.length?Math.round(d/m.lessons.length*100):0;}
function moduleDuration(m){return m.lessons.reduce((a,l)=>a+(parseInt(l.duration)||0),0);}
function nextLessonInModule(m,p){return m.lessons.find(l=>!p[l.id])||m.lessons[0];}
// acesso a nível de aula: produto bloqueado tranca tudo, EXCETO aulas-amostra (sample)
function courseLocked(c,unlocked){return !!(c.locked && !(unlocked && unlocked[c.id]));}
function lessonLocked(c,l,unlocked){return courseLocked(c,unlocked) && !(l && l.sample);}
function firstOpenLessonInModule(c,m,unlocked){return m.lessons.find(l=>!lessonLocked(c,l,unlocked))||null;}

// ── dados (cores violeta-família, distintas mas coesas com a marca) ─
const L = (id,t,d) => ({ id, title: t, duration: d, type: 'video' });
const CO_COURSES = [
  { id:'fia', title:'FranquIA — Catálogo que Vende', subtitle:'Comece com produtos validados e a IA multiplicando o que funciona', kind:'Curso flagship', color:'#7C3AED', color2:'#4B2E83', locked:false, students:90240, modules:[
    { id:'fia-m1', title:'Fundamentos da Franquia', lessons:[L('fia-1','Bem-vinda à FranquIA','8 min'),L('fia-2','Como o catálogo já vende','11 min'),L('fia-3','Seu primeiro produto no ar','9 min')] },
    { id:'fia-m2', title:'IA que multiplica', lessons:[L('fia-4','Gerando novas versões','13 min'),L('fia-5','Personalizando por público','10 min')] },
    { id:'fia-m3', title:'Vendas no piloto', lessons:[L('fia-6','Publicando a página','7 min'),L('fia-7','Recebendo 100% da venda','6 min')] },
  ]},
  { id:'traf', title:'Tráfego que Converte', subtitle:'Leve as pessoas certas até a oferta sem queimar orçamento', kind:'Lançamento', color:'#5246E5', color2:'#2A2480', locked:false, students:21800, modules:[
    { id:'traf-m1', title:'Estrutura da campanha', lessons:[L('traf-1','Antes de gastar','9 min'),L('traf-2','Público e objetivo','12 min')] },
    { id:'traf-m2', title:'Criativos que param o feed', lessons:[L('traf-3','O primeiro segundo','8 min'),L('traf-4','Legenda e gancho','10 min')] },
  ]},
  { id:'mtr', title:'Mentoria Alto Ticket', subtitle:'Venda de R$5k a R$50k com método', kind:'Premium', color:'#A23CD6', color2:'#5C1E7E', locked:true, students:1240, modules:[
    { id:'mtr-m1', title:'Sistema de alto valor', lessons:[L('mtr-1','A sessão estratégica','18 min'),L('mtr-2','Quebra de objeções','15 min')] },
  ]},
];

// ── capa temática ─────────────────────────────────────────────────
function CoCover({ color, img, label, title, h = 150, radius = 14, num, locked, progress, children, style }) {
  return (
    <div style={{ height: h, borderRadius: radius, background: img ? `center/cover no-repeat url("${img}")` : coTheme(color), position: 'relative', overflow: 'hidden', flex: '0 0 auto', ...style }}>
      {!img && <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 14px, rgba(255,255,255,0) 14px 28px)' }}></div>}
      {!img && <div style={{ position: 'absolute', right: -16, bottom: -20, opacity: 0.22 }}><Mark size={Math.round(h * 0.6)} front="#fff" ghost="#fff" inner="transparent" /></div>}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.5))' }}></div>
      {label && <span style={{ position: 'absolute', top: 11, left: 11, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#fff', background: 'rgba(0,0,0,.35)', padding: '5px 9px', borderRadius: 7 }}>{label.toUpperCase()}</span>}
      {num && <span style={{ position: 'absolute', top: 11, left: 11, fontFamily: MONO, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.85)' }}>{num}</span>}
      {locked && <span style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={LOCK_ICON} size={14} c={color} /></span>}
      {title && <div style={{ position: 'absolute', left: 13, bottom: progress != null ? 18 : 12, right: 13, fontFamily: DISP, fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.12 }}>{title}</div>}
      {progress != null && progress > 0 && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: 'rgba(255,255,255,.25)' }}><div style={{ width: progress + '%', height: '100%', background: coLighten(color, .35) }}></div></div>}
      {children}
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: 'flex', gap: 16, overflowX: 'auto', overflowY: 'hidden', paddingBottom: 8, scrollbarWidth: 'none' }}>{children}</div>;
}

export { coLighten, coDarken, coRgba, coTheme, allLessons, courseProgress, moduleProgress, moduleDuration, nextLessonInModule, courseLocked, lessonLocked, firstOpenLessonInModule, CO_COURSES, CoCover, Row };
