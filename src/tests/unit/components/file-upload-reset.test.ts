import { describe, expect, it, vi } from "vitest";
import { clearFileSelection } from "@/components/file-upload-reset";

describe("clearFileSelection", () => {
  it("clears the native input and notifies the consumer with no files", () => {
    const input = { value: "C:\\fakepath\\orders.csv" };
    const onChange = vi.fn();

    clearFileSelection(input, onChange);

    expect(input.value).toBe("");
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
