/** @format */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatMetricsChannel(data: any) {
	const trafficByChannel: {
		[key: string]: { conversions: number; sessions: number };
	} = {
		'Organic Search': { conversions: 0, sessions: 0 },
		'Paid Search': { conversions: 0, sessions: 0 },
		Direct: { conversions: 0, sessions: 0 },
		Social: { conversions: 0, sessions: 0 },
		Other: { conversions: 0, sessions: 0 }, // Acumula as demais origens
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data.rows.forEach((row: any) => {
		const channel = row.dimensionValues?.[0]?.value || 'Other';
		const conversions = Number(row.metricValues?.[0]?.value) || 0;
		const sessions = Number(row.metricValues?.[1]?.value) || 0;

		// Se o canal estiver nas categorias predefinidas, soma os valores, senão joga em "Other"
		if (trafficByChannel[channel]) {
			trafficByChannel[channel].conversions += conversions;
			trafficByChannel[channel].sessions += sessions;
		} else {
			trafficByChannel['Other'].conversions += conversions;
			trafficByChannel['Other'].sessions += sessions;
		}
	});
	return trafficByChannel;
}
