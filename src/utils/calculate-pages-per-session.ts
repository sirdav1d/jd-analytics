/** @format */

export function calculatePagesPerSession(
	sessions: number,
	screenPageViews: number,
): number {
	return screenPageViews / sessions;
}
