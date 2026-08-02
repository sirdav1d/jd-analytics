/** @format */

type AnalyticsChannelRow = {
	dimensionValues?: Array<{ value?: string | null }> | null;
	metricValues?: Array<{ value?: string | null }> | null;
};

type AnalyticsChannelReport = {
	rows?: AnalyticsChannelRow[] | null;
};

export function formatMetricsChannel(
	data: AnalyticsChannelReport | null | undefined,
) {
	const trafficByChannel: Record<
		string,
		{ conversions: number; sessions: number }
	> = {};
	for (const row of data?.rows ?? []) {
		const channel = row.dimensionValues?.[0]?.value || 'Desconhecido';
		const conversions = Number(row.metricValues?.[0]?.value) || 0;
		const sessions = Number(row.metricValues?.[1]?.value) || 0;

		// Se o canal estiver nas categorias predefinidas, soma os valores, senão joga em "Other"
		if (!(channel in trafficByChannel)) {
			trafficByChannel[channel] = { conversions: 0, sessions: 0 };
		}

		trafficByChannel[channel].conversions += conversions;
		trafficByChannel[channel].sessions += sessions;
	}
	return trafficByChannel;
}
