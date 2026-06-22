import type { CallRecord, SeniorProfile } from "./types";

export const profile: SeniorProfile = {
  id: "senior_demo_1",
  name: "Anna",
  phoneNumber: "+46700000000",
  protectionEnabled: true,
  trustedContacts: ["+46701111111", "+46702222222"],
  familyContacts: [{ name: "Björn", phone: "+46703333333", role: "Anhörig" }]
};

export const calls: CallRecord[] = [
  {
    id: "call_001",
    from: "+468123456",
    to: profile.phoneNumber,
    startedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    status: "blocked",
    transcript: "Hej, jag ringer från banken. Du måste öppna BankID direkt.",
    riskScore: 92,
    riskLevel: "high",
    reasons: ["Påstår sig ringa från bank", "Ber om BankID", "Skapar tidspress"],
    recommendation: "Stoppa samtalet och varna anhörig."
  },
  {
    id: "call_002",
    from: "+46701111111",
    to: profile.phoneNumber,
    startedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: "forwarded",
    transcript: "Hej, det är en betrodd kontakt.",
    riskScore: 5,
    riskLevel: "low",
    reasons: ["Numret finns i betrodda kontakter"],
    recommendation: "Koppla vidare."
  }
];

export function saveCall(call: CallRecord) {
  calls.unshift(call);
  return call;
}
