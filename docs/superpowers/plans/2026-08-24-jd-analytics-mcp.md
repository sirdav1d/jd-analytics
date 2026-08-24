# JD Analytics MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Disponibilizar os dados comerciais, metas e marketing do JD Analytics por um servidor MCP remoto, somente leitura, com OAuth 2.1, autorização por perfil, auditoria e limites distribuídos.

**Architecture:** O endpoint Streamable HTTP ficará no aplicativo Next.js existente e chamará serviços internos tipados, sem requisições HTTP para o próprio aplicativo. Descope emitirá os tokens OAuth, enquanto o PostgreSQL continuará sendo a fonte de verdade de `role` e `isActive`; os adaptadores do Google usarão uma conta de serviço e poderão ser substituídos por fakes determinísticos nos testes de integração.

**Tech Stack:** Next.js 16, Node.js 24, TypeScript 5, Prisma 6, PostgreSQL/Supabase, NextAuth 4, Descope, `mcp-handler` 2, MCP SDK 2, Zod 4, Google Analytics Data API, Google Ads API e Vitest 4.

**Spec:** `docs/superpowers/specs/2026-08-24-jd-analytics-mcp-design.md`

## Global Constraints

- O endpoint MCP é `/api/mcp`, usa Streamable HTTP e não mantém estado entre requisições.
- Instalar `mcp-handler@^2`, `@modelcontextprotocol/server@^2`, `@descope/node-sdk` e `zod@^4.2`.
- Manter Node.js em `>=24.19.0 <25`, Next.js em `^16.2.12` e Prisma em `^6.11.1`.
- O escopo OAuth inicial é exatamente `mcp:read`.
- O fuso horário é `America/Sao_Paulo`, a moeda é `BRL` e datas civis usam `YYYY-MM-DD`.
- Pedidos cancelados não compõem faturamento, metas realizadas, rankings, curva ABC ou anomalias.
- ADMIN e MANAGER podem consultar todo o escopo permitido; SELLER recebe somente vendas, pedidos, clientes relacionados e metas próprias.
- SELLER não pode acessar marketing, Google Analytics, Google Ads ou metas de ROAS.
- Um `sellerId` informado pelo cliente nunca pode ampliar o escopo de um SELLER.
- Nenhuma ferramenta aceita SQL, nomes de tabela ou fragmentos de consulta fornecidos pelo cliente.
- Todas as ferramentas de negócio são somente leitura.
- Cada resposta contém JSON estruturado e um resumo textual curto.
- Limites: 60 chamadas por minuto por usuário, 5 chamadas concorrentes por usuário, 100 pedidos por página, 1 MB por resposta, 15 segundos para PostgreSQL, 20 segundos para Google e 24 meses por consulta Google.
- A credencial PostgreSQL do MCP não lê `User.password`, tabelas de redefinição de senha nem os tokens Google antigos.
- A auditoria nunca persiste tokens, credenciais, senhas, nomes de clientes, pedidos completos ou respostas integrais.
- Criar somente quatro arquivos de testes de integração: autenticação/permissões, consultas, erros e contratos. Não criar testes unitários nem suíte E2E separada.
- A conta de serviço Google deve ser validada antes de desativar o OAuth Google antigo ou remover seus campos.
- A Data API do Supabase só pode ser desativada depois da confirmação de que não existe consumidor externo; caso exista, aplicar RLS e grants mínimos.

---

## File Structure

### Transporte e núcleo MCP

- `src/app/api/mcp/route.ts`: exporta GET e POST protegidos por OAuth e OPTIONS quando exigido pelo transporte.
- `src/app/.well-known/oauth-protected-resource/route.ts`: publica os metadados do recurso protegido apontando para o Descope.
- `src/mcp/server.ts`: cria o handler, registra as ferramentas e recebe dependências injetáveis.
- `src/mcp/core/contracts.ts`: concentra schemas Zod, tipos dos filtros, envelopes e nomes oficiais das 13 ferramentas.
- `src/mcp/core/errors.ts`: define os sete códigos públicos e converte falhas internas em mensagens seguras.
- `src/mcp/core/response.ts`: monta `content`, `structuredContent`, resumo textual e aplica o limite de 1 MB.
- `src/mcp/core/runtime.ts`: define `McpRuntime`, relógio, Prisma, verificador de token e provedores Google.
- `src/mcp/core/request-lifecycle.ts`: resolve usuário, aplica limite, lease, timeout, auditoria e liberação garantida.
- `src/mcp/core/limits.ts`: implementa contador por minuto e leases concorrentes no PostgreSQL.
- `src/mcp/core/audit.ts`: normaliza parâmetros, aplica HMAC a identificadores e grava somente metadados permitidos.

### Autenticação e autorização

- `src/mcp/auth/token-verifier.ts`: valida token Descope, audience, expiração e `mcp:read`.
- `src/mcp/auth/types.ts`: define o contrato injetável do verificador de token.
- `src/mcp/auth/principal.ts`: mapeia `sub` para `User.externalId` e recarrega `id`, `role` e `isActive` em cada chamada.
- `src/mcp/auth/scope.ts`: aplica a matriz de acesso e injeta o vendedor obrigatório.
- `src/mcp/auth/external-auth.ts`: conclui o BYOA External Authentication no Descope após validar a sessão NextAuth.
- `src/mcp/auth/safe-callback.ts`: aceita somente `/dashboard` ou `/mcp/authorize?external_auth_req_id=...`.
- `src/app/mcp/authorize/page.tsx`: exige sessão ativa e apresenta a confirmação de acesso ao MCP.
- `src/app/api/mcp/external-auth/complete/route.ts`: recebe POST same-origin, conclui o fluxo Descope e redireciona para a URL validada do Descope.
- `src/app/(public)/(auth)/sign-in/page.tsx`: lê e repassa o callback seguro.
- `src/app/(public)/(auth)/sign-in/_components/sign-in-form.tsx`: volta para o fluxo MCP após o login, ou para `/dashboard` no login comum.

### Domínios de consulta

- `src/mcp/commercial/service.ts`: cobertura, resumo, série temporal, ABC, IQR e rankings.
- `src/mcp/commercial/register-tools.ts`: registra as seis ferramentas comerciais.
- `src/mcp/orders/service.ts`: lista e detalha pedidos com selects explícitos e escopo por vendedor.
- `src/mcp/orders/register-tools.ts`: registra `jd_list_orders` e `jd_get_order`.
- `src/mcp/goals/service.ts`: metas comerciais e de ROAS.
- `src/mcp/goals/register-tools.ts`: registra `jd_sales_goals` e `jd_roas_goals`.
- `src/mcp/marketing/providers.ts`: interfaces `GoogleAdsProvider` e `GoogleAnalyticsProvider` usadas em produção e testes.
- `src/mcp/marketing/google-service-account.ts`: cria credenciais Google a partir de segredos do ambiente.
- `src/mcp/marketing/google-ads.ts`: consulta custos, campanhas, anúncios e palavras-chave com timeout.
- `src/mcp/marketing/google-analytics.ts`: consulta sessões, usuários, conversão, receita, canais e tráfego com timeout.
- `src/mcp/marketing/service.ts`: consolida Meta, Google, faturamento atribuído, ROAS e metas de ROAS.
- `src/mcp/marketing/register-tools.ts`: registra as três ferramentas de marketing.

### Banco, configuração, rotas existentes e documentação

- `src/lib/mcp-prisma.ts`: cliente Prisma exclusivo criado com `MCP_DATABASE_URL`.
- `prisma/schema.prisma`: adiciona `McpAuditLog`, `McpRateLimitBucket`, `McpRequestLease` e `McpAuditOutcome`.
- `prisma/migrations/20260824230000_add_mcp_operations/migration.sql`: cria as estruturas operacionais.
- `prisma/security/jd_mcp_role.sql`: define grants de coluna e bloqueios da role PostgreSQL `jd_mcp`.
- `.env.example`: documenta segredos e IDs necessários sem valores reais.
- `src/app/api/services/data-services/comercial-big-numbers/route.ts`: torna-se adaptador do serviço comercial.
- `src/app/api/services/data-services/comercial-rankings/route.ts`: torna-se adaptador do serviço comercial.
- `src/app/api/services/data-services/tracking-goal/route.ts`: torna-se adaptador do serviço de metas.
- `src/app/api/services/data-services/goals-current/route.ts`: torna-se adaptador do serviço de metas.
- `src/app/api/services/google-services/get-ads-data/route.ts`: torna-se adaptador do provedor Google Ads.
- `src/app/api/services/google-services/top-ads/route.ts`: torna-se adaptador do provedor Google Ads.
- `src/app/api/services/google-services/top-keywords/route.ts`: torna-se adaptador do provedor Google Ads.
- `src/app/api/services/google-services/get-analytics-data/route.ts`: torna-se adaptador do provedor Google Analytics.
- `src/services/marketing-spend/google.ts`: usa o provedor de conta de serviço compartilhado.
- `src/services/marketing-report/get-marketing-report-aggregate.ts`: usa o serviço de marketing compartilhado.
- `docs/mcp/deployment.md`: descreve Descope, Google, banco, Data API, rollout e rollback.

