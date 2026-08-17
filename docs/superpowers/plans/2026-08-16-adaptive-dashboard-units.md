# Adaptive Dashboard Units Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the overview title, unit comparison block, and historical charts adapt to the distinct organizations with data in the selected period.

**Architecture:** A shared pure selector validates the home response and derives normalized chart series from `data.result`. The server page reuses its existing response promise for a conditional comparison section and a server-to-client overview-mode synchronizer, while each historical chart selects an area presentation for one series and a line presentation for multiple series.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript, Recharts 2.15, Vitest, Testing Library

## Global Constraints

- Count only distinct, non-empty organizations represented in `data.result` for the selected period.
- Do not make a second network request for the overview title.
- Render the three comparison cards only when at least two distinct organizations exist.
- On `/dashboard`, render exactly `Visão Geral` for zero or one organization and exactly `Visão Geral Centro Vs. Icaraí` for two or more.
- With exactly one organization, render each historical chart as an `AreaChart` with one `Area`, gradient fill, current value labels, no bottom legend, and the organization label preserved in tooltip configuration.
- With two or more organizations, render each historical chart as a `LineChart` with one `Line` per derived series and the bottom legend.
- With no usable series, render `Sem dados encontrados`.
- Preserve the chart titles `Vendas por unidade` and `Faturamento por Unidade`.
- Do not change `ComparisonUnit` or the titles for routes other than `/dashboard`.
- Validate with focused tests, ESLint, and `npm test`; do not run `npm run build`.

---

### Task 1: Shared organization series and conditional comparisons

**Files:**
- Create: `src/app/dashboard/_components/organization-series.ts`
- Create: `src/tests/unit/components/organization-series.test.ts`
- Modify: `src/app/dashboard/_components/comparison-unit-section.tsx`
- Modify: `src/tests/unit/components/comparison-unit-section.test.tsx`
- Modify: `src/app/dashboard/page.tsx`

**Interfaces:**
- Produces: `OrganizationSeries = { dataKey: string; label: string; color: string }`.
- Produces: `getOrganizationSeries(response: unknown): OrganizationSeries[]`.
- Preserves: `ComparisonUnitSection({ data: Promise<unknown> })` and the original promise passed to each `ComparisonUnit`.
- Note: the section, its test, and the page integration already exist as uncommitted work from an interrupted task; preserve them and refactor their inline counting into the shared selector.

- [ ] **Step 1: Write the failing selector tests**

Create `src/tests/unit/components/organization-series.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getOrganizationSeries } from '@/app/dashboard/_components/organization-series';

function responseWithOrganizations(...organizations: unknown[]) {
	return {
		ok: true,
		data: {
			result: organizations.map((organization) => ({ organization })),
		},
	};
}

describe('getOrganizationSeries', () => {
	it('normalizes and colors distinct organization series in response order', () => {
		expect(
			getOrganizationSeries(
				responseWithOrganizations('JD Centro', 'JD Icaraí'),
			),
		).toEqual([
			{
				dataKey: 'jd_centro',
				label: 'JD Centro',
				color: 'hsl(var(--chart-1))',
			},
			{
				dataKey: 'jd_icaraí',
				label: 'JD Icaraí',
				color: 'hsl(var(--chart-2))',
			},
		]);
	});

	it('ignores duplicate, blank, non-string, and malformed rows', () => {
		expect(
			getOrganizationSeries(
				responseWithOrganizations(' JD Centro ', 'JD Centro', '', null),
			),
		).toEqual([
			{
				dataKey: 'jd_centro',
				label: 'JD Centro',
				color: 'hsl(var(--chart-1))',
			},
		]);
		expect(getOrganizationSeries({ ok: false, data: null })).toEqual([]);
		expect(getOrganizationSeries({ ok: true, data: { result: null } })).toEqual([]);
	});
});
```

- [ ] **Step 2: Run the selector test to verify RED**

Run:

