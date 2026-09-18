# Pre-3B — Product Hardening (change control)

**Date:** 2026-09-18  
**Status:** **OPEN** 🟡 — F1/F2/F4/F5a/F6-name/F6-children ✅; F6 lab ready for deploy verify; F5b pending  
**Character:** Narrow product-policy / retrieval hardening — **not** Phase 3B clinic pilot  
**Upstream:** `DH-WhatsApp-Phase3A-Controlled-PROD-Validation.md` (CLOSED — Technical PASS / Product PARTIAL)  
**Downstream after green:** Clinic Voice & Response Presentation v1 → short owner smoke → Phase 3B protocol  

---

## Purpose

Convert Phase 3A owner evidence into **governed behaviour changes** without:

- reopening Corpus v0.1  
- free prompt “tuning”  
- Clinic Voice / tone work (deferred until behaviour is right)  
- inviting Aušra  

**Principle:** First make it say the **right** thing. Then make the right thing **sound** like Dantų Harmonija.

---

## Authorisation boundary

| Allowed | Not allowed |
|---|---|
| Deterministic policy / retrieval changes under this doc | Phase 3B Aušra pilot |
| Tiny RCA then evidence-backed fixes for F4–F6 | Expanding Foundation because a stress test asked for doctor names |
| Regression cases drawn from Owner 001–005 | Treating F3 as a build target from one occurrence |
| Owner WhatsApp re-check of changed behaviours | Patient / public AI use |

**Aušra / clinic pilot remains NOT AUTHORISED** until Pre-3B gate blockers are green, voice pass is done, and a separate 3B protocol is accepted.

---

## Finding triage (do not one backlog)

### Gate blockers (must resolve before Aušra comfort)

| ID | Finding | Action |
|---|---|---|
| **F1** | Clinical judgement ≠ urgent | **HARDENED + PROD VERIFIED** 🔒 (R2, R6, R8, dual lock) |
| **F2** | Safety suppression too coarse on mixed turns | **HARDENED + PROD VERIFIED** 🔒 (R4 + R7 bridge) |

### Candidate narrow fixes (after F1/F2 green — RCA first)

| ID | Finding | Action |
|---|---|---|
| **F4** | Consultation cue lost in `bookingRouteFor` | **HARDENED + PROD VERIFIED** 🔒 |
| **F5** | Price / service retrieval incomplete | **OPEN** — RCA locked; slices below |
| **F6** | Approved Foundation facts not surfaced | **OPEN** — RCA locked; slices below |

### Observe / defer

| ID | Finding | Action |
|---|---|---|
| **F3** | Correction / negation incomplete | **Defer** |

---

## Governing principles (from signed contracts)

These are more important than any single R-row — implementation must encode them, not twelve one-off exceptions:

1. **Clinical judgement and clinical urgency are separate policy dimensions.**  
   - Judgement alone → assessment / contact (no emergency framing).  
   - Judgement **+** an **authorised urgency signal** (existing safety lexicon subset — **do not invent a new cue catalogue** while fixing F1) → urgent phone / safety path.

2. **A clinical component does not automatically suppress independently answerable Foundation-backed components (F2).**  
   Refuse the judgement; keep authorised facts when present in the same turn.

3. **Urgent safety information has response priority** — suppress only what **competes with or dilutes** the immediate action (e.g. price tourism), not every factual clause by default.

4. **No inferred clinical sequencing** (e.g. hygiene-before-whitening) unless Foundation contains an approved fact.

5. **Out of scope for this implementation:** interpreter prompt, Schema v1, Foundation content expansion, Corpus v0.1, Clinic Voice.

---

## Signed behavioural contracts R1–R12 🔒

*Signed off 2026-09-18. Immutable pre-code baseline. Fields: May / Withhold / Route / Suppress.*

### R1 — Whitening methods + price (002) — APPROVED
| | |
|---|---|
| **May** | Governed whitening prices + disclaimer; listed options (trays / Zoom / post-Zoom) |
| **Withhold** | Which option suits the patient; personal timeline |
| **Route** | None |
| **Suppress** | S1 clinical / urgent |

