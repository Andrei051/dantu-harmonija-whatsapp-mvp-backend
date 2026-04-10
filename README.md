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
- `WHATSAPP_CAPABILITY_STATE_PATH` (optional) — JSON file path for “first reply” capability-intro state per sender. Defaults to `whatsapp-capability-seen.json` under the OS temp directory if unset.

## Run tests

- Run all tests once:
  - `npm test`
- Run tests in watch mode:
  - `npm run test:watch`
- Current suite covers:
  - `classifier`
  - `languageService`
  - `responseBuilder`
  - `whatsappOutbound` (Option C body selection)
  - `whatsappConversationIntro` (first-reply framing + persisted state)
  - `webhook` routes (`GET /webhook`, `POST /webhook`)
  - `messages` (`POST /messages/test`) and manual regression cases

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
  - Logs structured processing output (sender, `sender_key`, message, intent, language, escalation, response, `first_reply_capability`).
  - **First outbound reply per WhatsApp sender** (normalized phone id): prepends a short LT/EN capability line (services, prices, clinic; contact clinic for booking/treatment). State is stored in the optional JSON file above so it survives process restarts on a single instance.
  - When `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are set, sends an outbound reply (**Option C**: non-escalated = full reply; escalated `unknown` = short ack only; escalated `clinical_or_urgent` = full safety reply + short team ack).
  - Unsupported event types (e.g. delivery/read status without a message) are ignored safely.

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
  - `booking_request`
  - `service_info`
  - `price_info`
  - `language_switch`
  - `clinical_or_urgent`
  - `first_appointment_prep`
  - `first_visit_expectations`
  - `about_clinic`
  - `assistant_capabilities`
  - `unknown`
- Safe escalation for urgent/clinical requests
- No booking, no diagnosis, no calendar integration

## Limitations

- Keyword-based classification can miss nuanced messages
- JSON knowledge should stay aligned with the clinic website (manual updates)
- Outbound replies require Graph API credentials in environment variables
- Only **first-reply capability intro** is persisted (per sender, file-backed). Full conversation history is not stored. Multiple app instances without shared storage can each show the intro once until you add shared state (e.g. Redis).

## Next step: AI layer

When deterministic coverage is stable, add an AI layer on top of this service for better language understanding while keeping these safety/guardrail rules:
- Retrieval only from approved structured knowledge
- Deterministic escalation for clinical/urgent requests
- Strict prohibition on diagnosis and booking execution
