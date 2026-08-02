import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const GOOGLE_OAUTH_COOKIE = "google-oauth";
export const GOOGLE_OAUTH_MAX_AGE_SECONDS = 10 * 60;

export type GoogleOAuthRequest = {
	state: string;
	codeVerifier: string;
	codeChallenge: string;
};

export function createGoogleOAuthRequest(): GoogleOAuthRequest {
	const state = randomBytes(32).toString("base64url");
	const codeVerifier = randomBytes(32).toString("base64url");
	const codeChallenge = createHash("sha256")
		.update(codeVerifier)
		.digest("base64url");

	return { state, codeVerifier, codeChallenge };
}

export function encodeGoogleOAuthRequest(request: GoogleOAuthRequest) {
	return Buffer.from(JSON.stringify(request)).toString("base64url");
}

export function decodeGoogleOAuthRequest(value: string | undefined) {
	if (!value) return null;

	try {
		const parsed = JSON.parse(
			Buffer.from(value, "base64url").toString("utf8"),
		) as Partial<GoogleOAuthRequest>;
		if (
			typeof parsed.state !== "string" ||
			typeof parsed.codeVerifier !== "string" ||
			typeof parsed.codeChallenge !== "string"
		) {
			return null;
		}
		return parsed as GoogleOAuthRequest;
	} catch {
		return null;
	}
}

export function matchesGoogleOAuthState(expected: string, received: string) {
	const expectedBuffer = Buffer.from(expected);
	const receivedBuffer = Buffer.from(received);
	if (expectedBuffer.length !== receivedBuffer.length) return false;
	return timingSafeEqual(expectedBuffer, receivedBuffer);
}
