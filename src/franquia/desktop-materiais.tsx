import React from 'react';
import { AIC } from './author-kit';
import { PhonePreview } from './author-preview';
import { DISP, IC, Ico, MONO, Mark, T, useIsMobile } from './kit';

// Kit de Vendas (contextual, por produto da Franquia) — aba Materiais + Prévia.
// Reusa T/DISP/MONO/Ico/IC/AIC/Mark + PhonePreview.
function MaterialsSheet({ item, course, onClose }) {
  const smob = useIsMobile();
  const [tab, setTab] = React.useState('mat');
  const [preview, setPreview] = React.useState(false);
  const [copied, setCopied] = React.useState('');
  const accent = (item && item.c) || T.accent;
  const copy = (key, text) => { try { navigator.clipboard && navigator.clipboard.writeText(text); } catch (e) {} setCopied(key); setTimeout(() => setCopied(''), 1600); };
  const coT = (c) => `linear-gradient(135deg, ${c}99 0%, ${c} 100%)`;
  const cover = item && item.coverImg;

  const AssetCard = ({ icon, title, desc, children }) => (
    <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 14, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(124,58,237,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={icon} size={20} c={T.accentDeep} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15.5, color: T.ink }}>{title}</div>
        <div style={{ fontFamily: DISP, fontSize: 13, color: T.dim, marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 13, flexWrap: 'wrap' }}>{children}</div>
      </div>
    </div>
  );
  const Btn = ({ icon, children, solid, onClick }) => (
    <div onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: DISP, fontWeight: 600, fontSize: 13, padding: '9px 15px', borderRadius: 10, background: solid ? T.accent : '#fff', color: solid ? '#fff' : T.ink, border: `1px solid ${solid ? T.accent : T.line}` }}>
      {icon && <Ico d={icon} size={15} c={solid ? '#fff' : T.ink} />}{children}
    </div>
  );
  const DL = 'M12 15V4 M8 11l4 4 4-4 M5 19h14';
  const CP = 'M9 9h10v10H9z M5 15V5h10';

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(20,16,25,.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: smob ? 0 : 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 760, maxHeight: smob ? '100%' : '92%', height: smob ? '100%' : 'auto', overflow: 'auto', background: T.paper, borderRadius: smob ? 0 : 22, boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
        {/* header */}
        <div style={{ background: T.darkBg, padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <div style={{ width: 66, height: 44, borderRadius: 9, background: cover ? `center/cover no-repeat url("${cover}")` : coT(accent), flex: '0 0 auto' }}></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', color: T.pill, textTransform: 'uppercase' }}>Produto da Franquia</div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item && item.n}</div>
          </div>
          <div onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.14)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: '0 0 auto' }}>✕</div>
        </div>
        {/* tabs */}
        <div style={{ display: 'flex', gap: 6, padding: '14px 26px 0' }}>
          {[['mat', 'Materiais de venda'], ['comp', 'Materiais complementares'], ['prev', 'Prévia do app']].map(([k, l]) => {
            const on = tab === k;
            return <div key={k} onClick={() => setTab(k)} style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, padding: '10px 16px', borderRadius: '10px 10px 0 0', cursor: 'pointer', color: on ? T.accent : T.dim, borderBottom: `2px solid ${on ? T.accent : 'transparent'}` }}>{l}</div>;
          })}
        </div>
        <div style={{ height: 1, background: T.line }}></div>

        {tab === 'mat' ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, lineHeight: 1.55 }}>Baixe os materiais e publique na sua estrutura. Todos os franqueados recebem os mesmos arquivos — você conecta seu checkout via integração.</div>

            <AssetCard icon={'M4 5h16v14H4z M4 9h16 M8 5v4'} title="Página de vendas (HTML)" desc="A landing/VSL pronta pra publicar no seu domínio ou hospedagem.">
              <Btn icon={DL} solid onClick={() => copy('html', 'download')}>{copied === 'html' ? 'Baixando…' : 'Baixar HTML'}</Btn>
              <Btn icon={IC.search} onClick={() => setTab('prev')}>Ver prévia</Btn>
            </AssetCard>

            <AssetCard icon={AIC.image} title="Imagem do produto" desc="Mockup/arte oficial do produto, em alta resolução (PNG).">
              <Btn icon={DL} solid onClick={() => copy('img', 'download')}>{copied === 'img' ? 'Baixando…' : 'Baixar imagem'}</Btn>
            </AssetCard>

            <AssetCard icon={'M3 5h18v11H3z M3 16l5-4 3 2 4-4 6 5'} title="Banner de checkout" desc="Banner de topo para usar na página do seu checkout.">
              <Btn icon={DL} solid onClick={() => copy('ban', 'download')}>{copied === 'ban' ? 'Baixando…' : 'Baixar banner'}</Btn>
            </AssetCard>

            {/* integração via webhook */}
            <div style={{ background: 'rgba(124,58,237,.06)', border: `1px solid rgba(124,58,237,.2)`, borderRadius: 14, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={'M9 2v4 M15 2v4 M7 6h10v3a5 5 0 0 1-10 0z M12 14v6'} size={20} c={T.accentDeep} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15.5, color: T.ink }}>Checkout próprio + integração</div>
                <div style={{ fontFamily: DISP, fontSize: 13, color: T.dim, marginTop: 3, lineHeight: 1.55 }}>Venda pelo checkout da plataforma que você escolher (Kiwify, Hotmart…). Depois, conecte o produto via webhook para o cliente receber o acesso automaticamente.</div>
                <div onClick={() => { onClose && onClose(); if (typeof window !== 'undefined') { window.__integProduct = item && item.n; (window as any).__integAppId = item && ((item.raw && item.raw.id) || item.id); window.__cfgSection = 'integ'; } window.__go && window.__go('cfg'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 12, fontFamily: DISP, fontWeight: 600, fontSize: 13, color: T.accent, cursor: 'pointer' }}>Configurar integração <Ico d={AIC.chevron} size={14} c={T.accent} style={{ transform: 'rotate(-90deg)' }} /></div>
              </div>
            </div>
          </div>
        ) : tab === 'comp' ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, lineHeight: 1.55 }}>Materiais extras para divulgar e escalar suas vendas nas redes. Todos os franqueados recebem os mesmos arquivos.</div>

            <AssetCard icon={'M3 5h18v11H3z M3 16l5-4 3 2 4-4 6 5'} title="Criativos para anúncios" desc="Pacote de imagens e vídeos prontos para tráfego pago (Meta e Google).">
              <Btn icon={DL} solid onClick={() => copy('cre', 'download')}>{copied === 'cre' ? 'Baixando…' : 'Baixar criativos'}</Btn>
            </AssetCard>

            <AssetCard icon={'M4 5h16v14H4z M4 9l8 5 8-5'} title="Copy para e-mail e WhatsApp" desc="Sequência de mensagens prontas para aquecer e converter sua lista.">
              <Btn icon={DL} solid onClick={() => copy('cpy', 'download')}>{copied === 'cpy' ? 'Baixando…' : 'Baixar copies'}</Btn>
            </AssetCard>

            <AssetCard icon={AIC.image} title="Artes para redes sociais" desc="Posts e stories editáveis para feed e status, no padrão da marca.">
              <Btn icon={DL} solid onClick={() => copy('soc', 'download')}>{copied === 'soc' ? 'Baixando…' : 'Baixar artes'}</Btn>
            </AssetCard>

            <AssetCard icon={AIC.play} title="Roteiros de stories e reels" desc="Roteiros prontos para gravar e divulgar o produto no seu perfil.">
              <Btn icon={DL} solid onClick={() => copy('rot', 'download')}>{copied === 'rot' ? 'Baixando…' : 'Baixar roteiros'}</Btn>
            </AssetCard>
          </div>
        ) : (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, lineHeight: 1.55, marginBottom: 18 }}>Veja como o produto aparece para o aluno no app.</div>
            <div onClick={() => setPreview(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, cursor: 'pointer', background: T.accent, color: '#fff', borderRadius: 12, padding: '14px 24px', fontFamily: DISP, fontWeight: 700, fontSize: 15, boxShadow: '0 12px 30px rgba(124,58,237,.34)' }}><Ico d={AIC.play} size={17} c="#fff" fill="#fff" />Abrir prévia do app</div>
          </div>
        )}
      </div>
      {preview && course && <PhonePreview open={true} onClose={() => setPreview(false)} courses={[course]} />}
    </div>
  );
}

export { MaterialsSheet };
