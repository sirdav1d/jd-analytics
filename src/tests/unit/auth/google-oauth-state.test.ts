import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
	requireAdmin: vi.fn(),
	generateAuthUrl: vi.fn(),
	getToken: vi.fn(),
	organizationUpdate: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/google-client", () => ({
	getOAuth2Client: () => ({
		generateAuthUrl: mocks.generateAuthUrl,
		getToken: mocks.getToken,
	}),
}));
vi.mock("@/lib/prisma", () => ({
	prisma: { organization: { update: mocks.organizationUpdate } },
}));

describe("Google OAuth routes", () => {
	beforeEach(() => {
		mocks.requireAdmin.mockReset().mockResolvedValue(undefined);
		mocks.generateAuthUrl.mockReset().mockReturnValue("https://accounts.example/authorize");
		mocks.getToken.mockReset().mockResolvedValue({
			tokens: {
				access_token: "access",
				refresh_token: "refresh",
				expiry_date: 1,
				scope: "scope",
			},
		});
		mocks.organizationUpdate.mockReset().mockResolvedValue({ id: "org-id" });
		vi.stubEnv("GOOGLE_SCOPES", "scope-a scope-b");
		vi.stubEnv("NODE_ENV", "production");
	});

	it("binds the authorization URL to a short-lived HttpOnly state and PKCE cookie", async () => {
		const { GET } = await import("@/app/api/auth/login-google/route");

		const response = await GET();

		expect(response.status).toBe(307);
		expect(mocks.generateAuthUrl).toHaveBeenCalledWith(
			expect.objectContaining({
				state: expect.any(String),
				code_challenge: expect.any(String),
				code_challenge_method: "S256",
			}),
		);
		expect(response.headers.get("set-cookie")).toEqual(
			expect.stringContaining("google-oauth="),
		);
		expect(response.headers.get("set-cookie")).toEqual(
			expect.stringContaining("HttpOnly"),
		);
		expect(response.headers.get("set-cookie")).toEqual(
			expect.stringContaining("Secure"),
		);
		expect(response.headers.get("set-cookie")).toMatch(/SameSite=Lax/i);
		expect(response.headers.get("set-cookie")).toEqual(
			expect.stringContaining("Max-Age=600"),
		);
	});

	it("rejects a callback state mismatch before exchanging a code and consumes the cookie", async () => {
		const { GET: begin } = await import("@/app/api/auth/login-google/route");
		const { GET: callback } = await import("@/app/api/auth/callback/route");
		const beginResponse = await begin();
		const cookie = beginResponse.headers.get("set-cookie")!.split(";", 1)[0];

		const response = await callback(
			new NextRequest(
				"http://localhost/api/auth/callback?code=code-from-attacker&state=wrong-state",
				{ headers: { cookie } },
			),
		);

		expect(response.status).toBe(400);
		expect(mocks.getToken).not.toHaveBeenCalled();
		expect(response.headers.get("set-cookie")).toEqual(
			expect.stringContaining("Max-Age=0"),
		);
	});

	it("exchanges a callback code only when its state matches and supplies the PKCE verifier", async () => {
		const { GET: begin } = await import("@/app/api/auth/login-google/route");
		const { GET: callback } = await import("@/app/api/auth/callback/route");
		const beginResponse = await begin();
		const cookie = beginResponse.headers.get("set-cookie")!.split(";", 1)[0];
		const state = mocks.generateAuthUrl.mock.calls[0][0].state as string;

		const response = await callback(
			new NextRequest(
				`http://localhost/api/auth/callback?code=valid-code&state=${state}`,
				{ headers: { cookie } },
			),
		);

		expect(response.status).toBe(307);
		expect(mocks.getToken).toHaveBeenCalledWith({
			code: "valid-code",
			codeVerifier: expect.any(String),
		});
		expect(response.headers.get("set-cookie")).toEqual(
			expect.stringContaining("Max-Age=0"),
		);
	});

	it("consumes the cookie when token exchange fails after valid state validation", async () => {
		mocks.getToken.mockRejectedValue(new Error("token exchange failed"));
		const { GET: begin } = await import("@/app/api/auth/login-google/route");
		const { GET: callback } = await import("@/app/api/auth/callback/route");
		const beginResponse = await begin();
		const cookie = beginResponse.headers.get("set-cookie")!.split(";", 1)[0];
		const state = mocks.generateAuthUrl.mock.calls[0][0].state as string;

		const response = await callback(
			new NextRequest(
				`http://localhost/api/auth/callback?code=valid-code&state=${state}`,
				{ headers: { cookie } },
			),
		);

		expect(response.status).toBe(500);
		expect(response.headers.get("set-cookie")).toEqual(
			expect.stringContaining("Max-Age=0"),
		);
	});

	it("consumes the cookie when token persistence cannot find the organization", async () => {
		mocks.organizationUpdate.mockResolvedValue(null);
		const { GET: begin } = await import("@/app/api/auth/login-google/route");
		const { GET: callback } = await import("@/app/api/auth/callback/route");
		const beginResponse = await begin();
		const cookie = beginResponse.headers.get("set-cookie")!.split(";", 1)[0];
		const state = mocks.generateAuthUrl.mock.calls[0][0].state as string;

		const response = await callback(
			new NextRequest(
				`http://localhost/api/auth/callback?code=valid-code&state=${state}`,
				{ headers: { cookie } },
			),
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("set-cookie")).toEqual(
			expect.stringContaining("Max-Age=0"),
		);
	});
});
