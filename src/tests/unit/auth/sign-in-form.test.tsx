// @vitest-environment jsdom

import { StrictMode } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SignInForm } from "@/app/(public)/(auth)/sign-in/_components/sign-in-form";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("SignInForm", () => {
  it("uses POST when the browser submits before hydration", () => {
    render(<SignInForm callbackUrl="/dashboard" />);

    const form = screen.getByRole("button", { name: "Entrar" }).closest("form");

    expect(form?.method).toBe("post");
  });

  it("validates on submit without updating the form during Controller render", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <StrictMode>
        <SignInForm callbackUrl="/dashboard" />
      </StrictMode>,
    );

    const submit = screen.getByRole("button", { name: "Entrar" });

    expect(submit.hasAttribute("disabled")).toBe(false);

    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText("Digite um e-mail válido")).toBeTruthy();
      expect(screen.getByText("A senha deve conter no mínimo 6 dígitos"))
        .toBeTruthy();
    });

    await waitFor(() => {
      const messages = consoleError.mock.calls.flat().map(String).join("\n");

      expect(messages).not.toContain("Cannot update a component");
    });
  });
});
