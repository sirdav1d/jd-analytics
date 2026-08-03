import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  activateLinxOrganization,
  LinxCnpjRemapBlockedError,
} from "@/services/linx/admin-coordination";
import { discoverLinxStores } from "@/services/linx/admin-runtime";
import {
  authorizationResponse,
  invalidBodyResponse,
  runningResponse,
} from "../_http";

export const runtime = "nodejs";

const activateSchema = z
  .object({
    organizationId: z.string().uuid(),
    cnpj: z.string().regex(/^\d{14}$/),
    portalId: z.number().int().nullable(),
    companyId: z.number().int().nullable(),
  })
  .strict();

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    return authorizationResponse(error);
  }

  const parsed = activateSchema.safeParse(
    await request.json().catch(() => undefined),
  );
  if (!parsed.success) return invalidBodyResponse();

  try {
    const discovered = await discoverLinxStores();
    const exactStore = discovered.some(
      (store) =>
        store.cnpj === parsed.data.cnpj &&
        store.portalId === parsed.data.portalId &&
        store.companyId === parsed.data.companyId,
    );
    if (!exactStore) {
      return Response.json(
        { error: "A loja selecionada não corresponde à descoberta atual." },
        { status: 409 },
      );
    }
    const result = await activateLinxOrganization(
      prisma,
      parsed.data,
      new Date(),
    );
    if (result.kind === "RUNNING") {
      return runningResponse(result.run);
    }

    return Response.json({
      organizationId: parsed.data.organizationId,
      active: true,
    });
  } catch (error) {
    if (error instanceof LinxCnpjRemapBlockedError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    return Response.json(
      { error: "Não foi possível ativar a loja Linx." },
      { status: 500 },
    );
  }
}
