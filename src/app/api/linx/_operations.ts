import "server-only";
import { prisma } from "@/lib/prisma";
import { resolveBusinessMonthToDate } from "@/services/data-services/civil-date-range";

export class ActiveLinxConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActiveLinxConfigurationError";
  }
}

export async function readUniqueActiveLinxOrganization() {
  const organizations = await prisma.organization.findMany({
    where: { linxSyncEnabled: true },
    take: 2,
    select: { id: true, linxCnpj: true },
  });
  if (organizations.length === 0) {
    throw new ActiveLinxConfigurationError(
      "Nenhuma loja Linx ativa foi encontrada.",
    );
  }
  if (organizations.length !== 1 || !organizations[0].linxCnpj) {
    throw new ActiveLinxConfigurationError(
      "A configuração Linx ativa é inválida.",
    );
  }
  return organizations[0];
}

export async function readLastSuccessfulSyncAt(organizationId: string) {
  const run = await prisma.linxSyncRun.findFirst({
    where: {
      organizationId,
      status: "SUCCESS",
      finishedAt: { not: null },
    },
    orderBy: { finishedAt: "desc" },
    select: { finishedAt: true },
  });
  return run?.finishedAt?.toISOString() ?? null;
}

export async function readCurrentMetaLastSyncAt(date: Date = new Date()) {
  const { startDate } = resolveBusinessMonthToDate(date);
  const investment = await prisma.metaInvestment.findUnique({
    where: {
      periodStart: new Date(`${startDate}T00:00:00.000Z`),
    },
    select: { lastSyncAt: true },
  });
  return investment?.lastSyncAt.toISOString() ?? null;
}
