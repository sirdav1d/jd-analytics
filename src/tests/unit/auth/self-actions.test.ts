import { describe, expect, it, vi } from "vitest";

const update = vi.fn(async () => undefined);
const findUnique = vi.fn(async () => null);
const sendEmail = vi.fn(async () => undefined);

vi.mock("@/lib/auth", () => ({
	getCurrentUser: vi.fn(async () => ({
		id: "current-user",
		name: "Ada",
		email: "ada@example.com",
		role: "MANAGER",
		isActive: true,
	})),
}));

vi.mock("@/lib/prisma", () => ({
	prisma: { user: { update, findUnique } },
}));

vi.mock("bcrypt", () => {
	const hash = vi.fn(async () => "hashed-password");
	return { default: { hash }, hash };
});
vi.mock("@/lib/email/send-email", () => ({ sendEmail }));

describe("self-service user actions", () => {
	it("updates the authenticated user's own name without returning credentials", async () => {
		const { updateSelfAction } = await import("@/actions/user/update-self");

		await expect(updateSelfAction({ name: "Ada Lovelace" })).resolves.toEqual({
			ok: true,
		});
		expect(update).toHaveBeenCalledWith({
			where: { id: "current-user" },
			data: { name: "Ada Lovelace" },
		});
	});

	it("does not disclose whether a password-reset email belongs to an account", async () => {
		findUnique.mockResolvedValueOnce(null);
		const { resetPasswordAction } = await import(
			"@/actions/user/reset-password"
		);

		await expect(
			resetPasswordAction({ email: "missing@example.com" }),
		).resolves.toEqual({ ok: true });
		expect(sendEmail).not.toHaveBeenCalled();
	});
});
