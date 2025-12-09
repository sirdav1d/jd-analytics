/** @format */

export type GoogleAdsScope = 'products' | 'services';

function normalizeScope(scope?: string | null): GoogleAdsScope {
	return scope === 'services' ? 'services' : 'products';
}

export function resolveGoogleAdsAccount(scope?: string | null) {
	const normalizedScope = normalizeScope(scope);

	const customerId =
		normalizedScope === 'services'
			? process.env.GOOGLE_CUSTOMER_ID_SERVICES
			: process.env.GOOGLE_CUSTOMER_ID_PRODUCTS;

	const managerId =
		normalizedScope === 'services'
			? process.env.GOOGLE_MANAGER_ID_SERVICES
			: process.env.GOOGLE_MANAGER_ID_PRODUCTS;

	if (!customerId) {
		throw new Error(
			`GOOGLE_CUSTOMER_ID_${normalizedScope.toUpperCase()} nǜo configurado`,
		);
	}

	return {
		scope: normalizedScope,
		customerId,
		managerId: managerId ?? undefined,
	};
}
