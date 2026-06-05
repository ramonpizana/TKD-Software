import { createJudgeRecord } from "../../ring/model/scoring";
import type { RingSnapshot } from "../../ring/model/schemas";

export const demoSnapshot: RingSnapshot = {
  eventId: "evt-demo-2026-a",
  meta: {
    eventName: "Copa TKD Software 2026",
    venue: "Centro Deportivo Norte",
    ringName: "Ring A",
    mode: "recognized-poomsae",
    modality: "Individual reconocido",
    branch: "Mixto",
    roundName: "Preliminar",
    categoryLabel: "Demo general",
    eventDate: "2026-05-31",
    judgeCount: 5,
    status: "setup",
    updatedAt: new Date("2026-05-31T19:00:00.000Z").toISOString()
  },
  athletes: [
    {
      id: "ath-001",
      name: "Valeria Soto",
      club: "Tigres TKD",
      state: "Nuevo Leon",
      countryCode: "MEX",
      division: "Female Cadet",
      category: "Individual Recognized",
      ageBand: "12-14",
      poomsae: "Taegeuk 6 Jang",
      seed: 1,
      rankingPoints: 42,
      order: 1
    },
    {
      id: "ath-002",
      name: "Adrian Cruz",
      club: "Phoenix Martial Arts",
      state: "Texas",
      countryCode: "USA",
      division: "Male Junior",
      category: "Individual Recognized",
      ageBand: "15-17",
      poomsae: "Koryo",
      seed: 2,
      rankingPoints: 38,
      order: 2
    },
    {
      id: "ath-003",
      name: "Lucia Herrera",
      club: "Azteca Elite",
      state: "Jalisco",
      countryCode: "MEX",
      division: "Female Senior",
      category: "Individual Recognized",
      ageBand: "18-30",
      poomsae: "Keumgang",
      seed: null,
      rankingPoints: 25,
      order: 3
    },
    {
      id: "ath-004",
      name: "Nicolas Vega",
      club: "Andes TKD",
      state: "Antioquia",
      countryCode: "COL",
      division: "Male Senior",
      category: "Individual Recognized",
      ageBand: "18-30",
      poomsae: "Taebaek",
      seed: null,
      rankingPoints: null,
      order: 4
    }
  ],
  activeAthleteId: "ath-001",
  focusedJudgeId: "J1",
  judges: [
    createJudgeRecord("J1", "Juez 1"),
    createJudgeRecord("J2", "Juez 2"),
    createJudgeRecord("J3", "Juez 3"),
    createJudgeRecord("J4", "Juez 4"),
    createJudgeRecord("J5", "Juez 5")
  ],
  results: []
};