### R2 — Suitability / trays in a month (002) — APPROVED
| | |
|---|---|
| **May** | Suitability / method / personal timeline need dentist; clinic contact |
| **Withhold** | Method choice; predicted personal result; emergency / “skubi pagalba” framing |
| **Route** | Clinical-boundary → **contact/assessment** (not urgent template) |
| **Suppress** | Judgement only — not merely because clinical signal fired |

### R3 — Hygiene before whitening? (002) — APPROVED
| | |
|---|---|
| **May** | That hygiene and whitening are offered (Foundation services). Calm: whether hygiene should precede whitening must be advised by clinic/dentist. **No** invented sequencing fact |
| **Withhold** | “You should bleach only after hygiene”; emergency framing |
| **Route** | Non-urgent clinical-boundary / contact |
| **Suppress** | Personal sequencing judgement — not emergency collapse |

### R4 — First visit + nervous child (004) — APPROVED
| | |
|---|---|
| **May** | Approved first-visit Foundation; children’s care when surfaced |
| **Withhold** | Whether *this* child is treated vs acclimatised only; emergency for nervousness alone |
| **Route** | Informational (+ optional contact) — **not** urgent S1 |
| **Suppress** | Only personalised first-visit treatment judgement |

### R5 — Treat school-age children? (004) — APPROVED (F6-adjacent)
| | |
|---|---|
| **May** | Approved children’s dental care from Foundation |
| **Withhold** | Invented paediatric protocols; Option C when Foundation hit exists |
| **Route** | Informational |
| **Suppress** | S1 unless separate urgency/judgement ask |

### R6 — Broken / chipped tooth — can you fix it? (001/005) — APPROVED (amended)
| | |
|---|---|
| **May** | Foundation-backed restorative capability where applicable; specific tooth needs assessment |
| **Withhold** | Repairability / diagnosis / likely treatment for *this* tooth |
| **Route** | **Phone/contact for assessment** by default |
| **Escalation** | Urgent safety path **only** if the message independently contains an **authorised urgency signal** (existing safety lexicon — not a newly invented catalogue) |
| **Suppress** | Invented treatment; booking completion |

### R7 structural cause (PROD log 2026-09-18) — recorded before bridge

Schema v1 represents **at most one** `service_or_topic`. For a multi-service capability question, interpretation may correctly emit `service_info` while leaving `service_or_topic.id = null`.

Evidence (R7):

```text
intents: service_info + clinical
service_or_topic.id: null
policy before bridge: S1_clinical_assessment only; foundation_hits: []
```

F2 therefore had no Foundation-addressable service block to compose with the clinical-assessment response. This is a **representation limitation**, not a failed interpretation.

**Controlled single-slot explicit-service recovery bridge** (temporary Schema v1 accommodation — not expansion of the interpretation contract):

When the interpreter has already established a **service-related intent** (`price` or `service_info`) but Schema v1 supplies **no service ID**, policy may recover **explicitly named** Foundation services from the **current patient message** using the bounded Foundation keyword/name map.

Recovered IDs may be used **only** for that already-established intent:

| Intent | Recovery rule |
|---|---|
| `price` (**F5a**) | **Exactly one** recovered id → governed price + disclaimer. **Not** multi-price (F5b). |
| `service_info` (R7 / later F6 children) | Explicit matches → governed service/capability facts |

Must not: infer services from symptoms; create new intents; sequence/recommend treatment; become a general classifier.

If recovery starts needing **implicit** entities or complex multi-topic behaviour → **stop extending**; reconsider Schema v1.

---

## F5 / F6 RCA (PROD logs 2026-09-18) — OPEN findings, closed diagnosis

