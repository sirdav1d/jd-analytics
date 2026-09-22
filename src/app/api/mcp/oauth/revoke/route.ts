import { revokeRefreshToken } from '@/mcp/oauth/tokens';
import { assertOAuthAdmission, assertOAuthRequestOrigin, oauthErrorResponse, oauthJson, readOAuthBody } from '@/mcp/oauth/protocol';

export async function POST(request: Request) {
	try {
		assertOAuthRequestOrigin(request);
		assertOAuthAdmission('token');
		const form = await readOAuthBody(request, 'form') as URLSearchParams;
		await revokeRefreshToken(form);
		return oauthJson({}, 200);
	} catch (error) {
		return oauthErrorResponse(error);
	}
}
