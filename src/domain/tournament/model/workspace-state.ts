import {
  actionIdFromKeyboard,
  applyJudgeAction,
  calculatePublishedScore,
  createJudgeRecord,
  judgeActionCatalog,
  resetJudgeDeck,
  toggleJudgeConnection,
  type JudgeActionDefinition
} from "../../ring/model/scoring";
import type {
  Athlete,
  EventWorkspace,
  RingSnapshot,
  SavedResult,
  TournamentMeta
} from "../../ring/model/schemas";

export interface EventDraft {
  eventName: string;
  venue: string;
  ringName: string;
  modality: string;
  branch: string;
  roundName: string;
  categoryLabel: string;
  eventDate: string;
  judgeCount: number;
}

export interface AthleteDraft {
  name: string;
  club: string;
  state: string;
  countryCode: string;
  division: string;
  category: string;
  ageBand: string;
  poomsae: string;
  seed: number | null;
  rankingPoints: number | null;
}

export interface StandingRow extends SavedResult {
  club: string;
  state: string;
  poomsae: string;
  seed: number | null;
  rankingPoints: number | null;
}

let entityIdSequence = 0;

export function getActiveEvent(workspace: EventWorkspace): RingSnapshot {
  return (
    workspace.events.find((event) => event.eventId === workspace.activeEventId) ??
    workspace.events[0]
  );
}

export function createEvent(
  workspace: EventWorkspace,
  overrides: Partial<EventDraft> = {}
): EventWorkspace {
  const nextEvent = createEmptyEvent(workspace.events.length + 1, overrides);
  const nextWorkspace: EventWorkspace = {
    ...workspace,
    activeEventId: nextEvent.eventId,
    events: [...workspace.events, nextEvent]
  };

  return stampWorkspace(nextWorkspace);
}

export function selectEvent(
  workspace: EventWorkspace,
  eventId: string
): EventWorkspace {
  if (!workspace.events.some((event) => event.eventId === eventId)) {
    return workspace;
  }

  return stampWorkspace({
    ...workspace,
    activeEventId: eventId
  });
}

export function updateEventMeta(
  workspace: EventWorkspace,
  updates: Partial<TournamentMeta>
): EventWorkspace {
  return withActiveEvent(workspace, (event) => {
    const nextJudgeCount = updates.judgeCount ?? event.meta.judgeCount;
    const nextJudges = reconcileJudgeDeck(event.judges, nextJudgeCount);
    const focusedJudgeId = nextJudges.some(
      (judge) => judge.id === event.focusedJudgeId
    )
      ? event.focusedJudgeId
      : nextJudges[0]?.id ?? "J1";

    return {
      ...event,
      meta: {
        ...event.meta,
        ...updates,
        judgeCount: nextJudgeCount
      },
      focusedJudgeId,
      judges: nextJudges
    };
  });
}

export function addAthlete(
  workspace: EventWorkspace,
  draft: AthleteDraft
): EventWorkspace {
  return withActiveEvent(workspace, (event) => {
    const nextOrder =
      event.athletes.reduce((maxOrder, athlete) => Math.max(maxOrder, athlete.order), 0) +
      1;
    const athlete: Athlete = {
      id: createEntityId("ath"),
      name: draft.name.trim(),
      club: draft.club.trim(),
      state: draft.state.trim(),
      countryCode: normalizeCountryCode(draft.countryCode),
      division: draft.division.trim(),
      category: draft.category.trim(),
      ageBand: draft.ageBand.trim(),
      poomsae: draft.poomsae.trim(),
      seed: draft.seed,
      rankingPoints: draft.rankingPoints,
      order: nextOrder
    };

    return {
      ...event,
      activeAthleteId: event.activeAthleteId || athlete.id,
      athletes: [...event.athletes, athlete]
    };
  });
}

export function removeAthlete(
  workspace: EventWorkspace,
  athleteId: string
): EventWorkspace {
  return withActiveEvent(workspace, (event) => {
    const nextAthletes = normalizeAthleteOrder(
      event.athletes.filter((athlete) => athlete.id !== athleteId)
    );
    const nextResults = event.results.filter((result) => result.athleteId !== athleteId);
    const nextActiveAthleteId =
      event.activeAthleteId === athleteId
        ? nextAthletes[0]?.id ?? ""
        : event.activeAthleteId;

    return {
      ...event,
      athletes: nextAthletes,
      results: nextResults,
      activeAthleteId: nextActiveAthleteId,
      judges: resetJudgeDeck(event.judges)
    };
  });
}

