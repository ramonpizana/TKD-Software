import { isTauri } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";
import {
  eventWorkspaceSchema,
  type EventWorkspace,
  type RingSnapshot
} from "../../ring/model/schemas";
import {
  hasPersistedWorkspace,
  loadWorkspace,
  LOCAL_STORAGE_LOCATION,
  WORKSPACE_STORAGE_KEY
} from "./persistence";
import type { RuntimeWorkspaceLoadResult } from "./persistence.runtime";
import type { WorkspaceStorageDiagnostics } from "./storage-diagnostics";

const DATABASE_CONNECTION = "sqlite:tkd-software.db";
const DATABASE_FILE_NAME = "tkd-software.db";
const WORKSPACE_ROW_ID = 1;

interface PersistedWorkspaceRow {
  payload: string;
  updated_at: string;
}

export type SqliteWorkspaceLoadResult = RuntimeWorkspaceLoadResult;

let databasePromise: Promise<Database> | null = null;
let databasePathPromise: Promise<string | null> | null = null;

export async function loadTournamentDatabase() {
  if (!isTauri()) {
    return null;
  }

  databasePromise ??= Database.load(DATABASE_CONNECTION);
  return databasePromise;
}

export async function resolveTournamentDatabasePath() {
  if (!isTauri()) {
    return null;
  }

  databasePathPromise ??= resolveDatabasePath();
  return databasePathPromise;
}

export async function loadWorkspaceFromSqlite(
  fallbackEvent: RingSnapshot
): Promise<SqliteWorkspaceLoadResult> {
  const [db, databasePath] = await Promise.all([
    loadTournamentDatabase(),
    resolveTournamentDatabasePath()
  ]);

  if (!db) {
    throw new Error("SQLite storage is not available outside Tauri.");
  }

  const rows = await db.select<PersistedWorkspaceRow[]>(
    "SELECT payload, updated_at FROM workspace_state WHERE id = ?",
    [WORKSPACE_ROW_ID]
  );
  const row = rows[0];

  if (row?.payload) {
    try {
      const parsed = eventWorkspaceSchema.safeParse(JSON.parse(row.payload));

      if (parsed.success) {
        return {
          diagnostics: buildSqliteDiagnostics({
            databasePath,
            lastLoadedAt: new Date().toISOString(),
            message: "Workspace recuperado desde SQLite local"
          }),
          workspace: parsed.data
        };
      }
    } catch {
      // A corrupted payload should be replaced by a fresh migrated snapshot below.
    }
  }

  const migratedWorkspace = loadWorkspace(fallbackEvent);
  await persistWorkspaceSnapshot(db, migratedWorkspace);

  if (hasPersistedWorkspace()) {
    window.localStorage.removeItem(WORKSPACE_STORAGE_KEY);
  }

  return {
    diagnostics: buildSqliteDiagnostics({
      databasePath,
      lastLoadedAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
      message: row
        ? "SQLite tenia datos invalidos y fue reconstruido con el workspace local"
        : "Workspace inicial migrado a SQLite local"
    }),
    workspace: migratedWorkspace
  };
}

export async function saveWorkspaceToSqlite(
  workspace: EventWorkspace,
  diagnostics: WorkspaceStorageDiagnostics
): Promise<WorkspaceStorageDiagnostics> {
  const [db, databasePath] = await Promise.all([
    loadTournamentDatabase(),
    resolveTournamentDatabasePath()
  ]);

  if (!db) {
    throw new Error("SQLite storage is not available outside Tauri.");
  }

  await persistWorkspaceSnapshot(db, workspace);

  return buildSqliteDiagnostics({
    databasePath,
    lastLoadedAt: diagnostics.lastLoadedAt,
    lastSavedAt: new Date().toISOString(),
    message: "Workspace guardado en SQLite local"
  });
}

async function resolveDatabasePath() {
  const { appConfigDir, join } = await import("@tauri-apps/api/path");
  const configDirectory = await appConfigDir();
  return join(configDirectory, DATABASE_FILE_NAME);
}

async function persistWorkspaceSnapshot(db: Database, workspace: EventWorkspace) {
  await db.execute(
    `INSERT INTO workspace_state (id, version, payload, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       version = excluded.version,
       payload = excluded.payload,
       updated_at = excluded.updated_at`,
    [
      WORKSPACE_ROW_ID,
      workspace.version,
      JSON.stringify(workspace),
      workspace.updatedAt
    ]
  );
}

function buildSqliteDiagnostics({
  databasePath,
  lastLoadedAt = null,
  lastSavedAt = null,
  message
}: {
  databasePath: string | null;
  lastLoadedAt?: string | null;
  lastSavedAt?: string | null;
  message: string;
}): WorkspaceStorageDiagnostics {
  return {
    driver: "sqlite",
    label: "SQLite local",
    location: databasePath ?? LOCAL_STORAGE_LOCATION,
    message,
    lastLoadedAt,
    lastSavedAt,
    status: "ready"
  };
}
