import { createCipheriv, createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createReconciliationSnapshotHash,
  issueReconciliationAuthorization,
  MAX_RECONCILIATION_AUTHORIZATION_LENGTH,
  ReconciliationAuthorizationError,
  verifyReconciliationAuthorization,
} from "@/services/linx/preview-authorization";

const now = new Date("2026-07-29T12:00:00.000Z");
const key = "linx-api-key-used-only-through-domain-separated-derivation";
const claims = {
  organizationId: "0d5565a4-7689-4c22-8e93-a4bfa8d132f3",
  cnpj: "11222333000144",
  issuedById: "b2f928d8-a63e-4e17-96c0-d1f54c1fdfee",
  period: { from: "2026-06-30", to: "2026-07-29" },
  snapshotHash: "a".repeat(64),
  fitsRuntimeBudget: true,
  targetLinxIdentifiers: [
    "00000000-0000-4000-8000-000000000001",
    "00000000-0000-4000-8000-000000000003",
  ],
};

const encryptionContext =
  "jd-analytics/linx/reconciliation-preview/v2/aes-256-gcm";

function encryptedV2Payload(
  payload: Record<string, unknown>,
  nonce = Buffer.alloc(12, 7),
) {
  const encryptionKey = createHmac("sha256", key)
    .update(encryptionContext)
    .digest();
  const cipher = createCipheriv("aes-256-gcm", encryptionKey, nonce);
  cipher.setAAD(Buffer.from(encryptionContext));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  return [
    "v2",
    nonce.toString("base64url"),
    encrypted.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
  ].join(".");
}

function signedLegacyV2Payload(payload: Record<string, unknown>) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signingKey = createHmac("sha256", key)
    .update("jd-analytics/linx/reconciliation-preview/v2")
    .digest();
  return `${encoded}.${createHmac("sha256", signingKey)
    .update(encoded)
    .digest("base64url")}`;
}

