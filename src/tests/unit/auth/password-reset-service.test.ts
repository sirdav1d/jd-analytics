import { beforeEach, describe, expect, it, vi } from "vitest";

const hash = vi.hoisted(() => vi.fn(async () => "bcrypt-password-hash"));
vi.mock("bcrypt", () => ({ default: { hash }, hash }));

import {
  createPasswordResetRequest,
  redeemPasswordResetToken,
  trustedPasswordResetOrigin,
} from "@/services/auth/password-reset";

const now = new Date("2026-07-29T12:00:00.000Z");

function requestDatabase(user: object | null) {
  const tx = {
    $queryRaw: vi.fn().mockResolvedValue([]),
    passwordResetRateLimit: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
    },
    user: { findUnique: vi.fn().mockResolvedValue(user) },
    passwordResetToken: {
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      create: vi.fn().mockResolvedValue({}),
    },
  };
  const db = {
    $transaction: vi.fn(async (callback) => callback(tx)),
  };
  return { db, tx };
}

describe("password reset service", () => {
  beforeEach(() => hash.mockClear());

  it("casts advisory rate-limit locks to a Prisma-supported type", async () => {
    const { db, tx } = requestDatabase(null);

    await createPasswordResetRequest(
      { email: "missing@example.com", ip: "203.0.113.9" },
      {
        db: db as never,
        now: () => now,
        origin: "https://analytics.example.com",
        send: vi.fn(),
      },
    );

    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
    for (const [query] of tx.$queryRaw.mock.calls) {
      expect(query.strings.join("?")).toContain(")::text");
    }
  });

  it("stores only a token hash, invalidates older tokens and emails a trusted one-use link", async () => {
    const { db, tx } = requestDatabase({
      id: "user-1",
      email: "ada@example.com",
      isActive: true,
    });
    const send = vi.fn().mockResolvedValue(undefined);

    await expect(
      createPasswordResetRequest(
        { email: " ADA@example.com ", ip: "203.0.113.9" },
        {
          db: db as never,
          now: () => now,
          origin: "https://analytics.example.com",
          send,
        },
      ),
    ).resolves.toEqual({ ok: true });

    const link = new URL(send.mock.calls[0][0].link);
    const rawToken = link.searchParams.get("token");
    const stored = tx.passwordResetToken.create.mock.calls[0][0].data;
    expect(rawToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(stored.tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(stored.tokenHash).not.toBe(rawToken);
    expect(JSON.stringify(stored)).not.toContain(rawToken);
    expect(tx.passwordResetToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { invalidatedAt: now },
      }),
    );
    expect(stored.expiresAt).toEqual(
      new Date("2026-07-29T12:30:00.000Z"),
    );
  });

  it("does not enumerate unknown identities and still consumes both database-backed rate limits", async () => {
    const { db, tx } = requestDatabase(null);
    const send = vi.fn();
    await expect(
      createPasswordResetRequest(
        { email: "missing@example.com", ip: "203.0.113.9" },
        {
          db: db as never,
          now: () => now,
          origin: "https://analytics.example.com",
          send,
        },
      ),
    ).resolves.toEqual({ ok: true });
    expect(tx.passwordResetRateLimit.upsert).toHaveBeenCalledTimes(2);
    expect(tx.passwordResetToken.create).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("allows exactly one concurrent redemption and rejects replay", async () => {
    let firstConsumption = true;
    const tx = {
      passwordResetToken: {
        findUnique: vi.fn().mockResolvedValue({
          id: "token-1",
          userId: "user-1",
          expiresAt: new Date("2026-07-29T12:30:00.000Z"),
          consumedAt: null,
          invalidatedAt: null,
          user: { isActive: true },
        }),
        updateMany: vi.fn(async ({ where }) => {
          if (where.id === "token-1") {
            const count = firstConsumption ? 1 : 0;
            firstConsumption = false;
            return { count };
          }
          return { count: 1 };
        }),
      },
      user: { update: vi.fn().mockResolvedValue({}) },
    };
    const db = { $transaction: vi.fn(async (callback) => callback(tx)) };
    const dependencies = { db: db as never, now: () => now };
    const input = {
      token: "raw-one-use-token",
      newPassword: "a-secure-new-password",
    };

    const results = await Promise.all([
      redeemPasswordResetToken(input, dependencies),
      redeemPasswordResetToken(input, dependencies),
    ]);
    expect(results).toEqual(
      expect.arrayContaining([{ ok: true }, { ok: false }]),
    );
    expect(tx.user.update).toHaveBeenCalledTimes(1);
    expect(hash).toHaveBeenCalledTimes(2);
  });

  it("rejects expiry before any password mutation", async () => {
    const tx = {
      passwordResetToken: {
        findUnique: vi.fn().mockResolvedValue({
          id: "token-1",
          userId: "user-1",
          expiresAt: now,
          consumedAt: null,
          invalidatedAt: null,
          user: { isActive: true },
        }),
        updateMany: vi.fn(),
      },
      user: { update: vi.fn() },
    };
    const db = { $transaction: vi.fn(async (callback) => callback(tx)) };
    await expect(
      redeemPasswordResetToken(
        {
          token: "expired-token",
          newPassword: "a-secure-new-password",
        },
        { db: db as never, now: () => now },
      ),
    ).resolves.toEqual({ ok: false });
    expect(tx.user.update).not.toHaveBeenCalled();
  });

  it("accepts only a configured HTTPS origin without path or credentials", () => {
    expect(
      trustedPasswordResetOrigin({
        PASSWORD_RESET_ORIGIN: "https://analytics.example.com",
      }),
    ).toBe("https://analytics.example.com");
    expect(() =>
      trustedPasswordResetOrigin({
        PASSWORD_RESET_ORIGIN: "http://evil.example/reset",
      }),
    ).toThrow("Origem de recuperação inválida");
  });
});
