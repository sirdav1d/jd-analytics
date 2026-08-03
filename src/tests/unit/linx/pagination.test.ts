import { describe, expect, it, vi } from "vitest";
import { LinxContractError } from "@/services/linx/errors";
import { fetchTimestampPages } from "@/services/linx/pagination";

describe("fetchTimestampPages", () => {
  it("keeps fetching from the maximum rowversion and returns the final cursor", async () => {
    const execute = vi.fn()
      .mockResolvedValueOnce({ rows: [{ timestamp: "101" }, { timestamp: "105" }] })
      .mockResolvedValueOnce({ rows: [{ timestamp: "108" }] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await fetchTimestampPages({
      initialTimestamp: BigInt(100),
      executePage: (timestamp) => execute(timestamp),
    });

    expect(execute.mock.calls.map(([value]) => value)).toEqual([BigInt(100), BigInt(105), BigInt(108)]);
    expect(result.rows).toHaveLength(3);
    expect(result.nextTimestamp).toBe(BigInt(108));
  });

  it("rejects a non-advancing page", async () => {
    await expect(fetchTimestampPages({
      initialTimestamp: BigInt(100),
      executePage: async () => ({ rows: [{ timestamp: "100" }] }),
    })).rejects.toEqual(expect.objectContaining({
      name: "LinxContractError",
      message: "A paginação não avançou o timestamp",
    } satisfies Partial<LinxContractError>));
  });
});
