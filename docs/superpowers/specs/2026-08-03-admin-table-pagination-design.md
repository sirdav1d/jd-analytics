# Paginação das listas administrativas

## Objetivo

Padronizar em cinco itens por página as listas administrativas, mantendo a possibilidade de selecionar quantidades maiores e usando os componentes visuais existentes em `src/components/ui/pagination.tsx`.

## Escopo

A paginação será aplicada às seguintes listas:

- histórico de metas de marketing: cinco competências por página;
- histórico de metas comerciais: cinco competências por página, sem uma segunda paginação para os vendedores dentro de cada competência;
- histórico de investimentos Meta: cinco investimentos por página;
- gestão de usuários: alterar o tamanho inicial de dez para cinco e preservar a seleção de quantidade;
- metas comerciais atuais: alterar o tamanho inicial de dez para cinco e exibir controles para acessar as demais páginas.

A paginação operacional por cursor da integração Linx e consultas que representam rankings “Top 5” não fazem parte deste escopo.

## Arquitetura

Será criado um controlador visual reutilizável sobre os primitives de `src/components/ui/pagination.tsx`. Ele receberá a página atual, a quantidade total de páginas, o tamanho da página e callbacks de navegação. O componente exibirá:

- páginas numeradas, com reticências quando necessário;
- ações de página anterior e próxima;
- seletor com 5, 10, 20, 30, 40 e 50 itens;
- textos e rótulos acessíveis em português;
- estados desabilitados nas extremidades.

As listas simples usarão um pequeno hook reutilizável para manter `pageIndex` e `pageSize` e derivar o recorte visível com `slice`. As tabelas baseadas em TanStack Table usarão o mesmo controlador visual conectado ao estado de paginação da tabela. Essa divisão evita migrar componentes existentes ou duplicar regras de interface.

## Comportamento

- O tamanho inicial será sempre cinco.
- Alterar o tamanho da página retornará à primeira página.
- Quando filtros ou novos dados reduzirem o número de páginas, a página atual será limitada à última página válida.
- Os controles não serão exibidos quando a lista vazia ou inteira couber em uma única página de cinco itens.
- No histórico comercial, trocar de página desmontará o mês expandido atual; não haverá accordion aberto pertencente a outra página.
- A ordem recebida do backend será preservada.

## Dados e desempenho

Todas as cinco listas já recebem conjuntos completos e pequenos no Client Component. A paginação continuará client-side e não criará novas chamadas ao banco, mudanças de API ou migrações. O custo de renderização será reduzido porque somente os cinco itens visíveis serão montados.

## Testes

Os testes serão escritos antes da implementação e cobrirão:

- tamanho inicial de cinco;
- navegação entre páginas e retorno à página anterior;
- seleção de outra quantidade e retorno à primeira página;
- páginas numeradas e estados anterior/próxima;
- paginação por competência no histórico comercial;
- integração com as duas tabelas TanStack existentes;
- ausência dos controles quando todos os itens couberem em uma página.

Após os testes focados, serão executados a suíte completa do Vitest, TypeScript, ESLint e `git diff --check`.
