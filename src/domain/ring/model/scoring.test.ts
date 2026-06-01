import { describe, expect, it } from "vitest";
import {
  applyJudgeAction,
  calculatePublishedScore,
  createJudgeRecord,
  judgeActionCatalog
} from "./scoring";

describe("scoring engine", () => {
  it("clamps technical and presentation scores at zero", () => {
    const judge = createJudgeRecord("J1", "Judge 1");
    const majorTechnical = judgeActionCatalog.find(
      (action) => action.id === "tech-major"
    );
    const majorPresentation = judgeActionCatalog.find(
      (action) => action.id === "presentation-major"
    );

    if (!majorTechnical || !majorPresentation) {
      throw new Error("Required actions not found.");
    }

    let current = judge;
    for (let index = 0; index < 20; index += 1) {
      current = applyJudgeAction(current, majorTechnical);
      current = applyJudgeAction(current, majorPresentation);
    }

    expect(current.technical).toBe(0);
    expect(current.presentation).toBe(0);
  });

  it("drops highest and lowest totals when five judges are configured", () => {
    const judges = [
      createJudgeRecord("J1", "Judge 1"),
      createJudgeRecord("J2", "Judge 2"),
      createJudgeRecord("J3", "Judge 3"),
      createJudgeRecord("J4", "Judge 4"),
      createJudgeRecord("J5", "Judge 5")
    ];

    judges[0].technical = 3.7;
    judges[1].technical = 4.0;
    judges[2].technical = 3.8;
    judges[3].technical = 3.9;
    judges[4].technical = 3.5;

    const result = calculatePublishedScore(judges, 5);

    expect(result.droppedJudgeIds).toEqual(["J2", "J5"]);
    expect(result.finalScore).toBe(9.8);
  });

  it("uses all judges when there are only three", () => {
    const judges = [
      createJudgeRecord("J1", "Judge 1"),
      createJudgeRecord("J2", "Judge 2"),
      createJudgeRecord("J3", "Judge 3")
    ];

    judges[0].presentation = 5.8;
    judges[1].presentation = 5.9;
    judges[2].presentation = 5.7;

    const result = calculatePublishedScore(judges, 3);

    expect(result.droppedJudgeIds).toEqual([]);
    expect(result.finalScore).toBe(9.8);
  });
});

