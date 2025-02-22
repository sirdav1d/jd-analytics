/* eslint-disable @typescript-eslint/no-explicit-any */


export function formatMetricsTraffic(data: any) {
	const userByChannel: { [key: string]: number } = {
		'Organic Search': 0,
		'Paid Search': 0,
		Social: 0,
		Direct: 0,
		Other: 0,
	};

	if (data?.metricHeaders && data?.rows && data.rows.length > 0) {
		data.rows.forEach((row: any) => {
			const channel = row.dimensionValues?.[0]?.value || 'Other';
			const totalUsers = parseInt(row.metricValues?.[0]?.value || '0', 10);

			if (
				['Organic Search', 'Paid Search', 'Social', 'Direct'].includes(channel)
			) {
				userByChannel[channel] += totalUsers;
			} else {
				userByChannel['Other'] += totalUsers;
			}
		});
	}
	return userByChannel;
}
