import {
  eventWorkspaceSchema,
  ringSnapshotSchema,
  type Athlete,
  type EventWorkspace,
  type JudgeRecord,
  type RingSnapshot
} from "../../ring/model/schemas";

export const WORKSPACE_STORAGE_KEY = "tkd-software:event-workspace:v1";
const LEGACY_RING_STORAGE_KEY = "tkd-software:ring-foundation:v1";
export const LOCAL_STORAGE_LABEL = "Browser localStorage";
export const LOCAL_STORAGE_LOCATION = "Perfil local del navegador o webview";

export function createWorkspaceFromEvent(event: RingSnapshot): EventWorkspace {
  return {
    version: 1,
    activeEventId: event.eventId,
    events: [event],
    updatedAt: event.meta.updatedAt
  };
}

export function loadWorkspace(fallbackEvent: RingSnapshot): EventWorkspace {
  if (typeof window === "undefined") {
    return createWorkspaceFromEvent(fallbackEvent);
  }

  try {
    const rawWorkspace = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);

    if (rawWorkspace) {
      const parsed = eventWorkspaceSchema.safeParse(JSON.parse(rawWorkspace));
      if (parsed.success) {
        return parsed.data;
      }
    }

    const rawLegacy = window.localStorage.getItem(LEGACY_RING_STORAGE_KEY);
    if (rawLegacy) {
      const migrated = migrateLegacySnapshot(JSON.parse(rawLegacy), fallbackEvent);
      if (migrated) {
        return createWorkspaceFromEvent(migrated);
      }
    }
  } catch {
    return createWorkspaceFromEvent(fallbackEvent);
  }

  return createWorkspaceFromEvent(fallbackEvent);
}

export function saveWorkspace(workspace: EventWorkspace): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
}

export function hasPersistedWorkspace(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(WORKSPACE_STORAGE_KEY) !== null;
}

function migrateLegacySnapshot(
  raw: unknown,
  fallbackEvent: RingSnapshot
): RingSnapshot | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const legacy = raw as {
    meta?: Partial<RingSnapshot["meta"]>;
    athletes?: Array<Partial<Athlete>>;
    activeAthleteId?: string;
    focusedJudgeId?: string;
    judges?: JudgeRecord[];
  };

  const nextEvent: RingSnapshot = {
    ...fallbackEvent,
    meta: {
      ...fallbackEvent.meta,
      ...legacy.meta,
      venue: legacy.meta?.venue ?? fallbackEvent.meta.venue,
      modality: legacy.meta?.modality ?? fallbackEvent.meta.modality,
      branch: legacy.meta?.branch ?? fallbackEvent.meta.branch,
      roundName: legacy.meta?.roundName ?? fallbackEvent.meta.roundName,
      categoryLabel: legacy.meta?.categoryLabel ?? fallbackEvent.meta.categoryLabel,
      eventDate: legacy.meta?.eventDate ?? fallbackEvent.meta.eventDate,
      status: fallbackEvent.meta.status,
      updatedAt:
        typeof legacy.meta?.updatedAt === "string"
          ? legacy.meta.updatedAt
          : fallbackEvent.meta.updatedAt
    },
    athletes: normalizeLegacyAthletes(legacy.athletes),
    activeAthleteId: typeof legacy.activeAthleteId === "string" ? legacy.activeAthleteId : "",
    focusedJudgeId:
      typeof legacy.focusedJudgeId === "string"
        ? legacy.focusedJudgeId
        : fallbackEvent.focusedJudgeId,
    judges:
      Array.isArray(legacy.judges) && legacy.judges.length >= 3
        ? legacy.judges
        : fallbackEvent.judges,
    results: []
  };

  if (!nextEvent.activeAthleteId && nextEvent.athletes[0]) {
    nextEvent.activeAthleteId = nextEvent.athletes[0].id;
  }

  const parsed = ringSnapshotSchema.safeParse(nextEvent);
  return parsed.success ? parsed.data : null;
}

function normalizeLegacyAthletes(input: Array<Partial<Athlete>> | undefined): Athlete[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((athlete, index) => ({
      id: athlete.id ?? `ath-legacy-${index + 1}`,
      name: athlete.name ?? `Atleta ${index + 1}`,
      club: athlete.club ?? "",
      state: athlete.state ?? "",
      countryCode: (athlete.countryCode ?? "MEX").toUpperCase(),
      division: athlete.division ?? "Por definir",
      category: athlete.category ?? "Por definir",
      ageBand: athlete.ageBand ?? "Por definir",
      poomsae: athlete.poomsae ?? "Por definir",
      seed: athlete.seed ?? null,
      rankingPoints: athlete.rankingPoints ?? null,
      order:
        typeof athlete.order === "number" && Number.isFinite(athlete.order)
          ? athlete.order
          : index + 1
    }))
    .sort((left, right) => left.order - right.order)
    .map((athlete, index) => ({
      ...athlete,
      order: index + 1
    }));
}
