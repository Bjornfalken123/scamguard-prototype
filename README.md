# ScamGuard App Prototype v2

Detta är en mobil webapp/PWA-prototyp som kan deployas direkt som Cloudflare Worker.
Den har inga externa kopplingar. All telefoni, AI och notiser är mockade på ytan.

## Cloudflare settings

- Root directory: `worker`
- Build command: `npm install`
- Deploy command: `npx wrangler deploy`
- Output directory: lämna tomt

## Vad som ingår

- Dashboard/översikt
- Skyddsinställningar
- Anhöriga och nödkontakter
- Samtalshistorik
- Rapporter/statistik
- Installationsguide för vidarekoppling
- Simulerat inkommande samtal
- Mockad AI-screening och blockering
- PWA-manifest och service worker

## Test i mobil

Öppna din workers.dev-URL i mobilen. På iPhone: Safari → Dela → Lägg till på hemskärmen.

## Viktigt

Detta är en klickbar produktprototyp. Den kopplar inte samtal, skickar inte SMS och använder ingen riktig AI ännu.
