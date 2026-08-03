# Admin Table Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Paginar todas as listas administrativas mapeadas com cinco itens por padrão e permitir a seleção de 5, 10, 20, 30, 40 ou 50 itens.

**Architecture:** Um hook fará o recorte das listas simples no cliente, e um controlador visual único conectará tanto esse hook quanto as tabelas TanStack aos primitives de `src/components/ui/pagination.tsx`. A paginação continuará inteiramente client-side e não alterará APIs, banco, rankings Top 5 nem a paginação operacional da Linx.

**Tech Stack:** React 18, Next.js 15 App Router, TypeScript, TanStack Table v8, Radix Select, shadcn/ui, Vitest 4 e Testing Library.

## Global Constraints

- O tamanho inicial é 5 em todas as cinco listas administrativas do escopo.
- O seletor oferece exatamente 5, 10, 20, 30, 40 e 50 itens.
- Alterar o tamanho retorna à primeira página.
- Reduzir os dados ou aplicar filtros limita a página atual a uma página válida.
- O histórico comercial pagina competências, não vendedores internos.
- A ordem de entrada dos dados é preservada.
- Controles ficam ocultos quando a lista contém no máximo cinco itens.
- Não alterar endpoints, consultas ao banco, paginação Linx ou rankings Top 5.
- Não criar worktree, não reescrever commits existentes e não desfazer commits manuais.

---

## File Map

- Create `src/hooks/use-client-pagination.ts`: estado e recorte reutilizável para arrays.
- Create `src/components/ui/table-pagination.tsx`: seletor e navegação visual compartilhados.
- Modify `src/components/ui/pagination.tsx`: rótulos acessíveis em português.
- Modify `src/app/dashboard/(admin)/goals-marketing/_components/history-marketing-goals.tsx`: paginação do histórico mensal.
- Modify `src/app/dashboard/(admin)/goals-comercial/_components/history-goals.tsx`: paginação dos accordions mensais.
- Modify `src/app/dashboard/(admin)/meta-investments/_components/meta-investments-table.tsx`: paginação dos investimentos.
- Modify `src/app/dashboard/(admin)/_components/data-table-pagination.tsx`: adaptar TanStack ao controlador compartilhado.
- Modify `src/app/dashboard/(admin)/_components/data-table.tsx`: tamanho inicial 5 para usuários.
- Modify `src/app/dashboard/(admin)/_components/data-table-current-goal/data-table.tsx`: tamanho inicial 5 e controles visíveis.
- Create four test files under `src/tests/unit/components/`: comportamento compartilhado e integrações das cinco listas.

---

### Task 1: Shared pagination state and controls

**Files:**
- Create: `src/hooks/use-client-pagination.ts`
- Create: `src/components/ui/table-pagination.tsx`
- Modify: `src/components/ui/pagination.tsx`
- Test: `src/tests/unit/components/table-pagination.test.ts`

**Interfaces:**
- Produces: `DEFAULT_PAGE_SIZE = 5`, `PAGE_SIZE_OPTIONS`, `useClientPagination<T>(items, initialPageSize?)`.
- Produces: `TablePagination(props)` with zero-based `pageIndex` and `onPageChange`.
- Consumes: existing `Pagination*` primitives and Radix `Select` wrappers.

- [ ] **Step 1: Write failing tests for five-item slicing, navigation, page-size reset and controls**

Use a jsdom test and a small harness that exposes real hook behavior:

```ts
// @vitest-environment jsdom
import { createElement } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TablePagination } from '@/components/ui/table-pagination';
import { useClientPagination } from '@/hooks/use-client-pagination';

function Harness({ items }: { items: string[] }) {
  const pagination = useClientPagination(items);
  return createElement('div', null,
    createElement('output', null, pagination.pageItems.join(',')),
    createElement('button', { onClick: () => pagination.setPageIndex(1) }, 'ir à página 2'),
    createElement('button', { onClick: () => pagination.setPageSize(10) }, 'mostrar 10'),
  );
}

afterEach(cleanup);

it('shows five items by default and resets to page one after changing page size', () => {
  render(createElement(Harness, { items: ['1','2','3','4','5','6','7','8','9','10','11'] }));
  expect(screen.getByText('1,2,3,4,5')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'ir à página 2' }));
  expect(screen.getByText('6,7,8,9,10')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'mostrar 10' }));
  expect(screen.getByText('1,2,3,4,5,6,7,8,9,10')).toBeTruthy();
});

it('renders Portuguese numbered navigation and disables the previous action on page one', () => {
  const onPageChange = vi.fn();
  render(createElement(TablePagination, {
    pageIndex: 0, pageSize: 5, pageCount: 3, totalItems: 11,
    onPageChange, onPageSizeChange: vi.fn(),
  }));
  expect(screen.getByRole('navigation', { name: 'Paginação' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Página 1' }).getAttribute('aria-current')).toBe('page');
  expect(screen.getByRole('link', { name: 'Página anterior' }).getAttribute('aria-disabled')).toBe('true');
  fireEvent.click(screen.getByRole('link', { name: 'Página 2' }));
  expect(onPageChange).toHaveBeenCalledWith(1);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/tests/unit/components/table-pagination.test.ts`

Expected: FAIL because `table-pagination` and `use-client-pagination` do not exist.

- [ ] **Step 3: Implement the hook with clamped zero-based pagination**

Implement this public shape:

```ts
export const DEFAULT_PAGE_SIZE = 5;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 40, 50] as const;

export function useClientPagination<T>(items: readonly T[], initialPageSize = DEFAULT_PAGE_SIZE) {
  const [pageIndex, setStoredPageIndex] = useState(0);
  const [pageSize, setStoredPageSize] = useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);

  useEffect(() => setStoredPageIndex((current) => Math.min(current, pageCount - 1)), [pageCount]);

  const setPageIndex = (next: number) =>
    setStoredPageIndex(Math.min(Math.max(next, 0), pageCount - 1));
  const setPageSize = (next: number) => {
    setStoredPageSize(next);
    setStoredPageIndex(0);
  };

  return {
    pageIndex: safePageIndex,
    pageSize,
    pageCount,
    pageItems: items.slice(safePageIndex * pageSize, (safePageIndex + 1) * pageSize),
    setPageIndex,
    setPageSize,
  };
}
```

- [ ] **Step 4: Implement the shared UI on top of `pagination.tsx`**

`TablePagination` must return `null` for `totalItems <= 5`, render numbered links with stable keys and ellipses for long ranges, prevent anchor navigation, expose `aria-disabled`, and call `onPageSizeChange(Number(value))`. Translate the primitive labels/text to `Paginação`, `Página anterior`, `Anterior`, `Próxima página`, `Próxima` and `Mais páginas`.

Use this exact prop contract:

```ts
export interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalItems: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}
```

For page numbers, show all pages when `pageCount <= 7`; otherwise show the first page, last page, current page and its immediate neighbors, inserting start/end ellipses only where a numeric gap exists.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `npm test -- src/tests/unit/components/table-pagination.test.ts`

Expected: PASS with no React accessibility or key warnings.

- [ ] **Step 6: Commit the shared primitive**

```bash
git add src/hooks/use-client-pagination.ts src/components/ui/pagination.tsx src/components/ui/table-pagination.tsx src/tests/unit/components/table-pagination.test.ts
git commit -m "feat: add shared admin table pagination"
```

---

### Task 2: Paginate marketing and commercial goal histories

**Files:**
- Modify: `src/app/dashboard/(admin)/goals-marketing/_components/history-marketing-goals.tsx`
- Modify: `src/app/dashboard/(admin)/goals-comercial/_components/history-goals.tsx`
- Test: `src/tests/unit/components/goals-history-pagination.test.ts`

**Interfaces:**
- Consumes: `useClientPagination(history)` and `TablePagination` from Task 1.
- Produces: five marketing table rows or five commercial month accordions per page.

- [ ] **Step 1: Write failing integration tests for both histories**

Mock `React.use` with the fulfilled-promise helper already used by `marketing-roas-null.test.ts`. Build six uniquely labeled marketing months and six commercial months. Open the marketing history accordion, assert the first five labels are present and the sixth is absent, click `Próxima página`, then assert the inverse. For commercial history, assert five accordion triggers, navigate, and assert only the sixth month remains.

