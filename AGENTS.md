# Regras do repositório

## Formatação e fluxo de controle

- Separe cada bloco lógico com uma linha em branco. Considere como blocos distintos, entre outros, preparação de dados, validação, autorização, consultas, transformação e retorno.
- Não adicione linhas em branco artificiais dentro de um único objeto, array, chamada encadeada ou expressão que pertença ao mesmo bloco lógico.
- É proibido aninhar `if` dentro de outro `if` ou de um bloco `else`.
- É proibido usar operadores ternários aninhados.
- Substitua condicionais aninhadas por guard clauses, retornos antecipados, funções auxiliares com uma única responsabilidade ou mapas de decisão.
- Essas regras se aplicam ao código de produção, aos testes e aos exemplos de código incluídos na documentação.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
