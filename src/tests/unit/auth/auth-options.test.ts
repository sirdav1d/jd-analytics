import { describe, expect, it } from "vitest";
import { authOptions } from "@/lib/auth";

describe("authOptions", () => {
	it("sends NextAuth authentication flows to the existing sign-in page", () => {
		expect(authOptions.pages).toEqual({
			signIn: "/sign-in",
			signOut: "/sign-in",
			error: "/",
			verifyRequest: "/sign-in",
		});
	});
});
