# Sincronização unificada de Linx e investimento de mídia

**Data:** 2026-08-16  
**Status:** aprovado para planejamento  
**Escopo inicial:** mês atual

## Contexto

O ROAS geral já é calculado como faturamento atribuído a origens Google ou Meta dividido pelo investimento total de mídia. Hoje, porém, as fontes chegam ao relatório de maneiras diferentes:

- as vendas são persistidas pela sincronização do Linx;
- o investimento Meta é informado manualmente em `MetaInvestment`;
- os investimentos Google Produtos e Google Serviços são consultados nas APIs do Google durante a montagem do relatório;
- o relatório público usa o investimento Meta como referência de período e é revalidado após o lançamento manual.

Essa diferença permite que faturamento e custos representem momentos distintos, além de tornar a atualização Meta dependente de operação manual.

O app Meta já está criado e a conta `act_306488710441939` foi validada como `JDInfo`, em BRL e no fuso `America/Sao_Paulo`. As duas contas Google já configuradas no projeto são `products` e `services`.

## Objetivos

1. Sincronizar Linx, Meta, Google Produtos e Google Serviços por um único acionamento.
2. Publicar o ROAS somente quando as quatro fontes concluírem para o mesmo corte civil.
3. Executar automaticamente todos os dias às 22 UTC e permitir o mesmo fluxo por botão manual.
4. Atualizar, após a publicação, o dashboard, as metas de marketing e `/marketing-report/current`.
5. Preservar o histórico Meta inserido manualmente e começar a automação somente no mês atual.
6. Manter como numerador apenas o faturamento Linx atribuído a origens que contenham Google ou Meta.

## Fora do escopo inicial

- Reprocessar automaticamente meses anteriores.
- Alterar as regras de atribuição de faturamento.
- Adicionar novas contas de anúncio ou detalhamento por campanha.
- Gerar o relatório público como arquivo estático.
- Remover os registros manuais Meta já existentes.

## Evidência sobre o cron atual

O mecanismo atual de Vercel Cron está funcionando. A tabela `LinxSyncRun` contém acionamentos `CRON` diários, com sucesso entre 12 e 15 de agosto de 2026. As execuções recentes duraram entre 8 e 14 segundos. Falhas anteriores também registraram acionamentos diários, portanto foram falhas de processamento do Linx, e não ausência do agendador.

O plano atual executa o cron com precisão por hora. O agendamento anterior de 20 UTC foi observado por volta de 20:50 UTC. O novo agendamento será:

```json
{
  "path": "/api/cron/sync",
  "schedule": "0 22 * * *"
}
```

Na prática, a execução pode começar entre 22:00 e 22:59 UTC, aproximadamente entre 19:00 e 19:59 em São Paulo.

## Arquitetura escolhida

### Orquestrador único

Um serviço de aplicação será a única entrada para a sincronização completa. Ele receberá:

- o gatilho, `CRON` ou `MANUAL`;
- o usuário solicitante, quando manual;
- a data de corte civil em `America/Sao_Paulo`;
- o prazo máximo da execução.

O serviço adquirirá uma trava persistida antes de iniciar. Uma segunda chamada concorrente retornará conflito sem iniciar novas consultas externas.

Depois da trava, dois ramos serão iniciados em paralelo:

1. sincronização incremental do Linx, reutilizando `runLinxSync` e seu comportamento atômico atual;
2. leitura do investimento de mídia, que consulta Meta, Google Produtos e Google Serviços em paralelo.

O corte de todas as consultas será o primeiro dia do mês atual até a data civil calculada no início da execução. A mudança de data durante a execução não altera o corte.

### Leitura de mídia

O cliente Meta consultará o Insights da conta no nível `account`, pedindo `spend` para `time_range` inclusivo. O ID será normalizado para aceitar a variável com ou sem o prefixo `act_`. A resposta deve corresponder à conta esperada, moeda BRL e período solicitado.

Os clientes Google reutilizarão a autenticação e os mapeamentos existentes:

- `products` para Google Centro/Produtos;
- `services` para Google Icaraí/Serviços.

Cada consulta usará `metrics.cost_micros` no mesmo intervalo inclusivo. Valores externos serão convertidos para uma representação decimal persistida sem usar ponto flutuante para armazenamento.

