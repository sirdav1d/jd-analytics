export type MarketingSpendRange = {
  startDate: string;
  endDate: string;
};

export type AccountSpend = {
  amount: string;
  currency: "BRL";
};

export type MediaSource =
  | "META"
  | "GOOGLE_PRODUCTS"
  | "GOOGLE_SERVICES";

export type MediaSourceResult =
  | { status: "SUCCESS"; durationMs: number; amount: string }
  | { status: "FAILED"; durationMs: number; error: string };

export type MarketingSpendBatch = {
  results: Record<MediaSource, MediaSourceResult>;
  values: null | {
    metaInvestment: string;
    googleProductsInvestment: string;
    googleServicesInvestment: string;
    currency: "BRL";
  };
};
