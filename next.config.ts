/** @format */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	allowedDevOrigins: ['anitra-unincreasing-estimatingly.ngrok-free.dev'],
	async headers() {
		return [
			{
				source: '/mcp/authorize',
				headers: [
					{ key: 'Referrer-Policy', value: 'no-referrer' },
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
				],
			},
		];
	},
};

export default nextConfig;
