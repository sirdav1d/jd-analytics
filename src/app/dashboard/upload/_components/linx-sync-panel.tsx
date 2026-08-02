"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Store,
  Unplug,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  panelStateFromRun,
  type LinxPanelState,
  type LinxRunSnapshot,
} from "./linx-panel-model";

type Organization = {
  id: string;
  name: string;
  linxCnpj: string | null;
  linxPortalId: number | null;
  linxCompanyId: number | null;
  linxSyncEnabled: boolean | null;
};

type DiscoveredStore = {
  cnpj: string;
  name: string;
  portalId: number | null;
  companyId: number | null;
};

type StatusResponse = {
  organizations: Organization[];
  activeOrganizationId: string | null;
  run: (LinxRunSnapshot & {
    id: string;
    organizationId: string;
    trigger: string;
  }) | null;
  cursors: Array<{
    method: string;
    lastTimestamp: string;
    updatedAt: string;
  }>;
};

type ReconciliationPreview = {
  period: { from: string; to: string };
  linx: { orders: number; items: number; grossValue: number };
  database: { orders: number; items: number; grossValue: number };
  differences: {
    missingInDatabase: number;
    changedOrders: number;
    databaseOnly: number;
  };
  estimatedDurationMs: number;
  fitsRuntimeBudget: boolean;
  authorizationToken: string | null;
};

type SyncMode = "INCREMENTAL" | "RECONCILIATION";
type BusyAction = "STATUS" | "DISCOVER" | "ACTIVATE" | "PREVIEW" | "SYNC";

const LINX_SYNC_METHODS = [
  "MOVIMENTO",
  "MOVIMENTO_PLANOS",
  "MOVIMENTO_PRINCIPAL",
  "ROTINA_ORIGEM",
  "RESPOSTA_VENDA",
] as const;

class LinxApiError extends Error {
  readonly status: number;
  readonly payload: {
    error?: string;
    run?: {
      status: "RUNNING";
      mode: SyncMode;
      stage: string | null;
      startedAt: string;
    } | null;
  };

