export interface Env {
  ASSETS: Fetcher;
  SCAMGUARD_KV: KVNamespace;
  APP_NAME: string;
  FORWARD_TO_NUMBER: string;
  TRUSTED_NUMBERS: string;
  RISK_THRESHOLD: string;
  AI_PROVIDER: string;
}

type RiskResult = {
  score: number;
  level: "low" | "medium" | "high";
  reasons: string[];
  recommendation: string;
};

const suspiciousPatterns = [
  { phrase: "bankid", points: 25, reason: "Nämner BankID" },
  { phrase: "säkerhetsavdelningen", points: 20, reason: "Påstår sig vara säkerhetsavdelning" },
  { phrase: "banken", points: 12, reason: "Nämner bank" },
  { phrase: "polis", points: 18, reason: "Påstår koppling till polis" },
  { phrase: "swish", points: 16, reason: "Nämner Swish" },
  { phrase: "kod", points: 18, reason: "Ber om kod eller verifiering" },
  { phrase: "logga in", points: 14, reason: "Vill få personen att logga in" },
  { phrase: "installera", points: 25, reason: "Vill installera app/program" },
  { phrase: "fjärrstyr", points: 30, reason: "Indikerar fjärrstyrning" },
  { phrase: "bråttom", points: 14, reason: "Skapar tidspress" },
  { phrase: "misstänkt transaktion", points: 22, reason: "Typiskt bankbedrägerimönster" },
  { phrase: "flytta pengar", points: 28, reason: "Vill påverka pengar/transaktion" }
];

function normalizePhone(value: string | null): string {
  return (value || "").replace(/[\s()-]/g, "");
}

function trustedSet(env: Env): Set<string> {
  return new Set((env.TRUSTED_NUMBERS || "").split(",").map(normalizePhone).filter(Boolean));
}

function riskAnalyze(text: string): RiskResult {
  const lower = text.toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  for (const pattern of suspiciousPatterns) {
    if (lower.includes(pattern.phrase)) {
      score += pattern.points;
      reasons.push(pattern.reason);
    }
  }

  if (lower.length < 15) {
    score += 5;
    reasons.push("För lite information för trygg bedömning");
  }

  const capped = Math.min(score, 100);
  const level = capped >= 65 ? "high" : capped >= 35 ? "medium" : "low";
  const recommendation =
    level === "high"
      ? "Stoppa samtalet eller koppla endast efter extra bekräftelse från anhörig."
      : level === "medium"
        ? "Koppla med varning och visa sammanfattning för senior/anhörig."
        : "Koppla vidare.";

  return { score: capped, level, reasons, recommendation };
}

function twiml(xml: string): Response {
  return new Response(xml, {
    headers: { "content-type": "text/xml; charset=utf-8" }
  });
}

async function parseBody(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return await request.json();
  const form = await request.formData();
  const data: Record<string, string> = {};
  for (const [key, value] of form.entries()) data[key] = String(value);
  return data;
}

async function storeEvent(env: Env, event: unknown) {
  const id = `${Date.now()}-${crypto.randomUUID()}`;
  await env.SCAMGUARD_KV.put(`event:${id}`, JSON.stringify({ id, createdAt: new Date().toISOString(), ...event }), {
    expirationTtl: 60 * 60 * 24 * 30
  });
  return id;
}

async function listRecentEvents(env: Env) {
  const list = await env.SCAMGUARD_KV.list({ prefix: "event:", limit: 30 });
  const events = await Promise.all(
    list.keys.map(async key => {
      const raw = await env.SCAMGUARD_KV.get(key.name);
      return raw ? JSON.parse(raw) : null;
    })
  );
  return events.filter(Boolean).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, app: env.APP_NAME, time: new Date().toISOString() });
    }

    if (url.pathname === "/api/analyze" && request.method === "POST") {
      const body = await request.json() as { text?: string };
      const result = riskAnalyze(body.text || "");
      await storeEvent(env, { type: "manual-analysis", text: body.text || "", result });
      return Response.json(result);
    }

    if (url.pathname === "/api/events") {
      return Response.json(await listRecentEvents(env));
    }

    // Twilio-compatible webhook: first entry point for unknown calls.
    if (url.pathname === "/voice/incoming" && request.method === "POST") {
      const body = await parseBody(request);
      const from = normalizePhone(body.From || "unknown");
      const trusted = trustedSet(env).has(from);
      await storeEvent(env, { type: "incoming-call", from, trusted });

      if (trusted) {
        return twiml(`<Response><Dial>${env.FORWARD_TO_NUMBER}</Dial></Response>`);
      }

      return twiml(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="sv-SE">Hej. Samtalet skyddas av ${env.APP_NAME}. Säg kort vem du är och varför du ringer.</Say>
  <Gather input="speech" language="sv-SE" speechTimeout="auto" action="/voice/screen-result" method="POST">
    <Say language="sv-SE">Du kan tala efter tonen.</Say>
  </Gather>
  <Say language="sv-SE">Jag hörde inget svar. Samtalet kopplas inte vidare just nu.</Say>
  <Hangup/>
</Response>`);
    }

    // Twilio posts SpeechResult here after caller answers AI question.
    if (url.pathname === "/voice/screen-result" && request.method === "POST") {
      const body = await parseBody(request);
      const from = normalizePhone(body.From || "unknown");
      const speech = body.SpeechResult || "";
      const result = riskAnalyze(speech);
      await storeEvent(env, { type: "screen-result", from, speech, result });

      const threshold = Number(env.RISK_THRESHOLD || "65");
      if (result.score >= threshold) {
        return twiml(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="sv-SE">Tack. Samtalet kan inte kopplas vidare just nu.</Say>
  <Hangup/>
</Response>`);
      }

      return twiml(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="sv-SE">Tack. Jag kopplar dig vidare.</Say>
  <Dial>${env.FORWARD_TO_NUMBER}</Dial>
</Response>`);
    }

    return env.ASSETS.fetch(request);
  }
};
