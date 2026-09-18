# Cross-check: Behaviour & Scope v1 ↔ Foundation v1 ↔ WhatsApp implementation

**Status:** CLOSED — implementation LIVE VERIFIED (2026-09-17)  
**Documents:** `DH-WhatsApp-Behaviour-Scope-v1.md` · `DH-WhatsApp-Foundation-v1.md`  
**Acceptance tests:** `src/tests/behaviour-v1-acceptance.test.ts` (127/127)  
**Implementation freeze:** No further changes until clinic correction or genuine acceptance defect.

---

## Formal gate record

| Item | State |
|---|---|
| Behaviour v1 implementation | LIVE VERIFIED ✅ |
| Automated tests | 127/127 ✅ |
| Production smoke tests | PASS ✅ |
| Foundation structure | READY FOR CLINIC REVIEW ✅ |
| Foundation / Behaviour clinic approval | Pending |
| Patient QR pilot | **Not opened** |

**Distinction to preserve:** Live fidelity means the bot faithfully represents the *proposed* Behaviour & Scope. It does **not** mean Foundation v1 is approved or that the assistant is ready for the patient QR pilot. Remaining gate: clinic approval of how it behaves and what it knows.

---

## Production smoke (2026-09-17)

| Scenario | Live result | Status |
|---|---|---|
| Sveiki | Capability response, no Option C | ✅ |
| Location | Correct 1A-24 address | ✅ |
| Named doctor + booking | Booking/contact redirect over implant service | ✅ |
| Price + availability | Known price first, then availability redirect | ✅ |
| Kokia kaina? | Requests service clarification | ✅ |
| Standard price | Whitening prices + indicative-price disclaimer | ✅ |

---

## Earlier mismatch resolutions (kept for history)

| Item | Resolution |
|---|---|
| Greeting | Capability reply, `escalated: false` |
| Booking “handoff” | Contact redirect ≠ Option C team ack |
| Named doctor + booking | `vizit*` / `paskirti` → booking before service |
| Mixed questions | Supported component + action contact append |
| Insufficient price | Clarify which service |

## Option C governance

Team acknowledgement only when `escalated: true` (unknown / clinical follow-up expected). Contact redirects must not use team-ack copy.
