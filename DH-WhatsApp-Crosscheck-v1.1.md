# Cross-check v1.1 — final evidence → rule map

**Date:** 2026-09-18  
**Status:** Gate 1 **implementation closed** · Deterministic v1.1 **RE-FROZEN** 🔒  
**Governance label:** *clinic-reviewed baseline* (derived from returned workbook — not a verbatim clinic approval of these internal docs)  
**Unfreeze / freeze:** `DH-WhatsApp-Unfreeze-v1.1.md` · smoke: `DH-WhatsApp-Smoke-v1.1.md`

---

## Gate status

| Step | State |
|---|---|
| Clinic input obtained | ✅ |
| Returned review reconciled | ✅ |
| Website evidence checked | ✅ |
| Registration inventory completed | ✅ |
| Foundation v1.1 reconciled with clinic input | ✅ |
| Behaviour v1.1 reconciled with clinic input | ✅ |
| No further clinic clarification currently required | ✅ |
| Narrow unfreeze → v1.1 alignment | ✅ |
| Automated suite | ✅ 140/140 |
| Production smoke | ✅ PASS |
| Deterministic v1.1 re-freeze | ✅ |

**Do not** send Aušra another review pack or clarification email on Saturday hours / landline.  
**Do not** reopen deterministic development for language UX or classifier expansion.

---

## Artefacts

| Artefact | Role |
|---|---|
| `docs/clinic-review/2026.09.18-DH-WhatsApp-Clinic-Review-LT-v1-RETURNED.xlsx` | Clinic evidence |
| `docs/clinic-review/2026.09.18-returned-review-extract.txt` | Comment extract |
| `DH-WhatsApp-Registration-Inventory-v1.md` | Online bookable set |
| `DH-WhatsApp-Foundation-v1.1.md` | Knowledge baseline (frozen) |
| `DH-WhatsApp-Behaviour-Scope-v1.1.md` | Behaviour baseline (frozen) |
| `DH-WhatsApp-Smoke-v1.1.md` | Production smoke record |
| `DH-WhatsApp-Phase2-NL-Evaluation-Charter-v1.md` | Phase 2 charter (signed off) |
| `DH-WhatsApp-NL-Corpus-v0.1.md` | Corpus manifest (frozen) |
| `data/DH-WhatsApp-NL-Corpus-v0.1.json` | Corpus cases (frozen) |
| `DH-WhatsApp-NL-Evaluation-v1.1-summary.md` | Phase 2A results summary (frozen) |
| `DH-WhatsApp-Phase2-AI-Mandate-Decision.md` | Mandate ACCEPTED (narrow) |
| `DH-WhatsApp-Phase2B-AI-Interpretation-Layer-Design-v1.md` | Interpretation layer design (agreed) |
| `DH-WhatsApp-AI-Interpretation-Schema-v1.md` | Interpretation schema (frozen) |
| `data/DH-WhatsApp-AI-Interpretation-Schema-v1.json` | Executable JSON Schema |
| `DH-WhatsApp-AI-Signal-Policy-Mapping-v1.md` | Signal → policy mapping (frozen) |
| `DH-WhatsApp-AI-Interpreter-Prompt-v0.1.md` | Interpreter prompt (frozen) |
| `DH-WhatsApp-Phase2C-Closed.md` | Phase 2C closed / Context confirmed |
| `DH-WhatsApp-Phase2D-Policy-Hardening.md` | Phase 2D scope (closed) |
| `DH-WhatsApp-Phase2D-Closed.md` | Phase 2D closed |
| `DH-WhatsApp-NL-Evaluation-v2D-offline-summary.md` | Phase 2D offline results |
| `DH-WhatsApp-Phase3-Productisation-Pilot-Gate.md` | Phase 3 productisation & pilot gate (open) |
| `DH-WhatsApp-Phase3A-Controlled-PROD-Validation.md` | Phase 3A controlled PROD validation (authorised, owner/tester) |

---

## Evidence → v1.1 rule (final)

| Evidence | v1.1 rule |
|---|---|
| + on boundaries / LT-EN / first-visit capability | Behaviour will / will-not retained |
| Registruoti… → online for consultations + hygiene | Booking: no self-book; redirect when inventory supports; else contact |
| Live `/registracija/` list | Inventory = safe claim set |
| Prices: pull from designated place + preliminary warning | Clinic-requested **source rule** + disclaimer (not static approval) |
| Disclaimer proposal | Clinic wording adopted |
| Monitor **Taip** (R25) + handoff 08–17 (R24) | `whatsapp_human_response_window` = working days 08:00–17:00 |
| Hours → Darbo dienomis 08:00–20:00 | `clinic_opening_hours` (distinct from response window) |
| Phone → +370 610 11222 | Channel phone; website landline = documented difference |
| Website still Sat / landline | Documented source differences — follow returned review |
| Kineziterapija rename; estetinis adds; Periodontologija | Catalogue names |
| Lab not patient service; no lab prices | Catalogue + price prohibitions |
| First visit + parking + consents + plan | Foundation §5 |
| Clinical/urgent | Safety + **phone** handoff; never ordinary online registration |

---

## Frozen baseline set

- Foundation v1.1 — clinic-reviewed baseline  
- Behaviour & Scope v1.1 — clinic-reviewed baseline  
- Deterministic implementation v1.1 — aligned and live  
- Regression suite — green  
- Production smoke — passed  

Deterministic v1.1 is the **control architecture** for Phase 2 natural-language evaluation. Prefer that wording over “Clinic Approved.”

**Logged follow-up (engineering, separate):** automate price-source synchronisation/retrieval.  
**Logged observation (evaluation, not fix):** LT clinical input may yield EN safety/handoff copy.
