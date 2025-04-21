/** @format */

export function normalizeVendedorLabel(vendedor: string): string {
	const [id, ...nome] = vendedor.split('-');
	const nomeFormatado = nome
		.join('-') // junta se houver outros hifens no nome
		.trim()
		.toLowerCase()
		.replace(/\b\w/g, (l) => l.toUpperCase()); // capitaliza
	return `${id.trim()} - ${nomeFormatado}`;
}
