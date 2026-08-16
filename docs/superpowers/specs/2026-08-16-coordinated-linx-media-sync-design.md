# Sincronização coordenada de Linx e mídia sem novas tabelas

**Data:** 2026-08-16

**Status:** aprovado e revisado

**Fonte de verdade:** esta especificação substitui o desenho anterior baseado em snapshots.

## Objetivo

Atualizar o faturamento Linx e o investimento Meta do mês atual em uma única operação manual ou agendada. As duas contas Google Ads também são consultadas nessa operação. O dashboard e o relatório público só são revalidados quando as quatro fontes concluem com sucesso.

## Restrições

- Não adicionar tabelas, modelos Prisma ou migrações de banco.
- Manter `MetaInvestment` como o único registro persistido de investimento Meta mensal.
- Manter os custos Google Ads consultados ao vivo pelo agregador existente do relatório.
- Automatizar inicialmente apenas o mês civil atual de São Paulo.
- Preservar `LinxSyncRun`, o formulário manual do Meta e todo o histórico existente.
- Manter como faturamento atribuído somente vendas Linx cuja origem contenha Google ou Meta.
- Agendar o cron da Vercel em `0 22 * * *`.
- Nunca expor tokens, respostas brutas dos provedores ou corpos de erro externos.

## Fluxo

`POST /api/sync` e `GET /api/cron/sync` chamam o mesmo coordenador no servidor. O coordenador calcula uma única vez o corte civil em `America/Sao_Paulo`: do primeiro dia do mês atual até o dia atual, inclusive.

O coordenador inicia estas operações em paralelo:

1. Sincronização incremental existente do Linx.
2. Leitura do Insights do Meta no nível da conta para o intervalo comum.
3. Leitura do custo Google Ads Produtos para o mesmo intervalo.
4. Leitura do custo Google Ads Serviços para o mesmo intervalo.

As leituras Google comprovam, na mesma execução, que as duas contas responderam para o corte solicitado. Os valores não são persistidos. O relatório continua obtendo os dois custos Google ao vivo, como faz hoje.

Se todas as operações concluírem, o coordenador faz `upsert` na linha existente de `MetaInvestment` do mês atual, atualizando `totalInvestment`, `periodEnd` e `lastSyncAt`. Somente depois invalida o dashboard, as metas de marketing, a tela de investimentos Meta e `/marketing-report/current`. O navegador é atualizado após essa publicação.

Se qualquer operação falhar, o coordenador não altera `MetaInvestment` e não invalida o relatório. O Linx pode já ter concluído sua importação incremental independente; esse resultado permanece registrado pelos mecanismos atuais. O relatório mantém o último corte Meta publicado até uma futura execução completa.

## Consistência possível sem snapshot

O fluxo garante que Meta só é atualizado depois de Linx, Meta e as duas contas Google responderem para o mesmo intervalo. Como o usuário decidiu não persistir um agregado, os valores Google exibidos pelo relatório são consultados novamente após a revalidação. Portanto, o sistema não promete uma fotografia atômica dos quatro valores: uma correção posterior feita pelo Google ou uma indisponibilidade entre as duas requisições pode alterar ou impedir a renderização do relatório. Essa é a troca explícita para não criar tabelas novas.

Chamadas concorrentes são contidas pela trava já existente em `LinxSyncRun`. Uma segunda chamada que encontrar o Linx em execução não publica o Meta. As consultas de mídia que já tenham começado podem terminar, mas seus resultados são descartados.

## Interfaces

- `POST /api/sync`: execução manual autenticada; retorna o corte e resultados seguros por fonte.
- `GET /api/sync/status`: reutiliza `LinxSyncRun` para informar se o Linx está em execução e a data do último Linx concluído; também retorna `MetaInvestment.lastSyncAt` do mês atual como a última atualização Meta. Como o formulário manual permanece disponível, essa data não é apresentada como prova de uma execução coordenada.
- `GET /api/cron/sync`: protegido por `CRON_SECRET`; executa o mesmo coordenador.
- Sidebar e cabeçalho: `DataSyncControl` substitui o controle exclusivo do Linx e atualiza a página somente após sucesso completo.
- Formulário manual Meta: permanece como fallback administrativo e conserva o comportamento atual de atualização/revalidação independente.

## Tratamento de erros

Cada falha de provedor é convertida em mensagem segura e específica da fonte. Erros brutos e credenciais não são armazenados, registrados ou enviados ao navegador. Uma execução parcial retorna resposta sem sucesso e mantém intactos o Meta persistido e o cache do relatório público.

## Testes

Testes unitários cobrem validação do ID e da resposta Meta, conversão exata dos micros do Google, início paralelo das quatro fontes, persistência em `MetaInvestment` somente após sucesso completo e falhas que comprovam ausência de atualização e revalidação. Testes de rota e componente cobrem autorização, proteção do cron, agendamento e estado compartilhado do controle. Os testes existentes do relatório continuam protegendo os custos Google ao vivo e o faturamento Linx atribuído.

Não é necessária uma `TEST_DATABASE_URL`, pois não haverá schema, migração, trava ou transação nova. A persistência usa o `upsert` já exercitado pelo projeto; o coordenador será testado por dependências injetadas, sem escrever no banco de produção.

## Entrada em produção

Executar testes unitários, lint, validação Prisma e build local. Verificar o Meta de forma somente leitura sem imprimir o token. Antes de qualquer implantação em produção, rotacionar o token divulgado na conversa e obter autorização explícita para configurar o substituto na Vercel.