```bash
npx vitest run src/tests/unit/components/organization-series.test.ts
```

Expected: FAIL because `organization-series.ts` does not exist.

- [ ] **Step 3: Implement the shared selector**

Create `src/app/dashboard/_components/organization-series.ts`:

```ts
export type OrganizationSeries = {
	dataKey: string;
	label: string;
	color: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export function getOrganizationSeries(response: unknown): OrganizationSeries[] {
	if (!isRecord(response) || response.ok !== true || !isRecord(response.data)) {
		return [];
	}

	const result = response.data.result;
	if (!Array.isArray(result)) return [];

	const seen = new Set<string>();
	const series: OrganizationSeries[] = [];

	for (const row of result) {
		if (!isRecord(row) || typeof row.organization !== 'string') continue;
		const label = row.organization.trim();
		const dataKey = label.toLowerCase().replace(/\s+/g, '_');
		if (!label || seen.has(dataKey)) continue;
		seen.add(dataKey);
		series.push({
			dataKey,
			label,
			color: `hsl(var(--chart-${series.length + 1}))`,
		});
	}

	return series;
}
```

- [ ] **Step 4: Refactor the conditional section to use the selector**

Replace the inline response validation and `Set` construction in `comparison-unit-section.tsx` with:

```tsx
import { getOrganizationSeries } from './organization-series';
import ComparisonUnit from './comparison-unit';

// ...

const response = await data;
if (getOrganizationSeries(response).length <= 1) return null;
```

Keep the three direct `ComparisonUnit` children inside the existing grid and keep `SalesVsRepairRevenue` and `RevenueChart` outside this section in `page.tsx`.

- [ ] **Step 5: Run the focused tests to verify GREEN**

Run:

```bash
npx vitest run src/tests/unit/components/organization-series.test.ts src/tests/unit/components/comparison-unit-section.test.tsx
```

Expected: both files PASS, including duplicate, invalid, one-organization, and two-organization cases.

- [ ] **Step 6: Commit the shared selector and conditional section**

```bash
git add src/app/dashboard/page.tsx src/app/dashboard/_components/organization-series.ts src/app/dashboard/_components/comparison-unit-section.tsx src/tests/unit/components/organization-series.test.ts src/tests/unit/components/comparison-unit-section.test.tsx
git commit -m "feat: derive dashboard units from history"
```

### Task 2: Shared overview title mode

**Files:**
- Create: `src/providers/dashboard-overview-provider.tsx`
- Create: `src/app/dashboard/_components/overview-unit-mode-sync.tsx`
- Create: `src/tests/unit/components/dashboard-overview-mode.test.tsx`
- Modify: `src/app/dashboard/layout.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/components/greeting.tsx`
- Modify: `src/tests/unit/auth/header-dashboard-session.test.ts`

**Interfaces:**
- Consumes: `getOrganizationSeries(response)` from Task 1.
- Produces: `DashboardOverviewProvider({ children })`.
- Produces: `useDashboardOverview(): { hasMultipleOrganizations: boolean; setHasMultipleOrganizations(value: boolean): void }`.
- Produces: async server component `OverviewUnitModeSync({ data: Promise<unknown> })`.

- [ ] **Step 1: Write the failing title-mode test**

Create `src/tests/unit/components/dashboard-overview-mode.test.tsx`:

