import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getToken: vi.fn() }));

vi.mock("next-auth/jwt", () => ({ getToken: mocks.getToken }));

import { config, middleware } from "@/middleware";

function request(path: string) {
  return new NextRequest(`http://localhost${path}`);
}

describe("admin middleware", () => {
  beforeEach(() => {
    mocks.getToken.mockReset();
    vi.stubEnv("NEXTAUTH_SECRET", "test-secret");
  });

  it.each([
    "/dashboard/users",
    "/dashboard/users/new",
    "/dashboard/meta-investments",
    "/dashboard/upload",
    "/dashboard/goals-marketing",
    "/dashboard/goals-comercial",
  ])("matches the administrative route %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
  });

  it.each(["/dashboard", "/dashboard/comercial", "/sign-in"])(
    "does not match the common route %s",
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
    },
  );

  it("continues for an active administrator", async () => {
    mocks.getToken.mockResolvedValue({ role: "ADMIN", isActive: true });

    const response = await middleware(request("/dashboard/users"));

    expect(response.status).toBe(200);
  });

  it("redirects an unauthenticated request to sign-in", async () => {
    mocks.getToken.mockResolvedValue(null);

    const response = await middleware(request("/dashboard/users"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/sign-in");
  });

  it.each([
    { role: "MANAGER", isActive: true },
    { role: "SELLER", isActive: true },
    { role: "ADMIN", isActive: false },
  ])("redirects a non-admin or inactive token: %o", async (token) => {
    mocks.getToken.mockResolvedValue(token);

    const response = await middleware(request("/dashboard/users"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/dashboard");
  });

  it("treats an invalid JWT as unauthenticated", async () => {
    mocks.getToken.mockRejectedValue(new Error("invalid token"));

    const response = await middleware(request("/dashboard/users"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/sign-in");
  });
});
