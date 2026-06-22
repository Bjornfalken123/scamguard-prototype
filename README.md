# ScamGuard Complete Prototype

En komplett men extern-kopplingsfri prototyp för ett AI-samtalsskydd för seniorer.

## Vad som ingår

- `apps/mobile` – Flutter-app för iOS och Android.
- `worker` – Cloudflare Worker backend med mockad AI, telefoni och samtalsrouting.
- `docs` – arkitektur, setup och nästa steg.

## Viktigt

Den här prototypen använder inga externa kopplingar. Ingen Twilio, Sinch, Telnyx, OpenAI eller databas krävs.

Allt är förberett för att bytas ut senare via adapters:

- `worker/src/adapters/telephony.ts`
- `worker/src/adapters/ai.ts`
- `worker/src/storage.ts`

## Snabbstart via Cloudflare + GitHub

1. Ladda upp hela projektet till GitHub.
2. Skapa en Cloudflare Worker från mappen `worker`.
3. Deploy command:

```bash
npm install && npm run deploy
```

4. Worker root directory:

```text
worker
```

## Mobilappen

Flutter-appen är en prototyp-UI. Den kan byggas vidare till riktig iOS/Android-app.

Appen visar:

- Skyddsstatus
- Senaste samtal
- Riskbedömningar
- Anhörigvy
- Inställningar

Just nu använder mobilappen mockdata och är förberedd för att kopplas till Cloudflare Worker API.

## Backend endpoints

Efter deploy:

- `/` – webbdemo
- `/health` – status
- `/api/profile` – seniorprofil
- `/api/calls` – samtalslogg
- `/api/simulate-call` – simulera inkommande okänt samtal
- `/voice/incoming` – mockad telefoni-webhook

## Produktprincip

På iOS ska appen inte försöka lyssna på vanliga telefonsamtal. Rätt arkitektur är:

```text
Okänt samtal
→ vidarekopplas till ScamGuard-nummer
→ AI screenar samtalet
→ tryggt samtal kopplas vidare
→ misstänkt samtal stoppas eller varnar anhörig
```