```tsx
// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Greeting from '@/components/greeting';
import OverviewUnitModeSync from '@/app/dashboard/_components/overview-unit-mode-sync';
import { DashboardOverviewProvider } from '@/providers/dashboard-overview-provider';

const pathname = vi.hoisted(() => ({ value: '/dashboard' }));

vi.mock('next/navigation', () => ({
	usePathname: () => pathname.value,
}));

function dataWithOrganizations(...organizations: string[]) {
	return Promise.resolve({
		ok: true,
		data: {
			result: organizations.map((organization) => ({ organization })),
		},
	});
}

async function renderTitle(...organizations: string[]) {
	const sync = await OverviewUnitModeSync({
		data: dataWithOrganizations(...organizations),
	});
	const fetchMock = vi.fn();
	vi.stubGlobal('fetch', fetchMock);
	render(
		createElement(
			DashboardOverviewProvider,
			null,
			sync,
			createElement(Greeting),
		),
	);
	return fetchMock;
}

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	pathname.value = '/dashboard';
});

describe('dashboard overview mode', () => {
	it('shows only Visão Geral for one organization without fetching again', async () => {
		const fetchMock = await renderTitle('JD Centro');
		expect(await screen.findByText('Visão Geral')).not.toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('keeps the exact multi-unit title without fetching again', async () => {
		const fetchMock = await renderTitle('JD Centro', 'JD Icaraí');
		expect(
			await screen.findByText('Visão Geral Centro Vs. Icaraí'),
		).not.toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('preserves the existing title for another dashboard route', () => {
		pathname.value = '/dashboard/profile';
		render(
			createElement(
				DashboardOverviewProvider,
				null,
				createElement(Greeting),
			),
		);
		expect(screen.getByText('Seu Perfil')).not.toBeNull();
	});
});
```

- [ ] **Step 2: Run the title-mode test to verify RED**

Run:

```bash
npx vitest run src/tests/unit/components/dashboard-overview-mode.test.tsx
```

Expected: FAIL because the provider and synchronizer do not exist and `Greeting` is still static.

- [ ] **Step 3: Implement the client provider and value synchronizer**

Create `src/providers/dashboard-overview-provider.tsx`:

```tsx
'use client';

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

type DashboardOverviewContextValue = {
	hasMultipleOrganizations: boolean;
	setHasMultipleOrganizations: (value: boolean) => void;
};

const DashboardOverviewContext =
	createContext<DashboardOverviewContextValue | null>(null);

export function DashboardOverviewProvider({ children }: { children: ReactNode }) {
	const [hasMultipleOrganizations, setHasMultipleOrganizations] = useState(false);
	const value = useMemo(
		() => ({ hasMultipleOrganizations, setHasMultipleOrganizations }),
		[hasMultipleOrganizations],
	);
	return (
		<DashboardOverviewContext.Provider value={value}>
			{children}
		</DashboardOverviewContext.Provider>
	);
}

export function DashboardOverviewModeSync({
	hasMultipleOrganizations,
}: {
	hasMultipleOrganizations: boolean;
}) {
	const { setHasMultipleOrganizations } = useDashboardOverview();
	useEffect(() => {
		setHasMultipleOrganizations(hasMultipleOrganizations);
		return () => setHasMultipleOrganizations(false);
	}, [hasMultipleOrganizations, setHasMultipleOrganizations]);
	return null;
}

export function useDashboardOverview() {
	const context = useContext(DashboardOverviewContext);
	if (!context) {
		throw new Error('useDashboardOverview must be used within DashboardOverviewProvider');
	}
	return context;
}
```

Create `src/app/dashboard/_components/overview-unit-mode-sync.tsx`:

```tsx
import { DashboardOverviewModeSync } from '@/providers/dashboard-overview-provider';
import { getOrganizationSeries } from './organization-series';

export default async function OverviewUnitModeSync({
	data,
}: {
	data: Promise<unknown>;
}) {
	const response = await data;
	return (
		<DashboardOverviewModeSync
			hasMultipleOrganizations={getOrganizationSeries(response).length > 1}
		/>
	);
}
```

- [ ] **Step 4: Wire the provider, page synchronizer, and greeting**

Wrap the existing `SidebarProvider` in `src/app/dashboard/layout.tsx`:

```tsx
<DashboardOverviewProvider>
	<SidebarProvider
		suppressHydrationWarning
		suppressContentEditableWarning
		defaultOpen={true}>
		<AppSidebar />
		<div className='w-full px-4 flex flex-col xl:mx-2 mt-5 xl:mt-0'>
			<SidebarTrigger className='z-50 fixed md:-translate-x-[60px] xl:-translate-x-[68.5px] md:mb-2 top-3' />
			<HeaderDashboard />
			{children}
		</div>
	</SidebarProvider>
</DashboardOverviewProvider>
```