Core assertions:

```ts
expect(screen.getByText('2026-06')).toBeTruthy();
expect(screen.queryByText('2026-01')).toBeNull();
fireEvent.click(screen.getByRole('link', { name: 'Próxima página' }));
expect(screen.getByText('2026-01')).toBeTruthy();
expect(screen.queryByText('2026-06')).toBeNull();

expect(screen.getAllByRole('button', { name: /\/26$/ })).toHaveLength(5);
fireEvent.click(screen.getByRole('link', { name: 'Próxima página' }));
expect(screen.getByRole('button', { name: '01/26' })).toBeTruthy();
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/tests/unit/components/goals-history-pagination.test.ts`

Expected: FAIL because all six records are still rendered and navigation is absent.

- [ ] **Step 3: Implement marketing history slicing**

Immediately after validating `history`, call `useClientPagination(history)`, replace `history.map` with `pageItems.map`, use `item.goalDateRef` as the row key, and render `TablePagination` below the table with the hook values and setters.

- [ ] **Step 4: Implement commercial history slicing**

Call `useClientPagination(history)`, replace `history.map` with `pageItems.map`, use `item.month` for `AccordionItem.key` and `value`, and render `TablePagination` after the accordion. Keep every seller in the selected month together and use a stable seller key composed from month and seller name.

- [ ] **Step 5: Run focused and existing ROAS component tests**

Run: `npm test -- src/tests/unit/components/goals-history-pagination.test.ts src/tests/unit/components/marketing-roas-null.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit both goal histories**

```bash
git add 'src/app/dashboard/(admin)/goals-marketing/_components/history-marketing-goals.tsx' 'src/app/dashboard/(admin)/goals-comercial/_components/history-goals.tsx' src/tests/unit/components/goals-history-pagination.test.ts
git commit -m "feat: paginate administrative goal histories"
```

---

### Task 3: Paginate Meta investment history

**Files:**
- Modify: `src/app/dashboard/(admin)/meta-investments/_components/meta-investments-table.tsx`
- Test: `src/tests/unit/components/meta-investments-pagination.test.ts`

**Interfaces:**
- Consumes: `useClientPagination(investments)` and `TablePagination`.
- Produces: five investment rows per page while preserving edit dialogs.

- [ ] **Step 1: Write a failing six-investment integration test**

Mock `MetaInvestmentForm` to an inert component, create six valid `MetaInvestment` objects with unique period strings, render the table, assert five edit buttons and absence of the sixth period, navigate forward, and assert the sixth period and one edit button.

```ts
expect(screen.getAllByRole('button', { name: 'Editar investimento' })).toHaveLength(5);
expect(screen.queryByText('01/01 - 31/01')).toBeNull();
fireEvent.click(screen.getByRole('link', { name: 'Próxima página' }));
expect(screen.getByText('01/01 - 31/01')).toBeTruthy();
```

The production edit icon button must gain `aria-label='Editar investimento'` so the action is identifiable to keyboard and assistive-technology users.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/tests/unit/components/meta-investments-pagination.test.ts`

Expected: FAIL because six rows render and navigation is absent.

- [ ] **Step 3: Implement pagination without changing dialog state semantics**

Call `useClientPagination(investments)`, render `pageItems`, keep `openId` keyed by investment ID, place `Table` and `TablePagination` inside a fragment or wrapper, and pass total count plus hook callbacks to the controller.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/tests/unit/components/meta-investments-pagination.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit Meta history pagination**

```bash
git add 'src/app/dashboard/(admin)/meta-investments/_components/meta-investments-table.tsx' src/tests/unit/components/meta-investments-pagination.test.ts
git commit -m "feat: paginate Meta investment history"
```

---

### Task 4: Normalize TanStack tables to five rows

**Files:**
- Modify: `src/app/dashboard/(admin)/_components/data-table-pagination.tsx`
- Modify: `src/app/dashboard/(admin)/_components/data-table.tsx`
- Modify: `src/app/dashboard/(admin)/_components/data-table-current-goal/data-table.tsx`
- Test: `src/tests/unit/components/admin-data-table-pagination.test.ts`

