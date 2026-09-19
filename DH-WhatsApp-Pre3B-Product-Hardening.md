# Pre-3B — Product Hardening (change control)

**Date:** 2026-09-18  
**Status:** **COMPLETE** ✅ — functional hardening + Clinic Voice Option A frozen  
**Character:** Narrow product-policy / retrieval hardening — **not** Phase 3B clinic pilot  
**Upstream:** `DH-WhatsApp-Phase3A-Controlled-PROD-Validation.md` (CLOSED — Technical PASS / Product PARTIAL)  
**Downstream:** `DH-WhatsApp-Clinic-Voice-Response-Presentation-v1.md` (**FROZEN**) → owner “comfortable showing Aušra?” smoke → Phase 3B protocol  

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
| **F5** | Price / service retrieval incomplete | **CLOSED** — F5a fixed; F5b waived (not an open defect) |
| **F6** | Approved Foundation facts not surfaced | **HARDENED + PROD VERIFIED** 🔒 (name / children / lab) |

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

## F5 / F6 RCA (PROD logs 2026-09-18) — diagnosis closed; slices dispositioned

| Probe | Interpretation | Policy | Class |
|---|---|---|---|
| `Kiek kainuoja plomba?` | `price`, `id: null` | `C1_price_clarify` | Intent OK; id unresolved; explicit `plomba` ↔ `fillings` → **F5a** |
| Hygiene + patikrinimas | `price`, `id: professional_hygiene` only | Hygiene price only | Single-slot multi-topic → **F5b waived** |
| Mokyklinio amžiaus vaikus? | `service_info`, `id: null` | Unresolved → Option C | Intent OK; id unresolved; `vaik*` ↔ paediatric → **F6 children** |
| Clinic name? | `about_clinic` | About dump | **P** — `clinicName` never composed → **F6 name** |
| In-house lab? | PROD flap: `service_info`+null → `other`+unsupported | Option C | **P** — recover via message cues → **F6 lab** |

### Implementation slices

| Slice | Contract | Status |
|---|---|---|
| **F5a** | `price` + null id + **exactly one** explicit Foundation service in message → that price + disclaimer | **HARDENED + PROD VERIFIED** 🔒 |
| **F6 name** | Name/identity ask → `clinicName` (not about essay) | **HARDENED + PROD VERIFIED** 🔒 |
| **F6 children** | Same service_info null-id bridge → paediatric/family capability | **HARDENED + PROD VERIFIED** 🔒 |
| **F6 lab** | Explicit lab ask → `laboratoryInfo` via message cues (intent-agnostic) | **HARDENED + PROD VERIFIED** 🔒 |
| **F5b** | Multi-price topics | **WAIVED** — accepted Schema v1 limitation (below) |

### F5b — Multi-price topics: ACCEPTED SCHEMA v1 LIMITATION 🔒

Schema v1 represents one `service_or_topic`. Where a patient requests prices for multiple services in one turn, the interpreter may resolve only one service. Pre-3B will **not** introduce multi-ID price recovery because doing so would extend the single-slot accommodation into a parallel multi-topic representation layer.

| | |
|---|---|
| **Boundary** | F5a fixed a defect (one explicit service, one price intent, missing ID). F5b is different: the patient genuinely asks about multiple topics while Schema v1 deliberately represents one. |
| **Safe behaviour** | May answer one governed price or request clarification; must **not** invent or infer missing prices. |
| **Reconsider if** | Clinic-pilot evidence shows multi-service price questions are sufficiently frequent or disruptive to justify multi-topic representation in a future schema revision. |

F5b is **not** an unresolved F5 defect after this waiver — it is an explicit product limitation with a reconsideration trigger.

### Final Pre-3B disposition

| Finding | Final disposition |
|---|---|
| **F1** Clinical ≠ urgent | ✅ CLOSED — PROD verified |
| **F2** Clinical + factual composition | ✅ CLOSED — PROD verified |
| **F3** Correction / reference | ⏸ DEFERRED |
| **F4** Consultation routing | ✅ CLOSED — PROD verified |
| **F5a** Named service price recovery | ✅ CLOSED — PROD verified |
| **F5b** Multi-price | 🟡 WAIVED — Schema v1 limitation |
| **F6** Foundation surfacing | ✅ CLOSED — name / children / lab PROD verified |

