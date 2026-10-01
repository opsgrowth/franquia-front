# SMOKE TEST — validação padrão de STAGING (antes de todo merge pra `main`)

> Rode este checklist **no ambiente de staging** depois que a mudança sobe lá e **antes** de abrir
> o PR `staging → main`. Todo item deve passar. Se algum falhar, o merge pra prod **não acontece**.
> Marque `[x]` conforme validar. É o mesmo checklist nos dois repos (front e back).

## 0. Ambiente correto (o mais importante)
- [ ] `GET <backend-staging>/health` → `{"ok": true, "storage": "supabase", ...}` com o marcador de build novo.
- [ ] No DevTools → Network, o front de staging chama o **backend de staging** e o **Supabase de staging**
      (não os hosts de produção). **Se apontar pra prod, PARE** — a separação de env falhou.

## 1. Auth
- [ ] Login de **franqueado de teste** (usuário do Supabase de staging) → painel carrega.
- [ ] Login de **admin de teste** (e-mail em `ADMIN_EMAILS` de staging) → Estúdio/Catálogo Franquia carrega.
- [ ] Logout limpa a sessão; não vaza dado do login anterior ao trocar de conta (hard refresh não necessário).

## 2. Catálogo do franqueado
- [ ] O franqueado vê o **catálogo sintético** (produtos publicados do seed).
- [ ] Produto **camuflado** aparece embaçado e não-clicável; **premium** (se houver) mostra o popup de 7 dias.
- [ ] Popup de boas-vindas do franqueado aparece no login e fecha em "Iniciar jornada".

## 3. Conteúdo (app do produto)
- [ ] Abrir um produto → **capas de módulo** aparecem; **player 16:9** estável; blocos
      (heading/paragraph/list/quote/vídeo) renderizam.
- [ ] Editar um bloco no co-admin e salvar → persiste (reabrir confirma).

## 4. Materiais + Integrações
- [ ] Aba **Materiais**: botões de download baixam o arquivo certo (nome limpo).
- [ ] Abrir **Integrações** → URL de webhook é gerada por produto (staging), copiável.
- [ ] Produtos camuflados **não** aparecem em Integrações.

## 5. Venda → acesso do comprador
- [ ] Simular um webhook Kiwify de staging (URL de webhook de um produto) → o comprador recebe acesso
      (e-mail enviado se `RESEND_API_KEY` setado, ou **logado** se vazio) e a venda aparece em Vendas.
- [ ] **App do aluno**: abrir o magic link do comprador → app carrega o conteúdo do produto certo.

## 6. Isolamento multi-tenant
- [ ] Com dois tenants de teste (franquia + Tenant B do seed), confirmar que o Tenant B **não** vê os
      dados nem a URL de webhook da franquia, e vice-versa.

## 7. Banco / migração
- [ ] Banco de staging na versão de migração esperada (a mais nova do PR, ex. `0016`+).
- [ ] Nenhuma migração pendente por aplicar.

## 8. CI + proteção
- [ ] O PR abriu com **CI verde** (build do front / 118 testes do backend).
- [ ] Push direto na `main` é **bloqueado** (proteção de branch ativa).

---

Passou tudo? Abra o PR `staging → main`, peça a aprovação do fundador e faça o release. Depois do
deploy em prod, rode ao menos os itens **0, 1 e 2** contra produção (smoke leve).
