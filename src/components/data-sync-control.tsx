"use client";

import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataSyncStatus = {
  running: boolean;
  lastLinxSuccessfulSyncAt: string | null;
  lastMetaSyncAt: string | null;
};

type DataSyncResult = {
  cutoffDate: string;
  lastSuccessfulSyncAt: string;
  sources: Record<string, unknown>;
};

type DataSyncControlProps = {
  variant: "desktop" | "mobile";
};

const STATUS_QUERY_KEY = ["data-sync-status"] as const;
const SYNC_MUTATION_KEY = ["data-sync"] as const;

class DataSyncRequestError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "DataSyncRequestError";
  }
}

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = init ? await fetch(input, init) : await fetch(input);
  const payload = await response.json().catch(() => null) as
    | T
    | { error?: unknown }
    | null;
  if (!response.ok) {
    const message = payload && typeof payload === "object" &&
      "error" in payload && typeof payload.error === "string"
      ? payload.error
      : "Não foi possível concluir a sincronização de dados.";
    throw new DataSyncRequestError(response.status, message);
  }
  if (!payload || typeof payload !== "object") {
    throw new DataSyncRequestError(
      500,
      "A sincronização de dados retornou uma resposta inválida.",
    );
  }
  return payload as T;
}

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Sao_Paulo",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Sao_Paulo",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

function formatTimestamp(
  label: string,
  value: string | null,
  emptyLabel: string,
) {
  if (value === null) return emptyLabel;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `${label} indisponível`;
  return `${label}: ${dateTimeFormatter.format(date).replace(",", " às")}`;
}

function formatAllDataTimestamp(linxValue: string, metaValue: string) {
  const timestamps = [linxValue, metaValue].map((value) => new Date(value));
  if (timestamps.some((date) => Number.isNaN(date.getTime()))) {
    return "Atualização dos dados indisponível";
  }
  const allDataUpdatedAt = new Date(Math.min(
    ...timestamps.map((date) => date.getTime()),
  ));
  return `Todos os dados atualizados às ${timeFormatter.format(allDataUpdatedAt)}`;
}

function formatCutoff(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return dateFormatter.format(date);
}

export function DataSyncControl({ variant }: DataSyncControlProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const status = useQuery({
    queryKey: STATUS_QUERY_KEY,
    queryFn: () => requestJson<DataSyncStatus>("/api/sync/status"),
    staleTime: 60_000,
    retry: false,
  });
  const mutation = useMutation({
    mutationKey: SYNC_MUTATION_KEY,
    mutationFn: () => requestJson<DataSyncResult>(
      "/api/sync",
      { method: "POST" },
    ),
    onSuccess(data) {
      queryClient.setQueryData<DataSyncStatus>(STATUS_QUERY_KEY, (current) => ({
        running: false,
        lastLinxSuccessfulSyncAt:
          current?.lastLinxSuccessfulSyncAt ?? null,
        lastMetaSyncAt: data.lastSuccessfulSyncAt,
      }));
      void queryClient.invalidateQueries({ queryKey: STATUS_QUERY_KEY });
      toast.success(
        `Dados atualizados até ${formatCutoff(data.cutoffDate)}: Linx, Meta e duas contas Google.`,
      );
      router.refresh();
    },
    onError(error) {
      if (error instanceof DataSyncRequestError && error.status === 409) {
        toast.info(error.message);
        return;
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a sincronização de dados.",
      );
    },
  });
  const isMutating = useIsMutating({ mutationKey: SYNC_MUTATION_KEY }) > 0;
  const unavailable = status.isError;
  const isRunning = status.data?.running === true;
  const isLoading = isMutating || isRunning;

  return (
    <div className={cn(
      variant === "desktop"
        ? "hidden items-center gap-3 md:flex"
        : "flex shrink-0 flex-col gap-2 border-t border-border pt-3 md:hidden",
    )}>
      <Button
        type="button"
        className={cn(variant === "mobile" && "w-full")}
        disabled={isLoading}
        onClick={() => mutation.mutate()}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
        Sincronizar dados
      </Button>
      <div className={cn(
        "flex flex-col text-xs leading-tight text-muted-foreground",
        variant === "mobile" && "text-center",
      )}>
        {unavailable
          ? <span>Status da sincronização indisponível</span>
          : status.isPending
            ? <span>Consultando sincronização...</span>
            : (
                status.data.lastLinxSuccessfulSyncAt !== null &&
                  status.data.lastMetaSyncAt !== null
                  ? <span className="line-clamp-2 max-w-40 ">{formatAllDataTimestamp(
                      status.data.lastLinxSuccessfulSyncAt,
                      status.data.lastMetaSyncAt,
                    )}</span>
                  : (
                      <>
                        <span>{formatTimestamp(
                          "Último Linx",
                          status.data.lastLinxSuccessfulSyncAt,
                          "Linx ainda não sincronizado",
                        )}</span>
                        <span>{formatTimestamp(
                          "Último Meta",
                          status.data.lastMetaSyncAt,
                          "Meta ainda não sincronizado",
                        )}</span>
                      </>
                    )
              )}
      </div>
    </div>
  );
}
