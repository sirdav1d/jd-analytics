import type {
  CanonicalParty,
  CanonicalSale,
  CanonicalSaleItem,
  CanonicalSeller,
} from "@/services/sales-import/contracts";
import { disambiguateLinxDocumentNumber } from "@/services/sales-import/document-identity";
import {
  customerByCodeCommand,
  movementCommand,
  movementPlansCommand,
  movementPrincipalCommand,
  productByCodeCommand,
  routineOriginCommand,
  salesResponseCommand,
  sellerByCodeCommand,
} from "./commands";
import type { LinxDeadline } from "./deadline";
import { LinxDataError } from "./errors";
import { mapCatalogs } from "./mappers/catalogs";
import {
  buildCommercialOrigins,
  mapMovementPrincipals,
  mapRoutineOrigins,
  mapSalesResponses,
  type LinxOrigins,
} from "./mappers/commercial-origin";
import {
  isReportableSaleMovement,
  mapMovementRows,
  type LinxMovement,
} from "./mappers/movement";
import { mapPaymentLabels } from "./mappers/payment";
import { fetchTimestampPages } from "./pagination";
import type {
  LinxCommand,
  LinxResponse,
  LinxResponseRow,
} from "./types";

type ProductCatalogEntry = Pick<
  CanonicalSaleItem,
  | "productCode"
  | "description"
  | "brand"
  | "sector"
  | "catalogStatus"
  | "catalogLastCheckedAt"
  | "catalogResolvedAt"
>;

export type LinxCatalogs = {
  customers: Map<number, CanonicalParty>;
  sellers: Map<number, CanonicalSeller>;
  products: Map<number, ProductCatalogEntry>;
};

export type ValidatedLinxRows = {
  movements: LinxMovement[];
  paymentLabels: Map<string, string>;
  principals: Map<string, number | null>;
  routineOrigins: Map<number, string>;
  salesResponses: Map<number, string>;
  origins: Map<string, LinxOrigins>;
};

export type LinxSaleComplement = {
  paymentLabel: string | null;
  operationalOrigin: string;
  commercialOrigin: string | null;
  routineOriginCode?: number | null;
  salesResponseId?: number | null;
  originBindingsSynced?: boolean;
};

export type LinxSaleIdentity = {
  identifier: string;
  documentNumber: string;
  date: Date;
};

export function canonicalizeLinxGuid(identifier: string) {
  return identifier.toLowerCase();
}

export type LinxCatalogReader = {
  readCustomers(codes: number[]): Promise<CanonicalParty[]>;
  readSellers(codes: number[]): Promise<CanonicalSeller[]>;
  readProducts(codes: number[]): Promise<ProductCatalogEntry[]>;
  readAffectedSaleIdentifiers(input: {
    routineCodes: number[];
    responseIds: number[];
  }): Promise<string[]>;
  readSaleComplements(
    identities: LinxSaleIdentity[],
  ): Promise<Map<string, LinxSaleComplement>>;
};

export type LinxCompletionScope =
  | { mode: "INCREMENTAL" }
  | {
      mode: "RECONCILIATION";
      authorizedIdentifiers: ReadonlySet<string>;
    };

type AdapterInput = {
  execute(command: LinxCommand): Promise<LinxResponse>;
  catalogReader: LinxCatalogReader;
  deadline: LinxDeadline;
  nowDate(): Date;
};

type PageInput = {
  cnpj: string;
  timestamp: bigint;
};

type SyncRange = {
  from: string;
  to: string;
};

const CATALOG_LOOKUP_CONCURRENCY = 5;

async function forEachCatalogLookup<T>(
  values: T[],
  lookup: (value: T) => Promise<void>,
) {
  let nextIndex = 0;
  const workers = Array.from(
    {
      length: Math.min(CATALOG_LOOKUP_CONCURRENCY, values.length),
    },
    async () => {
      while (nextIndex < values.length) {
        const index = nextIndex;
        nextIndex += 1;
        await lookup(values[index]!);
      }
    },
  );
  await Promise.all(workers);
}

function unique(values: Array<number | null>) {
  return [...new Set(values.filter((value): value is number => value !== null))];
}

