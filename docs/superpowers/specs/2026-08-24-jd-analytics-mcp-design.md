# MCP do JD Analytics

Data: 24 de agosto de 2026

Status: desenho aprovado

## 1. Contexto

O JD Analytics já concentra dados comerciais, metas, investimentos de marketing, Google Analytics e Google Ads. O objetivo deste projeto é disponibilizar esses dados por meio de um servidor MCP remoto, seguro e somente para leitura, compatível com clientes como ChatGPT, Claude, Codex, Cursor e VS Code.

O MCP deve permitir perguntas analíticas completas, incluindo faturamento, comparações entre períodos, rankings, curva ABC, anomalias, pedidos, metas, ROAS e desempenho de marketing.

## 2. Objetivos

1. Expor ferramentas analíticas controladas por meio do protocolo MCP.
2. Reutilizar o cadastro e as permissões atuais do JD Analytics.
3. Permitir autenticação individual pelo navegador.
4. Aplicar permissões diferentes para ADMIN, MANAGER e SELLER.
5. Consultar Google Analytics e Google Ads por meio de uma conta de serviço.
6. Manter todas as ferramentas de negócio somente para leitura.
7. Registrar auditoria sem armazenar dados pessoais retornados pelas consultas.
8. Funcionar com clientes MCP genéricos.

## 3. Fora do escopo

1. Sincronização manual de dados.
2. Importação de planilhas.
3. Criação, alteração ou exclusão de pedidos.
4. Alteração de usuários, metas ou configurações.
5. Execução de SQL fornecido pelo cliente.
6. Acesso anônimo.
7. Autenticação individual dos usuários do MCP no Google.
8. Testes unitários.
9. Uma suíte E2E separada.

## 4. Estado atual relevante

O projeto utiliza Next.js 16, Node.js 24, Prisma 6, PostgreSQL no Supabase, NextAuth 4, sessões JWT, Zod 3 e Vitest.

A autenticação atual usa email e senha com bcrypt. Os usuários possuem os perfis ADMIN, MANAGER e SELLER, além do campo isActive.

Os pedidos estão relacionados ao vendedor por Pedido.userId. O modelo também possui clientes, itens, produtos, formas de pagamento, origens, metas comerciais, metas de ROAS e investimentos da Meta.

A integração atual com o Google armazena access token, refresh token, scopes e expiração no modelo Organization. Esses tokens são usados para Google Analytics e Google Ads.

O repositório não possui cliente Supabase no frontend. O acesso ao banco ocorre por conexão PostgreSQL direta usando Prisma.

O servidor MCP ainda não existe.

## 5. Arquitetura

O MCP será incorporado ao aplicativo Next.js atual e publicado no mesmo domínio da aplicação.

Fluxo principal:

    Cliente MCP
        ↓
    OAuth 2.1 com Descope
        ↓
    Login do JD Analytics no navegador
        ↓
    Token de acesso com escopo mcp:read
        ↓
    /api/mcp
        ↓
    Autorização pelo usuário atual do banco
        ↓
    Serviços analíticos internos
        ↓
    PostgreSQL, Google Analytics e Google Ads

O endpoint será implementado em /api/mcp com Streamable HTTP e processamento sem estado entre requisições.

A implementação usará mcp-handler v2 e a versão v2 do SDK oficial do MCP. Como essa versão requer Zod 4, a atualização de Zod 3 para Zod 4 fará parte da implementação e exigirá verificação das validações existentes.

O servidor seguirá a especificação MCP vigente em 2026, incluindo descoberta de metadados OAuth, validação de audience e compatibilidade oferecida pela biblioteca para clientes que ainda utilizam versões anteriores do protocolo.

## 6. Componentes

### 6.1 Camada de transporte MCP

Responsável pelo endpoint HTTP, inicialização do servidor, registro das ferramentas e serialização das respostas.

### 6.2 Camada de autenticação

Responsável por validar assinatura, emissor, audience, expiração e escopo do token OAuth.

