/** @format */

export function calculatePagesPerSession(
	sessions: number,
	screenPageViews: number,
) {
	const resp = screenPageViews / sessions;
	return resp;
}
