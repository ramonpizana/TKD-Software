import {
  actionIdFromKeyboard,
  applyJudgeAction,
  judgeActionCatalog,
  resetJudgeDeck,
  toggleJudgeConnection,
  type JudgeActionDefinition
} from "./scoring";
import type { RingSnapshot } from "./schemas";

export function stampSnapshot(snapshot: RingSnapshot): RingSnapshot {
  return {
    ...snapshot,
    meta: {
      ...snapshot.meta,
      updatedAt: new Date().toISOString()
    }
  };
}

export function selectAthlete(
  snapshot: RingSnapshot,
  athleteId: string
): RingSnapshot {
  return stampSnapshot({
    ...snapshot,
    activeAthleteId: athleteId,
    judges: resetJudgeDeck(snapshot.judges)
  });
}

export function focusJudge(
  snapshot: RingSnapshot,
  judgeId: string
): RingSnapshot {
  return stampSnapshot({
    ...snapshot,
    focusedJudgeId: judgeId
  });
}

export function resetRound(snapshot: RingSnapshot): RingSnapshot {
  return stampSnapshot({
    ...snapshot,
    judges: resetJudgeDeck(snapshot.judges)
  });
}

export function advanceAthlete(snapshot: RingSnapshot): RingSnapshot {
  const sortedAthletes = snapshot.athletes
    .slice()
    .sort((left, right) => left.order - right.order);
  const currentIndex = sortedAthletes.findIndex(
    (athlete) => athlete.id === snapshot.activeAthleteId
  );
  const nextAthlete = sortedAthletes[(currentIndex + 1) % sortedAthletes.length];

  return stampSnapshot({
    ...snapshot,
    activeAthleteId: nextAthlete.id,
    judges: resetJudgeDeck(snapshot.judges)
  });
}

export function applyActionToJudge(
  snapshot: RingSnapshot,
  judgeId: string,
  action: JudgeActionDefinition
): RingSnapshot {
  return stampSnapshot({
    ...snapshot,
    focusedJudgeId: judgeId,
    judges: snapshot.judges.map((judge) =>
      judge.id === judgeId ? applyJudgeAction(judge, action) : judge
    )
  });
}

export function applyFocusedKeyboardAction(
  snapshot: RingSnapshot,
  key: string
): RingSnapshot {
  if (key === "r" || key === "R") {
    return resetRound(snapshot);
  }

  if (key === "n" || key === "N") {
    return advanceAthlete(snapshot);
  }

  const actionId = actionIdFromKeyboard(key);
  if (!actionId) {
    return snapshot;
  }

  const action = judgeActionCatalog.find((entry) => entry.id === actionId);
  if (!action) {
    return snapshot;
  }

  const focusedJudge = snapshot.judges.find(
    (judge) => judge.id === snapshot.focusedJudgeId
  );

  if (!focusedJudge) {
    return snapshot;
  }

  return applyActionToJudge(snapshot, focusedJudge.id, action);
}

export function toggleJudgeConnectionState(
  snapshot: RingSnapshot,
  judgeId: string
): RingSnapshot {
  return stampSnapshot({
    ...snapshot,
    judges: toggleJudgeConnection(snapshot.judges, judgeId)
  });
}