### 6.3 Contexto de autorização

Responsável por resolver o usuário do JD Analytics e consultar id, role e isActive no banco em cada chamada.

O perfil não será considerado válido apenas por estar presente no token. A fonte de verdade será sempre o banco atual.

### 6.4 Serviços analíticos

Responsáveis pelos cálculos comerciais, metas, curva ABC, anomalias, rankings e marketing.

As rotas existentes deverão ser convertidas em adaptadores finos sobre esses serviços. O MCP chamará os serviços diretamente e não fará requisições HTTP para o próprio aplicativo.

### 6.5 Adaptadores de dados

Haverá adaptadores separados para PostgreSQL, Google Analytics e Google Ads. Isso permite testar o fluxo por integração sem depender das APIs reais do Google.

### 6.6 Auditoria

Um serviço central registrará cada chamada do MCP sem armazenar o conteúdo completo retornado ao cliente.

## 7. Autenticação do MCP

O Descope atuará como servidor de autorização OAuth 2.1. A identidade continuará sendo originada no cadastro atual do JD Analytics.

O fluxo será:

1. O cliente MCP inicia a autorização.
2. O navegador abre a tela de autenticação.
3. O usuário informa o mesmo email e senha usados no JD Analytics.
4. O JD Analytics valida as credenciais e o estado ativo do usuário.
5. O Descope emite o código de autorização.
6. O cliente troca o código por um token de acesso.
7. O servidor MCP valida o token em todas as chamadas.
8. O servidor consulta novamente role e isActive antes de executar a ferramenta.

O identificador subject do token será associado a um identificador estável do usuário, preferencialmente User.externalId. O email não será usado como única chave de autorização.

O escopo inicial será mcp:read. As diferenças de acesso serão controladas pelos perfis do JD Analytics.

O servidor publicará os metadados de recurso protegido e os metadados do servidor de autorização exigidos pelo protocolo. A identificação dinâmica de clientes seguirá CIMD quando suportada. O registro dinâmico legado permanecerá habilitado no Descope somente para compatibilidade com clientes que ainda dependam dele.

Usuários inativos receberão FORBIDDEN mesmo que ainda possuam um token dentro do prazo de validade.

## 8. Autenticação das APIs do Google

O servidor utilizará uma conta de serviço por ambiente. O usuário do MCP não precisará entrar com uma conta Google.

A conta de serviço deverá receber:

1. Permissão de leitura na propriedade do Google Analytics.
2. Acesso adequado às contas do Google Ads utilizadas pelo JD Analytics.
3. Apenas os privilégios necessários para relatórios.
4. Um developer token válido para chamadas da Google Ads API.
5. Os identificadores de conta, propriedade e gerente já utilizados pelo sistema.

As credenciais serão armazenadas exclusivamente como segredos do ambiente de execução. Nenhum arquivo JSON será versionado.

A migração seguirá esta ordem:

1. Configurar a conta de serviço em desenvolvimento.
2. Validar Google Analytics e todas as contas do Google Ads.
3. Configurar os segredos de produção.
4. Alterar os adaptadores para usar a conta de serviço.
5. Confirmar as consultas existentes de marketing.
6. Desativar o fluxo antigo de conexão manual.
7. Remover os tokens OAuth armazenados em Organization em uma migração posterior.

Os tokens atuais não serão removidos antes da validação completa da conta de serviço.

## 9. Matriz de autorização

| Recurso | ADMIN | MANAGER | SELLER |
| --- | --- | --- | --- |
| Resumo comercial geral | Permitido | Permitido | Apenas dados próprios |
| Séries históricas | Permitido | Permitido | Apenas dados próprios |
| Curva ABC geral | Permitido | Permitido | Apenas dados próprios |
| Anomalias gerais | Permitido | Permitido | Apenas dados próprios |
| Rankings | Permitido | Permitido | Apenas posição e dados próprios |
| Pedidos | Todos | Todos | Apenas pedidos próprios |
| Clientes | Todos os clientes relacionados a pedidos | Todos os clientes relacionados a pedidos | Apenas clientes dos próprios pedidos |
| Metas comerciais | Todas | Todas | Apenas metas próprias |
| Metas de ROAS | Permitido | Permitido | Bloqueado |
| Marketing consolidado | Permitido | Permitido | Bloqueado |
| Google Analytics | Permitido | Permitido | Bloqueado |
| Google Ads | Permitido | Permitido | Bloqueado |

