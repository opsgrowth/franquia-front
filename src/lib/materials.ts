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
};

export function materialsFor(appId: any): ProductMaterials {
  return (typeof appId === 'string' && MATERIALS[appId]) || {};
}

// href pronto pro <a>: força download com nome limpo via ?download=. null → sem material.
export function dlHref(m?: Material): string | null {
  return m ? `${m.url}?download=${m.name}` : null;
}
