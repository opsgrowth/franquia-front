import React from 'react';
import { AIC } from './author-kit';
import { PhonePreview } from './author-preview';
import { DISP, IC, Ico, MONO, Mark, T, useIsMobile } from './kit';
import { getWebhookUrl } from '../lib/promotions';
import { isCredentialing } from '../lib/credentialing';
import { materialsFor, dlHref } from '../lib/materials';

// 3 cards complementares (Copy / Artes / Roteiros) escondidos p/ o lançamento.
// Reversível: troque para true e eles reaparecem.
const SHOW_EXTRA_COMP = false;

// Kit de Vendas (contextual, por produto da Franquia) — aba Materiais + Prévia.
// Reusa T/DISP/MONO/Ico/IC/AIC/Mark + PhonePreview.
function MaterialsSheet({ item, course, onClose }) {
  const smob = useIsMobile();
  const [tab, setTab] = React.useState('promo');
  const [preview, setPreview] = React.useState(false);
  const [copied, setCopied] = React.useState('');
  const accent = (item && item.c) || T.accent;
  const copy = (key, text) => { try { navigator.clipboard && navigator.clipboard.writeText(text); } catch (e) {} setCopied(key); setTimeout(() => setCopied(''), 1600); };
  const coT = (c) => `linear-gradient(135deg, ${c}99 0%, ${c} 100%)`;
  const cover = item && item.coverImg;
  // URL de webhook REAL desta promoção (franqueado + este produto). Colada na Kiwify.
  const appId = item && ((item.raw && item.raw.id) || item.id);
  const mats = materialsFor(appId); // materiais de download deste produto (URLs públicas)
  const [webhookUrl, setWebhookUrl] = React.useState('');
  const [whLoading, setWhLoading] = React.useState(true);
  React.useEffect(() => {
    let alive = true; setWhLoading(true);
    getWebhookUrl(appId)
      .then((u) => { if (alive) { setWebhookUrl(u); setWhLoading(false); } })
      .catch(() => { if (alive) { setWebhookUrl(''); setWhLoading(false); } });
    return () => { alive = false; };
  }, [appId]);
  const StepNum = ({ n }) => <div style={{ width: 26, height: 26, borderRadius: '50%', background: T.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 13, flex: '0 0 auto' }}>{n}</div>;
  const Step = ({ n, title, desc }) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <StepNum n={n} />
      <div><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15, color: T.ink }}>{title}</div><div style={{ fontFamily: DISP, fontSize: 13, color: T.dim, marginTop: 2, lineHeight: 1.5 }}>{desc}</div></div>
    </div>
  );

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
  // Com href → <a> de download real (Storage público). Sem href → botão placeholder (onClick).
  const Btn = ({ icon, children, solid, onClick, href, download }: any) => {
    const st: any = { display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: DISP, fontWeight: 600, fontSize: 13, padding: '9px 15px', borderRadius: 10, background: solid ? T.accent : '#fff', color: solid ? '#fff' : T.ink, border: `1px solid ${solid ? T.accent : T.line}`, textDecoration: 'none' };
    const inner = <>{icon && <Ico d={icon} size={15} c={solid ? '#fff' : T.ink} />}{children}</>;
    return href
      ? <a href={href} download={download} style={st}>{inner}</a>
      : <div onClick={onClick} style={st}>{inner}</div>;
  };
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
          {[['promo', 'Promover e vender'], ['mat', 'Materiais de venda'], ['comp', 'Materiais complementares'], ['prev', 'Prévia do app']].map(([k, l]) => {
            const on = tab === k;
            return <div key={k} onClick={() => setTab(k)} style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, padding: '10px 16px', borderRadius: '10px 10px 0 0', cursor: 'pointer', color: on ? T.accent : T.dim, borderBottom: `2px solid ${on ? T.accent : 'transparent'}` }}>{l}</div>;
          })}
        </div>
        <div style={{ height: 1, background: T.line }}></div>

        {tab === 'promo' ? (
          isCredentialing(appId) ? (
          /* dupla proteção: se o sheet for alcançado por qualquer caminho, a URL some e vira o aviso das 24h */
          <div style={{ padding: 24 }}>
            <div style={{ background: '#fff', border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: 22, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(124,58,237,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ico d={'M6 10V7a6 6 0 0 1 12 0v3 M5 10h14v11H5z'} size={20} c={T.accentDeep} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: T.ink }}>Finalizando o credenciamento</div>
                <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, marginTop: 6, lineHeight: 1.55 }}>Este produto está finalizando o credenciamento e estará disponível para promoção nas próximas <b style={{ color: T.ink, fontWeight: 600 }}>24 horas</b>. Você será avisado.</div>
              </div>
            </div>
          </div>
          ) : (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, lineHeight: 1.55 }}>Venda este produto no seu checkout (Kiwify, Hotmart…). Conecte o webhook abaixo e <b style={{ color: T.ink, fontWeight: 600 }}>toda venda aprovada libera o acesso do cliente na hora</b> — e cai nas suas Vendas.</div>
            <Step n={1} title="Crie o produto/checkout na sua plataforma" desc="Na Kiwify (ou Hotmart), crie o produto e a oferta com o preço que você vai cobrar." />
            <div style={{ background: '#fff', border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <StepNum n={2} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15.5, color: T.ink }}>Cole esta URL de webhook na Kiwify</div>
                  <div style={{ fontFamily: DISP, fontSize: 13, color: T.dim, marginTop: 3, lineHeight: 1.5 }}>Na Kiwify: <b style={{ color: T.ink, fontWeight: 600 }}>Apps → Webhooks</b> → novo webhook, evento <b style={{ color: T.ink, fontWeight: 600 }}>compra aprovada</b>, e cole a URL:</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <div style={{ flex: 1, minWidth: 0, fontFamily: MONO, fontSize: 12.5, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 10, padding: '13px 14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{whLoading ? 'Gerando sua URL…' : (webhookUrl || 'Erro ao gerar — recarregue a página.')}</div>
                    <div onClick={() => webhookUrl && copy('wh', webhookUrl)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, cursor: webhookUrl ? 'pointer' : 'default', background: T.accent, color: '#fff', borderRadius: 10, padding: '0 18px', fontFamily: DISP, fontWeight: 700, fontSize: 13.5, opacity: webhookUrl ? 1 : 0.5, flex: '0 0 auto' }}><Ico d={CP} size={15} c="#fff" />{copied === 'wh' ? 'Copiado!' : 'Copiar'}</div>
                  </div>
                </div>
              </div>
            </div>
            <Step n={3} title="Pronto — a venda vira acesso sozinha" desc="Quando alguém comprar, o cliente recebe o acesso por email na hora, entra na base deste produto e a venda aparece na sua aba Vendas. Você não faz mais nada." />
          </div>
          )
        ) : tab === 'mat' ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: DISP, fontSize: 14, color: T.dim, lineHeight: 1.55 }}>Baixe os materiais e publique na sua estrutura. Todos os franqueados recebem os mesmos arquivos — você conecta seu checkout via integração.</div>

            <AssetCard icon={'M4 5h16v14H4z M4 9h16 M8 5v4'} title="Página de vendas (HTML)" desc="A landing/VSL pronta pra publicar no seu domínio ou hospedagem.">
              <Btn icon={DL} solid href={dlHref(mats.html)} download={mats.html && mats.html.name} onClick={() => copy('html', 'download')}>{copied === 'html' ? 'Baixando…' : 'Baixar HTML'}</Btn>
              <Btn icon={IC.search} onClick={() => setTab('prev')}>Ver prévia</Btn>
            </AssetCard>

            <AssetCard icon={AIC.image} title="Imagem do produto" desc="Mockup/arte oficial do produto, em alta resolução (JPEG).">
              <Btn icon={DL} solid href={dlHref(mats.imagem)} download={mats.imagem && mats.imagem.name} onClick={() => copy('img', 'download')}>{copied === 'img' ? 'Baixando…' : 'Baixar imagem'}</Btn>
            </AssetCard>

            <AssetCard icon={'M3 5h18v11H3z M3 16l5-4 3 2 4-4 6 5'} title="Banner de checkout" desc={mats.selo ? 'Banner de topo + selo de garantia para usar na página do seu checkout.' : 'Banner de topo para usar na página do seu checkout.'}>
              <Btn icon={DL} solid href={dlHref(mats.banner)} download={mats.banner && mats.banner.name} onClick={() => copy('ban', 'download')}>{copied === 'ban' ? 'Baixando…' : 'Baixar banner'}</Btn>
              {mats.selo && <Btn icon={DL} href={dlHref(mats.selo)} download={mats.selo.name} onClick={() => copy('selo', 'download')}>{copied === 'selo' ? 'Baixando…' : 'Baixar selo'}</Btn>}
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

            <AssetCard icon={'M3 5h18v11H3z M3 16l5-4 3 2 4-4 6 5'} title="Criativos para anúncios" desc="Criativos prontos para tráfego pago (Meta e Google).">
              {[mats.criativo1, mats.criativo2, mats.criativo3, mats.criativo4].filter(Boolean).map((c: any, i: number) => (
                <Btn key={i} icon={DL} solid={i === 0} href={dlHref(c)} download={c && c.name} onClick={() => copy('cre' + i, 'download')}>{copied === 'cre' + i ? 'Baixando…' : `Criativo ${i + 1}`}</Btn>
              ))}
            </AssetCard>

            {SHOW_EXTRA_COMP && (<>
            <AssetCard icon={'M4 5h16v14H4z M4 9l8 5 8-5'} title="Copy para e-mail e WhatsApp" desc="Sequência de mensagens prontas para aquecer e converter sua lista.">
              <Btn icon={DL} solid onClick={() => copy('cpy', 'download')}>{copied === 'cpy' ? 'Baixando…' : 'Baixar copies'}</Btn>
            </AssetCard>

            <AssetCard icon={AIC.image} title="Artes para redes sociais" desc="Posts e stories editáveis para feed e status, no padrão da marca.">
              <Btn icon={DL} solid onClick={() => copy('soc', 'download')}>{copied === 'soc' ? 'Baixando…' : 'Baixar artes'}</Btn>
            </AssetCard>

            <AssetCard icon={AIC.play} title="Roteiros de stories e reels" desc="Roteiros prontos para gravar e divulgar o produto no seu perfil.">
              <Btn icon={DL} solid onClick={() => copy('rot', 'download')}>{copied === 'rot' ? 'Baixando…' : 'Baixar roteiros'}</Btn>
            </AssetCard>
            </>)}
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
