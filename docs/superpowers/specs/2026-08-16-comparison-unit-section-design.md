# Renderização condicional dos comparativos por unidade

## Objetivo

Exibir o bloco com “Faturamento por unidade”, “Total de vendas por unidade” e “Novos Clientes” somente quando houver dados de mais de uma empresa no período selecionado.

## Arquitetura

Um novo componente servidor `ComparisonUnitSection` receberá a mesma promessa retornada por `FetchResultByOrg`. Ele aguardará a resposta, extrairá `data.result` e contará os valores distintos de `organization`.

O componente retornará `null` quando a resposta não for válida ou quando houver dados de zero ou uma organização distinta. Com duas ou mais organizações distintas, ele renderizará a grade completa e os três componentes `ComparisonUnit` existentes.

`OverviewPage` substituirá a grade montada diretamente pelo novo componente. `ComparisonUnit` continuará responsável apenas por apresentar um gráfico individual.

## Escopo visual

A condição abrangerá somente o bloco de três gráficos mostrado na referência:

- Faturamento por unidade;
- Total de vendas por unidade;
- Novos Clientes.

`SalesVsRepairRevenue`, `RevenueChart` e os demais elementos do dashboard continuarão sendo renderizados independentemente dessa condição.

## Dados e casos de borda

A contagem será baseada nas organizações com dados em `data.result` para o período selecionado, não no cadastro global de empresas. A contagem usará nomes distintos de organização, portanto linhas repetidas da mesma empresa continuarão representando uma única empresa.

Se a resposta estiver ausente, malformada ou com `ok: false`, o bloco não será renderizado, pois não há confirmação de múltiplas empresas com dados no período.

## Testes

Os testes do componente servidor verificarão que:

- uma única organização retorna `null`;
- linhas duplicadas da mesma organização retornam `null`;
- duas organizações distintas renderizam a grade e os três gráficos;
- uma resposta inválida ou malsucedida retorna `null`.
