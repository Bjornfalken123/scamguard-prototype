const demoCalls = [
  { id: 'call_1001', from: '+46735550123', label: 'Okänt nummer', risk: 88, status: 'Stoppat', reason: 'Påstår sig ringa från banken och skapar tidspress.', transcript: 'Hej, det är från säkerhetsavdelningen på banken. Du måste öppna BankID nu.' },
  { id: 'call_1002', from: '+4685550100', label: 'Vårdcentralen', risk: 18, status: 'Släppt vidare', reason: 'Legitimt ärende, ingen känslig information efterfrågas.', transcript: 'Hej, vi ringer från vårdcentralen för att bekräfta din tid.' },
  { id: 'call_1003', from: '+46701230000', label: 'Okänt nummer', risk: 71, status: 'Varnar anhörig', reason: 'Ber användaren installera app och dela skärm.', transcript: 'Jag hjälper dig med datorn. Installera fjärrhjälpsappen så löser vi problemet.' }
];

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}
function xml(body) { return new Response(body, { headers: { 'content-type': 'text/xml; charset=utf-8' } }); }

function analyzeText(text = '') {
  const rules = [
    ['bankid', 35], ['bank-id', 35], ['banken', 20], ['säkerhetsavdelningen', 25], ['bråttom', 20], ['omedelbart', 20], ['kod', 25], ['lösenord', 25], ['installera', 25], ['fjärrhjälp', 30], ['dela skärm', 35], ['överför', 35], ['swish', 25]
  ];
  const lower = text.toLowerCase();
  let risk = 8; const hits = [];
  for (const [term, score] of rules) if (lower.includes(term)) { risk += score; hits.push(term); }
  risk = Math.min(99, risk);
  return { risk, decision: risk >= 65 ? 'block_or_verify' : risk >= 35 ? 'warn' : 'allow', hits, explanation: hits.length ? `Hittade riskord: ${hits.join(', ')}` : 'Inga tydliga bedrägerisignaler i texten.' };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true, app: env.APP_NAME || 'ScamGuard', mode: 'pwa-prototype' });
    if (url.pathname === '/api/demo-calls') return json({ calls: demoCalls });
    if (url.pathname === '/api/analyze' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      return json(analyzeText(body.text || ''));
    }
    if (url.pathname === '/voice/incoming') {
      return xml(`<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say language="sv-SE">Hej. Detta samtal screenas av ScamGuard innan det kopplas vidare.</Say>\n  <Gather input="speech" language="sv-SE" action="/voice/analyze" method="POST" timeout="5">\n    <Say language="sv-SE">Säg kort vem du är och varför du ringer.</Say>\n  </Gather>\n</Response>`);
    }
    if (url.pathname === '/voice/analyze') {
      return xml(`<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say language="sv-SE">Tack. Samtalet analyseras. I denna prototyp är telefoni mockad.</Say>\n</Response>`);
    }
    return env.ASSETS.fetch(request);
  }
};
