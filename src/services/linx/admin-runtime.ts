import "server-only";
import { prisma } from "@/lib/prisma";
import { createLinxClient } from "./client";
import { readLinxConfig } from "./config";
import {
  createReconciliationBusinessFingerprint,
  createReconciliationLegacyBusinessFingerprint,
  previewReconciliation,
  type ReconciliationBusinessFingerprintInput,
  type ReconciliationOrder,
  type ReconciliationPeriod,
} from "./reconciliation";
import { discoverStores } from "./store-discovery";
import { collectLinxData, type SyncInput } from "./sync";
import { buildProductionSyncDependencies } from "./sync-runtime";
import {
  createCanonicalSalesSnapshotHash,
  issueReconciliationAuthorization,
} from "./preview-authorization";

const PREVIEW_RUNTIME_BUDGET_MS = 48_000;

function reconciliationFingerprints(
  input: ReconciliationBusinessFingerprintInput,
) {
  return {
    businessFingerprint: createReconciliationBusinessFingerprint(input),
    legacyBusinessFingerprint:
      createReconciliationLegacyBusinessFingerprint(input),
  };
}

function createLogger() {
  return {
    error(
      message: string,
      metadata?: Record<string, string | number | boolean>,
    ) {
      console.warn(message, metadata);
    },
  };
}

export async function discoverLinxStores() {
  const config = readLinxConfig();
  const client = createLinxClient(
    {
      user: config.user,
      password: config.password,
      key: config.key,
    },
    {
      fetch: globalThis.fetch,
      now: Date.now,
      wallClock: Date.now,
      logger: createLogger(),
    },
  );

  return discoverStores({ execute: client.execute });
}

function toLinxPreviewOrders(
  organizationId: string,
  sales: Awaited<ReturnType<typeof collectLinxData>>["sales"],
): ReconciliationOrder[] {
  return sales.map((sale) => {
    const items = sale.items.filter((item) => item.excluded !== true);
    return {
      linxIdentifier: sale.linxIdentifier ?? null,
      historicalKey: {
        documentNumber: sale.documentNumber,
        organizationId,
        date: sale.date.toISOString().slice(0, 10),
      },
      cancelled: sale.cancelled,
      itemCount: items.length,
      grossValue: items.reduce((total, item) => total + item.totalValue, 0),
      ...reconciliationFingerprints({
        cancelled: sale.cancelled,
        natureOperation: sale.natureOperation,
        operationType: sale.operationType,
        operationalOrigin: sale.operationalOrigin,
        customerExternalCode: sale.customer?.externalCode ?? null,
        sellerExternalId:
          sale.seller.externalCode === null
            ? "não encontrado"
            : String(sale.seller.externalCode),
        paymentLabel: sale.paymentLabel,
        commercialOrigin: sale.commercialOrigin,
        items: sale.items.map((item) => ({
          productExternalCode: item.productCode,
          quantity: item.quantity,
          unitValue: item.unitValue,
          totalValue: item.totalValue,
          excluded: item.excluded,
        })),
      }),
    };
  });
}

async function readDatabaseOrders(
  organizationId: string,
  period: ReconciliationPeriod,
): Promise<ReconciliationOrder[]> {
  const sales = await prisma.pedido.findMany({
    where: {
      organizationId,
      data_pedido: {
        gte: new Date(`${period.from}T00:00:00.000Z`),
        lte: new Date(`${period.to}T00:00:00.000Z`),
      },
    },
    select: {
      documentNumber: true,
      organizationId: true,
      data_pedido: true,
      linxIdentifier: true,
      cancelled: true,
      natureOperation: true,
      operationType: true,
      origin_linx: true,
      customer: { select: { externalCode: true } },
      user: { select: { externalId: true } },
      paymentMethod: { select: { method: true } },
      Origin: { select: { name: true } },
      items: {
        select: {
          quantity: true,
          unitValue: true,
          totalValue: true,
          product: { select: { external_code: true } },
        },
      },
    },
  });

  return sales.map((sale) => ({
    linxIdentifier: sale.linxIdentifier,
    historicalKey: {
      documentNumber: sale.documentNumber,
      organizationId: sale.organizationId,
      date: sale.data_pedido.toISOString().slice(0, 10),
    },
    cancelled: sale.cancelled,
    itemCount: sale.items.length,
    grossValue: sale.items.reduce(
      (total, item) => total + item.totalValue,
      0,
    ),
    ...reconciliationFingerprints({
      cancelled: sale.cancelled,
      natureOperation: sale.natureOperation,
      operationType: sale.operationType,
      operationalOrigin: sale.origin_linx,
      customerExternalCode: sale.customer?.externalCode ?? null,
      sellerExternalId: sale.user?.externalId ?? null,
      paymentLabel: sale.paymentMethod?.method ?? null,
      commercialOrigin: sale.Origin?.name ?? null,
      items: sale.items.map((item) => ({
        productExternalCode: item.product.external_code,
        quantity: item.quantity,
        unitValue: item.unitValue,
        totalValue: item.totalValue,
      })),
    }),
  }));
}

export async function previewProductionReconciliation(
  organizationId: string,
  issuedById: string,
  period?: ReconciliationPeriod,
) {
  const startedAt = Date.now();
  const deadlineAt = startedAt + PREVIEW_RUNTIME_BUDGET_MS;
  const config = readLinxConfig();
  const organization = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    select: { linxCnpj: true, linxSyncEnabled: true },
  });
  if (!organization.linxSyncEnabled || !organization.linxCnpj) {
    throw new Error("Organização Linx inativa");
  }
  const input: SyncInput = {
    organizationId,
    trigger: "RECONCILIATION",
    mode: "RECONCILIATION",
    deadlineAt,
    transactionTimeoutMs: 20_000,
  };
  const dependencies = buildProductionSyncDependencies(input, config);
  let collected:
    | Awaited<ReturnType<typeof collectLinxData>>
    | undefined;

  let linxOrders: ReconciliationOrder[] = [];
  const preview = await previewReconciliation(
    { runtimeBudgetMs: PREVIEW_RUNTIME_BUDGET_MS, period },
    {
      now: Date.now,
      nowDate: () => new Date(),
      async readLinxOrders(period) {
        collected ??= await collectLinxData(input, dependencies, {
          reconciliationPeriod: period,
        });
        linxOrders = toLinxPreviewOrders(organizationId, collected.sales);
        return linxOrders;
      },
      readDatabaseOrders: (period) =>
        readDatabaseOrders(organizationId, period),
    },
  );
  const { targetLinxIdentifiers, ...publicPreview } = preview;
  return {
    ...publicPreview,
    authorizationToken: preview.fitsRuntimeBudget
      ? issueReconciliationAuthorization(
          {
            organizationId,
            cnpj: organization.linxCnpj,
            issuedById,
            period: preview.period,
            snapshotHash:
              createCanonicalSalesSnapshotHash(collected?.sales ?? []),
            fitsRuntimeBudget: preview.fitsRuntimeBudget,
            targetLinxIdentifiers,
          },
          {
            key: config.key,
            now: new Date(),
            ttlMs: 10 * 60_000,
          },
        )
      : null,
  };
}