### Testes de integração, exatamente quatro grupos

- `src/tests/integration/mcp/auth-permissions.test.ts`: autenticação e permissões por perfil.
- `src/tests/integration/mcp/queries.test.ts`: consultas comerciais, metas e marketing.
- `src/tests/integration/mcp/errors.test.ts`: tratamento padronizado de erros.
- `src/tests/integration/mcp/contracts.test.ts`: contratos de entrada, resposta e protocolo MCP.
- `src/tests/integration/mcp/harness.ts`: cliente HTTP em memória, criação segura do Prisma de teste e limpeza.
- `src/tests/integration/mcp/fixtures.ts`: dados sintéticos determinísticos.
- `src/tests/integration/mcp/fake-google.ts`: provedores Google determinísticos sem rede.

## Shared Interfaces

Estas assinaturas são estáveis e devem ser usadas por todas as tarefas:

```ts
export type McpErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "INVALID_ARGUMENT"
  | "RATE_LIMITED"
  | "QUERY_TIMEOUT"
  | "UPSTREAM_UNAVAILABLE"
  | "INTERNAL_ERROR";

export type McpPrincipal = {
  userId: string;
  externalId: string;
  role: "ADMIN" | "MANAGER" | "SELLER";
  clientId: string;
};

export type JdSuccess<T> = {
  ok: true;
  requestId: string;
  data: T;
  meta: {
    timezone: "America/Sao_Paulo";
    currency: "BRL";
    rowCount: number;
    appliedSellerId?: string;
  };
};

export type JdFailure = {
  ok: false;
  requestId: string;
  error: { code: McpErrorCode; message: string };
};

export type ToolExecutionContext = {
  requestId: string;
  principal: McpPrincipal;
  runDb: <T>(operation: (
    db: import("@prisma/client").Prisma.TransactionClient,
  ) => Promise<T>) => Promise<T>;
  signal: AbortSignal;
};

export type ToolExecutor<I, O> = (
  input: I,
  context: ToolExecutionContext,
) => Promise<{ data: O; summary: string; rowCount: number }>;
```

Os filtros compartilhados são `startDate`, `endDate`, `sellerId`, `origin`, `weekday`, `productId`, `brand`, `sector`, `paymentMethodId`, `groupBy`, `granularity`, `page` e `pageSize`. `weekday` usa `MONDAY` a `SUNDAY`; `groupBy` usa `DATE`, `CUSTOMER`, `SELLER`, `PRODUCT`, `BRAND` ou `SECTOR`; `granularity` usa `DAY`, `WEEK` ou `MONTH`.

---

### Task 1: Dependências, contratos e harness MCP

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Create: `src/mcp/core/contracts.ts`
- Create: `src/mcp/core/runtime.ts`
- Create: `src/mcp/core/response.ts`
- Create: `src/mcp/auth/types.ts`
- Create: `src/mcp/marketing/providers.ts`
- Create: `src/mcp/server.ts`
- Create: `src/tests/integration/mcp/harness.ts`
- Create: `src/tests/integration/mcp/contracts.test.ts`

**Interfaces:**
- Consumes: nenhuma interface MCP anterior.
- Produces: `MCP_TOOL_NAMES`, `sharedSalesFilterSchema`, `JdSuccess<T>`, `TokenVerifier`, `GoogleAdsProvider`, `GoogleAnalyticsProvider`, `McpRuntime`, `createJdMcpHandler(runtime)`, `invokeMcpRequest`, `invokeMcpTool` e `initializeMcp`.

- [ ] **Step 1: Escrever o primeiro teste de contrato com os 13 nomes oficiais**

```ts
import { describe, expect, it } from "vitest";
import { MCP_TOOL_NAMES } from "@/mcp/core/contracts";

describe("contrato das ferramentas MCP", () => {
  it("expõe somente as 13 ferramentas aprovadas", () => {
    expect(MCP_TOOL_NAMES).toEqual([
      "jd_data_coverage", "jd_sales_summary", "jd_sales_timeseries",
      "jd_sales_abc", "jd_sales_anomalies", "jd_sales_ranking",
      "jd_list_orders", "jd_get_order", "jd_sales_goals",
      "jd_roas_goals", "jd_marketing_overview",
      "jd_google_ads_performance", "jd_google_analytics_performance",
    ]);
  });
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha pela ausência dos contratos**

Run: `npm run test:integration -- src/tests/integration/mcp/contracts.test.ts`

Expected: FAIL com `Cannot find module '@/mcp/core/contracts'`.

- [ ] **Step 3: Instalar versões compatíveis e criar os schemas compartilhados**

Run: `npm install mcp-handler@^2 @modelcontextprotocol/server@^2 @descope/node-sdk zod@^4.2`

Implementar em `contracts.ts`:

```ts
import { z } from "zod";

export const MCP_TOOL_NAMES = [
  "jd_data_coverage", "jd_sales_summary", "jd_sales_timeseries",
  "jd_sales_abc", "jd_sales_anomalies", "jd_sales_ranking",
  "jd_list_orders", "jd_get_order", "jd_sales_goals",
  "jd_roas_goals", "jd_marketing_overview",
  "jd_google_ads_performance", "jd_google_analytics_performance",
] as const;

const civilDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u);
export const sharedSalesFilterSchema = z.object({
  startDate: civilDate.optional(),
  endDate: civilDate.optional(),
  sellerId: z.string().uuid().optional(),
  origin: z.string().trim().min(1).max(120).optional(),
  weekday: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]).optional(),
  productId: z.string().uuid().optional(),
  brand: z.string().trim().min(1).max(120).optional(),
  sector: z.string().trim().min(1).max(120).optional(),
  paymentMethodId: z.string().uuid().optional(),
}).superRefine((value, ctx) => {
  if ((value.startDate && !value.endDate) || (!value.startDate && value.endDate)) {
    ctx.addIssue({ code: "custom", message: "startDate e endDate devem ser informados juntos" });
  }
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    ctx.addIssue({ code: "custom", message: "startDate deve ser menor ou igual a endDate" });
  }
});
```

Adicionar a `.env.example` os nomes `MCP_PUBLIC_URL`, `MCP_DATABASE_URL`, `MCP_TEST_DATABASE_URL`, `MCP_HASH_SECRET`, `DESCOPE_PROJECT_ID`, `DESCOPE_BASE_URL`, `DESCOPE_AUTH_SERVER_URL`, `DESCOPE_MCP_AUDIENCE`, `DESCOPE_MANAGEMENT_KEY`, `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GOOGLE_ANALYTICS_PROPERTY_ID`, `GOOGLE_ADS_API_VERSION`, `GOOGLE_DEVELOPER_TOKEN`, `GOOGLE_CUSTOMER_ID_PRODUCTS`, `GOOGLE_MANAGER_ID_PRODUCTS`, `GOOGLE_CUSTOMER_ID_SERVICES` e `GOOGLE_MANAGER_ID_SERVICES`, todos sem valor, exceto `GOOGLE_ADS_API_VERSION=25`.

- [ ] **Step 4: Criar o handler injetável e o harness HTTP sem registrar ferramentas de negócio ainda**

```ts
export type McpRuntime = {
  prisma: PrismaClient;
  verifyToken: TokenVerifier;
  googleAds: GoogleAdsProvider;
  googleAnalytics: GoogleAnalyticsProvider;
  now: () => Date;
};

export function createJdMcpHandler(runtime: McpRuntime) {
  return createMcpHandler((_server) => { void runtime; });
}
```

Criar os contratos injetáveis desde o início para que `McpRuntime` compile antes dos adaptadores concretos:

```ts
export type VerifiedAccessToken = {
  subject: string; clientId: string; scopes: string[]; expiresAt: number;
};
export type TokenVerifier = (token: string) => Promise<VerifiedAccessToken>;

