export type LinxErrorCategory =
  | "auth"
  | "permission"
  | "transient"
  | "contract"
  | "data"
  | "response"
  | "deadline";

export const LINX_TRANSACTION_TIMEOUT_MESSAGE =
  "A gravação excedeu o tempo disponível. Gere um novo preview e tente novamente.";
export const LINX_SYNC_FAILURE_MESSAGE =
  "Não foi possível concluir a sincronização Linx.";

const MAX_PUBLIC_MESSAGE_LENGTH = 2_000;
const SAFE_PERSISTED_LINX_MESSAGES = new Set([
  "Falha de autenticação na Linx",
  "Acesso não permitido pela Linx",
  "Serviço Linx temporariamente indisponível",
  "Resposta XML inválida da Linx",
  "Dados Linx inválidos",
  "A Linx recusou a solicitação",
  "A execução Linx excedeu o prazo ou foi cancelada",
  "A paginação recebeu um timestamp inválido",
  "A paginação não avançou o timestamp",
  "Execução encerrada: lease expirado",
  "Faça a conciliação inicial antes da sincronização incremental.",
  "Autorização de preview inválida ou expirada",
]);

function rawErrorMessage(error: unknown): string | null {
  const message = error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : null;
  if (!message) return null;

  const normalized = message.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  return normalized || null;
}

function containsCredential(message: string): boolean {
  return /<[^>]*>|\b(?:authorization|proxy-authorization|headers?|cookie|set-cookie|x-api-key|api[-_ ]?key|token|senha|password|chave|bearer)\b/i.test(
    message,
  );
}

function isClosedPrismaTransaction(message: string): boolean {
  return /\b(?:invalid\s+tx\.[\w.]+\(\)\s+invocation|transaction\s+api\s+error|transaction\s+(?:not\s+found|(?:is\s+)?(?:already\s+)?closed|expired)|old\s+transaction|p2028)\b/i.test(
    message,
  );
}

function containsInternalDiagnostic(message: string): boolean {
  return /\bprisma\b|\binvalid\s+.+\s+invocation\b|\bstack(?:\s+trace)?\b|(?:^|\s)(?:\/home\/|\/app\/|\/var\/|\/usr\/|[a-z]:\\\\)|\/\.next\/|\bnode_modules\b/i.test(
    message,
  );
}

/** Converts operational failures into messages that are safe to persist and show. */
export function publicLinxFailureMessage(error: unknown): string {
  const message = rawErrorMessage(error);
  if (!message || containsCredential(message)) return LINX_SYNC_FAILURE_MESSAGE;
  if (isClosedPrismaTransaction(message)) return LINX_TRANSACTION_TIMEOUT_MESSAGE;
  if (containsInternalDiagnostic(message)) return LINX_SYNC_FAILURE_MESSAGE;
  if (SAFE_PERSISTED_LINX_MESSAGES.has(message)) {
    return message.slice(0, MAX_PUBLIC_MESSAGE_LENGTH);
  }
  return LINX_SYNC_FAILURE_MESSAGE;
}

export class LinxError extends Error {
  readonly category: LinxErrorCategory;
  readonly retryable: boolean;

  constructor(
    name: string,
    category: LinxErrorCategory,
    retryable: boolean,
    message: string,
  ) {
    super(message);
    this.name = name;
    this.category = category;
    this.retryable = retryable;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class LinxAuthError extends LinxError {
  constructor() {
    super("LinxAuthError", "auth", false, "Falha de autenticação na Linx");
  }
}

export class LinxPermissionError extends LinxError {
  constructor() {
    super("LinxPermissionError", "permission", false, "Acesso não permitido pela Linx");
  }
}

export class LinxTransientError extends LinxError {
  constructor() {
    super("LinxTransientError", "transient", true, "Serviço Linx temporariamente indisponível");
  }
}

export class LinxContractError extends LinxError {
  constructor(message = "Resposta XML inválida da Linx") {
    super("LinxContractError", "contract", false, message);
  }
}

export class LinxDataError extends LinxError {
  constructor() {
    super("LinxDataError", "data", false, "Dados Linx inválidos");
  }
}

export class LinxResponseError extends LinxError {
  constructor() {
    super("LinxResponseError", "response", false, "A Linx recusou a solicitação");
  }
}

export class LinxDeadlineError extends LinxError {
  constructor(message = "A execução Linx excedeu o prazo ou foi cancelada") {
    super("LinxDeadlineError", "deadline", false, message);
  }
}