Para SELLER, o filtro por User.id será injetado pelo servidor. Um sellerId fornecido pelo cliente não poderá ampliar o acesso.

## 10. Ferramentas MCP

| Ferramenta | Finalidade |
| --- | --- |
| jd_data_coverage | Informar datas mínima e máxima e quantidade de registros disponíveis |
| jd_sales_summary | Retornar faturamento, pedidos, ticket médio, itens e clientes |
| jd_sales_timeseries | Retornar evolução diária, semanal ou mensal |
| jd_sales_abc | Calcular curva ABC por data, cliente, vendedor, produto, marca ou setor |
| jd_sales_anomalies | Detectar valores fora do comportamento habitual |
| jd_sales_ranking | Retornar rankings comerciais |
| jd_list_orders | Listar pedidos com paginação |
| jd_get_order | Retornar um pedido completo |
| jd_sales_goals | Retornar metas comerciais e realizado |
| jd_roas_goals | Retornar metas e histórico de ROAS |
| jd_marketing_overview | Consolidar investimentos, faturamento atribuído e ROAS |
| jd_google_ads_performance | Retornar custos, anúncios, palavras chave e desempenho |
| jd_google_analytics_performance | Retornar sessões, usuários, conversão, receita, canais e tráfego |

## 11. Filtros e convenções

As ferramentas comerciais aceitarão, conforme aplicável:

1. startDate e endDate no formato YYYY-MM-DD.
2. sellerId para ADMIN e MANAGER.
3. origin.
4. weekday.
5. productId.
6. brand.
7. sector.
8. paymentMethodId.
9. groupBy.
10. granularity.
11. page e pageSize em listagens.

Regras globais:

1. O fuso horário será America/Sao_Paulo.
2. A moeda será BRL.
3. Pedidos cancelados serão excluídos do faturamento.
4. Valores monetários serão retornados como números.
5. Datas civis serão serializadas como YYYY-MM-DD.
6. Datas iniciais maiores que datas finais serão rejeitadas.
7. Filtros não permitidos pelo perfil serão rejeitados ou substituídos pelo escopo obrigatório do usuário.
8. Toda resposta terá dados estruturados e um resumo textual curto.

## 12. Curva ABC

A curva ABC seguirá este procedimento:

1. Agregar o faturamento pela dimensão selecionada.
2. Ordenar os grupos por faturamento decrescente.
3. Calcular a participação individual sobre o total.
4. Calcular o percentual acumulado.
5. Classificar como A até 80% acumulados.
6. Classificar como B acima de 80% até 95%.
7. Classificar como C acima de 95% até 100%.

Para analisar os sábados, a chamada usará weekday igual a SATURDAY e groupBy igual a DATE.

A resposta incluirá data, faturamento, posição, participação individual, percentual acumulado e classe.

Quando não houver faturamento no período, a ferramenta retornará uma coleção vazia e totais iguais a zero.

## 13. Anomalias

A detecção de anomalias utilizará o intervalo interquartil.

O cálculo será:

1. Calcular Q1.
2. Calcular Q3.
3. Calcular IQR como Q3 menos Q1.
4. Definir limite inferior como Q1 menos 1,5 vezes o IQR.
5. Definir limite superior como Q3 mais 1,5 vezes o IQR.
6. Marcar os valores fora desses limites.

A resposta incluirá mediana, Q1, Q3, IQR, limites e registros identificados.

Para os picos de sábado, a ferramenta filtrará SATURDAY e destacará os valores acima do limite superior.

