# Phase 2 — Natural-Language Evaluation Charter v1

**Date:** 2026-09-18  
**Status:** **SIGNED OFF / FROZEN** 🔒  
**Control system under test:** Deterministic WhatsApp assistant **v1.1** (frozen)  
**Paired baselines (frozen):** Foundation v1.1 · Behaviour & Scope v1.1  
**Prerequisite:** Gate 1 closed — `DH-WhatsApp-Smoke-v1.1.md` PASS · suite green  
**Next artefact:** `DH-WhatsApp-NL-Corpus-v0.1` — **FROZEN** 🔒 (`data/DH-WhatsApp-NL-Corpus-v0.1.json` · manifest `DH-WhatsApp-NL-Corpus-v0.1.md`)

---

## Purpose

Measure how well the **frozen** deterministic assistant handles the way real patients naturally express the intents and conversations it is supposed to support.

This is **not** a build phase. We do not improve the classifier to make the score look better.

---

## Research question

> How well does deterministic v1.1 handle natural patient phrasing and multi-turn conversation for in-scope intents — and where does failure come from?

---

## What we are testing

| In scope | Out of scope |
|---|---|
| Understanding of natural LT/EN phrasing for supported intents | Inventing new product features |
| Multi-turn / reference resolution (“o kada…”, “o tas pats”) | Expanding Foundation truth during eval |
| Correct knowledge retrieval when Foundation has an answer | Live price infrastructure |
| Boundary & safety behaviour (refuse / route correctly) | Patching deterministic code mid-corpus |
| Routing (online registration vs contact vs phone vs Option C) | Designing cases around known regex gaps |

---

## Pass / fail (behavioural, not lexical)

A case **passes** when the assistant’s behaviour matches Behaviour v1.1 + Foundation v1.1 for that scenario — including correct refusal / handoff.

A case **fails** when behaviour diverges: wrong intent family, invented facts/slots, unsafe route, missing required disclaimer/route, or answering when it must not.

**Important:** Understanding a question does **not** require answering it. Safe refusal / phone handoff for clinical suitability can be a **pass**.

### Partial success (evaluation results only)

A mixed message may be partly right and partly wrong (e.g. price correct, availability mishandled). Overall case still gets a single **pass/fail** and, on fail, exactly **one** primary failure bucket.

Diagnostic detail (what worked / what did not) belongs in **evaluation results** (`observed_notes` or equivalent) — **not** in the corpus schema. Do not add scoring fields to corpus cases.

---

## Failure taxonomy (exactly one primary bucket per fail)

| Bucket | Meaning | Auto-fix deterministic v1.1? |
|---|---|---|
| **Understanding** | Phrasing not recognised / wrong intent family | **No** — record only |
| **Context** | Multi-turn reference lost; prior topic ignored | **No** — record only |
| **Knowledge** | Behaviour **diverges because of** the knowledge situation (e.g. invents an answer, mishandles absence) | **No** as classifier rescue — Foundation backlog / behaviour defect as applicable |
| **Boundary/Safety** | Should refuse/route safely but does not (or routes unsafely) | **Yes** — genuine defect; fix under change control |

### Knowledge — careful rule

If a question is deliberately **unanswerable** from Foundation (`answerable_from_foundation=no`) and v1.1 **correctly** refuses / hands off / clarifies without inventing: that is a **pass**, not a Knowledge failure.

Record `answerable_from_foundation=no` as a **knowledge-gap observation** even when behaviour passes.

**Knowledge** is the primary failure bucket only when behaviour mishandles the knowledge situation (e.g. invents content, answers as if Foundation contained the fact, or otherwise mishandles absence).

Only **Boundary/Safety** defects may reopen deterministic code — and only as discrete, documented fixes, not opportunistic synonym expansion.

---

## Case schema (every corpus item)

| Field | Required | Notes |
|---|---|---|
| `case_id` | yes | Stable id, e.g. `P2-001` |
| `language` | yes | `lt` / `en` / `mixed` |
| `conversation` | yes | Ordered messages (1+ turns) |
| `scenario` | yes | Short plain-language situation |
| `scenario_family` | yes | Primary purpose tag for inventory (not mutually exclusive with content) |
| `expected_intent` | yes | Intent family under v1.1 |
| `expected_knowledge_target` | yes | Foundation id / `none` / `n/a` |
| `expected_behaviour` | yes | What must happen (answer / clarify / redirect / escalate) |
| `answerable_from_foundation` | yes | `yes` / `no` / `partial` |
| `expected_route` | yes | e.g. `none` · `contact` · `online_registration` · `phone` · `option_c` |
| `must_not_do` | yes | Explicit prohibitions (invent slots, lab-as-service, book, diagnose…) |
| `provenance` | yes | See below |

