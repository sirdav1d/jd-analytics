export type LinxPanelState =
  | { kind: "IDLE" }
  | { kind: "RUNNING"; startedAt: string; stage: string | null }
  | {
      kind: "SUCCESS";
      finishedAt: string;
      orders: number;
      items: number;
    }
  | { kind: "FAILED"; finishedAt: string; message: string };

export type LinxRunSnapshot = {
  status: "RUNNING" | "SUCCESS" | "FAILED";
  mode?: "INCREMENTAL" | "RECONCILIATION";
  stage: string | null;
  processedOrders: number;
  processedItems: number;
  errorMessage: string | null;
  startedAt: string;
  finishedAt: string | null;
};

export function panelStateFromRun(
  run: LinxRunSnapshot | null,
): LinxPanelState {
  if (!run) return { kind: "IDLE" };
  if (run.status === "RUNNING") {
    return {
      kind: "RUNNING",
      startedAt: run.startedAt,
      stage: run.stage,
    };
  }
  if (run.status === "SUCCESS") {
    return {
      kind: "SUCCESS",
      finishedAt: run.finishedAt ?? run.startedAt,
      orders: run.processedOrders,
      items: run.processedItems,
    };
  }
  return {
    kind: "FAILED",
    finishedAt: run.finishedAt ?? run.startedAt,
    message:
      run.errorMessage ??
      "A sincronização falhou sem detalhes. Tente novamente.",
  };
}
