export type OrganizationSeries = {
	dataKey: string;
	label: string;
	color: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function getSeriesFromRows(rows: unknown): OrganizationSeries[] {
	if (!Array.isArray(rows)) return [];
	const seen = new Set<string>();
	const series: OrganizationSeries[] = [];

	for (const row of rows) {
		if (
			!isRecord(row) ||
			typeof row.organization !== 'string' ||
			typeof row.organizationId !== 'string'
		) {
			continue;
		}
		const label = row.organization.trim();
		const dataKey = row.organizationId;
		if (!label || !dataKey.trim() || seen.has(dataKey)) continue;
		seen.add(dataKey);
		series.push({
			dataKey,
			label,
			color: `hsl(var(--chart-${series.length + 1}))`,
		});
	}

	return series;
}

export function getOrganizationSeries(response: unknown): OrganizationSeries[] {
	if (!isRecord(response) || response.ok !== true || !isRecord(response.data)) {
		return [];
	}

	return getSeriesFromRows(response.data.result);
}

export function getHistoryOrganizationSeries(
	response: unknown,
	historyKey: 'salesByOrg' | 'revenueByOrg',
): OrganizationSeries[] {
	if (!isRecord(response) || response.ok !== true || !isRecord(response.data)) {
		return [];
	}

	const history = response.data[historyKey];
	if (!Array.isArray(history)) return [];

	const availableDataKeys = new Set<string>();
	for (const row of history) {
		if (!isRecord(row)) continue;
		for (const dataKey of Object.keys(row)) {
			if (dataKey !== 'period') availableDataKeys.add(dataKey);
		}
	}

	const metadata = Array.isArray(response.data.historyOrganizations)
		? response.data.historyOrganizations
		: response.data.result;

	return getSeriesFromRows(metadata).filter(({ dataKey }) =>
		availableDataKeys.has(dataKey),
	);
}
