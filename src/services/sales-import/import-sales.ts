import { Prisma } from "@prisma/client";
import type { CanonicalSale, ImportSummary } from "./contracts";
import { disambiguateLinxDocumentNumber } from "./document-identity";
import { planItemChanges } from "./item-matching";
import { resolveSaleDimensions, upsertProduct } from "./upsert-dimensions";

type ExistingPedido = Prisma.PedidoGetPayload<{
  include: { items: { include: { product: true } } };
}>;

function compositePedidoWhere(sale: CanonicalSale, organizationId: string) {
  return {
    documentNumber_organizationId_data_pedido: {
      documentNumber: sale.documentNumber,
      organizationId,
      data_pedido: sale.date,
    },
  };
}

async function findExistingPedido(
  tx: Prisma.TransactionClient,
  sale: CanonicalSale,
  organizationId: string,
): Promise<{
  existing: ExistingPedido | null;
  documentNumber: string;
}> {
  const include = { items: { include: { product: true } } } as const;

  if (!sale.linxIdentifier) {
    return {
      existing: await tx.pedido.findUnique({
        where: compositePedidoWhere(sale, organizationId),
        include,
      }),
      documentNumber: sale.documentNumber,
    };
  }

  const byLinxIdentifier = await tx.pedido.findFirst({
    where: { linxIdentifier: sale.linxIdentifier },
    include,
  });
  if (
    byLinxIdentifier &&
    (byLinxIdentifier.organizationId !== organizationId ||
      byLinxIdentifier.linxIdentifier !== sale.linxIdentifier)
  ) {
    throw new Error(
      `colisão de Pedido: GUID Linx ${sale.linxIdentifier} pertence a outra organização`,
    );
  }
  const byComposite = await tx.pedido.findUnique({
      where: compositePedidoWhere(sale, organizationId),
      include,
    });
  const collisionDocumentNumber = disambiguateLinxDocumentNumber(
    sale.documentNumber,
    sale.linxIdentifier,
  );
  if (byLinxIdentifier) {
    const existingDocumentNumber = byLinxIdentifier.documentNumber;
    const alreadyDisambiguated = existingDocumentNumber?.endsWith(
      `#linx:${sale.linxIdentifier}`,
    );
    return {
      existing: byLinxIdentifier,
      documentNumber:
        alreadyDisambiguated ||
        (byComposite && byComposite.id !== byLinxIdentifier.id)
          ? alreadyDisambiguated
            ? existingDocumentNumber
            : collisionDocumentNumber
          : sale.documentNumber,
    };
  }
  if (
    byComposite?.linxIdentifier &&
    byComposite.linxIdentifier !== sale.linxIdentifier
  ) {
    return {
      existing: null,
      documentNumber: collisionDocumentNumber,
    };
  }
  return {
    existing: byComposite,
    documentNumber: sale.documentNumber,
  };
}

function toExistingItems(pedido: ExistingPedido["items"]) {
  return pedido.map((item) => ({
    id: item.id,
    productCode: item.product.external_code,
    quantity: item.quantity,
    unitValue: item.unitValue,
    totalValue: item.totalValue,
    linxOrder: item.linxOrder,
  }));
}

