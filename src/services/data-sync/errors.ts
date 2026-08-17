import type { DataSyncSources } from "./types";

export class DataSyncPublicationError extends Error {
  constructor(readonly sources: DataSyncSources) {
    super("Não foi possível concluir a sincronização de dados.");
    this.name = "DataSyncPublicationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