**Interfaces:**
- Consumes: TanStack `table.getState().pagination`, `getPageCount`, `setPageIndex`, `setPageSize` and shared `TablePagination`.
- Produces: users and current commercial goals starting at five rows with visible controls.

- [ ] **Step 1: Write failing tests for both generic TanStack tables**

For the current-goals table, use six simple rows and a minimal `ColumnDef`, render from a fulfilled promise, assert five values, navigate next and assert the sixth. For the users table, mock `FormCreate`, provide six user-shaped rows matching the supplied columns, and assert five rows plus the page-size selector value `5`.

```ts
const columns = [{ accessorKey: 'name', header: 'Nome' }];
expect(screen.getAllByRole('row')).toHaveLength(6); // header + five records
fireEvent.click(screen.getByRole('link', { name: 'Próxima página' }));
expect(screen.getByText('Registro 6')).toBeTruthy();
expect(screen.queryByText('Registro 1')).toBeNull();
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/tests/unit/components/admin-data-table-pagination.test.ts`

Expected: FAIL because TanStack defaults to ten and current goals render no controls.

- [ ] **Step 3: Adapt the existing TanStack pagination component**

Replace its duplicated Select/buttons with:

```ts
<TablePagination
  pageIndex={table.getState().pagination.pageIndex}
  pageSize={table.getState().pagination.pageSize}
  pageCount={table.getPageCount()}
  totalItems={table.getFilteredRowModel().rows.length}
  onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
  onPageSizeChange={(pageSize) => {
    table.setPageSize(pageSize);
    table.setPageIndex(0);
  }}
/>
```

- [ ] **Step 4: Set both TanStack defaults and expose current-goals controls**

Add this to both `useReactTable` calls:

```ts
initialState: {
  pagination: { pageIndex: 0, pageSize: 5 },
},
```

Render `<DataTablePagination table={table} />` below the current-goals table. Preserve sorting/filtering and allow TanStack's client-side auto-reset of `pageIndex` when filters change.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- src/tests/unit/components/admin-data-table-pagination.test.ts src/tests/unit/components/table-pagination.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit TanStack normalization**

```bash
git add 'src/app/dashboard/(admin)/_components/data-table-pagination.tsx' 'src/app/dashboard/(admin)/_components/data-table.tsx' 'src/app/dashboard/(admin)/_components/data-table-current-goal/data-table.tsx' src/tests/unit/components/admin-data-table-pagination.test.ts
git commit -m "feat: normalize admin tables to five rows"
```

---

### Task 5: Full verification and repository hygiene

**Files:**
- Review only: all files changed in Tasks 1–4.
- Remove only generated artifacts created by verification: `.next`, `coverage`, `tsconfig.tsbuildinfo`, if present.

**Interfaces:**
- Consumes: completed feature.
- Produces: verified, clean working tree changes without rewriting any prior commit.

- [ ] **Step 1: Run every focused pagination test together**

Run:

```bash
npm test -- src/tests/unit/components/table-pagination.test.ts src/tests/unit/components/goals-history-pagination.test.ts src/tests/unit/components/meta-investments-pagination.test.ts src/tests/unit/components/admin-data-table-pagination.test.ts
```

Expected: all pagination tests PASS without console warnings.

- [ ] **Step 2: Run the full unit suite**

Run: `npm test`

Expected: all unit tests PASS.

- [ ] **Step 3: Verify types, lint and whitespace**

Run each command separately:

```bash
npx tsc --noEmit --pretty false
npx eslint src
git diff --check
```

Expected: exit code 0 for all commands.

- [ ] **Step 4: Review scope and generated artifacts**

Run:

```bash
git status --short
git diff --stat HEAD~4
```

Confirm no API, Prisma, Linx pagination or Top 5 file changed. Delete only `.next`, `coverage` and `tsconfig.tsbuildinfo` if the preceding commands generated them.

- [ ] **Step 5: Report verification without creating an empty commit**

Record the passing test counts, typecheck, lint and `git diff --check` results in the handoff. If verification reveals a defect, return to the task that owns that behavior, add a failing regression test there, implement the correction and use that task's explicit `git add` file list; otherwise leave the four feature commits unchanged.