Render the synchronizer near the start of `OverviewPage` without moving the existing charts:

```tsx
<OverviewUnitModeSync data={revenueByOrg} />
```

In `Greeting`, consume the provider and change only the `/dashboard` branch:

```tsx
const { hasMultipleOrganizations } = useDashboardOverview();

if (pathname == '/dashboard') {
	return hasMultipleOrganizations
		? 'Visão Geral Centro Vs. Icaraí'
		: 'Visão Geral';
}
```

Wrap `HeaderDashboard` with `DashboardOverviewProvider` in both existing session tests so their production dependency is explicit:

```tsx
render(
	createElement(
		DashboardOverviewProvider,
		null,
		createElement(HeaderDashboard),
	),
);
```

- [ ] **Step 5: Run the title and existing header tests**

Run:

```bash
npx vitest run src/tests/unit/components/dashboard-overview-mode.test.tsx src/tests/unit/auth/header-dashboard-session.test.ts
```

Expected: the title mode tests and both header session tests PASS with no extra fetch.

- [ ] **Step 6: Commit the overview title mode**

```bash
git add src/providers/dashboard-overview-provider.tsx src/app/dashboard/_components/overview-unit-mode-sync.tsx src/app/dashboard/layout.tsx src/app/dashboard/page.tsx src/components/greeting.tsx src/tests/unit/components/dashboard-overview-mode.test.tsx src/tests/unit/auth/header-dashboard-session.test.ts
git commit -m "feat: adapt overview title to unit history"
```

### Task 3: Adaptive sales history chart

**Files:**
- Create: `src/tests/unit/components/sales-history-chart.test.tsx`
- Modify: `src/app/dashboard/_components/sales-vs-repair-revenue.tsx`

**Interfaces:**
- Consumes: `getOrganizationSeries(allData)` and each `OrganizationSeries.dataKey`, `label`, and `color`.
- Preserves: `SalesVsRepairRevenue({ data: Promise<any> })` and title `Vendas por unidade`.

- [ ] **Step 1: Write failing single-series, multi-series, and empty tests**

Create `src/tests/unit/components/sales-history-chart.test.tsx`:

