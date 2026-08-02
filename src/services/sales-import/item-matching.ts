import type { CanonicalSaleItem } from "./contracts";

type ExistingItem = Omit<
  CanonicalSaleItem,
  "description" | "brand" | "sector" | "linxOrder" | "productCode"
> & {
  id: string;
  productCode: number | null;
  linxOrder: number | null;
};

const fingerprint = (
  item: Pick<ExistingItem, "productCode" | "quantity" | "unitValue" | "totalValue">,
) =>
  item.productCode === null
    ? null
    : [item.productCode, item.quantity, item.unitValue, item.totalValue].join("|");

export function planItemChanges(
  existing: ExistingItem[],
  incoming: CanonicalSaleItem[],
) {
  const unused = new Set(existing.map((item) => item.id));
  const update: Array<CanonicalSaleItem & { id: string }> = [];
  const create: CanonicalSaleItem[] = [];
  const remove: string[] = [];

  for (const item of incoming) {
    if (item.excluded && item.linxOrder === undefined) continue;

    const exactLinxMatch =
      item.linxOrder !== undefined
        ? existing.find(
            (candidate) =>
              unused.has(candidate.id) && candidate.linxOrder === item.linxOrder,
          )
        : undefined;
    const csvProductMatch =
      item.linxOrder !== undefined
        ? existing.find(
            (candidate) =>
              unused.has(candidate.id) &&
              candidate.linxOrder === null &&
              candidate.productCode === item.productCode,
          )
        : undefined;
    const match = item.excluded
      ? exactLinxMatch ?? csvProductMatch
      : exactLinxMatch ?? findFingerprintMatch(existing, unused, item) ?? csvProductMatch;

    if (!match) {
      if (!item.excluded) create.push(item);
      continue;
    }

    unused.delete(match.id);
    if (item.excluded) remove.push(match.id);
    else update.push({ ...item, id: match.id });
  }

  return { create, update, remove };
}

function findFingerprintMatch(
  existing: ExistingItem[],
  unused: Set<string>,
  incoming: CanonicalSaleItem,
) {
  const incomingFingerprint = fingerprint(incoming);
  return existing.find((candidate) => {
    const candidateFingerprint = fingerprint(candidate);
    return (
      unused.has(candidate.id) &&
      candidateFingerprint !== null &&
      candidateFingerprint === incomingFingerprint
    );
  });
}