Scoring fields (`pass`, `primary_failure_bucket`, `observed_notes`) live only in evaluation result files.

### Provenance values

| Value | Meaning | Weight in interpretation |
|---|---|---|
| `clinic-observed` | Real clinic / Aušra-observed patient wording | Highest |
| `receptionist-observed` | Later: desk-heard phrasing | High |
| `patient-observed` | Later: consented captured phrasing | High |
| `constructed` | Deliberately authored variant | Useful; must not dominate narrative |

Do not treat 70 constructed cases as equivalent evidence to one clinic-observed case.

---

## Corpus construction rules

1. **Size:** target ~**70** within 60–80. Breadth without synthetic bloat.  
2. **Charter before cases** (this document). Do not reverse-engineer a benchmark from known regex holes.  
3. **Do not consult the classifier/regex while writing cases.** Write: patient situation → natural message → expected correct behaviour.  
4. **Uneven coverage by difficulty:** more space for booking, prices, mixed, clinical/boundary, multi-turn than trivial address facts. Scenario families are targets, not hard quotas; a multi-turn case may also be booking/pricing.  
5. **Lithuanian dominant** (~55–60 LT, ~7–10 EN, few mixed) — not a 50/50 bilingual benchmark.  
6. **Conversations and behavioural variation**, not paraphrase farms of the same sentence.  
7. **Ordinary WhatsApp language:** missing accents, shorthand, light typos — not caricatured “bad Lithuanian.”  
8. **Seed empirical core early:** Aušra natural interaction (verbatim); production smoke LT clinical case (verbatim).  
9. **Include the smoke language observation** as: *LT clinical input produced an EN response while safety routing remained correct* — do **not** pre-assign a failure bucket in the corpus; evaluation classifies later.  
10. **No mid-eval baseline edits.** Correct refusal on Foundation-absent questions = pass + knowledge-gap observation.  
11. **Freeze the corpus** before scoring v1.1; same frozen corpus later vs AI-assisted v2.

---

## Suggested scenario-family mix (~70, not quotas)

| Scenario family | Approx. |
|---|---|
| Clinic facts / contact / location / hours | 6 |
| Services / service discovery | 8 |
| Prices | 8 |
| Booking / online registration / named doctor | 10 |
| Availability | 5 |
| Mixed intent | 8 |
| First visit / preparation | 4 |
| Clinical / urgent / safety | 8 |
| Unsupported / ambiguous / unknown | 6 |
| Multi-turn context | 7 |
| **Total** | **~70** |

---

## Evaluation protocol

1. Freeze corpus version (`DH-WhatsApp-NL-Corpus-v0.1`).  
2. Run each case against **unchanged** deterministic v1.1.  
3. Score pass/fail; on fail assign one primary failure bucket; optionally note partial successes in results.  
4. **Do not rescue** Understanding/Context failures with new keywords during the run.  
5. Summarise rates by bucket, language, provenance, and scenario family.  
6. Only then decide whether AI v2 has a mandate.

---

## Intended AI v2 mandate (hypothesis — confirm with evidence)

If results support it, AI v2’s job is narrow:

> **understand natural language + resolve conversational context**

while:

- Foundation controls **truth**  
- Behaviour controls **authority / safety**  
- Deterministic code controls **critical routing**

Do not start from “add ChatGPT to make it smarter.”

---

## Explicit non-goals

- Improving v1.1 score by classifier patches mid-study  
- Expanding live price sync as part of Phase 2  
- Claiming “clinic approved” for internal eval artefacts  
- Equating constructed volume with observed patient behaviour  
- Pre-labelling evaluation outcomes inside the corpus  

---

## Charter freeze

**Charter v1 — SIGNED OFF** 🔒 (2026-09-18). Clarifications locked: partial success → results only; no pre-bucket for LT→EN smoke case; Knowledge fail only when behaviour mishandles absence.

Construct and freeze `DH-WhatsApp-NL-Corpus-v0.1` next. **Do not score against v1.1 until the corpus itself is frozen.**

---

## Post-freeze status

- Charter v1 — SIGNED OFF 🔒  
- Corpus v0.1 — FROZEN 🔒 (70 cases)  
- Scoring against deterministic v1.1 — **CLOSED** 🔒 → summary + failure register + results JSON  
- AI mandate — **ACCEPTED** (narrow) → `DH-WhatsApp-Phase2-AI-Mandate-Decision.md`  
- Phase 2B — design opened → `DH-WhatsApp-Phase2B-AI-Interpretation-Layer-Design-v1.md`
