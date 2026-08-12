export type ImportSource = "CSV" | "LINX";

export type CanonicalParty = {
  externalCode: number | null;
  name: string;
  personType?: "FISICA" | "JURIDICA";
};

export type CanonicalSeller = {
  externalCode: number | null;
  name: string;
};

export type CanonicalSaleItem = {
  productCode: number;
  description: string;
  brand: string;
  sector: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  linxOrder?: number;
  linxTimestamp?: bigint;
  catalogStatus?: "KNOWN" | "PENDING";
  catalogLastCheckedAt?: Date | null;
  catalogResolvedAt?: Date | null;
  excluded?: boolean;
};

export type CanonicalSale = {
  source: ImportSource;
  organizationExternalCode: number;
  date: Date;
  documentNumber: string;
  natureOperation: string;
  operationType: string;
  operationalOrigin: string;
  cancelled: boolean;
  customer: CanonicalParty | null;
  seller: CanonicalSeller;
  paymentLabel: string | null;
  commercialOrigin: string | null;
  linxIdentifier?: string;
  linxTimestamp?: bigint;
  linxRoutineOriginCode?: number | null;
  linxSalesResponseId?: number | null;
  linxOriginBindingsComplete?: boolean;
  items: CanonicalSaleItem[];
};

export type CanonicalOriginUpdate = {
  organizationExternalCode: number;
  date: Date;
  documentNumber: string;
  commercialOrigin: string;
};

export type ImportSummary = {
  ordersProcessed: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsRemoved: number;
};
