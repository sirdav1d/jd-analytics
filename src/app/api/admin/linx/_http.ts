import { AuthorizationError } from "@/lib/authorization";

export function authorizationResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return Response.json(
      { error: error.message },
      { status: error.status },
    );
  }
  return Response.json(
    { error: "Erro interno na integração Linx." },
    { status: 500 },
  );
}

export function invalidBodyResponse() {
  return Response.json(
    { error: "Dados inválidos." },
    { status: 400 },
  );
}

export function serializeRunningRun(run: {
  id: string;
  organizationId: string;
  status: string;
  mode: string;
  stage: string | null;
  startedAt: Date;
}) {
  return {
    id: run.id,
    organizationId: run.organizationId,
    status: run.status,
    mode: run.mode,
    stage: run.stage,
    startedAt: run.startedAt.toISOString(),
  };
}

export function runningResponse(run: {
  id: string;
  organizationId: string;
  status: string;
  mode: string;
  stage: string | null;
  startedAt: Date;
}) {
  return Response.json(
    {
      error: "Já existe uma sincronização Linx em andamento",
      run: serializeRunningRun(run),
    },
    { status: 409 },
  );
}
