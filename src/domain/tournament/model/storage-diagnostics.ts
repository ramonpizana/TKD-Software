export type WorkspaceStorageDriver = "localStorage" | "sqlite";
export type WorkspaceStorageStatus = "ready" | "fallback";

export interface WorkspaceStorageDiagnostics {
  driver: WorkspaceStorageDriver;
  label: string;
  location: string;
  message: string;
  lastLoadedAt: string | null;
  lastSavedAt: string | null;
  status: WorkspaceStorageStatus;
}
