import { z } from "zod";

export const athleteSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  club: z.string().min(2).max(80),
  countryCode: z.string().regex(/^[A-Z]{3}$/),
  division: z.string().min(2).max(60),
  category: z.string().min(2).max(60),
  ageBand: z.string().min(2).max(40),
  poomsae: z.string().min(2).max(80),
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
  ringName: z.string().min(1).max(40),
  mode: z.literal("recognized-poomsae"),
  judgeCount: z.number().int().min(3).max(7),
  updatedAt: z.string().datetime()
});

export const ringSnapshotSchema = z.object({
  meta: tournamentMetaSchema,
  athletes: z.array(athleteSchema).min(1),
  activeAthleteId: z.string().min(1),
  focusedJudgeId: z.string().min(1),
  judges: z.array(judgeRecordSchema).min(3).max(7)
});

export type Athlete = z.infer<typeof athleteSchema>;
export type JudgeDeduction = z.infer<typeof judgeDeductionSchema>;
export type JudgeRecord = z.infer<typeof judgeRecordSchema>;
export type TournamentMeta = z.infer<typeof tournamentMetaSchema>;
export type RingSnapshot = z.infer<typeof ringSnapshotSchema>;

