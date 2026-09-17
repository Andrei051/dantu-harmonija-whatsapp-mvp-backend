# Cross-check: Behaviour & Scope v1 ↔ Foundation v1 ↔ WhatsApp implementation

**Status:** Implementation aligned with Behaviour v1 (2026-09-17)  
**Documents:** `DH-WhatsApp-Behaviour-Scope-v1.md` · `DH-WhatsApp-Foundation-v1.md`  
**Acceptance tests:** `src/tests/behaviour-v1-acceptance.test.ts`

---

## Verdict

**Knowledge side:** structurally ready for clinic review (Foundation unchanged in coverage).  
**Behaviour side:** five mismatches resolved in code so Behaviour & Scope describes demonstrable behaviour — do not weaken Behaviour to match the old prototype.

**Gate:** Align implementation ✅ → acceptance pack green → then clinic reviews Behaviour + Foundation → limited-live-use.

---

## Resolved mismatches

| Item | Resolution |
|---|---|
| Greeting | `Sveiki` / `Labas` / `Hello` → `assistant_capabilities`, `escalated: false` |
| Booking “handoff” | Docs: **contact redirect** vs **Option C team ack**. Booking never implies WhatsApp team follow-up |
| Named doctor + booking | `vizita`/`vizitą`/`paskirti` stems → `booking_request` before service (Aušra phrase covered) |
| Mixed questions | Supported price (when service known) + availability/booking contact append — principle-based |
| Insufficient price | `Kokia kaina?` → clarify which service (no send-away, no Option C) |

## Option C governance

Team acknowledgement only when `escalated: true` (unknown / clinical follow-up expected). Contact redirects must not use team-ack copy.