## 14. Fluxo de uma chamada

1. Receber a requisição MCP.
2. Validar o token OAuth.
3. Resolver o usuário no banco.
4. Confirmar isActive.
5. Validar a entrada da ferramenta.
6. Construir o escopo obrigatório conforme o perfil.
7. Executar o serviço analítico.
8. Consultar PostgreSQL ou Google conforme necessário.
9. Normalizar a resposta.
10. Registrar a auditoria.
11. Retornar dados estruturados e resumo textual.

Nenhuma ferramenta aceitará SQL, nomes de tabelas ou fragmentos de consulta fornecidos pelo cliente.

## 15. Segurança do PostgreSQL e Supabase

Como o sistema usa Prisma por conexão direta e não possui cliente Supabase no frontend, a abordagem recomendada é desativar a Data API do Supabase após confirmar que não existe consumidor externo.

Se algum consumidor externo depender da Data API, ela permanecerá ativa somente após:

1. Habilitar RLS em todos os objetos expostos.
2. Revogar grants desnecessários de anon e authenticated.
3. Criar políticas específicas para os acessos realmente necessários.
4. Testar as políticas antes da publicação.

O MCP usará uma credencial PostgreSQL exclusiva. Essa credencial terá:

1. SELECT apenas nas tabelas e colunas necessárias.
2. Nenhum acesso ao campo User.password.
3. Nenhum acesso a PasswordResetToken.
4. Nenhum acesso a PasswordResetRateLimit.
5. Nenhum acesso aos antigos tokens Google.
6. INSERT apenas na tabela de auditoria.
7. Nenhuma permissão de UPDATE ou DELETE em dados de negócio.

O serviço de consultas deverá selecionar campos explicitamente. Consultas genéricas que incluam colunas sensíveis não serão permitidas.

## 16. Auditoria

Será criada uma tabela McpAuditLog com os seguintes campos conceituais:

1. id.
2. occurredAt.
3. requestId.
4. userId.
5. clientId.
6. toolName.
7. normalizedParameters.
8. outcome.
9. errorCode.
10. durationMs.
11. rowCount.

A auditoria não armazenará:

1. Tokens.
2. Credenciais.
3. Senhas.
4. Nomes de clientes.
5. Conteúdo completo de pedidos.
6. Respostas integrais das ferramentas.

Filtros sensíveis serão reduzidos, mascarados ou representados por hash quando necessário.

## 17. Limites operacionais

Cada usuário terá os seguintes limites:

1. 60 chamadas por minuto.
2. Máximo de 5 consultas simultâneas.
3. Até 100 pedidos por página.
4. Resposta máxima de 1 MB.
5. Timeout de 15 segundos para PostgreSQL.
6. Timeout de 20 segundos para APIs do Google.
7. Até 24 meses por consulta remota ao Google.

As consultas agregadas do PostgreSQL poderão analisar todo o histórico disponível.

Os limites serão globais entre as instâncias da aplicação e persistidos no PostgreSQL, sem adicionar outro fornecedor de infraestrutura:

1. McpRateLimitBucket armazenará uma chave do usuário em formato hash, início da janela e contador. O incremento será atômico.
2. McpRequestLease registrará as consultas em andamento com expiração. Registros expirados serão ignorados e removidos.
3. A credencial do MCP terá somente as permissões necessárias sobre essas tabelas operacionais.
4. As tabelas de limite não armazenarão email, nome ou parâmetros da consulta.

Quando uma resposta ultrapassar o limite, o servidor exigirá paginação ou um intervalo menor.

## 18. Tratamento de erros

O servidor usará os seguintes códigos:

| Código | Situação |
| --- | --- |
| UNAUTHENTICATED | Token ausente, inválido ou expirado |
| FORBIDDEN | Perfil sem permissão ou usuário inativo |
| INVALID_ARGUMENT | Entrada ou intervalo inválido |
| RATE_LIMITED | Limite de chamadas ou concorrência excedido |
| QUERY_TIMEOUT | Consulta excedeu o tempo permitido |
| UPSTREAM_UNAVAILABLE | Google Analytics ou Google Ads indisponível |
| INTERNAL_ERROR | Falha interna não exposta ao cliente |

