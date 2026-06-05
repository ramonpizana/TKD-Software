import { isTauri } from "@tauri-apps/api/core";
import type { EventWorkspace, RingSnapshot } from "../../ring/model/schemas";
import {
  createWorkspaceFromEvent,
  hasPersistedWorkspace,
  loadWorkspace,
  LOCAL_STORAGE_LABEL,
  LOCAL_STORAGE_LOCATION,
  saveWorkspace
} from "./persistence";
import {
  loadWorkspaceFromSqlite,
  saveWorkspaceToSqlite
} from "./persistence.tauri-sql";
import type { WorkspaceStorageDiagnostics } from "./storage-diagnostics";

export interface RuntimeWorkspaceLoadResult {
  diagnostics: WorkspaceStorageDiagnostics;
  workspace: EventWorkspace;
}

export function getInitialStorageDiagnostics(): WorkspaceStorageDiagnostics {
  return {
    driver: isTauri() ? "sqlite" : "localStorage",
    label: isTauri() ? "SQLite local" : LOCAL_STORAGE_LABEL,
    location: isTauri()
      ? "Esperando inicializacion del shell desktop"
      : LOCAL_STORAGE_LOCATION,
    message: isTauri()
      ? "Inicializando almacenamiento desktop"
      : "Persistencia local del navegador lista",
    lastLoadedAt: null,
    lastSavedAt: null,
    status: "ready"
  };
}

export async function loadWorkspaceForRuntime(
  fallbackEvent: RingSnapshot
): Promise<RuntimeWorkspaceLoadResult> {
  if (!isTauri()) {
    return {
      diagnostics: {
        driver: "localStorage",
        label: LOCAL_STORAGE_LABEL,
        location: LOCAL_STORAGE_LOCATION,
        message: hasPersistedWorkspace()
          ? "Workspace recuperado desde el navegador"
          : "Sin datos previos, usando evento demo local",
        lastLoadedAt: new Date().toISOString(),
        lastSavedAt: null,
        status: "ready"
      },
      workspace: loadWorkspace(fallbackEvent)
    };
  }

  try {
    const sqliteResult = await loadWorkspaceFromSqlite(fallbackEvent);
    return sqliteResult;
  } catch (error) {
    console.error("SQLite runtime load failed, falling back to localStorage", error);
    return {
      diagnostics: {
        driver: "localStorage",
        label: "Fallback localStorage",
        location: LOCAL_STORAGE_LOCATION,
        message:
          "SQLite no pudo inicializarse; se activo almacenamiento local de respaldo",
        lastLoadedAt: new Date().toISOString(),
        lastSavedAt: null,
        status: "fallback"
      },
      workspace: loadWorkspace(fallbackEvent)
    };
  }
}

export async function saveWorkspaceForRuntime(
  workspace: EventWorkspace,
  diagnostics: WorkspaceStorageDiagnostics
): Promise<WorkspaceStorageDiagnostics> {
  if (isTauri() && diagnostics.driver === "sqlite") {
    try {
      const nextDiagnostics = await saveWorkspaceToSqlite(workspace, diagnostics);
      return nextDiagnostics;
    } catch (error) {
      console.error("SQLite runtime save failed, falling back to localStorage", error);
      saveWorkspace(workspace);
      return {
        ...diagnostics,
        driver: "localStorage",
        label: "Fallback localStorage",
        location: LOCAL_STORAGE_LOCATION,
        message:
          "SQLite fallo al guardar; el workspace quedo persistido en localStorage",
        lastSavedAt: new Date().toISOString(),
        status: "fallback"
      };
    }
  }

  saveWorkspace(workspace);

  return {
    ...diagnostics,
    driver: "localStorage",
    label: diagnostics.label || LOCAL_STORAGE_LABEL,
    location: diagnostics.location || LOCAL_STORAGE_LOCATION,
    message:
      diagnostics.status === "fallback"
        ? diagnostics.message
        : "Workspace guardado en localStorage",
      lastSavedAt: new Date().toISOString()
  };
}

export function createDefaultWorkspace(fallbackEvent: RingSnapshot) {
  return createWorkspaceFromEvent(fallbackEvent);
}
