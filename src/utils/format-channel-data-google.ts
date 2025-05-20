/** @format */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatMetricsChannel(data: any) {
	const trafficByChannel: Record<
		string,
		{ conversions: number; sessions: number }
	> = {};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data.rows.forEach((row: any) => {
		const channel = row.dimensionValues?.[0]?.value || 'Desconhecido';
		const conversions = Number(row.metricValues?.[0]?.value) || 0;
		const sessions = Number(row.metricValues?.[1]?.value) || 0;

		// Se o canal estiver nas categorias predefinidas, soma os valores, senão joga em "Other"
		if (!(channel in trafficByChannel)) {
			trafficByChannel[channel] = { conversions: 0, sessions: 0 };
		}

		trafficByChannel[channel].conversions += conversions;
		trafficByChannel[channel].sessions += sessions;
	});
	return trafficByChannel;
}
