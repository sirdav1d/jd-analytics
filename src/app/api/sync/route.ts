import { z } from "zod";
import { requireActiveUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DataSyncPublicationError } from "@/services/data-sync/errors";
import { runDataSync } from "@/services/data-sync/runtime";
import { inspectLinxOrganization } from "@/services/linx/admin-coordination";
import {
  LinxConcurrentRunError,
  LinxInactiveOrganizationError,
  LinxInitialReconciliationRequiredError,
} from "@/services/linx/sync-repository";
import { readUniqueActiveLinxOrganization } from "../linx/_operations";
import {
  operationalAuthorizationResponse,
  operationalConfigurationResponse,
  operationalRunningResponse,
} from "../linx/_responses";

export const runtime = "nodejs";
export const maxDuration = 60;

const emptyBodySchema = z.object({}).strict();

async function hasInvalidBody(request: Request) {
  const text = await request.text();
  if (text.trim() === "") return false;
  try {
    return !emptyBodySchema.safeParse(JSON.parse(text)).success;
  } catch {
    return true;
  }
}

function dataSyncErrorResponse(error: unknown) {
  const configurationResponse = operationalConfigurationResponse(error);
  if (configurationResponse) return configurationResponse;
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

export async function POST(request: Request) {
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    return operationalAuthorizationResponse(error);
  }
  if (await hasInvalidBody(request)) {
    return Response.json({ error: "Dados inválidos." }, { status: 400 });
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
      return operationalRunningResponse(gate.run);
    }

    const startedAt = Date.now();
    return Response.json(await runDataSync({
      organizationId: organization.id,
      requestedById: user.id,
      trigger: "MANUAL",
      deadlineAt: startedAt + 48_000,
      transactionTimeoutMs: 30_000,
    }));
  } catch (error) {
    return dataSyncErrorResponse(error);
  }
}
