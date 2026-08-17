# Conditional Unit Comparisons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the three unit-comparison charts only when the selected period contains data for at least two distinct organizations.

**Architecture:** Add an async server component, `ComparisonUnitSection`, that resolves the existing `FetchResultByOrg` promise, validates `data.result`, and counts distinct organization names. The dashboard page delegates the complete three-card grid to this component, while the individual chart component and all charts below the block remain unchanged.

**Tech Stack:** Next.js 16 App Router, React 18 server components, TypeScript, Vitest, Testing Library

## Global Constraints

- Count only organizations represented in `data.result` for the selected period.
- Count distinct, non-empty organization names; duplicate rows from one organization count once.
- Return `null` for zero or one distinct organization, unsuccessful responses, and malformed responses.
- Render “Faturamento por unidade”, “Total de vendas por unidade”, and “Novos Clientes” together when at least two distinct organizations exist.
- Do not conditionally hide `SalesVsRepairRevenue`, `RevenueChart`, or any other dashboard block.
- Do not change `ComparisonUnit` rendering behavior.

---

### Task 1: Conditional comparison section

**Files:**
- Create: `src/app/dashboard/_components/comparison-unit-section.tsx`
- Create: `src/tests/unit/components/comparison-unit-section.test.tsx`
- Modify: `src/app/dashboard/page.tsx:11-12,111-131`

**Interfaces:**
- Consumes: `data: Promise<unknown>`, using the existing response shape `{ ok, data: { result } }` returned by `FetchResultByOrg`.
- Produces: Default async server component `ComparisonUnitSection({ data }): Promise<JSX.Element | null>`.
- Preserves: The original promise is passed unchanged to each existing `ComparisonUnit` child.

- [ ] **Step 1: Write the failing server-component tests**

Create `src/tests/unit/components/comparison-unit-section.test.tsx`:

```tsx
// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ComparisonUnitSection from '@/app/dashboard/_components/comparison-unit-section';

vi.mock('@/app/dashboard/_components/comparison-unit', () => ({
	default: ({ title }: { title: string }) => title,
}));

function dataWithOrganizations(...organizations: string[]) {
	return Promise.resolve({
		ok: true,
		data: {
			result: organizations.map((organization) => ({
				organization,
				revenue: 100,
				salesCount: 2,
				newCustomers: 1,
			})),
			revenueByOrg: [],
			salesByOrg: [],
		},
		error: null,
	});
}

describe('ComparisonUnitSection', () => {
	it('does not render the block for one organization', async () => {
		const section = await ComparisonUnitSection({
			data: dataWithOrganizations('JD Centro'),
		});

		expect(section).toBeNull();
	});

	it('counts duplicate rows from one organization only once', async () => {
		const section = await ComparisonUnitSection({
			data: dataWithOrganizations('JD Centro', 'JD Centro'),
		});

		expect(section).toBeNull();
	});

	it('renders all three charts for two distinct organizations', async () => {
		const section = await ComparisonUnitSection({
			data: dataWithOrganizations('JD Centro', 'JD Icaraí'),
		});

		expect(section).not.toBeNull();
		render(section);
		expect(screen.getByText('Faturamento por unidade')).not.toBeNull();
		expect(screen.getByText('Total de vendas por unidade')).not.toBeNull();
		expect(screen.getByText('Novos Clientes')).not.toBeNull();
	});

	it.each([
		{ ok: false, data: null, error: 'Falha' },
		{ ok: true, data: { result: null }, error: null },
	])('does not render the block for an unusable response', async (response) => {
		const section = await ComparisonUnitSection({
			data: Promise.resolve(response),
		});

		expect(section).toBeNull();
	});
});
```

The production mutation these tests catch is removal or weakening of the distinct-organization guard. The chart child is mocked only to avoid exercising Recharts; assertions target the real server section's visible output.

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```bash
npx vitest run src/tests/unit/components/comparison-unit-section.test.tsx
```

Expected: FAIL because `comparison-unit-section.tsx` does not exist yet.

- [ ] **Step 3: Implement the minimal server component**

Create `src/app/dashboard/_components/comparison-unit-section.tsx`:

```tsx
import ComparisonUnit from './comparison-unit';

type ComparisonUnitSectionProps = {
	data: Promise<unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export default async function ComparisonUnitSection({
	data,
}: ComparisonUnitSectionProps) {
	const response = await data;

	if (!isRecord(response) || response.ok !== true || !isRecord(response.data)) {
		return null;
	}

	const result = response.data.result;
	if (!Array.isArray(result)) return null;

	const organizations = new Set(
		result.flatMap((row) => {
			if (!isRecord(row) || typeof row.organization !== 'string') return [];
			const organization = row.organization.trim();
			return organization ? [organization] : [];
		}),
	);

	if (organizations.size <= 1) return null;

	return (
		<div className='grid grid-cols-1 xl:grid-cols-3 gap-5 w-full'>
			<ComparisonUnit
				key='revenue'
				type='revenue'
				data={data}
				title='Faturamento por unidade'
			/>
			<ComparisonUnit
				key='salesCount'
				type='salesCount'
				data={data}
				title='Total de vendas por unidade'
			/>
			<ComparisonUnit
				key='newCustomers'
				type='newCustomers'
				data={data}
				title='Novos Clientes'
			/>
		</div>
	);
}
```

- [ ] **Step 4: Run the focused test to verify the condition passes**

Run:

```bash
npx vitest run src/tests/unit/components/comparison-unit-section.test.tsx
```

Expected: all five generated test cases PASS.

- [ ] **Step 5: Integrate the section into the dashboard page**

Replace the direct `ComparisonUnit` import with:

```tsx
import ComparisonUnitSection from './_components/comparison-unit-section';
```

Replace the complete grid at `src/app/dashboard/page.tsx:111-130` with:

```tsx
<ComparisonUnitSection data={revenueByOrg} />
```

Leave these following lines unconditional:

```tsx
<SalesVsRepairRevenue data={revenueByOrg} />
<RevenueChart data={revenueByOrg} />
```

- [ ] **Step 6: Run focused, static, and full regression verification**

Run:

```bash
npx vitest run src/tests/unit/components/comparison-unit-section.test.tsx
npx eslint src/app/dashboard/page.tsx src/app/dashboard/_components/comparison-unit-section.tsx src/tests/unit/components/comparison-unit-section.test.tsx
npm test
npm run build
```

Expected: the focused test passes, ESLint exits successfully, all unit tests pass, and the production build completes.

- [ ] **Step 7: Commit the conditional section**

```bash
git add src/app/dashboard/page.tsx src/app/dashboard/_components/comparison-unit-section.tsx src/tests/unit/components/comparison-unit-section.test.tsx
git commit -m "feat: hide unit comparisons for one company"
```
