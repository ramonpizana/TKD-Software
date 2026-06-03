import { z } from "zod";

export const athleteSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  club: z.string().min(1).max(80),
  state: z.string().max(80).default(""),
  countryCode: z.string().regex(/^[A-Z]{3}$/),
  division: z.string().min(1).max(60),
  category: z.string().min(1).max(60),
  ageBand: z.string().min(1).max(40),
  poomsae: z.string().min(1).max(80),
  seed: z.number().int().positive().nullable().default(null),
  rankingPoints: z.number().nonnegative().nullable().default(null),
  order: z.number().int().nonnegative()
});

export const judgeDeductionSchema = z.object({
  id: z.string().min(1),
  actionId: z.string().min(1),
  bucket: z.enum(["technical", "presentation"]),
  amount: z.number().nonnegative().max(1),
  label: z.string().min(2).max(80),
  appliedAt: z.string().datetime()
});

export const judgeRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(40),
  technical: z.number().min(0).max(4),
  presentation: z.number().min(0).max(6),
  connected: z.boolean(),
  deductions: z.array(judgeDeductionSchema)
});

export const tournamentMetaSchema = z.object({
  eventName: z.string().min(2).max(120),
  venue: z.string().min(1).max(120),
  ringName: z.string().min(1).max(40),
  mode: z.literal("recognized-poomsae"),
  modality: z.string().min(1).max(60),
  branch: z.string().min(1).max(60),
  roundName: z.string().min(1).max(60),
  categoryLabel: z.string().min(1).max(80),
  eventDate: z.string().min(1).max(40),
  judgeCount: z.number().int().min(3).max(7),
  status: z.enum(["setup", "running", "completed"]),
  updatedAt: z.string().datetime()
});

export const judgeScoreSummarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(40),
  technical: z.number().min(0).max(4),
  presentation: z.number().min(0).max(6),
  total: z.number().min(0).max(10),
  deductions: z.number().int().nonnegative()
});

export const savedResultSchema = z.object({
  id: z.string().min(1),
  athleteId: z.string().min(1),
  athleteName: z.string().min(2).max(80),
  order: z.number().int().nonnegative(),
  finalScore: z.number().min(0).max(10),
  savedAt: z.string().datetime(),
  usedJudgeIds: z.array(z.string().min(1)),
  droppedJudgeIds: z.array(z.string().min(1)),
  judgeBreakdown: z.array(judgeScoreSummarySchema)
});

export const ringSnapshotSchema = z.object({
  eventId: z.string().min(1),
  meta: tournamentMetaSchema,
  athletes: z.array(athleteSchema),
  activeAthleteId: z.string(),
  focusedJudgeId: z.string().min(1),
  judges: z.array(judgeRecordSchema).min(3).max(7),
  results: z.array(savedResultSchema)
});

export const eventWorkspaceSchema = z.object({
  version: z.literal(1),
  activeEventId: z.string().min(1),
  events: z.array(ringSnapshotSchema).min(1),
  updatedAt: z.string().datetime()
});

export type Athlete = z.infer<typeof athleteSchema>;
export type JudgeDeduction = z.infer<typeof judgeDeductionSchema>;
export type JudgeRecord = z.infer<typeof judgeRecordSchema>;
export type JudgeScoreSummary = z.infer<typeof judgeScoreSummarySchema>;
export type SavedResult = z.infer<typeof savedResultSchema>;
export type TournamentMeta = z.infer<typeof tournamentMetaSchema>;
export type RingSnapshot = z.infer<typeof ringSnapshotSchema>;
export type EventWorkspace = z.infer<typeof eventWorkspaceSchema>;

