import { getOAuthMetadata, oauthMetadataResponse } from '@/mcp/oauth/protocol';

export function GET() {
	return oauthMetadataResponse(getOAuthMetadata());
}
