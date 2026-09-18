# DH WhatsApp — AI Signal → Deterministic Policy Mapping v1

**Status:** **FROZEN** 🔒  
**Date:** 2026-09-18  
**Input contract:** `DH-WhatsApp-AI-Interpretation-Schema-v1`  
**Baselines:** Behaviour v1.1 · Foundation v1.1 · Registration inventory  
**Principle:** LLM interprets meaning; **policy** decides what may be said and which route applies.

---

## How to read this document

v2 is a **signal interpreter feeding a policy engine**, not a single-intent router behind an LLM.

Two rule kinds:

| Kind | Meaning |
|---|---|
| **Suppressive** | One signal blocks or replaces another action (e.g. clinical blocks ordinary booking). |
| **Composable** | Multiple actions may execute in one reply (e.g. price + availability guidance). |

---

## A. Base matrix (interpretation / retrieval → action)

| Interpretation / retrieval state | Deterministic action |
|---|---|
| `signals.clinical_or_suitability = true` | Safety response + **phone**; **suppress** ordinary booking / online registration |
| `signals.availability = true` (or intent `availability`) | **Never** invent a slot; registration and/or contact per booking state / Behaviour |
| `signals.booking ∈ {soft,hard}` + service in online-bookable set (consultation / oral hygiene inventory) | May direct to **online registration**; still cannot self-book |
| `signals.booking ∈ {soft,hard}` + treatment / non-online category (or unnamed treatment booking) | **Contact** clinic channels |
| Intent `price` + recognised service + Foundation/cache **hit** | Cached source-governed amount + **disclaimer** |
| Intent `price` + no resolvable service | **Clarify** which service |
| Recognised informational intent + Foundation **hit** | Return approved information |
| Recognised informational intent (or clear topical ask) + Foundation **miss** | Unsupported knowledge → handoff / Option C per Behaviour — **not** invented content |
| `signals.unsupported_or_ambiguous = true` (genuinely unclear) | Clarify or Option C per Behaviour |
| Escalation required (unknown / clinical follow-up expected) | **Option C** (08:00–17:00 window copy) |
| None of the above | Safe unknown path |

### Foundation miss ≠ AI “knowledge_gap” field

Policy establishes absence **after** retrieval. Example: reimbursement ask → no authorised Foundation row → unsupported/handoff. The model must not be the authority on “what the clinic doesn’t know.”

---

## B. Precedence (execution order)

Approximate stack — **suppressive layers first**, then **composable content**:

```text
1. Clinical / safety override          (SUPPRESSIVE)
2. Unsupported / ambiguity handling    (when interpretation is unclear — not when Foundation merely misses)
3. Availability restriction            (SUPPRESSIVE on slot invention; COMPOSABLE with other content)
4. Booking route                       (subject to clinical suppress)
5. Price retrieval                     (COMPOSABLE)
6. Information retrieval               (COMPOSABLE)
7. Unknown / Option C                  (fallback)
```

### Suppressive rules (explicit)

| Rule id | Condition | Effect |
|---|---|---|
| S1 | `clinical_or_suitability = true` | Emit clinical safety + phone; **do not** emit online registration; **do not** complete ordinary booking redirect as primary outcome |
| S2 | Any availability handling | **Never** invent appointment times/slots in chat |
| S3 | Escalation / Option C path for ordinary redirect | **Never** attach team-ack to simple contact or registration links |

### Composable rules (explicit)

| Rule id | Condition | Effect |
|---|---|---|
| C1 | `price` + recognised service + hit | Include price block + disclaimer |
| C2 | `availability` with or without price | Append availability limitation + approved route (reg and/or contact) |
| C3 | `booking` without clinical suppress | Append booking guidance (online vs contact per inventory) |
| C4 | Informational intent + Foundation hit | Include approved info block |
| C5 | Multiple of C1–C4 | Assemble **all** applicable blocks; order: info/price first, then availability/booking guidance |

**Price + booking** → answer price **and** route booking (C1 + C3).  
**Price + availability** → answer price **and** refuse invented slots (C1 + C2).  
**Clinical + booking** → S1 wins; booking route suppressed.

---

## C. Worked combinations

### C-ex1 — Price + availability

Interpretation: intents `price`, `availability`; service `implants`; clinical false.

| Step | Result |
|---|---|
| S1 | n/a |
| C1 | Implant cached price + disclaimer |
| C2 | No slots; reg/contact guidance |
| Outbound | Price block then availability limitation |

### C-ex2 — Clinical + hard booking (hygiene)

Interpretation: clinical true; booking hard; service `professional_hygiene`.

| Step | Result |
|---|---|
| S1 | Safety + phone; suppress `/registracija/` |
| C3 | **Skipped** (suppressed) |
| Outbound | Clinical path only (+ Option C if escalated) |

### C-ex3 — Follow-up “O kiek kainuos?” with structured state

Runtime state (not AI schema): `active_service = implants`.

Interpretation may set `service_or_topic.source = conversation_context`, intent `price`.

| Step | Result |
|---|---|
| C1 | Implant price + disclaimer |
| Outbound | Priced answer without re-asking service *if* policy trusts resolved service |

(Whether state, raw turns, or both work best is a Phase 2B experiment.)

### C-ex4 — Clear topical ask, Foundation miss (e.g. insurance)

Interpretation: not clinical; not booking; topical/other; `unsupported_or_ambiguous` only if unclear.

| Step | Result |
|---|---|
| Retrieval | No authorised fact |
| Policy | Unsupported knowledge → handoff / Option C — **no** service-blurb substitute |

---

## D. Online-bookable category (policy input)

From registration inventory (frozen claim set):

- Specialist **consultations**  
- **Oral hygiene** (`professional_hygiene` / Burnos higiena)

All other treatment booking → **contact**, unless Behaviour later expands inventory.

---

## E. Confidence

`overall_confidence` and per-intent / service confidences are **logged for analysis**.

**v1 policy does not branch on numeric thresholds.**  
Calibrate only after offline evidence that confidence is meaningful.

---

## F. Response assembly boundary

Policy selects **which blocks** and **which route**.  
Wording comes from existing controlled templates / Foundation / disclaimer / Option C copy — **not** free-form model prose as clinic truth.

---

## G. Evaluation success (unchanged from Phase 2B design)

Against frozen Corpus v0.1:

- Understanding fails ↓  
- Context fails ↓  
- Boundary/Safety **no regress** (watch P2-056-class)  
- Knowledge absence **no hallucination** (watch P2-062-class)  

No arbitrary overall % target.

---

## Freeze

**Signal → Policy Mapping v1 — FROZEN** 🔒  

Together with Interpretation Schema v1, this pair is the executable contract required **before** any offline LLM call is authorised.
