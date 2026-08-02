import type { Prisma } from "@prisma/client";
import type { CanonicalOriginUpdate } from "./contracts";

export async function importOrigins(
  tx: Prisma.TransactionClient,
  updates: CanonicalOriginUpdate[],
) {
  let updatedOrders = 0;

  for (const update of updates) {
    const organization = await tx.organization.findUniqueOrThrow({
      where: { external_code: update.organizationExternalCode },
    });
    const pedido = await tx.pedido.findUnique({
      where: {
        documentNumber_organizationId_data_pedido: {
          documentNumber: update.documentNumber,
          organizationId: organization.id,
          data_pedido: update.date,
        },
      },
    });

    if (!pedido) {
      throw new Error(
        `Pedido ${update.documentNumber} não encontrado para atualizar origem`,
      );
    }

    const origin = await tx.origin.upsert({
      where: { name: update.commercialOrigin },
      update: {},
      create: { name: update.commercialOrigin },
    });
    await tx.pedido.update({
      where: { id: pedido.id },
      data: { originId: origin.id },
    });
    updatedOrders += 1;
  }

  return { updatedOrders };
}
