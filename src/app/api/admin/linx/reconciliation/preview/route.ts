import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inspectLinxOrganization } from "@/services/linx/admin-coordination";
import { previewProductionReconciliation } from "@/services/linx/admin-runtime";
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
      await previewProductionReconciliation(
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
