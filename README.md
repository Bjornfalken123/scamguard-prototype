# ScamGuard PWA Prototype

Detta är en mobil webapp/PWA + Cloudflare Worker i samma deploy.

## Cloudflare Workers Builds

- Root directory: `worker`
- Build command: `npm install`
- Deploy command: `npx wrangler deploy`
- Output directory: lämna tomt

## Testa i mobil

Öppna Worker-URL:en i Safari/Chrome.

Exempel:
`https://scamguard-prototype.<subdomain>.workers.dev`

På iPhone: Safari → Dela → Lägg till på hemskärmen.
På Android: Chrome → meny → Lägg till på startskärmen.

## Endpoints

- `/` mobil webapp
- `/api/health` hälsotest
- `/api/demo-calls` mockade samtal
- `/api/analyze` POST med `{ "text": "..." }`
- `/voice/incoming` mockad telefoni-webhook, Twilio-lik XML

Inga externa kopplingar används.