  constructor(
    status: number,
    payload: LinxApiError["payload"],
  ) {
    super(payload.error ?? "Falha na integração Linx.");
    this.name = "LinxApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, init);
  const payload = (await response.json().catch(() => ({}))) as T &
    LinxApiError["payload"];
  if (!response.ok) throw new LinxApiError(response.status, payload);
  return payload;
}

function postJson<T>(path: string, body: unknown) {
  return requestJson<T>(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

function formatCnpj(value: string) {
  return value.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}

function Step({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative grid gap-4 border-b border-border/70 py-5 last:border-0 md:grid-cols-[2.5rem_1fr_auto] md:items-center">
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-full border border-sky-500/40 bg-sky-500/10 font-mono text-sm font-semibold text-sky-700 dark:text-sky-300"
      >
        {number}
      </span>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="md:min-w-52 md:justify-self-end">{children}</div>
    </li>
  );
}

export function LinxSyncPanel() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stores, setStores] = useState<DiscoveredStore[]>([]);
  const [activeOrganizationId, setActiveOrganizationId] = useState<
    string | null
  >(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [selectedStoreCnpj, setSelectedStoreCnpj] = useState("");
  const [panelState, setPanelState] = useState<LinxPanelState>({
    kind: "IDLE",
  });
  const [preview, setPreview] = useState<ReconciliationPreview | null>(null);
  const [busy, setBusy] = useState<BusyAction | null>("STATUS");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastMode, setLastMode] = useState<SyncMode>("INCREMENTAL");
  const [hasCursorBaseline, setHasCursorBaseline] = useState(false);

  const selectedStore = useMemo(
    () => stores.find((store) => store.cnpj === selectedStoreCnpj) ?? null,
    [selectedStoreCnpj, stores],
  );
  const activeOrganization = useMemo(
    () =>
      organizations.find(
        (organization) => organization.id === activeOrganizationId,
      ) ?? null,
    [activeOrganizationId, organizations],
  );
  const mutationsDisabled = busy !== null || panelState.kind === "RUNNING";

  const applyRunningConflict = useCallback((error: unknown) => {
    if (
      error instanceof LinxApiError &&
      error.status === 409 &&
      error.payload.run
    ) {
      setPanelState({
        kind: "RUNNING",
        startedAt: error.payload.run.startedAt,
        stage: error.payload.run.stage,
      });
      setFeedback(
        "Já há uma execução ativa. O painel acompanhará o status automaticamente.",
      );
      return true;
    }
    return false;
  }, []);

  const refreshStatus = useCallback(async (
    showFailure = true,
    preserveLocalFailureSince?: string,
  ) => {
    try {
      const status = await requestJson<StatusResponse>(
        "/api/admin/linx/status",
      );
      setOrganizations(status.organizations);
      setActiveOrganizationId(status.activeOrganizationId);
      setHasCursorBaseline(
        LINX_SYNC_METHODS.every((method) =>
          status.cursors.some((cursor) => cursor.method === method),
        ),
      );
      setSelectedOrganizationId(
        (current) =>
          current ||
          status.activeOrganizationId ||
          status.organizations[0]?.id ||
          "",
      );
      const hasNewAttempt =
        status.run !== null &&
        (!preserveLocalFailureSince ||
          Date.parse(status.run.startedAt) >=
            Date.parse(preserveLocalFailureSince));
      if (!preserveLocalFailureSince || hasNewAttempt) {
        setPanelState(panelStateFromRun(status.run));
        if (status.run?.mode) setLastMode(status.run.mode);
      }
      if (hasNewAttempt && status.run?.status === "FAILED") {
        setFeedback(
          status.run.errorMessage ??
            "A sincronização falhou sem detalhes. Tente novamente.",
        );
      }
    } catch (error) {
      if (showFailure) {
        setFeedback(
          error instanceof Error
            ? error.message
            : "Não foi possível consultar o status Linx.",
        );
      }
    } finally {
      setBusy((current) => (current === "STATUS" ? null : current));
    }
  }, []);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    if (panelState.kind !== "RUNNING") return;
    const interval = window.setInterval(() => {
      void refreshStatus(false);
    }, 3_000);
    return () => window.clearInterval(interval);
  }, [panelState.kind, refreshStatus]);

  async function discover() {
    setBusy("DISCOVER");
    setFeedback(null);
    try {
      const result = await postJson<{ stores: DiscoveredStore[] }>(
        "/api/admin/linx/discover",
        {},
      );
      setStores(result.stores);
      setSelectedStoreCnpj(result.stores[0]?.cnpj ?? "");
      setFeedback(
        result.stores.length > 0
          ? `${result.stores.length} loja(s) encontrada(s).`
          : "A conexão foi validada, mas nenhuma loja foi encontrada.",
      );
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Não foi possível descobrir as lojas Linx.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function activate() {
    if (!selectedStore || !selectedOrganizationId) return;
    setBusy("ACTIVATE");
    setFeedback(null);
    try {
      await postJson("/api/admin/linx/activate", {
        organizationId: selectedOrganizationId,
        cnpj: selectedStore.cnpj,
        portalId: selectedStore.portalId,
        companyId: selectedStore.companyId,
      });
      setPreview(null);
      setFeedback("Loja ativada como única origem das próximas sincronizações.");
      await refreshStatus(false);
    } catch (error) {
      if (!applyRunningConflict(error)) {
        setFeedback(
          error instanceof Error
            ? error.message
            : "Não foi possível ativar a loja.",
        );
      }
    } finally {
      setBusy(null);
    }
  }

  async function generatePreview() {
    if (!activeOrganizationId) return;
    setBusy("PREVIEW");
    setFeedback(null);
    try {
      const result = await postJson<ReconciliationPreview>(
        "/api/admin/linx/reconciliation/preview",
        { organizationId: activeOrganizationId },
      );
      setPreview(result);
      setFeedback("Preview concluído sem alterar os dados.");
    } catch (error) {
      if (!applyRunningConflict(error)) {
        setFeedback(
          error instanceof Error
            ? error.message
            : "Não foi possível gerar o preview.",
        );
      }
    } finally {
      setBusy(null);
    }
  }

  async function synchronize(
    mode: SyncMode,
    trigger: "MANUAL" | "RETRY",
  ) {
    if (!activeOrganizationId || (mode === "INCREMENTAL" && !hasCursorBaseline)) {
      return;
    }
    const attemptStartedAt = new Date().toISOString();
    setBusy("SYNC");
    setLastMode(mode);
    setFeedback(null);
    setPanelState({
      kind: "RUNNING",
      startedAt: attemptStartedAt,
      stage: "INICIANDO",
    });
    try {
      const summary = await postJson<{
        ordersProcessed: number;
        itemsCreated: number;
        itemsUpdated: number;
        itemsRemoved: number;
      }>("/api/admin/linx/sync", {
        organizationId: activeOrganizationId,
        mode,
        trigger,
        reconciliationAuthorization:
          mode === "RECONCILIATION"
            ? preview?.authorizationToken
            : undefined,
      });
      setPanelState({
        kind: "SUCCESS",
        finishedAt: new Date().toISOString(),
        orders: summary.ordersProcessed,
        items:
          summary.itemsCreated +
          summary.itemsUpdated +
          summary.itemsRemoved,
      });
      setFeedback(
        mode === "RECONCILIATION"
          ? "Conciliação aplicada com sucesso."
          : "Sincronização concluída com sucesso.",
      );
      setPreview(null);
      await refreshStatus(false);
    } catch (error) {
      if (!applyRunningConflict(error)) {
        const message =
          error instanceof Error
            ? error.message
            : "A sincronização falhou. Tente novamente.";
        setPanelState({
          kind: "FAILED",
          finishedAt: new Date().toISOString(),
          message,
        });
        setFeedback(message);
        await refreshStatus(false, attemptStartedAt);
      }
    } finally {
      setBusy(null);
    }
  }

  function confirmReconciliation() {
    if (
      !preview?.fitsRuntimeBudget ||
      !preview.authorizationToken
    ) return;
    const confirmed = window.confirm(
      "Aplicar a conciliação dos últimos 30 dias? Esta ação gravará as diferenças apresentadas no preview.",
    );
    if (confirmed) void synchronize("RECONCILIATION", "MANUAL");
  }

  return (
    <Card className="overflow-hidden border-sky-500/20 shadow-sm">
      <div className="h-1 bg-gradient-to-r from-sky-600 via-cyan-400 to-transparent" />
      <CardHeader className="gap-3 border-b bg-muted/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
              <RefreshCw className="size-3.5" />
              Integração operacional
            </div>
            <CardTitle className="text-xl">Linx Microvix</CardTitle>
            <CardDescription className="max-w-2xl">
              Valide a conexão, escolha a única loja ativa e acompanhe cada
              sincronização sem enviar credenciais pelo navegador.
            </CardDescription>
          </div>
          <Badge
            variant={
              panelState.kind === "FAILED"
                ? "destructive"
                : panelState.kind === "SUCCESS"
                  ? "success"
                  : "outline"
            }
          >
            {panelState.kind === "IDLE" && "Aguardando"}
            {panelState.kind === "RUNNING" && "Em execução"}
            {panelState.kind === "SUCCESS" && "Concluída"}
            {panelState.kind === "FAILED" && "Falhou"}
          </Badge>
        </div>

        <div aria-live="polite">
          {panelState.kind === "RUNNING" && (
            <Alert className="border-sky-500/30 bg-sky-500/5">
              <Loader2 className="animate-spin text-sky-600" />
              <AlertTitle>Sincronização em andamento</AlertTitle>
              <AlertDescription>
                Etapa: {panelState.stage ?? "processando"} · iniciada em{" "}
                {formatDate(panelState.startedAt)}. Todas as ações mutáveis
                estão bloqueadas.
              </AlertDescription>
            </Alert>
          )}
          {panelState.kind === "SUCCESS" && (
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>Última execução concluída</AlertTitle>
              <AlertDescription>
                {panelState.orders} pedido(s) e {panelState.items} item(ns) ·{" "}
                {formatDate(panelState.finishedAt)}
              </AlertDescription>
            </Alert>
          )}
          {panelState.kind === "FAILED" && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Última execução falhou</AlertTitle>
              <AlertDescription>{panelState.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ol className="border-y border-border/70">
          <Step
            number={1}
            title="Validar conexão e descobrir lojas"
            description="Usa a configuração protegida do servidor; nenhuma chave é enviada ao navegador."
          >
            <Button
              className="w-full"
              variant="outline"
              disabled={mutationsDisabled}
              onClick={() => void discover()}
            >
              {busy === "DISCOVER" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Unplug />
              )}
              Validar e descobrir
            </Button>
          </Step>

          <Step
            number={2}
            title="Selecionar e ativar a loja futura"
            description="Desativa as demais integrações e ativa exatamente uma organização."
          >
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="linx-organization">Organização</Label>
                <Select
                  value={selectedOrganizationId}
                  onValueChange={setSelectedOrganizationId}
                  disabled={mutationsDisabled}
                >
                  <SelectTrigger id="linx-organization">
                    <SelectValue placeholder="Selecione a organização" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((organization) => (
                      <SelectItem
                        key={organization.id}
                        value={organization.id}
                      >
                        {organization.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linx-store">Loja descoberta</Label>
                <Select
                  value={selectedStoreCnpj}
                  onValueChange={setSelectedStoreCnpj}
                  disabled={mutationsDisabled || stores.length === 0}
                >
                  <SelectTrigger id="linx-store">
                    <SelectValue placeholder="Descubra uma loja primeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.cnpj} value={store.cnpj}>
                        {store.name} · {formatCnpj(store.cnpj)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                disabled={
                  mutationsDisabled ||
                  !selectedOrganizationId ||
                  !selectedStore
                }
                onClick={() => void activate()}
              >
                {busy === "ACTIVATE" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Store />
                )}
                Ativar esta loja
              </Button>
            </div>
          </Step>

          <Step
            number={3}
            title="Gerar preview dos últimos 30 dias"
            description="Compara Linx e histórico atual em modo somente leitura."
          >
            <Button
              className="w-full"
              variant="outline"
              disabled={mutationsDisabled || !activeOrganizationId}
              onClick={() => void generatePreview()}
            >
              {busy === "PREVIEW" && <Loader2 className="animate-spin" />}
              Gerar preview
            </Button>
          </Step>

          <Step
            number={4}
            title="Confirmar aplicação da conciliação"
            description="A gravação só começa depois desta confirmação administrativa explícita."
          >
            <Button
              className="w-full"
              variant="secondary"
              disabled={
                mutationsDisabled ||
                !preview ||
                !preview.fitsRuntimeBudget ||
                !preview.authorizationToken
              }
              onClick={confirmReconciliation}
            >
              Confirmar conciliação
            </Button>
          </Step>

          <Step
            number={5}
            title="Sincronizar agora"
            description="Busca apenas os incrementos da loja ativa e confirma tudo em uma única transação."
          >
            <Button
              className="w-full"
              disabled={
                mutationsDisabled ||
                !activeOrganizationId ||
                !hasCursorBaseline
              }
              onClick={() => void synchronize("INCREMENTAL", "MANUAL")}
            >
              {busy === "SYNC" && <Loader2 className="animate-spin" />}
              Sincronizar agora
            </Button>
          </Step>

          <Step
            number={6}
            title="Tentar novamente após falha"
            description="Mantém o modo da última tentativa feita nesta sessão."
          >
            <Button
              className="w-full"
              variant="outline"
              disabled={
                mutationsDisabled ||
                panelState.kind !== "FAILED" ||
                !activeOrganizationId ||
                !hasCursorBaseline
              }
              onClick={() => {
                if (lastMode === "RECONCILIATION") {
                  setFeedback(
                    "Gere um novo preview para tentar a conciliação novamente.",
                  );
                  void generatePreview();
                  return;
                }
                void synchronize("INCREMENTAL", "RETRY");
              }}
            >
              <RefreshCw />
              Tentar novamente
            </Button>
          </Step>
        </ol>

        {activeOrganizationId && !hasCursorBaseline && (
          <Alert className="mt-6 border-amber-500/30 bg-amber-500/5">
            <AlertCircle className="text-amber-700 dark:text-amber-300" />
            <AlertTitle>Conciliação inicial necessária</AlertTitle>
            <AlertDescription>
              Gere o preview e confirme a conciliação inicial antes de sincronizar incrementalmente.
            </AlertDescription>
          </Alert>
        )}

        {preview && (
          <section
            aria-label="Preview da conciliação"
            className="mt-6 rounded-lg border bg-muted/30 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold">Preview sem persistência</h3>
                <p className="text-sm text-muted-foreground">
                  {preview.period.from} a {preview.period.to}
                </p>
              </div>
              <Badge
                variant={preview.fitsRuntimeBudget ? "success" : "destructive"}
              >
                {preview.fitsRuntimeBudget
                  ? "Leitura dentro do limite"
                  : "Leitura acima do limite"}
              </Badge>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Ausentes no banco</dt>
                <dd className="font-mono text-lg font-semibold">
                  {preview.differences.missingInDatabase}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Pedidos alterados</dt>
                <dd className="font-mono text-lg font-semibold">
                  {preview.differences.changedOrders}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Somente no banco</dt>
                <dd className="font-mono text-lg font-semibold">
                  {preview.differences.databaseOnly}
                </dd>
              </div>
            </dl>
          </section>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Loja ativa:</span>
          {activeOrganization ? activeOrganization.name : "nenhuma"}
          {activeOrganization?.linxCnpj
            ? ` · ${formatCnpj(activeOrganization.linxCnpj)}`
            : ""}
        </div>
        {feedback && (
          <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
            {feedback}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
