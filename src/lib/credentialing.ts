// Produtos "em credenciamento" — o franqueado ainda NÃO promove: no lugar da URL de
// webhook aparece o popup das 24h. Controle deliberadamente MÍNIMO e reversível:
// para liberar a promoção, apague o id da lista abaixo (1 linha) e o produto volta ao
// fluxo normal (sheet + URL). Nada de backend/migração — é uma trava temporária de UI.
const CREDENTIALING_IDS: string[] = [
  'ba3d8183-afe4-4573-9dca-2d28230a9ead', // Lancheirinha Prática e Saudável — remover quando o ebook estiver pronto
];

export function isCredentialing(id: any): boolean {
  return typeof id === 'string' && CREDENTIALING_IDS.includes(id);
}
