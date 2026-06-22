import type { RiskLevel } from "../types";

export type AiDecision = {
  riskScore: number;
  riskLevel: RiskLevel;
  reasons: string[];
  recommendation: string;
};

const riskWords = [
  { word: "bankid", score: 35, reason: "Nämner BankID" },
  { word: "banken", score: 20, reason: "Påstår bankärende" },
  { word: "kod", score: 20, reason: "Ber om kod eller säkerhetsuppgift" },
  { word: "överför", score: 25, reason: "Pratar om överföring" },
  { word: "bråttom", score: 15, reason: "Skapar tidspress" },
  { word: "polis", score: 20, reason: "Påstår myndighetskontakt" },
  { word: "installera", score: 25, reason: "Ber användaren installera något" }
];

export function analyzeTranscript(transcript: string, trusted: boolean): AiDecision {
  if (trusted) {
    return { riskScore: 5, riskLevel: "low", reasons: ["Numret är betrodd kontakt"], recommendation: "Koppla vidare." };
  }

  const lower = transcript.toLowerCase();
  const reasons: string[] = [];
  let score = 10;

  for (const item of riskWords) {
    if (lower.includes(item.word)) {
      score += item.score;
      reasons.push(item.reason);
    }
  }

  const riskScore = Math.min(score, 100);
  const riskLevel: RiskLevel = riskScore >= 65 ? "high" : riskScore >= 35 ? "medium" : "low";
  const recommendation = riskLevel === "high"
    ? "Stoppa samtalet och varna anhörig."
    : riskLevel === "medium"
      ? "Be uppringaren förklara ärendet tydligare innan vidarekoppling."
      : "Koppla vidare.";

  return { riskScore, riskLevel, reasons: reasons.length ? reasons : ["Inga tydliga bedrägerimönster hittades"], recommendation };
}
