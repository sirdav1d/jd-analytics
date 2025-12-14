/** @format */

import { startOfMonth } from 'date-fns';

/**
 * Retorna intervalo padrão do mês atual: primeiro dia até hoje.
 */
export function getDefaultDateRange() {
	const today = new Date();
	const start = startOfMonth(today);
	return { from: start, to: today };
}
