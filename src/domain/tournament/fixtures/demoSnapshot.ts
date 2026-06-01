import { createJudgeRecord } from "../../ring/model/scoring";
import type { RingSnapshot } from "../../ring/model/schemas";

export const demoSnapshot: RingSnapshot = {
  meta: {
    eventName: "Copa TKD Software 2026",
    ringName: "Ring A",
    mode: "recognized-poomsae",
    judgeCount: 5,
    updatedAt: new Date("2026-05-31T19:00:00.000Z").toISOString()
  },
  athletes: [
    {
      id: "ath-001",
      name: "Valeria Soto",
      club: "Tigres TKD",
      countryCode: "MEX",
      division: "Female Cadet",
      category: "Individual Recognized",
      ageBand: "12-14",
      poomsae: "Taegeuk 6 Jang",
      order: 1
    },
    {
      id: "ath-002",
      name: "Adrian Cruz",
      club: "Phoenix Martial Arts",
      countryCode: "USA",
      division: "Male Junior",
      category: "Individual Recognized",
      ageBand: "15-17",
      poomsae: "Koryo",
      order: 2
    },
    {
      id: "ath-003",
      name: "Lucia Herrera",
      club: "Azteca Elite",
      countryCode: "MEX",
      division: "Female Senior",
      category: "Individual Recognized",
      ageBand: "18-30",
      poomsae: "Keumgang",
      order: 3
    },
    {
      id: "ath-004",
      name: "Nicolas Vega",
      club: "Andes TKD",
      countryCode: "COL",
      division: "Male Senior",
      category: "Individual Recognized",
      ageBand: "18-30",
      poomsae: "Taebaek",
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
  ]
};

