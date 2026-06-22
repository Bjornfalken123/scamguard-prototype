# Arkitektur

## Mål

Bygga en prototyp för seniorer där okända samtal går till en AI-screening innan senioren blir störd.

## Komponenter

```text
Mobilapp
  ↓
Cloudflare Worker API
  ↓
Mockad AI-bedömning
  ↓
Mockad telefoni-routing
```

## Varför denna modell?

iOS tillåter inte en vanlig app att automatiskt lyssna på ljudet i vanliga mobiltelefonsamtal. Därför ska samtalet screenas före det når användaren, via vidarekoppling eller operatör/telefoni-integration.

## Status i prototypen

| Del | Status |
| --- | --- |
| Mobilapp | Flutter UI med mockdata |
| Backend | Cloudflare Worker |
| AI | Regelbaserad mock |
| Telefoni | Mockade webhooks |
| Databas | In-memory mock |
| Externa kopplingar | Inga |

## Framtida adapterbyte

När externa tjänster ska in:

- Byt `MockAiAnalyzer` mot OpenAI/annan AI.
- Byt `MockTelephonyProvider` mot Twilio/Sinch/Telnyx.
- Byt in-memory storage mot Cloudflare D1/KV.