describe("reconciliation preview authorization", () => {
  it("keeps a 1,000-order reconciliation authorization within the transport envelope", () => {
    const targetLinxIdentifiers = Array.from(
      { length: 1_000 },
      (_, index) =>
        `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    );
    const token = issueReconciliationAuthorization(
      { ...claims, targetLinxIdentifiers },
      { key, now, ttlMs: 60_000, nonce: "fixed-nonce" },
    );

    expect(token.length).toBeLessThanOrEqual(
      MAX_RECONCILIATION_AUTHORIZATION_LENGTH,
    );
    expect(
      verifyReconciliationAuthorization(token, {
        key,
        now,
        expected: {
          organizationId: claims.organizationId,
          cnpj: claims.cnpj,
          issuedById: claims.issuedById,
        },
      }).targetLinxIdentifiers,
    ).toEqual(targetLinxIdentifiers);
  });

  it("rejects an authorization envelope larger than the transport limit", () => {
    const token = encryptedV2Payload({
      v: 2,
      jti: "fixed-nonce",
      org: claims.organizationId,
      cnpj: "1".repeat(70_000),
      by: claims.issuedById,
      from: claims.period.from,
      to: claims.period.to,
      snapshot: claims.snapshotHash,
      fits: true,
      targets: claims.targetLinxIdentifiers,
      iat: now.getTime(),
      exp: now.getTime() + 60_000,
    });

    expect(token.length).toBeGreaterThan(
      MAX_RECONCILIATION_AUTHORIZATION_LENGTH,
    );
    expect(() =>
      verifyReconciliationAuthorization(token, {
        key,
        now,
        expected: {
          organizationId: claims.organizationId,
          cnpj: "1".repeat(70_000),
          issuedById: claims.issuedById,
        },
      }),
    ).toThrow(ReconciliationAuthorizationError);
  });

  it("issues a short-lived opaque signed token and verifies all bound claims", () => {
    const token = issueReconciliationAuthorization(claims, {
      key,
      now,
      ttlMs: 5 * 60_000,
      nonce: "fixed-nonce",
    });

    expect(token).not.toContain(key);
    expect(token).not.toContain(claims.cnpj);
    expect(
      token
        .split(".")
        .map((segment) => Buffer.from(segment, "base64url").toString("utf8"))
        .join(""),
    ).not.toContain(claims.targetLinxIdentifiers[0]);
    expect(
      verifyReconciliationAuthorization(token, {
        key,
        now: new Date(now.getTime() + 60_000),
        expected: {
          organizationId: claims.organizationId,
          cnpj: claims.cnpj,
          issuedById: claims.issuedById,
        },
      }),
    ).toMatchObject({
      ...claims,
      tokenHash: expect.stringMatching(/^[0-9a-f]{64}$/),
      expiresAt: new Date(now.getTime() + 5 * 60_000),
    });
  });

  it.each([
    ["invalid GUID", ["not-a-guid"]],
    [
      "duplicate GUID",
      [
        "00000000-0000-4000-8000-000000000001",
        "00000000-0000-4000-8000-000000000001",
      ],
    ],
    [
      "out-of-order GUID",
      [
        "00000000-0000-4000-8000-000000000003",
        "00000000-0000-4000-8000-000000000001",
      ],
    ],
    [
      "more than 1,000 GUIDs",
      Array.from(
        { length: 1_001 },
        (_, index) =>
          `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
      ),
    ],
  ])("rejects %s when issuing", (_label, targetLinxIdentifiers) => {
    expect(() =>
      issueReconciliationAuthorization(
        { ...claims, targetLinxIdentifiers },
        { key, now, ttlMs: 60_000, nonce: "fixed-nonce" },
      ),
    ).toThrow(ReconciliationAuthorizationError);
  });

  it.each([
    ["invalid", ["not-a-guid"]],
    [
      "duplicated",
      [
        "00000000-0000-4000-8000-000000000001",
        "00000000-0000-4000-8000-000000000001",
      ],
    ],
    [
      "out-of-order",
      [
        "00000000-0000-4000-8000-000000000003",
        "00000000-0000-4000-8000-000000000001",
      ],
    ],
    [
      "more than 1,000",
      Array.from(
        { length: 1_001 },
        (_, index) =>
          `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
      ),
    ],
  ])("rejects an encrypted v2 token with %s targets", (_label, targets) => {
    const token = encryptedV2Payload({
      v: 2,
      jti: "fixed-nonce",
      org: claims.organizationId,
      cnpj: claims.cnpj,
      by: claims.issuedById,
      from: claims.period.from,
      to: claims.period.to,
      snapshot: claims.snapshotHash,
      fits: true,
      targets,
      iat: now.getTime(),
      exp: now.getTime() + 60_000,
    });

    expect(() =>
      verifyReconciliationAuthorization(token, {
        key,
        now,
        expected: {
          organizationId: claims.organizationId,
          cnpj: claims.cnpj,
          issuedById: claims.issuedById,
        },
      }),
    ).toThrow(ReconciliationAuthorizationError);
  });

  it("rejects a modified encrypted token", () => {
    const token = encryptedV2Payload({
      v: 2,
      jti: "fixed-nonce",
      org: claims.organizationId,
      cnpj: claims.cnpj,
      by: claims.issuedById,
      from: claims.period.from,
      to: claims.period.to,
      snapshot: claims.snapshotHash,
      fits: true,
      targets: claims.targetLinxIdentifiers,
      iat: now.getTime(),
      exp: now.getTime() + 60_000,
    });
    const [version, nonce, encrypted, tag] = token.split(".");
    const modified = [
      version,
      nonce,
      `${encrypted.slice(0, -1)}${encrypted.endsWith("A") ? "B" : "A"}`,
      tag,
    ].join(".");

    expect(() =>
      verifyReconciliationAuthorization(modified, {
        key,
        now,
        expected: {
          organizationId: claims.organizationId,
          cnpj: claims.cnpj,
          issuedById: claims.issuedById,
        },
      }),
    ).toThrow(ReconciliationAuthorizationError);
  });

  it("rejects a legacy signed v2 token", () => {
    const token = signedLegacyV2Payload({
      v: 2,
      jti: "fixed-nonce",
      org: claims.organizationId,
      cnpj: claims.cnpj,
      by: claims.issuedById,
      from: claims.period.from,
      to: claims.period.to,
      snapshot: claims.snapshotHash,
      fits: true,
      targets: claims.targetLinxIdentifiers,
      iat: now.getTime(),
      exp: now.getTime() + 60_000,
    });

    expect(() =>
      verifyReconciliationAuthorization(token, {
        key,
        now,
        expected: {
          organizationId: claims.organizationId,
          cnpj: claims.cnpj,
          issuedById: claims.issuedById,
        },
      }),
    ).toThrow(ReconciliationAuthorizationError);
  });

  it("rejects a signed v1 token", () => {
    const v1Payload = Buffer.from(
      JSON.stringify({
        v: 1,
        jti: "fixed-nonce",
        org: claims.organizationId,
        cnpj: claims.cnpj,
        by: claims.issuedById,
        from: claims.period.from,
        to: claims.period.to,
        snapshot: claims.snapshotHash,
        fits: true,
        iat: now.getTime(),
        exp: now.getTime() + 60_000,
      }),
    ).toString("base64url");
    const v1SigningKey = createHmac("sha256", key)
      .update("jd-analytics/linx/reconciliation-preview/v1")
      .digest();
    const v1Token = `${v1Payload}.${createHmac("sha256", v1SigningKey)
      .update(v1Payload)
      .digest("base64url")}`;

    expect(() =>
      verifyReconciliationAuthorization(v1Token, {
        key,
        now,
        expected: {
          organizationId: claims.organizationId,
          cnpj: claims.cnpj,
          issuedById: claims.issuedById,
        },
      }),
    ).toThrow(ReconciliationAuthorizationError);
  });

  it.each([
    ["expired", new Date(now.getTime() + 5 * 60_000 + 1), claims],
    [
      "wrong organization",
      now,
      { ...claims, organizationId: crypto.randomUUID() },
    ],
    ["changed CNPJ", now, { ...claims, cnpj: "00999999000100" }],
    ["another admin", now, { ...claims, issuedById: crypto.randomUUID() }],
  ])("rejects %s", (_label, verificationTime, expected) => {
    const token = issueReconciliationAuthorization(claims, {
      key,
      now,
      ttlMs: 5 * 60_000,
      nonce: "fixed-nonce",
    });
    expect(() =>
      verifyReconciliationAuthorization(token, {
        key,
        now: verificationTime,
        expected: {
          organizationId: expected.organizationId,
          cnpj: expected.cnpj,
          issuedById: expected.issuedById,
        },
      }),
    ).toThrow(ReconciliationAuthorizationError);
  });

  it("never verifies a preview that failed the runtime budget gate", () => {
    const token = issueReconciliationAuthorization(
      { ...claims, fitsRuntimeBudget: false },
      { key, now, ttlMs: 60_000, nonce: "fixed-nonce" },
    );
    expect(() =>
      verifyReconciliationAuthorization(token, {
        key,
        now,
        expected: {
          organizationId: claims.organizationId,
          cnpj: claims.cnpj,
          issuedById: claims.issuedById,
        },
      }),
    ).toThrow(ReconciliationAuthorizationError);
  });

  it("rejects tampering and creates a stable order-independent snapshot hash", () => {
    const token = issueReconciliationAuthorization(claims, {
      key,
      now,
      ttlMs: 60_000,
      nonce: "fixed-nonce",
    });
    expect(() =>
      verifyReconciliationAuthorization(`${token}x`, {
        key,
        now,
        expected: {
          organizationId: claims.organizationId,
          cnpj: claims.cnpj,
          issuedById: claims.issuedById,
        },
      }),
    ).toThrow(ReconciliationAuthorizationError);

    const orders = [
      {
        linxIdentifier: "b",
        historicalKey: {
          organizationId: "org",
          documentNumber: "2",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 20,
        businessFingerprint: "org/2026-07-29/2/items:1/gross:20",
        legacyBusinessFingerprint: "legacy/org/2026-07-29/2/items:1",
      },
      {
        linxIdentifier: "a",
        historicalKey: {
          organizationId: "org",
          documentNumber: "1",
          date: "2026-07-28",
        },
        cancelled: false,
        itemCount: 2,
        grossValue: 10.5,
        businessFingerprint: "org/2026-07-28/1/items:2/gross:10.5",
        legacyBusinessFingerprint: "legacy/org/2026-07-28/1/items:2",
      },
    ];
    expect(createReconciliationSnapshotHash(orders)).toBe(
      createReconciliationSnapshotHash([...orders].reverse()),
    );
  });
});
