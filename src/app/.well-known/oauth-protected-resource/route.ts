import { getResourceMetadata, oauthMetadataResponse } from '@/mcp/oauth/protocol';

export function GET() {
	return oauthMetadataResponse(getResourceMetadata());
}
