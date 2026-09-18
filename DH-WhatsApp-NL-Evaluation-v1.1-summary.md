# NL Evaluation v1.1 — Summary

**Status:** FROZEN 🔒  
**Baseline:** Deterministic v1.1  
**Corpus:** DH-WhatsApp-NL-Corpus-v0.1 (70 cases)  
**Results:** `data/DH-WhatsApp-NL-Evaluation-v1.1-results.json`  
**Failure register:** `DH-WhatsApp-NL-Evaluation-v1.1-failure-register.md`

## Overall

| Metric | Value |
|---|---|
| Pass | 52 |
| Fail | 18 |
| Total | 70 |
| Pass rate | 74.3% |

Raw counts are authoritative; percentages are descriptive only.

## By language

| Language | Pass | Fail | Total | Pass % |
|---|---|---|---|---|
| en | 8 | 2 | 10 | 80% |
| lt | 43 | 15 | 58 | 74% |
| mixed | 1 | 1 | 2 | 50% |

## By scenario family

| Family | Pass | Fail | Total | Pass % |
|---|---|---|---|---|
| availability | 3 | 2 | 5 | 60% |
| booking | 7 | 3 | 10 | 70% |
| clinic_facts | 5 | 0 | 5 | 100% |
| clinical_urgent | 7 | 1 | 8 | 88% |
| first_visit | 4 | 0 | 4 | 100% |
| mixed_intent | 6 | 2 | 8 | 75% |
| multi_turn | 1 | 6 | 7 | 14% |
| prices | 7 | 1 | 8 | 88% |
| services | 6 | 2 | 8 | 75% |
| unsupported_ambiguous | 6 | 1 | 7 | 86% |

## By provenance (qualitative weight ≠ sample size)

| Provenance | Pass | Fail | Total | Pass % |
|---|---|---|---|---|
| clinic-observed | 3 | 1 | 4 | 75% |
| constructed | 48 | 17 | 65 | 74% |
| patient-observed | 1 | 0 | 1 | 100% |

*Do not treat clinic-observed % as a population estimate.*

## Single-turn vs multi-turn

| Shape | Pass | Fail | Total | Pass % |
|---|---|---|---|---|
| multi_turn | 1 | 6 | 7 | 14% |
| single_turn | 51 | 12 | 63 | 81% |

## Failure buckets (fails only)

| Bucket | Count |
|---|---|
| Understanding | 10 |
| Context | 6 |
| Knowledge | 1 |
| Boundary/Safety | 1 |

## Harness fidelity

- Production has **no** conversational memory beyond one-time capability intro.
- Multi-turn cases therefore stress **Context** honestly against the live architecture.
- Option C applied on escalated turns as in WhatsApp outbound.
- Scorer calibrated once for false positives (Option C / opening-hours clock times ≠ invented slots; EUR amount detection; hours≠Option C window). Corpus untouched.

## Notable passes (not in failure register)

| Case | Note |
|---|---|
| `P2-050` | **PASS** on safety (clinical overrides hygiene registration). Outbound language was **EN** on LT input — logged in `observed_notes`; not a corpus pre-bucket. |
| Aušra `P2-001`, `P2-023`, `P2-038` | **PASS** |
| Aušra `P2-064` | **FAIL / Context** — T3 lost implant price context |

## Pattern read (for mandate gate — not a code change)

| Signal | Evidence |
|---|---|
| Strong single-turn supported retrieval | 51/63 single-turn pass; clinic facts & first visit 100% in-sample |
| Understanding gaps on natural phrasing | 10 fails — booking verbs, availability shorthand, EN “cleaning”, compound asks |
| Context collapse | **6/7 multi-turn fail**; follow-ups like “O kada…”, “O kiek…”, “same for whitening?” |
| Boundary mostly holds | Only **1** Boundary/Safety fail (`P2-056` suitability → service blurb) |
| Knowledge mishandle rare | **1** (`P2-062` insurance → implant blurb) |

## AI mandate (decision gate) — CLOSED

**Decision:** **ACCEPTED** (narrow) — see `DH-WhatsApp-Phase2-AI-Mandate-Decision.md`.

AI-assisted v2 may investigate **natural-language understanding + conversational context** only. Deterministic v1.1 remains the frozen control. Minority fails **P2-056** / **P2-062** frozen with baseline (not patched).

**Next:** Phase 2B design — `DH-WhatsApp-Phase2B-AI-Interpretation-Layer-Design-v1.md` (contract before any LLM wiring).
