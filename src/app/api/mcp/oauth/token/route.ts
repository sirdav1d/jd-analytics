import { exchangeToken } from '@/mcp/oauth/tokens';
import { assertOAuthAdmission, assertOAuthRequestOrigin, oauthErrorResponse, oauthJson, readOAuthBody } from '@/mcp/oauth/protocol';

export async function POST(request: Request) {
	try {
		assertOAuthRequestOrigin(request);
		assertOAuthAdmission('token');
		const form = await readOAuthBody(request, 'form') as URLSearchParams;
		return oauthJson(await exchangeToken(form));
	} catch (error) {
		return oauthErrorResponse(error);
	}
}