As respostas de erro incluirão código, mensagem segura e requestId.

Não serão retornados SQL, stack trace, configuração interna, tokens, credenciais ou mensagens brutas dos provedores.

Uma indisponibilidade do Google não bloqueará as ferramentas que consultam apenas o PostgreSQL.

## 19. Testes de integração

A implementação terá somente testes de integração, organizados nos quatro grupos aprovados.

### 19.1 Autenticação e permissões por perfil

Validar tokens aceitos e rejeitados, usuário ativo, perfil ADMIN, perfil MANAGER, perfil SELLER e aplicação do escopo obrigatório de cada perfil.

### 19.2 Consultas comerciais, metas e marketing

Executar as ferramentas contra um PostgreSQL de teste com dados controlados. Os adaptadores do Google serão substituídos por implementações de teste determinísticas.

Este grupo cobrirá os resultados das consultas comerciais, metas, curva ABC, anomalias, pedidos, marketing, Google Analytics e Google Ads.

### 19.3 Tratamento padronizado de erros

Validar os códigos de erro, mensagens seguras, requestId e ausência de informações internas nas respostas.

### 19.4 Contrato das ferramentas MCP

Validar os esquemas de entrada, os dados estruturados de saída, os resumos textuais e a compatibilidade do endpoint com o protocolo MCP adotado.

Não haverá testes unitários nem uma suíte E2E separada.

## 20. Publicação

A publicação seguirá esta ordem:

1. Configurar Descope e o fluxo OAuth em desenvolvimento.
2. Configurar a conta de serviço Google em desenvolvimento.
3. Criar a camada de autorização e os adaptadores.
4. Implementar as ferramentas.
5. Criar a auditoria e os limites.
6. Executar os testes de integração aprovados.
7. Verificar a exposição da Data API e as permissões do banco.
8. Configurar segredos de produção.
9. Publicar o endpoint MCP.
10. Validar o acesso com perfis ADMIN, MANAGER e SELLER.
11. Desativar o fluxo OAuth antigo do Google somente após a validação.
12. Remover os tokens antigos em uma migração posterior.

## 21. Critérios de aceite

O projeto estará pronto quando:

1. Um cliente MCP genérico conseguir descobrir e chamar as ferramentas.
2. O login ocorrer pelo navegador com a conta atual do JD Analytics.
3. Usuários inativos forem bloqueados.
4. ADMIN e MANAGER acessarem os dados completos permitidos.
5. SELLER receber apenas vendas, pedidos, clientes relacionados e metas próprias.
6. SELLER não acessar marketing, Google Analytics, Google Ads ou metas gerais de ROAS.
7. A curva ABC dos sábados retornar classificação e percentuais corretos.
8. A ferramenta de anomalias identificar picos pelo intervalo interquartil.
9. Pedidos cancelados não compuserem o faturamento.
10. As APIs do Google funcionarem por conta de serviço.
11. Nenhum token ou dado pessoal completo aparecer na auditoria.
12. Os limites e erros padronizados funcionarem.
13. Os quatro grupos de testes de integração passarem.
14. A exposição do Supabase estiver protegida ou desativada.

## 22. Referências

1. MCP Authorization: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
2. mcp-handler: https://github.com/vercel/mcp-handler
3. Descope BYOA: https://docs.descope.com/mcp/bring-your-own-auth
4. Google Analytics Data API: https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart
5. Google Ads OAuth: https://developers.google.com/google-ads/api/docs/oauth/overview
6. Google Ads primeira chamada: https://developers.google.com/google-ads/api/docs/get-started/make-first-call
7. Supabase, segurança da Data API: https://supabase.com/docs/guides/api/securing-your-api
8. Supabase, RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
