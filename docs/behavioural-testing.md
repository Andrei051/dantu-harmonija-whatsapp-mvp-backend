# Behavioural test tracker

Use **`behavioural-test-tracker.csv`** (this folder) as your master sheet. Open it in Excel, Google Sheets, or LibreOffice. Add rows as you discover gaps.

## Columns

| Column | Meaning |
|--------|---------|
| **test_id** | Stable id (e.g. `P1-01`, `P2-03`). |
| **phase** | `1` single-message deterministic · `2` safety · `3` language · `4` conversation. |
| **category** | Short label (hours, safety, language, …). |
| **input_message** | Exact text to send to `/messages/test` or WhatsApp. |
| **expected_language** | `lt` or `en` (what you expect from `detectLanguage`; adjust if you disagree with the model). |
| **expected_intent** | Intent from the codebase (`clinic_hours`, `clinical_or_urgent`, `unknown`, …). |
| **expected_escalation** | `true` or `false` (`escalated` in API/logs). |
| **expected_response_type** | `full_kb` = full deterministic reply sent · `option_c_ack` = escalated path (WhatsApp sends short acknowledgment only). |
| **actual_*** | Fill from `POST /messages/test` JSON or Render logs / phone. |
| **actual_user_visible_reply** | What the user saw (or full text from test response). |
| **result** | `pass`, `fail`, or `pending`. |
| **tested_date** | ISO or free text. |
| **notes** | Mismatch detail, copy tweaks, follow-up cases. |

## How to capture actuals quickly

**Local API** (server running):

```http
POST http://localhost:3000/messages/test
Content-Type: application/json

{"message":"<input_message>"}
```

Map JSON fields: `language`, `intent`, `escalated`, `reply`. For WhatsApp, read the same fields from Render logs (`webhook_inbound_text_processed`) and what appeared on the device.

## Expected rows and the product

Some rows are **hypotheses** (especially Phase 2–4). If actual intent differs from `expected_*`, either fix the classifier/keywords or update the expected column after you decide the correct behaviour.

## Response types (current backend)

- **`full_kb`**: Not escalated; outbound body is the full `reply` string.
- **`option_c_ack`**: Escalated; outbound body is the short acknowledgment only (Option C).
