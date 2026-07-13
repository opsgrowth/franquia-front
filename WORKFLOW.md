# WORKFLOW — Front (opsgrowth/franquia-front)

> Como a gente muda o front **sem nunca tocar produção sem passar por staging validado**.
> Regra da casa a partir de 385 franqueados rumo a 40k+. Leia antes de abrir PR.

## Ambientes

| Ambiente | Branch | Deploy | Backend que consome | Supabase (auth) |
|---|---|---|---|---|
| **Produção** | `main` | Vercel (prod) → franquiaoficial.com | backend prod (Railway) | projeto prod |
| **Staging** | `staging` | Vercel (branch staging) → domínio staging | backend staging (Railway) | projeto **staging separado** |

## Modelo de branches

```
feat/minha-mudanca   ──PR──▶   staging   ──PR──▶   main
     (você trabalha)         (valida no ar)      (produção)
```

- **`main`** = produção. **Protegida**: sem push direto, PR + aprovação do fundador + CI verde.
- **`staging`** = homologação. Protegida mais leve: PR + CI verde.
- **`feat/*`** = branches de trabalho, sempre partindo de `staging`.

## Fluxo do dia a dia

1. `git checkout staging && git pull` → `git checkout -b feat/minha-mudanca`
2. Desenvolva e commite (convenção abaixo).
3. **PR `feat/*` → `staging`.** O CI roda o **build do Vite** (o gate) + `tsc` informativo. Só mescla com build verde.
4. **Deploy automático em staging** (Vercel, branch `staging`).
5. Rode o **smoke test** (`SMOKE_TEST.md`) apontando pro ambiente de staging. **O fundador valida.**
6. **PR `staging` → `main`** (CI + aprovação do fundador) → **deploy automático em produção**.

## Variáveis de ambiente (as 3 do Vite)

São **inlinadas no build** (`import.meta.env.VITE_*`) — precisam existir **no momento do build**, e por
isso vivem nas **Environment Variables da Vercel por ambiente** (não num `.env` commitado):

| Var | Prod | Staging |
|---|---|---|
| `VITE_API_URL` | backend prod (Railway) | backend staging (Railway) |
| `VITE_SUPABASE_URL` | projeto Supabase prod | projeto Supabase staging |
| `VITE_SUPABASE_ANON_KEY` | anon key prod | anon key staging |

Veja `.env.example` para o dev local. **Nunca** commite o `.env` real (está no `.gitignore`).

> **Nota de migração (uma vez):** o `.env` com valores de prod já esteve versionado. A remoção do
> tracking é feita **só depois** de as `VITE_*` estarem setadas no ambiente **Production** da Vercel e
> um deploy de prod confirmar que segue idêntico — é um checkpoint manual do fundador, não automático.

## Regras "nunca toque prod"

- **Sem push direto na `main`.** Toda mudança passa por `staging`.
- **Segredos fora do git.** Só a anon key (pública) já esteve exposta; ainda assim, envs vivem na Vercel.
- Mudança de env por ambiente é feita **na Vercel**, escopada à branch/ambiente certo.

## Convenção de commit

`area: descrição` — imperativo, em PT, ASCII (sem acento), curto. Ex.: `ui: remove saudacao acima de 'Seu painel'`.

## Rollback

Reverter o merge na `main` (PR de revert) → a Vercel redeploya o commit anterior automaticamente.
