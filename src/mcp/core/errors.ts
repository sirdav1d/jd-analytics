import { ZodError } from "zod";

export type McpErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "INVALID_ARGUMENT"
  | "RATE_LIMITED"
  | "QUERY_TIMEOUT"
  | "UPSTREAM_UNAVAILABLE"
  | "INTERNAL_ERROR";

const PUBLIC_MESSAGES: Record<McpErrorCode, string> = {
  UNAUTHENTICATED: "Autenticação MCP inválida ou ausente.",
  FORBIDDEN: "Você não tem permissão para acessar o MCP.",
  INVALID_ARGUMENT: "Os parâmetros informados são inválidos.",
  RATE_LIMITED: "O limite de chamadas MCP foi atingido. Tente novamente em breve.",
  QUERY_TIMEOUT: "A consulta excedeu o tempo permitido.",
  UPSTREAM_UNAVAILABLE: "O serviço de dados externo está indisponível.",
  INTERNAL_ERROR: "Não foi possível concluir a solicitação MCP.",
};

export class McpPublicError extends Error {
  readonly code: McpErrorCode;

  constructor(code: McpErrorCode) {
    super(PUBLIC_MESSAGES[code]);
    this.code = code;
    this.name = "McpPublicError";
  }
}

export class McpUpstreamError extends Error {
  constructor(message = "upstream unavailable") {
    super(message);
    this.name = "McpUpstreamError";
  }
}

function hasCode(error: unknown, code: string) {
  if (!error || typeof error !== "object") return false;

  const candidate = error as { code?: unknown };

  return candidate.code === code;
}

function hasPrismaTimeoutCode(error: unknown) {
	if (!error || typeof error !== 'object') return false;
	const candidate = error as { code?: unknown; meta?: unknown };
	if (candidate.code !== 'P2010') return false;
  const metadata = candidate.meta;

  if (!metadata || typeof metadata !== "object") return false;

  return (metadata as { code?: unknown }).code === "57014";
}

export function toPublicError(error: unknown) {
  if (error instanceof McpPublicError) return error;

  if (error instanceof ZodError) return new McpPublicError("INVALID_ARGUMENT");

  if (hasCode(error, "57014")) return new McpPublicError("QUERY_TIMEOUT");

  if (hasPrismaTimeoutCode(error)) return new McpPublicError("QUERY_TIMEOUT");

  if (error instanceof McpUpstreamError) {
    return new McpPublicError("UPSTREAM_UNAVAILABLE");
  }

  return new McpPublicError("INTERNAL_ERROR");
}