function movementSignature(movement: LinxMovement) {
  return JSON.stringify(movement, (_, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
}

function authoritativeMovementSnapshot(input: {
  identifier: string;
  delta: LinxMovement[];
  fetched: LinxMovement[];
}): LinxMovement[] {
  const snapshotByOrder = new Map<number, LinxMovement>();
  for (const movement of input.fetched) {
    if (movement.identificador !== input.identifier) continue;
    const existing = snapshotByOrder.get(movement.order);
    if (
      existing &&
      movementSignature(existing) !== movementSignature(movement)
    ) {
      throw new LinxDataError();
    }
    snapshotByOrder.set(movement.order, movement);
  }
  const snapshot = [...snapshotByOrder.values()];
  const first = snapshot[0];
  if (!first) throw new LinxDataError();
  snapshot.forEach((movement) => assertConsistentOrder(first, movement));

  for (const deltaMovement of input.delta) {
    const authoritative = snapshotByOrder.get(deltaMovement.order);
    if (
      !authoritative ||
      movementSignature(authoritative) !==
        movementSignature(deltaMovement)
    ) {
      throw new LinxDataError();
    }
  }
  return snapshot;
}

function parseLinxLaunchDate(value: string): Date {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})(?:(?:T| )(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(?:Z|[+-](\d{2}):(\d{2}))?)?$/.exec(
      value,
    );
  if (!match) throw new LinxDataError();

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = match[4] === undefined ? 0 : Number(match[4]);
  const minute = match[5] === undefined ? 0 : Number(match[5]);
  const second = match[6] === undefined ? 0 : Number(match[6]);
  const offsetHour = match[7] === undefined ? 0 : Number(match[7]);
  const offsetMinute = match[8] === undefined ? 0 : Number(match[8]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    offsetHour > 23 ||
    offsetMinute > 59 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new LinxDataError();
  }
  return date;
}

function assertConsistentOrder(
  first: LinxMovement,
  movement: LinxMovement,
) {
  if (
    first.documentNumber !== movement.documentNumber ||
    first.launchDate !== movement.launchDate ||
    first.customerCode !== movement.customerCode ||
    first.sellerCode !== movement.sellerCode ||
    first.operationalOriginCode !== movement.operationalOriginCode ||
    first.natureOperation !== movement.natureOperation ||
    first.operationType !== movement.operationType
  ) {
    throw new LinxDataError();
  }
}

export function mapCanonicalSales(input: ValidatedLinxRows & {
  organizationExternalCode: number;
  catalogs: LinxCatalogs;
}): CanonicalSale[] {
  const groups = new Map<string, LinxMovement[]>();
  for (const movement of input.movements) {
    groups.set(movement.identificador, [
      ...(groups.get(movement.identificador) ?? []),
      movement,
    ]);
  }

  const sales: CanonicalSale[] = [...groups.entries()].map(
    ([identifier, movements]): CanonicalSale => {
    const first = movements[0];
    if (!first) throw new LinxDataError();
    const header = movements.reduce(
      (latest, movement) =>
        movement.timestamp > latest.timestamp ? movement : latest,
      first,
    );
    movements.forEach((movement) => assertConsistentOrder(header, movement));

    const seller = input.catalogs.sellers.get(header.sellerCode);
    const customer =
      header.customerCode === null
        ? null
        : input.catalogs.customers.get(header.customerCode);
    if (!seller || (header.customerCode !== null && !customer)) {
      throw new LinxDataError();
    }

    const orders = new Set<number>();
    const items = movements.map((movement) => {
      const product = input.catalogs.products.get(movement.productCode);
      if (
        !product ||
        !Number.isSafeInteger(movement.productCode) ||
        movement.productCode <= 0 ||
        !Number.isSafeInteger(movement.order) ||
        movement.order < 0 ||
        orders.has(movement.order)
      ) {
        throw new LinxDataError();
      }
      orders.add(movement.order);
      return {
        ...product,
        quantity: movement.quantity,
        unitValue: movement.unitValue,
        totalValue: movement.totalValue,
        linxOrder: movement.order,
        linxTimestamp: movement.timestamp,
        excluded: movement.excluded,
      };
    });
    const linxTimestamp = movements.reduce(
      (highest, movement) =>
        movement.timestamp > highest ? movement.timestamp : highest,
      BigInt(0),
    );
    const origins = input.origins.get(identifier);

    return {
      source: "LINX",
      organizationExternalCode: input.organizationExternalCode,
      date: parseLinxLaunchDate(header.launchDate),
      documentNumber: header.documentNumber,
      natureOperation: header.natureOperation,
      operationType: header.operationType,
      operationalOrigin: origins?.operationalOrigin ?? "Não informado",
      cancelled: header.cancelled,
      customer: customer ?? null,
      seller,
      paymentLabel: input.paymentLabels.get(identifier) ?? null,
      commercialOrigin: origins?.commercialOrigin ?? null,
      linxIdentifier: identifier,
      linxTimestamp,
      linxRoutineOriginCode: header.operationalOriginCode,
      linxSalesResponseId: input.principals.get(identifier) ?? null,
      linxOriginBindingsComplete: true,
      items,
      };
    },
  );

  const historicalGroups = new Map<string, CanonicalSale[]>();
  for (const sale of sales) {
    const key = `${sale.date.toISOString()}:${sale.documentNumber}`;
    historicalGroups.set(key, [
      ...(historicalGroups.get(key) ?? []),
      sale,
    ]);
  }
  const disambiguatedDocuments = new Map<string, string>();
  for (const duplicates of historicalGroups.values()) {
    if (duplicates.length < 2) continue;
    const sorted = [...duplicates].sort((left, right) =>
      left.linxIdentifier!.localeCompare(right.linxIdentifier!),
    );
    for (const duplicate of sorted.slice(1)) {
      disambiguatedDocuments.set(
        duplicate.linxIdentifier!,
        disambiguateLinxDocumentNumber(
          duplicate.documentNumber,
          duplicate.linxIdentifier!,
        ),
      );
    }
  }
  return sales.map((sale) => ({
    ...sale,
    documentNumber:
      disambiguatedDocuments.get(sale.linxIdentifier!) ??
      sale.documentNumber,
  }));
}

export function createLinxDataAdapters(input: AdapterInput) {
  let salesResponseCatalog:
    | Promise<Map<number, string>>
    | undefined;

  const executePoint = async (command: LinxCommand) => {
    input.deadline.assert();
    return input.execute(command);
  };

  const loadSalesResponseCatalog = (cnpj: string) => {
    salesResponseCatalog ??= executePoint(
      salesResponseCommand({ cnpj, timestamp: BigInt(0) }),
    ).then((response) => mapSalesResponses(response.rows));
    return salesResponseCatalog;
  };

  const fetchPages = (
    initialTimestamp: bigint,
    buildCommand: (timestamp: bigint) => LinxCommand,
  ) =>
    fetchTimestampPages({
      initialTimestamp,
      executePage: async (timestamp) => {
        input.deadline.assert();
        return input.execute(buildCommand(timestamp));
      },
    });

  return {
    fetchMovementPages(
      page: PageInput & {
        mode: "INCREMENTAL" | "RECONCILIATION";
        range?: SyncRange;
      },
    ) {
      return fetchPages(page.timestamp, (timestamp) =>
        movementCommand({
          cnpj: page.cnpj,
          timestamp,
          mode:
            page.mode === "INCREMENTAL"
              ? "incremental"
              : "reconciliation",
          from: page.range?.from,
          to: page.range?.to,
        }),
      );
    },
    fetchMovementPlanPages(page: PageInput & { range?: SyncRange }) {
      return fetchPages(page.timestamp, (timestamp) =>
        movementPlansCommand({
          cnpj: page.cnpj,
          timestamp,
          from: page.range?.from,
          to: page.range?.to,
        }),
      );
    },
    fetchMovementPrincipalPages(page: PageInput) {
      return fetchPages(page.timestamp, (timestamp) =>
        movementPrincipalCommand({ cnpj: page.cnpj, timestamp }),
      );
    },
    fetchRoutineOriginPages(page: PageInput) {
      return fetchPages(page.timestamp, (timestamp) =>
        routineOriginCommand({ cnpj: page.cnpj, timestamp }),
      );
    },
    fetchSalesResponsePages(page: PageInput) {
      return fetchPages(page.timestamp, (timestamp) =>
        salesResponseCommand({ cnpj: page.cnpj, timestamp }),
      );
    },
    validateRows(rows: {
      movements: LinxResponseRow[];
      payments: LinxResponseRow[];
      principals: LinxResponseRow[];
      routines: LinxResponseRow[];
      responses: LinxResponseRow[];
    }): ValidatedLinxRows {
      const movements = mapMovementRows(rows.movements).filter(
        isReportableSaleMovement,
      );
      const principals = mapMovementPrincipals(rows.principals);
      const routineOrigins = mapRoutineOrigins(rows.routines);
      const salesResponses = mapSalesResponses(rows.responses);
      return {
        movements,
        paymentLabels: mapPaymentLabels(rows.payments),
        principals,
        routineOrigins,
        salesResponses,
        origins: buildCommercialOrigins({
          movements,
          routineOrigins,
          principals,
          salesResponses,
        }),
      };
    },
    async completeRows(
      cnpj: string,
      rows: ValidatedLinxRows,
      scope: LinxCompletionScope = { mode: "INCREMENTAL" },
    ): Promise<ValidatedLinxRows> {
      if (scope.mode === "RECONCILIATION") {
        const authorizedIdentifiers = scope.authorizedIdentifiers;
        const movements = rows.movements.filter((movement) =>
          authorizedIdentifiers.has(movement.identificador),
        );
        const materializedIdentifiers = new Set(
          movements.map((movement) => movement.identificador),
        );
        if (
          [...authorizedIdentifiers].some(
            (identifier) => !materializedIdentifiers.has(identifier),
          )
        ) {
          throw new LinxDataError();
        }
        const paymentLabels = new Map(
          [...rows.paymentLabels].filter(([identifier]) =>
            authorizedIdentifiers.has(identifier),
          ),
        );
        const principals = new Map(
          [...rows.principals].filter(([identifier]) =>
            authorizedIdentifiers.has(identifier),
          ),
        );
        return {
          movements,
          paymentLabels,
          principals,
          routineOrigins: rows.routineOrigins,
          salesResponses: rows.salesResponses,
          origins: buildCommercialOrigins({
            movements,
            routineOrigins: rows.routineOrigins,
            principals,
            salesResponses: rows.salesResponses,
          }),
        };
      }

      const impactedIdentifiers =
        new Set([
          ...rows.movements.map((movement) => movement.identificador),
          ...rows.paymentLabels.keys(),
          ...rows.principals.keys(),
        ]);
      if (rows.routineOrigins.size > 0 || rows.salesResponses.size > 0) {
        input.deadline.assert();
        const affected =
          await input.catalogReader.readAffectedSaleIdentifiers({
            routineCodes: [...rows.routineOrigins.keys()].sort(
              (left, right) => left - right,
            ),
            responseIds: [...rows.salesResponses.keys()].sort(
              (left, right) => left - right,
            ),
          });
        for (const identifier of affected) {
          impactedIdentifiers.add(canonicalizeLinxGuid(identifier));
        }
      }
      if (impactedIdentifiers.size === 0) return rows;

      const movements: LinxMovement[] = [];
      const directMovementIdentifiers = new Set(
        rows.movements.map((movement) => movement.identificador),
      );
      const reportableIdentifiers = new Set<string>();
      const snapshotTo = input.nowDate().toISOString().slice(0, 10);
      for (const identifier of impactedIdentifiers) {
        const response = await executePoint(
          movementCommand({
            cnpj,
            timestamp: BigInt(0),
            mode: "reconciliation",
            from: "1900-01-01",
            to: snapshotTo,
            identifier,
          }),
        );
        const snapshot = authoritativeMovementSnapshot({
          identifier,
          delta: rows.movements.filter(
            (movement) => movement.identificador === identifier,
          ),
          fetched: mapMovementRows(response.rows),
        });
        if (!snapshot.every(isReportableSaleMovement)) {
          if (directMovementIdentifiers.has(identifier)) {
            throw new LinxDataError();
          }
          continue;
        }
        movements.push(...snapshot);
        reportableIdentifiers.add(identifier);
      }

      const identities = [...reportableIdentifiers].map((identifier) => {
        const movement = movements.find(
          (candidate) => candidate.identificador === identifier,
        );
        if (!movement) throw new LinxDataError();
        return {
          identifier,
          documentNumber: movement.documentNumber,
          date: parseLinxLaunchDate(movement.launchDate),
        };
      });
      input.deadline.assert();
      const persisted =
        await input.catalogReader.readSaleComplements(identities);
      const paymentLabels = new Map(
        [...rows.paymentLabels].filter(([identifier]) =>
          reportableIdentifiers.has(identifier),
        ),
      );
      const principals = new Map(
        [...rows.principals].filter(([identifier]) =>
          reportableIdentifiers.has(identifier),
        ),
      );
      const routineOrigins = new Map(rows.routineOrigins);
      const salesResponses = new Map(rows.salesResponses);

      for (const identifier of reportableIdentifiers) {
        if (!paymentLabels.has(identifier)) {
          const response = await executePoint(
            movementPlansCommand({
              cnpj,
              timestamp: BigInt(0),
              identifier,
            }),
          );
          const fetched = mapPaymentLabels(response.rows).get(identifier);
          if (fetched !== undefined) {
            paymentLabels.set(identifier, fetched);
          } else {
            const persistedPayment =
              persisted.get(canonicalizeLinxGuid(identifier))?.paymentLabel;
            if (persistedPayment !== null && persistedPayment !== undefined) {
              paymentLabels.set(identifier, persistedPayment);
            }
          }
        }

        if (!principals.has(identifier)) {
          const response = await executePoint(
            movementPrincipalCommand({
              cnpj,
              timestamp: BigInt(0),
              identifier,
            }),
          );
          const fetched = mapMovementPrincipals(response.rows);
          if (fetched.has(identifier)) {
            principals.set(identifier, fetched.get(identifier) ?? null);
          }
        }
      }

      const routineCodes = unique(
        movements
          .filter((movement) =>
            reportableIdentifiers.has(movement.identificador),
          )
          .map((movement) => movement.operationalOriginCode),
      );
      for (const routineCode of routineCodes) {
        if (routineOrigins.has(routineCode)) continue;
        const response = await executePoint(
          routineOriginCommand({
            cnpj,
            timestamp: BigInt(0),
            routineCode,
          }),
        );
        const fetched = mapRoutineOrigins(response.rows);
        const description = fetched.get(routineCode);
        if (description !== undefined) {
          routineOrigins.set(routineCode, description);
        }
      }

      const missingResponseIds = unique(
        [...principals.values()].filter(
          (responseId) =>
            responseId !== null && !salesResponses.has(responseId),
        ),
      );
      if (missingResponseIds.length > 0) {
        const fetched = await loadSalesResponseCatalog(cnpj);
        for (const responseId of missingResponseIds) {
          const description = fetched.get(responseId);
          if (description !== undefined) {
            salesResponses.set(responseId, description);
          }
        }
      }

      const origins = new Map<string, LinxOrigins>();
      for (const identifier of reportableIdentifiers) {
        const movement = movements.find(
          (candidate) => candidate.identificador === identifier,
        );
        if (!movement) throw new LinxDataError();
        const previous = persisted.get(canonicalizeLinxGuid(identifier));
        const operationalOrigin =
          movement.operationalOriginCode === null
            ? null
            : routineOrigins.get(movement.operationalOriginCode) ??
              previous?.operationalOrigin;
        if (
          movement.operationalOriginCode !== null &&
          operationalOrigin === undefined
        ) {
          throw new LinxDataError();
        }
        const hasPrincipal = principals.has(identifier);
        const responseId = principals.get(identifier);
        const commercialOrigin = hasPrincipal
          ? responseId === null
            ? null
            : responseId === undefined
              ? previous?.commercialOrigin ?? null
              : salesResponses.get(responseId) ??
                previous?.commercialOrigin ??
                null
          : previous?.commercialOrigin ?? null;
        origins.set(identifier, {
          operationalOrigin: operationalOrigin ?? null,
          commercialOrigin,
        });
      }

      return {
        movements,
        paymentLabels,
        principals,
        routineOrigins,
        salesResponses,
        origins,
      };
    },
    async loadMissingCatalogs(
      cnpj: string,
      movements: LinxMovement[],
      scope: { mode: "INCREMENTAL" | "RECONCILIATION" } = {
        mode: "INCREMENTAL",
      },
    ): Promise<LinxCatalogs> {
      const customerCodes = unique(
        movements.map((movement) => movement.customerCode),
      );
      const sellerCodes = unique(
        movements.map((movement) => movement.sellerCode),
      );
      const productCodes = unique(
        movements.map((movement) => movement.productCode),
      );

      input.deadline.assert();
      const persistedProducts = await input.catalogReader.readProducts(
        productCodes,
      );
      let persistedCustomers: CanonicalParty[] = [];
      let persistedSellers: CanonicalSeller[] = [];
      if (scope.mode === "RECONCILIATION") {
        [persistedCustomers, persistedSellers] = await Promise.all([
          input.catalogReader.readCustomers(customerCodes),
          input.catalogReader.readSellers(sellerCodes),
        ]);
      }
      input.deadline.assert();

      const customers = new Map<number, CanonicalParty>(
        persistedCustomers.flatMap((customer) =>
          customer.externalCode === null
            ? []
            : [[customer.externalCode, customer] as const],
        ),
      );
      const sellers = new Map<number, CanonicalSeller>(
        persistedSellers.flatMap((seller) =>
          seller.externalCode === null
            ? []
            : [[seller.externalCode, seller] as const],
        ),
      );
      const products = new Map(
        persistedProducts
          .filter((product) => (product.catalogStatus ?? "KNOWN") === "KNOWN")
          .map((product) => [product.productCode, product]),
      );
      const missingCustomerCodes = customerCodes.filter(
        (code) => !customers.has(code),
      );
      const missingSellerCodes = sellerCodes.filter(
        (code) => !sellers.has(code),
      );
      const missingProductCodes = productCodes.filter(
        (code) => !products.has(code),
      );
      const pointLookupCount =
        missingCustomerCodes.length +
        missingSellerCodes.length +
        missingProductCodes.length;
      if (pointLookupCount > 1_000) throw new LinxDataError();
      await forEachCatalogLookup(missingCustomerCodes, async (customerCode) => {
        const response = await executePoint(
          customerByCodeCommand({ cnpj, customerCode }),
        );
        const mapped = mapCatalogs({
          customers: response.rows,
          sellers: [],
          products: [],
        }).customers;
        const customer = mapped.get(customerCode);
        if (!customer || mapped.size !== 1) throw new LinxDataError();
        customers.set(customerCode, customer);
      });
      await forEachCatalogLookup(missingSellerCodes, async (sellerCode) => {
        const response = await executePoint(
          sellerByCodeCommand({ cnpj, sellerCode }),
        );
        const mapped = mapCatalogs({
          customers: [],
          sellers: response.rows,
          products: [],
        }).sellers;
        const seller = mapped.get(sellerCode);
        if (!seller || mapped.size !== 1) throw new LinxDataError();
        sellers.set(sellerCode, seller);
      });
      const checkedAt = input.nowDate();
      const to = checkedAt.toISOString().slice(0, 10);
      await forEachCatalogLookup(missingProductCodes, async (productCode) => {
        const response = await executePoint(
          productByCodeCommand({
            cnpj,
            productCode,
            from: "1900-01-01",
            to,
          }),
        );
        if (response.rows.length === 0) {
          products.set(productCode, {
            productCode,
            description: `Produto não identificado — código ${productCode}`,
            brand: "Não informado",
            sector: "Não informado",
            catalogStatus: "PENDING",
            catalogLastCheckedAt: checkedAt,
            catalogResolvedAt: null,
          });
          return;
        }
        const candidates = response.rows.map((row) => {
          const mapped = mapCatalogs({
            customers: [],
            sellers: [],
            products: [row],
          }).products;
          const candidate = mapped.get(productCode);
          if (!candidate || mapped.size !== 1) throw new LinxDataError();
          return candidate;
        });
        const [product, ...duplicates] = candidates;
        if (
          !product ||
          duplicates.some(
            (candidate) =>
              candidate.description !== product.description ||
              candidate.brand !== product.brand ||
              candidate.sector !== product.sector,
          )
        ) {
          throw new LinxDataError();
        }
        products.set(productCode, {
          ...product,
          catalogStatus: "KNOWN",
          catalogLastCheckedAt: checkedAt,
          catalogResolvedAt: checkedAt,
        });
      });
      return { customers, sellers, products };
    },
    mapCanonicalSales,
  };
}
