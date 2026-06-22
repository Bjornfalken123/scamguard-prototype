import { analyzeTranscript } from "./adapters/ai";
import { mockVoiceResponse } from "./adapters/telephony";
import { calls, profile, saveCall } from "./storage";
import type { CallRecord } from "./types";

type Env = {
  APP_NAME: string;
  MODE: string;
  FORWARD_TO_NUMBER: string;
  RISK_THRESHOLD: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" }
  });
}

function html(body: string) {
  return new Response(body, { headers: { "content-type": "text/html; charset=utf-8" } });
}

function makeCall(from = "+468555010", transcript = "Hej, jag ringer från banken. Det är bråttom, öppna BankID."): CallRecord {
  const trusted = profile.trustedContacts.includes(from);
  const ai = analyzeTranscript(transcript, trusted);
  return {
    id: crypto.randomUUID(),
    from,
    to: profile.phoneNumber,
    startedAt: new Date().toISOString(),
    status: ai.riskLevel === "high" ? "blocked" : ai.riskLevel === "medium" ? "review" : "forwarded",
    transcript,
    ...ai
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return json({ ok: true });

    if (url.pathname === "/") {
      return html(`<!doctype html>
<html lang="sv">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ScamGuard Prototype</title>
<style>body{font-family:system-ui;margin:40px;max-width:900px;line-height:1.5} .card{border:1px solid #ddd;border-radius:16px;padding:20px;margin:16px 0}.high{background:#fff1f1}.low{background:#f1fff4} code{background:#f4f4f4;padding:2px 6px;border-radius:6px}</style></head>
<body><h1>ScamGuard Prototype</h1><p>Cloudflare Worker är live. Detta är backend för mobilappen och mockad telefoni/AI.</p>
<div class="card"><b>Testa endpoints:</b><br><code>/health</code><br><code>/api/profile</code><br><code>/api/calls</code><br><code>/api/simulate-call</code><br><code>/voice/incoming</code></div>
<div class="card high"><b>Produktflöde:</b><br>Okänt samtal → ScamGuard screening → AI-riskbeslut → koppla vidare eller stoppa.</div>
</body></html>`);
    }

    if (url.pathname === "/health") {
      return json({ ok: true, app: env.APP_NAME ?? "ScamGuard", mode: env.MODE ?? "prototype" });
    }

    if (url.pathname === "/api/profile") return json(profile);
    if (url.pathname === "/api/calls") return json({ calls });

    if (url.pathname === "/api/simulate-call") {
      const from = url.searchParams.get("from") ?? undefined;
      const transcript = url.searchParams.get("text") ?? undefined;
      const call = saveCall(makeCall(from, transcript));
      return json({ decision: call });
    }

    if (url.pathname === "/voice/incoming") {
      const from = url.searchParams.get("From") ?? "+468555010";
      const transcript = url.searchParams.get("SpeechResult") ?? "Hej, jag ringer från banken. Du måste öppna BankID.";
      const call = saveCall(makeCall(from, transcript));
      const message = call.riskLevel === "high"
        ? "Detta samtal bedöms som misstänkt och kopplas inte vidare."
        : "Tack. Samtalet kopplas vidare till användaren.";
      return new Response(mockVoiceResponse(message), { headers: { "content-type": "application/xml; charset=utf-8" } });
    }

    return json({ error: "Not found", path: url.pathname }, 404);
  }
};
