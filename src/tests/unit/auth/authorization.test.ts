import { describe, expect, it } from "vitest";
import {
	AuthorizationError,
	assertActiveAdmin,
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
