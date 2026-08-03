export type ReconciliationPeriod = {
  from: string;
  to: string;
};

export type ReconciliationOrder = {
  linxIdentifier?: string | null;
  historicalKey: {
    documentNumber: string;
    organizationId: string;
    date: string;
  };
  cancelled: boolean;
  itemCount: number;
  grossValue: number;
  businessFingerprint: string;
  legacyBusinessFingerprint: string;
};

export type ReconciliationBusinessFingerprintInput = {
  cancelled: boolean;
  natureOperation: string | null | undefined;
  operationType: string | null | undefined;
  operationalOrigin: string | null | undefined;
  customerExternalCode: number | null | undefined;
  sellerExternalId: string | null | undefined;
  paymentLabel: string | null | undefined;
  commercialOrigin: string | null | undefined;
  items: Array<{
    productExternalCode: number | null | undefined;
    quantity: number;
    unitValue: number;
    totalValue: number;
    excluded?: boolean;
  }>;
};

export type ReconciliationPreview = {
  period: ReconciliationPeriod;
  linx: { orders: number; items: number; grossValue: number };
  database: { orders: number; items: number; grossValue: number };
  differences: {
    missingInDatabase: number;
    changedOrders: number;
    databaseOnly: number;
  };
  targetLinxIdentifiers: string[];
  estimatedDurationMs: number;
  fitsRuntimeBudget: boolean;
};

export type ReconciliationPreviewDependencies = {
  now(): number;
  nowDate(): Date;
  readLinxOrders(period: ReconciliationPeriod): Promise<ReconciliationOrder[]>;
  readDatabaseOrders(
    period: ReconciliationPeriod,
  ): Promise<ReconciliationOrder[]>;
};

const SAO_PAULO_TIME_ZONE = "America/Sao_Paulo";

function normalizedNullableString(value: string | null | undefined) {
  return value ?? null;
}

function normalizedNullableNumber(value: number | null | undefined) {
  return value ?? null;
}

function normalizedQuantity(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Quantidade de item inválida na conciliação");
  }
  return Object.is(value, -0) ? 0 : value;
}

function monetaryFourDecimalPlaces(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Valor monetário inválido na conciliação");
  }
  const magnitude = Math.abs(value);
  const roundingCompensation = Number.EPSILON * Math.max(1, magnitude);
  return (
    Math.sign(value) * Math.round((magnitude + roundingCompensation) * 10_000)
  );
}

function normalizedFingerprintItems(
  input: ReconciliationBusinessFingerprintInput,
  includeTotalValue: boolean,
) {
  return input.items
    .filter((item) => item.excluded !== true)
    .map((item) => ({
      productExternalCode: normalizedNullableNumber(item.productExternalCode),
      quantity: normalizedQuantity(item.quantity),
      unitValue: monetaryFourDecimalPlaces(item.unitValue),
      ...(includeTotalValue
        ? { totalValue: monetaryFourDecimalPlaces(item.totalValue) }
        : {}),
    }))
    .sort((left, right) =>
      JSON.stringify(left).localeCompare(JSON.stringify(right)),
    );
}

export function createReconciliationBusinessFingerprint(
  input: ReconciliationBusinessFingerprintInput,
) {
  const items = normalizedFingerprintItems(input, true);

  return JSON.stringify({
    cancelled: input.cancelled,
    natureOperation: normalizedNullableString(input.natureOperation),
    operationType: normalizedNullableString(input.operationType),
    operationalOrigin: normalizedNullableString(input.operationalOrigin),
    customerExternalCode: normalizedNullableNumber(input.customerExternalCode),
    sellerExternalId: normalizedNullableString(input.sellerExternalId),
    paymentLabel: normalizedNullableString(input.paymentLabel),
    commercialOrigin: normalizedNullableString(input.commercialOrigin),
    items,
  });
}

