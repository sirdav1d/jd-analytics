import "server-only";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { importSales } from "@/services/sales-import/import-sales";
import { createLinxClient } from "./client";
import {
  readLinxConfig,
  type LinxConfig,
} from "./config";
import { createDeadline } from "./deadline";
import { LinxDataError } from "./errors";
import {
  canonicalizeLinxGuid,
  createLinxDataAdapters,
  type LinxCatalogReader,
  type LinxSaleComplement,
} from "./sync-adapter";
import { createSyncRepository } from "./sync-repository";
import type {
  SyncDependencies,
  SyncInput,
} from "./sync";
import { verifyReconciliationAuthorization } from "./preview-authorization";

const SALES_CACHE_TAGS = [
  "tracking-goal",
  "home",
  "sales-by",
  "rankings",
  "big-numbers-comercial",
  "origin",
  "origin-data",
] as const;

function historicalIdentityKey(
  organizationId: string,
  documentNumber: string,
  date: Date,
) {
  return [
    organizationId,
    documentNumber,
    date.toISOString(),
  ].join(":");
}

export function buildCatalogReader(
  organizationId: string,
): LinxCatalogReader {
  return {
    async readCustomers(codes) {
      if (codes.length === 0) return [];
      return prisma.customer.findMany({
        where: { externalCode: { in: codes } },
        select: {
          externalCode: true,
          name: true,
          personType: true,
        },
      });
    },
    async readSellers(codes) {
      if (codes.length === 0) return [];
      const sellers = await prisma.user.findMany({
        where: { externalId: { in: codes.map(String) } },
        select: { externalId: true, name: true },
      });
      return sellers.map((seller) => ({
        externalCode: Number(seller.externalId),
        name: seller.name,
      }));
    },
    async readProducts(codes) {
      if (codes.length === 0) return [];
      const products = await prisma.product.findMany({
        where: { external_code: { in: codes } },
        select: {
          external_code: true,
          description: true,
          brand: true,
          sector: true,
        },
      });
      return products.flatMap((product) =>
        product.external_code === null
          ? []
          : [
              {
                productCode: product.external_code,
                description: product.description,
                brand: product.brand,
                sector: product.sector,
              },
            ],
      );
    },
    async readAffectedSaleIdentifiers({ routineCodes, responseIds }) {
      if (routineCodes.length === 0 && responseIds.length === 0) return [];
      const sales = await prisma.pedido.findMany({
        where: {
          organizationId,
          linxIdentifier: { not: null },
          OR: [
            ...(routineCodes.length > 0
              ? [{ linxRoutineOriginCode: { in: routineCodes } }]
              : []),
            ...(responseIds.length > 0
              ? [{ linxSalesResponseId: { in: responseIds } }]
              : []),
            { linxOriginBindingsSyncedAt: null },
          ],
        },
        select: { linxIdentifier: true },
      });
      return sales.flatMap((sale) =>
        sale.linxIdentifier === null
          ? []
          : [canonicalizeLinxGuid(sale.linxIdentifier)],
      );
    },
    async readSaleComplements(identities) {
      if (identities.length === 0) return new Map();
      const canonicalIdentities = identities.map((identity) => ({
        ...identity,
        identifier: canonicalizeLinxGuid(identity.identifier),
      }));
      const identifiers = canonicalIdentities.map(
        (identity) => identity.identifier,
      );
      const sales = await prisma.pedido.findMany({
        where: {
          OR: [
            // The GUID is globally unique, so this branch also detects
            // ownership collisions before any complement can be reused.
            { linxIdentifier: { in: identifiers } },
            ...canonicalIdentities.map((identity) => ({
              organizationId,
              documentNumber: identity.documentNumber,
              data_pedido: identity.date,
            })),
          ],
        },
        select: {
          id: true,
          linxIdentifier: true,
          organizationId: true,
          documentNumber: true,
          data_pedido: true,
          origin_linx: true,
          linxRoutineOriginCode: true,
          linxSalesResponseId: true,
          linxOriginBindingsSyncedAt: true,
          paymentMethod: { select: { method: true } },
          Origin: { select: { name: true } },
        },
      });
      const requestedIdentifiers = new Set(identifiers);
      if (
        sales.some(
          (sale) =>
            sale.linxIdentifier !== null &&
            requestedIdentifiers.has(
              canonicalizeLinxGuid(sale.linxIdentifier),
            ) &&
            sale.organizationId !== organizationId,
        )
      ) {
        throw new LinxDataError();
      }
      const byGuid = new Map(
        sales.flatMap((sale) =>
          sale.organizationId !== organizationId ||
          sale.linxIdentifier === null
            ? []
            : [[canonicalizeLinxGuid(sale.linxIdentifier), sale] as const],
        ),
      );
      const byHistorical = new Map(
        sales
          .filter(
            (sale) => sale.organizationId === organizationId,
          )
          .map((sale) => [
            historicalIdentityKey(
              sale.organizationId,
              sale.documentNumber,
              sale.data_pedido,
            ),
            sale,
          ]),
      );
      const complements = new Map<string, LinxSaleComplement>();
      for (const identity of canonicalIdentities) {
        const guidMatch = byGuid.get(identity.identifier);
        const historicalMatch = byHistorical.get(
          historicalIdentityKey(
            organizationId,
            identity.documentNumber,
            identity.date,
          ),
        );
        if (
          guidMatch &&
          historicalMatch &&
          guidMatch.id !== historicalMatch.id
        ) {
          throw new LinxDataError();
        }
        if (
          historicalMatch?.linxIdentifier &&
          canonicalizeLinxGuid(historicalMatch.linxIdentifier) !==
            identity.identifier
        ) {
          throw new LinxDataError();
        }
        const sale = guidMatch ?? historicalMatch;
        if (!sale) continue;
        complements.set(identity.identifier, {
          paymentLabel: sale.paymentMethod?.method ?? null,
          operationalOrigin: sale.origin_linx,
          commercialOrigin: sale.Origin?.name ?? null,
          routineOriginCode: sale.linxRoutineOriginCode,
          salesResponseId: sale.linxSalesResponseId,
          originBindingsSynced:
            sale.linxOriginBindingsSyncedAt !== null,
        });
      }
      return complements;
    },
  };
}

