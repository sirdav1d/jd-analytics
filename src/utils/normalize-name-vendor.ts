/** @format */

export function normalizeVendedor(vendedor: string): string {
	return vendedor
		.normalize('NFD') // separa acentos das letras
		.replace(/[\u0300-\u036f]/g, '') // remove acentos
		.replace(/\s*-\s*/, '') // remove hífen entre ID e nome
		.replace(/\s+/g, '') // remove todos os espaços
		.replace(/[^a-zA-Z0-9]/g, '') // remove qualquer outro caractere especial
		.toUpperCase(); // deixa tudo maiúsculo
}
