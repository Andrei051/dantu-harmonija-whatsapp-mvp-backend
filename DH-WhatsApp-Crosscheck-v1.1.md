# Cross-check v1.1 — final evidence → rule map

**Date:** 2026-09-18  
**Status:** Gate 1 clinic clarification closed · baselines reconciled · **narrow unfreeze authorised for v1.1 alignment**  
**Governance label:** *clinic-reviewed baseline* (derived from returned workbook — not a verbatim clinic approval of these internal docs)
**Unfreeze note:** `DH-WhatsApp-Unfreeze-v1.1.md`

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
| Implementation unfreeze | ✅ Narrow pass only — see `DH-WhatsApp-Unfreeze-v1.1.md` |

**Do not** send Aušra another review pack or clarification email on Saturday hours / landline.

---

## Artefacts

| Artefact | Role |
|---|---|
| `docs/clinic-review/2026.09.18-DH-WhatsApp-Clinic-Review-LT-v1-RETURNED.xlsx` | Clinic evidence |
| `docs/clinic-review/2026.09.18-returned-review-extract.txt` | Comment extract |
| `DH-WhatsApp-Registration-Inventory-v1.md` | Online bookable set |
| `DH-WhatsApp-Foundation-v1.1.md` | Knowledge baseline (derived) |
| `DH-WhatsApp-Behaviour-Scope-v1.1.md` | Behaviour baseline (derived) |

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

## Cleanups applied after internal read

1. Price rule labelled **clinic-requested source rule** (not premature “approved policy”).  
2. Saturday / landline → **documented source differences**, not parked questions.  
3. Explicit `clinic_opening_hours` vs `whatsapp_human_response_window` + provenance.  
4. Catalogue: **Estetinis protezavimas** only (no laminatės Foundation row); synonyms → interpreter.  
5. Catalogue: **Diagnostika** (not slash dual name); booking types stay in inventory.  
6. Urgent path: never divert to online registration.  
7. Interim price cache must carry source + sync metadata.  

---

## After implementation

Once code + regression + production smoke match these baselines, freeze as:

- Foundation v1.1 — clinic-reviewed baseline  
- Behaviour & Scope v1.1 — clinic-reviewed baseline  
- Deterministic implementation v1.1 — aligned and live  
- Regression suite — green  
- Production smoke — passed  

Then treat deterministic v1.1 as the experimental control baseline (Phase 2 NL evaluation). Prefer that wording over “Clinic Approved.”

**Logged follow-up (not in this pass):** automate price-source synchronisation/retrieval.
