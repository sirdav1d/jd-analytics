# Coordinated Linx and Media Sync Design

## Goal

Update Linx revenue and the existing current-month Meta investment in one coordinated manual or scheduled operation. Verify both Google Ads accounts during that same operation, then refresh the dashboard and public marketing report only when every source succeeds.

## Constraints

- Do not add tables, Prisma models, or database migrations.
- Preserve `MetaInvestment` as the sole persisted Meta monthly investment record.
- Keep Google Ads costs live in the existing report aggregation.
- Restrict automation to the current São Paulo business month.
- Keep the existing Linx sync records and all historical manual Meta records.
- Schedule the Vercel cron at `0 22 * * *`.
- Never expose tokens, raw provider responses, or provider error bodies.

## Flow

`POST /api/sync` and `GET /api/cron/sync` call one server-side coordinator. It establishes one civil cutoff from `America/Sao_Paulo`: the first day of the current month through today.

The coordinator starts these operations in parallel:

1. Existing incremental Linx sync.
2. Meta account-level Insights read for the cutoff range.
3. Google Ads Produtos cost read for the cutoff range.
4. Google Ads Serviços cost read for the cutoff range.

The Google reads validate account availability and cost retrieval in the same execution; their values are not stored in a new aggregate. The current report continues to obtain both Google amounts live, as it does today.

If every operation succeeds, the coordinator upserts the existing `MetaInvestment` row for the current month with the Meta amount and cutoff, then invalidates the dashboard and public-report cache paths. The browser refresh therefore renders Linx revenue, the newly persisted Meta amount, and freshly read Google amounts.

If any operation fails, the coordinator does not write `MetaInvestment` and does not invalidate the report. Linx may already have completed its independent incremental import, which is safe and remains recorded by its current mechanisms. The customer-visible report retains its previous Meta cutoff until a complete future run succeeds.

## Interfaces

- `POST /api/sync`: authenticated manual run; returns safe per-source status and cutoff.
- `GET /api/sync/status`: authenticated status derived from existing Meta investment data and any in-flight client state; it does not require a new run table.
- `GET /api/cron/sync`: protected by `CRON_SECRET`; runs the same coordinator.
- Sidebar: `DataSyncControl` replaces the Linx-only control and refreshes after complete success.

## Error Handling

Every provider failure is mapped to a source-specific safe Portuguese message. Raw errors and credentials are not stored, logged, or sent to the browser. A partial run returns a non-success response and leaves the persisted Meta value and public report cache untouched.

## Testing

Unit tests cover Meta ID and response validation, exact Google micros conversion, parallel collection, complete-success persistence into `MetaInvestment`, and failure cases that prove no Meta update or cache invalidation occurs. Route and component tests cover authorization, cron protection, scheduling, and shared sidebar state. Existing report tests remain the regression guard for live Google costs and attributed Linx revenue.

## Production Rollout

Run unit, lint, Prisma validation, and build locally. Verify read-only Meta access without printing the token. Before any production deployment, rotate the token disclosed in the conversation and obtain explicit authorization to set the replacement in Vercel.
