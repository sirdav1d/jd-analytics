import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { DataSyncPublicationError } from "@/services/data-sync/errors";
import { runDataSync } from "@/services/data-sync/runtime";
import { inspectLinxOrganization } from "@/services/linx/admin-coordination";
import {
  LinxConcurrentRunError,
  LinxInactiveOrganizationError,
  LinxInitialReconciliationRequiredError,
} from "@/services/linx/sync-repository";
import { readUniqueActiveLinxOrganization } from "../../linx/_operations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function hasValidCronSecret(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function GET(request: Request) {
  if (!hasValidCronSecret(request)) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const organization = await readUniqueActiveLinxOrganization();
    const gate = await inspectLinxOrganization(
      prisma,
      organization.id,
      new Date(),
    );
    if (gate.kind === "INACTIVE") {
      return Response.json(
        { error: "A organização Linx ativa mudou. Tente novamente." },
        { status: 409 },
      );
    }
    if (gate.kind === "RUNNING") {
      return Response.json(
        { error: "Já existe uma sincronização Linx em andamento" },
        { status: 409 },
      );
    }

    const startedAt = Date.now();
    return Response.json(await runDataSync({
      organizationId: organization.id,
      trigger: "CRON",
      deadlineAt: startedAt + 48_000,
      transactionTimeoutMs: 15_000,
    }));
  } catch (error) {
    if (
      error instanceof LinxConcurrentRunError ||
      error instanceof LinxInitialReconciliationRequiredError ||
      error instanceof LinxInactiveOrganizationError
    ) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof DataSyncPublicationError) {
      return Response.json(
        { error: error.message, sources: error.sources },
        { status: 500 },
      );
    }
    return Response.json(
      { error: "Não foi possível concluir a sincronização de dados." },
      { status: 500 },
    );
  }
}