```tsx
// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SalesVsRepairRevenue } from '@/app/dashboard/_components/sales-vs-repair-revenue';

const current = vi.hoisted(() => ({
	response: {} as unknown,
	config: {} as Record<string, { label?: string }>,
}));

vi.mock('react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react')>();
	return { ...actual, use: () => current.response };
});

vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => false }));

vi.mock('recharts', () => ({
	AreaChart: ({ children }: { children?: ReactNode }) => (
		<div data-testid='area-chart'>{children}</div>
	),
	Area: ({ children, dataKey }: { children?: ReactNode; dataKey: string }) => (
		<div data-testid='area-series' data-key={dataKey}>{children}</div>
	),
	LineChart: ({ children }: { children?: ReactNode }) => (
		<div data-testid='line-chart'>{children}</div>
	),
	Line: ({ children, dataKey }: { children?: ReactNode; dataKey: string }) => (
		<div data-testid='line-series' data-key={dataKey}>{children}</div>
	),
	CartesianGrid: () => null,
	LabelList: () => null,
	XAxis: () => null,
}));

vi.mock('@/components/ui/chart', () => ({
	ChartContainer: ({
		children,
		config,
	}: {
		children?: ReactNode;
		config: Record<string, { label?: string }>;
	}) => {
		current.config = config;
		return <div data-testid='chart-container'>{children}</div>;
	},
	ChartLegend: () => <div data-testid='chart-legend' />,
	ChartLegendContent: () => null,
	ChartTooltip: () => null,
	ChartTooltipContent: () => null,
}));

function responseWithOrganizations(...organizations: string[]) {
	return {
		ok: true,
		data: {
			result: organizations.map((organization) => ({ organization })),
			salesByOrg: [
				{ period: '2026-08-01', jd_centro: 3, jd_icaraí: 2 },
			],
		},
	};
}

beforeEach(() => {
	current.config = {};
});

afterEach(cleanup);

describe('SalesVsRepairRevenue', () => {
	it('renders one area without a legend and keeps the organization tooltip label', () => {
		current.response = responseWithOrganizations('JD Centro');
		render(createElement(SalesVsRepairRevenue, { data: Promise.resolve(null) }));

		expect(screen.getByText('Vendas por unidade')).not.toBeNull();
		expect(screen.getByTestId('area-chart')).not.toBeNull();
		expect(screen.getByTestId('area-series').getAttribute('data-key')).toBe('jd_centro');
		expect(screen.queryByTestId('line-chart')).toBeNull();
		expect(screen.queryByTestId('chart-legend')).toBeNull();
		expect(current.config.jd_centro.label).toBe('JD Centro');
	});

	it('renders one line per organization and the legend for multiple organizations', () => {
		current.response = responseWithOrganizations('JD Centro', 'JD Icaraí');
		render(createElement(SalesVsRepairRevenue, { data: Promise.resolve(null) }));

		expect(screen.getByTestId('line-chart')).not.toBeNull();
		expect(screen.getAllByTestId('line-series').map((line) => line.getAttribute('data-key'))).toEqual([
			'jd_centro',
			'jd_icaraí',
		]);
		expect(screen.getByTestId('chart-legend')).not.toBeNull();
		expect(screen.queryByTestId('area-chart')).toBeNull();
	});

	it('renders the empty state without a chart when no series is usable', () => {
		current.response = responseWithOrganizations();
		render(createElement(SalesVsRepairRevenue, { data: Promise.resolve(null) }));

		expect(screen.getByText('Sem dados encontrados')).not.toBeNull();
		expect(screen.queryByTestId('chart-container')).toBeNull();
	});
});
```

- [ ] **Step 2: Run the sales chart test to verify RED**

Run:

```bash
npx vitest run src/tests/unit/components/sales-history-chart.test.tsx
```

Expected: FAIL because the current component always renders `LineChart` and always renders the legend.

- [ ] **Step 3: Implement the adaptive sales chart**

Import `Area`, `AreaChart`, and `getOrganizationSeries`. After resolving `allData`, require both an array `salesByOrg` and at least one derived series. Build the tooltip/legend configuration dynamically:

```tsx
const series = getOrganizationSeries(allData);
if (!Array.isArray(allData?.data?.salesByOrg) || series.length === 0) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-xl'>
					Sem dados encontrados
				</CardTitle>
			</CardHeader>
		</Card>
	);
}
const chartConfig: ChartConfig = Object.fromEntries(
	series.map(({ dataKey, label, color }) => [dataKey, { label, color }]),
);
```

For one series, render:

```tsx
<AreaChart accessibilityLayer data={salesData} margin={{ top: 20, right: 28, left: 28 }}>
	<CartesianGrid vertical={false} />
	{isMobile ? null : (
		<XAxis
			dataKey='period'
			tickLine={false}
			tickMargin={10}
			axisLine={false}
			fontSize={8}
		/>
	)}
	<ChartTooltip
		cursor={false}
		content={<ChartTooltipContent indicator='dot' />}
	/>
	<defs>
		<linearGradient id='fill-single-sales' x1='0' y1='0' x2='0' y2='1'>
			<stop offset='5%' stopColor={`var(--color-${series[0].dataKey})`} stopOpacity={0.8} />
			<stop offset='95%' stopColor={`var(--color-${series[0].dataKey})`} stopOpacity={0.1} />
		</linearGradient>
	</defs>
	<Area
		dataKey={series[0].dataKey}
		type='natural'
		fill='url(#fill-single-sales)'
		fillOpacity={0.4}
		stroke={`var(--color-${series[0].dataKey})`}
		strokeWidth={2}
		dot={{ fill: `var(--color-${series[0].dataKey})` }}
		activeDot={{ r: 6 }}>
		<LabelList position='top' offset={12} className='fill-foreground' fontSize={10} formatter={(value: number) => value.toLocaleString('pt-BR')} />
	</Area>
</AreaChart>
```

