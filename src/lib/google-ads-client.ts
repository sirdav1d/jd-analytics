/** @format */

import { GoogleAdsApi } from 'google-ads-api';

export const client = new GoogleAdsApi({
	client_id: process.env.GOOGLE_CLIENT_ID!,
	client_secret: process.env.GOOGLE_CLIENT_SECRET!,
	developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
});
