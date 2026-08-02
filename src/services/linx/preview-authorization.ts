import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomUUID,
  randomBytes,
} from "node:crypto";
import type {
  ReconciliationOrder,
  ReconciliationPeriod,
} from "./reconciliation";
import type { CanonicalSale } from "@/services/sales-import/contracts";

const AUTHORIZATION_VERSION = 2;
const TOKEN_PREFIX = `v${AUTHORIZATION_VERSION}`;
const ENCRYPTION_CONTEXT =
  "jd-analytics/linx/reconciliation-preview/v2/aes-256-gcm";
const GCM_NONCE_LENGTH = 12;
const GCM_AUTH_TAG_LENGTH = 16;
const MAX_TARGETS = 1_000;
export const MAX_RECONCILIATION_AUTHORIZATION_LENGTH = 64 * 1024;
const CANONICAL_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export type AuthorizationClaims = {
  organizationId: string;
  cnpj: string;
  issuedById: string;
  period: ReconciliationPeriod;
  snapshotHash: string;
  fitsRuntimeBudget: boolean;
  targetLinxIdentifiers: string[];
};

type EncodedClaims = {
  v: number;
  jti: string;
  org: string;
  cnpj: string;
  by: string;
  from: string;
  to: string;
  snapshot: string;
  fits: boolean;
  targets: string[];
  iat: number;
  exp: number;
};

export type VerifiedReconciliationAuthorization = AuthorizationClaims & {
  tokenHash: string;
  issuedAt: Date;
  expiresAt: Date;
};

export class ReconciliationAuthorizationError extends Error {
  constructor() {
    super("Autorização de preview inválida ou expirada");
    this.name = "ReconciliationAuthorizationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function encryptionKey(key: string) {
  if (!key) throw new ReconciliationAuthorizationError();
  return createHmac("sha256", key).update(ENCRYPTION_CONTEXT).digest();
}

function decodeTokenSegment(segment: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(segment)) {
    throw new ReconciliationAuthorizationError();
  }
  const decoded = Buffer.from(segment, "base64url");
  if (!decoded.length || decoded.toString("base64url") !== segment) {
    throw new ReconciliationAuthorizationError();
  }
  return decoded;
}

function validCalendarDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))
  );
}

function validTargetLinxIdentifiers(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= MAX_TARGETS &&
    value.every((identifier) =>
      typeof identifier === "string" && CANONICAL_UUID.test(identifier),
    ) &&
    value.every(
      (identifier, index) => index === 0 || value[index - 1] < identifier,
    )
  );
}

function decodeClaims(token: string, key: string): EncodedClaims {
  if (token.length > MAX_RECONCILIATION_AUTHORIZATION_LENGTH) {
    throw new ReconciliationAuthorizationError();
  }
  const parts = token.split(".");
  if (
    parts.length !== 4 ||
    parts[0] !== TOKEN_PREFIX ||
    !parts[1] ||
    !parts[2] ||
    !parts[3]
  ) {
    throw new ReconciliationAuthorizationError();
  }
  try {
    const nonce = decodeTokenSegment(parts[1]);
    const ciphertext = decodeTokenSegment(parts[2]);
    const authTag = decodeTokenSegment(parts[3]);
    if (
      nonce.length !== GCM_NONCE_LENGTH ||
      authTag.length !== GCM_AUTH_TAG_LENGTH
    ) {
      throw new ReconciliationAuthorizationError();
    }
    const decipher = createDecipheriv(
      "aes-256-gcm",
      encryptionKey(key),
      nonce,
      { authTagLength: GCM_AUTH_TAG_LENGTH },
    );
    decipher.setAAD(Buffer.from(ENCRYPTION_CONTEXT));
    decipher.setAuthTag(authTag);
    const value = JSON.parse(
      Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
        "utf8",
      ),
    ) as Partial<EncodedClaims>;
    if (
      value.v !== AUTHORIZATION_VERSION ||
      typeof value.jti !== "string" ||
      typeof value.org !== "string" ||
      typeof value.cnpj !== "string" ||
      typeof value.by !== "string" ||
      !validCalendarDate(value.from) ||
      !validCalendarDate(value.to) ||
      value.from > value.to ||
      typeof value.snapshot !== "string" ||
      !/^[0-9a-f]{64}$/.test(value.snapshot) ||
      typeof value.fits !== "boolean" ||
      !validTargetLinxIdentifiers(value.targets) ||
      typeof value.iat !== "number" ||
      typeof value.exp !== "number" ||
      !Number.isSafeInteger(value.iat) ||
      !Number.isSafeInteger(value.exp)
    ) {
      throw new ReconciliationAuthorizationError();
    }
    return value as EncodedClaims;
  } catch (error) {
    if (error instanceof ReconciliationAuthorizationError) throw error;
    throw new ReconciliationAuthorizationError();
  }
}

