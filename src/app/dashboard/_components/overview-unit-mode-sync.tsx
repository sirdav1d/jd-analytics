import { DashboardOverviewModeSync } from '@/providers/dashboard-overview-provider';
import { getOrganizationSeries } from './organization-series';

export default async function OverviewUnitModeSync({
	data,
}: {
	data: Promise<unknown>;
}) {
	const response = await data;

	return (
		<DashboardOverviewModeSync
			hasMultipleOrganizations={getOrganizationSeries(response).length > 1}
		/>
	);
}