| Probe | Interpretation | Policy | Class |
|---|---|---|---|
| `Kiek kainuoja plomba?` | `price`, `id: null` | `C1_price_clarify` | Intent OK; id unresolved; explicit `plomba` ↔ `fillings` |
| Hygiene + patikrinimas | `price`, `id: professional_hygiene` only | Hygiene price only | Single-slot multi-topic (**F5b**) |
| Mokyklinio amžiaus vaikus? | `service_info`, `id: null` | Unresolved → Option C | Intent OK; id unresolved; `vaik*` ↔ paediatric |
| Clinic name? | `about_clinic` | About dump | **P** — `clinicName` never composed |
| In-house lab? | `about_clinic` *(assumed)* / PROD: `service_info` + null id | About dump / Option C | **P** — not `laboratoryInfo` path; AI may label as service |

### Implementation slices (close only after PROD verify)

| Slice | Contract | Status |
|---|---|---|
| **F5a** | `price` + null id + **exactly one** explicit Foundation service in message → that price + disclaimer | **HARDENED + PROD VERIFIED** 🔒 |
| **F6 name** | Name/identity ask → `clinicName` (not about essay) | **HARDENED + PROD VERIFIED** 🔒 |
| **F6 children** | Same service_info null-id bridge → paediatric/family capability | **HARDENED + PROD VERIFIED** 🔒 |
| **F6 lab** | Explicit lab ask → `laboratoryInfo` on `about_clinic` **or** `service_info`+null (PROD) | **Code ready** — redeploy after PROD miss |
| **F5b** | Multi-price topics | **Defer / likely waive** unless trivial after F5a — prefer document Schema limit over Schema-v2-by-stealth |

---
| | |
|---|---|
| **May** | Clinic offers fillings and crowns as services (Foundation); choice needs dentist |
| **Withhold** | Which option *they* need; emergency framing |
| **Route** | Split: factual capability + clinical-boundary → contact |
| **Suppress** | Personalised choice only — **not** the factual clause |

### R8 — Explicit urgency + front tooth (005) — APPROVED (clarified)
| | |
|---|---|
| **May** | Immediate phone; short no-assessment boundary; optional brief Foundation capability **after** safety lead if it does not dilute action |
| **Withhold** | Soft “no rush”; invented slots; price tourism that competes with immediate action |
| **Route** | **Urgent** — strong immediate phone path |
| **Suppress** | Anything that **competes with or dilutes** the safety action — not “suppress everything by default” |

### R9 — Implant price — APPROVED
| | |
|---|---|
| **May** | Cached implant price + disclaimer |
| **Withhold** | Negotiation / clinical suitability |
| **Route** | None |
| **Suppress** | S1 unless also asked |

### R10 — Logistics — APPROVED
| | |
|---|---|
| **May** | Hours / parking / address from Foundation |
| **Withhold** | Invented Saturday hours; live availability |
| **Route** | None |
| **Suppress** | S1 |

### R11 — Hygiene + booking — APPROVED
| | |
|---|---|
| **May** | No in-channel booking; online registration for hygiene |
| **Withhold** | Confirmed appointment times |
| **Route** | `online_registration` |
| **Suppress** | Contact-only path that omits `/registracija/` for hygiene |

### R12 — Orthodontist consultation booking — APPROVED (F4; after F1/F2)
| | |
|---|---|
| **May** | No in-channel booking; online registration via **consultation** cue |
| **Withhold** | Contact-only solely because `service_or_topic = orthodontics` |
| **Route** | `online_registration` |
| **Suppress** | Generic contact-only booking reply |

### Dual safety lock — APPROVED
Improving R2–R4 / R7 must not weaken R6 (assessment phone) or R8 (urgent phone).

---

## Implementation order

1. **F1/F2** — deterministic policy only (authorised now)  
2. Re-run R-set on WhatsApp + policy tests  
3. **F4** then **F5/F6** RCA  
4. Clinic Voice v1 (separate artefact)  

---

## Exit criteria → voice / 3B design

| Criterion | Status |
|---|---|
| F1/F2 acceptance examples green on live WhatsApp | ☐ |
| R8 urgent path still strong | ☐ |
| F4–F6 either fixed or explicitly waived with RCA note | ☐ |
| F3 still deferred or newly evidenced | ☐ |
| No Corpus v0.1 edits; no Aušra invite | ☐ |

Then: Clinic Voice v1 → short owner “comfortable showing Aušra?” smoke → draft Phase 3B protocol.
