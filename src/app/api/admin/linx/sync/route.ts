import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inspectLinxOrganization } from "@/services/linx/admin-coordination";
import { runLinxSync } from "@/services/linx/sync";
import {
  LinxConcurrentRunError,
  LinxInitialReconciliationRequiredError,
  LinxInactiveOrganizationError,
  LinxReconciliationAuthorizationUsedError,
} from "@/services/linx/sync-repository";
import {
  MAX_RECONCILIATION_AUTHORIZATION_LENGTH,
  ReconciliationAuthorizationError,
} from "@/services/linx/preview-authorization";
import {
  authorizationResponse,
  invalidBodyResponse,
  runningResponse,
} from "../_http";

export const runtime = "nodejs";
export const maxDuration = 60;

const syncSchema = z
  .object({
    organizationId: z.string().uuid(),
    mode: z.enum(["INCREMENTAL", "RECONCILIATION"]),
    trigger: z.enum(["MANUAL", "RETRY"]).default("MANUAL"),
    reconciliationAuthorization: z
      .string()
      .min(1)
      .max(MAX_RECONCILIATION_AUTHORIZATION_LENGTH)
      .optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.mode === "RECONCILIATION" &&
      !value.reconciliationAuthorization
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reconciliationAuthorization"],
        message: "Preview obrigatório",
      });
    }
    if (
      value.mode === "INCREMENTAL" &&
      value.reconciliationAuthorization
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reconciliationAuthorization"],
        message: "Autorização incompatível",
      });
    }
  });

export async function POST(request: Request) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    return authorizationResponse(error);
  }

  const parsed = syncSchema.safeParse(
    await request.json().catch(() => undefined),
  );
  if (!parsed.success) return invalidBodyResponse();

  try {
    const gate = await inspectLinxOrganization(
      prisma,
      parsed.data.organizationId,
      new Date(),
    );
    if (gate.kind === "INACTIVE") {
      return Response.json(
        { error: "A organização selecionada não é a loja Linx ativa." },
        { status: 409 },
      );
    }
    if (gate.kind === "RUNNING") return runningResponse(gate.run);

    const now = Date.now();
    return Response.json(
      await runLinxSync({
        organizationId: parsed.data.organizationId,
        requestedById: admin.id,
        trigger: parsed.data.trigger,
        mode: parsed.data.mode,
        deadlineAt: now + 48_000,
        transactionTimeoutMs: 30_000,
        reconciliationAuthorization:
          parsed.data.reconciliationAuthorization,
      }),
    );
  } catch (error) {
    if (
      error instanceof ReconciliationAuthorizationError ||
      error instanceof LinxReconciliationAuthorizationUsedError
    ) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof LinxInitialReconciliationRequiredError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof LinxInactiveOrganizationError) {
      return Response.json(
        { error: error.message },
        { status: 409 },
      );
    }
    if (error instanceof LinxConcurrentRunError) {
      try {
        const gate = await inspectLinxOrganization(
          prisma,
          parsed.data.organizationId,
          new Date(),
        );
        if (gate.kind === "RUNNING") return runningResponse(gate.run);
        return Response.json(
          { error: error.message, run: null },
          { status: 409 },
        );
      } catch {
        return Response.json(
          { error: "Não foi possível concluir a sincronização Linx." },
          { status: 500 },
        );
      }
    }
    return Response.json(
      { error: "Não foi possível concluir a sincronização Linx." },
      { status: 500 },
    );
  }
}
