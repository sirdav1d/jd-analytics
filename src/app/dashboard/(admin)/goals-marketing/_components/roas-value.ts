export type RoasValue = number | null;

export function formatRoas(value: RoasValue) {
	return value === null ? "Sem investimento" : `${value.toFixed(2)}x`;
}
