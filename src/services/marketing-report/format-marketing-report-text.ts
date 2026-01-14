/** @format */

import type { MarketingReportAggregate } from '@/services/marketing-report/get-marketing-report-aggregate';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatMarketingReportText(aggregate: MarketingReportAggregate) {
	const start = parseISO(aggregate.periodStart);
	const end = parseISO(aggregate.periodEnd);
	const indent = '  ';

	const title = `RELATÓRIO MARKETING ${format(start, 'dd', {
		locale: ptBR,
	})} A ${format(end, 'dd', { locale: ptBR })} ${format(end, 'MMM', {
		locale: ptBR,
	}).toUpperCase()}/${format(end, 'yy', { locale: ptBR })}`;

	const lines = [
		title,
		'',
		'INVESTIMENTOS',
		'',
		`${indent}META: ${aggregate.formatted.meta}`,
		`${indent}GOOGLE CENTRO/PRODUTOS: ${aggregate.formatted.googleCentroProdutos}`,
		`${indent}GOOGLE ICARAÍ/SERVIÇOS: ${aggregate.formatted.googleIcaraiServicos}`,
		`${indent}CUSTO TOTAL: ${aggregate.formatted.custoTotal}`,
		'',
		`FATURAMENTO TOTAL: ${aggregate.formatted.faturamentoTotal}`,
		'',
		`ROAS GERAL: ${aggregate.formatted.roasGeral}`,
	];

	return lines.join('\n');
}
