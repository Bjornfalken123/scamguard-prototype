# ScamGuard PWA Product Prototype

Detta är en mer komplett mobil webbapp/PWA-prototyp för ScamGuard.

## Vad som ingår

- Mobilanpassad PWA som känns som en app
- Skyddsstatus för senioren
- Simulerade inkommande samtal
- Samtalsrapport med riskbedömning
- Anhörig-inställningar
- Samtalsregler
- Mockat kopplingsflöde för vidarekoppling
- Cloudflare Worker som serverar app och mockade API:er
- Inga externa tjänster, inga API-nycklar, ingen KV

## Cloudflare Workers Builds

Root directory:

```text
worker
```

Build command:

```bash
npm install
```

Deploy command:

```bash
npx wrangler deploy
```

Output directory: lämna tomt.

## Test i mobil

Öppna din workers.dev-URL i Safari/Chrome.

På iPhone:

1. Öppna URL i Safari
2. Tryck dela-knappen
3. Välj "Lägg till på hemskärmen"

På Android:

1. Öppna URL i Chrome
2. Tryck menyn
3. Välj "Installera app" eller "Lägg till på startskärmen"

## Viktigt

Detta är en yta/prototyp. Telefonin och AI:n är mockade men arkitekturen är förberedd för att kopplas vidare till telefoni- och AI-adaptrar senare.
