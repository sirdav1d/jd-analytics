/** @format */

export async function getAnalyticsData(startDate: string, endDate: string) {
	const res = await fetch(
		`http://localhost:3000/api/g-analytics?startDate=${encodeURIComponent(
			startDate,
		)}&endDate=${encodeURIComponent(endDate)}`,
	);
	const data = await res.json();
	return { data: data };
}
