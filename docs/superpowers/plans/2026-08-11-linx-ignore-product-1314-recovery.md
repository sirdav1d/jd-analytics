# OBSOLETO — contexto histórico do incidente do produto Linx 1314

> **AVISO DE OBSOLESCÊNCIA:** este documento não é um plano executável nem um runbook. Não use seu conteúdo para excluir o produto `1314`, executar uma recuperação, gravar no banco ou avançar cursores Linx. Os procedimentos operacionais e comandos do plano original foram removidos.

## Contexto histórico

Em 11 de agosto de 2026, este plano propôs temporariamente excluir movimentos do produto `1314` do fluxo canônico e executar uma sincronização incremental de recuperação. A proposta buscava contornar uma consulta individual de catálogo que, naquele momento, não retornava o produto.

Essa estratégia foi superada. Excluir o produto descartaria dados válidos da venda e deixou de representar o comportamento desejado da integração.

## Comportamento atual que substituiu o plano

- O sincronizador mantém o produto `1314` e os demais itens no resultado canônico.
- Produtos locais com catálogo `KNOWN` são reutilizados sem depender de uma nova consulta individual ao Linx.
- Quando uma consulta válida não encontra um produto sem cadastro local conhecido, a integração cria metadados provisórios com estado `PENDING`, preservando o item para reconciliação posterior.
- Cursores continuam sendo persistidos apenas pelo fluxo atômico normal de sincronização; este documento não autoriza nem descreve recuperação ou avanço de cursores.

## Registro da decisão

O plano original foi arquivado como obsoleto depois que a recuperação passou a preservar o produto e a tratar ausências de catálogo por estado. Seus testes propostos, comandos de implementação, commits, escritas no banco, sincronizações de recuperação e verificações operacionais foram removidos para evitar execução acidental.
