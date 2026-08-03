import { describe, expect, it, vi } from "vitest";

const user = {
	id: "user-id",
	name: "Ada",
	email: "ada@example.com",
	externalId: "external-id",
	password: "hashed-password",
	role: "MANAGER" as const,
	isActive: true,
	createdAt: new Date(),
	updatedAt: new Date(),
};

vi.mock("@/lib/auth", () => ({ requireAdmin: vi.fn(async () => undefined) }));
vi.mock("@/lib/prisma", () => ({
	prisma: {
		user: {
			create: vi.fn(async () => user),
			update: vi.fn(async () => user),
		},
	},
}));
vi.mock("bcrypt", () => {
	const hash = vi.fn(async () => "hashed-password");
	return { default: { hash }, hash };
});
vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

describe("administrative user mutations", () => {
	it("does not return a password after creating a user", async () => {
		const { createUserAction } = await import("@/actions/user/create");

		const result = await createUserAction(
			"Ada",
			"ada@example.com",
			"MANAGER",
			"password123",
			"external-id",
		);

		expect(result).toMatchObject({ ok: true, error: null });
		expect(result.user).not.toHaveProperty("password");
	});

	it("does not return a password after updating a user", async () => {
		const { updateUserAction } = await import("@/actions/user/update");

		const result = await updateUserAction({
			userUp: { email: "ada@example.com", name: "Ada Lovelace" },
		});

		expect(result).toMatchObject({ ok: true, error: null });
		expect(result.user).not.toHaveProperty("password");
	});
});