export function createReconciliationLegacyBusinessFingerprint(
  input: ReconciliationBusinessFingerprintInput,
) {
  const items = normalizedFingerprintItems(input, false);
  const operationType = normalizedNullableString(input.operationType);

  return JSON.stringify({
    cancelled: input.cancelled,
    natureOperation: normalizedNullableString(input.natureOperation),
    operationType: operationType === "S - Venda" ? "S" : operationType,
    operationalOrigin: normalizedNullableString(input.operationalOrigin),
    customerExternalCode: normalizedNullableNumber(input.customerExternalCode),
    sellerExternalId: normalizedNullableString(input.sellerExternalId),
    items,
  });
}

function saoPauloCalendarDate(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SAO_PAULO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);
  if (
    !Number.isSafeInteger(year) ||
    !Number.isSafeInteger(month) ||
    !Number.isSafeInteger(day)
  ) {
    throw new Error("Não foi possível determinar o calendário da conciliação");
  }
  return { year, month, day };
}

function isoCalendarDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function reconciliationPeriodFor(now: Date): ReconciliationPeriod {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new Error("Data de referência da conciliação inválida");
  }
  const local = saoPauloCalendarDate(now);
  const to = new Date(Date.UTC(local.year, local.month - 1, local.day));
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 29);
  return { from: isoCalendarDate(from), to: isoCalendarDate(to) };
}

export function assertDateWithinReconciliationPeriod(
  date: Date,
  period: ReconciliationPeriod,
) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("Data inválida na conciliação");
  }
  const value = isoCalendarDate(date);
  if (value < period.from || value > period.to) {
    throw new Error(
      `Venda fora do período autorizado da conciliação: ${value}`,
    );
  }
}

function summarize(orders: ReconciliationOrder[]) {
  return {
    orders: orders.length,
    items: orders.reduce((total, order) => total + order.itemCount, 0),
    grossValue: orders.reduce((total, order) => total + order.grossValue, 0),
  };
}

function isClosedSale(order: ReconciliationOrder) {
  return !order.cancelled && order.itemCount > 0;
}

function monetaryCents(value: number) {
  const magnitude = Math.abs(value);
  const roundingCompensation = Number.EPSILON * Math.max(1, magnitude);
  return (
    Math.sign(value) * Math.round((magnitude + roundingCompensation) * 100)
  );
}

function historicalKey(order: ReconciliationOrder) {
  return JSON.stringify([
    order.historicalKey.organizationId,
    order.historicalKey.date,
    order.historicalKey.documentNumber,
  ]);
}

function displayHistoricalKey(order: ReconciliationOrder) {
  return [
    order.historicalKey.organizationId,
    order.historicalKey.date,
    order.historicalKey.documentNumber,
  ].join("/");
}

function canonicalLinxIdentifier(order: ReconciliationOrder) {
  return order.linxIdentifier?.toLowerCase();
}

function indexOrders(
  orders: ReconciliationOrder[],
  source: "Linx" | "banco",
) {
  for (const order of orders) {
    if (
      typeof order.businessFingerprint !== "string" ||
      !order.businessFingerprint.trim()
    ) {
      throw new Error(
        `Fingerprint de negócio ausente na conciliação (${source}): ${displayHistoricalKey(order)}`,
      );
    }
    if (
      typeof order.legacyBusinessFingerprint !== "string" ||
      !order.legacyBusinessFingerprint.trim()
    ) {
      throw new Error(
        `Fingerprint de negócio legado ausente na conciliação (${source}): ${displayHistoricalKey(order)}`,
      );
    }
  }
  const byGuid = new Map<string, ReconciliationOrder>();
  const byHistoricalKey = new Map<string, ReconciliationOrder>();
  const sorted = [...orders].sort((left, right) => {
    const leftKey = `${canonicalLinxIdentifier(left) ?? ""}:${historicalKey(left)}`;
    const rightKey = `${canonicalLinxIdentifier(right) ?? ""}:${historicalKey(right)}`;
    return leftKey.localeCompare(rightKey);
  });

  for (const order of sorted) {
    const linxIdentifier = canonicalLinxIdentifier(order);
    if (linxIdentifier) {
      if (byGuid.has(linxIdentifier)) {
        throw new Error(
          `GUID duplicado na conciliação: ${linxIdentifier}`,
        );
      }
      byGuid.set(linxIdentifier, order);
    }

    const composite = historicalKey(order);
    if (byHistoricalKey.has(composite)) {
      throw new Error(
        `Chave histórica duplicada na conciliação: ${displayHistoricalKey(order)}`,
      );
    }
    byHistoricalKey.set(composite, order);
  }

  return { byGuid, byHistoricalKey };
}

