# Tarefas - Relatório de Marketing Público

## 1) Definições e alinhamentos
1. [x] Confirmar o formato exato do título (maiúsculas, abreviação do mês e faixa de datas).
   Resumo: Formato definido conforme o exemplo do PRD: "RELATÓRIO MARKETING DD A DD MMM/AA" com mês abreviado em PT-BR.

2. [x] Confirmar o mapeamento das APIs atuais para custos Google Centro/Produtos e Google Icaraí/Serviços.
   Resumo: O custo vem do endpoint `GET /api/services/google-services/get-ads-data?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&scope=products|services` (wrapper: `src/services/google-services/get-ads-data.ts`), usando `data.dataADS.cost_micros.current / 1_000_000`. `scope=products` representa Centro/Produtos e `scope=services` representa Icaraí/Serviços (mapeamento em `src/lib/google-ads-account.ts`).

3. [x] Confirmar a origem do faturamento total de marketing (Google + META) no período.
   Resumo: O faturamento total vem do somatório dos itens de pedidos (`SaleItem.totalValue`) no período, filtrando `Origin.name` por Google (`%google%`) e Meta (`%meta%`) — referência atual em `src/app/api/services/data-services/data-origin/route.ts` e faturamento Google em `src/app/api/services/google-services/get-analytics-data/route.ts`.

4. [x] Definir o formato do `:id` do relatório público (ex.: slug fixo, UUID, data de referência).
   Resumo: O `:id` será um slug fixo `current` (ex.: `GET /api/public/marketing-report/current`) para manter uma URL estável e sem token, representando sempre o relatório “atual” (sem histórico de versões).

## 2) Camada de dados e agregação
5. [x] Criar um serviço de agregação que:
   - Busca o último investimento META (por `periodEnd`, depois `lastSyncAt`).
   - Determina o período `periodStart` -> `periodEnd`.
   - Consolida investimentos (META + 2 canais Google) e faturamento total.
   - Calcula o ROAS geral.
   Resumo: Serviço criado em `src/services/marketing-report/get-marketing-report-aggregate.ts` que seleciona o último `MetaInvestment`, congela `periodStart/periodEnd`, soma custos Google por `scope=products|services` via Google Ads API e calcula faturamento total (origens `%google%` e `%meta%`) + ROAS geral.

6. [x] Garantir que o cálculo use a data final congelada do investimento META.
   Resumo: O serviço `src/services/marketing-report/get-marketing-report-aggregate.ts` deriva `periodStart/periodEnd` do último `MetaInvestment` e usa essa janela (incluindo o `periodEnd` congelado) para calcular custos Google, faturamento e ROAS — sem depender da data atual.

7. [x] Implementar formatação numérica BRL e ROAS com 2 casas decimais.
   Resumo: O agregador agora expõe strings formatadas em `pt-BR` via `Intl.NumberFormat` (BRL) e `toLocaleString` (ROAS com 2 casas) em `src/services/marketing-report/get-marketing-report-aggregate.ts`.

## 3) Endpoint público
8. [x] Criar `GET /api/public/marketing-report/:id` retornando `text/plain; charset=utf-8`.
   Resumo: Endpoint público criado em `src/app/api/public/marketing-report/[id]/route.ts` (aceita `:id=current`) e retorna o relatório em texto puro com o layout do PRD.

9. (ADIADO) Implementar suporte a `?download=1` para baixar o card em PNG (`Content-Type: image/png`) com `Content-Disposition: attachment; filename="marketing-report.png"`.

10. [x] Aplicar cache por tag e revalidação quando houver novo upsert de META.
   Resumo: Agregação do relatório cacheada com `unstable_cache` (tag `marketing-report`) e invalidada via `revalidateTag('marketing-report')` no upsert de META (`src/app/api/services/meta-investments/route.ts` e `src/actions/meta-investment/upsert.ts`).

## 4) UI do link público
11. [x] Criar página pública que consome o endpoint e exibe o card animado.
   Resumo: Página criada em `src/app/(public)/marketing-report/[id]/page.tsx` renderiza o card animado via `src/app/(public)/marketing-report/[id]/_components/marketing-report-public-card.tsx`, com dados gerados server-side em `src/app/(public)/marketing-report/[id]/_components/marketing-report-public-content.tsx` dentro de `<Suspense>`.

12. [x] Adicionar skeleton de carregamento e animação leve (fade + slide).
   Resumo: Skeleton adicionado em `src/app/(public)/marketing-report/[id]/_components/marketing-report-public-skeleton.tsx` e aplicado como fallback do `<Suspense>` em `src/app/(public)/marketing-report/[id]/page.tsx`.

13. [x] Incluir CTAs "Copiar texto" e "Copiar link" no card.
   Resumo: Ações adicionadas no card público via `src/app/(public)/marketing-report/[id]/_components/marketing-report-public-copy-actions.tsx`, permitindo copiar o texto do relatório (quando disponível) e copiar o link público.

## 5) Integrações e atualização automática
14. [x] Disparar revalidação do relatório após upsert de META.
   Resumo: O upsert de META invalida a tag `marketing-report` via `revalidateTag('marketing-report')` tanto no endpoint (`src/app/api/services/meta-investments/route.ts`) quanto na server action (`src/actions/meta-investment/upsert.ts`).

15. [x] Garantir que o card público reflita novos valores sem intervenção manual.
   Resumo: Além do `revalidateTag('marketing-report')`, o upsert de META agora também invalida a rota pública com `revalidatePath('/marketing-report/current')` em `src/app/api/services/meta-investments/route.ts` e `src/actions/meta-investment/upsert.ts` (rota sob o route group `(public)`).

## 6) Validação
16. [x] Validar que o texto do relatório está idêntico ao formato exigido.
   Resumo: Conferido por inspeção do formatter `src/services/marketing-report/format-marketing-report-text.ts` (título, seções/labels, quebras de linha e indentação de INVESTIMENTOS), alinhado ao PRD.

17. [x] Validar que datas, totais e ROAS correspondem à janela congelada.
   Resumo: Conferido por inspeção do agregador `src/services/marketing-report/get-marketing-report-aggregate.ts` (período `metaInvestmentRef`, custo total e fórmula do ROAS na mesma janela).

18. [x] Validar que o link público funciona sem autenticação.
   Resumo: Rotas públicas não possuem checagem de auth (`src/app/(public)/marketing-report/[id]/page.tsx` e `src/app/api/public/marketing-report/[id]/route.ts`).

## 7) Ajustes pós-feedback
19. [x] Incluir "CUSTO TOTAL" no texto do relatório e melhorar a hierarquia visual do texto.
   Resumo: O texto agora inclui a linha `CUSTO TOTAL` (soma de META + Google) e os itens de investimentos foram indentados em `src/services/marketing-report/format-marketing-report-text.ts`.

20. [x] Remover título duplicado no card público, mantendo apenas o título do relatório com o período.
   Resumo: O card passou a extrair a primeira linha do texto como título e renderiza o restante abaixo (sem repetir o título) em `src/app/(public)/marketing-report/[id]/_components/marketing-report-public-card.tsx`.