export function buildProductionSyncDependencies(
  input: SyncInput,
  config: LinxConfig = readLinxConfig(),
): SyncDependencies {
  const deadline = createDeadline(Date.now, input.deadlineAt);
  const logger = {
    error(
      message: string,
      metadata?: Record<string, string | number | boolean>,
    ) {
      console.warn(message, metadata);
    },
    warn(
      message: string,
      metadata?: Record<string, string | number | boolean>,
    ) {
      console.warn(message, metadata);
    },
  };
  const client = createLinxClient(
    {
      user: config.user,
      password: config.password,
      key: config.key,
      deadlineMs: deadline.deadlineAt,
    },
    {
      fetch: globalThis.fetch,
      now: Date.now,
      wallClock: Date.now,
      logger,
    },
  );
  const adapters = createLinxDataAdapters({
    execute: client.execute,
    catalogReader: buildCatalogReader(input.organizationId),
    deadline,
    nowDate: () => new Date(),
  });
  const repo = createSyncRepository(prisma);

  return {
    deadline,
    prisma: {
      $transaction: (callback, options) =>
        prisma.$transaction(callback, options),
    },
    repo,
    nowDate: () => new Date(),
    async readOrganization(organizationId) {
      const organization = await prisma.organization.findUniqueOrThrow({
        where: { id: organizationId },
        select: { linxCnpj: true, external_code: true },
      });
      if (!organization.linxCnpj) throw new LinxDataError();
      return {
        linxCnpj: organization.linxCnpj,
        external_code: organization.external_code,
      };
    },
    ...adapters,
    importSales,
    verifyReconciliationAuthorization(token, expected) {
      return verifyReconciliationAuthorization(token, {
        key: config.key,
        now: new Date(),
        expected,
      });
    },
    revalidateSales() {
      for (const tag of SALES_CACHE_TAGS) revalidateTag(tag);
    },
    logger,
  };
}
