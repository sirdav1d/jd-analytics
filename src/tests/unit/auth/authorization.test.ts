import { describe, expect, it } from "vitest";
import {
	AuthorizationError,
	assertActiveAdmin,
	assertActiveUser,
} from "@/lib/authorization";
import type { AuthorizedUser } from "@/lib/authorization";

const inactiveOrNonAdminUsers: Array<AuthorizedUser | null> = [
	null,
	{ id: "u1", role: "MANAGER", isActive: true },
	{ id: "u1", role: "SELLER", isActive: true },
	{ id: "u1", role: "ADMIN", isActive: false },
];

describe("assertActiveAdmin", () => {
	it("accepts an active ADMIN", () => {
		expect(() =>
			assertActiveAdmin({ id: "u1", role: "ADMIN", isActive: true }),
		).not.toThrow();
	});

	it.each(inactiveOrNonAdminUsers)(
		"rejects non-admin or inactive users: %o",
		(user) => {
		expect(() => assertActiveAdmin(user)).toThrow(AuthorizationError);
		},
	);
});

describe("assertActiveUser", () => {
	it.each(["ADMIN", "MANAGER", "SELLER"] as const)(
		"accepts an active %s",
		(role) => {
			expect(() =>
				assertActiveUser({ id: "u1", role, isActive: true }),
			).not.toThrow();
		},
	);

	it("returns 401 for an anonymous user", () => {
		expect.assertions(2);
		try {
			assertActiveUser(null);
		} catch (error) {
			expect(error).toBeInstanceOf(AuthorizationError);
			expect((error as AuthorizationError).status).toBe(401);
		}
	});

	it.each(["ADMIN", "MANAGER", "SELLER"] as const)(
		"returns 403 for an inactive %s",
		(role) => {
			expect.assertions(2);
			try {
				assertActiveUser({ id: "u1", role, isActive: false });
			} catch (error) {
				expect(error).toBeInstanceOf(AuthorizationError);
				expect((error as AuthorizationError).status).toBe(403);
			}
		},
	);
});