For multiple series, render the existing line presentation with dynamic series:

```tsx
<LineChart
	accessibilityLayer
	margin={{ top: 20, right: 28, left: 28 }}
	data={salesData}>
	<CartesianGrid vertical={false} />
	{isMobile ? null : (
		<XAxis
			dataKey='period'
			tickLine={false}
			tickMargin={10}
			axisLine={false}
			fontSize={8}
		/>
	)}
	<ChartTooltip
		cursor={false}
		content={<ChartTooltipContent indicator='dot' />}
	/>
	<ChartLegend
		content={<ChartLegendContent className='text-xs mt-5' />}
	/>
	{series.map(({ dataKey }) => (
		<Line
			key={dataKey}
			dataKey={dataKey}
			type='natural'
			strokeWidth={2}
			stroke={`var(--color-${dataKey})`}
			dot={{ fill: `var(--color-${dataKey})` }}
			activeDot={{ r: 6 }}>
			<LabelList
				position='top'
				offset={12}
				className='fill-foreground'
				fontSize={10}
				formatter={(value: number) => value.toLocaleString('pt-BR')}
			/>
		</Line>
	))}
</LineChart>
```

- [ ] **Step 4: Run the sales chart test to verify GREEN**

Run:

```bash
npx vitest run src/tests/unit/components/sales-history-chart.test.tsx
```

Expected: single-series area, multi-series lines/legend, config label, and empty-state cases PASS.

- [ ] **Step 5: Commit the adaptive sales chart**

```bash
git add src/app/dashboard/_components/sales-vs-repair-revenue.tsx src/tests/unit/components/sales-history-chart.test.tsx
git commit -m "feat: adapt sales history chart to unit count"
```

### Task 4: Adaptive revenue history chart and final verification

**Files:**
- Create: `src/tests/unit/components/revenue-history-chart.test.tsx`
- Modify: `src/app/dashboard/_components/revenue-chart.tsx`

**Interfaces:**
- Consumes: `getOrganizationSeries(allData)`; one derived series selects `AreaChart`, while two or more select `LineChart` with a legend.
- Preserves: `RevenueChart({ data: Promise<any> })`, title `Faturamento por Unidade`, and compact BRL value labels.

- [ ] **Step 1: Write failing revenue chart mode tests**

Create `src/tests/unit/components/revenue-history-chart.test.tsx`:

