import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
	prisma: {
		user: {
			findUnique: vi.fn(async () => ({
				id: "user-id",
				name: "Ada",
				email: "ada@example.com",
				password: "hashed-password",
				role: "MANAGER",
				isActive: true,
			})),
		},
	},
}));

vi.mock("bcrypt", () => {
	const compare = vi.fn(async () => true);
	return { default: { compare }, compare };
});

describe("credentials authentication", () => {
	it("does not put a password on the authenticated user", async () => {
		const { authOptions } = await import("@/lib/auth");
		const provider = authOptions.providers[0] as {
			options: {
				authorize: (credentials: {
					email: string;
					password: string;
				}) => Promise<Record<string, unknown> | null>;
			};
		};

		const user = await provider.options.authorize({
			email: "ada@example.com",
			password: "password123",
		});

		expect(user).toMatchObject({ id: "user-id", email: "ada@example.com" });
		expect(user).not.toHaveProperty("password");
	});
});
