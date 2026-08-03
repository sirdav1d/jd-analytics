import { requireActiveUser } from "@/lib/auth";
import {
  readLastSuccessfulSyncAt,
  readUniqueActiveLinxOrganization,
} from "../_operations";
import {
  operationalAuthorizationResponse,
  operationalConfigurationResponse,
} from "../_responses";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireActiveUser();
  } catch (error) {
    return operationalAuthorizationResponse(error);
  }

  try {
    const organization = await readUniqueActiveLinxOrganization();
    return Response.json({
      lastSuccessfulSyncAt: await readLastSuccessfulSyncAt(organization.id),
    });
  } catch (error) {
    return (
      operationalConfigurationResponse(error) ??
      Response.json(
        { error: "Não foi possível consultar o status Linx." },
        { status: 500 },
      )
    );
  }
}
