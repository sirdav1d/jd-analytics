# Button Loading Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace each affected button's idle icon with an animated spinner while its existing loading state is active.

**Architecture:** Keep the behavior local to `DataSyncControl` and the dashboard `Filter`. Each component derives its icon directly from its existing loading boolean, while the shared `Button` API, labels, sizing, and disabled behavior remain unchanged.

**Tech Stack:** Next.js 16, React 18, TypeScript, Lucide React, Vitest, Testing Library

## Global Constraints

- Change only `DataSyncControl` and the dashboard `Filter`; do not modify the global `Button` component.
- Preserve the labels “Sincronizar dados” and “Buscar”.
- Preserve the current button dimensions, alignment, and disabled rules.
- Render exactly one icon in each button: the idle icon or `Loader2` with `animate-spin`.
- Keep each button's accessible name stable during loading.

---

### Task 1: Synchronization button spinner

**Files:**
- Modify: `src/tests/unit/components/data-sync-control.test.ts:154-192`
- Modify: `src/components/data-sync-control.tsx:9,136-153`

**Interfaces:**
- Consumes: React Query's existing `isMutating` boolean and `status.data?.running` server flag.
- Produces: A local `isLoading: boolean` used for both the disabled state and the rendered icon in both `DataSyncControl` variants.

- [ ] **Step 1: Write the failing test**

Extend the existing `shares loading and refreshes after complete success` test so it proves the icon transition before resolving the request:

```tsx
const buttons = await screen.findAllByRole("button", {
  name: "Sincronizar dados",
});
for (const button of buttons) {
  expect(button.querySelector(".lucide-refresh-cw")).not.toBeNull();
  expect(button.querySelector(".animate-spin")).toBeNull();
}

fireEvent.click(buttons[0]);
await waitFor(() => {
  for (const button of screen.getAllByRole("button", {
    name: "Sincronizar dados",
  })) {
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    expect(button.querySelector(".lucide-refresh-cw")).toBeNull();
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npx vitest run src/tests/unit/components/data-sync-control.test.ts
```

Expected: FAIL because the loading buttons still contain `.lucide-refresh-cw` and do not contain `.animate-spin`.

- [ ] **Step 3: Implement the minimal synchronization icon change**

Import `Loader2` with the idle icon:

```tsx
import { Loader2, RefreshCw } from "lucide-react";
```

Derive one loading boolean and use it in the existing disabled rule and icon slot:

```tsx
const isMutating = useIsMutating({ mutationKey: SYNC_MUTATION_KEY }) > 0;
const unavailable = status.isError;
const isRunning = status.data?.running === true;
const isLoading = isMutating || isRunning;

// ...

<Button
  type="button"
  className={cn(variant === "mobile" && "w-full")}
  disabled={isLoading}
  onClick={() => mutation.mutate()}
>
  {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
  Sincronizar dados
</Button>
```

- [ ] **Step 4: Run the synchronization component tests**

Run:

```bash
npx vitest run src/tests/unit/components/data-sync-control.test.ts
```

Expected: all `DataSyncControl` tests PASS with no warnings or unhandled errors.

- [ ] **Step 5: Commit the synchronization button change**

```bash
git add src/components/data-sync-control.tsx src/tests/unit/components/data-sync-control.test.ts
git commit -m "feat: show spinner while data sync runs"
```

### Task 2: Dashboard search button spinner

**Files:**
- Modify: `src/tests/unit/components/dashboard-filter.test.ts:9-92`
- Modify: `src/app/dashboard/_components/filter.tsx:7,60-67`

**Interfaces:**
- Consumes: The dashboard filter's existing `isPending: boolean` returned by `useTransition`.
- Produces: Conditional rendering of `Loader2` or `Search` in the existing “Buscar” button; no new exported API.

- [ ] **Step 1: Add a controllable transition state to the test**

Add a hoisted state alongside the router mocks and mock only `useTransition`, delegating every other React export to the real module:

```tsx
const transition = vi.hoisted(() => ({ isPending: false }));

vi.mock('react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react')>();
	return {
		...actual,
		useTransition: () => [
			transition.isPending,
			(callback: () => void) => callback(),
		],
	};
});
```

Reset `transition.isPending` in the existing setup:

```tsx
beforeEach(() => {
	vi.clearAllMocks();
	transition.isPending = false;
	params.value = new URLSearchParams(
		'startDate=2026-08-01&endDate=2026-08-03&view=summary',
	);
});
```

- [ ] **Step 2: Write the failing search icon test**

Add this component test:

```tsx
it('replaces the search icon with a spinner while navigation is pending', () => {
	const idle = render(createElement(Filter));
	const idleButton = screen.getByRole('button', { name: 'Buscar' });
	expect(idleButton.querySelector('.lucide-search')).not.toBeNull();
	expect(idleButton.querySelector('.animate-spin')).toBeNull();
	idle.unmount();

	transition.isPending = true;
	render(createElement(Filter));
	const pendingButton = screen.getByRole('button', { name: 'Buscar' });
	expect((pendingButton as HTMLButtonElement).disabled).toBe(true);
	expect(pendingButton.querySelector('.animate-spin')).not.toBeNull();
	expect(pendingButton.querySelector('.lucide-search')).toBeNull();
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:

```bash
npx vitest run src/tests/unit/components/dashboard-filter.test.ts
```

Expected: FAIL because the pending “Buscar” button still contains `.lucide-search` and has no `.animate-spin` element.

- [ ] **Step 4: Implement the minimal search icon change**

Import the spinner and conditionally render the existing icon slot:

```tsx
import { Loader2, Search } from 'lucide-react';

// ...

<Button
	onClick={(e) => handleDateChange(e)}
	className='disabled:opacity-70 w-full md:w-fit'
	disabled={isPending}>
	{isPending ? <Loader2 className='animate-spin' /> : <Search />}
	Buscar
</Button>
```

- [ ] **Step 5: Run both focused component test files**

Run:

```bash
npx vitest run src/tests/unit/components/dashboard-filter.test.ts src/tests/unit/components/data-sync-control.test.ts
```

Expected: both test files PASS with no warnings or unhandled errors.

- [ ] **Step 6: Run static and full regression checks**

Run:

```bash
npx eslint src/app/dashboard/_components/filter.tsx src/components/data-sync-control.tsx src/tests/unit/components/dashboard-filter.test.ts src/tests/unit/components/data-sync-control.test.ts
npm test
```

Expected: ESLint exits successfully and the complete unit test suite passes.

- [ ] **Step 7: Commit the search button change**

```bash
git add src/app/dashboard/_components/filter.tsx src/tests/unit/components/dashboard-filter.test.ts
git commit -m "feat: show spinner while dashboard filter loads"
```
