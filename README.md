# Dantu Harmonija WhatsApp Assistant MVP Backend

Small deterministic backend for a WhatsApp assistant that answers patient questions from structured clinic website knowledge only.

## Run locally

1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Health check:
   - `GET http://localhost:3000/health`
4. Test message endpoint:
   - `POST http://localhost:3000/messages/test`
   - Body:
     ```json
     {
       "message": "Kokios darbo valandos?"
     }
     ```

## Environment variables

- `PORT` (default `3000`)
- `WHATSAPP_VERIFY_TOKEN` (required for `GET /webhook` verification with Meta)
- `WHATSAPP_ACCESS_TOKEN` (Graph API token for outbound messages)
- `WHATSAPP_PHONE_NUMBER_ID` (WhatsApp Business phone number id for `POST /v22.0/{id}/messages`)

## Run tests

- Run all tests once:
  - `npm test`
- Run tests in watch mode:
  - `npm run test:watch`
- Current suite covers:
  - `classifier`
  - `languageService`
  - `responseBuilder`
  - `webhook` routes (`GET /webhook`, `POST /webhook`)

## Webhook endpoints (Meta Cloud API ready)

- `GET /webhook`
  - Used by Meta for webhook verification.
  - Validates:
    - `hub.mode=subscribe`
    - `hub.verify_token` matches `WHATSAPP_VERIFY_TOKEN`
  - Returns `hub.challenge` as plain text on success, `403` otherwise.

- `POST /webhook`
  - Accepts Meta webhook payloads.
  - Returns `200` quickly.
  - Processes inbound text messages only and runs deterministic assistant pipeline.
  - Logs structured processing output (sender, message, intent, language, escalation, response).
  - When `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are set, sends an outbound reply (Option C: full reply for normal messages; short acknowledgment only when escalated).
  - Unsupported event types are ignored safely.

## Local webhook testing

1. Start server:
   - `npm run dev`
2. Verify endpoint manually:
   - `GET http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=<YOUR_TOKEN>&hub.challenge=123`
3. Send sample inbound text payload:
   - `POST http://localhost:3000/webhook` with JSON body matching Meta structure.

Meta webhook verification requires a public HTTPS URL. For local development, expose this app using a temporary HTTPS tunnel and set that public URL in Meta webhook configuration.

## Current scope (MVP)

- Deterministic intent classification (no LLM)
- Lithuanian-first responses with simple English detection
- Structured responses from JSON knowledge only
- Supported intents:
  - `clinic_hours`
  - `clinic_location`
  - `parking`
  - `contact`
  - `service_info`
  - `price_info`
  - `language_switch`
  - `clinical_or_urgent`
  - `unknown`
- Safe escalation for urgent/clinical requests
- No booking, no diagnosis, no calendar integration

## Limitations

- Keyword-based classification can miss nuanced messages
- Placeholder data still needs exact extraction/verification from the clinic website
- Outbound replies require Graph API credentials in environment variables
- No persistent conversation state yet

## Next step: AI layer

When deterministic coverage is stable, add an AI layer on top of this service for better language understanding while keeping these safety/guardrail rules:
- Retrieval only from approved structured knowledge
- Deterministic escalation for clinical/urgent requests
- Strict prohibition on diagnosis and booking execution
