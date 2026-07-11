// Nome de produto CAMUFLADO — usado só em Início e Vendas.
// Se o produto (casado pelo título) está com a toggle "camuflado" ligada, devolve um
// nome mascarado; senão, devolve o título original intacto. NÃO altera dados, lógica,
// agregação ou vendas — apenas o TEXTO exibido. À prova de erro: qualquer exceção ou
// caso inesperado → devolve o valor recebido (fail-open, nunca quebra a tela).
export function camoName(title: any): any {
  try {
    if (typeof title !== 'string') return title;
    const prods = (typeof window !== 'undefined' && (window as any).__franquiaProducts) || [];
    const p = prods.find((x: any) => x && (x.title === title || x.name === title));
    if (p && p.camouflaged) return '•••••••••';
  } catch (e) { /* fail-open */ }
  return title;
}