```tsx
// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RevenueChart from '@/app/dashboard/_components/revenue-chart';

const current = vi.hoisted(() => ({
	response: {} as unknown,
	config: {} as Record<string, { label?: string }>,
}));

vi.mock('react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react')>();
	return { ...actual, use: () => current.response };
});

vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => false }));

vi.mock('recharts', () => ({
	AreaChart: ({ children }: { children?: ReactNode }) => (
		<div data-testid='area-chart'>{children}</div>
	),
	Area: ({ children, dataKey }: { children?: ReactNode; dataKey: string }) => (
		<div data-testid='area-series' data-key={dataKey}>{children}</div>
	),
	LineChart: ({ children }: { children?: ReactNode }) => (
		<div data-testid='line-chart'>{children}</div>
	),
	Line: ({ children, dataKey }: { children?: ReactNode; dataKey: string }) => (
		<div data-testid='line-series' data-key={dataKey}>{children}</div>
	),
	CartesianGrid: () => null,
	LabelList: () => null,
	XAxis: () => null,
}));

vi.mock('@/components/ui/chart', () => ({
	ChartContainer: ({
		children,
		config,
	}: {
		children?: ReactNode;
		config: Record<string, { label?: string }>;
	}) => {
		current.config = config;
		return <div data-testid='chart-container'>{children}</div>;
	},
	ChartLegend: () => <div data-testid='chart-legend' />,
	ChartLegendContent: () => null,
	ChartTooltip: () => null,
	ChartTooltipContent: () => null,
}));

function responseWithOrganizations(...organizations: string[]) {
	return {
		ok: true,
		data: {
			result: organizations.map((organization) => ({ organization })),
			revenueByOrg: [
				{ period: '2026-08-01', jd_centro: 266, jd_icaraí: 150 },
			],
		},
	};
}

beforeEach(() => {
	current.config = {};
});

afterEach(cleanup);

describe('RevenueChart', () => {
	it('renders one area without a legend and keeps the organization tooltip label', () => {
		current.response = responseWithOrganizations('JD Centro');
		render(createElement(RevenueChart, { data: Promise.resolve(null) }));

		expect(screen.getByText('Faturamento por Unidade')).not.toBeNull();
		expect(screen.getByTestId('area-chart')).not.toBeNull();
		expect(screen.getByTestId('area-series').getAttribute('data-key')).toBe('jd_centro');
		expect(screen.queryByTestId('line-chart')).toBeNull();
		expect(screen.queryByTestId('chart-legend')).toBeNull();
		expect(current.config.jd_centro.label).toBe('JD Centro');
	});

	it('renders one line per organization and the legend for multiple organizations', () => {
		current.response = responseWithOrganizations('JD Centro', 'JD Icaraí');
		render(createElement(RevenueChart, { data: Promise.resolve(null) }));

		expect(screen.getByTestId('line-chart')).not.toBeNull();
		expect(screen.getAllByTestId('line-series').map((line) => line.getAttribute('data-key'))).toEqual([
			'jd_centro',
			'jd_icaraí',
		]);
		expect(screen.getByTestId('chart-legend')).not.toBeNull();
		expect(screen.queryByTestId('area-chart')).toBeNull();
	});

	it('renders the empty state without a chart when no series is usable', () => {
		current.response = responseWithOrganizations();
		render(createElement(RevenueChart, { data: Promise.resolve(null) }));

		expect(screen.getByText('Sem dados encontrados')).not.toBeNull();
		expect(screen.queryByTestId('chart-container')).toBeNull();
	});
});
```

- [ ] **Step 2: Run the revenue chart test to verify RED**

Run:

```bash
npx vitest run src/tests/unit/components/revenue-history-chart.test.tsx
```

Expected: FAIL because `RevenueChart` always uses the line presentation and explicit legend.

- [ ] **Step 3: Implement the adaptive revenue chart**

Import `Area`, `AreaChart`, and `getOrganizationSeries`. Require an array `revenueByOrg` and at least one derived series, then build the dynamic chart config:

```tsx
const series = getOrganizationSeries(allData);
if (!Array.isArray(allData?.data?.revenueByOrg) || series.length === 0) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance xl:text-xl'>
					Sem dados encontrados
				</CardTitle>
			</CardHeader>
		</Card>
	);
}
const chartConfig: ChartConfig = Object.fromEntries(
	series.map(({ dataKey, label, color }) => [dataKey, { label, color }]),
);
const formatRevenue = (value: number) =>
	value.toLocaleString('pt-br', {
		style: 'currency',
		currency: 'brl',
		notation: 'compact',
	});
```

For one series, render this chart inside the existing `ChartContainer`:

