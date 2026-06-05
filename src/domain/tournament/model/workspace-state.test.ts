import { describe, expect, it } from "vitest";
import { judgeActionCatalog } from "../../ring/model/scoring";
import { demoSnapshot } from "../fixtures/demoSnapshot";
import { createWorkspaceFromEvent } from "./persistence";
import {
  addAthlete,
  applyActionToJudge,
  buildStandings,
  createEvent,
  saveCurrentResult
} from "./workspace-state";

describe("event workspace state", () => {
  it("creates a second local event without replacing the active workspace", () => {
    const workspace = createWorkspaceFromEvent(demoSnapshot);

    const nextWorkspace = createEvent(workspace);

    expect(nextWorkspace.events).toHaveLength(2);
    expect(nextWorkspace.activeEventId).toBe(nextWorkspace.events[1]?.eventId);
    expect(nextWorkspace.events[1]?.meta.eventName).toContain("Nuevo evento");
  });

  it("selects the first athlete automatically when a roster starts empty", () => {
    const emptyEvent = {
      ...demoSnapshot,
      eventId: "evt-empty",
      athletes: [],
      activeAthleteId: "",
      results: []
    };
    const workspace = createWorkspaceFromEvent(emptyEvent);

    const nextWorkspace = addAthlete(workspace, {
      name: "Maria Lopez",
      club: "UNAM TKD",
      state: "CDMX",
      countryCode: "mex",
      division: "Femenil",
      category: "Senior",
      ageBand: "18-30",
      poomsae: "Koryo",
      seed: 1,
      rankingPoints: 55
    });

    expect(nextWorkspace.events[0]?.athletes).toHaveLength(1);
    expect(nextWorkspace.events[0]?.activeAthleteId).toBe(
      nextWorkspace.events[0]?.athletes[0]?.id
    );
  });

  it("overwrites the saved result for the same athlete instead of duplicating it", () => {
    const workspace = createWorkspaceFromEvent({
      ...demoSnapshot,
      meta: {
        ...demoSnapshot.meta,
        judgeCount: 3
      },
      judges: demoSnapshot.judges.slice(0, 3)
    });
    const presentationMinor = judgeActionCatalog.find(
      (action) => action.id === "presentation-minor"
    );

    if (!presentationMinor) {
      throw new Error("Expected action not found.");
    }

    const onceSaved = saveCurrentResult(workspace);
    const rescored = applyActionToJudge(onceSaved, "J1", presentationMinor);
    const twiceSaved = saveCurrentResult(rescored);

    expect(onceSaved.events[0]?.results).toHaveLength(1);
    expect(twiceSaved.events[0]?.results).toHaveLength(1);
    expect(twiceSaved.events[0]?.results[0]?.finalScore).toBeLessThan(
      onceSaved.events[0]?.results[0]?.finalScore ?? 10
    );
  });

  it("builds standings by score and then by seed", () => {
    const workspace = createWorkspaceFromEvent(demoSnapshot);
    const savedA = saveCurrentResult(workspace);
    const savedB = saveCurrentResult({
      ...savedA,
      events: [
        {
          ...savedA.events[0],
          activeAthleteId: "ath-002"
        }
      ]
    });

    const standings = buildStandings(savedB.events[0]);

    expect(standings).toHaveLength(2);
    expect(standings[0]?.athleteId).toBe("ath-001");
    expect(standings[1]?.athleteId).toBe("ath-002");
  });
});
