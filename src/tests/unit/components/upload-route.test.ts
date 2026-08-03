import { describe, expect, it } from "vitest";
import { getUploadError, getUploadRoute } from "@/components/upload-route";

describe("getUploadRoute", () => {
  it("uses same-origin API paths for both manual upload kinds", () => {
    expect(getUploadRoute("Pedidos")).toBe("/api/upload");
    expect(getUploadRoute("Origem")).toBe("/api/upload-origin");
  });

  it("preserves an authorization error returned by the same-origin upload", () => {
    expect(getUploadError(false, { error: "Não autenticado" })).toBe("Não autenticado");
  });
});