export function selectAthlete(
  workspace: EventWorkspace,
  athleteId: string
): EventWorkspace {
  return withActiveEvent(workspace, (event) => ({
    ...event,
    activeAthleteId: athleteId,
    judges: resetJudgeDeck(event.judges)
  }));
}

export function focusJudge(
  workspace: EventWorkspace,
  judgeId: string
): EventWorkspace {
  return withActiveEvent(workspace, (event) => ({
    ...event,
    focusedJudgeId: judgeId
  }));
}

export function resetRound(workspace: EventWorkspace): EventWorkspace {
  return withActiveEvent(workspace, (event) => ({
    ...event,
    judges: resetJudgeDeck(event.judges)
  }));
}

export function advanceAthlete(workspace: EventWorkspace): EventWorkspace {
  return withActiveEvent(workspace, (event) => {
    if (event.athletes.length === 0) {
      return event;
    }

    const sortedAthletes = event.athletes
      .slice()
      .sort((left, right) => left.order - right.order);
    const currentIndex = sortedAthletes.findIndex(
      (athlete) => athlete.id === event.activeAthleteId
    );
    const nextAthlete = sortedAthletes[(currentIndex + 1) % sortedAthletes.length];

    return {
      ...event,
      activeAthleteId: nextAthlete?.id ?? event.activeAthleteId,
      judges: resetJudgeDeck(event.judges)
    };
  });
}

export function applyActionToJudge(
  workspace: EventWorkspace,
  judgeId: string,
  action: JudgeActionDefinition
): EventWorkspace {
  return withActiveEvent(workspace, (event) => ({
    ...event,
    focusedJudgeId: judgeId,
    judges: event.judges.map((judge) =>
      judge.id === judgeId ? applyJudgeAction(judge, action) : judge
    )
  }));
}

export function applyFocusedKeyboardAction(
  workspace: EventWorkspace,
  key: string
): EventWorkspace {
  if (key === "r" || key === "R") {
    return resetRound(workspace);
  }

  if (key === "n" || key === "N") {
    return advanceAthlete(workspace);
  }

  if (key === "s" || key === "S") {
    return saveCurrentResultAndAdvance(workspace);
  }

  const actionId = actionIdFromKeyboard(key);
  if (!actionId) {
    return workspace;
  }

  const action = judgeActionCatalog.find((entry) => entry.id === actionId);
  if (!action) {
    return workspace;
  }

  const activeEvent = getActiveEvent(workspace);
  const focusedJudge = activeEvent.judges.find(
    (judge) => judge.id === activeEvent.focusedJudgeId
  );

  if (!focusedJudge) {
    return workspace;
  }

  return applyActionToJudge(workspace, focusedJudge.id, action);
}

export function toggleJudgeConnectionState(
  workspace: EventWorkspace,
  judgeId: string
): EventWorkspace {
  return withActiveEvent(workspace, (event) => ({
    ...event,
    judges: toggleJudgeConnection(event.judges, judgeId)
  }));
}

export function saveCurrentResult(workspace: EventWorkspace): EventWorkspace {
  return withActiveEvent(workspace, (event) => {
    const activeAthlete = event.athletes.find(
      (athlete) => athlete.id === event.activeAthleteId
    );

    if (!activeAthlete) {
      return event;
    }

    const publishedScore = calculatePublishedScore(
      event.judges,
      event.meta.judgeCount
    );
    const savedResult: SavedResult = {
      id: `${event.eventId}:${activeAthlete.id}`,
      athleteId: activeAthlete.id,
      athleteName: activeAthlete.name,
      order: activeAthlete.order,
      finalScore: publishedScore.finalScore,
      savedAt: new Date().toISOString(),
      usedJudgeIds: publishedScore.usedJudgeIds,
      droppedJudgeIds: publishedScore.droppedJudgeIds,
      judgeBreakdown: publishedScore.judges
    };

    return {
      ...event,
      results: upsertResult(event.results, savedResult)
    };
  });
}

export function saveCurrentResultAndAdvance(
  workspace: EventWorkspace
): EventWorkspace {
  return advanceAthlete(saveCurrentResult(workspace));
}

export function buildStandings(event: RingSnapshot): StandingRow[] {
  return event.results
    .map((result) => {
      const athlete = event.athletes.find((entry) => entry.id === result.athleteId);

      return {
        ...result,
        club: athlete?.club ?? "",
        state: athlete?.state ?? "",
        poomsae: athlete?.poomsae ?? "",
        seed: athlete?.seed ?? null,
        rankingPoints: athlete?.rankingPoints ?? null
      };
    })
    .sort((left, right) => {
      if (right.finalScore !== left.finalScore) {
        return right.finalScore - left.finalScore;
      }

      const leftSeed = left.seed ?? Number.MAX_SAFE_INTEGER;
      const rightSeed = right.seed ?? Number.MAX_SAFE_INTEGER;

      if (leftSeed !== rightSeed) {
        return leftSeed - rightSeed;
      }

      return left.order - right.order;
    });
}

