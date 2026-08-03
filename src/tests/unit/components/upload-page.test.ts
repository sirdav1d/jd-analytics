import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import UploadPage from "@/app/dashboard/upload/page";

vi.mock("@/components/upload-form", () => ({
  default: ({ typeDoc }: { typeDoc: string }) =>
    createElement("span", null, `upload-${typeDoc}`),
}));

describe("UploadPage", () => {
  it("keeps both manual uploads and removes the completed Linx onboarding", () => {
    const markup = renderToStaticMarkup(createElement(UploadPage));
    expect(markup).toContain("upload-Pedidos");
    expect(markup).toContain("upload-Origem");
    expect(markup).not.toContain("Validar e descobrir");
    expect(markup).not.toContain("Gerar preview");
    expect(markup).not.toContain("Confirmar conciliação");
    expect(markup).not.toContain("Sincronizar agora");
  });
});