function assertValidSale(sale: CanonicalSale) {
  if (!(sale.date instanceof Date) || Number.isNaN(sale.date.getTime())) {
    throw new Error("Data da venda deve ser uma Date válida");
  }

  for (const item of sale.items) {
    if (!Number.isSafeInteger(item.productCode) || item.productCode <= 0) {
      throw new Error("Código de produto deve ser um inteiro positivo");
    }
  }

  if (sale.source === "CSV") {
    if (sale.linxIdentifier !== undefined || sale.linxTimestamp !== undefined) {
      throw new Error("CSV não pode conter metadados Linx do pedido");
    }
    for (const item of sale.items) {
      if (
        item.linxOrder !== undefined ||
        item.linxTimestamp !== undefined ||
        item.excluded !== undefined
      ) {
        throw new Error("CSV não pode conter metadados Linx do item");
      }
    }
    return;
  }

  if (sale.source !== "LINX") {
    throw new Error("Fonte de importação inválida");
  }
  if (!sale.linxIdentifier || !isUuid(sale.linxIdentifier)) {
    throw new Error("Venda Linx exige um GUID UUID válido");
  }

  const orders = new Set<number>();
  for (const item of sale.items) {
    if (
      item.linxOrder === undefined ||
      !Number.isSafeInteger(item.linxOrder) ||
      item.linxOrder < 0
    ) {
      throw new Error("Item Linx exige uma ordem inteira válida");
    }
    if (orders.has(item.linxOrder)) {
      throw new Error("Venda Linx contém ordem de item duplicada");
    }
    orders.add(item.linxOrder);
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function canonicalizeSale(sale: CanonicalSale): CanonicalSale {
  return sale.linxIdentifier
    ? { ...sale, linxIdentifier: sale.linxIdentifier.toLowerCase() }
    : sale;
}

function compositeLockKey(sale: CanonicalSale) {
  return [
    "sales-import:composite",
    sale.organizationExternalCode,
    sale.documentNumber,
    sale.date.getTime(),
  ].join(":");
}

async function lockSaleIdentities(
  tx: Prisma.TransactionClient,
  sales: CanonicalSale[],
) {
  const keys = [...new Set(sales.flatMap((sale) => [
    compositeLockKey(sale),
    ...(sale.linxIdentifier ? [`sales-import:linx:${sale.linxIdentifier}`] : []),
  ]))].sort();

  for (const key of keys) {
    await tx.$queryRaw(
      Prisma.sql`SELECT pg_advisory_xact_lock(hashtextextended(${key}, 0))::text AS lock_result`,
    );
  }
}

export async function importSales(
  tx: Prisma.TransactionClient,
  sales: CanonicalSale[],
): Promise<ImportSummary> {
  // Validate the complete batch before taking locks or touching any transaction delegate.
  for (const sale of sales) assertValidSale(sale);
  const canonicalSales = sales.map(canonicalizeSale);
  await lockSaleIdentities(tx, canonicalSales);

  const summary: ImportSummary = {
    ordersProcessed: 0,
    itemsCreated: 0,
    itemsUpdated: 0,
    itemsRemoved: 0,
  };

  for (const sale of canonicalSales) {
    const organization = await tx.organization.findUniqueOrThrow({
      where: { external_code: sale.organizationExternalCode },
    });
    const resolution = await findExistingPedido(
      tx,
      sale,
      organization.id,
    );
    const existing = resolution.existing;

    if (
      sale.source === "LINX" &&
      !existing &&
      (sale.cancelled ||
        !sale.items.some((item) => item.excluded !== true))
    ) {
      continue;
    }

    // CSV is historical input only. Once Linx identifies a pedido, it owns it.
    if (sale.source === "CSV" && existing?.linxIdentifier) {
      summary.ordersProcessed += 1;
      continue;
    }

    const dimensions = await resolveSaleDimensions(tx, sale);
    const data = {
      documentNumber: resolution.documentNumber,
      data_pedido: sale.date,
      natureOperation: sale.natureOperation,
      operationType: sale.operationType,
      origin_linx: sale.operationalOrigin,
      cancelled: sale.cancelled,
      organizationId: dimensions.organization.id,
      customerId: dimensions.customer?.id ?? null,
      userId: dimensions.seller.id,
      paymentMethodId: dimensions.paymentMethod?.id ?? null,
      originId: dimensions.origin?.id ?? null,
      ...(sale.linxIdentifier
        ? {
            linxIdentifier: sale.linxIdentifier,
            linxTimestamp: sale.linxTimestamp,
            linxSyncedAt: new Date(),
            ...(sale.linxOriginBindingsComplete
              ? {
                  linxRoutineOriginCode:
                    sale.linxRoutineOriginCode ?? null,
                  linxSalesResponseId:
                    sale.linxSalesResponseId ?? null,
                  linxOriginBindingsSyncedAt: new Date(),
                }
              : {}),
          }
        : {}),
    };
    let pedido: { id: string };
    if (!existing) {
      pedido = await tx.pedido.create({ data });
    } else if (sale.linxIdentifier) {
      const updated = await tx.pedido.updateMany({
        where: {
          id: existing.id,
          organizationId: organization.id,
          OR: [
            { linxIdentifier: null },
            { linxIdentifier: sale.linxIdentifier },
          ],
        },
        data,
      });
      if (updated.count !== 1) {
        throw new Error(
          "colisão de Pedido: a identidade Linx mudou durante a importação",
        );
      }
      pedido = { id: existing.id };
    } else {
      pedido = await tx.pedido.update({ where: { id: existing.id }, data });
    }
    const incomingItems =
      sale.source === "LINX"
        ? sale.items
        : sale.items.filter((item) => !item.excluded);
    const itemPlan = planItemChanges(
      toExistingItems(existing?.items ?? []),
      incomingItems,
    );

    for (const item of itemPlan.create) {
      const product = await upsertProduct(tx, item, sale.source);
      await tx.saleItem.create({
        data: {
          saleId: pedido.id,
          productId: product.id,
          quantity: item.quantity,
          unitValue: item.unitValue,
          totalValue: item.totalValue,
          linxOrder: item.linxOrder,
          linxTimestamp: item.linxTimestamp,
        },
      });
      summary.itemsCreated += 1;
    }

    for (const item of itemPlan.update) {
      const product = await upsertProduct(tx, item, sale.source);
      await tx.saleItem.update({
        where: { id: item.id },
        data: {
          productId: product.id,
          quantity: item.quantity,
          unitValue: item.unitValue,
          totalValue: item.totalValue,
          linxOrder: item.linxOrder,
          linxTimestamp: item.linxTimestamp,
        },
      });
      summary.itemsUpdated += 1;
    }

    if (itemPlan.remove.length > 0) {
      const removed = await tx.saleItem.deleteMany({
        where: { id: { in: itemPlan.remove } },
      });
      summary.itemsRemoved += removed.count;
    }

    summary.ordersProcessed += 1;
  }

  return summary;
}
