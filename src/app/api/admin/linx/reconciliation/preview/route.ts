import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inspectLinxOrganization } from "@/services/linx/admin-coordination";
import { previewProductionReconciliation } from "@/services/linx/admin-runtime";
import { validateReconciliationPeriod } from "@/services/linx/reconciliation";
import {
  authorizationResponse,
  invalidBodyResponse,
  runningResponse,
} from "../../_http";

export const runtime = "nodejs";
export const maxDuration = 60;

const previewSchema = z
  .object({
    organizationId: z.string().uuid(),
    period: z
      .object({ from: z.string(), to: z.string() })
      .strict()
      .optional(),
  })
  .strict();

export async function POST(request: Request) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    return authorizationResponse(error);
  }

  const parsed = previewSchema.safeParse(
    await request.json().catch(() => undefined),
  );
  if (!parsed.success) return invalidBodyResponse();

  let period;
  try {
    period = parsed.data.period
      ? validateReconciliationPeriod(parsed.data.period)
      : undefined;
  } catch {
    return invalidBodyResponse();
  }

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

    return Response.json(
      period
        ? await previewProductionReconciliation(
            parsed.data.organizationId,
            admin.id,
            period,
          )
        : await previewProductionReconciliation(
            parsed.data.organizationId,
            admin.id,
          ),
    );
  } catch {
    return Response.json(
      { error: "Não foi possível gerar o preview da conciliação." },
      { status: 500 },
    );
  }
}
