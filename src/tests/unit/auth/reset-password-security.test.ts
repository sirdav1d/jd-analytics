import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const afterTasks: Array<() => Promise<void> | void> = [];
  return {
    afterTasks,
    after: vi.fn((task: () => Promise<void> | void) => afterTasks.push(task)),
    headers: vi.fn(),
    createRequest: vi.fn(),
    redeem: vi.fn(),
  };
});

vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/services/auth/password-reset", () => ({
  trustedPasswordResetOrigin: () => "https://analytics.example.com",
  createPasswordResetRequest: mocks.createRequest,
  redeemPasswordResetToken: mocks.redeem,
}));
vi.mock("@/lib/prisma", () => ({ prisma: { kind: "db" } }));
vi.mock("@/lib/email/send-email", () => ({ sendEmail: vi.fn() }));

describe("password reset actions", () => {
  beforeEach(() => {
    mocks.afterTasks.splice(0);
    mocks.after.mockClear();
    mocks.headers.mockResolvedValue({
      get: (name: string) =>
        name === "x-forwarded-for" ? "203.0.113.9, 10.0.0.1" : null,
    });
    mocks.createRequest.mockReset().mockResolvedValue({ ok: true });
    mocks.redeem.mockReset().mockResolvedValue({ ok: true });
  });

  it("returns generic success and schedules a token request without changing a password", async () => {
    const { resetPasswordAction } = await import(
      "@/actions/user/reset-password"
    );

    await expect(
      resetPasswordAction({ email: "ada@example.com" }),
    ).resolves.toEqual({ ok: true });
    expect(mocks.createRequest).not.toHaveBeenCalled();
    expect(mocks.afterTasks).toHaveLength(1);

    await mocks.afterTasks[0]();
    expect(mocks.createRequest).toHaveBeenCalledWith(
      { email: "ada@example.com", ip: "203.0.113.9" },
      expect.objectContaining({
        origin: "https://analytics.example.com",
        db: { kind: "db" },
        send: expect.any(Function),
      }),
    );
  });

  it("keeps the public response generic when scheduling is unavailable", async () => {
    mocks.after.mockImplementationOnce(() => {
      throw new Error("request scope missing");
    });
    const { resetPasswordAction } = await import(
      "@/actions/user/reset-password"
    );
    await expect(
      resetPasswordAction({ email: "missing@example.com" }),
    ).resolves.toEqual({ ok: true });
    expect(mocks.createRequest).not.toHaveBeenCalled();
  });

  it("redeems only through the conditional one-use service", async () => {
    const { completePasswordResetAction } = await import(
      "@/actions/user/reset-password"
    );
    await expect(
      completePasswordResetAction({
        token: "x".repeat(43),
        newPassword: "a-secure-new-password",
      }),
    ).resolves.toEqual({ ok: true });
    expect(mocks.redeem).toHaveBeenCalledWith(
      {
        token: "x".repeat(43),
        newPassword: "a-secure-new-password",
      },
      expect.objectContaining({ db: { kind: "db" }, now: expect.any(Function) }),
    );
  });
});
