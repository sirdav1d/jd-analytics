import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { runLinxSync } from "@/services/linx/sync";
import { LinxInitialReconciliationRequiredError } from "@/services/linx/sync-repository";

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
    const organizations = await prisma.organization.findMany({
      where: { linxSyncEnabled: true },
      select: { id: true },
    });

    if (organizations.length === 0) {
      return Response.json(
        { error: "Nenhuma loja Linx ativa" },
        { status: 409 },
      );
    }
    if (organizations.length !== 1) {
      return Response.json(
        { error: "Configuração Linx inválida" },
        { status: 409 },
      );
    }

    const startedAt = Date.now();
    const result = await runLinxSync({
      organizationId: organizations[0].id,
      mode: "INCREMENTAL",
      trigger: "CRON",
      deadlineAt: startedAt + 48_000,
      transactionTimeoutMs: 15_000,
    });
    return Response.json(result);
  } catch (error) {
    if (error instanceof LinxInitialReconciliationRequiredError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    return Response.json(
      { error: "Não foi possível concluir a sincronização Linx." },
      { status: 500 },
    );
  }
}
