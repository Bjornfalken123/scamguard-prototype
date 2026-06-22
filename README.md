# ScamGuard AI Call Filter – Cloudflare Prototype

En MVP-prototyp för ett AI-samtalsskydd där okända samtal routas till en AI-screening innan de kopplas vidare till senioren.

## Vad prototypen innehåller

- Cloudflare Worker med statisk webbyta.
- Twilio-kompatibla voice webhooks:
  - `POST /voice/incoming`
  - `POST /voice/screen-result`
- Enkel svensk regelbaserad riskmotor.
- KV-loggning av samtalsevents.
- Webbvy för att testa textanalys och se events.

## Varför den här arkitekturen funkar för iOS

iOS ger inte en vanlig app fri åtkomst till ljudet i mobiltelefonsamtal. Därför routas samtalet till er telefonibackend först. AI:n hör samtalet eftersom den är mottagande part i telefonisystemet, inte för att iPhone-appen spelar in samtalet.

## Snabbstart

```bash
npm install
npx wrangler login
npx wrangler kv namespace create SCAMGUARD_KV
```

Kopiera KV namespace-id:t till `wrangler.toml`.

Ändra sedan:

```toml
FORWARD_TO_NUMBER = "+467..."      # seniorens riktiga nummer
TRUSTED_NUMBERS = "+467...,+467..." # nummer som ska släppas igenom
RISK_THRESHOLD = "65"
```

Kör lokalt:

```bash
npm run dev
```

Deploy:

```bash
npm run deploy
```

## Koppla telefoni

Med Twilio som exempel:

1. Köp/konfigurera ett telefonnummer.
2. Sätt Voice webhook till:
   `https://DIN-WORKER.workers.dev/voice/incoming`
3. Metod: `POST`.
4. För villkorad vidarekoppling: låt seniorens operatör vidarekoppla okända/missade samtal till Twilio-numret, eller bygg detta genom operatörspartner.

## Viktiga nästa steg för riktig produkt

- Konto/inloggning för senior och anhörig.
- Kontaktimport och allowlist per användare.
- Riktig telefoni-provider: Twilio, Sinch, Telnyx eller operatör.
- Riktig transkribering/LLM-bedömning.
- Anhörigvarningar via SMS/push.
- Audit log, consent, datalagring och GDPR-flöden.
- Fallback om AI är osäker: koppla till anhörig eller voicemail.

## Rekommenderad produktmodell

- iOS/Android-app: onboarding, anhöriga, trusted contacts, historik.
- Cloudflare: routing, screeninglogik, dashboard, API.
- Telefoni-provider: tar emot okända samtal och kopplar vidare.
- AI: transkribering + riskklassning + sammanfattning.
