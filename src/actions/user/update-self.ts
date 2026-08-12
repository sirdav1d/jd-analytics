"use server";

import bcrypt from "bcrypt";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { AuthorizationError } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const selfSchema = z
	.object({
		name: z.string().trim().min(2).max(100).optional(),
		password: z.string().min(8).max(128).optional(),
	})
	.refine((value) => value.name || value.password, "Nada para atualizar");

export async function updateSelfAction(input: unknown) {
	const current = await getCurrentUser();
	if (!current?.isActive) throw new AuthorizationError(401, "Não autenticado");

	const value = selfSchema.parse(input);
	await prisma.user.update({
		where: { id: current.id },
		data: {
			...(value.name ? { name: value.name } : {}),
			...(value.password
				? { password: await bcrypt.hash(value.password, 12) }
				: {}),
		},
	});

	revalidatePath("/dashboard/profile");
	revalidatePath("/dashboard", "layout");

	return { ok: true };
}
