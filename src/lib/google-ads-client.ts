/** @format */

import { GoogleAdsApi } from 'google-ads-api';
import { refreshAccessToken } from './refresh-token';

const client = new GoogleAdsApi({
	developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
	client_id: process.env.GOOGLE_CLIENT_ID!,
	client_secret: process.env.GOOGLE_CLIENT_SECRET!,
});

export const createGoogleAdsCustomer = async () => {
	const { refreshToken, success, error } = await refreshAccessToken();

	if (!success || !refreshToken) {
		console.log(error);
		throw new Error('Falha ao obter refresh token: ' + error);
	}

	const customer = client.Customer({
		customer_id: '2971952651', // ID do cliente
		refresh_token: refreshToken, // O refresh token
		login_customer_id: '8251122454',
	});

	return customer;
};
