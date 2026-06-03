import { useEffect, useState } from "react";
import {
  addAthlete,
  advanceAthlete,
  applyActionToJudge,
  applyFocusedKeyboardAction,
  type AthleteDraft,
  buildStandings,
  createEvent,
  focusJudge,
  getActiveEvent,
  removeAthlete,
  resetRound,
  saveCurrentResult,
  saveCurrentResultAndAdvance,
  selectAthlete,
  selectEvent,
  toggleJudgeConnectionState,
  updateEventMeta
} from "../../../domain/tournament/model/workspace-state";
import {
  calculatePublishedScore,
  judgeActionCatalog
} from "../../../domain/ring/model/scoring";
import {
  loadWorkspace,
  saveWorkspace
} from "../../../domain/tournament/model/persistence";
import { demoSnapshot } from "../../../domain/tournament/fixtures/demoSnapshot";
import type { TournamentMeta } from "../../../domain/ring/model/schemas";

export function useRingControl() {
  const [workspace, setWorkspace] = useState(() => loadWorkspace(demoSnapshot));
  const snapshot = getActiveEvent(workspace);

  useEffect(() => {
    saveWorkspace(workspace);
  }, [workspace]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      ) {
        return;
      }

      setWorkspace((current) => applyFocusedKeyboardAction(current, event.key));
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
  const standings = buildStandings(snapshot);
  const activeResult = snapshot.results.find(
    (result) => result.athleteId === snapshot.activeAthleteId
  );
  const eventSummaries = workspace.events.map((event) => ({
    eventId: event.eventId,
    eventName: event.meta.eventName,
    roundName: event.meta.roundName,
    categoryLabel: event.meta.categoryLabel,
    athleteCount: event.athletes.length,
    resultCount: event.results.length,
    status: event.meta.status
  }));

  return {
    workspace,
    snapshot,
    activeAthlete,
    activeResult,
    standings,
    eventSummaries,
    publishedScore,
    judgeActions: judgeActionCatalog,
    selectAthlete: (athleteId: string) =>
      setWorkspace((current) => selectAthlete(current, athleteId)),
    focusJudge: (judgeId: string) =>
      setWorkspace((current) => focusJudge(current, judgeId)),
    applyAction: (judgeId: string, actionId: string) =>
      setWorkspace((current) => {
        const action = judgeActionCatalog.find((entry) => entry.id === actionId);

        if (!action) {
          return current;
        }

        return applyActionToJudge(current, judgeId, action);
      }),
    toggleConnection: (judgeId: string) =>
      setWorkspace((current) => toggleJudgeConnectionState(current, judgeId)),
    resetRound: () => setWorkspace((current) => resetRound(current)),
    nextAthlete: () => setWorkspace((current) => advanceAthlete(current)),
    saveResult: () => setWorkspace((current) => saveCurrentResult(current)),
    saveResultAndAdvance: () =>
      setWorkspace((current) => saveCurrentResultAndAdvance(current)),
    createEvent: () => setWorkspace((current) => createEvent(current)),
    selectEvent: (eventId: string) =>
      setWorkspace((current) => selectEvent(current, eventId)),
    updateEventMeta: (updates: Partial<TournamentMeta>) =>
      setWorkspace((current) => updateEventMeta(current, updates)),
    addAthlete: (draft: AthleteDraft) =>
      setWorkspace((current) => addAthlete(current, draft)),
    removeAthlete: (athleteId: string) =>
      setWorkspace((current) => removeAthlete(current, athleteId))
  };
}

