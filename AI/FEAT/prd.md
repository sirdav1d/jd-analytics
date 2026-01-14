# PRD - Relatório de Marketing Público (META + Google + Faturamento)

## Contexto
Hoje já registramos investimentos de META com data final e histórico. A nova funcionalidade deve permitir gerar e compartilhar um relatório público, congelado na última atualização do investimento em META, com os custos de canais e o faturamento total na mesma data de referência.

Exemplo de saída esperada:

RELATÓRIO MARKETING 01 A 29 DEZ/25

INVESTIMENTOS

  META: R$ 1.551,32
  GOOGLE CENTRO/PRODUTOS: R$ 8.373,71
  GOOGLE ICARAÍ/SERVIÇOS: R$ 1.102,85
  CUSTO TOTAL: R$ 11.027,88

FATURAMENTO TOTAL: R$ 155.144,01

ROAS GERAL: 14,07

## Objetivos
- Gerar um relatório público com valores consolidados e congelados na data de referência.
- Garantir que o período do relatório esteja alinhado ao último investimento de META.
- Disponibilizar um link público de exportação (formato texto) e um card animado com os dados atuais.

## Não objetivos
- Não incluir dados pessoais nem detalhamento de pedidos/clientes.
- Não permitir edição do relatório pelo link público.
- Não criar histórico de versões do relatório (apenas o estado atual).

## Usuários e casos de uso
- Gestor de marketing: precisa compartilhar rapidamente o resultado consolidado do mês.
- Diretoria: acessa o link público para leitura sem autenticação.

## Requisitos funcionais
1. Identificar o registro de referência do investimento META.
   - Critério: maior `periodEnd`; em empate, maior `lastSyncAt`.
2. Congelar o período do relatório com base no registro de referência.
   - Data inicial: `periodStart`.
   - Data final: `periodEnd`.
3. Congelar custos e faturamento na mesma janela de datas.
   - Investimentos e faturamento devem respeitar exatamente o período definido.
4. Gerar o texto no formato do exemplo (layout e rótulos idênticos).
   - Título: "RELATÓRIO MARKETING DD A DD MMM/AA".
   - Mês abreviado em PT-BR (JAN, FEV, MAR, ABR, MAI, JUN, JUL, AGO, SET, OUT, NOV, DEZ).
5. Expor um link público que retorna o texto do relatório.
6. Exibir um card animado (no link público) com os dados atuais do relatório.
7. Atualizar o card automaticamente quando houver novo upsert de META.

## Regras de negócio e cálculos
- **Investimento META**: `metaInvestment.totalInvestment` do registro de referência.
- **Investimento Google Centro/Produtos**: soma dos custos no período a partir das APIs atuais, porém congelando o cálculo na mesma data final do investimento META.
- **Investimento Google Icaraí/Serviços**: soma dos custos no período a partir das APIs atuais, porém congelando o cálculo na mesma data final do investimento META.
- **Custo total**: `META + GOOGLE CENTRO/PRODUTOS + GOOGLE ICARAÍ/SERVIÇOS`.
- **Faturamento total**: soma de todos os faturamentos de marketing (Google + META) no período definido.
- **ROAS geral**: `Faturamento total / (META + GOOGLE CENTRO/PRODUTOS + GOOGLE ICARAÍ/SERVIÇOS)`.
  - Formatar com 2 casas decimais.

## UX/UI
- Card animado com:
  - Título do relatório (ex.: "RELATÓRIO MARKETING 01 A 29 DEZ/25") como único título visível.
  - Totais de investimentos (incluindo custo total), faturamento e ROAS.
  - CTAs para "Copiar texto" e "Copiar link" (no link público).
- Animação leve (fade + slide) e skeleton enquanto carrega.

## Link público e exportação
- Endpoint público sugerido: `GET /api/public/marketing-report/:id`.
- Resposta padrão: `text/plain; charset=utf-8` com o texto do relatório.
- Opção de download (backlog): `?download=1` retorna um PNG (`Content-Type: image/png`) com `Content-Disposition: attachment; filename="marketing-report.png"`.

## Dados e fontes (a confirmar)
- META: tabela `MetaInvestment` (Prisma).
- Google Centro/Produtos: APIs atuais de custos (cálculo deve ser congelado na mesma data final do investimento META).
- Google Icaraí/Serviços: APIs atuais de custos (cálculo deve ser congelado na mesma data final do investimento META).
- Faturamento total: somatório de faturamentos de marketing (Google + META) no período.

## Arquitetura (proposta)
- Serviço único de agregação que:
  - Busca o último investimento META.
  - Resolve o período e calcula totais.
  - Retorna o objeto consolidado e o texto formatado.
- Cache por tag (ex.: `marketing-report`) e revalidação após upsert de META.

## Segurança e privacidade
- Endpoint público deve expor apenas totais agregados.
- Sem dados pessoais ou listagens de pedidos.

## Observabilidade
- Logar total de acessos ao endpoint público.
- Logar tempo de resposta e falhas por período.

## Performance
- Resposta cacheada por tag + revalidação quando META for atualizado.
- Evitar queries não indexadas no período.

## Critérios de aceite
- Link público retorna o relatório exatamente no formato definido.
- O período do relatório sempre corresponde ao último registro META.
- Custos e faturamento respeitam a janela de datas congelada.
- Card animado no link público exibe os mesmos números do texto.
- Atualização de META reflete no card e no link público sem recarregar manualmente.

## Riscos e dependências
- Definição das fontes de custos do Google e do faturamento total.
- Consistência de timezone entre dados e período reportado.

## Decisões confirmadas
1. Fonte de custos Google Centro/Produtos e Google Icaraí/Serviços: APIs atuais, com data final congelada na mesma data do investimento META.
2. Faturamento total: somatório de todos os faturamentos de marketing (Google + META) no período.
3. Link público: URL estável no formato `/:id` do relatório (sem token).
4. Card animado: deve aparecer no link público, contendo investimentos, faturamento e ROAS.
