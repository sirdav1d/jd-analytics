import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  getCurrentUser: vi.fn(),
  hash: vi.fn(),
  salesGoalCreate: vi.fn(),
  salesGoalUpdate: vi.fn(),
  userCreate: vi.fn(),
  userUpdate: vi.fn(),
  organizationCreate: vi.fn(),
  organizationUpdate: vi.fn(),
  metaInvestmentUpsert: vi.fn(),
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  updateTag: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: mocks.requireAdmin,
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    salesGoal: {
      create: mocks.salesGoalCreate,
      update: mocks.salesGoalUpdate,
    },
    user: {
      create: mocks.userCreate,
      update: mocks.userUpdate,
    },
    organization: {
      create: mocks.organizationCreate,
      update: mocks.organizationUpdate,
    },
    metaInvestment: { upsert: mocks.metaInvestmentUpsert },
  },
}));
vi.mock("bcrypt", () => ({ default: { hash: mocks.hash } }));
vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
  revalidateTag: mocks.revalidateTag,
  updateTag: mocks.updateTag,
}));

describe("mutation cache revalidation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockResolvedValue(undefined);
    mocks.getCurrentUser.mockResolvedValue({ id: "current-user", isActive: true });
    mocks.hash.mockResolvedValue("hashed-password");
    mocks.salesGoalCreate.mockResolvedValue({ id: "sales-created", revenue: 100 });
    mocks.salesGoalUpdate.mockResolvedValue({ id: "sales-updated", revenue: 200 });
    mocks.userCreate.mockResolvedValue({
      id: "user-created",
      email: "new@example.com",
      password: "hashed-password",
    });
    mocks.userUpdate.mockResolvedValue({
      id: "user-updated",
      email: "updated@example.com",
      password: "hashed-password",
    });
    mocks.organizationCreate.mockResolvedValue({ id: "org-created", name: "JD" });
    mocks.organizationUpdate.mockResolvedValue({ id: "org-updated", name: "JD" });
    mocks.metaInvestmentUpsert.mockResolvedValue({ id: "meta-investment" });
  });

  it("refreshes commercial goal consumers after create and update", async () => {
    const [{ CreateSalesGoalAction }, { UpdateSalesGoalAction }] =
      await Promise.all([
        import("@/actions/goals/create"),
        import("@/actions/goals/update"),
      ]);
    const expectGoalCacheRefresh = () => {
      expect(mocks.updateTag.mock.calls).toEqual([
        ["rankings"],
        ["tracking-goal"],
        ["sales-by"],
        ["big-numbers-comercial"],
        ["goals-current"],
      ]);
      expect(mocks.revalidatePath.mock.calls).toEqual([
        ["/dashboard/goals-comercial"],
        ["/dashboard"],
      ]);
    };

    await CreateSalesGoalAction({
      userId: "seller",
      goalDateRef: new Date("2026-08-01T00:00:00.000Z"),
      revenue: 100,
    });
    expectGoalCacheRefresh();

    vi.clearAllMocks();
    await UpdateSalesGoalAction({ goalId: "sales-updated", revenue: 200 });
    expectGoalCacheRefresh();
  });

  it("refreshes the users page after create, update, and deactivate", async () => {
    const [{ createUserAction }, { updateUserAction }, { deleteUserAction }] =
      await Promise.all([
        import("@/actions/user/create"),
        import("@/actions/user/update"),
        import("@/actions/user/delete"),
      ]);
    const expectUserCacheRefresh = () => {
      expect(mocks.updateTag.mock.calls).toEqual([
        ["rankings"],
        ["tracking-goal"],
        ["sales-by"],
        ["big-numbers-comercial"],
        ["goals-current"],
      ]);
      expect(mocks.revalidatePath.mock.calls).toEqual([
        ["/dashboard/users"],
      ]);
    };

    await createUserAction(
      "New User",
      "new@example.com",
      "MANAGER",
      "password123",
      "external-id",
    );
    expectUserCacheRefresh();

    vi.clearAllMocks();
    await updateUserAction({
      userUp: { email: "updated@example.com", name: "Updated User" },
    });
    expectUserCacheRefresh();

    vi.clearAllMocks();
    await deleteUserAction("user-updated");
    expectUserCacheRefresh();
  });

  it("refreshes profile data and the dashboard layout after self update", async () => {
    const { updateSelfAction } = await import("@/actions/user/update-self");

    await updateSelfAction({ name: "Updated User" });

    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/profile");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard", "layout");
  });

  it("refreshes organization consumers after organization writes", async () => {
    const [{ CreateOrgAction }, { updateOrganizationTokens }] =
      await Promise.all([
        import("@/actions/org/create"),
        import("@/actions/org/update-tokens"),
      ]);

    await CreateOrgAction("JD");
    await updateOrganizationTokens("org-updated", "access", "refresh", 3600);

    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard", "layout");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/marketing");
    expect(mocks.updateTag).toHaveBeenCalledWith(
      "marketing-goals-google-ads-current",
    );
    expect(mocks.updateTag).toHaveBeenCalledWith(
      "marketing-goals-google-ads-history",
    );
  });

  it("refreshes Meta investment consumers after a successful upsert", async () => {
    const { UpsertMetaInvestmentAction } = await import(
      "@/actions/meta-investment/upsert"
    );

    await UpsertMetaInvestmentAction({
      periodEnd: new Date("2026-08-11T00:00:00.000Z"),
      totalInvestment: 426.35,
    });

    expect(mocks.updateTag).toHaveBeenCalledWith("goals-current");
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/dashboard/meta-investments",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/marketing-report/current",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("does not invalidate cache when a database mutation fails", async () => {
    mocks.salesGoalCreate.mockRejectedValueOnce(new Error("database unavailable"));
    const { CreateSalesGoalAction } = await import("@/actions/goals/create");

    const result = await CreateSalesGoalAction({
      userId: "seller",
      goalDateRef: new Date("2026-08-01T00:00:00.000Z"),
      revenue: 100,
    });

    expect(result.ok).toBe(false);
    expect(mocks.updateTag).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
