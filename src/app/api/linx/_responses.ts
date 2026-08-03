import { AuthorizationError } from "@/lib/authorization";
import { ActiveLinxConfigurationError } from "./_operations";

export function operationalAuthorizationResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  return Response.json(
    { error: "Erro interno na integração Linx." },
    { status: 500 },
  );
}

export function operationalConfigurationResponse(error: unknown) {
  if (error instanceof ActiveLinxConfigurationError) {
    return Response.json({ error: error.message }, { status: 409 });
  }
  return null;
}

export function operationalRunningResponse(run: {
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
      run: {
        ...run,
        startedAt: run.startedAt.toISOString(),
      },
    },
    { status: 409 },
  );
}