export function issueReconciliationAuthorization(
  claims: AuthorizationClaims,
  dependencies: {
    key: string;
    now: Date;
    ttlMs: number;
    nonce?: string;
  },
) {
  if (
    !(dependencies.now instanceof Date) ||
    Number.isNaN(dependencies.now.getTime()) ||
    !Number.isSafeInteger(dependencies.ttlMs) ||
    dependencies.ttlMs <= 0
  ) {
    throw new ReconciliationAuthorizationError();
  }
  if (!validTargetLinxIdentifiers(claims.targetLinxIdentifiers)) {
    throw new ReconciliationAuthorizationError();
  }
  const payload: EncodedClaims = {
    v: AUTHORIZATION_VERSION,
    jti: dependencies.nonce ?? randomUUID(),
    org: claims.organizationId,
    cnpj: claims.cnpj,
    by: claims.issuedById,
    from: claims.period.from,
    to: claims.period.to,
    snapshot: claims.snapshotHash,
    fits: claims.fitsRuntimeBudget,
    targets: claims.targetLinxIdentifiers,
    iat: dependencies.now.getTime(),
    exp: dependencies.now.getTime() + dependencies.ttlMs,
  };
  const nonce = randomBytes(GCM_NONCE_LENGTH);
  const cipher = createCipheriv(
    "aes-256-gcm",
    encryptionKey(dependencies.key),
    nonce,
    { authTagLength: GCM_AUTH_TAG_LENGTH },
  );
  cipher.setAAD(Buffer.from(ENCRYPTION_CONTEXT));
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const token = [
    TOKEN_PREFIX,
    nonce.toString("base64url"),
    ciphertext.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
  ].join(".");
  if (token.length > MAX_RECONCILIATION_AUTHORIZATION_LENGTH) {
    throw new ReconciliationAuthorizationError();
  }
  return token;
}

export function verifyReconciliationAuthorization(
  token: string,
  dependencies: {
    key: string;
    now: Date;
    expected: {
      organizationId: string;
      cnpj: string;
      issuedById: string;
    };
  },
): VerifiedReconciliationAuthorization {
  const claims = decodeClaims(token, dependencies.key);
  if (
    claims.exp <= dependencies.now.getTime() ||
    claims.iat > dependencies.now.getTime() + 30_000 ||
    !claims.fits ||
    claims.org !== dependencies.expected.organizationId ||
    claims.cnpj !== dependencies.expected.cnpj ||
    claims.by !== dependencies.expected.issuedById
  ) {
    throw new ReconciliationAuthorizationError();
  }
  return {
    organizationId: claims.org,
    cnpj: claims.cnpj,
    issuedById: claims.by,
    period: { from: claims.from, to: claims.to },
    snapshotHash: claims.snapshot,
    fitsRuntimeBudget: claims.fits,
    targetLinxIdentifiers: claims.targets,
    issuedAt: new Date(claims.iat),
    expiresAt: new Date(claims.exp),
    tokenHash: createHash("sha256").update(token).digest("hex"),
  };
}

export function createReconciliationSnapshotHash(
  orders: ReconciliationOrder[],
) {
  const normalized = orders
    .map((order) => ({
      linxIdentifier: order.linxIdentifier?.toLowerCase() ?? null,
      organizationId: order.historicalKey.organizationId,
      documentNumber: order.historicalKey.documentNumber,
      date: order.historicalKey.date,
      cancelled: order.cancelled,
      itemCount: order.itemCount,
      grossValue: order.grossValue,
    }))
    .sort((left, right) =>
      JSON.stringify(left).localeCompare(JSON.stringify(right)),
    );
  return createHash("sha256")
    .update(JSON.stringify(normalized))
    .digest("hex");
}

export function createCanonicalSalesSnapshotHash(
  sales: CanonicalSale[],
) {
  const normalized = sales
    .map((sale) => ({
      source: sale.source,
      organizationExternalCode: sale.organizationExternalCode,
      date: sale.date.toISOString(),
      documentNumber: sale.documentNumber,
      natureOperation: sale.natureOperation,
      operationType: sale.operationType,
      operationalOrigin: sale.operationalOrigin,
      cancelled: sale.cancelled,
      customer: sale.customer,
      seller: sale.seller,
      paymentLabel: sale.paymentLabel,
      commercialOrigin: sale.commercialOrigin,
      linxIdentifier: sale.linxIdentifier?.toLowerCase() ?? null,
      linxTimestamp: sale.linxTimestamp?.toString() ?? null,
      linxRoutineOriginCode: sale.linxRoutineOriginCode ?? null,
      linxSalesResponseId: sale.linxSalesResponseId ?? null,
      items: sale.items
        .map((item) => ({
          ...item,
          linxTimestamp: item.linxTimestamp?.toString() ?? null,
        }))
        .sort(
          (left, right) =>
            (left.linxOrder ?? Number.MAX_SAFE_INTEGER) -
              (right.linxOrder ?? Number.MAX_SAFE_INTEGER) ||
            left.productCode - right.productCode,
        ),
    }))
    .sort((left, right) =>
      `${left.linxIdentifier ?? ""}:${left.date}:${left.documentNumber}`.localeCompare(
        `${right.linxIdentifier ?? ""}:${right.date}:${right.documentNumber}`,
      ),
    );
  return createHash("sha256")
    .update(JSON.stringify(normalized))
    .digest("hex");
}
