// Materiais de download por produto (franchise-shared, bucket PÚBLICO do Supabase).
// Cada item vira um <a> direto pro Storage com ?download=<nome-limpo> → o Supabase
// responde Content-Disposition: attachment e o browser baixa com o nome certo,
// cross-origin e SEM auth (auth não tem como quebrar o download).
// Adicionar produto = nova entrada aqui. Nada de backend/migração.
const BASE = 'https://dyebiqvperomcdverzsc.supabase.co/storage/v1/object/public/materials';

type Material = { url: string; name: string };
export type ProductMaterials = {
  html?: Material;
  imagem?: Material;
  banner?: Material;
  selo?: Material;
  criativo1?: Material;
  criativo2?: Material;
  criativo3?: Material;
  criativo4?: Material;
};

const MATERIALS: Record<string, ProductMaterials> = {
  // MVS — 42d93ba6-5c13-49a6-99f2-a05098f5670b
  '42d93ba6-5c13-49a6-99f2-a05098f5670b': {
    html: { url: `${BASE}/mvs/mvs_pagina_v2.html`, name: 'MVS-pagina-de-vendas.html' },
    imagem: { url: `${BASE}/mvs/imagem_do_produto.jpeg`, name: 'MVS-imagem-do-produto.jpeg' },
    banner: { url: `${BASE}/mvs/checkout.png`, name: 'MVS-banner-de-checkout.png' },
    selo: { url: `${BASE}/mvs/selo_de_garantia.png`, name: 'MVS-selo-de-garantia.png' },
    criativo1: { url: `${BASE}/mvs/criativo1.mp4`, name: 'MVS-criativo-1.mp4' },
    criativo2: { url: `${BASE}/mvs/criativo2.mp4`, name: 'MVS-criativo-2.mp4' },
  },
  // Lancheirinha Prática e Saudável — ba3d8183-afe4-4573-9dca-2d28230a9ead
  // Criativos são .PNG (maiúsculo no Storage) → a URL respeita o case; o nome de download é limpo.
  'ba3d8183-afe4-4573-9dca-2d28230a9ead': {
    html: { url: `${BASE}/lancheirinha-materiais/clube_lancheirinha.html`, name: 'Lancheirinha-pagina-de-vendas.html' },
    imagem: { url: `${BASE}/lancheirinha-materiais/imagem_do_produto.jpeg`, name: 'Lancheirinha-imagem-do-produto.jpeg' },
    banner: { url: `${BASE}/lancheirinha-materiais/checkout.png`, name: 'Lancheirinha-banner-de-checkout.png' },
    selo: { url: `${BASE}/lancheirinha-materiais/selo_de_garantia.png`, name: 'Lancheirinha-selo-de-garantia.png' },
    criativo1: { url: `${BASE}/lancheirinha-materiais/criativo1.PNG`, name: 'Lancheirinha-criativo-1.png' },
    criativo2: { url: `${BASE}/lancheirinha-materiais/criativo2.PNG`, name: 'Lancheirinha-criativo-2.png' },
    criativo3: { url: `${BASE}/lancheirinha-materiais/criativo3.PNG`, name: 'Lancheirinha-criativo-3.png' },
    criativo4: { url: `${BASE}/lancheirinha-materiais/criativo4.PNG`, name: 'Lancheirinha-criativo-4.png' },
  },
  // Trafego Pago Infoprodutos (WeFit) — d68cac33-763f-44cb-8219-2e387fc73dd4
  'd68cac33-763f-44cb-8219-2e387fc73dd4': {
    html: { url: `${BASE}/wefit-materiais/wefit.html`, name: 'WeFit-pagina-de-vendas.html' },
    imagem: { url: `${BASE}/wefit-materiais/imagem_do_produto.png`, name: 'WeFit-imagem-do-produto.png' },
    banner: { url: `${BASE}/wefit-materiais/checkout.png`, name: 'WeFit-banner-de-checkout.png' },
    selo: { url: `${BASE}/wefit-materiais/selo_de_garantia.png`, name: 'WeFit-selo-de-garantia.png' },
    criativo1: { url: `${BASE}/wefit-materiais/criativo1.mp4`, name: 'WeFit-criativo-1.mp4' },
    criativo2: { url: `${BASE}/wefit-materiais/criativo2.mp4`, name: 'WeFit-criativo-2.mp4' },
  },
  // Guia de Cabelos Incríveis — b8470afa-0d86-4f4b-915e-1b3c015c6a8e
  'b8470afa-0d86-4f4b-915e-1b3c015c6a8e': {
    html: { url: `${BASE}/cabelos-materiais/guia-cabelos.html`, name: 'Cabelos-pagina-de-vendas.html' },
    imagem: { url: `${BASE}/cabelos-materiais/Imagem_o_produto.png`, name: 'Cabelos-imagem-do-produto.png' },
    banner: { url: `${BASE}/cabelos-materiais/checkout.png`, name: 'Cabelos-banner-de-checkout.png' },
    selo: { url: `${BASE}/cabelos-materiais/selo_de_garantia.png`, name: 'Cabelos-selo-de-garantia.png' },
    criativo1: { url: `${BASE}/cabelos-materiais/criativo1.mp4`, name: 'Cabelos-criativo-1.mp4' },
    criativo2: { url: `${BASE}/cabelos-materiais/criativo2.mp4`, name: 'Cabelos-criativo-2.mp4' },
    criativo3: { url: `${BASE}/cabelos-materiais/criativo3.mp4`, name: 'Cabelos-criativo-3.mp4' },
  },
  // Natural Skin — cf8ef2c6-802c-4126-8a57-6916c957b362
  'cf8ef2c6-802c-4126-8a57-6916c957b362': {
    html: { url: `${BASE}/naturalskin-materiais/natural-skin.html`, name: 'NaturalSkin-pagina-de-vendas.html' },
    imagem: { url: `${BASE}/naturalskin-materiais/Imagem_o_produto.png`, name: 'NaturalSkin-imagem-do-produto.png' },
    banner: { url: `${BASE}/naturalskin-materiais/checkout.png`, name: 'NaturalSkin-banner-de-checkout.png' },
    selo: { url: `${BASE}/naturalskin-materiais/selo_de_garantia.png`, name: 'NaturalSkin-selo-de-garantia.png' },
    criativo1: { url: `${BASE}/naturalskin-materiais/criativo1.mp4`, name: 'NaturalSkin-criativo-1.mp4' },
    criativo2: { url: `${BASE}/naturalskin-materiais/criativo2.mp4`, name: 'NaturalSkin-criativo-2.mp4' },
    criativo3: { url: `${BASE}/naturalskin-materiais/criativo3.mp4`, name: 'NaturalSkin-criativo-3.mp4' },
  },
};

export function materialsFor(appId: any): ProductMaterials {
  return (typeof appId === 'string' && MATERIALS[appId]) || {};
}

// href pronto pro <a>: força download com nome limpo via ?download=. null → sem material.
export function dlHref(m?: Material): string | null {
  return m ? `${m.url}?download=${m.name}` : null;
}
