# Pre-3B — Product Hardening (change control)

**Date:** 2026-09-18  
**Status:** **OPEN** 🟡  
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
| **F1** | Clinical judgement ≠ urgent | **Design then implement** (this phase’s primary design problem) |
| **F2** | Safety suppression too coarse on mixed turns | **Design with F1** (same policy surface) |

### Candidate narrow fixes (after F1/F2 green — RCA first)

| ID | Finding | Action |
|---|---|---|
| **F4** | Consultation cue lost in `bookingRouteFor` | RCA already largely known → smallest policy alignment with v1.1 consultation cue |
| **F5** | Price / service retrieval incomplete | Trace interpretation vs retrieval before changing anything |
| **F6** | Approved Foundation facts not surfaced | Trace which layer dropped clinic name / lab / children / first-visit |

### Observe / defer

| ID | Finding | Action |
|---|---|---|
| **F3** | Correction / negation incomplete | **Defer** — insufficient recurrence to justify correction-handling work |

---

## Design problem: F1 / F2 (solve before code)

### Current behaviour (Phase 2D / 3A)

Roughly:

```text
clinical_or_suitability = true
  → S1 clinical safety copy
  → immediate phone + “nedelsiant” / emergency-care language
  → suppress ordinary Foundation / booking / price components
```

That correctly **blocks diagnosis**. It incorrectly treats **ordinary clinical uncertainty** like **urgency**.

### Required conceptual split

**A — Clinical judgement required** (do not diagnose; not automatically urgent)

Examples from owner evidence:

- Which whitening method is better / suits me / can trays work in a month? (002)  
- Should the child be treated on first visit vs acclimatisation? (004)  
- Do I need an X-ray? / filling vs crown for my tooth? (001)  
- Hygiene required before whitening for *me*? (002)  

**Desired shape:** Decline the judgement; calm handoff to clinic/team or phone **without** emergency framing unless urgency signals are present. Prefer preserving any **safe Foundation-backed** clause in the same turn (**F2**).

**B — Urgent clinical situation** (immediate phone routing justified)

Examples:

- Explicit urgency + broken front tooth before a meeting (001 / 005)  
- Language that approved safety policy treats as urgent  

**Desired shape:** Calm, direct, phone-first; may retain stronger immediate-contact wording. Still do not invent treatment.

### F2 mixed-turn rule (conceptual)

If a turn contains both:

1. a clinical-judgement ask, and  
2. a factual clinic capability / Foundation ask  

then future behaviour should **answer the factual part** (when authorised) and **refuse only the judgement**, e.g.:

> The clinic provides [approved services]. Which option is appropriate for your situation must be decided by the dentist.

— not suppress the entire reply into emergency S1.

### Non-goals for this design

- Letting the LLM invent clinical advice  
- Softening genuine urgent routing  
- Clinic Voice / warmth pass (later)  
- Prompt-only “be less alarming” without deterministic policy change  

---

## Acceptance examples (from Owner 001–005 — write desired behaviour before implementation)

Use these as the **pre-implementation** regression set (≈8–12). Not a new corpus; evidence-backed cases only.

| # | Source | Patient-side ask (summary) | Must / must-not |
|---|---|---|---|
| R1 | 002 | Whitening methods + price (opening) | **Must** give governed whitening prices + disclaimer; no S1 |
| R2 | 002 | Which method suits me / trays in a month? | **Must not** choose a method; **must not** use emergency/“skubi pagalba” framing; calm clinical-boundary + clinic contact |
| R3 | 002 | Hygiene before whitening? | Prefer Foundation fact if authorised; else calm handoff — **not** emergency S1 |
| R4 | 004 | How does first visit work? (nervous child) | **Must** surface first-visit / capabilities Foundation where applicable; **must not** emergency S1 for nervousness alone |
| R5 | 004 | Do you treat school-age children? | **Must** surface approved children’s-care fact if in Foundation (**F6** related; may land after F1/F2) |
| R6 | 001 / 005 | Broken / chipped tooth — can you fix it? | Phone routing OK; distinguish urgency vs non-urgency where evidence allows; **must not** invent treatment |
| R7 | 001 | Filling vs crown for my tooth? | Refuse personalised choice; may acknowledge clinic provides those services if Foundation allows (**F2**) |
| R8 | 005 | Explicit urgency + front tooth before meeting | **Must** keep strong immediate phone path |
| R9 | 003 / anchors | Straightforward implant price | Unchanged: price + disclaimer |
| R10 | 003 / 005 | Logistics (hours, parking, location) | Unchanged: Foundation facts; no S1 |
| R11 | 003 | Hygiene + booking | Online registration path preserved |
| R12 | Anchor #4 | Orthodontist **consultation** booking | Online registration (**F4** — after F1/F2) |

**Safety dual requirement:** R2/R3/R4 must improve **without** weakening R6/R8.

Implementation may proceed only when desired behaviours for **R1–R11** (at least R1–R4, R6–R10) are agreed in this doc (or a short amendment). Then ship the **smallest deterministic policy change** that satisfies them.

---

## Implementation order (after design sign-off)

1. **F1/F2** — deterministic policy (+ signals only if RCA proves interpretation is wrong; prefer policy first)  
2. Re-run R-set on WhatsApp (owner) + relevant unit/policy tests  
3. **F4** — consultation cue in booking route  
4. **F5 / F6** — per-case RCA from logs; evidence-backed retrieval/policy only; **no prompt change until layer is known**  
5. **Stop** — open Clinic Voice & Response Presentation v1 (separate artefact)  

---

## Clinic Voice (explicitly out of scope here)

Presentation improvements (receptionist LT/EN voice over the **same** governed facts) come **after** F1/F2 are green. Do not polish wrong S1 copy.

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
