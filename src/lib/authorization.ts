import type { Role } from "@prisma/client";

export type AuthorizedUser = {
	id: string;
	role: Role;
	isActive: boolean;
};

export class AuthorizationError extends Error {
	readonly status: 401 | 403;

	constructor(status: 401 | 403, message: string) {
		super(message);
		this.name = "AuthorizationError";
		this.status = status;
	}
}

export function assertActiveAdmin(
	user: AuthorizedUser | null,
): asserts user is AuthorizedUser {
	if (!user) throw new AuthorizationError(401, "Não autenticado");
	if (!user.isActive || user.role !== "ADMIN") {
		throw new AuthorizationError(403, "Acesso restrito a administradores");
	}
}

export function assertActiveUser(
	user: AuthorizedUser | null,
): asserts user is AuthorizedUser {
	if (!user) throw new AuthorizationError(401, "Não autenticado");
	if (!user.isActive) {
		throw new AuthorizationError(403, "Usuário inativo");
	}
}
