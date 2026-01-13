/** @format */

export interface MetaInvestment {
	id: string;
	periodStart: string;
	periodEnd: string;
	totalInvestment: number;
	lastSyncAt: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface MetaInvestmentUpsertInput {
	periodEnd: string | Date;
	totalInvestment: number;
}

interface ApiResponse<T> {
	ok: boolean;
	data: T;
	error: string | null;
}

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL ?? '';

export async function upsertMetaInvestment(
	input: MetaInvestmentUpsertInput,
): Promise<ApiResponse<MetaInvestment | null>> {
	const res = await fetch(`${getBaseUrl()}/api/services/meta-investments`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(input),
	});

	const payload = (await res.json()) as ApiResponse<MetaInvestment | null>;

	if (!res.ok) {
		return {
			ok: false,
			data: null,
			error: payload?.error ?? 'Failed to save meta investment',
		};
	}

	return payload;
}
