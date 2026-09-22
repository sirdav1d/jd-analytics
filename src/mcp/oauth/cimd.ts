import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';
import { request as httpsRequest } from 'node:https';
import { OAuthError, assertOAuthAdmission } from '@/mcp/oauth/protocol';

const MAX_DOCUMENT_BYTES = 64 * 1_024;
const TOTAL_TIMEOUT_MS = 3_000;
let activeFetches = 0;

const blockedIpv4 = new BlockList();
for (const [network, prefix] of [
	['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8],
	['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24],
	['192.88.99.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15], ['198.51.100.0', 24],
	['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4],
] as const) blockedIpv4.addSubnet(network, prefix, 'ipv4');

const blockedIpv6 = new BlockList();
for (const [network, prefix] of [
	['2001::', 23], ['2001:db8::', 32], ['2002::', 16], ['3fff::', 20], ['64:ff9b::', 96],
] as const) blockedIpv6.addSubnet(network, prefix, 'ipv6');

function invalidClient(message: string): OAuthError {
	return new OAuthError('invalid_client', 400, message);
}

function validateClientId(clientId: string) {
	if (!clientId.startsWith('https://') || /[\u0000-\u001F\\#]/u.test(clientId)) throw invalidClient('Client ID inválido.');
	if (/%(?:2e|2f|5c)/iu.test(clientId)) throw invalidClient('Client ID inválido.');
	const rawPath = clientId.slice(clientId.indexOf('/', 'https://'.length));
	if (rawPath.split(/[?#]/u, 1)[0].split('/').some((segment) => segment === '.' || segment === '..')) throw invalidClient('Client ID inválido.');

	let url: URL;
	try {
		url = new URL(clientId);
	} catch {
		throw invalidClient('Client ID inválido.');
	}
	if (url.username || url.password || url.hash || url.protocol !== 'https:' || !url.pathname || url.pathname === '/') throw invalidClient('Client ID inválido.');
	if (url.pathname.split('/').some((segment) => segment === '.' || segment === '..')) throw invalidClient('Client ID inválido.');

	return url;
}

function isPublicAddress(address: string, family: number) {
	if (family === 4) return !blockedIpv4.check(address, 'ipv4');
	if (family !== 6 || address.toLowerCase().startsWith('::ffff:')) return false;
	if (blockedIpv6.check(address, 'ipv6')) return false;

	return new BlockList().check(address, 'ipv6') || address.startsWith('2') || address.startsWith('3');
}

function parseFreshness(headers: Headers, elapsedSeconds: number) {
	const cacheControl = headers.get('cache-control')?.toLowerCase() ?? '';
	if (/(?:^|,)\s*(?:no-store|no-cache)(?:\s*=|\s*(?:,|$))/u.test(cacheControl)) return 0;
	const maxAge = cacheControl.match(/(?:^|,)\s*max-age=(\d+)/u)?.[1];
	if (!maxAge) return 0;
	const age = Number(headers.get('age') ?? '0');
	if (!Number.isFinite(age) || age < 0) return 0;

	return Math.min(3_600, Math.max(0, Number(maxAge) - age - elapsedSeconds));
}

async function resolvePublicAddress(url: URL) {
	const addresses = await lookup(url.hostname, { all: true, verbatim: true });
	if (!addresses.length || addresses.some(({ address, family }) => !isPublicAddress(address, family))) throw invalidClient('Destino CIMD não é público.');

	return addresses[0];
}

function readDocument(url: URL, address: { address: string; family: number }, timeoutMs: number) {
	return new Promise<{ body: string; headers: Headers }>((resolve, reject) => {
		const startedAt = Date.now();
		const request = httpsRequest({
			hostname: url.hostname,
			port: url.port || 443,
			path: `${url.pathname}${url.search}`,
			method: 'GET',
			servername: url.hostname,
			agent: false,
			lookup: (_hostname, options, callback) => {
				if (options.all) {
					callback(null, [address]);
					return;
				}
				callback(null, address.address, address.family);
			},
		}, (response) => {
			if (response.statusCode !== 200) {
				response.resume();
				reject(invalidClient('Documento CIMD indisponível.'));
				return;
			}
			const encoding = response.headers['content-encoding'];
			if (encoding && encoding !== 'identity') {
				response.resume();
				reject(invalidClient('Compressão CIMD não suportada.'));
				return;
			}
			if (!response.headers['content-type']?.toLowerCase().startsWith('application/json')) {
				response.resume();
				reject(invalidClient('MIME CIMD inválido.'));
				return;
			}

			const chunks: Buffer[] = [];
			let size = 0;
			response.on('data', (chunk: Buffer) => {
				size += chunk.byteLength;
				if (size > MAX_DOCUMENT_BYTES) {
					request.destroy();
					reject(invalidClient('Documento CIMD excedeu o limite.'));
					return;
				}
				chunks.push(chunk);
			});
			response.on('end', () => {
				clearTimeout(timer);
				resolve({ body: Buffer.concat(chunks).toString('utf8'), headers: new Headers({
					'cache-control': response.headers['cache-control'] ?? '',
					age: response.headers.age ?? '',
					'content-type': response.headers['content-type'] ?? '',
					'x-elapsed-seconds': String((Date.now() - startedAt) / 1_000),
				}) });
			});
			response.on('error', reject);
		});
		const timer = setTimeout(() => request.destroy(new Error('CIMD timeout')), timeoutMs);
		request.on('close', () => clearTimeout(timer));
		request.on('error', reject);
		request.end();
	});
}

async function resolveAddressWithTimeout(url: URL) {
	let timer: NodeJS.Timeout | undefined;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(invalidClient('Timeout de CIMD.')), TOTAL_TIMEOUT_MS);
	});

	try {
		return await Promise.race([resolvePublicAddress(url), timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}

export async function fetchCimdMetadata(clientId: string) {
	const url = validateClientId(clientId);
	if (activeFetches >= 4) throw new OAuthError('invalid_client', 503, 'Limite de consultas CIMD excedido.');
	assertOAuthAdmission('cimd');
	activeFetches += 1;
	const startedAt = Date.now();

	try {
		const address = await resolveAddressWithTimeout(url);
		const remainingMs = TOTAL_TIMEOUT_MS - (Date.now() - startedAt);
		if (remainingMs <= 0) throw invalidClient('Timeout de CIMD.');
		const result = await readDocument(url, address, remainingMs);
		let metadata: unknown;
		try {
			metadata = JSON.parse(result.body);
		} catch {
			throw invalidClient('Documento CIMD inválido.');
		}

		return {
			metadata,
			cacheTtlSeconds: parseFreshness(result.headers, (Date.now() - startedAt) / 1_000),
		};
	} catch (error) {
		if (error instanceof OAuthError) throw error;
		throw invalidClient('Documento CIMD indisponível.');
	} finally {
		activeFetches -= 1;
	}
}

export function isCimdPublicAddress(address: string, family = isIP(address)) {
	return family > 0 && isPublicAddress(address, family);
}
