# Responsividade mobile dos gráficos e truncamento de textos

## Objetivo

Padronizar a experiência mobile de todos os gráficos da aplicação a partir de
320 px, sem alterar a apresentação desktop, e remover elipses inseridas
manualmente nos textos. Restaurar também a identidade visual do canal Balcão
nos gráficos por origem.

## Escopo

- Todos os componentes que usam `ChartContainer` ou `ResponsiveContainer` nas
  áreas Dashboard, Comercial, Marketing e Resultado de Metas.
- Os três gráficos por origem do dashboard Comercial: faturamento, quantidade
  de vendas e ticket médio.
- Textos atualmente reduzidos por `slice(...) + "..."`, incluindo tabelas e
  rótulos de eixos.
- A infraestrutura compartilhada em `src/components/ui/chart.tsx` necessária
  para aplicar as regras de forma consistente.

Não fazem parte do escopo alterações na informação exibida, nas consultas,
nos cálculos ou no layout desktop.

## Decisões visuais

### Cor do Balcão

O canal Balcão usa `#242424` nos três gráficos por origem. As demais cores
permanecem inalteradas.

### Largura mínima

A interface deve funcionar a partir de 320 px sem overflow horizontal da
página. Cards e containers de gráfico recebem `min-width: 0` e respeitam a
largura disponível.

### Gráficos por tipo

- Barras categóricas: no mobile, usam orientação horizontal e altura baseada
  na quantidade de categorias, com espaço mínimo de 44 px por item. A coluna
  de rótulos fica entre 92 e 120 px, conforme o componente, e os valores usam
  formatação compacta quando necessário.
- Séries temporais: usam margens laterais reduzidas, altura entre 288 e 384 px
  e quantidade de ticks adequada à largura. Os eixos não devem desaparecer se
  ainda houver espaço para um conjunto reduzido de datas.
- Pizza, rosca e radial: respeitam a largura do card, limitam o diâmetro no
  mobile e mantêm conteúdo central e rótulos dentro da área útil.
- Legendas: podem quebrar em mais de uma linha, permanecem centralizadas e não
  provocam overflow. Uma única série continua sem legenda quando essa regra já
  existir no componente.

Os breakpoints desktop existentes continuam determinando a apresentação
atual. A mudança mobile não troca tipos de gráfico fora das regras que o
componente já possui, exceto a orientação de barras categóricas.

## Truncamento de textos

O conteúdo original nunca será modificado para incluir `...`.

- Tabelas: recebem o valor completo em um elemento com `min-w-0`,
  `overflow-hidden`, `text-ellipsis` e `whitespace-nowrap`. A largura máxima é
  responsiva e o atributo `title` mantém acesso ao texto completo.
- Eixos Recharts: usam um componente compartilhado de tick com `foreignObject`
  e conteúdo HTML de uma linha. O navegador aplica elipse somente quando o
  rótulo exceder o espaço disponível. O valor completo fica no `title`.
- Rótulos curtos permanecem completos e não recebem elipse artificial.
- Formatadores numéricos e de data não são tratados como truncamento textual e
  permanecem inalterados, salvo compactação necessária para caber no mobile.

## Arquitetura

### Base compartilhada

`ChartContainer` será ajustado para ser encolhível dentro de grids e cards,
sem criar largura mínima implícita. Um novo tick responsivo compartilhado será
responsável por rótulos categóricos que hoje usam cortes por quantidade de
caracteres.

### Ajustes locais

Cada gráfico continuará responsável por:

- escolher altura conforme sua densidade de dados;
- definir margens adequadas ao seu tipo;
- selecionar orientação e largura do eixo categórico;
- definir a quantidade de ticks temporais;
- posicionar `LabelList`, tooltip e legenda.

Essa divisão mantém uma regra consistente de contenção e truncamento sem
forçar todos os gráficos a um único tamanho.

## Comportamento de dados

Nenhuma consulta ou estrutura de resposta será alterada. O gráfico recebe os
mesmos dados; somente dimensões, posicionamento e renderização dos rótulos são
adaptados à largura disponível.

## Testes

- Garantir `#242424` para Balcão nos três gráficos por origem.
- Verificar que o container compartilhado permite encolhimento e impede
  overflow do conteúdo.
- Verificar ticks curtos sem elipse e ticks longos com as classes de
  truncamento, mantendo o texto integral e `title`.
- Verificar tabelas com nomes curtos completos e nomes longos sem alteração do
  conteúdo, delegando a elipse ao CSS.
- Verificar, por famílias de gráficos, as propriedades mobile relevantes:
  orientação, margens, altura, largura do eixo e comportamento da legenda.
- Executar testes focados, ESLint e a suíte completa. Não executar build.

## Critérios de aceitação

1. Balcão aparece em `#242424` nos três gráficos por origem.
2. Nenhum gráfico da aplicação causa overflow horizontal em viewport de
   320 px.
3. Rótulos, valores e legendas permanecem legíveis no mobile.
4. Textos não contêm elipses adicionadas manualmente.
5. A elipse visual aparece somente quando o texto ultrapassa a largura de uma
   linha.
6. O conteúdo completo continua disponível por `title` onde houver
   truncamento.
7. A apresentação desktop permanece funcionalmente e visualmente equivalente.
