export function requireTestDatabaseUrl() {
  const testUrl = process.env.TEST_DATABASE_URL;

  if (!testUrl) {
    throw new Error("TEST_DATABASE_URL é obrigatório");
  }

  const testDatabase = parsePostgresDatabaseUrl(testUrl, "TEST_DATABASE_URL");

  if (!isExplicitTestDatabaseName(testDatabase.name)) {
    throw new Error(
      "TEST_DATABASE_URL deve identificar explicitamente um banco de teste",
    );
  }

  const applicationUrl = process.env.DATABASE_URL;
  if (
    applicationUrl &&
    isSameDatabaseTarget(
      testDatabase,
      parsePostgresDatabaseUrl(applicationUrl, "DATABASE_URL"),
    )
  ) {
    throw new Error("TEST_DATABASE_URL deve ser diferente de DATABASE_URL");
  }

  return testUrl;
}

type PostgresDatabaseUrl = {
  hostname: string;
  name: string;
  port: string;
};

function parsePostgresDatabaseUrl(
  value: string,
  variableName: "DATABASE_URL" | "TEST_DATABASE_URL",
): PostgresDatabaseUrl {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variableName} deve ser uma URL PostgreSQL válida`);
  }

  if (
    (url.protocol !== "postgres:" && url.protocol !== "postgresql:") ||
    !url.hostname
  ) {
    throw new Error(`${variableName} deve ser uma URL PostgreSQL válida`);
  }

  let databaseName: string;

  try {
    databaseName = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  } catch {
    throw new Error(`${variableName} deve ser uma URL PostgreSQL válida`);
  }

  if (!databaseName || databaseName.includes("/")) {
    throw new Error(
      `${variableName} deve incluir o nome do banco de teste`,
    );
  }

  return {
    hostname: url.hostname.toLowerCase(),
    name: databaseName,
    port: url.port || "5432",
  };
}

function isExplicitTestDatabaseName(databaseName: string) {
  return (
    databaseName.toLowerCase() === "test" ||
    databaseName.toLowerCase().startsWith("test_") ||
    databaseName.toLowerCase().endsWith("_test")
  );
}

function isSameDatabaseTarget(
  left: PostgresDatabaseUrl,
  right: PostgresDatabaseUrl,
) {
  return (
    left.hostname === right.hostname &&
    left.port === right.port &&
    left.name === right.name
  );
}