Os três resultados de mídia são uma unidade: somente serão aceitos juntos. Se uma conta falhar, nenhum conjunto parcial de investimento será publicado.

### Publicação do corte

Uma execução completa será publicada somente se:

- o Linx concluir com sucesso;
- a Meta retornar um investimento válido;
- Google Produtos retornar um investimento válido;
- Google Serviços retornar um investimento válido.

Quando as quatro condições forem satisfeitas, uma única transação criará o snapshot de investimento e marcará a execução como concluída. O snapshot terá:

- `periodStart`;
- `periodEnd` comum;
- investimento Meta;
- investimento Google Produtos;
- investimento Google Serviços;
- moeda;
- data/hora da sincronização;
- referência à execução que o publicou.

Os snapshots serão imutáveis e ordenados pela execução concluída. Repetir uma sincronização no mesmo dia poderá criar um snapshot mais recente; o consumidor sempre escolherá o último snapshot completo. Isso mantém histórico de auditoria sem impedir uma correção intradiária das plataformas.

Se uma fonte falhar, a execução será registrada como falha e o último snapshot completo continuará ativo. Uma sincronização Linx que já tenha sido concluída não será desfeita, mas o relatório continuará limitado ao `periodEnd` do último snapshot completo. Assim, vendas mais novas não serão combinadas com custos antigos.

## Modelo de dados

Serão adicionados dois conceitos persistidos:

### `DataSyncRun`

Registro de coordenação e auditoria da execução completa:

- identificador;
- organização Linx ativa;
- gatilho `CRON` ou `MANUAL`;
- usuário solicitante opcional;
- status `RUNNING`, `SUCCESS` ou `FAILED`;
- data de corte;
- início, término e expiração da trava;
- referência opcional ao `LinxSyncRun`;
- resultado sanitizado por fonte em JSON;
- mensagem de erro geral sanitizada.

O resultado por fonte identificará `LINX`, `META`, `GOOGLE_PRODUCTS` e `GOOGLE_SERVICES`, com status, duração e resumo seguro. Tokens e respostas brutas das APIs não serão armazenados.

### `MarketingInvestmentSnapshot`

Registro imutável do conjunto de custos publicado:

- referência única a `DataSyncRun` bem-sucedido;
- início e fim do período;
- os três valores de investimento em decimal;
- moeda BRL;
- data/hora de criação.

Índices por período permitirão selecionar rapidamente o snapshot mais recente do mês.

`MetaInvestment` continuará existindo para preservar o histórico manual. Para o mês atual, um snapshot automático terá prioridade. Para meses antigos ainda sem snapshot, o comportamento legado continuará disponível.

## Rotas e interface

### Rotas

- `POST /api/sync`: exige usuário ativo e inicia o fluxo completo manual.
- `GET /api/sync/status`: exige usuário ativo e retorna a última execução completa e eventual execução em andamento.
- `GET /api/cron/sync`: exige `Authorization: Bearer <CRON_SECRET>` e inicia o mesmo fluxo com gatilho `CRON`.

A rota antiga do cron Linx deixa de ser referenciada por `vercel.json`. A implementação Linx permanece reutilizável e não será duplicada.

### Controle manual

O controle atual será renomeado de “Sincronizar Linx” para “Sincronizar dados”. Ele exibirá a última sincronização completa e bloqueará novos cliques enquanto houver execução ativa.

Ao terminar, a resposta mostrará um resumo das quatro fontes. Falhas de configuração, concorrência ou fonte externa terão mensagens compreensíveis, sem dados sensíveis.

### Relatório e ROAS

`getMarketingReportAggregate` deixará de consultar Google Ads durante a abertura do relatório corrente. Ele lerá o snapshot completo mais recente e calculará:

```text
investimento total = Meta + Google Produtos + Google Serviços
faturamento total = itens Linx atribuídos a Google ou Meta até periodEnd
ROAS geral = faturamento total / investimento total
```

Depois de publicar um novo corte, o orquestrador invalidará, no mínimo:

- a tag `goals-current`;
- a tag de custos atuais de marketing;
- `/dashboard`;
- `/dashboard/goals-marketing`;
- `/dashboard/meta-investments`;
- `/marketing-report/current`.