**Functional hardening portion of Pre-3B is complete.** No further natural-language test cycle or 70-case rerun is justified for this gate. Corpus optimisation remains stopped.

### Parked for Clinic Voice (do not fix in Pre-3B policy)

Repeated first-reply boilerplate (`Galiu padėti su informacija…` / `Dėl registracijos ar gydymo klausimų…`) is increasingly conspicuous now that underlying answers are correct. Parked as **presentation**, not correctness.

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

1. **F1/F2** — deterministic policy only ✅  
2. Re-run R-set on WhatsApp + policy tests ✅  
3. **F4** then **F5/F6** RCA + slices ✅ (F5b waived)  
4. **Clinic Voice v1** (separate artefact) — **FROZEN** ✅  

---

## Exit criteria → voice / 3B design

| Criterion | Status |
|---|---|
| F1/F2 acceptance examples green on live WhatsApp | ✅ |
| R8 urgent path still strong | ✅ (unchanged; no regression observed in F4–F6 smokes) |
| F4–F6 either fixed or explicitly waived with RCA note | ✅ — F4/F5a/F6 fixed; **F5b waived** |
| F3 still deferred or newly evidenced | ✅ deferred |
| No Corpus v0.1 edits; no Aušra invite | ✅ |
| Clinic Voice Option A validated | ✅ **FROZEN** |

**Pre-3B product gate met.** Next: short owner “Would I be comfortable showing this to Aušra?” smoke → draft Phase 3B protocol.

---

## Post-freeze natural-use findings (2026-09-19)

Owner free-play after Voice freeze (not in §21 acceptance set).

