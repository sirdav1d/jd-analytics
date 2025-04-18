/** @format */

// lib/token-cache.ts

type TokenCache = {
	accessToken: string;
	refreshToken: string;
	expiresAt: number; // timestamp em milissegundos
} | null;

let tokenCache: TokenCache = null;

export function getCachedAccessToken(): string | null {
	if (!tokenCache) return null;
	const now = Date.now();
	if (now >= tokenCache.expiresAt) {
		// Token expirou, limpa cache
		tokenCache = null;
		return null;
	}
	return tokenCache.accessToken;
}

export function getCachedRefreshToken(): string | null {
	if (!tokenCache) return null;
	// Aqui assumimos que o refresh token não expira no mesmo ciclo; caso precise, adicione validação
	return tokenCache.refreshToken;
}

export function setCachedTokens(
	accessToken: string,
	refreshToken: string,
	expiresIn: number,
) {
	tokenCache = {
		accessToken,
		refreshToken,
		expiresAt: Date.now() + expiresIn * 1000, // converte segundos para ms
	};
}
