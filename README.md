# ScamGuard Prototype – Cloudflare Worker

Det här är en fixad MVP som kan deployas direkt via GitHub + Cloudflare Workers Builds.

## Viktigt

Den här versionen kräver **ingen KV**, inga secrets och ingen lokal körning. Den är gjord för att inte fastna på placeholder-felet:

`KV namespace 'REPLACE_WITH_YOUR_KV_NAMESPACE_ID' is not valid`

Events sparas bara temporärt i Worker-instansen. För produktion kan KV/D1 läggas till senare.

## Filer som ska ligga direkt i GitHub-repot

Du ska se detta direkt på första nivån i GitHub:

- `package.json`
- `wrangler.toml`
- `src/worker.ts`
- `public/index.html`
- `public/app.js`
- `public/styles.css`

Lägg inte allt i en extra undermapp.

## Cloudflare-inställningar

Skapa/importera som **Worker**, inte Pages.

- Framework preset: `None`
- Build command: `npm install`
- Deploy command: `npx wrangler deploy`
- Root directory: tomt om filerna ligger i repo-root
- Output directory: tomt

## Ändra telefonnummer

I `wrangler.toml`:

```toml
FORWARD_TO_NUMBER = "+46700000000"
TRUSTED_NUMBERS = "+46701111111,+46702222222"
```

- `FORWARD_TO_NUMBER` = seniorens nummer som trygga samtal kopplas till.
- `TRUSTED_NUMBERS` = nummer som ska släppas igenom direkt.

## Testa efter deploy

Öppna:

`https://DIN-WORKER.workers.dev`

Health check:

`https://DIN-WORKER.workers.dev/api/health`

Twilio/Sinch/Telnyx webhook senare:

`POST https://DIN-WORKER.workers.dev/voice/incoming`

## Vad prototypen gör

- Webbsida för att testa svensk AI/risklogik.
- Twilio-kompatibla TwiML-svar.
- Okända nummer får AI-fråga: vem är du och varför ringer du?
- Riskabla svar stoppas.
- Trygga svar kopplas vidare.
