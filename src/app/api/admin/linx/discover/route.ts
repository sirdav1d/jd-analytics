import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { discoverLinxStores } from "@/services/linx/admin-runtime";
import {
  authorizationResponse,
  invalidBodyResponse,
} from "../_http";

export const runtime = "nodejs";

const discoverSchema = z.object({}).strict();

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    return authorizationResponse(error);
  }

  const body = await request.json().catch(() => undefined);
  const parsed = discoverSchema.safeParse(body);
  if (!parsed.success) return invalidBodyResponse();

  try {
    return Response.json({ stores: await discoverLinxStores() });
  } catch {
    return Response.json(
      { error: "Não foi possível validar a conexão com a Linx." },
      { status: 500 },
    );
  }
}