export interface GoogleAdsProvider {
  getPerformance(input: { startDate: string; endDate: string; scope: "products" | "services"; signal: AbortSignal }): Promise<{
    cost: number; impressions: number; clicks: number; ctr: number; conversions: number;
    campaigns: Array<{ id: string; name: string; cost: number; conversions: number }>;
    ads: Array<{ id: string; name: string; clicks: number; conversions: number }>;
    keywords: Array<{ text: string; clicks: number; conversions: number }>;
  }>;
}

export interface GoogleAnalyticsProvider {
  getPerformance(input: { startDate: string; endDate: string; signal: AbortSignal }): Promise<{
    sessions: number; users: number; conversions: number; revenue: number; conversionRate: number;
    channels: Array<{ channel: string; sessions: number; revenue: number }>;
    traffic: Array<{ date: string; sessions: number; users: number }>;
  }>;
}
```

O harness deve rejeitar banco inseguro antes de criar o Prisma:

```ts
export function assertSafeTestDatabase(rawUrl: string) {
  const url = new URL(rawUrl);
  const database = url.pathname.slice(1);
  const schema = url.searchParams.get("schema") ?? "";
  if (!database.endsWith("_test") && !schema.startsWith("mcp_test_")) {
    throw new Error("MCP_TEST_DATABASE_URL deve usar banco *_test ou schema mcp_test_*");
  }
}
```

`invokeMcpRequest(handler, token, method, params, protocolVersion = "2026-07-28")` deve enviar POST JSON-RPC 2.0 para `http://localhost/api/mcp`, headers `authorization: Bearer <token>`, `content-type: application/json`, `accept: application/json, text/event-stream` e `mcp-protocol-version`. Ele retorna `{ status, headers, payload }` e interpreta tanto JSON quanto os eventos `data:` do SSE. `invokeMcpTool` chama `invokeMcpRequest` com `method: "tools/call"`; `initializeMcp` chama com `method: "initialize"` e `params: { protocolVersion, capabilities: {}, clientInfo: { name: "jd-integration", version: "1.0.0" } }`.

- [ ] **Step 5: Executar contratos, testes existentes, lint e build**

Run: `npm run test:integration -- src/tests/integration/mcp/contracts.test.ts && npm test && npm run lint && npm run build`

Expected: PASS. O teste existente do formulário confirma também que a atualização para Zod 4 não quebrou o resolver.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .env.example src/mcp src/tests/integration/mcp
git commit -m "feat: bootstrap JD Analytics MCP"
```

### Task 2: Persistência operacional, limite, lease e auditoria

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260824230000_add_mcp_operations/migration.sql`
- Create: `prisma/security/jd_mcp_role.sql`
- Create: `src/lib/mcp-prisma.ts`
- Create: `src/mcp/core/errors.ts`
- Create: `src/mcp/core/limits.ts`
- Create: `src/mcp/core/audit.ts`
- Create: `src/tests/integration/mcp/errors.test.ts`

**Interfaces:**
- Consumes: `McpRuntime`, `ToolExecutor<I, O>` e `JdFailure` da Task 1.
- Produces: `McpPublicError`, `toPublicError`, `acquireRequestSlot`, `releaseRequestSlot` e `writeAuditLog`.

- [ ] **Step 1: Escrever testes falhos para 60 chamadas, 5 leases e auditoria sem PII**

```ts
it("recusa a 61ª chamada na mesma janela", async () => {
  await seedRateBucket({ keyHash, requestCount: 60, windowStartedAt });
  await expect(acquireRequestSlot(db, keyHash, now)).rejects.toMatchObject({ code: "RATE_LIMITED" });
});

it("não grava parâmetros pessoais nem a resposta", async () => {
  await writeAuditLog(db, {
    requestId, userId, clientId: "client-a", toolName: "jd_get_order",
    parameters: { orderId, customerName: "Maria" }, outcome: "SUCCESS",
    durationMs: 8, rowCount: 1,
  });
  const row = await adminDb.mcpAuditLog.findUniqueOrThrow({ where: { requestId } });
  expect(JSON.stringify(row.normalizedParameters)).not.toContain("Maria");
  expect(JSON.stringify(row)).not.toContain("items");
});
```

- [ ] **Step 2: Executar o grupo de erros e confirmar a ausência das tabelas**

Run: `npm run test:integration -- src/tests/integration/mcp/errors.test.ts`

Expected: FAIL com tabela ou módulo `McpRateLimitBucket` ausente.

- [ ] **Step 3: Adicionar os modelos e aplicar a migração no banco descartável**

```prisma
enum McpAuditOutcome {
  SUCCESS
  ERROR
}

model McpAuditLog {
  id                   String          @id @default(uuid())
  occurredAt           DateTime        @default(now())
  requestId            String          @unique
  userId               String?
  clientId             String?
  toolName              String
  normalizedParameters Json
  outcome               McpAuditOutcome
  errorCode             String?
  durationMs            Int
  rowCount              Int?
  @@index([userId, occurredAt])
}

model McpRateLimitBucket {
  keyHash         String
  windowStartedAt DateTime
  requestCount    Int      @default(0)
  updatedAt       DateTime @updatedAt
  @@id([keyHash, windowStartedAt])
}

model McpRequestLease {
  id        String   @id @default(uuid())
  keyHash   String
  createdAt DateTime @default(now())
  expiresAt DateTime
  @@index([keyHash, expiresAt])
}
```

Run: `MCP_TEST_DATABASE_URL="$MCP_TEST_DATABASE_URL" npx prisma migrate deploy`

- [ ] **Step 4: Implementar incremento atômico, lock por usuário e lease com expiração**

Dentro de uma transação, executar `pg_advisory_xact_lock(hashtextextended(${keyHash}, 0))`, incrementar por `INSERT ... ON CONFLICT ... DO UPDATE`, apagar leases expirados, contar leases ativos e inserir um lease de 25 segundos somente quando houver menos de cinco. `releaseRequestSlot` apaga exclusivamente o ID retornado. O HMAC deve ser `createHmac("sha256", process.env.MCP_HASH_SECRET).update(userId).digest("hex")`.

- [ ] **Step 5: Implementar mapeamento de falhas e normalização da auditoria**

`toPublicError` mapeia Zod para `INVALID_ARGUMENT`, `57014` para `QUERY_TIMEOUT`, falhas tipadas de Google para `UPSTREAM_UNAVAILABLE`, erros de limite para `RATE_LIMITED` e qualquer outra falha para `INTERNAL_ERROR`. A normalização mantém datas, enums e paginação; aplica HMAC a `sellerId`, `productId`, `paymentMethodId` e `orderId`; descarta qualquer chave fora da allowlist, incluindo `customerName`, token, senha e payload de resposta.

`writeAuditLog` usa `INSERT` parametrizado sem `RETURNING`, para funcionar com a permissão de somente INSERT da role `jd_mcp`.

- [ ] **Step 6: Executar o grupo de erros**

Run: `npm run test:integration -- src/tests/integration/mcp/errors.test.ts`

Expected: PASS para limite, concorrência, timeout, erro seguro, `requestId`, liberação de lease e auditoria sanitizada.

- [ ] **Step 7: Commit**

```bash
git add prisma src/lib/mcp-prisma.ts src/mcp/core src/tests/integration/mcp/errors.test.ts
git commit -m "feat: add MCP operational safeguards"
```

### Task 3: Login existente e BYOA External Authentication do Descope

**Files:**
- Create: `src/mcp/auth/safe-callback.ts`
- Create: `src/mcp/auth/external-auth.ts`
- Create: `src/app/mcp/authorize/page.tsx`
- Create: `src/app/api/mcp/external-auth/complete/route.ts`
- Modify: `src/lib/auth.ts`
- Modify: `src/app/(public)/(auth)/sign-in/page.tsx`
- Modify: `src/app/(public)/(auth)/sign-in/_components/sign-in-form.tsx`
- Create: `src/tests/integration/mcp/auth-permissions.test.ts`

**Interfaces:**
- Consumes: `getCurrentUser()` existente e `McpPublicError`.
- Produces: `resolveSafeCallbackUrl`, `ExternalAuthClient`, `completeExternalAuthentication` e o fluxo `/mcp/authorize`.

- [ ] **Step 1: Escrever os cenários falhos de callback e conclusão Descope**

```ts
it.each(["https://evil.test", "//evil.test", "/admin"])("rejeita callback %s", (value) => {
  expect(resolveSafeCallbackUrl(value)).toBe("/dashboard");
});

it("conclui external auth com externalId sem incluir role no token", async () => {
  const client = fakeExternalAuthClient();
  await completeExternalAuthentication(client, activeAdmin, "request_123");
  expect(client.complete).toHaveBeenCalledWith({
    externalAuthReqId: "request_123",
    loginId: activeAdmin.externalId,
    emailVerified: true,
    phoneVerified: false,
  });
});
```

