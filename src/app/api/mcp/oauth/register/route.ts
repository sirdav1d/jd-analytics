import { registerPublicClient } from '@/mcp/oauth/clients';
import { assertOAuthRequestOrigin, oauthErrorResponse, oauthJson, readOAuthBody } from '@/mcp/oauth/protocol';

export async function POST(request: Request) {
	try {
		assertOAuthRequestOrigin(request);
		const input = await readOAuthBody(request, 'json');
		return oauthJson(await registerPublicClient(input), 201);
	} catch (error) {
		return oauthErrorResponse(error);
	}
}
