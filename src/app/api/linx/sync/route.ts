import { z } from "zod";
import { requireActiveUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inspectLinxOrganization } from "@/services/linx/admin-coordination";
import { runLinxSync } from "@/services/linx/sync";
import {
  LinxConcurrentRunError,
  LinxInactiveOrganizationError,
  LinxInitialReconciliationRequiredError,
} from "@/services/linx/sync-repository";
import {
  readLastSuccessfulSyncAt,
  readUniqueActiveLinxOrganization,
} from "../_operations";
import {
  operationalAuthorizationResponse,
  operationalConfigurationResponse,
  operationalRunningResponse,
} from "../_responses";

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

  let organization:
    | Awaited<ReturnType<typeof readUniqueActiveLinxOrganization>>
    | undefined;
  try {
    organization = await readUniqueActiveLinxOrganization();
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

    const now = Date.now();
    const summary = await runLinxSync({
      organizationId: organization.id,
      requestedById: user.id,
      trigger: "MANUAL",
      mode: "INCREMENTAL",
      deadlineAt: now + 48_000,
      transactionTimeoutMs: 30_000,
    });
    const persistedTimestamp = await readLastSuccessfulSyncAt(
      organization.id,
    ).catch(() => null);
    return Response.json({
      summary,
      lastSuccessfulSyncAt: persistedTimestamp ?? new Date().toISOString(),
    });
  } catch (error) {
    const configurationResponse = operationalConfigurationResponse(error);
    if (configurationResponse) return configurationResponse;
    if (error instanceof LinxInitialReconciliationRequiredError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof LinxInactiveOrganizationError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof LinxConcurrentRunError && organization) {
      try {
        const gate = await inspectLinxOrganization(
          prisma,
          organization.id,
          new Date(),
        );
        if (gate.kind === "RUNNING") {
          return operationalRunningResponse(gate.run);
        }
      } catch {
        // Fall through to the safe conflict response below.
      }
      return Response.json({ error: error.message }, { status: 409 });
    }
    return Response.json(
      { error: "Não foi possível concluir a sincronização Linx." },
      { status: 500 },
    );
  }
}