- [ ] **Step 2: Executar autenticação e confirmar a falha dos módulos ausentes**

Run: `npm run test:integration -- src/tests/integration/mcp/auth-permissions.test.ts`

Expected: FAIL com `Cannot find module '@/mcp/auth/safe-callback'`.

- [ ] **Step 3: Implementar callback relativo e preservar o fluxo no formulário**

```ts
export function resolveSafeCallbackUrl(value?: string | null) {
  if (!value) return "/dashboard";
  const parsed = new URL(value, "https://jd.invalid");
  if (parsed.origin !== "https://jd.invalid") return "/dashboard";
  if (parsed.pathname === "/dashboard") return "/dashboard";
  if (parsed.pathname !== "/mcp/authorize") return "/dashboard";
  const requestId = parsed.searchParams.get("external_auth_req_id");
  if (!requestId || requestId.length > 2048) return "/dashboard";
  return `${parsed.pathname}?external_auth_req_id=${encodeURIComponent(requestId)}`;
}
```

Alterar `SignInForm` para receber `callbackUrl: string` e substituir `router.push('/dashboard')` por `router.push(callbackUrl)`. A página resolve `searchParams.callbackUrl` no servidor e passa somente o valor sanitizado.

Adicionar `externalId: true` ao `select` de `getCurrentUser()`; a função continua sem selecionar `password`.

- [ ] **Step 4: Implementar a página de autorização e o POST same-origin**

A página redireciona usuário ausente/inativo para `/sign-in?callbackUrl=<callback seguro>`; usuário ativo recebe formulário POST com campo oculto `external_auth_req_id` e botão `Autorizar acesso`. A rota POST compara `Origin` com `new URL(MCP_PUBLIC_URL).origin`, recarrega o usuário, chama `POST ${DESCOPE_BASE_URL}/v1/mgmt/flow/externalauth/complete` com `Authorization: Bearer ${DESCOPE_MANAGEMENT_KEY}`, e aceita a URL devolvida somente quando sua origem for `new URL(DESCOPE_BASE_URL).origin`.

- [ ] **Step 5: Executar o grupo de autenticação**

Run: `npm run test:integration -- src/tests/integration/mcp/auth-permissions.test.ts`

Expected: PASS para callback seguro, sessão ausente, usuário inativo, payload sem role e redirecionamento Descope validado usando fake HTTP.

- [ ] **Step 6: Commit**

```bash
git add src/mcp/auth src/app/mcp src/app/api/mcp/external-auth 'src/app/(public)/(auth)/sign-in' src/lib/auth.ts src/tests/integration/mcp/auth-permissions.test.ts
git commit -m "feat: bridge JD login to Descope OAuth"
```

### Task 4: Token Descope, principal atual e matriz de autorização

**Files:**
- Create: `src/mcp/auth/token-verifier.ts`
- Create: `src/mcp/auth/principal.ts`
- Create: `src/mcp/auth/scope.ts`
- Modify: `src/mcp/core/runtime.ts`
- Create: `src/mcp/core/request-lifecycle.ts`
- Modify: `src/mcp/server.ts`
- Create: `src/app/.well-known/oauth-protected-resource/route.ts`
- Modify: `src/tests/integration/mcp/auth-permissions.test.ts`

**Interfaces:**
- Consumes: `McpRuntime`, `TokenVerifier`, `McpPrincipal`, limites, auditoria e erros das Tasks 1 e 2.
- Produces: `createDescopeTokenVerifier`, `resolvePrincipal`, `resolveSellerScope`, `assertMarketingAccess`, `executeMcpTool` e OAuth `AuthInfo`.

- [ ] **Step 1: Adicionar casos falhos de token, usuário desativado e perfis**

```ts
it.each([undefined, "expired", "wrong-audience", "missing-scope"])("rejeita token %s", async (token) => {
  const response = await invokeMcpRequest(handler, token, "tools/list", {});
  expect(response.status).toBe(401);
});

it("recarrega isActive e role do banco a cada chamada", async () => {
  const authInfo = authInfoFor("seller-token");
  expect((await resolvePrincipal(authInfo, adminDb)).role).toBe("SELLER");
  await adminDb.user.update({ where: { id: seller.id }, data: { isActive: false } });
  await expect(resolvePrincipal(authInfo, adminDb)).rejects.toMatchObject({ code: "FORBIDDEN" });
});
```

- [ ] **Step 2: Executar o teste e confirmar falha de autenticação ainda não implementada**

Run: `npm run test:integration -- src/tests/integration/mcp/auth-permissions.test.ts`

Expected: FAIL porque o handler ainda não resolve `sub` nem o usuário atual.

- [ ] **Step 3: Validar Descope e converter o resultado em `AuthInfo`**

`createDescopeTokenVerifier` usa `DescopeClient({ projectId: DESCOPE_PROJECT_ID }).validateSession(token, { audience: DESCOPE_MCP_AUDIENCE })`, exige `sub`, `exp` futuro, audience exata e scope `mcp:read`, e retorna:

```ts
export type VerifiedAccessToken = {
  subject: string;
  clientId: string;
  scopes: string[];
  expiresAt: number;
};
```

O adaptador do `withMcpAuth` produz `{ token, clientId, scopes, expiresAt, extra: { subject } }`. O metadata handler usa `protectedResourceHandler({ authServerUrls: [DESCOPE_AUTH_SERVER_URL] })` e `metadataCorsOptionsRequestHandler()`.

- [ ] **Step 4: Recarregar usuário e aplicar escopo por vendedor**

```ts
export async function resolvePrincipal(authInfo: AuthInfo, db: PrismaClient): Promise<McpPrincipal> {
  const subject = authInfo.extra?.subject;
  if (typeof subject !== "string") throw new McpPublicError("UNAUTHENTICATED", "Token inválido");
  const user = await db.user.findUnique({
    where: { externalId: subject },
    select: { id: true, externalId: true, role: true, isActive: true },
  });
  if (!user) throw new McpPublicError("UNAUTHENTICATED", "Usuário não encontrado");
  if (!user.isActive) throw new McpPublicError("FORBIDDEN", "Usuário inativo");
  return { userId: user.id, externalId: user.externalId, role: user.role, clientId: authInfo.clientId };
}

export function resolveSellerScope(principal: McpPrincipal, requested?: string) {
  if (principal.role !== "SELLER") return requested;
  if (requested && requested !== principal.userId) {
    throw new McpPublicError("FORBIDDEN", "Vendedor sem acesso ao filtro solicitado");
  }
  return principal.userId;
}
```

`assertMarketingAccess` permite somente ADMIN e MANAGER. Ranking para SELLER calcula a posição global no banco, mas retorna somente a linha do próprio usuário.

- [ ] **Step 5: Integrar autenticação, timeout, limites e auditoria ao handler**

```ts
export async function executeMcpTool<I, O>(args: {
  toolName: string; input: I; authInfo: AuthInfo; runtime: McpRuntime;
  executor: ToolExecutor<I, O>;
}) {
  const requestId = randomUUID();
  const startedAt = performance.now();
  let leaseId: string | undefined;
  let principal: McpPrincipal | undefined;
  let outcome: "SUCCESS" | "ERROR" = "ERROR";
  let errorCode: McpErrorCode | undefined;
  let rowCount: number | undefined;
  try {
    principal = await resolvePrincipal(args.authInfo, args.runtime.prisma);
    leaseId = await acquireRequestSlot(args.runtime.prisma, hashUser(principal.userId), args.runtime.now());
    const runDb = <T>(operation: (db: Prisma.TransactionClient) => Promise<T>) =>
      args.runtime.prisma.$transaction(async (db) => {
        await db.$executeRawUnsafe("SET LOCAL statement_timeout = '15000ms'");
        return operation(db);
      }, { timeout: 16_000 });
    const result = await args.executor(args.input, {
      requestId, principal, runDb, signal: AbortSignal.timeout(20_000),
    });
    rowCount = result.rowCount;
    const response = createToolSuccess(requestId, result);
    outcome = "SUCCESS";
    return response;
  } catch (error) {
    const safe = toPublicError(error, requestId);
    errorCode = safe.code;
    return createToolFailure(safe);
  } finally {
    if (leaseId) await releaseRequestSlot(args.runtime.prisma, leaseId);
    await writeAuditLog(args.runtime.prisma, { requestId,
      userId: principal?.userId, clientId: principal?.clientId, toolName: args.toolName,
      parameters: args.input, outcome, errorCode,
      durationMs: Math.round(performance.now() - startedAt), rowCount });
  }
}
```

