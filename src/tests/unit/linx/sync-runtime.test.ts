import { describe, expect, it, vi } from "vitest";
import { LinxDataError } from "@/services/linx/errors";

const prismaMock = vi.hoisted(() => ({
  pedido: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { buildCatalogReader } from "@/services/linx/sync-runtime";

const identity = {
  identifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
  documentNumber: "000123",
  date: new Date("2026-07-29T00:00:00.000Z"),
};
const uppercaseIdentity = {
  ...identity,
  identifier: identity.identifier.toUpperCase(),
};

describe("Linx runtime complement reader", () => {
  it("resolves routine/response deltas with one organization-bound GUID query and includes unbound Linx pedidos", async () => {
    prismaMock.pedido.findMany.mockResolvedValue([
      {
        linxIdentifier:
          "7C0AB11C-95B6-4E14-8186-BB5292198FF1",
      },
      { linxIdentifier: null },
    ]);

    const identifiers = await buildCatalogReader(
      "org-1",
    ).readAffectedSaleIdentifiers({
      routineCodes: [7],
      responseIds: [10],
    });

    expect(prismaMock.pedido.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: "org-1",
        linxIdentifier: { not: null },
        OR: [
          { linxRoutineOriginCode: { in: [7] } },
          { linxSalesResponseId: { in: [10] } },
          { linxOriginBindingsSyncedAt: null },
        ],
      },
      select: { linxIdentifier: true },
    });
    expect(identifiers).toEqual([
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
    ]);
  });

  it("finds a CSV pedido by the organization historical key", async () => {
    prismaMock.pedido.findMany.mockResolvedValue([
      {
        id: "csv-sale",
        linxIdentifier: null,
        organizationId: "org-1",
        documentNumber: "000123",
        data_pedido: new Date("2026-07-29T00:00:00.000Z"),
        origin_linx: "CSV operational",
        linxRoutineOriginCode: null,
        linxSalesResponseId: null,
        linxOriginBindingsSyncedAt: null,
        paymentMethod: { method: "CSV payment" },
        Origin: { name: "CSV commercial" },
      },
    ]);

    const complements = await buildCatalogReader(
      "org-1",
    ).readSaleComplements([identity]);

    expect(complements.get(identity.identifier)).toEqual({
      paymentLabel: "CSV payment",
      operationalOrigin: "CSV operational",
      commercialOrigin: "CSV commercial",
      routineOriginCode: null,
      salesResponseId: null,
      originBindingsSynced: false,
    });
    expect(prismaMock.pedido.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { linxIdentifier: { in: [identity.identifier] } },
            {
              organizationId: "org-1",
              documentNumber: "000123",
              data_pedido: new Date("2026-07-29T00:00:00.000Z"),
            },
          ],
        },
      }),
    );
  });

  it("rejects when GUID and historical key resolve different pedidos", async () => {
    prismaMock.pedido.findMany.mockResolvedValue([
      {
        id: "guid-sale",
        linxIdentifier: identity.identifier,
        organizationId: "org-1",
        documentNumber: "OTHER",
        data_pedido: new Date("2026-07-28T00:00:00.000Z"),
        origin_linx: "GUID",
        paymentMethod: null,
        Origin: null,
      },
      {
        id: "csv-sale",
        linxIdentifier: null,
        organizationId: "org-1",
        documentNumber: "000123",
        data_pedido: new Date("2026-07-29T00:00:00.000Z"),
        origin_linx: "CSV",
        paymentMethod: null,
        Origin: null,
      },
    ]);

    await expect(
      buildCatalogReader("org-1").readSaleComplements([identity]),
    ).rejects.toBeInstanceOf(LinxDataError);
  });

  it("matches an uppercase input GUID to the canonical GUID owned by the organization", async () => {
    prismaMock.pedido.findMany.mockResolvedValue([
      {
        id: "owned-sale",
        linxIdentifier: identity.identifier,
        organizationId: "org-1",
        documentNumber: identity.documentNumber,
        data_pedido: identity.date,
        origin_linx: "Owned operational",
        linxRoutineOriginCode: 7,
        linxSalesResponseId: 10,
        linxOriginBindingsSyncedAt: new Date("2026-07-29T10:00:00.000Z"),
        paymentMethod: { method: "Owned payment" },
        Origin: { name: "Owned commercial" },
      },
    ]);

    const complements = await buildCatalogReader(
      "org-1",
    ).readSaleComplements([uppercaseIdentity]);

    expect(complements).toEqual(new Map([
      [
        identity.identifier,
        {
          paymentLabel: "Owned payment",
          operationalOrigin: "Owned operational",
          commercialOrigin: "Owned commercial",
          routineOriginCode: 7,
          salesResponseId: 10,
          originBindingsSynced: true,
        },
      ],
    ]));
    expect(prismaMock.pedido.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { linxIdentifier: { in: [identity.identifier] } },
            {
              organizationId: "org-1",
              documentNumber: identity.documentNumber,
              data_pedido: identity.date,
            },
          ],
        },
      }),
    );
  });

  it("rejects an uppercase input GUID whose canonical GUID belongs to another organization", async () => {
    prismaMock.pedido.findMany.mockResolvedValue([
      {
        id: "foreign-sale",
        linxIdentifier: identity.identifier,
        organizationId: "org-2",
        documentNumber: "OTHER",
        data_pedido: new Date("2026-07-28T00:00:00.000Z"),
        origin_linx: "Foreign operational",
        paymentMethod: { method: "Foreign payment" },
        Origin: { name: "Foreign commercial" },
      },
    ]);

    await expect(
      buildCatalogReader("org-1").readSaleComplements([uppercaseIdentity]),
    ).rejects.toBeInstanceOf(LinxDataError);
  });
});
