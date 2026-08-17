# Ícones de carregamento nos botões

## Objetivo

Durante uma sincronização de dados ou atualização do filtro principal, substituir o ícone normal do botão por um spinner, mantendo o texto, o tamanho e o alinhamento do controle.

## Escopo

A mudança será local aos seguintes componentes:

- `DataSyncControl`, nas variantes desktop e mobile do botão “Sincronizar dados”.
- `Filter`, no botão “Buscar” do dashboard principal.

O componente global `Button` não será alterado.

## Comportamento

### Sincronizar dados

O botão exibirá o ícone `RefreshCw` enquanto estiver ocioso. Quando uma mutação local estiver pendente ou o servidor informar que existe uma sincronização em execução, o `RefreshCw` será removido e substituído por um `Loader2` animado. O texto “Sincronizar dados” e a regra atual de desabilitação serão preservados.

### Buscar

O botão exibirá o ícone `Search` enquanto estiver ocioso. Durante a transição iniciada pelo filtro, o `Search` será removido e substituído por um `Loader2` animado. O texto “Buscar” e a regra atual de desabilitação serão preservados.

## Acessibilidade e layout

Os rótulos textuais continuarão presentes durante o carregamento, portanto o nome acessível de cada botão permanecerá estável. O spinner ocupará o mesmo espaço reservado ao ícone normal, evitando alteração perceptível nas dimensões do botão.

## Testes

Os testes dos dois componentes verificarão que:

- o ícone normal é exibido no estado ocioso;
- durante o carregamento, o spinner é exibido e o ícone normal não está presente;
- o texto e o estado desabilitado permanecem corretos.