O relatório público já é dinâmico, mas a revalidação continuará explícita para manter todos os consumidores alinhados. Ao abrir “Ver Relatório Público” depois da sincronização, a página lerá o snapshot recém-publicado e não dependerá da disponibilidade imediata de Meta ou Google.

## Falhas e observabilidade

- Erros externos serão classificados por fonte e convertidos em mensagens seguras.
- Respostas Meta inválidas, moeda divergente, token sem permissão e limites de API falharão o ramo de mídia.
- Falhas de uma conta Google serão distinguidas de falhas da outra conta.
- Uma execução abandonada poderá ser substituída depois que a sua trava expirar.
- Logs estruturados conterão ID da execução, fonte, estágio, duração e resultado, nunca tokens ou URLs com credenciais.
- O cron retornará status não `2xx` quando o corte completo não for publicado, tornando a falha visível na Vercel.
- A execução manual retornará conflito para uma sincronização já em andamento e manterá o estado atual do botão.

## Segurança e configuração

Variáveis necessárias:

```dotenv
META_AD_ACCOUNT_ID=
META_ACCESS_TOKEN=
```

Essas variáveis devem existir localmente e no ambiente Production da Vercel. O valor do token não será versionado, enviado ao cliente, armazenado no banco ou incluído em logs.

Como o token atual foi compartilhado em conversa, ele deverá ser rotacionado e substituído nos ambientes antes da liberação final.

As credenciais Google existentes e `CRON_SECRET` continuarão sendo reutilizadas.

## Estratégia de testes

O desenvolvimento seguirá testes primeiro.

### Unidade

- cálculo do período civil de São Paulo;
- normalização do ID Meta;
- construção da requisição Insights com o intervalo correto;
- conversão e validação do `spend` Meta;
- consulta e conversão de `cost_micros` das duas contas Google;
- soma dos investimentos e cálculo do ROAS;
- prioridade do snapshot automático sobre o registro manual do mês atual;
- permanência do fallback legado para meses sem snapshot;
- sanitização de erros e logs.

### Orquestração e rotas

- execução das fontes em paralelo com um corte imutável;
- publicação somente quando as quatro fontes tiverem sucesso;
- manutenção do snapshot anterior em cada combinação de falha parcial;
- bloqueio de execuções concorrentes e recuperação de trava expirada;
- autenticação do usuário e do cron;
- retorno de erro não `2xx` quando o cron não publicar;
- invalidação de todas as tags e páginas somente depois da publicação;
- atualização do status e do controle manual.

### Persistência

- contrato da migração Prisma;
- criação atômica de snapshot e conclusão da execução;
- seleção determinística do snapshot completo mais recente;
- consulta de faturamento limitada ao `periodEnd` publicado.

### Verificação de integração

- execução manual no mês atual contra as três contas reais;
- comparação dos totais com as interfaces Meta e Google para o mesmo intervalo;
- confirmação do novo snapshot no banco;
- confirmação do ROAS no dashboard e no relatório público;
- confirmação da execução automática seguinte após 22 UTC.

## Implantação

1. Aplicar a migração de banco.
2. Configurar `META_AD_ACCOUNT_ID` e um token rotacionado na Vercel Production.
3. Publicar a aplicação com o novo cron às 22 UTC.
4. Executar uma sincronização manual do mês atual.
5. Comparar os três investimentos com as plataformas.
6. Verificar dashboard, metas e relatório público.
7. Acompanhar a primeira execução automática e seus registros por fonte.

## Critérios de aceite

- Um único clique ou cron inicia as quatro fontes.
- Meta e as duas contas Google usam exatamente o mesmo início e fim de período.
- O relatório nunca combina um custo parcial com faturamento de um corte posterior.
- Uma falha mantém visível o último relatório completo.
- O mês atual é preenchido automaticamente sem apagar meses manuais anteriores.
- “Ver Relatório Público” mostra o novo corte após uma sincronização bem-sucedida.
- O cron executa diariamente na hora de 22 UTC e deixa evidência persistida do resultado.
- Nenhuma credencial aparece no repositório, no navegador, no banco ou nos logs.