O `withMcpAuth` envolve o handler criado na Task 1 com `required: true`, `requiredScopes: ["mcp:read"]` e `resourceMetadataPath: "/.well-known/oauth-protected-resource"`. O handler continua injetável; a rota de produção será ligada quando os provedores concretos estiverem disponíveis.

Um wrapper externo inspeciona somente `method` e `params.name` de um clone limitado do JSON-RPC. Quando `withMcpAuth` responde 401 ou 403 antes do executor, o wrapper preserva `WWW-Authenticate`, acrescenta um `requestId`, devolve o envelope `UNAUTHENTICATED` ou `FORBIDDEN` e grava auditoria com `userId` nulo, `clientId` nulo e sem parâmetros. Chamadas que chegam ao executor são auditadas somente por `executeMcpTool`, evitando duplicidade.

Todo acesso comercial ao PostgreSQL passa por `context.runDb`, que aplica o timeout de 15 segundos. Chamadas Google usam `context.signal` fora da transação PostgreSQL, preservando o timeout independente de 20 segundos; ferramentas que combinam banco e Google não mantêm conexão ou transação aberta enquanto aguardam a API externa.

- [ ] **Step 6: Executar autenticação e metadados**

Run: `npm run test:integration -- src/tests/integration/mcp/auth-permissions.test.ts src/tests/integration/mcp/contracts.test.ts`

Expected: PASS para token, audience, scope, role atual, usuário inativo, injeção de seller e metadados OAuth.

- [ ] **Step 7: Commit**

```bash
git add src/mcp src/app/.well-known src/tests/integration/mcp
git commit -m "feat: enforce MCP OAuth and role scopes"
```

### Task 5: Cobertura, resumo e série temporal comerciais

**Files:**
- Create: `src/mcp/commercial/service.ts`
- Create: `src/mcp/commercial/register-tools.ts`
- Modify: `src/mcp/server.ts`
- Create: `src/tests/integration/mcp/fixtures.ts`
- Create: `src/tests/integration/mcp/queries.test.ts`
- Modify: `src/tests/integration/mcp/auth-permissions.test.ts`

**Interfaces:**
- Consumes: `sharedSalesFilterSchema`, `executeMcpTool`, `resolveSellerScope` e `ToolExecutionContext`.
- Produces: `getDataCoverage`, `getSalesSummary`, `getSalesTimeseries` e `registerCommercialTools`.

- [ ] **Step 1: Semear pedidos controlados e escrever resultados esperados**

Criar fixtures com ADMIN, MANAGER, dois SELLERs, pedidos ativos e cancelados, dois clientes, produtos, origens e formas de pagamento. O recorte de janeiro usa três sábados, `2025-01-04`, `2025-01-11` e `2025-01-18`, com receitas 100, 500 e 300; a fixture histórica completa gera exatamente 86 sábados e inclui um único pico alto para o teste de IQR.

`fixtures.ts` exporta `seedMcpFixtures(adminDb)` com IDs estáveis e `queries.test.ts` cria `callAsAdmin`, `callAsManager`, `callAsSeller` e `rawCallAsAdmin` como wrappers de `invokeMcpTool` usando os quatro tokens determinísticos configurados no `TokenVerifier` fake.

```ts
it("calcula resumo sem pedidos cancelados", async () => {
  const result = await callAsAdmin("jd_sales_summary", { startDate: "2025-01-01", endDate: "2025-01-31" });
  expect(result.data).toEqual({ revenue: 900, orders: 3, averageTicket: 300, items: 7, customers: 2 });
});

it("injeta o próprio seller no resumo", async () => {
  const result = await callAsSeller("jd_sales_summary", { startDate: "2025-01-01", endDate: "2025-01-31" });
  expect(result.meta.appliedSellerId).toBe(seller.id);
  expect(result.data.revenue).toBe(500);
});
```

- [ ] **Step 2: Executar consultas e confirmar ferramenta inexistente**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts`

Expected: FAIL com ferramenta `jd_sales_summary` não encontrada.

- [ ] **Step 3: Implementar filtros SQL parametrizados e selects explícitos**

O serviço usa `Prisma.sql`, sempre adiciona `p.cancelled = false`, adiciona `p."userId" = ${sellerId}` quando houver escopo e usa `EXTRACT(ISODOW FROM p.data_pedido)` para weekday. Nenhum identificador de coluna vem do cliente; `groupBy` e `granularity` são traduzidos por mapas constantes.

Tipos de saída:

```ts
type DataCoverage = { minDate: string | null; maxDate: string | null; orders: number; saleItems: number };
type SalesSummary = { revenue: number; orders: number; averageTicket: number; items: number; customers: number };
type SalesTimeseries = { granularity: "DAY" | "WEEK" | "MONTH"; points: Array<{ period: string; revenue: number; orders: number; items: number }> };
```

Período ausente significa todo o histórico somente em `jd_data_coverage` e nas consultas agregadas comerciais; lista de pedidos continua exigindo período ou paginação válida.

- [ ] **Step 4: Registrar as três ferramentas com schemas de entrada e saída**

`jd_sales_timeseries` exige `granularity`, preenche lacunas diárias quando `DAY`, e serializa semana pelo início civil da semana em `YYYY-MM-DD`. Cada callback chama `executeMcpTool` e devolve resumo como `Faturamento de R$ 900,00 em 3 pedidos.`.

- [ ] **Step 5: Executar consultas e autorização**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/auth-permissions.test.ts`

Expected: PASS para histórico, filtros, cancelados, ADMIN, MANAGER e SELLER.

- [ ] **Step 6: Commit**

```bash
git add src/mcp/commercial src/mcp/server.ts src/tests/integration/mcp
git commit -m "feat: add core commercial MCP tools"
```

### Task 6: Curva ABC, anomalias IQR e rankings

**Files:**
- Modify: `src/mcp/commercial/service.ts`
- Modify: `src/mcp/commercial/register-tools.ts`
- Modify: `src/mcp/core/contracts.ts`
- Modify: `src/tests/integration/mcp/fixtures.ts`
- Modify: `src/tests/integration/mcp/queries.test.ts`
- Modify: `src/tests/integration/mcp/auth-permissions.test.ts`

**Interfaces:**
- Consumes: filtros comerciais e escopo da Task 5.
- Produces: `getSalesAbc`, `getSalesAnomalies` e `getSalesRanking`.

- [ ] **Step 1: Escrever a curva ABC dos sábados e picos fora do comum**

```ts
it("classifica sábados por 80/95 e percentual acumulado", async () => {
  const result = await callAsAdmin("jd_sales_abc", {
    startDate: "2025-01-01", endDate: "2025-12-31", weekday: "SATURDAY", groupBy: "DATE",
  });
  expect(result.data.entries.map(({ date, rank, class: abc }) => ({ date, rank, abc })))
    .toEqual([
      { date: "2025-01-11", rank: 1, abc: "A" },
      { date: "2025-01-18", rank: 2, abc: "B" },
      { date: "2025-01-04", rank: 3, abc: "C" },
    ]);
});

it("marca pico acima de Q3 + 1.5 IQR", async () => {
  const result = await callAsAdmin("jd_sales_anomalies", { weekday: "SATURDAY" });
  expect(result.data.pointsAnalyzed).toBe(86);
  expect(result.data.outliers).toContainEqual(expect.objectContaining({ direction: "HIGH" }));
});
```

- [ ] **Step 2: Executar consultas e confirmar falha das ferramentas ausentes**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts`

Expected: FAIL em `jd_sales_abc`.

- [ ] **Step 3: Implementar agregação, ABC e quartis determinísticos**

```ts
function percentile(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const weight = index - lower;
  return sorted[lower + 1] === undefined
    ? sorted[lower]
    : sorted[lower] + weight * (sorted[lower + 1] - sorted[lower]);
}
```

ABC ordena por receita decrescente, usa chave como desempate, calcula participação e acumulado com precisão interna e arredonda somente na saída. Depois de incluir cada item no acumulado, classifica A quando o percentual acumulado é menor ou igual a 80, B quando é maior que 80 e menor ou igual a 95, e C quando é maior que 95. Total zero devolve `entries: []` e `totalRevenue: 0`.

Anomalias usam Q1 em 0,25, mediana em 0,5 e Q3 em 0,75; limites são `q1 - 1.5 * iqr` e `q3 + 1.5 * iqr`.

- [ ] **Step 4: Implementar ranking com privacidade de SELLER**

Saída:

```ts
type SalesRanking = {
  dimension: "SELLER" | "PRODUCT" | "CUSTOMER";
  entries: Array<{ rank: number; id: string; label: string; revenue: number; orders: number; items: number }>;
};
```

ADMIN/MANAGER recebem todas as linhas. SELLER pode pedir somente `dimension: SELLER`; a consulta usa `RANK() OVER (ORDER BY revenue DESC)` e retorna somente a própria linha. Tentativa de ranking de clientes ou produtos por SELLER gera `FORBIDDEN` para não revelar dados agregados de terceiros.

- [ ] **Step 5: Executar consultas e autorização**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/auth-permissions.test.ts`

