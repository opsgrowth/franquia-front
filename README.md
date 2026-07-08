# FranquIA — Front-end (port fiel do protótipo)

Projeto **Vite + React 18 + TypeScript**. Os arquivos em `src/franquia/` são a
**conversão mecânica 1:1** dos arquivos `.jsx` do protótipo navegável: o corpo de
render (markup/estilos/lógica) é **byte-a-byte idêntico** — só o encanamento de módulo
mudou (`window` globals → `import`/`export` ES). Isso garante o visual 100% igual.

## Rodar
```bash
npm install
npm run dev      # http://localhost:5173
```
Abre no **Painel**. Navegação via `window.__go(key)` (sidebar/botões já chamam).

## Como foi convertido (o que o build espera)
- Cada `src/franquia/*.tsx` = um `.jsx` do protótipo + `import React` no topo +
  imports dos símbolos usados (de `./kit` e dos módulos irmãos) + `export { … }` no fim
  (era `Object.assign(window, { … })`).
- `src/franquia/kit.tsx` = port de `manual-kit.jsx`: tokens `T`, `DISP`, `MONO`,
  `Mark`, `Wordmark`, `Lockup`, `Kicker`, `useIsMobile` + ícones `Ico`/`IC`.
- `src/franquia/globals.d.ts` — tipa `window[...]` como `any` (usado por `__go`,
  `__franquiaProducts`, `FIXED_COVERS`, `COVER`).
- `src/App.tsx` — port do switcher `Proto` do protótipo (mapa `SCREEN_FOR`, store
  compartilhado `window.__franquiaProducts`, capas fixas `FIXED_COVERS`).
- `tsconfig.json` está **frouxo de propósito** (`strict:false`, sem `noUnusedLocals`,
  `noImplicitAny:false`) — prioridade é fidelidade visual. Aperte quando quiser.

## Telas (mapa de arquivos → tela)
| Tela | Arquivo |
|---|---|
| Início / Painel | `franquia/desktop-screens-1.tsx` (`DDashboard`) |
| Catálogo (abas Franquia/Meus) | `franquia/desktop-screens-1.tsx` (`DCatalogo`) |
| Estúdio · Ingestão | `franquia/author-ingest.tsx` (`IngestScreen`) |
| Mesa de revisão | `franquia/author-review.tsx` (`ReviewDeskScreen`) |
| Produtos & Cursos (criar do zero / admin) | `franquia/co-admin-screen.tsx` (`ProductsAdminScreen`) |
| Editor de produto (legado) | `franquia/desktop-screens-2.tsx` (`DGerador`, `DEditor`) |
| Vendas | `franquia/desktop-vendas.tsx` (`DVendas`) |
| Configurações + Integrações | `franquia/desktop-config.tsx` (`DConfig`) |
| Kit de Vendas / Promover | `franquia/desktop-materiais.tsx` |
| Login | `franquia/desktop-login.tsx` (`LoginScreen`) |
| App do aluno (vitrine/curso/player/paywall) | `franquia/co-app.tsx` + `co-screens.tsx` + `co-tabs.tsx` |
| Preview iPhone/desktop | `franquia/author-preview.tsx` + `ios-frame.tsx` + `author-app*.tsx` |
| Modais criar produto/módulo/aula | `franquia/co-admin-modals.tsx` + `co-admin.tsx` |
| Capas embutidas (base64) | `franquia/cover-assets.tsx` |

## Dados / estado
- Seed dos produtos da Franquia: `FRANQUIA_INIT` em `franquia/co-admin.tsx`.
- Store compartilhado em runtime: `window.__franquiaProducts` / `__setFranquiaProducts`
  (persistido em `localStorage['fia_products']`). Capas fixas por título em
  `window.FIXED_COVERS` (de `cover-assets.tsx`). Marque aqui os pontos de API.

## Notas de porte (o que ajustar no build)
- Trocar o switcher de `App.tsx` por react-router se quiser URLs reais.
- Alguns componentes têm props sem tipo (any) — esperado; tipar conforme o backend.
- As capas são **imagens embutidas em base64** dentro de `cover-assets.tsx` (não há
  PNGs soltos a copiar).
