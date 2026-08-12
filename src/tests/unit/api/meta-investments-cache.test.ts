import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  upsert: vi.fn(),
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  prisma: { metaInvestment: { upsert: mocks.upsert } },
}));
vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
  revalidateTag: mocks.revalidateTag,
}));

function makeRequest() {
  return new NextRequest("http://localhost/api/services/meta-investments", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      periodEnd: "2026-08-11",
      totalInvestment: 426.35,
    }),
  });
}

describe("Meta investment route cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockResolvedValue(undefined);
    mocks.upsert.mockResolvedValue({
      id: "investment",
      periodStart: new Date("2026-08-01T00:00:00.000Z"),
      periodEnd: new Date("2026-08-11T00:00:00.000Z"),
      totalInvestment: 426.35,
    });
  });

  it("invalidates every Meta consumer after a successful write", async () => {
    const { POST } = await import("@/app/api/services/meta-investments/route");

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    expect(mocks.revalidateTag).toHaveBeenCalledWith("goals-current", {
      expire: 0,
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/dashboard/meta-investments",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/marketing-report/current",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("does not invalidate cache when the write fails", async () => {
    mocks.upsert.mockRejectedValueOnce(new Error("database unavailable"));
    const { POST } = await import("@/app/api/services/meta-investments/route");

    const response = await POST(makeRequest());

    expect(response.status).toBe(500);
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
