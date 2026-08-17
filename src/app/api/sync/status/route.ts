import { requireActiveUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inspectLinxOrganization } from "@/services/linx/admin-coordination";
import {
  readCurrentMetaLastSyncAt,
  readLastSuccessfulSyncAt,
  readUniqueActiveLinxOrganization,
} from "../../linx/_operations";
import {
  operationalAuthorizationResponse,
  operationalConfigurationResponse,
} from "../../linx/_responses";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireActiveUser();
  } catch (error) {
    return operationalAuthorizationResponse(error);
  }

  try {
    const organization = await readUniqueActiveLinxOrganization();
    const [gate, lastLinxSuccessfulSyncAt, lastMetaSyncAt] = await Promise.all([
      inspectLinxOrganization(prisma, organization.id, new Date()),
      readLastSuccessfulSyncAt(organization.id),
      readCurrentMetaLastSyncAt(),
    ]);
    if (gate.kind === "INACTIVE") {
      return Response.json(
        { error: "A organização Linx ativa mudou. Tente novamente." },
        { status: 409 },
      );
    }
    return Response.json({
      running: gate.kind === "RUNNING",
      lastLinxSuccessfulSyncAt,
      lastMetaSyncAt,
    });
  } catch (error) {
    return (
      operationalConfigurationResponse(error) ??
      Response.json(
        { error: "Não foi possível consultar o status dos dados." },
        { status: 500 },
      )
    );
  }
}
