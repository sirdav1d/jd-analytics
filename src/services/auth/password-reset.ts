import "server-only";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { Prisma, type PrismaClient } from "@prisma/client";

const TOKEN_TTL_MS = 30 * 60_000;
const RATE_WINDOW_MS = 15 * 60_000;
const RATE_LIMIT = 5;

function digest(context: string, value: string) {
  return createHash("sha256")
    .update(`jd-analytics/password-reset/${context}/v1\0${value}`)
    .digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function trustedPasswordResetOrigin(
  env: Readonly<Record<string, string | undefined>>,
) {
  const configured = env.PASSWORD_RESET_ORIGIN ?? env.NEXTAUTH_URL;
  if (!configured) throw new Error("Origem de recuperação não configurada");
  const url = new URL(configured);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("Origem de recuperação inválida");
  }
  return url.origin;
}

type ResetDatabase = Pick<
  PrismaClient,
  "$transaction"
>;

async function consumeRateLimit(
  tx: Prisma.TransactionClient,
  keyHash: string,
  now: Date,
) {
  const current = await tx.passwordResetRateLimit.findUnique({
    where: { keyHash },
  });
  if (
    !current ||
    current.windowStartedAt.getTime() <= now.getTime() - RATE_WINDOW_MS
  ) {
    await tx.passwordResetRateLimit.upsert({
      where: { keyHash },
      create: { keyHash, windowStartedAt: now, attemptCount: 1 },
      update: { windowStartedAt: now, attemptCount: 1 },
    });
    return true;
  }
  if (current.attemptCount >= RATE_LIMIT) return false;
  await tx.passwordResetRateLimit.update({
    where: { keyHash },
    data: { attemptCount: { increment: 1 } },
  });
  return true;
}

export async function createPasswordResetRequest(
  input: { email: string; ip: string },
  dependencies: {
    db: ResetDatabase;
    now(): Date;
    send(input: { to: string; link: string }): Promise<void>;
    origin: string;
  },
) {
  const email = normalizeEmail(input.email);
  const token = randomBytes(32).toString("base64url");
  const tokenHash = digest("token", token);
  const rateKeys = [
    digest("identity", email),
    digest("ip", input.ip || "unknown"),
  ].sort();
  const now = dependencies.now();

  const delivery = await dependencies.db.$transaction(
    async (tx) => {
      for (const key of rateKeys) {
        await tx.$queryRaw(
          Prisma.sql`SELECT pg_advisory_xact_lock(hashtextextended(${key}, 0))::text AS lock_result`,
        );
      }
      const allowed = (
        await Promise.all(
          rateKeys.map((key) => consumeRateLimit(tx, key, now)),
        )
      ).every(Boolean);
      if (!allowed) return null;

      const user = await tx.user.findUnique({
        where: { email },
        select: { id: true, email: true, isActive: true },
      });
      if (!user?.isActive) return null;

      await tx.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          consumedAt: null,
          invalidatedAt: null,
        },
        data: { invalidatedAt: now },
      });
      await tx.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(now.getTime() + TOKEN_TTL_MS),
        },
      });
      return { to: user.email, token };
    },
    { maxWait: 2_000, timeout: 5_000 },
  );

  if (delivery) {
    const link = new URL("/reset-pass", dependencies.origin);
    link.searchParams.set("token", delivery.token);
    await dependencies.send({ to: delivery.to, link: link.toString() });
  }
  return { ok: true as const };
}

export async function redeemPasswordResetToken(
  input: { token: string; newPassword: string },
  dependencies: {
    db: ResetDatabase;
    now(): Date;
  },
) {
  const tokenHash = digest("token", input.token);
  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  const now = dependencies.now();

  return dependencies.db.$transaction(
    async (tx) => {
      const token = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
          consumedAt: true,
          invalidatedAt: true,
          user: { select: { isActive: true } },
        },
      });
      if (
        !token ||
        !token.user.isActive ||
        token.expiresAt <= now ||
        token.consumedAt ||
        token.invalidatedAt
      ) {
        return { ok: false as const };
      }
      const consumed = await tx.passwordResetToken.updateMany({
        where: {
          id: token.id,
          consumedAt: null,
          invalidatedAt: null,
          expiresAt: { gt: now },
        },
        data: { consumedAt: now },
      });
      if (consumed.count !== 1) return { ok: false as const };
      await tx.user.update({
        where: { id: token.userId },
        data: { password: passwordHash },
      });
      await tx.passwordResetToken.updateMany({
        where: {
          userId: token.userId,
          id: { not: token.id },
          consumedAt: null,
          invalidatedAt: null,
        },
        data: { invalidatedAt: now },
      });
      return { ok: true as const };
    },
    { maxWait: 2_000, timeout: 5_000 },
  );
}
