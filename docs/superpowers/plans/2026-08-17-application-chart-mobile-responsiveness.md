# Application Chart Mobile Responsiveness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every application chart usable at 320 px, restore Balcão to `#242424`, and replace manually inserted ellipses with layout-driven one-line truncation.

**Architecture:** Add shared chart containment, responsive tick, legend, and height-policy primitives, then apply them by chart family without changing desktop data semantics. HTML tables use a generic full-value truncation component; SVG axes use a Recharts custom tick backed by `foreignObject` so CSS decides whether an ellipsis is necessary.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Recharts 3, Vitest, Testing Library.

## Global Constraints

- Support viewport widths from exactly 320 px without horizontal page overflow.
- Preserve desktop chart types, data, value formatting, and visual hierarchy.
- Use exactly `#242424` for Balcão in all three Comercial origin charts.
- Never append `...` to application data or axis labels in JavaScript.
- Apply one-line CSS truncation only when content exceeds its available width.
- Preserve the full value in `title` wherever visual truncation is possible.
- Legends may wrap and must not create horizontal overflow.
- Keep existing single-series legend rules unchanged.
- Do not add a charting or truncation dependency.
- Do not run `npm run build`.

---

## File Structure

### New shared units

- `src/components/ui/responsive-chart.tsx`: responsive Recharts tick plus categorical-height policy.
- `src/components/ui/truncated-text.tsx`: generic full-value, one-line HTML truncation.
- `src/tests/unit/components/responsive-chart.test.tsx`: shared chart primitive behavior.
- `src/tests/unit/components/truncated-text.test.tsx`: HTML truncation behavior.

### Existing shared unit

- `src/components/ui/chart.tsx`: shrinkable chart container and wrapping/truncating legend items.

### Chart families

- Main dashboard: `comparison-unit.tsx`, `sales-vs-repair-revenue.tsx`, `revenue-chart.tsx`.
- Comercial: eleven chart components under `src/app/dashboard/comercial/_components/`.
- Marketing: seven chart components under `src/app/dashboard/marketing/_components/charts/`.
- Goals result: five chart components under `src/app/dashboard/goals-result/_components/charts/`.
- Rankings: `top-clients.tsx` and `top-products.tsx`.

---

### Task 1: Shared responsive chart primitives

**Files:**
- Create: `src/components/ui/responsive-chart.tsx`
- Modify: `src/components/ui/chart.tsx`
- Create: `src/tests/unit/components/responsive-chart.test.tsx`
- Modify: `src/tests/unit/components/chart-legend-keys.test.ts`

**Interfaces:**
- Produces: `getMobileCategoricalChartHeight(itemCount: number, options?: { minHeight?: number; rowHeight?: number; chromeHeight?: number }): number`
- Produces: `ResponsiveChartTick(props: ResponsiveChartTickProps): JSX.Element`
- `ResponsiveChartTickProps` includes `axis: 'x' | 'y'`, optional `x`, `y`, `width`, `height`, `offset`, `className`, and Recharts `payload.value`.
- Later chart tasks consume both exports.

- [ ] **Step 1: Write failing primitive tests**

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  getMobileCategoricalChartHeight,
  ResponsiveChartTick,
} from '@/components/ui/responsive-chart';