function withActiveEvent(
  workspace: EventWorkspace,
  updater: (event: RingSnapshot) => RingSnapshot
): EventWorkspace {
  const activeIndex = workspace.events.findIndex(
    (event) => event.eventId === workspace.activeEventId
  );
  const resolvedIndex = activeIndex >= 0 ? activeIndex : 0;
  const currentEvent = workspace.events[resolvedIndex];

  if (!currentEvent) {
    return workspace;
  }

  const nextEvent = stampEvent(updater(currentEvent));
  const nextEvents = workspace.events.slice();
  nextEvents[resolvedIndex] = nextEvent;

  return stampWorkspace({
    ...workspace,
    activeEventId: nextEvent.eventId,
    events: nextEvents
  });
}

function stampWorkspace(workspace: EventWorkspace): EventWorkspace {
  return {
    ...workspace,
    updatedAt: new Date().toISOString()
  };
}

function stampEvent(event: RingSnapshot): RingSnapshot {
  const nextStatus =
    event.meta.status === "completed"
      ? "completed"
      : event.results.length > 0
        ? "running"
        : "setup";

  return {
    ...event,
    meta: {
      ...event.meta,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    }
  };
}

function createEmptyEvent(
  sequence: number,
  overrides: Partial<EventDraft>
): RingSnapshot {
  const now = new Date();
  const eventDate = now.toISOString().slice(0, 10);
  const judgeCount = normalizeJudgeCount(overrides.judgeCount ?? 5);

  return {
    eventId: createEntityId("evt"),
    meta: {
      eventName: overrides.eventName?.trim() || `Nuevo evento ${sequence}`,
      venue: overrides.venue?.trim() || "Por definir",
      ringName: overrides.ringName?.trim() || `Ring ${String.fromCharCode(64 + sequence)}`,
      mode: "recognized-poomsae",
      modality: overrides.modality?.trim() || "Individual reconocido",
      branch: overrides.branch?.trim() || "Mixto",
      roundName: overrides.roundName?.trim() || "Preliminar",
      categoryLabel: overrides.categoryLabel?.trim() || "Categoria por definir",
      eventDate: overrides.eventDate?.trim() || eventDate,
      judgeCount,
      status: "setup",
      updatedAt: now.toISOString()
    },
    athletes: [],
    activeAthleteId: "",
    focusedJudgeId: "J1",
    judges: reconcileJudgeDeck([], judgeCount),
    results: []
  };
}

function reconcileJudgeDeck(
  judges: RingSnapshot["judges"],
  judgeCount: number
): RingSnapshot["judges"] {
  return Array.from({ length: judgeCount }, (_, index) => {
    const id = `J${index + 1}`;
    const existing = judges[index];

    if (!existing) {
      return createJudgeRecord(id, `Juez ${index + 1}`);
    }

    return {
      ...existing,
      id,
      name: existing.name || `Juez ${index + 1}`
    };
  });
}

function normalizeAthleteOrder(athletes: Athlete[]): Athlete[] {
  return athletes
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((athlete, index) => ({
      ...athlete,
      order: index + 1
    }));
}

function upsertResult(results: SavedResult[], nextResult: SavedResult): SavedResult[] {
  const withoutCurrentAthlete = results.filter(
    (result) => result.athleteId !== nextResult.athleteId
  );

  return [...withoutCurrentAthlete, nextResult].sort(
    (left, right) => left.order - right.order
  );
}

function normalizeCountryCode(value: string): string {
  const normalized = value.trim().toUpperCase();
  return normalized.length === 3 ? normalized : "MEX";
}

function normalizeJudgeCount(value: number): number {
  if (value <= 3) {
    return 3;
  }

  if (value >= 7) {
    return 7;
  }

  return value;
}

function createEntityId(prefix: string): string {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi?.randomUUID) {
    return `${prefix}-${cryptoApi.randomUUID()}`;
  }

  if (cryptoApi?.getRandomValues) {
    const bytes = new Uint8Array(16);
    cryptoApi.getRandomValues(bytes);

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    return `${prefix}-${formatUuidFromBytes(bytes)}`;
  }

  entityIdSequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${entityIdSequence.toString(36)}`;
}

function formatUuidFromBytes(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join("-");
}
