import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LinxAuthError, LinxContractError } from "@/services/linx/errors";
import { buildLinxRequest, parseLinxResponse } from "@/services/linx/xml";

const fixture = (name: string) =>
  readFileSync(`src/tests/fixtures/linx/${name}`, "utf8");

describe("Linx XML", () => {
  it("escapes credentials, parameter ids and parameter values in the request", () => {
    const xml = buildLinxRequest({
      user: "linx_export",
      password: `a&b"c'd>e`,
      command: "Linx<Movimento>",
      parameters: { 'chave"<&': "x<y&z", timestamp: BigInt(0) },
    });

    expect(xml).toContain('password="a&amp;b&quot;c&apos;d&gt;e"');
    expect(xml).toContain('id="chave&quot;&lt;&amp;"');
    expect(xml).toContain("x&lt;y&amp;z");
    expect(xml).toContain(">0</Parameter>");
  });

  it("maps columns to row values without numeric coercion and normalizes empty D to null", () => {
    const response = parseLinxResponse(fixture("success.xml"));

    expect(response.rows).toEqual([
      {
        documento: "000123",
        timestamp: "8146561524",
        descricao: "Produto &lt;teste&gt;",
        cancelado: null,
      },
    ]);
  });

  it("accepts singleton column values and a response with no rows", () => {
    expect(parseLinxResponse(fixture("empty.xml"))).toEqual({
      columns: ["documento"],
      rows: [],
    });
  });

  it("maps an unsuccessful authentication response to a sanitized typed error", () => {
    expect(() => parseLinxResponse(fixture("error.xml"))).toThrow(LinxAuthError);
    expect(() => parseLinxResponse(fixture("error.xml"))).toThrow(
      "Falha de autenticação na Linx",
    );
  });

  it("throws a typed contract error for mismatched columns", () => {
    expect(() => parseLinxResponse(fixture("mismatched-columns.xml"))).toThrow(
      LinxContractError,
    );
  });

  it("rejects malformed XML without reflecting its contents", () => {
    expect(() => parseLinxResponse("<Microvix><secret>nao-expor"))
      .toThrow("Resposta XML inválida da Linx");
  });
});