Expected: PASS para 80/95, total zero, IQR, sábado, desempate e linha própria do SELLER.

- [ ] **Step 6: Commit**

```bash
git add src/mcp/commercial src/mcp/core/contracts.ts src/tests/integration/mcp
git commit -m "feat: add ABC anomaly and ranking tools"
```

### Task 7: Pedidos e clientes relacionados

**Files:**
- Create: `src/mcp/orders/service.ts`
- Create: `src/mcp/orders/register-tools.ts`
- Modify: `src/mcp/server.ts`
- Modify: `src/mcp/core/contracts.ts`
- Modify: `src/tests/integration/mcp/queries.test.ts`
- Modify: `src/tests/integration/mcp/auth-permissions.test.ts`

**Interfaces:**
- Consumes: `resolveSellerScope`, `executeMcpTool` e filtros comerciais.
- Produces: `listOrders`, `getOrder` e `registerOrderTools`.

- [ ] **Step 1: Escrever paginação e isolamento por vendedor**

```ts
it("pagina pedidos em no máximo 100", async () => {
  const result = await callAsAdmin("jd_list_orders", { page: 1, pageSize: 2 });
  expect(result.data).toMatchObject({ page: 1, pageSize: 2, total: 3, totalPages: 2 });
  expect(result.data.orders).toHaveLength(2);
});

it("nega pedido de outro vendedor ao SELLER", async () => {
  const result = await callAsSeller("jd_get_order", { orderId: otherSellerOrder.id });
  expect(result.error.code).toBe("FORBIDDEN");
});
```

- [ ] **Step 2: Executar e confirmar ferramenta ausente**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/auth-permissions.test.ts`

Expected: FAIL em `jd_list_orders`.

- [ ] **Step 3: Implementar selects explícitos e contrato de pedidos**

`page` inicia em 1, `pageSize` inicia em 25 e aceita 1 a 100. Ordenar por `data_pedido desc, id asc`. Selecionar somente IDs, documento, data, vendedor, cliente relacionado, origem, pagamento e valores necessários; nunca selecionar senha, tokens ou campos de redefinição.

```ts
type OrderListItem = {
  id: string; date: string; documentNumber: string;
  sellerId: string; sellerName: string;
  customerId: string | null; customerName: string | null;
  origin: string | null; paymentMethod: string | null; total: number;
};
```

`getOrder` adiciona itens `{ productId, description, brand, sector, quantity, unitValue, totalValue }`. Pedido inexistente retorna `INVALID_ARGUMENT`; pedido existente fora do escopo do SELLER retorna `FORBIDDEN` sem revelar o conteúdo.

- [ ] **Step 4: Registrar as duas ferramentas e executar os grupos**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/auth-permissions.test.ts src/tests/integration/mcp/contracts.test.ts`

Expected: PASS para paginação, detalhes, clientes relacionados, limite 100 e escopo.

- [ ] **Step 5: Commit**

```bash
git add src/mcp/orders src/mcp/server.ts src/mcp/core/contracts.ts src/tests/integration/mcp
git commit -m "feat: expose scoped order MCP tools"
```

### Task 8: Metas comerciais e metas de ROAS

**Files:**
- Create: `src/mcp/goals/service.ts`
- Create: `src/mcp/goals/register-tools.ts`
- Modify: `src/mcp/server.ts`
- Modify: `src/mcp/core/contracts.ts`
- Modify: `src/services/data-services/get-goal-target.ts`
- Modify: `src/services/data-services/get-marketing-goals.ts`
- Modify: `src/tests/integration/mcp/fixtures.ts`
- Modify: `src/tests/integration/mcp/queries.test.ts`
- Modify: `src/tests/integration/mcp/auth-permissions.test.ts`

**Interfaces:**
- Consumes: serviço comercial, `resolveSellerScope` e `assertMarketingAccess`.
- Produces: `getSalesGoals`, `getRoasGoals` e `registerGoalTools`.

- [ ] **Step 1: Escrever metas realizadas sem cancelados e bloqueio de ROAS**

```ts
it("retorna meta e realizado por vendedor", async () => {
  const result = await callAsManager("jd_sales_goals", { startDate: "2025-01-01", endDate: "2025-01-31" });
  expect(result.data.goals[0]).toMatchObject({ target: 1000, realized: 500, remaining: 500, achievementPercent: 50 });
});

it("bloqueia metas de ROAS para SELLER", async () => {
  const result = await callAsSeller("jd_roas_goals", { startDate: "2025-01-01", endDate: "2025-01-31" });
  expect(result.error.code).toBe("FORBIDDEN");
});
```

- [ ] **Step 2: Executar e confirmar ferramenta ausente**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/auth-permissions.test.ts`

Expected: FAIL em `jd_sales_goals`.

- [ ] **Step 3: Implementar serviços compartilhados e remover duplicação das funções existentes**

Saídas:

```ts
type SalesGoals = { goals: Array<{ sellerId: string; sellerName: string; month: string; target: number; realized: number; remaining: number; achievementPercent: number }> };
type RoasGoals = { goals: Array<{ month: string; targetRoas: number; revenue: number; cost: number; actualRoas: number | null }> };
```

Realizado comercial soma somente `Pedido.cancelled = false`. SELLER recebe somente seu `sellerId`; ADMIN/MANAGER podem filtrar um vendedor ou receber todos. ROAS usa somente origens Google e o `GoogleAdsProvider`, portanto fica restrito a ADMIN/MANAGER.

- [ ] **Step 4: Registrar ferramentas e executar consultas/autorização**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/auth-permissions.test.ts`

Expected: PASS para metas, períodos, cancelados, escopo próprio e bloqueio de ROAS.

- [ ] **Step 5: Commit**

```bash
git add src/mcp/goals src/mcp/server.ts src/mcp/core/contracts.ts src/services/data-services src/tests/integration/mcp
git commit -m "feat: add scoped goal MCP tools"
```

### Task 9: Conta de serviço e provedores Google

**Files:**
- Modify: `src/mcp/marketing/providers.ts`
- Create: `src/mcp/marketing/google-service-account.ts`
- Create: `src/mcp/marketing/google-ads.ts`
- Create: `src/mcp/marketing/google-analytics.ts`
- Create: `src/tests/integration/mcp/fake-google.ts`
- Modify: `src/mcp/core/runtime.ts`
- Modify: `src/tests/integration/mcp/queries.test.ts`
- Modify: `src/tests/integration/mcp/errors.test.ts`

**Interfaces:**
- Consumes: `AbortSignal`, `resolveCivilDateRange` e IDs Google do ambiente.
- Produces: `GoogleUpstreamError`, `validateGoogleRange`, `createGoogleServiceAccountAuth`, `createGoogleAdsProvider` e `createGoogleAnalyticsProvider`.

- [ ] **Step 1: Escrever contratos determinísticos, 24 meses e falha isolada**

```ts
it("rejeita intervalo Google superior a 24 meses", () => {
  expect(() => validateGoogleRange({ startDate: "2023-01-01", endDate: "2025-01-02" }))
    .toThrowError(expect.objectContaining({ code: "INVALID_ARGUMENT" }));
});

it("traduz indisponibilidade Google sem afetar consultas PostgreSQL", async () => {
  fakeGoogleAds.fail(new GoogleUpstreamError("raw provider secret"));
  const failure = await fakeGoogleAds.getPerformance({
    ...january, scope: "products", signal: AbortSignal.timeout(20_000),
  }).catch((error: unknown) => error);
  const safe = toPublicError(failure, randomUUID());
  expect(safe.code).toBe("UPSTREAM_UNAVAILABLE");
  expect((await callAsAdmin("jd_sales_summary", january)).ok).toBe(true);
});
```

- [ ] **Step 2: Executar e confirmar provedores ausentes**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/errors.test.ts`

Expected: FAIL pelos módulos de provider ausentes.

- [ ] **Step 3: Implementar fakes determinísticos conformes às interfaces da Task 1**

```ts
export class FakeGoogleAdsProvider implements GoogleAdsProvider {
  private failure?: Error;
  constructor(private result: Awaited<ReturnType<GoogleAdsProvider["getPerformance"]>>) {}
  fail(error: Error) { this.failure = error; }
  async getPerformance() {
    if (this.failure) throw this.failure;
    return this.result;
  }
}