| # | Patient ask | Observed reply | Classification | Note |
|---|---|---|---|---|
| **N1** | “Tell me about clinic services and prices” | Price clarification (“Which service's price…?”) | **Accepted Schema v1 / F5b-adjacent** 🔒 | Multi-need / catalogue-wide price ask collapses to single-slot clarify. **Untouched.** |
| **N2** | “Which services do you provide?” | Unsupported clinic redirect → catalogue list | **CLOSED / PROD VERIFIED** 🔒 | PROD 2026-09-19: `N2_service_catalogue_list` → governed catalogue; escalated false. |

### N2 — CLOSED / PROD VERIFIED 🔒

| | |
|---|---|
| **Cause** | Policy routing gap |
| **Interpreter** | Correct (`service_info` + null) |
| **Foundation** | Sufficient (catalogue present) |
| **Voice** | Unchanged |
| **Fix** | Explicit generic service-list ask → existing `genericServicesReply` (`N2_service_catalogue_list`). Non-list `service_info`+null still → D2. |
| **PROD** | `hello! which services do you provide?` → full Foundation catalogue list; action `N2_service_catalogue_list` |

**N1 remains accepted / untouched.** 🔒

### N3 — CLOSED / PROD VERIFIED 🔒 (2026-09-19)

| ID | Disposition |
|---|---|
| **N3a** | **CLOSED / PROD VERIFIED** — registration-info policy bridge |
| **N3b** | **CLOSED / PROD VERIFIED** — N2 cue tighten |

**N3 whole:** greeting-advertised registration info fulfils first ask and conversational correction.

**Broader lesson (record only):** greeting’s four advertised capabilities are an implicit interface contract — natural testing found routing gaps on services (N2) and registration (N3). Do not casually expand the greeting.

---

## Natural-use findings continued (2026-09-19 afternoon)

Long price-discovery conversation after catalogue. **Positive evidence:** multi-turn single-service price exploration works (hygiene, orthodontics, whitening, kinesiotherapy, paediatric). Reinforces **N1/F5b remain waived** — patients can explore one service at a time.

| ID | Observation | Disposition |
|---|---|---|
| **V2** | “Hello! how are you?” → rigid out-of-scope reply | **Voice observation only** — accept for pilot; no Voice reopen |
| **N4** | “Tell me more about services” → unsupported; “which services do you have?” → catalogue PASS | **CLOSED / PROD VERIFIED** 🔒 |
| **N5** | “what about Anaesthesia?” → `Anaesthesia costs See price page…` | **CLOSED / PROD VERIFIED** 🔒 |

### N4 — CLOSED / PROD VERIFIED 🔒 (2026-09-19)

| Ask | Result |
|---|---|
| `tell me more about services` | EN catalogue list |
| `which services do you have?` | Same catalogue |
| `Papasakokite daugiau apie paslaugas` | LT catalogue |
| N3b quoted-greeting + registration | Registration options — **not** catalogue |

Fix: extend `isServiceCatalogueAsk` only; N3b adjacent cues + D2 preserved.

### N5 — CLOSED / PROD VERIFIED 🔒 (2026-09-19)

| Shape | PROD example |
|---|---|
| Simple | `Dental implants costs from 860 EUR` + disclaimer |
| Structured | `Teeth whitening: Trays: 214 EUR; …` + disclaimer |
| Pointer-only | `For Diagnostics/Periodontics pricing: … see price page` — never `costs See…` |

No price-data edits. Slash-line anaesthesia→LT reply treated as **test artifact** (not opened); reopen only if a clean EN ask switches language.

**N1/F5b reinforcer:** `whitening or orthodontics price` → clarify which → `whitening` → correct pricing. Safe Schema-v1 recovery.

**Still parked / waived:** **V2** (accept for pilot). **N1/F5b** remain waived.

### Readiness ledger (post N4/N5)

| Closed / PROD verified | Accepted / deferred | Pilot observation |
|---|---|---|
| F1, F2, F4, F5a, F6, N2, N3, N4, N5 | F3; F5b / N1 | V2 |

No currently known ordinary-path functional defect awaiting a fix.

---

## Natural-use findings — visit logistics (2026-09-19)

Ordinary planned-visit journey: parking + what to bring; Sunday hours; parking reservation; ID documents.

| ID | Observation | Disposition |
|---|---|---|
| **N6** | Parking duplicated on multi-ask turn; parking reappears on later ID-only ask | **CLOSED / PROD VERIFIED** 🔒 |
| **N7** | Unsolicited booking/contact block after “planning my visit … tomorrow” | **CLOSED / PROD VERIFIED** 🔒 |
| **Obs** | Parking reservation ask → repeats parking facts, no reserve/turn-up answer | **Observation** — Foundation has no reservation fact; safe non-invention |
| **Obs** | “do you work Sundays?” → weekdays hours only (inferable closed) | **Observation** — no hours×stated-date cross-check contract; not an MVP defect |
| **Obs** | Hours trailing “If you want, I can guide you to the next step.” | **Voice observation** — park with V2; no Voice reopen |

### N6 — RCA LOCKED (PROD 2026-09-19T11:50:05Z / 11:52:45Z)

**Turn 1 interpretation:** `parking` + `first_appointment_prep` (correct for the ask).  
**Turn 1 actions:** `C4_info:parking`, `C4_info:first_appointment_prep`, `C3_booking`.

| Component | Source |
|---|---|
| First parking block | `clinic-profile.parking` via `C4_info:parking` |
| Prep + second parking | `first-visit-patient.appointmentPrep` — **parking sentence is embedded in the authorised prep blob** |

**ID follow-up confirmed:** intents = `[first_appointment_prep]` only; actions = `C4_info:first_appointment_prep` only. Parking on that turn is **not** a second intent — it is the same embedded prep content.

**Cause:** Foundation content overlap + naive multi-intent compose. Not an interpreter miss.

**Candidate fixes (gate — do not implement yet):**
1. **Preferred (presentation/composition):** when composing `parking` + `first_appointment_prep`, emit prep once and skip the standalone parking block (or strip duplicate parking paragraphs).
2. **Foundation:** remove parking from `appointmentPrep` so parking only comes from the parking intent — needs authorisation (content change).

### N6 — CLOSED / PROD VERIFIED 🔒 (2026-09-19T12:06:36Z)

Composition only: `parking` + `first_appointment_prep` → emit prep once (`N6_parking_subsumed_by_prep`); Foundation prep blob untouched. ID-only prep breadth accepted for pilot.

**PROD:** actions `N6_parking_subsumed_by_prep` + `C4_info:first_appointment_prep`; one prep reply (bring + parking once). Standalone `Where can I park?` → `C4_info:parking` only.

### N7 — RCA LOCKED (PROD 2026-09-19T11:50:05Z)

| | |
|---|---|
| Ask | logistics only (“where park” / “what bring”) + narrative “planning my visit … 11AM tomorrow (sunday)” |
| Intents | `parking`, `first_appointment_prep` — **no** `booking` intent |
| Signal | `booking: soft` |
| Policy | `wantBook` true → `C3_booking` appended; `primary_intent_label: booking_request` |
| Patient effect | Unsolicited WhatsApp-booking refusal + contact schedule block |

**Cause:** Soft-booking signal from planned-visit phrasing/time, not from an explicit book ask. Policy treats any non-`none` booking signal as compose-C3 (D3 path).

**Not:** wrong info intents; Foundation miss.

**Candidate fixes (gate — do not implement yet):**
1. **Narrow policy:** suppress `C3_booking` when the only info intents are logistics (parking / first_appointment_prep / hours / location) and there is no explicit booking intent / hard book cue.
2. Broader “soft booking” reinterpret — riskier; prefer (1) if authorised.

### N7 — CLOSED / PROD VERIFIED 🔒 (2026-09-19)

Policy only: soft + exclusively logistics/info intents + no `booking` intent → suppress C3 (`N7_suppress_soft_booking_c3`). Hard / booking intent / availability / registration paths unchanged. Soft = booking *relevance*, not booking *request*.

**PROD smoke 12:06Z:** planned-visit logistics → no C3 (this run: interpreter `booking: none`; soft-suppress path covered by unit test + original soft RCA). Positives: `How do I book?` → `booking` + `hard` → `C3_booking`; implant book → `C3_booking` contact.

Positive regression: “I'm planning to visit… How do I book?” → still C3.

### Follow-up turns (log-confirmed observations)

| Ask | Interpretation | Note |
|---|---|---|
| `do you work Sundays?` | `clinic_hours` only; `booking: none` | Governed hours; no closed-Sunday transform |
| parking reservation | `parking` only; `booking: none` | Correct non-invention |
| `what id documents…` | `first_appointment_prep` only | N6 embedded-content manifestation — **accepted** (not a defect) |

**N6 / N7 closed.** No further fix without new authorisation.

### Readiness ledger (post N6/N7)

| Closed / PROD verified | Accepted / deferred | Pilot observation |
|---|---|---|
| F1, F2, F4, F5a, F6, N2, N3, N4, N5, N6, N7 | F3; F5b / N1 | V2; prep-blob breadth on ID asks |

---

## Natural-use findings — implant / anaesthesia clinical (2026-09-19)

| Turn | Ask | Result | Disposition |
|---|---|---|---|
| 1 | “I think I need an implant” | Assessment → contact | **PASS** — no treatment validation |
| 2 | “the clinic provides dental implants, right?” | Capability fact | **PASS** — F2 holding |
| 3 | “I may need … anesthesia during the procedure” | Same assessment primitive | **Accept** — safe boundary for “I may need” |
| 4 | “what if I am allergic to anesthesia?” | Same generic treatment-assessment copy | **N8 — CLOSED / PROD VERIFIED** 🔒 |

### N8 — RCA LOCKED (PROD 2026-09-19T12:11:58Z)

**Allergy turn interpretation:**

| Field | Value |
|---|---|
| intents | `clinical` (0.95) only |
| `clinical_or_suitability` | `true` |
| `service_or_topic` | `implants` from **conversation_context** — **not** anaesthesia |
| Allergy / concern | **Not representable** in Schema v1 |
| actions | `S1_clinical_assessment` only |
| Copy | General `clinicalAssessment` (“What treatment would be right…”) |

**“I may need anaesthesia” turn (same shape):** `clinical` + `implants` (context) + `clinical_or_suitability: true` → same `S1_clinical_assessment`. Anaesthesia never becomes `service_or_topic`.

**Cause (locked):**

1. **Schema limit** — boolean clinical signal only; no concern/allergy subtype; topic stuck on prior implant context.  
2. **Policy flatten** — any non-urgent clinical → one `S1_clinical_assessment` path.  
3. **Voice consequence** — only general vs suitability primitives; allergy is neither → treatment-assessment wording.

Not an unsafe clinical answer. Not an interpreter “miss” relative to Schema v1 — it correctly marks clinical and has nowhere else to put allergy.

### N8 — CLOSED / PROD VERIFIED 🔒 (2026-09-19T12:20Z)

**Presentation only** within existing `S1_clinical_assessment` (same contact route; no schema / interpreter / urgency change).

| Primitive | When |
|---|---|
| Suitability | Existing suitability cues |
| General | Default non-urgent clinical |
| **Concern / tell-the-dentist** | Narrow current-message cue: EN `allerg*` / LT `alerg*` only |

**PROD retest:**
| Ask | Result |
|---|---|
| `what if I am allergic to anesthesia?` | Concern copy + contact — not general treatment-assessment |
| `I may need … anesthesia` | General assessment (cue did not leak) |
| `I think I need an implant` | General assessment |
| `the clinic provides dental implants, right?` | Foundation capability (F2) |

No clinical inference or advice added. Schema / interpretation / S1 route unchanged.

**Positive pattern retained:** self-assessment → safe boundary → factual capability → concern → appropriate boundary.

### Readiness ledger (post N8)

| Closed / PROD verified | Accepted / deferred | Pilot observation |
|---|---|---|
| F1, F2, F4, F5a, F6, N2, N3, N4, N5, N6, N7, N8 | F3; F5b / N1 | V2; prep-blob breadth on ID asks |

---

## Natural-use findings — paediatric journey (2026-09-19)

| Turn | Ask | Result | Disposition |
|---|---|---|---|
| 1 | Child scared of dentists | General S1 assessment | **Observation** — park with V2 (not N8; not medical-safety concern) |
| 2 | Do you treat children? | Paediatric capability | **PASS** |
| 3 | Can I stay with her during the procedure? | Unsupported clinic redirect | **PASS** — safe Foundation gap |
| 4 | What happens on 1st visit? | First-visit expectations | **PASS** |
| 5 | Will my child need anaesthesia? | Clinical assessment | **PASS** — safe boundary |
| 6 | How much will this cost? | Price clarify | **PASS** — ambiguous referent |
| 7 | `anaesthesia for a child` (after clarify) | Assessment + re-clarify | **N9 — CLOSED / PROD VERIFIED** 🔒 |

### N9 — RCA LOCKED (PROD 2026-09-19T12:29:39Z)

**Ask:** `anaesthesia for a child` — patient answering the assistant’s own price clarification.

| Field | Value |
|---|---|
| intents | **`price` (0.9)** — price job **is** present |
| `service_or_topic` | `id: null` (current_message) |
| `clinical_or_suitability` | **`true`** |
| actions | `S1_clinical_assessment`, **`F5b_multi_price_not_bridged`**, `C1_price_clarify` |
| foundation_misses | `price:multi_explicit_services` |
| Reply | General assessment + “Which service's price…?” again |

**Cause (two stacked mechanisms):**

1. **F5a lexical multi-match → F5b path:** `matchExplicitFoundationServiceIds("anaesthesia for a child")` hits **both** `anaesthesia` and `paediatric_dentistry` (`child` keyword). Exactly-one bridge refused → clarify loop. Patient meant one priced service + a patient-context modifier, not two price topics.
2. **Clinical compose on a price-answer turn:** `clinical_or_suitability: true` → `S1_clinical_assessment` prepended even though the active job is completing price clarification.

**Not:**
- Classic **F3** — price intent *did* carry; this is not “price forgotten after clarification.”
- Classic **N1/F5b multi-need** — assistant already asked for one service; patient named one. F5b false-positive from “child” co-occurrence.
- Missing anaesthesia price data — N5 pointer exists; retrieval never reached a single id.

**Contrast (same conversation):** `how much will this cost?` → `C1_price_clarify` only — correct. Failure is the **follow-up selection** turn.

### N9 — CLOSED / PROD VERIFIED 🔒 (2026-09-19T12:37Z)

**Scope:** F5a `matchExplicitFoundationServiceIds` only.

When paediatric matches **only** via population stems (`child` / `children` / `kids` / LT `vaik*`) and another explicit service is also matched, demote paediatric (`N9_paediatric_population_demoted`) so the remaining single id can F5a-bridge.

**PROD retest:**
| Ask | Result |
|---|---|
| `anaesthesia for a child` (no price job) | Capability + clinical boundary — OK (different job) |
| `children's dental care and anaesthesia` | Both capabilities kept (genuine multi; not demoted to one) |
| clarify → `then anaesthesia for a child` | **Anaesthesia price** + disclaimer — N9 gate PASS |
| `children's dental care price` | Paediatric price alone |
| `what about Anaesthesia?` | Anaesthesia price alone |
| `and orthodontics price?` | Orthodontics price (clean switch) |

F5b / multi-service distinction intact. No schema / interpreter / Foundation / general resolver change.

**Secondary note:** identical surface phrase can be service/clinical vs price depending on prior turn state — desirable.

### Readiness ledger (post N9)

| Closed / PROD verified | Accepted / deferred | Pilot observation |
|---|---|---|
| F1, F2, F4, F5a, F6, N2, N3, N4, N5, N6, N7, N8, N9 | F3; F5b / N1 | V2; prep-blob breadth; fear/nervous presentation |

---

## Natural-use findings — tooth pain / unreachable clinic (2026-09-19)

| Turn | Ask | Result | Disposition |
|---|---|---|---|
| 1 | Tooth hurting since yesterday | Non-urgent S1 assessment | **PASS** — F1 preserved |
| 2 | Tried to call, no one picking up | Contact channels | **PASS** — limited usefulness; no invention |
| 3 | Is it because Saturday? | Weekday hours | **PASS** — governed fact, indirect |
| 4 | Hours trailing “guide you to the next step” | Voice promise | **Observation** — no governed next step in state |
| 5 | `ok, please do` | C3 booking / contact | **N10 — FIX AUTHORISED / implemented locally** |
| 6 | Tried calling again, no one picking up | Same contact block | **N11 — NO FIX** (clinic discovery) |

### N10 — RCA LOCKED (PROD 2026-09-19T12:42:36Z)

**Ask:** `ok, please do` — acceptance of assistant’s own “If you want, I can guide you to the next step.”

| Field | Value |
|---|---|
| intents | **`booking` (0.8)** |
| `signals.booking` | **`soft`** |
| `references` | **`[]` empty** — no structured link to prior offer |
| actions | `C3_booking` |
| Reply | WhatsApp can’t book + contact phone |

**Cause:**
1. **Voice over-promise** — hours reply appends “guide you to the next step” with no authorised fulfilment for this state (pain + unreachable + Saturday).
2. **Interpretation** — acceptance mapped to `booking` + soft without using `references`.
3. **Policy** — C3 is correct *given* that interpretation (hard/booking path unchanged).

**F3 relationship:** Meaning depends almost entirely on the assistant’s prior offer (continuation/reference). Schema `references` did not carry it; interpreter substituted booking. **F3-adjacent evidence**, not a classic correction/negation case. Do not reopen F3 as a build target from this alone.

**Candidate (gate — no fix yet):** Remove/disable the hours “next step” trailer unless a governed next action exists (aligns with V2 / Voice fluff). Broader “accept my offer” handling needs care — risk of more phrase patches.

### N10 — FIX AUTHORISED / implemented locally (pending PROD verify)

**Presentation only:** clinic_hours EN/LT return authorised hours fact only — no “guide you to the next step” / “tinkamiausią kitą žingsnį” trailer. Interpreter / C3 / F3 untouched.

### N11 — RCA LOCKED (PROD 2026-09-19T12:42:58Z)

**Ask:** `I tried calling but noone is picking up` (repeat after contact already given).

| Field | Value |
|---|---|
| intents | `contact` (0.9) — same as first failed-call turn |
| actions | `C4_info:contact` |
| Reply | Full contact block again (phone/email/web) |

**Cause:** System treats failed-contact narrative as a fresh contact ask. No “already tried / unreachable” signal in Schema v1. No Foundation out-of-hours / closed-clinic pathway.

### N11 — NO FIX AUTHORISED

Preserve safe contact repetition for pilot. **Clinic discovery for Aušra:** what should a patient do with a dental concern outside stated hours when the clinic phone is unanswered? Do not invent an OOH/emergency pathway before clinic input.

**No invent out-of-hours / emergency answer.** F1 non-escalation on ordinary tooth pain remains PASS.

**Parked with V2:** fear/nervous presentation (hours next-step trailer removed via N10).