```tsx
<AreaChart
	accessibilityLayer
	data={chartData}
	margin={{ top: 20, left: 28, right: 28 }}>
	<CartesianGrid vertical={false} />
	{isMobile ? null : (
		<XAxis
			dataKey='period'
			tickLine={false}
			axisLine={false}
			tickMargin={8}
			fontSize={8}
		/>
	)}
	<ChartTooltip
		cursor={false}
		content={<ChartTooltipContent indicator='dot' />}
	/>
	<defs>
		<linearGradient id='fill-single-revenue' x1='0' y1='0' x2='0' y2='1'>
			<stop offset='5%' stopColor={`var(--color-${series[0].dataKey})`} stopOpacity={0.8} />
			<stop offset='95%' stopColor={`var(--color-${series[0].dataKey})`} stopOpacity={0.1} />
		</linearGradient>
	</defs>
	<Area
		dataKey={series[0].dataKey}
		type='natural'
		fill='url(#fill-single-revenue)'
		fillOpacity={0.4}
		stroke={`var(--color-${series[0].dataKey})`}
		strokeWidth={2}
		dot={{ fill: `var(--color-${series[0].dataKey})` }}
		activeDot={{ r: 6 }}>
		<LabelList
			position='top'
			offset={12}
			className='fill-foreground text-nowrap text-start'
			fontSize={10}
			formatter={formatRevenue}
		/>
	</Area>
</AreaChart>
```

For multiple series, render:

```tsx
<LineChart
	accessibilityLayer
	data={chartData}
	margin={{ top: 20, left: 28, right: 28 }}>
	<CartesianGrid vertical={false} />
	{isMobile ? null : (
		<XAxis
			dataKey='period'
			tickLine={false}
			axisLine={false}
			tickMargin={8}
			fontSize={8}
		/>
	)}
	<ChartTooltip
		cursor={false}
		content={<ChartTooltipContent indicator='dot' />}
	/>
	<ChartLegend
		content={<ChartLegendContent className='text-xs mt-8' />}
	/>
	{series.map(({ dataKey }) => (
		<Line
			key={dataKey}
			dataKey={dataKey}
			type='natural'
			stroke={`var(--color-${dataKey})`}
			strokeWidth={2}
			dot={{ fill: `var(--color-${dataKey})` }}
			activeDot={{ r: 6 }}>
			<LabelList
				position='top'
				offset={12}
				className='fill-foreground text-nowrap text-start'
				fontSize={10}
				formatter={formatRevenue}
			/>
		</Line>
	))}
</LineChart>
```

- [ ] **Step 4: Run all focused dashboard tests**

Run:

```bash
npx vitest run src/tests/unit/components/organization-series.test.ts src/tests/unit/components/comparison-unit-section.test.tsx src/tests/unit/components/dashboard-overview-mode.test.tsx src/tests/unit/components/sales-history-chart.test.tsx src/tests/unit/components/revenue-history-chart.test.tsx src/tests/unit/auth/header-dashboard-session.test.ts
```

Expected: every focused test passes.

- [ ] **Step 5: Run static and full regression validation without a build**

Run:

```bash
npx eslint src/app/dashboard/page.tsx src/app/dashboard/layout.tsx src/app/dashboard/_components/organization-series.ts src/app/dashboard/_components/comparison-unit-section.tsx src/app/dashboard/_components/overview-unit-mode-sync.tsx src/app/dashboard/_components/sales-vs-repair-revenue.tsx src/app/dashboard/_components/revenue-chart.tsx src/components/greeting.tsx src/providers/dashboard-overview-provider.tsx src/tests/unit/components/organization-series.test.ts src/tests/unit/components/comparison-unit-section.test.tsx src/tests/unit/components/dashboard-overview-mode.test.tsx src/tests/unit/components/sales-history-chart.test.tsx src/tests/unit/components/revenue-history-chart.test.tsx src/tests/unit/auth/header-dashboard-session.test.ts
npm test
```

Expected: ESLint exits successfully and the full Vitest suite passes. Do not run `npm run build`.

- [ ] **Step 6: Commit the revenue chart and verified feature**

```bash
git add src/app/dashboard/_components/revenue-chart.tsx src/tests/unit/components/revenue-history-chart.test.tsx
git commit -m "feat: adapt revenue history chart to unit count"
```
