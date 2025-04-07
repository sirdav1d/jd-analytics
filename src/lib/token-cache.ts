/** @format */

// lib/token-cache.ts

type TokenCache = {
	accessToken: string;
	expiresAt: number; // timestamp em milissegundos
} | null;

let tokenCache: TokenCache = null;

export function getCachedAccessToken(): string | null {
	if (!tokenCache) return null;

	const now = Date.now();
	if (now >= tokenCache.expiresAt) {
		tokenCache = null;
		return null;
	}

	return tokenCache.accessToken;
}

export function setCachedAccessToken(token: string, expiresIn: number) {
	tokenCache = {
		accessToken: token,
		expiresAt: Date.now() + expiresIn * 1000, // expiresIn é em segundos
	};
}
