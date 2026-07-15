// Produtos "em credenciamento" — o franqueado ainda NÃO promove: no lugar da URL de
// webhook aparece o popup das 24h. Controle deliberadamente MÍNIMO e reversível:
// para liberar a promoção, apague o id da lista abaixo (1 linha) e o produto volta ao
// fluxo normal (sheet + URL). Nada de backend/migração — é uma trava temporária de UI.
const CREDENTIALING_IDS: string[] = [
  // Vazio: nenhum produto em credenciamento agora. Para travar a promoção de um produto
  // (mostra o aviso das 24h no lugar da URL de webhook), adicione o app id aqui.
  // A Lancheirinha saiu em 2026-07-14 — ebook pronto e validado em prod.
];

export function isCredentialing(id: any): boolean {
  return typeof id === 'string' && CREDENTIALING_IDS.includes(id);
}
