"use client";

import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinxSyncStatus = { lastSuccessfulSyncAt: string | null };
type LinxSyncResult = {
  summary: {
    ordersProcessed: number;
    itemsCreated: number;
    itemsUpdated: number;
    itemsRemoved: number;
  };
  lastSuccessfulSyncAt: string;
};
type LinxSyncControlProps = { variant: "desktop" | "mobile" };

const STATUS_QUERY_KEY = ["linx-sync-status"] as const;
const SYNC_MUTATION_KEY = ["linx-sync"] as const;

class LinxRequestError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "LinxRequestError";
  }
}

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = init ? await fetch(input, init) : await fetch(input);
  const payload = await response.json().catch(() => null) as
    | T
    | { error?: unknown }
    | null;
  if (!response.ok) {
    const message = payload && typeof payload === "object"
      && "error" in payload && typeof payload.error === "string"
      ? payload.error
      : "Não foi possível concluir a sincronização Linx.";
    throw new LinxRequestError(response.status, message);
  }
  if (!payload || typeof payload !== "object") {
    throw new LinxRequestError(
      500,
      "A integração Linx retornou uma resposta inválida.",
    );
  }
  return payload as T;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});
const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Sao_Paulo",
});

function formatLastSuccessfulSync(value: string | null | undefined) {
  if (value === null) return "Ainda não sincronizado";
  if (!value) return "Consultando última sincronização...";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Última sincronização indisponível";
  return `Última sincronização:\n${dateFormatter.format(date)} às ${timeFormatter.format(date)}`;
}

export function LinxSyncControl({ variant }: LinxSyncControlProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const status = useQuery({
    queryKey: STATUS_QUERY_KEY,
    queryFn: () => requestJson<LinxSyncStatus>("/api/linx/status"),
    staleTime: 60_000,
    retry: false,
  });
  const mutation = useMutation({
    mutationKey: SYNC_MUTATION_KEY,
    mutationFn: () => requestJson<LinxSyncResult>(
      "/api/linx/sync",
      { method: "POST" },
    ),
    onSuccess(data) {
      queryClient.setQueryData<LinxSyncStatus>(STATUS_QUERY_KEY, {
        lastSuccessfulSyncAt: data.lastSuccessfulSyncAt,
      });
      const changedItems = data.summary.itemsCreated
        + data.summary.itemsUpdated
        + data.summary.itemsRemoved;
      toast.success(
        `Sincronização concluída: ${data.summary.ordersProcessed} pedido(s) e ${changedItems} item(ns).`,
      );
      router.refresh();
    },
    onError(error) {
      if (error instanceof LinxRequestError && error.status === 409) {
        toast.info(error.message);
        return;
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a sincronização Linx.",
      );
    },
  });
  const isMutating = useIsMutating({ mutationKey: SYNC_MUTATION_KEY }) > 0;
  const statusLabel = status.isError
    ? "Última sincronização indisponível"
    : formatLastSuccessfulSync(
      status.isPending ? undefined : status.data.lastSuccessfulSyncAt,
    );

  return (
    <div className={cn(
      variant === "desktop"
        ? "hidden items-center gap-3 md:flex"
        : "flex shrink-0 flex-col gap-2 border-t border-border pt-3 md:hidden",
    )}>
      <Button
        type="button"
        className={cn(variant === "mobile" && "w-full")}
        disabled={isMutating}
        onClick={() => mutation.mutate()}
      >

        <RefreshCw /> Sincronizar Linx

      </Button>
      <span className={cn(
        "whitespace-pre-line text-xs leading-tight text-muted-foreground",
        variant === "mobile" && "text-center",
      )}>
        {statusLabel}
      </span>
    </div>
  );
}
