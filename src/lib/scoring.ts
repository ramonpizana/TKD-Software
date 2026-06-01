import type { JudgeDeduction, JudgeRecord } from "./schemas";

export const TECHNICAL_MAX = 4;
export const PRESENTATION_MAX = 6;

export interface JudgeActionDefinition {
  id: string;
  label: string;
  bucket: "technical" | "presentation";
  amount: number;
  keyHint: string;
  reason: string;
}

export interface JudgeScoreSummary {
  id: string;
  name: string;
  technical: number;
  presentation: number;
  total: number;
  deductions: number;
}

export interface PublishedScore {
  finalScore: number;
  usedJudgeIds: string[];
  droppedJudgeIds: string[];
  judges: JudgeScoreSummary[];
}

export const judgeActionCatalog: JudgeActionDefinition[] = [
  {
    id: "tech-major",
    label: "Tecnica -0.3",
    bucket: "technical",
    amount: 0.3,
    keyHint: "ArrowUp",
    reason: "Error mayor de exactitud"
  },
  {
    id: "tech-minor",
    label: "Tecnica -0.1",
    bucket: "technical",
    amount: 0.1,
    keyHint: "ArrowDown",
    reason: "Error menor de exactitud"
  },
  {
    id: "presentation-major",
    label: "Presentacion -0.3",
    bucket: "presentation",
    amount: 0.3,
    keyHint: "ArrowRight",
    reason: "Error visible de ritmo, potencia o energia"
  },
  {
    id: "presentation-minor",
    label: "Presentacion -0.1",
    bucket: "presentation",
    amount: 0.1,
    keyHint: "ArrowLeft",
    reason: "Detalle menor de ritmo, potencia o energia"
  }
];

const keyToActionId = new Map(
  judgeActionCatalog.map((action) => [action.keyHint, action.id])
);

export function actionIdFromKeyboard(key: string): string | undefined {
  return keyToActionId.get(key);
}

export function createJudgeRecord(
  id: string,
  name: string,
  connected = true
): JudgeRecord {
  return {
    id,
    name,
    technical: TECHNICAL_MAX,
    presentation: PRESENTATION_MAX,
    connected,
    deductions: []
  };
}

export function getJudgeTotal(judge: JudgeRecord): number {
  return round2(judge.technical + judge.presentation);
}

export function resetJudgeRecord(judge: JudgeRecord): JudgeRecord {
  return {
    ...judge,
    technical: TECHNICAL_MAX,
    presentation: PRESENTATION_MAX,
    deductions: []
  };
}

export function resetJudgeDeck(judges: JudgeRecord[]): JudgeRecord[] {
  return judges.map(resetJudgeRecord);
}

export function toggleJudgeConnection(
  judges: JudgeRecord[],
  judgeId: string
): JudgeRecord[] {
  return judges.map((judge) =>
    judge.id === judgeId ? { ...judge, connected: !judge.connected } : judge
  );
}

export function applyJudgeAction(
  judge: JudgeRecord,
  action: JudgeActionDefinition
): JudgeRecord {
  if (!judge.connected) {
    return judge;
  }

  const currentValue = judge[action.bucket];
  const nextValue = Math.max(0, round2(currentValue - action.amount));
  const appliedAmount = round2(currentValue - nextValue);

  if (appliedAmount <= 0) {
    return judge;
  }

  const deduction: JudgeDeduction = {
    id: `${judge.id}-${Date.now()}-${judge.deductions.length + 1}`,
    actionId: action.id,
    bucket: action.bucket,
    amount: appliedAmount,
    label: action.label,
    appliedAt: new Date().toISOString()
  };

  return {
    ...judge,
    [action.bucket]: nextValue,
    deductions: [...judge.deductions, deduction]
  };
}

export function calculatePublishedScore(
  judges: JudgeRecord[],
  configuredJudgeCount = judges.length
): PublishedScore {
  const activeJudges = judges.slice(0, configuredJudgeCount);
  const summaries = activeJudges.map((judge) => ({
    id: judge.id,
    name: judge.name,
    technical: judge.technical,
    presentation: judge.presentation,
    total: getJudgeTotal(judge),
    deductions: judge.deductions.length
  }));

  let usedSummaries = summaries;
  let droppedJudgeIds: string[] = [];

  if (configuredJudgeCount >= 5) {
    const ranked = summaries
      .map((summary, index) => ({ summary, index }))
      .sort((left, right) => left.summary.total - right.summary.total || left.index - right.index);

    const droppedIndexes = new Set([
      ranked[0]?.index,
      ranked[ranked.length - 1]?.index
    ]);

    usedSummaries = summaries.filter((_, index) => !droppedIndexes.has(index));
    droppedJudgeIds = summaries
      .filter((_, index) => droppedIndexes.has(index))
      .map((summary) => summary.id);
  }

  const finalScore =
    usedSummaries.length === 0
      ? 0
      : round2(
          usedSummaries.reduce((sum, judge) => sum + judge.total, 0) /
            usedSummaries.length
        );

  return {
    finalScore,
    usedJudgeIds: usedSummaries.map((judge) => judge.id),
    droppedJudgeIds,
    judges: summaries
  };
}

export function formatScore(score: number): string {
  return score.toFixed(2);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

