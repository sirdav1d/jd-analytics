# Ignorar o produto Linx 1314 e recuperar a sincronização

## Contexto

A sincronização incremental está bloqueada porque movimentos de 5 e 6 de agosto de 2026 referenciam o produto Linx `1314`, mas a consulta pontual `LinxProdutos` não retorna esse cadastro. A validação estrita do catálogo encerra a execução antes da persistência. Como pedidos e cursores são persistidos atomicamente, o acumulado é reprocessado em cada tentativa e atualmente excede o prazo operacional de 48 segundos.

O diagnóstico por dia encontrou 11 pedidos com o produto `1314`: oito também possuem outros produtos, somando 47 linhas importáveis, e três possuem somente o produto ignorado.

## Comportamento aprovado

- Ignorar somente movimentos cujo `productCode` seja `1314`.
- Aplicar a exclusão depois de completar o snapshot autoritativo do movimento e antes de carregar catálogos ou mapear vendas canônicas.
- Sincronizar normalmente os demais itens de pedidos mistos.
- Não criar nem atualizar pedidos que, depois da exclusão, não tenham nenhum item importável.
- Permitir que os cursores avancem quando todo o restante da carga for persistido com sucesso.
- Não alterar o tratamento de qualquer outro código de produto ausente ou inválido.

## Estrutura

A regra ficará no orquestrador Linx, junto da preparação dos movimentos que alimentam catálogos e mapeamento. Uma constante nomeada documentará a exceção operacional. O filtro produzirá uma nova coleção, sem modificar as linhas validadas em lugar.

O carregador de catálogos receberá apenas os movimentos restantes. Assim, ele nunca consultará `LinxProdutos` para o código `1314`. O mapeador agrupará vendas somente a partir desses movimentos, o que preserva itens válidos de pedidos mistos e elimina naturalmente pedidos que ficaram sem itens.

## Recuperação operacional

Depois que os testes, lint e build passarem, será executada uma sincronização incremental real contra a organização Linx ativa. A execução de recuperação usará um prazo de até cinco minutos para absorver o acumulado sem enfraquecer a transação atômica.

Nenhum cursor será alterado manualmente. A própria sincronização persistirá pedidos, itens, cursores e o status da execução. Se houver outra falha, a transação continuará sendo revertida e o diagnóstico será retomado a partir do novo estágio registrado.

## Erros e observabilidade

A exceção do produto `1314` não suprimirá falhas de autenticação, contrato, paginação, outros catálogos ou persistência. O resultado será confirmado pelo status da nova `LinxSyncRun`, pelo avanço dos cinco cursores e pelos totais processados.

## Testes

- Um teste de regressão demonstrará que o produto `1314` não chega ao carregador de catálogos nem ao mapeamento.
- O mesmo teste demonstrará que itens permitidos do mesmo pedido continuam presentes.
- Um caso com somente o produto `1314` demonstrará que nenhum pedido vazio é produzido.
- A suíte Linx completa, lint e build devem passar antes da gravação real.
- Após a execução real, o banco deve registrar uma execução bem-sucedida e cursores posteriores aos valores de 4 de agosto de 2026.
