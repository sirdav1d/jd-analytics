import { randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import type { Prisma } from "@prisma/client";
import type { CanonicalSale, CanonicalSaleItem } from "./contracts";

const LEGACY_SELLER_EXTERNAL_ID = "não encontrado";

export async function upsertSeller(
  tx: Prisma.TransactionClient,
  seller: CanonicalSale["seller"],
) {
  const externalId =
    seller.externalCode === null
      ? LEGACY_SELLER_EXTERNAL_ID
      : String(seller.externalCode);
  const existing = await tx.user.findUnique({ where: { externalId } });
  if (existing) {
    return tx.user.update({
      where: { id: existing.id },
      data: { name: seller.name },
    });
  }

  const randomPassword = randomBytes(32).toString("base64url");
  return tx.user.upsert({
    where: { externalId },
    update: { name: seller.name },
    create: {
      externalId,
      name: seller.name,
      email: `linx-${seller.externalCode ?? "nao-encontrado"}@invalid.local`,
      password: await bcrypt.hash(randomPassword, 12),
      role: "SELLER",
      isActive: true,
    },
  });
}

export async function resolveSaleDimensions(
  tx: Prisma.TransactionClient,
  sale: CanonicalSale,
) {
  const organization = await tx.organization.findUniqueOrThrow({
    where: { external_code: sale.organizationExternalCode },
  });
  const customer = sale.customer?.externalCode !== null && sale.customer
    ? await tx.customer.upsert({
        where: { externalCode: sale.customer.externalCode },
        update: {
          name: sale.customer.name,
          personType: sale.customer.personType ?? "FISICA",
        },
        create: {
          externalCode: sale.customer.externalCode,
          name: sale.customer.name,
          personType: sale.customer.personType ?? "FISICA",
        },
      })
    : null;
  const seller = await upsertSeller(tx, sale.seller);
  const paymentMethod = sale.paymentLabel
    ? await tx.paymentMethod.upsert({
        where: { method: sale.paymentLabel },
        update: {},
        create: { method: sale.paymentLabel },
      })
    : null;
  const origin = sale.commercialOrigin
    ? await tx.origin.upsert({
        where: { name: sale.commercialOrigin },
        update: {},
        create: { name: sale.commercialOrigin },
      })
    : null;

  return { organization, customer, seller, paymentMethod, origin };
}

export async function upsertProduct(
  tx: Prisma.TransactionClient,
  item: CanonicalSaleItem,
  source: CanonicalSale["source"],
) {
  return tx.product.upsert({
    where: { external_code: item.productCode },
    update:
      source === "LINX"
        ? {
            description: item.description,
            brand: item.brand,
            sector: item.sector,
          }
        : {},
    create: {
      external_code: item.productCode,
      description: item.description,
      brand: item.brand,
      sector: item.sector,
    },
  });
}
