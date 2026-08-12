import { readFileSync } from "node:fs";
import type { Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { createDeadline } from "@/services/linx/deadline";
import {
  LinxDataError,
  LinxDeadlineError,
  LinxAuthError,
} from "@/services/linx/errors";
import {
  createLinxDataAdapters,
  type LinxCatalogReader,
} from "@/services/linx/sync-adapter";
import type { LinxMovement } from "@/services/linx/mappers/movement";
import type { LinxCommand, LinxResponse } from "@/services/linx/types";
import { parseLinxResponse } from "@/services/linx/xml";
import { importSales } from "@/services/sales-import/import-sales";

const fixture = (name: string) =>
  parseLinxResponse(
    readFileSync(`src/tests/fixtures/linx/${name}`, "utf8"),
  );

const emptyCatalogReader: LinxCatalogReader = {
  readCustomers: async () => [],
  readSellers: async () => [],
  readProducts: async () => [],
  readSaleComplements: async () => new Map(),
  readAffectedSaleIdentifiers: async () => [],
};

const catalogs = {
  customers: new Map([
    [
      4,
      {
        externalCode: 4,
        name: "Ana",
        personType: "FISICA" as const,
      },
    ],
  ]),
  sellers: new Map([[5, { externalCode: 5, name: "Bia" }]]),
  products: new Map([
    [
      6,
      {
        productCode: 6,
        description: "Produto",
        brand: "Marca",
        sector: "Setor",
      },
    ],
  ]),
};

function movementFixture(overrides: Partial<LinxMovement> = {}): LinxMovement {
  return {
    identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
    timestamp: BigInt(1),
    documentNumber: "1",
    launchDate: "2026-08-11",
    customerCode: null,
    sellerCode: 5,
    productCode: 6,
    quantity: 1,
    unitValue: 10,
    totalValue: 10,
    cancelled: false,
    excluded: false,
    order: 1,
    operationalOriginCode: null,
    natureOperation: "Venda",
    operationType: "S",
    ...overrides,
  };
}

function makeImportTransaction() {
  return {
    $queryRaw: vi.fn().mockResolvedValue([]),
    organization: {
      findUniqueOrThrow: vi.fn().mockResolvedValue({
        id: "org-1",
        external_code: 7,
      }),
    },
    pedido: {
      findFirst: vi.fn().mockResolvedValue(null),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: "sale-1" }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    customer: {
      upsert: vi.fn().mockResolvedValue({ id: "customer-1" }),
    },
    user: {
      findUnique: vi.fn().mockResolvedValue({
        id: "seller-1",
        externalId: "5",
        name: "Bia",
      }),
      update: vi.fn().mockResolvedValue({ id: "seller-1" }),
    },
    paymentMethod: {
      upsert: vi.fn().mockResolvedValue({ id: "payment-1" }),
    },
    origin: {
      upsert: vi.fn().mockResolvedValue({ id: "origin-1" }),
    },
    product: {
      upsert: vi.fn().mockResolvedValue({ id: "product-1" }),
    },
    saleItem: {
      create: vi.fn().mockResolvedValue({ id: "item-1" }),
      update: vi.fn().mockResolvedValue({ id: "item-1" }),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
  };
}

describe("Linx production data adapters", () => {
  it("keeps only movements selected by the manual sales report", () => {
    const adapters = createLinxDataAdapters({
      execute: async () => ({ columns: [], rows: [] }),
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const row = fixture("movimento.xml").rows[0]!;
    const parsed = adapters.validateRows({
      movements: [
        {
          ...row,
          identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
          tipo_transacao: " ",
          soma_relatorio: "S",
          cancelado: "S",
        },
        {
          ...row,
          identificador: "3f0fdd86-cd17-42ee-a2a7-55e559654c21",
          tipo_transacao: "R",
          soma_relatorio: "S",
        },
        {
          ...row,
          identificador: "6a86a65a-76cf-4fc1-8b59-3c26e3cf8c36",
          operacao: "E",
          tipo_transacao: null,
          soma_relatorio: "S",
        },
        {
          ...row,
          identificador: "f3893a24-1b18-4653-b26e-a73f2597f616",
          tipo_transacao: "P",
          soma_relatorio: "N",
        },
        {
          ...row,
          identificador: "ddde7464-d821-4241-a949-55fca5a7df41",
          natureza_operacao:
            "[S] VND MERC ADQ/RCB ORIG ENTREGA FUTURA",
          tipo_transacao: null,
          soma_relatorio: "S",
        },
      ],
      payments: [],
      principals: [],
      routines: [],
      responses: [],
    });

    expect(parsed.movements.map((movement) => movement.identificador)).toEqual([
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
    ]);
  });

  it("keeps the transaction as the canonical item identity", () => {
    const adapters = createLinxDataAdapters({
      execute: async () => ({ columns: [], rows: [] }),
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const movement = fixture("movimento.xml");
    const parsed = adapters.validateRows({
      movements: [
        { ...movement.rows[0]!, transacao: "42", ordem: null },
      ],
      payments: fixture("movimento-planos.xml").rows,
      principals: fixture("movimento-principal.xml").rows,
      routines: fixture("rotina-origem.xml").rows,
      responses: fixture("resposta-venda.xml").rows,
    });

    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...parsed,
      catalogs,
    });

    expect(sale?.items[0]?.linxOrder).toBe(42);
  });

  it("uses the latest movement timestamp for the order cancellation state", () => {
    const adapters = createLinxDataAdapters({
      execute: async () => ({ columns: [], rows: [] }),
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const movement = fixture("movimento.xml");
    const parsed = adapters.validateRows({
      movements: [
        { ...movement.rows[0]!, transacao: "41" },
        {
          ...movement.rows[0]!,
          transacao: "42",
          timestamp: "185318314",
          cod_produto: "7",
          ordem: "2",
          cancelado: "S",
        },
      ],
      payments: fixture("movimento-planos.xml").rows,
      principals: fixture("movimento-principal.xml").rows,
      routines: fixture("rotina-origem.xml").rows,
      responses: fixture("resposta-venda.xml").rows,
    });
    const productCatalogs = {
      ...catalogs,
      products: new Map([
        ...catalogs.products,
        [
          7,
          {
            productCode: 7,
            description: "Outro produto",
            brand: "Marca",
            sector: "Setor",
          },
        ],
      ]),
    };

    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...parsed,
      catalogs: productCatalogs,
    });

    expect(sale?.cancelled).toBe(true);
    expect(sale?.items).toHaveLength(2);
  });

  it("disambiguates repeated historical document keys with the Linx GUID", () => {
    const adapters = createLinxDataAdapters({
      execute: async () => ({ columns: [], rows: [] }),
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const movement = fixture("movimento.xml");
    const secondIdentifier =
      "3f0fdd86-cd17-42ee-a2a7-55e559654c21";
    const parsed = adapters.validateRows({
      movements: [
        { ...movement.rows[0]!, transacao: "41" },
        {
          ...movement.rows[0]!,
          identificador: secondIdentifier,
          transacao: "42",
          timestamp: "185318314",
        },
      ],
      payments: [],
      principals: [],
      routines: fixture("rotina-origem.xml").rows,
      responses: [],
    });

    const sales = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...parsed,
      catalogs,
    });

    expect(sales.map((sale) => sale.documentNumber).sort()).toEqual([
      "000123",
      "000123#linx:7c0ab11c-95b6-4e14-8186-bb5292198ff1",
    ]);
  });

  it("maps real XML fixtures through point catalogs into importSales", async () => {
    const commands: LinxCommand[] = [];
    const catalogResponses: Record<string, LinxResponse> = {
      LinxClientesFornec: {
        columns: ["cod_cliente", "nome_cliente", "tipo_cliente"],
        rows: [
          {
            cod_cliente: "4",
            nome_cliente: "Ana",
            tipo_cliente: "F",
          },
        ],
      },
      LinxVendedores: {
        columns: ["cod_vendedor", "nome_vendedor"],
        rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
      },
      LinxProdutos: {
        columns: ["cod_produto", "nome", "desc_marca", "desc_setor"],
        rows: [
          {
            cod_produto: "6",
            nome: "Produto",
            desc_marca: "Marca",
            desc_setor: "Setor",
          },
        ],
      },
    };
    const deadlineAt = Date.parse("2026-07-29T12:01:00.000Z");
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        commands.push(command);
        return catalogResponses[command.name] ?? { columns: [], rows: [] };
      },
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(
        () => Date.parse("2026-07-29T12:00:00.000Z"),
        deadlineAt,
      ),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: fixture("movimento.xml").rows,
      payments: fixture("movimento-planos.xml").rows,
      principals: fixture("movimento-principal.xml").rows,
      routines: fixture("rotina-origem.xml").rows,
      responses: fixture("resposta-venda.xml").rows,
    });
    const catalogs = await adapters.loadMissingCatalogs(
      "11222333000144",
      parsed.movements,
    );

    const sales = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...parsed,
      catalogs,
    });

    expect(commands.map((command) => command.name)).toEqual([
      "LinxClientesFornec",
      "LinxVendedores",
      "LinxProdutos",
    ]);
    expect(commands[2]).toMatchObject({
      parameters: {
        cod_produto: 6,
        dt_update_inicio: "1900-01-01",
        dt_update_fim: "2026-07-29",
        timestamp: BigInt(0),
      },
    });
    expect(sales).toEqual([
      {
        source: "LINX",
        organizationExternalCode: 7,
        date: new Date("2026-07-29T00:00:00.000Z"),
        documentNumber: "000123",
        natureOperation: "[S] VENDA DE PRODUTOS",
        operationType: "S",
        operationalOrigin: "Venda presencial",
        cancelled: false,
        customer: {
          externalCode: 4,
          name: "Ana",
          personType: "FISICA",
        },
        seller: { externalCode: 5, name: "Bia" },
        paymentLabel: "Cartão, PIX",
        commercialOrigin: "Google",
        linxIdentifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
        linxTimestamp: BigInt(185318313),
        linxRoutineOriginCode: 7,
        linxSalesResponseId: 10,
        linxOriginBindingsComplete: true,
        items: [
          {
            productCode: 6,
            description: "Produto",
            brand: "Marca",
            sector: "Setor",
            catalogStatus: "KNOWN",
            catalogLastCheckedAt: new Date("2026-07-29T12:00:00.000Z"),
            catalogResolvedAt: new Date("2026-07-29T12:00:00.000Z"),
            quantity: 2,
            unitValue: 10.5,
            totalValue: 21,
            linxOrder: 1,
            linxTimestamp: BigInt(185318313),
            excluded: false,
          },
        ],
      },
    ]);

    const tx = makeImportTransaction();
    await expect(
      importSales(tx as unknown as Prisma.TransactionClient, sales),
    ).resolves.toEqual({
      ordersProcessed: 1,
      itemsCreated: 1,
      itemsUpdated: 0,
      itemsRemoved: 0,
    });
    expect(tx.pedido.create).toHaveBeenCalledTimes(1);
    expect(tx.saleItem.create).toHaveBeenCalledTimes(1);
  });

  it("asserts the shared deadline before requesting a second HTTP page", async () => {
    const deadlineAt = Date.parse("2026-07-29T12:01:00.000Z");
    let now = deadlineAt - 2_000;
    const execute = vi.fn(async () => {
      now = deadlineAt;
      return { columns: ["timestamp"], rows: [{ timestamp: "11" }] };
    });
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => now, deadlineAt),
      nowDate: () => new Date(now),
    });

    await expect(
      adapters.fetchMovementPages({
        cnpj: "11222333000144",
        timestamp: BigInt(0),
        mode: "INCREMENTAL",
      }),
    ).rejects.toBeInstanceOf(LinxDeadlineError);

    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("refreshes incremental parties while reusing a known local product", async () => {
    const execute = vi.fn(async (command: LinxCommand) => {
      if (command.name === "LinxClientesFornec") {
        return {
          columns: ["cod_cliente", "nome_cliente", "tipo_cliente"],
          rows: [
            {
              cod_cliente: "4",
              nome_cliente: "Ana atualizada",
              tipo_cliente: "J",
            },
          ],
        };
      }
      if (command.name === "LinxVendedores") {
        return {
          columns: ["cod_vendedor", "nome_vendedor"],
          rows: [
            {
              cod_vendedor: "5",
              nome_vendedor: "Bia atualizada",
            },
          ],
        };
      }
      throw new Error(`Comando inesperado: ${command.name}`);
    });
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader: {
        readCustomers: async () => [
          { externalCode: 4, name: "Ana", personType: "FISICA" },
        ],
        readSellers: async () => [{ externalCode: 5, name: "Bia" }],
        readProducts: async () => [
          {
            productCode: 6,
            description: "Produto persistido",
            brand: "Marca persistida",
            sector: "Setor persistido",
            catalogStatus: "KNOWN",
            catalogLastCheckedAt: null,
            catalogResolvedAt: null,
          },
        ],
        readSaleComplements: async () => new Map(),
        readAffectedSaleIdentifiers: async () => [],
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });

    const catalogs = await adapters.loadMissingCatalogs(
      "11222333000144",
      [
        {
          identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
          timestamp: BigInt(1),
          documentNumber: "1",
          launchDate: "2026-07-29T10:00:00",
          customerCode: 4,
          sellerCode: 5,
          productCode: 6,
          quantity: 1,
          unitValue: 1,
          totalValue: 1,
          cancelled: false,
          excluded: false,
          order: 1,
          operationalOriginCode: null,
          natureOperation: "Venda",
          operationType: "S",
        },
      ],
    );

    expect(execute).toHaveBeenCalledTimes(2);
    expect(catalogs.customers.get(4)).toMatchObject({
      name: "Ana atualizada",
      personType: "JURIDICA",
    });
    expect(catalogs.sellers.get(5)?.name).toBe("Bia atualizada");
    expect(catalogs.products.get(6)).toMatchObject({
      description: "Produto persistido",
      brand: "Marca persistida",
      sector: "Setor persistido",
    });
  });

  it("reuses a KNOWN local product without a Linx product lookup", async () => {
    const readProducts = vi.fn(async () => [{
      productCode: 1314,
      description: "S.O. WINDOWS 11 PRO 32/64 BITS OEM (FQC-10529)",
      brand: "MICROSSOFT",
      sector: "ACESSORIOS OFFICE",
      catalogStatus: "KNOWN" as const,
      catalogLastCheckedAt: null,
      catalogResolvedAt: null,
    }]);
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxVendedores") {
          return {
            columns: ["cod_vendedor", "nome_vendedor"],
            rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
          };
        }
        if (command.name === "LinxProdutos") {
          throw new Error("A consulta de produto não deveria acontecer");
        }
        throw new Error(`Comando inesperado: ${command.name}`);
      },
      catalogReader: { ...emptyCatalogReader, readProducts },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-08-11T12:00:00.000Z"),
    });

    const loaded = await adapters.loadMissingCatalogs(
      "11222333000144",
      [movementFixture({ productCode: 1314 })],
    );

    expect(readProducts).toHaveBeenCalledWith([1314]);
    expect(loaded.products.get(1314)).toEqual({
      productCode: 1314,
      description: "S.O. WINDOWS 11 PRO 32/64 BITS OEM (FQC-10529)",
      brand: "MICROSSOFT",
      sector: "ACESSORIOS OFFICE",
      catalogStatus: "KNOWN",
      catalogLastCheckedAt: null,
      catalogResolvedAt: null,
    });
  });

  it("uses code-specific PENDING metadata when Linx has no product", async () => {
    const checkedAt = new Date("2026-08-11T12:00:00.000Z");
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxVendedores") {
          return {
            columns: ["cod_vendedor", "nome_vendedor"],
            rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
          };
        }
        return {
          columns: ["cod_produto", "nome", "desc_marca", "desc_setor"],
          rows: [],
        };
      },
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => checkedAt,
    });

    const loaded = await adapters.loadMissingCatalogs(
      "11222333000144",
      [movementFixture({ productCode: 9999 })],
    );

    expect(loaded.products.get(9999)).toEqual({
      productCode: 9999,
      description: "Produto não identificado — código 9999",
      brand: "Não informado",
      sector: "Não informado",
      catalogStatus: "PENDING",
      catalogLastCheckedAt: checkedAt,
      catalogResolvedAt: null,
    });
  });

  it("rejects an empty product lookup with a malformed column contract", async () => {
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxVendedores") {
          return {
            columns: ["cod_vendedor", "nome_vendedor"],
            rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
          };
        }
        return {
          columns: ["codigo", "descricao"],
          rows: [],
        };
      },
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-08-11T12:00:00.000Z"),
    });

    await expect(
      adapters.loadMissingCatalogs(
        "11222333000144",
        [movementFixture({ productCode: 9999 })],
      ),
    ).rejects.toBeInstanceOf(LinxDataError);
  });

  it("retries a PENDING local product and resolves it from Linx", async () => {
    const checkedAt = new Date("2026-08-11T12:00:00.000Z");
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxVendedores") {
          return {
            columns: ["cod_vendedor", "nome_vendedor"],
            rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
          };
        }
        return {
          columns: ["cod_produto", "nome", "desc_marca", "desc_setor"],
          rows: [{
            cod_produto: "9999",
            nome: "Produto resolvido",
            desc_marca: "Marca real",
            desc_setor: "Setor real",
          }],
        };
      },
      catalogReader: {
        ...emptyCatalogReader,
        readProducts: async () => [{
          productCode: 9999,
          description: "Produto não identificado — código 9999",
          brand: "Não informado",
          sector: "Não informado",
          catalogStatus: "PENDING",
          catalogLastCheckedAt: new Date("2026-08-10T12:00:00.000Z"),
          catalogResolvedAt: null,
        }],
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => checkedAt,
    });

    const loaded = await adapters.loadMissingCatalogs(
      "11222333000144",
      [movementFixture({ productCode: 9999 })],
    );
    expect(loaded.products.get(9999)).toMatchObject({
      description: "Produto resolvido",
      catalogStatus: "KNOWN",
      catalogLastCheckedAt: checkedAt,
      catalogResolvedAt: checkedAt,
    });
  });

  it("reuses persisted catalogs during reconciliation and fetches only missing codes", async () => {
    const execute = vi.fn(async (command: LinxCommand) => {
      if (
        command.name === "LinxProdutos" &&
        command.parameters.cod_produto === 7
      ) {
        return {
          columns: ["cod_produto", "nome", "desc_marca", "desc_setor"],
          rows: [
            {
              cod_produto: "7",
              nome: "Produto novo",
              desc_marca: "Marca nova",
              desc_setor: "Setor novo",
            },
          ],
        };
      }
      throw new Error(`Consulta pontual inesperada: ${command.name}`);
    });
    const readSellers = vi.fn(async () => [
      { externalCode: 5, name: "Bia persistida" },
    ]);
    const readProducts = vi.fn(async () => [
      {
        productCode: 6,
        description: "Produto persistido",
        brand: "Marca persistida",
        sector: "Setor persistido",
      },
    ]);
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader: {
        ...emptyCatalogReader,
        readSellers,
        readProducts,
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const movement = {
      identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
      timestamp: BigInt(1),
      documentNumber: "1",
      launchDate: "2026-07-29T10:00:00",
      customerCode: null,
      sellerCode: 5,
      productCode: 6,
      quantity: 1,
      unitValue: 1,
      totalValue: 1,
      cancelled: false,
      excluded: false,
      order: 1,
      operationalOriginCode: null,
      natureOperation: "Venda",
      operationType: "S",
    };

    const loaded = await adapters.loadMissingCatalogs(
      "11222333000144",
      [movement, { ...movement, productCode: 7, order: 2 }],
      { mode: "RECONCILIATION" },
    );

    expect(readSellers).toHaveBeenCalledWith([5]);
    expect(readProducts).toHaveBeenCalledWith([6, 7]);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(loaded.sellers.get(5)?.name).toBe("Bia persistida");
    expect(loaded.products.get(6)?.description).toBe(
      "Produto persistido",
    );
    expect(loaded.products.get(7)?.description).toBe("Produto novo");
  });

  it("bounds concurrent reconciliation catalog lookups", async () => {
    let active = 0;
    let peak = 0;
    const execute = vi.fn(async (command: LinxCommand) => {
      active += 1;
      peak = Math.max(peak, active);
      await Promise.resolve();
      active -= 1;
      const productCode = Number(command.parameters.cod_produto);
      return {
        columns: ["cod_produto", "nome", "desc_marca", "desc_setor"],
        rows: [
          {
            cod_produto: String(productCode),
            nome: `Produto ${productCode}`,
            desc_marca: "Marca",
            desc_setor: "Setor",
          },
        ],
      };
    });
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader: {
        ...emptyCatalogReader,
        readSellers: async () => [{ externalCode: 5, name: "Bia" }],
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const movement = {
      identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
      timestamp: BigInt(1),
      documentNumber: "1",
      launchDate: "2026-07-29T10:00:00",
      customerCode: null,
      sellerCode: 5,
      productCode: 1,
      quantity: 1,
      unitValue: 1,
      totalValue: 1,
      cancelled: false,
      excluded: false,
      order: 1,
      operationalOriginCode: null,
      natureOperation: "Venda",
      operationType: "S",
    };

    const loaded = await adapters.loadMissingCatalogs(
      "11222333000144",
      Array.from({ length: 7 }, (_, index) => ({
        ...movement,
        productCode: index + 1,
        order: index + 1,
      })),
      { mode: "RECONCILIATION" },
    );

    expect(peak).toBe(5);
    expect(execute).toHaveBeenCalledTimes(7);
    expect(loaded.products.size).toBe(7);
  });

  it("rejects a point catalog response for a different requested code", async () => {
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxClientesFornec") {
          return {
            columns: ["cod_cliente", "nome_cliente", "tipo_cliente"],
            rows: [
              {
                cod_cliente: "999",
                nome_cliente: "Cliente incorreto",
                tipo_cliente: "F",
              },
            ],
          };
        }
        return { columns: [], rows: [] };
      },
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });

    await expect(
      adapters.loadMissingCatalogs("11222333000144", [
        {
          identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
          timestamp: BigInt(1),
          documentNumber: "1",
          launchDate: "2026-07-29T10:00:00",
          customerCode: 4,
          sellerCode: 5,
          productCode: 6,
          quantity: 1,
          unitValue: 1,
          totalValue: 1,
          cancelled: false,
          excluded: false,
          order: 1,
          operationalOriginCode: null,
          natureOperation: "Venda",
          operationType: "S",
        },
      ]),
    ).rejects.toBeInstanceOf(LinxDataError);
  });

  it("propagates Linx authentication failures during a product lookup", async () => {
    const authFailure = new LinxAuthError();
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxVendedores") {
          return {
            columns: ["cod_vendedor", "nome_vendedor"],
            rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
          };
        }
        throw authFailure;
      },
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-08-11T12:00:00.000Z"),
    });

    await expect(
      adapters.loadMissingCatalogs(
        "11222333000144",
        [movementFixture({ productCode: 9999 })],
      ),
    ).rejects.toBe(authFailure);
  });

  it("rejects a product point lookup for a different requested code", async () => {
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxVendedores") {
          return {
            columns: ["cod_vendedor", "nome_vendedor"],
            rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
          };
        }
        return {
          columns: ["cod_produto", "nome", "desc_marca", "desc_setor"],
          rows: [{
            cod_produto: "9998",
            nome: "Produto incorreto",
            desc_marca: "Marca",
            desc_setor: "Setor",
          }],
        };
      },
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-08-11T12:00:00.000Z"),
    });

    await expect(
      adapters.loadMissingCatalogs(
        "11222333000144",
        [movementFixture({ productCode: 9999 })],
      ),
    ).rejects.toBeInstanceOf(LinxDataError);
  });

  it("rejects conflicting product metadata returned for one code", async () => {
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxVendedores") {
          return {
            columns: ["cod_vendedor", "nome_vendedor"],
            rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
          };
        }
        return {
          columns: ["cod_produto", "nome", "desc_marca", "desc_setor"],
          rows: [
            {
              cod_produto: "9999",
              nome: "Produto A",
              desc_marca: "Marca",
              desc_setor: "Setor",
            },
            {
              cod_produto: "9999",
              nome: "Produto B",
              desc_marca: "Marca",
              desc_setor: "Setor",
            },
          ],
        };
      },
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-08-11T12:00:00.000Z"),
    });

    await expect(
      adapters.loadMissingCatalogs(
        "11222333000144",
        [movementFixture({ productCode: 9999 })],
      ),
    ).rejects.toBeInstanceOf(LinxDataError);
  });

  it("rejects an invalid SQL/ISO time instead of parsing it permissively", () => {
    const adapters = createLinxDataAdapters({
      execute: async () => ({ columns: [], rows: [] }),
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: fixture("movimento.xml").rows,
      payments: fixture("movimento-planos.xml").rows,
      principals: fixture("movimento-principal.xml").rows,
      routines: fixture("rotina-origem.xml").rows,
      responses: fixture("resposta-venda.xml").rows,
    });
    parsed.movements[0]!.launchDate = "2026-07-29T99:00:00";

    expect(() =>
      adapters.mapCanonicalSales({
        organizationExternalCode: 7,
        ...parsed,
        catalogs: {
          customers: new Map([
            [
              4,
              {
                externalCode: 4,
                name: "Ana",
                personType: "FISICA",
              },
            ],
          ]),
          sellers: new Map([
            [5, { externalCode: 5, name: "Bia" }],
          ]),
          products: new Map([
            [
              6,
              {
                productCode: 6,
                description: "Produto",
                brand: "Marca",
                sector: "Setor",
              },
            ],
          ]),
        },
      }),
    ).toThrow(LinxDataError);
  });

  it("reads canonical persisted complement keys for an uppercase movement GUID", async () => {
    const movement = fixture("movimento.xml");
    const uppercaseMovement = {
      ...movement,
      rows: movement.rows.map((row) => ({
        ...row,
        identificador: row.identificador?.toUpperCase() ?? null,
      })),
    };
    const execute = vi.fn(async (command: LinxCommand) =>
      command.name === "LinxMovimento"
        ? uppercaseMovement
        : { columns: [], rows: [] },
    );
    const catalogReader = {
      ...emptyCatalogReader,
      readSaleComplements: async () =>
        new Map([
          [
            "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
            {
              paymentLabel: "Persisted Pay",
              operationalOrigin: "Persisted Origin",
              commercialOrigin: "Persisted Commercial",
            },
          ],
        ]),
    };
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: uppercaseMovement.rows,
      payments: [],
      principals: [],
      routines: [],
      responses: [],
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
    );
    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...completed,
      catalogs,
    });

    expect(sale).toMatchObject({
      paymentLabel: "Persisted Pay",
      operationalOrigin: "Persisted Origin",
      commercialOrigin: "Persisted Commercial",
    });
  });

  it("materializes a payment-only delta through a point movement lookup", async () => {
    const commands: LinxCommand[] = [];
    const execute = vi.fn(async (command: LinxCommand) => {
      commands.push(command);
      if (command.name === "LinxMovimento") return fixture("movimento.xml");
      if (command.name === "LinxMovimentoPrincipal") {
        return fixture("movimento-principal.xml");
      }
      if (command.name === "LinxRotinaOrigem") {
        return fixture("rotina-origem.xml");
      }
      if (command.name === "LinxRespostaVenda") {
        return fixture("resposta-venda.xml");
      }
      return { columns: [], rows: [] };
    });
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader: {
        ...emptyCatalogReader,
        readSaleComplements: async () => new Map(),
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: [],
      payments: fixture("movimento-planos.xml").rows,
      principals: [],
      routines: [],
      responses: [],
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
    );
    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...completed,
      catalogs,
    });

    expect(sale).toMatchObject({
      documentNumber: "000123",
      paymentLabel: "Cartão, PIX",
      operationalOrigin: "Venda presencial",
      commercialOrigin: "Google",
      linxRoutineOriginCode: 7,
      linxSalesResponseId: 10,
      linxOriginBindingsComplete: true,
    });
    expect(
      commands.find((command) => command.name === "LinxMovimento"),
    ).toMatchObject({
      parameters: {
        timestamp: BigInt(0),
        identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
        data_inicial: "1900-01-01",
        data_fim: "2026-07-29",
      },
    });
    expect(
      commands.filter((command) => command.name === "LinxMovimentoPlanos"),
    ).toHaveLength(0);
  });

  it("ignores a payment-only delta when its movement is outside the manual report", async () => {
    const commands: LinxCommand[] = [];
    const movement = fixture("movimento.xml");
    const futureDeliveryMovement = {
      ...movement,
      rows: movement.rows.map((row) => ({
        ...row,
        natureza_operacao:
          "[S] VND MERC ADQ/RCB ORIG ENTREGA FUTURA",
      })),
    };
    const execute = vi.fn(async (command: LinxCommand) => {
      commands.push(command);
      if (command.name === "LinxMovimento") {
        return futureDeliveryMovement;
      }
      if (command.name === "LinxMovimentoPrincipal") {
        return fixture("movimento-principal.xml");
      }
      if (command.name === "LinxRotinaOrigem") {
        return fixture("rotina-origem.xml");
      }
      if (command.name === "LinxRespostaVenda") {
        return fixture("resposta-venda.xml");
      }
      return { columns: [], rows: [] };
    });
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: [],
      payments: fixture("movimento-planos.xml").rows,
      principals: [],
      routines: [],
      responses: [],
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
    );

    expect(completed.movements).toEqual([]);
    expect(completed.paymentLabels.size).toBe(0);
    expect(completed.principals.size).toBe(0);
    expect(completed.origins.size).toBe(0);
    expect(commands.map((command) => command.name)).toEqual([
      "LinxMovimento",
    ]);
  });

  it("materializes a principal-only delta and caches RespostaVenda", async () => {
    const commands: LinxCommand[] = [];
    const execute = vi.fn(async (command: LinxCommand) => {
      commands.push(command);
      if (command.name === "LinxMovimento") return fixture("movimento.xml");
      if (command.name === "LinxMovimentoPlanos") {
        return fixture("movimento-planos.xml");
      }
      if (command.name === "LinxRotinaOrigem") {
        return fixture("rotina-origem.xml");
      }
      if (command.name === "LinxRespostaVenda") {
        return fixture("resposta-venda.xml");
      }
      return { columns: [], rows: [] };
    });
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader: {
        ...emptyCatalogReader,
        readSaleComplements: async () => new Map(),
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: [],
      payments: [],
      principals: fixture("movimento-principal.xml").rows,
      routines: [],
      responses: [],
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
    );
    await adapters.completeRows("11222333000144", parsed);
    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...completed,
      catalogs,
    });

    expect(sale).toMatchObject({
      documentNumber: "000123",
      paymentLabel: "Cartão, PIX",
      operationalOrigin: "Venda presencial",
      commercialOrigin: "Google",
    });
    expect(
      commands.filter((command) => command.name === "LinxRespostaVenda"),
    ).toHaveLength(1);
  });

  it("materializes every pedido affected by a routine-only delta before that cursor can advance", async () => {
    const identifier =
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const readAffectedSaleIdentifiers = vi.fn().mockResolvedValue([
      identifier,
    ]);
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxMovimento") return fixture("movimento.xml");
        if (command.name === "LinxMovimentoPlanos") {
          return fixture("movimento-planos.xml");
        }
        if (command.name === "LinxMovimentoPrincipal") {
          return fixture("movimento-principal.xml");
        }
        if (command.name === "LinxRespostaVenda") {
          return fixture("resposta-venda.xml");
        }
        return { columns: [], rows: [] };
      },
      catalogReader: {
        ...emptyCatalogReader,
        readAffectedSaleIdentifiers,
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: [],
      payments: [],
      principals: [],
      routines: fixture("rotina-origem.xml").rows,
      responses: [],
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
      { mode: "INCREMENTAL" },
    );

    expect(readAffectedSaleIdentifiers).toHaveBeenCalledWith({
      routineCodes: [7],
      responseIds: [],
    });
    expect(completed.movements.map((row) => row.identificador)).toEqual([
      identifier,
    ]);
    expect(completed.origins.get(identifier)).toEqual({
      operationalOrigin: "Venda presencial",
      commercialOrigin: "Google",
    });
  });

  it("materializes every pedido affected by a response-only delta before that cursor can advance", async () => {
    const identifier =
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const readAffectedSaleIdentifiers = vi.fn().mockResolvedValue([
      identifier,
    ]);
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxMovimento") return fixture("movimento.xml");
        if (command.name === "LinxMovimentoPlanos") {
          return fixture("movimento-planos.xml");
        }
        if (command.name === "LinxMovimentoPrincipal") {
          return fixture("movimento-principal.xml");
        }
        if (command.name === "LinxRotinaOrigem") {
          return fixture("rotina-origem.xml");
        }
        return { columns: [], rows: [] };
      },
      catalogReader: {
        ...emptyCatalogReader,
        readAffectedSaleIdentifiers,
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: [],
      payments: [],
      principals: [],
      routines: [],
      responses: fixture("resposta-venda.xml").rows,
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
      { mode: "INCREMENTAL" },
    );

    expect(readAffectedSaleIdentifiers).toHaveBeenCalledWith({
      routineCodes: [],
      responseIds: [10],
    });
    expect(completed.movements.map((row) => row.identificador)).toEqual([
      identifier,
    ]);
    expect(completed.origins.get(identifier)?.commercialOrigin).toBe(
      "Google",
    );
  });

  it("does not let an old principal watermark expand reconciliation identifiers", async () => {
    const currentIdentifier =
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const oldIdentifier =
      "3f0fdd86-cd17-42ee-a2a7-55e559654c21";
    const movement = fixture("movimento.xml");
    const movementLookups: string[] = [];
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        if (command.name === "LinxMovimento") {
          const identifier = String(command.parameters.identificador);
          movementLookups.push(identifier);
          const row = {
            ...movement.rows[0]!,
            identificador: identifier,
            data_lancamento:
              identifier === oldIdentifier
                ? "2025-01-01"
                : movement.rows[0]!.data_lancamento,
          };
          return { ...movement, rows: [row] };
        }
        if (command.name === "LinxRotinaOrigem") {
          return fixture("rotina-origem.xml");
        }
        return { columns: [], rows: [] };
      },
      catalogReader: {
        ...emptyCatalogReader,
        readSaleComplements: async () =>
          new Map([
            [
              currentIdentifier,
              {
                paymentLabel: "PIX",
                operationalOrigin: "Venda presencial",
                commercialOrigin: "Google",
              },
            ],
          ]),
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: movement.rows,
      payments: [],
      principals: [
        {
          identificador: oldIdentifier,
          id_resposta_venda: "10",
        },
      ],
      routines: [],
      responses: [],
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
      {
        mode: "RECONCILIATION",
        authorizedIdentifiers: new Set([currentIdentifier]),
      },
    );

    expect(movementLookups).toEqual([]);
    expect(completed.movements.map((row) => row.identificador)).toEqual([
      currentIdentifier,
    ]);
    expect(completed.principals.has(oldIdentifier)).toBe(false);
  });

  it("reuses the bounded reconciliation snapshot without point lookups", async () => {
    const currentIdentifier =
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const oldIdentifier =
      "3f0fdd86-cd17-42ee-a2a7-55e559654c21";
    const execute = vi.fn(async () => {
      throw new Error("reconciliation must not issue point lookups");
    });
    const readSaleComplements = vi.fn(async () => new Map());
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader: {
        ...emptyCatalogReader,
        readSaleComplements,
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const movement = fixture("movimento.xml");
    const parsed = adapters.validateRows({
      movements: movement.rows,
      payments: fixture("movimento-planos.xml").rows,
      principals: [
        ...fixture("movimento-principal.xml").rows,
        {
          identificador: oldIdentifier,
          id_resposta_venda: "10",
        },
      ],
      routines: fixture("rotina-origem.xml").rows,
      responses: fixture("resposta-venda.xml").rows,
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
      {
        mode: "RECONCILIATION",
        authorizedIdentifiers: new Set([currentIdentifier]),
      },
    );

    expect(execute).not.toHaveBeenCalled();
    expect(readSaleComplements).not.toHaveBeenCalled();
    expect(completed.movements.map((row) => row.identificador)).toEqual([
      currentIdentifier,
    ]);
    expect([...completed.principals]).toEqual([[currentIdentifier, 10]]);
    expect(completed.origins.get(currentIdentifier)).toEqual({
      operationalOrigin: "Venda presencial",
      commercialOrigin: "Google",
    });
  });

  it("rejects a complement-only delta when its movement cannot be materialized", async () => {
    const adapters = createLinxDataAdapters({
      execute: async () => ({ columns: [], rows: [] }),
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: [],
      payments: fixture("movimento-planos.xml").rows,
      principals: [],
      routines: [],
      responses: [],
    });

    await expect(
      adapters.completeRows("11222333000144", parsed),
    ).rejects.toBeInstanceOf(LinxDataError);
  });

  it("deduplicates exact movement items returned by a point lookup", async () => {
    const movement = fixture("movimento.xml");
    const execute = vi.fn(async (command: LinxCommand) => {
      if (command.name === "LinxMovimento") {
        return {
          columns: movement.columns,
          rows: [...movement.rows, ...movement.rows],
        };
      }
      if (command.name === "LinxMovimentoPrincipal") {
        return fixture("movimento-principal.xml");
      }
      if (command.name === "LinxRotinaOrigem") {
        return fixture("rotina-origem.xml");
      }
      if (command.name === "LinxRespostaVenda") {
        return fixture("resposta-venda.xml");
      }
      return { columns: [], rows: [] };
    });
    const adapters = createLinxDataAdapters({
      execute,
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: [],
      payments: fixture("movimento-planos.xml").rows,
      principals: [],
      routines: [],
      responses: [],
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
    );
    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...completed,
      catalogs,
    });

    expect(completed.movements).toHaveLength(1);
    expect(sale?.items).toHaveLength(1);
  });

  it("uses a complete point snapshot so a one-item delta cannot remove another item", async () => {
    const movement = fixture("movimento.xml");
    const identifier =
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const secondRow = {
      ...movement.rows[0]!,
      ordem: "2",
      quantidade: "1",
      valor_total: "10.50",
    };
    const commands: LinxCommand[] = [];
    const adapters = createLinxDataAdapters({
      execute: async (command) => {
        commands.push(command);
        if (command.name === "LinxMovimento") {
          return {
            columns: movement.columns,
            rows: [movement.rows[0]!, secondRow],
          };
        }
        return { columns: [], rows: [] };
      },
      catalogReader: {
        ...emptyCatalogReader,
        readSaleComplements: async () =>
          new Map([
            [
              identifier,
              {
                paymentLabel: "PIX",
                operationalOrigin: "Loja",
                commercialOrigin: "Google",
              },
            ],
          ]),
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: [movement.rows[0]!],
      payments: [],
      principals: [],
      routines: [],
      responses: [],
    });
    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
    );
    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...completed,
      catalogs,
    });
    const tx = makeImportTransaction();
    tx.pedido.findFirst.mockResolvedValue({
      id: "sale-1",
      organizationId: "org-1",
      linxIdentifier: identifier,
      items: [
        {
          id: "item-1",
          quantity: 2,
          unitValue: 10.5,
          totalValue: 21,
          linxOrder: 1,
          linxTimestamp: BigInt(185318313),
          product: { external_code: 6 },
        },
        {
          id: "item-2",
          quantity: 1,
          unitValue: 10.5,
          totalValue: 10.5,
          linxOrder: 2,
          linxTimestamp: BigInt(185318313),
          product: { external_code: 6 },
        },
      ],
    } as never);

    const summary = await importSales(
      tx as unknown as Prisma.TransactionClient,
      [sale!],
    );

    expect(sale?.items).toHaveLength(2);
    expect(summary.itemsRemoved).toBe(0);
    expect(tx.saleItem.deleteMany).not.toHaveBeenCalled();
    expect(
      commands.find((command) => command.name === "LinxMovimento"),
    ).toMatchObject({
      parameters: {
        timestamp: BigInt(0),
        identificador: identifier,
        data_inicial: "1900-01-01",
        data_fim: "2026-07-29",
      },
    });
  });

  it("passes typed snapshot identities to the persisted complement reader", async () => {
    const movement = fixture("movimento.xml");
    const readSaleComplements = vi.fn(async () => new Map());
    const adapters = createLinxDataAdapters({
      execute: async (command) =>
        command.name === "LinxMovimento"
          ? movement
          : { columns: [], rows: [] },
      catalogReader: {
        ...emptyCatalogReader,
        readSaleComplements,
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: movement.rows,
      payments: fixture("movimento-planos.xml").rows,
      principals: fixture("movimento-principal.xml").rows,
      routines: fixture("rotina-origem.xml").rows,
      responses: fixture("resposta-venda.xml").rows,
    });

    await adapters.completeRows("11222333000144", parsed);

    expect(readSaleComplements).toHaveBeenCalledWith([
      {
        identifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
        documentNumber: "000123",
        date: new Date("2026-07-29T00:00:00.000Z"),
      },
    ]);
  });

  it("promotes a CSV pedido without erasing complements found by historical identity", async () => {
    const movement = fixture("movimento.xml");
    const identifier =
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const adapters = createLinxDataAdapters({
      execute: async (command) =>
        command.name === "LinxMovimento"
          ? movement
          : { columns: [], rows: [] },
      catalogReader: {
        ...emptyCatalogReader,
        readSaleComplements: async (identities) => {
          expect(identities).toEqual([
            {
              identifier,
              documentNumber: "000123",
              date: new Date("2026-07-29T00:00:00.000Z"),
            },
          ]);
          return new Map([
            [
              identifier,
              {
                paymentLabel: "CSV payment",
                operationalOrigin: "CSV operational",
                commercialOrigin: "CSV commercial",
              },
            ],
          ]);
        },
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: movement.rows,
      payments: [],
      principals: [],
      routines: [],
      responses: [],
    });
    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
    );
    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...completed,
      catalogs,
    });
    const tx = makeImportTransaction();
    tx.pedido.findUnique.mockResolvedValue({
      id: "csv-sale",
      linxIdentifier: null,
      items: [
        {
          id: "csv-item",
          quantity: 2,
          unitValue: 10.5,
          totalValue: 21,
          linxOrder: null,
          linxTimestamp: null,
          product: { external_code: 6 },
        },
      ],
    } as never);

    await importSales(
      tx as unknown as Prisma.TransactionClient,
      [sale!],
    );

    expect(tx.pedido.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: "csv-sale" }),
        data: expect.objectContaining({
          linxIdentifier: identifier,
          origin_linx: "CSV operational",
          paymentMethodId: "payment-1",
          originId: "origin-1",
        }),
      }),
    );
  });

  it("clears commercial origin for an explicit null principal delta", async () => {
    const movement = fixture("movimento.xml");
    const identifier =
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const adapters = createLinxDataAdapters({
      execute: async (command) =>
        command.name === "LinxMovimento"
          ? movement
          : { columns: [], rows: [] },
      catalogReader: {
        ...emptyCatalogReader,
        readSaleComplements: async () =>
          new Map([
            [
              identifier,
              {
                paymentLabel: "PIX",
                operationalOrigin: "Loja",
                commercialOrigin: "Old commercial",
              },
            ],
          ]),
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: movement.rows,
      payments: [],
      principals: [
        { identificador: identifier, id_resposta_venda: null },
      ],
      routines: [],
      responses: [],
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
    );

    expect(completed.origins.get(identifier)?.commercialOrigin).toBeNull();
    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...completed,
      catalogs,
    });
    const tx = makeImportTransaction();
    tx.pedido.findFirst.mockResolvedValue({
      id: "sale-1",
      organizationId: "org-1",
      linxIdentifier: identifier,
      items: [
        {
          id: "item-1",
          quantity: 2,
          unitValue: 10.5,
          totalValue: 21,
          linxOrder: 1,
          linxTimestamp: BigInt(185318313),
          product: { external_code: 6 },
        },
      ],
    } as never);

    await importSales(
      tx as unknown as Prisma.TransactionClient,
      [sale!],
    );

    expect(tx.pedido.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          originId: null,
          linxRoutineOriginCode: 7,
          linxSalesResponseId: null,
          linxOriginBindingsSyncedAt: expect.any(Date),
        }),
      }),
    );
  });

  it("does not reuse persisted operational origin when snapshot code is null", async () => {
    const movement = fixture("movimento.xml");
    const identifier =
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const noOriginRows = movement.rows.map((row) => ({
      ...row,
      codigo_rotina_origem: null,
    }));
    const adapters = createLinxDataAdapters({
      execute: async (command) =>
        command.name === "LinxMovimento"
          ? { ...movement, rows: noOriginRows }
          : { columns: [], rows: [] },
      catalogReader: {
        ...emptyCatalogReader,
        readSaleComplements: async () =>
          new Map([
            [
              identifier,
              {
                paymentLabel: "PIX",
                operationalOrigin: "Old operational",
                commercialOrigin: null,
              },
            ],
          ]),
      },
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: noOriginRows,
      payments: [],
      principals: [],
      routines: [],
      responses: [],
    });

    const completed = await adapters.completeRows(
      "11222333000144",
      parsed,
    );
    const [sale] = adapters.mapCanonicalSales({
      organizationExternalCode: 7,
      ...completed,
      catalogs,
    });

    expect(sale?.operationalOrigin).toBe("Não informado");
  });

  it("rejects a coded operational origin that neither lookup nor persistence resolves", async () => {
    const movement = fixture("movimento.xml");
    const adapters = createLinxDataAdapters({
      execute: async (command) =>
        command.name === "LinxMovimento"
          ? movement
          : { columns: [], rows: [] },
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: movement.rows,
      payments: fixture("movimento-planos.xml").rows,
      principals: [],
      routines: [],
      responses: [],
    });

    await expect(
      adapters.completeRows("11222333000144", parsed),
    ).rejects.toBeInstanceOf(LinxDataError);
  });

  it("rejects a delta item that conflicts with the authoritative snapshot", async () => {
    const movement = fixture("movimento.xml");
    const adapters = createLinxDataAdapters({
      execute: async (command) =>
        command.name === "LinxMovimento"
          ? movement
          : { columns: [], rows: [] },
      catalogReader: emptyCatalogReader,
      deadline: createDeadline(() => 1_000, 10_000),
      nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    });
    const parsed = adapters.validateRows({
      movements: [
        {
          ...movement.rows[0]!,
          quantidade: "999",
          valor_total: "10489.50",
        },
      ],
      payments: fixture("movimento-planos.xml").rows,
      principals: fixture("movimento-principal.xml").rows,
      routines: fixture("rotina-origem.xml").rows,
      responses: fixture("resposta-venda.xml").rows,
    });

    await expect(
      adapters.completeRows("11222333000144", parsed),
    ).rejects.toBeInstanceOf(LinxDataError);
  });
});
