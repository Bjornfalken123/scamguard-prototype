# Cloudflare setup utan lokal terminal

1. Gå till GitHub och skapa ett nytt repo, exempelvis `scamguard-complete-prototype`.
2. Ladda upp projektets filer.
3. Gå till Cloudflare → Workers & Pages.
4. Skapa en Worker och välj GitHub-repot.
5. Sätt root directory till:

```text
worker
```

6. Sätt build/deploy command till:

```bash
npm install && npm run deploy
```

7. Deploya.

## Testa efter deploy

Byt ut URL:en mot din Worker-URL:

```text
https://DIN-WORKER.workers.dev/health
https://DIN-WORKER.workers.dev/api/calls
https://DIN-WORKER.workers.dev/api/simulate-call
```
