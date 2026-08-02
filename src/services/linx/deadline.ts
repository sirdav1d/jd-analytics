import { LinxDeadlineError } from "./errors";

export type LinxDeadline = ReturnType<typeof createDeadline>;

export function createDeadline(now: () => number, deadlineAt: number) {
  return {
    deadlineAt,
    remainingMs: () => deadlineAt - now(),
    assert(minimumMs = 1_000) {
      if (deadlineAt - now() < minimumMs) {
        throw new LinxDeadlineError(
          "Tempo insuficiente para concluir com atomicidade",
        );
      }
    },
  };
}
