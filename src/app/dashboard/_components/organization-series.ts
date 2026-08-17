export type OrganizationSeries = {
	dataKey: string;
	label: string;
	color: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export function getOrganizationSeries(response: unknown): OrganizationSeries[] {
	if (!isRecord(response) || response.ok !== true || !isRecord(response.data)) {
		return [];
	}

	const result = response.data.result;
	if (!Array.isArray(result)) return [];

	const seen = new Set<string>();
	const series: OrganizationSeries[] = [];

	for (const row of result) {
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
