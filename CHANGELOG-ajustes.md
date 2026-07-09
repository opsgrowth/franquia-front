# Changelog — ajustes recentes (para o Claude Code implementar 1:1)

Todos os ajustes abaixo **já estão aplicados** nos arquivos `.tsx` de `src/franquia/`
(conversão fiel byte-a-byte do protótipo). Este documento é só o roteiro do que mudou,
arquivo por arquivo, para você conferir/replicar no codebase real.

## 1. Estúdio → "Novo aplicativo" (copy)
**Arquivo:** `src/franquia/author-ingest.tsx` (`IngestScreen`, caminho do franqueado)
- Título do topo e `<h1>`: "Novo curso" → **"Novo aplicativo"** (sub continua "Gerar com IA").
- Descrição nova: *"Crie um aplicativo que fatura de forma recorrente: você vende uma vez
  e recebe por meses. A IA monta a partir de um PDF, ou comece do zero — você revisa antes de publicar."*

## 2. Paywall "RecorrêncIA" (novo componente) + captura de lead
**Arquivo:** `src/franquia/author-ingest.tsx` — componente **`RecorrenciaPaywall`** (exportado).
- É um modal de 2 estágios controlado por `stage` (`'offer'` → `'form'`) + `sent`:
  - **offer:** headline "Criar aplicativos é para alunos do **RecorrêncIA**" (o "IA" em `T.pill`),
    lista de perks, CTA **"Quero fazer parte do RecorrêncIA →"**.
  - **form:** lista de espera com **Nome** e **E-mail já preenchidos** (`'Camila Oliveira'`,
    `'camila@franquia.ia'`) + campo **WhatsApp** obrigatório. Botão "Entrar na lista de espera".
  - **sent:** confirmação "Tudo certo, {primeiro nome}! 🎉 … te chamamos no WhatsApp".
- No caminho do franqueado, os botões **"Montar com a IA"** e **"Começar do zero"** agora
  abrem esse paywall (`setPaywall(true)`) em vez de prosseguir. Estado `paywall` no `IngestScreen`.
- `RecorrenciaPaywall` é exportado para reuso (ver itens 3 e 4).

## 3. Catálogo — aba "Meus produtos" gated
**Arquivo:** `src/franquia/desktop-screens-1.tsx` (`DCatalogo`)
- Importa `RecorrenciaPaywall` de `./author-ingest`.
- Estado `paywall`. Clicar na aba **"Meus produtos"** abre o paywall (não troca de aba).

## 4. Início — botão "Gerar versão" gated
**Arquivo:** `src/franquia/desktop-screens-1.tsx` (`DDashboard`)
- Estado `paywall`; o botão **"Gerar versão"** do card abre o `RecorrenciaPaywall`.
  (No protótipo puro usa `window.RecorrenciaPaywall`; no `.tsx` é import direto.)

## 5. Kit de Vendas — nova aba "Materiais complementares"
**Arquivo:** `src/franquia/desktop-materiais.tsx` (`MaterialsSheet`)
- Abas agora: `['mat','Materiais de venda'], ['comp','Materiais complementares'], ['prev','Prévia do app']`.
- Novo branch `tab === 'comp'` com 4 AssetCards: **Criativos para anúncios**, **Copy para
  e-mail e WhatsApp**, **Artes para redes sociais**, **Roteiros de stories e reels**.

## 6. Catálogo Franquia — 4 últimos produtos PREMIUM + popup 7 dias
**Arquivo:** `src/franquia/desktop-screens-1.tsx` (`DCatalogo`)
- Na aba "Produtos da Franquia", os **4 últimos** cards recebem a tag dourada **PREMIUM**
  (`isPrem = isF && FRAN.indexOf(it) >= FRAN.length - 4`).
- Clicar em **"Abrir →"** num premium abre um popup (estado `premInfo`): "Produto Premium —
  Alta performance, liberado em 7 dias" com o texto de preparação. Os não-premium continuam
  abrindo o Kit de Vendas (`MaterialsSheet`).

---

### Observação de fidelidade
Os `.tsx` em `src/franquia/` são a conversão mecânica dos `.jsx` do protótipo (corpo de
render idêntico; só `window` globals → import/export). O `tsconfig` está frouxo de propósito
(`strict:false`) — priorize a fidelidade visual; ajuste tipos/imports no build como já combinado.
