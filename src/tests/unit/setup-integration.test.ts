import { afterEach, describe, expect, it, vi } from "vitest";
import { requireTestDatabaseUrl } from "@/tests/setup-integration";

describe("requireTestDatabaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects a run without an explicitly configured test database", () => {
    vi.stubEnv("TEST_DATABASE_URL", "");
    vi.stubEnv("DATABASE_URL", "");

    expect(() => requireTestDatabaseUrl()).toThrow(
      "TEST_DATABASE_URL é obrigatório",
    );
  });

  it("rejects a test URL that is the configured application database", () => {
    const applicationUrl = "postgresql://app:secret@localhost:5432/app_test";
    vi.stubEnv("DATABASE_URL", applicationUrl);
    vi.stubEnv("TEST_DATABASE_URL", applicationUrl);

    expect(() => requireTestDatabaseUrl()).toThrow(
      "TEST_DATABASE_URL deve ser diferente de DATABASE_URL",
    );
  });

  it("rejects a URL that does not explicitly identify a test database", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://app@localhost:5432/app");
    vi.stubEnv("TEST_DATABASE_URL", "postgresql://test@localhost:5432/app");

    expect(() => requireTestDatabaseUrl()).toThrow(
      "TEST_DATABASE_URL deve identificar explicitamente um banco de teste",
    );
  });

  it.each([
    ["an invalid URL", "not a database URL"],
    ["a non-PostgreSQL URL", "mysql://test@localhost:3306/linx_test"],
    ["a PostgreSQL URL without a host", "postgresql:linx_test"],
  ])("rejects %s", (_reason, testUrl) => {
    vi.stubEnv("DATABASE_URL", "postgresql://app@localhost:5432/app");
    vi.stubEnv("TEST_DATABASE_URL", testUrl);

    expect(() => requireTestDatabaseUrl()).toThrow(
      "TEST_DATABASE_URL deve ser uma URL PostgreSQL válida",
    );
  });

  it("rejects a PostgreSQL URL without a database pathname", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://app@localhost:5432/app");
    vi.stubEnv("TEST_DATABASE_URL", "postgresql://test_user@localhost:5432");

    expect(() => requireTestDatabaseUrl()).toThrow(
      "TEST_DATABASE_URL deve incluir o nome do banco de teste",
    );
  });

  it.each([
    ["username", "postgresql://test_user@localhost:5432/production"],
    [
      "password",
      "postgresql://user:test_password@localhost:5432/production",
    ],
    ["host", "postgresql://user@tests.example.com:5432/production"],
    [
      "query string",
      "postgresql://user@localhost:5432/production?application_name=test_runner",
    ],
  ])("rejects a test marker found only in the %s", (_location, testUrl) => {
    vi.stubEnv("DATABASE_URL", "postgresql://app@localhost:5432/app");
    vi.stubEnv("TEST_DATABASE_URL", testUrl);

    expect(() => requireTestDatabaseUrl()).toThrow(
      "TEST_DATABASE_URL deve identificar explicitamente um banco de teste",
    );
  });

  it("rejects the same database target after URL normalization", () => {
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://app@LOCALHOST:5432/linx%5Ftest?sslmode=require",
    );
    vi.stubEnv("TEST_DATABASE_URL", "postgres://test@localhost/linx_test");

    expect(() => requireTestDatabaseUrl()).toThrow(
      "TEST_DATABASE_URL deve ser diferente de DATABASE_URL",
    );
  });

  it("returns an explicitly named test database URL", () => {
    const testUrl = "postgres://test@localhost:5432/linx%5Ftest";
    vi.stubEnv("DATABASE_URL", "postgresql://app@localhost:5432/app");
    vi.stubEnv("TEST_DATABASE_URL", testUrl);

    expect(requireTestDatabaseUrl()).toBe(testUrl);
  });
});