export async function previewReconciliation(
  input: { runtimeBudgetMs: number },
  dependencies: ReconciliationPreviewDependencies,
): Promise<ReconciliationPreview> {
  if (!Number.isFinite(input.runtimeBudgetMs) || input.runtimeBudgetMs <= 0) {
    throw new Error("Orçamento de runtime inválido");
  }

  const startedAt = dependencies.now();
  const period = reconciliationPeriodFor(dependencies.nowDate());
  const linxOrders = await dependencies.readLinxOrders(period);
  const databaseOrders = await dependencies.readDatabaseOrders(period);
  const estimatedDurationMs = Math.max(0, dependencies.now() - startedAt);

  indexOrders(linxOrders, "Linx");
  const databaseIndex = indexOrders(databaseOrders, "banco");
  const matchedDatabase = new Set<ReconciliationOrder>();
  const targetLinxIdentifiers = new Set<string>();
  let missingInDatabase = 0;
  let changedOrders = 0;

  function selectTarget(order: ReconciliationOrder) {
    const linxIdentifier = canonicalLinxIdentifier(order);
    if (!linxIdentifier) {
      throw new Error("Pedido Linx selecionado sem GUID");
    }
    targetLinxIdentifiers.add(linxIdentifier);
  }

  for (const order of linxOrders) {
    const linxIdentifier = canonicalLinxIdentifier(order);
    const byGuid = linxIdentifier
      ? databaseIndex.byGuid.get(linxIdentifier)
      : undefined;
    const byComposite = databaseIndex.byHistoricalKey.get(historicalKey(order));
    if (byGuid && byComposite && byGuid !== byComposite) {
      throw new Error(
        `Colisão GUID/chave histórica na conciliação: ${displayHistoricalKey(order)}`,
      );
    }
    const persisted = byGuid ?? byComposite;

    if (!persisted) {
      if (isClosedSale(order)) {
        missingInDatabase += 1;
        selectTarget(order);
      }
      continue;
    }
    if (
      !byGuid &&
      linxIdentifier &&
      canonicalLinxIdentifier(persisted) &&
      canonicalLinxIdentifier(persisted) !== linxIdentifier
    ) {
      throw new Error(
        `Colisão de chave histórica na conciliação: ${displayHistoricalKey(order)}`,
      );
    }
    if (matchedDatabase.has(persisted)) {
      throw new Error(
        `Colisão de identidades na conciliação: ${displayHistoricalKey(order)}`,
      );
    }

    matchedDatabase.add(persisted);
    const businessFingerprintChanged =
      persisted.linxIdentifier === null
        ? persisted.legacyBusinessFingerprint !==
          order.legacyBusinessFingerprint
        : persisted.businessFingerprint !== order.businessFingerprint;
    if (
      persisted.itemCount !== order.itemCount ||
      monetaryCents(persisted.grossValue) !== monetaryCents(order.grossValue) ||
      persisted.cancelled !== order.cancelled ||
      businessFingerprintChanged ||
      (byGuid !== undefined &&
        historicalKey(persisted) !== historicalKey(order))
    ) {
      changedOrders += 1;
      selectTarget(order);
    }
  }
  const databaseOnly = databaseOrders.filter(
    (order) => isClosedSale(order) && !matchedDatabase.has(order),
  ).length;

  return {
    period,
    linx: summarize(linxOrders.filter(isClosedSale)),
    database: summarize(databaseOrders.filter(isClosedSale)),
    differences: {
      missingInDatabase,
      changedOrders,
      databaseOnly,
    },
    targetLinxIdentifiers: [...targetLinxIdentifiers].sort(),
    estimatedDurationMs,
    fitsRuntimeBudget: estimatedDurationMs <= input.runtimeBudgetMs * 0.8,
  };
}
