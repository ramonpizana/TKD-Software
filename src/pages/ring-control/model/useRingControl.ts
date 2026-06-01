import { useEffect, useState } from "react";
import { loadSnapshot, saveSnapshot } from "../../../domain/ring/model/persistence";
import {
  advanceAthlete,
  applyActionToJudge,
  applyFocusedKeyboardAction,
  focusJudge,
  resetRound,
  selectAthlete,
  toggleJudgeConnectionState
} from "../../../domain/ring/model/ring-state";
import {
  calculatePublishedScore,
  judgeActionCatalog
} from "../../../domain/ring/model/scoring";
import type { RingSnapshot } from "../../../domain/ring/model/schemas";
import { demoSnapshot } from "../../../domain/tournament/fixtures/demoSnapshot";

export function useRingControl() {
  const [snapshot, setSnapshot] = useState<RingSnapshot>(() =>
    loadSnapshot(demoSnapshot)
  );

  useEffect(() => {
    saveSnapshot(snapshot);
  }, [snapshot]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }

      setSnapshot((current) => applyFocusedKeyboardAction(current, event.key));
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeAthlete = snapshot.athletes.find(
    (athlete) => athlete.id === snapshot.activeAthleteId
  );
  const publishedScore = calculatePublishedScore(
    snapshot.judges,
    snapshot.meta.judgeCount
  );

  return {
    snapshot,
    activeAthlete,
    publishedScore,
    judgeActions: judgeActionCatalog,
    selectAthlete: (athleteId: string) =>
      setSnapshot((current) => selectAthlete(current, athleteId)),
    focusJudge: (judgeId: string) =>
      setSnapshot((current) => focusJudge(current, judgeId)),
    applyAction: (judgeId: string, actionId: string) =>
      setSnapshot((current) => {
        const action = judgeActionCatalog.find((entry) => entry.id === actionId);

        if (!action) {
          return current;
        }

        return applyActionToJudge(current, judgeId, action);
      }),
    toggleConnection: (judgeId: string) =>
      setSnapshot((current) => toggleJudgeConnectionState(current, judgeId)),
    resetRound: () => setSnapshot((current) => resetRound(current)),
    nextAthlete: () => setSnapshot((current) => advanceAthlete(current))
  };
}

