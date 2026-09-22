import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function sourceFiles(directory: string): string[] {
	return readdirSync(directory).flatMap((entry) => {
		const path = join(directory, entry);

		if (statSync(path).isDirectory()) return sourceFiles(path);
		if (!path.endsWith('.ts')) return [];

		return [path];
	});
}

describe('fronteira arquitetural do MCP', () => {
	it('não contém infraestrutura nem operações de negócio próprias', () => {
		const files = sourceFiles('src/mcp');
		const oauthPersistenceFiles = files.filter((path) => /src\/mcp\/oauth\/(clients|tokens)\.ts$/u.test(path));
		const source = files.filter((path) => !oauthPersistenceFiles.includes(path)).map((path) => readFileSync(path, 'utf8')).join('\n');

		expect(source).not.toMatch(/@\/lib\/prisma|@prisma\/client/u);
		expect(source).not.toMatch(/\$queryRaw|new PrismaClient|DATABASE_URL/u);
		expect(source).not.toMatch(/google-ads-api|BetaAnalyticsDataClient/u);
		expect(source).not.toMatch(/fetch\s*\(/u);
		const forbiddenEnvironmentNames = [
			['DES' + 'COPE', ''],
			['MCP', 'DATABASE_URL'],
			['MCP', 'PUBLIC_URL'],
			['MCP', 'LOCAL_'],
		].map(([prefix, suffix]) => `${prefix}_${suffix}`);

		for (const forbiddenEnvironmentName of forbiddenEnvironmentNames) {
		expect(source).not.toContain(forbiddenEnvironmentName);
		}

		for (const path of oauthPersistenceFiles) expect(readFileSync(path, 'utf8')).toMatch(/@\/lib\/prisma|@prisma\/client/u);
	});
});
