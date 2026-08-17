# Dashboard adaptável à quantidade de unidades

## Objetivo

Adaptar o dashboard principal à quantidade de organizações com dados no período selecionado. A mesma detecção controlará o bloco de comparativos, o título da visão geral e a apresentação dos dois gráficos históricos.

## Fonte da verdade

Um utilitário compartilhado validará a resposta de `FetchResultByOrg`, extrairá `data.result` e produzirá a lista de organizações distintas, ignorando nomes vazios e linhas duplicadas da mesma organização.

A contagem considera somente organizações com dados no período selecionado. O cadastro global de empresas não participa da decisão.

## Comparativos por unidade

O componente servidor `ComparisonUnitSection` receberá a promessa retornada por `FetchResultByOrg` e usará o utilitário compartilhado.

Com zero ou uma organização distinta, ele retornará `null`. Com duas ou mais, renderizará a grade completa com:

- Faturamento por unidade;
- Total de vendas por unidade;
- Novos Clientes.

`OverviewPage` delegará o bloco completo ao novo componente. `ComparisonUnit` continuará responsável somente por um gráfico individual.

## Título da visão geral

Um provider cliente no layout do dashboard armazenará se o histórico atual possui múltiplas organizações. Um sincronizador renderizado por `OverviewPage` consumirá a promessa já existente e atualizará o provider, sem realizar outra chamada à API.

Na rota `/dashboard`, `Greeting` exibirá:

- zero ou uma organização: `Visão Geral`;
- duas ou mais organizações: `Visão Geral Centro Vs. Icaraí`.

Os títulos das demais rotas continuarão inalterados. Ao sair da visão geral ou trocar o histórico, o estado não poderá manter um resultado obsoleto.

## Gráficos históricos

`SalesVsRepairRevenue` e `RevenueChart` usarão a mesma lista de organizações.

Com exatamente uma organização, cada componente renderizará um `AreaChart` com uma única série `Area`, preenchimento em gradiente e os rótulos de valor atuais. A legenda inferior não será renderizada, mas o tooltip continuará exibindo o nome da organização.

Com duas ou mais organizações, cada componente manterá o `LineChart`, as séries em linha e a legenda inferior existentes.

Sem uma série utilizável, o componente exibirá o estado `Sem dados encontrados` em vez de tentar montar um gráfico vazio.

Os títulos `Vendas por unidade` e `Faturamento por Unidade` permanecerão inalterados.

## Escopo preservado

Os demais elementos do dashboard continuarão independentes da condição, incluindo metas, indicadores, rankings e produtos. O componente global de gráficos e `ComparisonUnit` não terão seu comportamento alterado.

## Testes e validação

Os testes verificarão:

- extração de organizações distintas, incluindo duplicatas e entradas inválidas;
- ocultação do bloco de comparativos com uma organização e renderização com duas;
- título curto com uma organização e título atual com múltiplas;
- sincronização do provider sem nova chamada de rede;
- `AreaChart` sem legenda inferior no modo de uma organização;
- `LineChart` com legenda no modo de múltiplas organizações;
- manutenção do nome da organização no tooltip por meio da configuração da série;
- estado vazio quando não existir série utilizável.

A validação executará testes focados, ESLint nos arquivos alterados e `npm test`. `npm run build` não será executado, conforme solicitado.
