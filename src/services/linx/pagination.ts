import { LinxContractError } from "./errors";
import type { LinxResponseRow } from "./types";

export async function fetchTimestampPages<T extends LinxResponseRow = LinxResponseRow>(input: {
  initialTimestamp: bigint;
  executePage: (timestamp: bigint) => Promise<{ rows: T[] }>;
}): Promise<{ rows: T[]; nextTimestamp: bigint }> {
  let currentTimestamp = input.initialTimestamp;
  const rows: T[] = [];

  while (true) {
    const page = await input.executePage(currentTimestamp);
    if (page.rows.length === 0) return { rows, nextTimestamp: currentTimestamp };

    let nextTimestamp = currentTimestamp;
    for (const row of page.rows) {
      const timestamp = row.timestamp;
      if (typeof timestamp !== "string" || !/^\d+$/.test(timestamp)) {
        throw new LinxContractError("A paginação recebeu um timestamp inválido");
      }
      const value = BigInt(timestamp);
      if (value > nextTimestamp) nextTimestamp = value;
    }
    if (nextTimestamp <= currentTimestamp) {
      throw new LinxContractError("A paginação não avançou o timestamp");
    }
    rows.push(...page.rows);
    currentTimestamp = nextTimestamp;
  }
}
