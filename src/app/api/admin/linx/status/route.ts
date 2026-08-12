import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withLinxCoordination } from "@/services/linx/admin-coordination";
import { publicLinxFailureMessage } from "@/services/linx/errors";
import { authorizationResponse } from "../_http";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
  } catch (error) {
    return authorizationResponse(error);
  }

  try {
    const { organizations, activeOrganization, run, cursors, pendingProducts } =
      await withLinxCoordination(prisma, new Date(), async (tx) => {
        const organizations = await tx.organization.findMany({
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            linxCnpj: true,
            linxPortalId: true,
            linxCompanyId: true,
            linxSyncEnabled: true,
          },
        });
        const activeOrganization = organizations.find(
          (organization) => organization.linxSyncEnabled === true,
        );
        const [run, cursors, pendingProducts] = await Promise.all([
          activeOrganization
            ? tx.linxSyncRun.findFirst({
                where: { organizationId: activeOrganization.id },
                orderBy: { startedAt: "desc" },
                select: {
                  id: true,
                  organizationId: true,
                  trigger: true,
                  status: true,
                  mode: true,
                  stage: true,
                  failureStage: true,
                  processedOrders: true,
                  processedItems: true,
                  errorMessage: true,
                  startedAt: true,
                  finishedAt: true,
                },
              })
            : Promise.resolve(null),
          activeOrganization
            ? tx.linxSyncCursor.findMany({
                where: { organizationId: activeOrganization.id },
                orderBy: { method: "asc" },
                select: {
                  method: true,
                  lastTimestamp: true,
                  updatedAt: true,
                },
              })
            : Promise.resolve([]),
          activeOrganization
            ? tx.product.findMany({
                where: { catalogStatus: "PENDING" },
                orderBy: { external_code: "asc" },
                select: {
                  external_code: true,
                  description: true,
                  catalogLastCheckedAt: true,
                },
              })
            : Promise.resolve([]),
        ]);
        return {
          organizations,
          activeOrganization,
          run,
          cursors,
          pendingProducts,
        };
      });

    return Response.json({
      organizations,
      activeOrganizationId: activeOrganization?.id ?? null,
      run: run
        ? {
            ...run,
            errorMessage: run.errorMessage
              ? publicLinxFailureMessage(run.errorMessage)
              : null,
            startedAt: run.startedAt.toISOString(),
            finishedAt: run.finishedAt?.toISOString() ?? null,
          }
        : null,
      cursors: cursors.map((cursor) => ({
        ...cursor,
        lastTimestamp: cursor.lastTimestamp.toString(),
        updatedAt: cursor.updatedAt.toISOString(),
      })),
      pendingProducts: pendingProducts.flatMap((product) =>
        product.external_code === null
          ? []
          : [
              {
                externalCode: product.external_code,
                description: product.description,
                lastCheckedAt:
                  product.catalogLastCheckedAt?.toISOString() ?? null,
              },
            ],
      ),
    });
  } catch {
    return Response.json(
      { error: "Não foi possível consultar o status Linx." },
      { status: 500 },
    );
  }
}
