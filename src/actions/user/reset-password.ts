"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send-email";
import {
  createPasswordResetRequest,
  redeemPasswordResetToken,
  trustedPasswordResetOrigin,
} from "@/services/auth/password-reset";

const requestSchema = z.object({ email: z.string().email() });
const redeemSchema = z.object({
  token: z.string().min(32).max(256),
  newPassword: z.string().min(12).max(128),
});

export async function resetPasswordAction(input: unknown) {
  const { email } = requestSchema.parse(input);
  let ip = "unknown";
  try {
    const requestHeaders = await headers();
    ip =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "unknown";
  } catch {
    // A missing request context is treated like an unavailable IP and never
    // changes the public, non-enumerating response.
  }

  try {
    const origin = trustedPasswordResetOrigin(process.env);
    after(async () => {
      try {
        await createPasswordResetRequest(
          { email, ip },
          {
            db: prisma,
            now: () => new Date(),
            origin,
            send: ({ to, link }) =>
              sendEmail({
                to,
                subject: "Recuperação de senha",
                text: `Use este link de uso único para escolher uma nova senha: ${link}`,
              }).then(() => undefined),
          },
        );
      } catch {
        console.error("Falha no processamento da recuperação de senha");
      }
    });
  } catch {
    console.error("Falha ao agendar a recuperação de senha");
  }
  return { ok: true as const };
}

export async function completePasswordResetAction(input: unknown) {
  const parsed = redeemSchema.parse(input);
  return redeemPasswordResetToken(parsed, {
    db: prisma,
    now: () => new Date(),
  });
}