describe('responsive chart primitives', () => {
  it('allocates at least 320 px and 44 px per category', () => {
    expect(getMobileCategoricalChartHeight(2)).toBe(320);
    expect(getMobileCategoricalChartHeight(8)).toBe(408);
  });

  it('keeps the complete tick value and delegates overflow to CSS', () => {
    render(
      <svg>
        <ResponsiveChartTick
          axis='y'
          x={100}
          y={20}
          width={96}
          payload={{ value: 'Relacionamento comercial muito extenso' }}
        />
      </svg>,
    );
    const label = screen.getByTitle('Relacionamento comercial muito extenso');
    expect(label.textContent).toBe('Relacionamento comercial muito extenso');
    expect(label.className).toContain('text-ellipsis');
    expect(label.className).toContain('whitespace-nowrap');
    expect(label.textContent).not.toContain('...');
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx vitest run src/tests/unit/components/responsive-chart.test.tsx
```

Expected: FAIL because `@/components/ui/responsive-chart` does not exist.

- [ ] **Step 3: Implement the shared height policy and custom tick**

```tsx
'use client';

import { cn } from '@/lib/utils';

export type ResponsiveChartTickProps = {
  axis: 'x' | 'y';
  x?: number | string;
  y?: number | string;
  width?: number;
  height?: number;
  offset?: number;
  payload?: { value?: unknown };
  className?: string;
};

export function getMobileCategoricalChartHeight(
  itemCount: number,
  {
    minHeight = 320,
    rowHeight = 44,
    chromeHeight = 56,
  }: { minHeight?: number; rowHeight?: number; chromeHeight?: number } = {},
) {
  return Math.max(minHeight, itemCount * rowHeight + chromeHeight);
}

export function ResponsiveChartTick({
  axis,
  x = 0,
  y = 0,
  width = axis === 'y' ? 104 : 88,
  height = 24,
  offset = 8,
  payload,
  className,
}: ResponsiveChartTickProps) {
  const label = String(payload?.value ?? '');
  const numericX = Number(x) || 0;
  const numericY = Number(y) || 0;
  const foreignObjectX = axis === 'y' ? numericX - width - offset : numericX - width / 2;
  const foreignObjectY = axis === 'y' ? numericY - height / 2 : numericY + offset;

  return (
    <foreignObject x={foreignObjectX} y={foreignObjectY} width={width} height={height}>
      <div
        title={label}
        className={cn(
          'h-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground',
          axis === 'y' ? 'text-right leading-6' : 'text-center leading-5',
          className,
        )}
      >
        {label}
      </div>
    </foreignObject>
  );
}
```

- [ ] **Step 4: Extend the existing legend test and verify RED**

Add a second case to `chart-legend-keys.test.ts` with config label
`Relacionamento comercial muito extenso`. Assert that `[data-chart]` contains
`min-w-0` and `overflow-hidden`, then find the label through its `title` and
assert its class contains `text-ellipsis` and `whitespace-nowrap` while its
textContent remains complete.

Run:

```bash
npx vitest run src/tests/unit/components/chart-legend-keys.test.ts
```

Expected: FAIL because the current container is not shrinkable and the legend
label is rendered without a truncating span.

- [ ] **Step 5: Make the chart container shrink and the legend wrap**

In `ChartContainer`, prepend `min-w-0 overflow-hidden` to its base classes. In `ChartLegendContent`, add `min-w-0 flex-wrap` to the legend wrapper and render a string label as:

```tsx
const label = itemConfig?.label;

<span
  className='min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap'
  title={typeof label === 'string' ? label : undefined}
>
  {label}
</span>
```

Also add `min-w-0 max-w-full` to each legend item wrapper. Do not change icon or color resolution.

- [ ] **Step 6: Run shared tests and lint**

```bash
npx vitest run src/tests/unit/components/responsive-chart.test.tsx src/tests/unit/components/chart-legend-keys.test.ts
npx eslint src/components/ui/responsive-chart.tsx src/components/ui/chart.tsx src/tests/unit/components/responsive-chart.test.tsx src/tests/unit/components/chart-legend-keys.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/responsive-chart.tsx src/components/ui/chart.tsx src/tests/unit/components/responsive-chart.test.tsx src/tests/unit/components/chart-legend-keys.test.ts
git commit -m "feat: add responsive chart primitives"
```

---

### Task 2: Layout-driven truncation in ranking tables

**Files:**
- Create: `src/components/ui/truncated-text.tsx`
- Modify: `src/app/dashboard/comercial/_components/tables/top-clients.tsx`
- Modify: `src/app/dashboard/comercial/_components/tables/top-products.tsx`
- Create: `src/tests/unit/components/truncated-text.test.tsx`
- Create: `src/tests/unit/dashboard/ranking-text-truncation.test.tsx`

**Interfaces:**
- Produces: `TruncatedText({ value, className }: { value: string; className?: string }): JSX.Element`
- Ranking tables consume `TruncatedText` and pass untouched names.

- [ ] **Step 1: Write the failing generic component test**

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { TruncatedText } from '@/components/ui/truncated-text';

it('renders the complete value and makes CSS responsible for ellipsis', () => {
  render(<TruncatedText value='Cliente com nome completo e extenso' />);
  const value = screen.getByTitle('Cliente com nome completo e extenso');
  expect(value.textContent).toBe('Cliente com nome completo e extenso');
  expect(value.className).toContain('truncate');
  expect(value.textContent).not.toContain('...');
});
```

- [ ] **Step 2: Run the generic test and verify RED**

```bash
npx vitest run src/tests/unit/components/truncated-text.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement `TruncatedText`**

```tsx
import { cn } from '@/lib/utils';

export function TruncatedText({ value, className }: { value: string; className?: string }) {
  return (
    <span
      title={value}
      className={cn('block min-w-0 max-w-full truncate', className)}
    >
      {value}
    </span>
  );
}
```

- [ ] **Step 4: Write ranking regressions before changing the tables**

Create fixtures containing `FECA` and `JOSÉ PAULO VILARINHO DA SILVA`. Render `TopClients` and `TopProducts` with the established `react.use` mock pattern. Assert both exact full values are in the DOM and `screen.queryByText(/\.\.\.$/)` is null.

Run:

```bash
npx vitest run src/tests/unit/dashboard/ranking-text-truncation.test.tsx
```

Expected: FAIL because current table cells append `...` to every value.

- [ ] **Step 5: Replace JavaScript slicing with responsive cells**

For both tables:

```tsx
<TableCell className='max-w-[8rem] min-w-0 text-xs sm:max-w-[14rem] lg:max-w-[18rem]'>
  <TruncatedText value={customer.name} />
</TableCell>
```

Use `product.name` in Top Products. Add `min-w-0 overflow-hidden` to each card and `w-full table-fixed lg:table-auto` to each `Table`. Do not truncate codes, numeric values, or trophy positions.

- [ ] **Step 6: Run table tests and lint**

```bash
npx vitest run src/tests/unit/components/truncated-text.test.tsx src/tests/unit/dashboard/ranking-text-truncation.test.tsx
npx eslint src/components/ui/truncated-text.tsx src/app/dashboard/comercial/_components/tables/top-clients.tsx src/app/dashboard/comercial/_components/tables/top-products.tsx src/tests/unit/components/truncated-text.test.tsx src/tests/unit/dashboard/ranking-text-truncation.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/truncated-text.tsx src/app/dashboard/comercial/_components/tables/top-clients.tsx src/app/dashboard/comercial/_components/tables/top-products.tsx src/tests/unit/components/truncated-text.test.tsx src/tests/unit/dashboard/ranking-text-truncation.test.tsx
git commit -m "fix: truncate ranking names by available width"
```

---

### Task 3: Comercial chart family and Balcão color

**Files:**
- Modify: `src/app/dashboard/comercial/_components/revenue-by-origin.tsx`
- Modify: `src/app/dashboard/comercial/_components/sales-count-by-origin.tsx`
- Modify: `src/app/dashboard/comercial/_components/avg-ticket-by-origin.tsx`
- Modify: `src/app/dashboard/comercial/_components/sales-by-category-chart.tsx`
- Modify: `src/app/dashboard/comercial/_components/sales-by-payment.tsx`
- Modify: `src/app/dashboard/comercial/_components/sales-chart-commercial.tsx`
- Modify: `src/app/dashboard/comercial/_components/growth-chart.tsx`
- Modify: `src/app/dashboard/comercial/_components/category-sales.tsx`
- Modify: `src/app/dashboard/comercial/_components/customer-comparison.tsx`
- Modify: `src/app/dashboard/comercial/_components/sales-by-client.tsx`
- Modify: `src/app/dashboard/comercial/_components/services-vs-sales.tsx`
- Modify: `src/tests/unit/dashboard/origin-chart-colors.test.ts`
- Create: `src/tests/unit/dashboard/comercial-chart-mobile.test.tsx`

**Interfaces:**
- Consumes: `ResponsiveChartTick` and `getMobileCategoricalChartHeight` from Task 1.

- [ ] **Step 1: Change the origin color expectation to RED**

Update the parameterized origin-chart test to assert:

```ts
expect(container.querySelector('style')?.textContent).toContain(
  '--color-Balcão: #242424;',
);
```

Run:

```bash
npx vitest run src/tests/unit/dashboard/origin-chart-colors.test.ts
```

Expected: FAIL because Balcão currently uses `hsl(var(--chart-1))`.

- [ ] **Step 2: Set Balcão to the approved color**

In each of the three origin configs, use:

```ts
Balcão: {
  label: 'Balcão',
  color: '#242424',
},
```

Do not change Google or other origins.

- [ ] **Step 3: Write mobile layout regressions**

Use `matchMedia.matches = true`, the existing `react.use` mock, and Recharts component mocks that expose `layout`, `margin`, `width`, and `tick`. Assert:

```ts
expect(barChartProps.layout).toBe('vertical');
expect(barChartProps.margin).toEqual({ top: 16, left: 4, right: 16, bottom: 8 });
expect(yAxisProps.width).toBe(104);
expect(yAxisProps.tick).toBeTruthy();
expect(chartContainerStyle.height).toBe(getMobileCategoricalChartHeight(chartData.length));
```

Cover one origin chart and `SalesByCategoryChart`; the other origin charts share the exact props and remain covered by the parameterized color/render suite.

Run the new test and confirm it fails against the current negative left margins and 152/180 px axes.

- [ ] **Step 4: Apply exact mobile layouts to categorical Comercial charts**

| Component | Mobile orientation | Axis width | Mobile margins | Height |
|---|---:|---:|---|---:|
| RevenueByOrigin | vertical | 104 | top 16, left 4, right 16, bottom 8 | policy by item count |
| SalesCountByOrigin | vertical | 104 | top 16, left 4, right 16, bottom 8 | policy by item count |
| AvgTicketByOrigin | vertical | 104 | top 16, left 4, right 16, bottom 8 | policy by item count |
| SalesByCategoryChart | vertical | 112 | top 8, left 0, right 52, bottom 24 | policy by item count |
| SalesByPayment | vertical | 112 | top 8, left 0, right 52, bottom 8 | policy by item count |

For mobile categorical axes, replace character slicing/default SVG text with:

```tsx
tick={<ResponsiveChartTick axis='y' width={96} />}
```

Use width `104` for the two category/payment labels. Keep existing desktop axes and heights under `md:`.

- [ ] **Step 5: Apply exact mobile layouts to temporal and pie Comercial charts**

| Component | Mobile container | Mobile chart change |
|---|---|---|
| SalesChartComponent | `h-80 min-w-0 w-full` | margins top 24/left 8/right 12/bottom 8; XAxis font 8, `interval='preserveStartEnd'`, `minTickGap={28}` |
| GrowthChartComponent | `h-80 min-w-0 w-full md:h-72` | margins top 24/left 8/right 12/bottom 8; full month value, `interval='preserveStartEnd'` |
| category-sales | `mx-auto h-[280px] w-full max-w-[320px] md:max-h-72` | inner radius 52 on mobile, 60 desktop; legend wraps |
| customer-comparison | `mx-auto h-[300px] w-full max-w-[320px] md:max-h-[340px]` | mobile outer/inner radii reduced by 8 px; legend wraps |
| sales-by-client | same as customer-comparison | mobile radii reduced by 8 px; legend wraps |
| services-vs-sales | same as customer-comparison | mobile radii reduced by 8 px; legend wraps |

Remove `fontSize={0}` from mobile temporal axes. Keep tooltip and label formatters unchanged.

- [ ] **Step 6: Run Comercial tests and lint**

```bash
npx vitest run src/tests/unit/dashboard/origin-chart-colors.test.ts src/tests/unit/dashboard/comercial-chart-mobile.test.tsx
npx eslint src/app/dashboard/comercial/_components src/tests/unit/dashboard/origin-chart-colors.test.ts src/tests/unit/dashboard/comercial-chart-mobile.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/dashboard/comercial/_components src/tests/unit/dashboard/origin-chart-colors.test.ts src/tests/unit/dashboard/comercial-chart-mobile.test.tsx
git commit -m "fix: improve comercial charts on mobile"
```

---

### Task 4: Marketing chart family

**Files:**
- Modify: `src/app/dashboard/marketing/_components/charts/campaings.tsx`
- Modify: `src/app/dashboard/marketing/_components/charts/conversion.tsx`
- Modify: `src/app/dashboard/marketing/_components/charts/cost.tsx`
- Modify: `src/app/dashboard/marketing/_components/charts/performance.tsx`
- Modify: `src/app/dashboard/marketing/_components/charts/revenue-by-campagn.tsx`
- Modify: `src/app/dashboard/marketing/_components/charts/revenue-by-origin.tsx`
- Modify: `src/app/dashboard/marketing/_components/charts/traffic.tsx`
- Create: `src/tests/unit/dashboard/marketing-chart-mobile.test.tsx`

**Interfaces:**
- Consumes: `ResponsiveChartTick` and `getMobileCategoricalChartHeight` from Task 1.

- [ ] **Step 1: Write failing campaign and category-axis tests**

Render Campaigns, Traffic, and Conversion with `useIsMobile() === true`. Capture axis props and assert that the raw payload value is passed to `ResponsiveChartTick` with no `slice` formatter. Assert mobile categorical height follows the shared policy.

Use literal campaign name `Campanha Institucional Agosto 2026` and assert the rendered tick retains that complete value in both text and `title`.

Run:

```bash
npx vitest run src/tests/unit/dashboard/marketing-chart-mobile.test.tsx
```

Expected: FAIL because current formatters slice to 10, 18, or 20 characters and append fixed ellipses in Campaigns.

- [ ] **Step 2: Apply exact categorical layouts**

| Component | Axis width | Mobile margins | Height |
|---|---:|---|---:|
| campaings | 104 | top 16, left 4, right 16, bottom 8 | policy by campaign count |
| conversion | 104 | top 16, left 4, right 16, bottom 8 | policy by row count |
| traffic | 104 | top 16, left 4, right 16, bottom 8 | policy by row count |

Remove all `slice(...) + '...'` and `slice(0, 20)` category formatters. Use `tick={<ResponsiveChartTick axis='y' width={96} />}`. Keep full values in tooltip payloads.

- [ ] **Step 3: Apply exact cartesian layouts**

| Component | Mobile container | Mobile margins/ticks |
|---|---|---|
| cost | `h-80 min-w-0 w-full md:h-72` | top 24, left 8, right 12, bottom 8; preserve start/end ticks |
| performance | `h-80 min-w-0 w-full md:h-72` | top 24, left 8, right 12, bottom 8; preserve start/end ticks |
| revenue-by-campagn | `h-80 min-w-0 w-full md:h-72` | top 24, left 8, right 12, bottom 8; `minTickGap={28}` |
| revenue-by-origin | `h-80 min-w-0 w-full md:h-72` | top 20, left 8, right 12, bottom 8; full browser labels |

Set chart cards/wrappers to `min-w-0 overflow-hidden`. Keep numerical formatters and desktop heights unchanged.

- [ ] **Step 4: Run Marketing tests and lint**

```bash
npx vitest run src/tests/unit/dashboard/marketing-chart-mobile.test.tsx
npx eslint src/app/dashboard/marketing/_components/charts src/tests/unit/dashboard/marketing-chart-mobile.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/marketing/_components/charts src/tests/unit/dashboard/marketing-chart-mobile.test.tsx
git commit -m "fix: improve marketing charts on mobile"
```

---

### Task 5: Main dashboard chart family

**Files:**
- Modify: `src/app/dashboard/_components/comparison-unit.tsx`
- Modify: `src/app/dashboard/_components/sales-vs-repair-revenue.tsx`
- Modify: `src/app/dashboard/_components/revenue-chart.tsx`
- Modify: `src/tests/unit/components/sales-history-chart.test.tsx`
- Modify: `src/tests/unit/components/revenue-history-chart.test.tsx`
- Create: `src/tests/unit/dashboard/main-dashboard-chart-mobile.test.tsx`

**Interfaces:**
- Consumes: responsive containment and wrapping legend behavior from Task 1.

- [ ] **Step 1: Write failing mobile history tests**

Make the `useIsMobile` mock mutable. In mobile mode, assert both historical charts keep an X axis with:

```ts
expect(xAxisProps.fontSize).toBe(8);
expect(xAxisProps.interval).toBe('preserveStartEnd');
expect(xAxisProps.minTickGap).toBe(28);
```

Assert chart margins equal `{ top: 24, left: 8, right: 12, bottom: 8 }`. Current code returns no X axis on mobile, so the test must fail.

- [ ] **Step 2: Keep sparse date axes visible on mobile**

For both AreaChart and LineChart branches in both files:

```tsx
<XAxis
  dataKey='period'
  tickLine={false}
  tickMargin={8}
  axisLine={false}
  fontSize={8}
  interval='preserveStartEnd'
  minTickGap={28}
/>
```

Use mobile margins `{ top: 24, left: 8, right: 12, bottom: 8 }` and existing desktop margins. Correct the revenue container class from `md:72` to `md:h-72`. Keep the line/area switching and legend rules unchanged.

- [ ] **Step 3: Fit comparison donuts at 320 px**

Set the comparison chart container to `mx-auto h-[280px] min-w-0 w-full max-w-[320px] md:aspect-square md:max-h-[340px]`. Reduce mobile pie radii and font sizes by 8 px/2 px respectively; preserve desktop values. Keep comparison section visibility unchanged.

- [ ] **Step 4: Run main-dashboard tests and lint**

```bash
npx vitest run src/tests/unit/components/sales-history-chart.test.tsx src/tests/unit/components/revenue-history-chart.test.tsx src/tests/unit/dashboard/main-dashboard-chart-mobile.test.tsx
npx eslint src/app/dashboard/_components/comparison-unit.tsx src/app/dashboard/_components/sales-vs-repair-revenue.tsx src/app/dashboard/_components/revenue-chart.tsx src/tests/unit/components/sales-history-chart.test.tsx src/tests/unit/components/revenue-history-chart.test.tsx src/tests/unit/dashboard/main-dashboard-chart-mobile.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/_components/comparison-unit.tsx src/app/dashboard/_components/sales-vs-repair-revenue.tsx src/app/dashboard/_components/revenue-chart.tsx src/tests/unit/components/sales-history-chart.test.tsx src/tests/unit/components/revenue-history-chart.test.tsx src/tests/unit/dashboard/main-dashboard-chart-mobile.test.tsx
git commit -m "fix: improve overview charts on mobile"
```

---

### Task 6: Goals-result chart family

**Files:**
- Modify: `src/app/dashboard/goals-result/_components/charts/pie-store.tsx`
- Modify: `src/app/dashboard/goals-result/_components/charts/revenue.tsx`
- Modify: `src/app/dashboard/goals-result/_components/charts/seller-comparison-desktop.tsx`
- Modify: `src/app/dashboard/goals-result/_components/charts/seller-comparison-mobile.tsx`
- Modify: `src/app/dashboard/goals-result/_components/charts/seller-revenue.tsx`
- Create: `src/tests/unit/dashboard/goals-chart-mobile.test.tsx`

**Interfaces:**
- Consumes: `ResponsiveChartTick` and `getMobileCategoricalChartHeight` from Task 1.

- [ ] **Step 1: Write failing seller-label tests**

Use seller name `VENDEDOR COM NOME COMPLETO`. Render the mobile and desktop comparison charts and assert the full value reaches the responsive tick unchanged and no rendered text contains a manually appended `...`.

Run:

```bash
npx vitest run src/tests/unit/dashboard/goals-chart-mobile.test.tsx
```

Expected: FAIL because both seller comparison formatters append fixed ellipses.

- [ ] **Step 2: Apply exact seller chart layouts**

| Component | Axis width | Mobile margins | Height |
|---|---:|---|---:|
| seller-comparison-mobile | 104 | top 16, left 4, right 16, bottom 8 | policy by seller count |
| seller-revenue | 104 | top 16, left 4, right 16, bottom 8 | policy by seller count |

Use `<ResponsiveChartTick axis='y' width={96} />` and remove character slicing. For `seller-comparison-desktop`, keep horizontal layout but use `<ResponsiveChartTick axis='x' width={96} />` so actual available width controls ellipsis.

- [ ] **Step 3: Fit revenue and store charts**

- `revenue.tsx`: container `h-80 min-w-0 w-full`; mobile margins top 24/left 8/right 12/bottom 8; X axis `interval='preserveStartEnd'` and `minTickGap={28}`.
- `pie-store.tsx`: container `mx-auto h-[280px] min-w-0 w-full max-w-[320px] md:max-h-[288px]`; reduce mobile radial dimensions while preserving center labels; legend wraps through the shared legend.

- [ ] **Step 4: Run Goals tests and lint**

```bash
npx vitest run src/tests/unit/dashboard/goals-chart-mobile.test.tsx
npx eslint src/app/dashboard/goals-result/_components/charts src/tests/unit/dashboard/goals-chart-mobile.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/goals-result/_components/charts src/tests/unit/dashboard/goals-chart-mobile.test.tsx
git commit -m "fix: improve goals charts on mobile"
```

---

### Task 7: Exhaustive audit and final verification

**Files:**
- Modify only files identified by the audit as still violating a global constraint.
- Test: all test files created or modified in Tasks 1–6.

**Interfaces:**
- Validates every chart family and text truncation consumer against the global constraints.

- [ ] **Step 1: Audit every chart container**

Run:

```bash
rg -l "ChartContainer|ResponsiveContainer" src/app src/components -g '*.tsx' | sort
```

Expected inventory: 26 application chart components plus `src/components/ui/chart.tsx`. Check each application component for a positive mobile height, `min-w-0`, bounded margins, and no fixed-width child wider than 320 px.

- [ ] **Step 2: Audit manual text shortening**

Run:

```bash
rg -n "slice\([^\n]*\)\s*\+\s*['\"]\.\.\.['\"]|substring\([^\n]*\)\s*\+\s*['\"]\.\.\.['\"]" src/app src/components -g '*.tsx' -g '*.ts'
```

Expected: no matches. Date/month compacting without an appended ellipsis may remain when it is semantic formatting rather than overflow handling.

- [ ] **Step 3: Run all focused tests**

```bash
npx vitest run src/tests/unit/components/responsive-chart.test.tsx src/tests/unit/components/truncated-text.test.tsx src/tests/unit/dashboard/ranking-text-truncation.test.tsx src/tests/unit/dashboard/origin-chart-colors.test.ts src/tests/unit/dashboard/comercial-chart-mobile.test.tsx src/tests/unit/dashboard/marketing-chart-mobile.test.tsx src/tests/unit/components/sales-history-chart.test.tsx src/tests/unit/components/revenue-history-chart.test.tsx src/tests/unit/dashboard/main-dashboard-chart-mobile.test.tsx src/tests/unit/dashboard/goals-chart-mobile.test.tsx
```

Expected: all focused files pass.

- [ ] **Step 4: Run ESLint for the complete changed surface**

```bash
npx eslint src/components/ui/chart.tsx src/components/ui/responsive-chart.tsx src/components/ui/truncated-text.tsx src/app/dashboard/_components src/app/dashboard/comercial/_components src/app/dashboard/marketing/_components/charts src/app/dashboard/goals-result/_components/charts src/tests/unit/components src/tests/unit/dashboard
```

Expected: exit 0 with no ESLint output.

- [ ] **Step 5: Run the complete unit suite**

```bash
npm test
```

Expected: exit 0. The repository's pre-existing Vite ESM/CommonJS config-loader warning may still appear; no test may fail.

- [ ] **Step 6: Inspect the final diff and commit audit fixes**

```bash
git diff --check
git status --short
```

If Step 1 or Step 2 required corrections, stage only those explicit files and commit:

```bash
git commit -m "test: verify application chart responsiveness"
```

Do not run `npm run build`.
