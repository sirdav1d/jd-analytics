/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatMetricsTraffic(data: any) {
	const userByChannel: Record<string, number> = {};

	if (data?.metricHeaders && data?.rows && data.rows.length > 0) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data.rows.forEach((row: any) => {
			const channel = row.dimensionValues?.[0]?.value || 'Desconhecido';
			const totalUsers = parseInt(row.metricValues?.[0]?.value || '0', 10);
			if (!(channel in userByChannel)) {
				userByChannel[channel] = 0;
			}

			userByChannel[channel] += totalUsers;
		});
	}
	return userByChannel;
}
