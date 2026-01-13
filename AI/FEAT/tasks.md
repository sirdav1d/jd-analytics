# Tarefas - Relatório de Marketing Público

## 1) Definições e alinhamentos
1. [x] Confirmar o formato exato do título (maiúsculas, abreviação do mês e faixa de datas).
   Resumo: Formato definido conforme o exemplo do PRD: "RELATÓRIO MARKETING DD A DD MMM/AA" com mês abreviado em PT-BR.

2. [x] Confirmar o mapeamento das APIs atuais para custos Google Centro/Produtos e Google Icaraí/Serviços.
   Resumo: O custo vem do endpoint `GET /api/services/google-services/get-ads-data?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&scope=products|services` (wrapper: `src/services/google-services/get-ads-data.ts`), usando `data.dataADS.cost_micros.current / 1_000_000`. `scope=products` representa Centro/Produtos e `scope=services` representa Icaraí/Serviços (mapeamento em `src/lib/google-ads-account.ts`).

3. Confirmar a origem do faturamento total de marketing (Google + META) no período.

4. Definir o formato do `:id` do relatório público (ex.: slug fixo, UUID, data de referência).

## 2) Camada de dados e agregação
5. Criar um serviço de agregação que:
   - Busca o último investimento META (por `periodEnd`, depois `lastSyncAt`).
   - Determina o período `periodStart` -> `periodEnd`.
   - Consolida investimentos (META + 2 canais Google) e faturamento total.
   - Calcula o ROAS geral.

6. Garantir que o cálculo use a data final congelada do investimento META.

7. Implementar formatação numérica BRL e ROAS com 2 casas decimais.

## 3) Endpoint público
8. Criar `GET /api/public/marketing-report/:id` retornando `text/plain; charset=utf-8`.

9. Implementar suporte a `?download=1` com `Content-Disposition: attachment`.

10. Aplicar cache por tag e revalidação quando houver novo upsert de META.

## 4) UI do link público
11. Criar página pública que consome o endpoint e exibe o card animado.

12. Adicionar skeleton de carregamento e animação leve (fade + slide).

13. Incluir CTA "Copiar texto" no card.

## 5) Integrações e atualização automática
14. Disparar revalidação do relatório após upsert de META.

15. Garantir que o card público reflita novos valores sem intervenção manual.

## 6) Validação
16. Validar que o texto do relatório está idêntico ao formato exigido.

17. Validar que datas, totais e ROAS correspondem à janela congelada.

18. Validar que o link público funciona sem autenticação.
