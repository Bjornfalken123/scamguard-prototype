export type RiskLevel = "low" | "medium" | "high";

export type CallRecord = {
  id: string;
  from: string;
  to: string;
  startedAt: string;
  status: "screened" | "forwarded" | "blocked" | "review";
  transcript: string;
  riskScore: number;
  riskLevel: RiskLevel;
  reasons: string[];
  recommendation: string;
};

export type SeniorProfile = {
  id: string;
  name: string;
  phoneNumber: string;
  protectionEnabled: boolean;
  trustedContacts: string[];
  familyContacts: { name: string; phone: string; role: string }[];
};