export class FakeGoogleAnalyticsProvider implements GoogleAnalyticsProvider {
  private failure?: Error;
  constructor(private result: Awaited<ReturnType<GoogleAnalyticsProvider["getPerformance"]>>) {}
  fail(error: Error) { this.failure = error; }
  async getPerformance() {
    if (this.failure) throw this.failure;
    return this.result;
  }
}
```

- [ ] **Step 4: Criar autenticação por segredos e aplicar timeout real**

`google-service-account.ts` converte `\\n` em quebras de linha na chave, não lê arquivo JSON e cria `google.auth.GoogleAuth` com os scopes somente leitura necessários. Google Analytics usa `BetaAnalyticsDataClient` com `GOOGLE_ANALYTICS_PROPERTY_ID`. Google Ads obtém um access token da conta de serviço com o scope `https://www.googleapis.com/auth/adwords` e chama por POST `https://googleads.googleapis.com/v25/customers/{customerId}/googleAds:searchStream`, enviando `authorization`, `developer-token` e, quando aplicável, `login-customer-id`; a versão fica explícita como `GOOGLE_ADS_API_VERSION=25`. Toda Promise externa participa de `Promise.race` com 20 segundos e recebe `AbortSignal`; falhas são encapsuladas em `GoogleUpstreamError` sem mensagem bruta pública.

- [ ] **Step 5: Executar os dois grupos**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/errors.test.ts`

Expected: PASS com fakes, limite de 24 meses, timeout e isolamento do PostgreSQL.

- [ ] **Step 6: Commit**

```bash
git add src/mcp/marketing src/mcp/core/runtime.ts src/tests/integration/mcp
git commit -m "feat: add Google service account providers"
```

### Task 10: Marketing, Google Ads e Google Analytics no MCP

**Files:**
- Create: `src/mcp/marketing/service.ts`
- Create: `src/mcp/marketing/register-tools.ts`
- Modify: `src/mcp/server.ts`
- Create: `src/app/api/mcp/route.ts`
- Modify: `src/mcp/core/contracts.ts`
- Modify: `src/tests/integration/mcp/fixtures.ts`
- Modify: `src/tests/integration/mcp/queries.test.ts`
- Modify: `src/tests/integration/mcp/auth-permissions.test.ts`
- Modify: `src/tests/integration/mcp/contracts.test.ts`

**Interfaces:**
- Consumes: os dois providers da Task 9, `assertMarketingAccess` e dados `MetaInvestment`/`Pedido`.
- Produces: `getMarketingOverview`, `getGoogleAdsPerformance`, `getGoogleAnalyticsPerformance` e `registerMarketingTools`.

- [ ] **Step 1: Escrever os resultados de marketing e as proibições de SELLER**

```ts
it("consolida investimento, receita atribuída e ROAS", async () => {
  const result = await callAsAdmin("jd_marketing_overview", january);
  expect(result.data).toEqual({
    period: january, metaSpend: 100, googleAdsSpend: 200,
    totalSpend: 300, attributedRevenue: 900, roas: 3,
  });
});

it.each(["jd_marketing_overview", "jd_google_ads_performance", "jd_google_analytics_performance"])("bloqueia %s para SELLER", async (tool) => {
  expect((await callAsSeller(tool, january)).error.code).toBe("FORBIDDEN");
});
```

- [ ] **Step 2: Executar e confirmar ferramentas ausentes**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/auth-permissions.test.ts`

Expected: FAIL em `jd_marketing_overview`.

- [ ] **Step 3: Implementar consolidação e os três contratos**

`jd_marketing_overview` soma Meta e Google, calcula receita somente de pedidos não cancelados com origem Google ou Meta e retorna ROAS zero quando custo total for zero. As ferramentas Google repassam somente campos das interfaces da Task 9 e nunca o payload bruto dos SDKs.

- [ ] **Step 4: Registrar as três ferramentas e validar todos os nomes**

Criar o runtime de produção em `src/app/api/mcp/route.ts` com `mcpPrisma`, `createDescopeTokenVerifier`, `createGoogleAdsProvider`, `createGoogleAnalyticsProvider` e `now: () => new Date()`, então exportar o handler autenticado como GET e POST.

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/auth-permissions.test.ts src/tests/integration/mcp/contracts.test.ts`

Expected: PASS e `tools/list` contém exatamente `MCP_TOOL_NAMES`, sem ferramentas mutáveis.

- [ ] **Step 5: Commit**

```bash
git add src/mcp/marketing src/mcp/server.ts src/mcp/core/contracts.ts src/app/api/mcp/route.ts src/tests/integration/mcp
git commit -m "feat: expose marketing MCP tools"
```

### Task 11: Contratos completos, resposta de 1 MB e erros públicos

**Files:**
- Modify: `src/mcp/core/contracts.ts`
- Modify: `src/mcp/core/response.ts`
- Modify: `src/mcp/core/errors.ts`
- Modify: `src/tests/integration/mcp/contracts.test.ts`
- Modify: `src/tests/integration/mcp/errors.test.ts`

**Interfaces:**
- Consumes: todos os tipos de saída das Tasks 5 a 10.
- Produces: `outputSchema` para cada ferramenta e envelope MCP final estável.

- [ ] **Step 1: Adicionar tabela de casos válidos e inválidos para as 13 ferramentas**

```ts
it.each([
  ["jd_sales_summary", { startDate: "2025-02-01", endDate: "2025-01-01" }],
  ["jd_sales_timeseries", { granularity: "YEAR" }],
  ["jd_list_orders", { page: 0, pageSize: 101 }],
  ["jd_get_order", { orderId: "not-a-uuid" }],
])("retorna INVALID_ARGUMENT para %s", async (tool, input) => {
  const result = await callAsAdmin(tool, input);
  expect(result.error.code).toBe("INVALID_ARGUMENT");
});

it("retorna texto curto e structuredContent", async () => {
  const result = await rawCallAsAdmin("jd_sales_summary", january);
  expect(result.content).toEqual([expect.objectContaining({ type: "text" })]);
  expect(result.structuredContent).toMatchObject({ ok: true, requestId: expect.any(String), data: expect.any(Object) });
});

it.each(["2026-07-28", "2025-11-25"])("aceita inicialização MCP %s", async (protocolVersion) => {
  const response = await initializeMcp(handler, adminToken, protocolVersion);
  expect(response.result.protocolVersion).toBeTruthy();
});
```

- [ ] **Step 2: Executar contratos e observar falhas de schemas incompletos**

Run: `npm run test:integration -- src/tests/integration/mcp/contracts.test.ts src/tests/integration/mcp/errors.test.ts`

Expected: FAIL nos casos ainda aceitos ou sem `structuredContent` validado.

- [ ] **Step 3: Completar schemas Zod de entrada e saída**

Cada `registerTool` recebe `inputSchema` e `outputSchema`. Datas são civis válidas, UUIDs são validados, páginas são inteiras, `pageSize` fica entre 1 e 100, Google exige as duas datas e no máximo 24 meses. Valores monetários são `z.number().finite()`. Resposta de erro sempre possui apenas `ok`, `requestId` e `error`.

- [ ] **Step 4: Aplicar o limite serializado**

```ts
const bytes = Buffer.byteLength(JSON.stringify(structuredContent), "utf8");
if (bytes > 1_000_000) {
  throw new McpPublicError(
    "INVALID_ARGUMENT",
    "A resposta excede 1 MB; reduza o período ou use paginação.",
  );
}
```

Adicionar casos que forçam payload acima de 1 MB e verificam ausência de stack, SQL, URL de banco, token e texto bruto Google.

- [ ] **Step 5: Executar os grupos**

Run: `npm run test:integration -- src/tests/integration/mcp/contracts.test.ts src/tests/integration/mcp/errors.test.ts`

Expected: PASS para todas as entradas, saídas, limites e sete códigos públicos.

- [ ] **Step 6: Commit**

```bash
git add src/mcp/core src/tests/integration/mcp/contracts.test.ts src/tests/integration/mcp/errors.test.ts
git commit -m "feat: finalize MCP contracts and errors"
```

### Task 12: Converter rotas atuais em adaptadores finos

**Files:**
- Modify: `src/app/api/services/data-services/comercial-big-numbers/route.ts`
- Modify: `src/app/api/services/data-services/comercial-rankings/route.ts`
- Modify: `src/app/api/services/data-services/tracking-goal/route.ts`
- Modify: `src/app/api/services/data-services/goals-current/route.ts`
- Modify: `src/app/api/services/google-services/get-ads-data/route.ts`
- Modify: `src/app/api/services/google-services/top-ads/route.ts`
- Modify: `src/app/api/services/google-services/top-keywords/route.ts`
- Modify: `src/app/api/services/google-services/get-analytics-data/route.ts`
- Modify: `src/services/marketing-spend/google.ts`
- Modify: `src/services/marketing-report/get-marketing-report-aggregate.ts`
- Modify: `src/tests/integration/mcp/queries.test.ts`
- Modify: `src/tests/integration/mcp/errors.test.ts`

**Interfaces:**
- Consumes: serviços comerciais, metas e providers Google já aprovados.
- Produces: rotas Next.js sem lógica analítica duplicada nem mensagens brutas de provedor.

- [ ] **Step 1: Adicionar casos de integração das rotas ao grupo de consultas**

Testar as rotas chamando suas funções GET com `NextRequest`, banco sintético e fakes Google. Para o mesmo intervalo, comparar os campos compartilhados de receita, ranking, metas e métricas Google com o resultado da ferramenta MCP correspondente.

- [ ] **Step 2: Executar consultas e capturar a divergência atual**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts`

