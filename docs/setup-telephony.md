# Telefoni senare

Denna prototyp har inga externa kopplingar.

När telefoni ska kopplas in senare är huvudflödet:

```text
Okänt samtal → telefonileverantör → /voice/incoming → AI-screening → vidarekoppla eller stoppa
```

Möjliga leverantörer:

- Twilio
- Sinch
- Telnyx
- Operatörsintegration

## Viktiga framtida endpoints

- `/voice/incoming` – tar emot inkommande samtal
- `/voice/gather` – tar emot svar från uppringaren
- `/voice/decision` – returnerar routingbeslut

I prototypen returneras mockade XML/TwiML-liknande svar.
