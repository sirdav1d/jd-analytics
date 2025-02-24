/** @format */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatMetrics(data: any) {
	const formattedMetrics: { [key: string]: string | null } = {};
	if (data?.metricHeaders && data?.rows && data.rows.length > 0) {
		const headers = data.metricHeaders;
		const firstRow = data.rows[0];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		headers.forEach((header: any, index: number) => {
			if (header.name) {
				formattedMetrics[header.name] =
					firstRow?.metricValues?.[index]?.value || null;
			}
		});
	}
	return formattedMetrics;
}
