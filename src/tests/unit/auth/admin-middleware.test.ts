import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getToken: vi.fn() }));

vi.mock("next-auth/jwt", () => ({ getToken: mocks.getToken }));

import { config, proxy } from "@/proxy";

function request(path: string) {
  return new NextRequest(`http://localhost${path}`);
}

describe("admin proxy", () => {
  beforeEach(() => {
    mocks.getToken.mockReset();
    vi.stubEnv("NEXTAUTH_SECRET", "test-secret");
  });

  it.each([
    "/dashboard",
    "/dashboard/comercial",
    "/dashboard/users",
    "/dashboard/users/new",
    "/dashboard/meta-investments",
    "/dashboard/upload",
    "/dashboard/goals-marketing",
    "/dashboard/goals-comercial",
    "/sign-in",
    "/reset-pass",
    "/reset-pass/new-password",
  ])("matches the guarded route %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
  });

  it.each(["/", "/marketing-report/public-id", "/api/auth/session"])(
    "does not match the public route %s",
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
    },
  );

  it("continues for an active manager on a common dashboard route", async () => {
    mocks.getToken.mockResolvedValue({ role: "MANAGER", isActive: true });

    const response = await proxy(request("/dashboard/comercial"));

    expect(response.status).toBe(200);
  });

  it.each([
    ["missing", null],
    ["inactive", { role: "ADMIN", isActive: false }],
  ])("redirects a %s token on dashboard routes to sign-in", async (_case, token) => {
    mocks.getToken.mockResolvedValue(token);

    const response = await proxy(request("/dashboard/comercial"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/sign-in");
  });

  it("treats an invalid JWT as unauthenticated", async () => {
    mocks.getToken.mockRejectedValue(new Error("invalid token"));

    const response = await proxy(request("/dashboard/comercial"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/sign-in");
  });

  it("redirects an active manager from an admin route to dashboard", async () => {
    mocks.getToken.mockResolvedValue({ role: "MANAGER", isActive: true });

    const response = await proxy(request("/dashboard/users"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/dashboard");
  });

  it.each(["/dashboard/%75sers", "/dashboard%2Fusers"])(
    "redirects an active manager from the encoded admin route %s",
    async (url) => {
      mocks.getToken.mockResolvedValue({ role: "MANAGER", isActive: true });

      const response = await proxy(request(url));

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/dashboard");
    },
  );

  it("continues for an active administrator on a nested admin route", async () => {
    mocks.getToken.mockResolvedValue({ role: "ADMIN", isActive: true });

    const response = await proxy(request("/dashboard/users/new"));

    expect(response.status).toBe(200);
  });

  it("does not treat users-export as the users admin route", async () => {
    mocks.getToken.mockResolvedValue({ role: "MANAGER", isActive: true });

    const response = await proxy(request("/dashboard/users-export"));

    expect(response.status).toBe(200);
  });

  it.each(["/sign-in", "/reset-pass"])(
    "redirects an active user from %s to dashboard",
    async (url) => {
      mocks.getToken.mockResolvedValue({ role: "MANAGER", isActive: true });

      const response = await proxy(request(url));

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/dashboard");
    },
  );

  it.each(["/%73ign-in", "/reset%2Dpass"])(
    "redirects an active user from the encoded authentication route %s",
    async (url) => {
      mocks.getToken.mockResolvedValue({ role: "MANAGER", isActive: true });

      const response = await proxy(request(url));

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/dashboard");
    },
  );

  it.each(["/dashboard/%E0%A4%A", "/dashboard/%"])(
    "rejects the malformed encoded pathname %s",
    async (url) => {
      mocks.getToken.mockResolvedValue({ role: "MANAGER", isActive: true });

      const response = await proxy(request(url));

      expect(response.status).toBe(400);
    },
  );

  it.each([
    ["/sign-in", null],
    ["/reset-pass", { role: "ADMIN", isActive: false }],
  ])(
    "continues on authentication page %s without an active token",
    async (url, token) => {
      mocks.getToken.mockResolvedValue(token);

      const response = await proxy(request(url));

      expect(response.status).toBe(200);
    },
  );
});
