import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { AuthorizationError } from "@/lib/authorization";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  readMultipartCsv: vi.fn(),
  adaptOrdersCsv: vi.fn(),
  adaptOriginCsv: vi.fn(),
  importSales: vi.fn(),
  importOrigins: vi.fn(),
  transaction: vi.fn(),
  revalidateTag: vi.fn(),
  tx: {},
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  prisma: { $transaction: mocks.transaction },
}));
vi.mock("@/utils/csv/process", () => ({
  readMultipartCsv: mocks.readMultipartCsv,
}));
vi.mock("@/services/sales-import/csv-orders-adapter", () => ({
  adaptOrdersCsv: mocks.adaptOrdersCsv,
}));
vi.mock("@/services/sales-import/csv-origin-adapter", () => ({
  adaptOriginCsv: mocks.adaptOriginCsv,
}));
vi.mock("@/services/sales-import/import-sales", () => ({
  importSales: mocks.importSales,
}));
vi.mock("@/services/sales-import/import-origins", () => ({
  importOrigins: mocks.importOrigins,
}));
vi.mock("next/cache", () => ({ revalidateTag: mocks.revalidateTag }));

const orderSummary = { ordersProcessed: 1, itemsCreated: 2, itemsUpdated: 0, itemsRemoved: 0 };
const originSummary = { updatedOrders: 1 };

const routes = [
  {
    name: "orders",
    path: "/api/upload",
    post: () => import("@/app/api/upload/route").then(({ POST }) => POST),
    adapt: mocks.adaptOrdersCsv,
    importer: mocks.importSales,
    summary: orderSummary,
    cacheTags: [
      "tracking-goal",
      "home",
      "sales-by",
      "rankings",
      "big-numbers-comercial",
      "origin",
      "origin-data",
    ],
  },
  {
    name: "origins",
    path: "/api/upload-origin",
    post: () => import("@/app/api/upload-origin/route").then(({ POST }) => POST),
    adapt: mocks.adaptOriginCsv,
    importer: mocks.importOrigins,
    summary: originSummary,
    cacheTags: ["origin", "origin-data"],
  },
] as const;

function request(path: string) {
  return new NextRequest(`http://localhost${path}`, { method: "POST" });
}

beforeEach(() => {
  mocks.requireAdmin.mockResolvedValue({ id: "admin-id" });
  mocks.readMultipartCsv.mockResolvedValue("csv-content");
  mocks.adaptOrdersCsv.mockReturnValue([{ documentNumber: "9001" }]);
  mocks.adaptOriginCsv.mockReturnValue([{ documentNumber: "9001" }]);
  mocks.importSales.mockResolvedValue(orderSummary);
  mocks.importOrigins.mockResolvedValue(originSummary);
  mocks.transaction.mockImplementation(async (callback: (tx: object) => Promise<unknown>) =>
    callback(mocks.tx),
  );
});

describe("manual upload routes", () => {
  it.each(routes)("rejects an unauthorized $name upload before reading or parsing the file", async ({ post, path, adapt }) => {
    mocks.requireAdmin.mockRejectedValueOnce(new AuthorizationError(403, "Acesso negado"));

    const response = await (await post())(request(path));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Acesso negado" });
    expect(mocks.readMultipartCsv).not.toHaveBeenCalled();
    expect(adapt).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it.each(routes)("adapts the complete $name file before one bounded transaction", async ({ post, path, adapt, importer, summary, cacheTags }) => {
    const response = await (await post())(request(path));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(summary);
    expect(adapt.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.transaction.mock.invocationCallOrder[0],
    );
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.transaction).toHaveBeenCalledWith(
      expect.any(Function),
      { maxWait: 5_000, timeout: 30_000 },
    );
    expect(importer).toHaveBeenCalledWith(mocks.tx, [{ documentNumber: "9001" }]);
    expect(mocks.revalidateTag.mock.calls.map(([tag]) => tag)).toEqual(cacheTags);
    expect(mocks.revalidateTag).not.toHaveBeenCalledWith("sales");
  });

  it.each(routes)("returns 400 without a transaction when the $name file is invalid", async ({ post, path, adapt }) => {
    adapt.mockImplementationOnce(() => {
      throw new Error("invalid csv");
    });

    const response = await (await post())(request(path));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "O arquivo enviado não é um CSV válido." });
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it.each(routes)("does not revalidate $name data when its transaction fails", async ({ post, path }) => {
    mocks.transaction.mockRejectedValueOnce(new Error("database unavailable"));

    const response = await (await post())(request(path));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Erro interno ao importar o CSV." });
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });
});