Expected: FAIL porque as rotas antigas ainda incluem lógica duplicada e algumas não excluem cancelados.

- [ ] **Step 3: Substituir a lógica das rotas por adaptação de entrada e saída**

Cada rota deve: validar search params, montar input tipado, chamar o mesmo serviço usado pelo MCP, converter o resultado para o JSON legado e definir status HTTP. Não deve instanciar `GoogleAdsApi`, `BetaAnalyticsDataClient`, consultar tokens de `Organization` nem executar agregações Prisma próprias.

- [ ] **Step 4: Remover vazamento de erro e uso do OAuth Google antigo nesses caminhos**

Eliminar `console.log(error)` e concatenação com `JSON.stringify(error)`. Logs podem conter somente `requestId`, nome do serviço e código seguro. `src/services/marketing-spend/google.ts` passa a chamar `GoogleAdsProvider.getPerformance`; o relatório agregado chama `getMarketingOverview`.

- [ ] **Step 5: Executar consultas, erros e regressão existente**

Run: `npm run test:integration -- src/tests/integration/mcp/queries.test.ts src/tests/integration/mcp/errors.test.ts && npm test`

Expected: PASS, inclusive testes unitários existentes, sem criar novos testes unitários.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/services src/services/marketing-spend/google.ts src/services/marketing-report/get-marketing-report-aggregate.ts src/tests/integration/mcp
git commit -m "refactor: share analytics services with MCP"
```

### Task 13: Role PostgreSQL, rollout seguro e verificação final

**Files:**
- Modify: `prisma/security/jd_mcp_role.sql`
- Modify: `.env.example`
- Create: `docs/mcp/deployment.md`
- Modify: `src/tests/integration/mcp/contracts.test.ts`

**Interfaces:**
- Consumes: tabelas e lista de variáveis das tarefas anteriores.
- Produces: grants reproduzíveis e runbook operacional de desenvolvimento, produção e rollback.

- [ ] **Step 1: Adicionar teste de integração dos grants mínimos**

Com `MCP_TEST_DATABASE_URL` apontando para um usuário membro de `jd_mcp`, verificar que SELECT explícito de `User.id`, `User.externalId`, `User.role` e `User.isActive` funciona; SELECT de `User.password`, `PasswordResetToken`, `PasswordResetRateLimit` e `Organization.googleRefreshToken` falha; INSERT na auditoria e operações nas tabelas de limite funcionam; UPDATE/DELETE em `Pedido` falham.

- [ ] **Step 2: Executar contratos e confirmar grants ainda incompletos**

Run: `npm run test:integration -- src/tests/integration/mcp/contracts.test.ts`

Expected: FAIL no primeiro privilégio incompatível.

- [ ] **Step 3: Finalizar o SQL de grants por coluna**

`jd_mcp_role.sql` cria a role de grupo `jd_mcp NOLOGIN`, revoga privilégios herdados, concede USAGE no schema, SELECT somente nas colunas usadas de `User`, `Pedido`, `SaleItem`, `Product`, `Customer`, `PaymentMethod`, `Origin`, `SalesGoal`, `RoasGoal` e `MetaInvestment`, INSERT em `McpAuditLog`, e SELECT/INSERT/UPDATE/DELETE apenas em `McpRateLimitBucket` e `McpRequestLease`. Não conceder UPDATE ou DELETE em tabelas de negócio.

- [ ] **Step 4: Escrever o runbook com gates verificáveis**

`docs/mcp/deployment.md` deve conter, nesta ordem:

1. Criar o projeto Descope, audience do MCP, scope `mcp:read`, BYOA apontando para `/mcp/authorize`, CIMD e DCR legado apenas quando necessário.
2. Criar o login PostgreSQL de produção, conceder membership em `jd_mcp` e configurar `MCP_DATABASE_URL`.
3. Conceder leitura da propriedade GA4 e das duas contas Google Ads à conta de serviço; configurar developer token e IDs.
4. Rodar consultas de validação GA4 e Google Ads em desenvolvimento e produção sem trocar ainda o adaptador antigo.
5. Configurar segredos do ambiente e publicar `/api/mcp` e o metadata endpoint.
6. Validar login e ferramentas com um ADMIN, um MANAGER e um SELLER ativos; desativar temporariamente o usuário de teste e confirmar `FORBIDDEN`.
7. Confirmar por inventário que não existe consumidor externo da Supabase Data API; desativá-la se não existir, ou aplicar RLS, revogações e políticas mínimas se existir.
8. Trocar rotas Google para conta de serviço, monitorar erros e manter os tokens antigos intactos durante a janela de validação.
9. Desativar a conexão Google manual somente depois da validação completa.
10. Tratar a remoção dos campos `googleAccessToken`, `googleRefreshToken`, `googleScopes` e `googleExpiresAt` como migração posterior independente.
11. Rollback: reverter o adaptador Google, manter endpoint MCP indisponível e preservar tokens antigos; não reabrir grants de banco.

- [ ] **Step 5: Executar toda a verificação aprovada**

Run: `npm run test:integration && npm test && npm run lint && npm run build`

Expected: PASS. `npm run test:integration` encontra exatamente os quatro arquivos `auth-permissions.test.ts`, `queries.test.ts`, `errors.test.ts` e `contracts.test.ts`.

- [ ] **Step 6: Confirmar ausência de arquivos e padrões proibidos**

Run: `find src/tests/integration/mcp -name '*.test.ts' -printf '%f\n' | sort && rg -n 'googleRefreshToken|User\.password|JSON\.stringify\(error\)|console\.log\(error\)' src/mcp src/app/api/mcp`

Expected: a primeira parte lista exatamente quatro arquivos; a segunda não retorna correspondências.

- [ ] **Step 7: Commit**

```bash
git add prisma/security/jd_mcp_role.sql .env.example docs/mcp/deployment.md src/tests/integration/mcp/contracts.test.ts
git commit -m "docs: add MCP security rollout runbook"
```

## Final Acceptance Checklist

- [ ] Um cliente MCP genérico descobre o servidor pelo metadata endpoint e lista exatamente 13 ferramentas.
- [ ] O login usa a conta atual do JD Analytics e o Descope emite token com audience correta e `mcp:read`.
- [ ] `sub` é mapeado por `User.externalId`; role e `isActive` são recarregados em toda chamada.
- [ ] ADMIN e MANAGER recebem o escopo completo permitido.
- [ ] SELLER recebe somente dados próprios e não acessa marketing, GA4, Google Ads ou ROAS.
- [ ] Todos os cálculos excluem pedidos cancelados.
- [ ] ABC dos sábados segue 80/95 e anomalias usam `Q1 - 1.5 IQR` e `Q3 + 1.5 IQR`.
- [ ] Google usa conta de serviço, developer token e timeout de 20 segundos.
- [ ] Auditoria não contém PII, tokens, pedidos integrais ou respostas completas.
- [ ] Rate limit, leases, 1 MB, paginação e timeouts funcionam entre instâncias.
- [ ] A role PostgreSQL não lê senha, resets ou tokens antigos e não altera dados de negócio.
- [ ] Data API está desativada sem consumidores, ou protegida por RLS e grants mínimos.
- [ ] Somente os quatro grupos de testes de integração aprovados foram adicionados.
