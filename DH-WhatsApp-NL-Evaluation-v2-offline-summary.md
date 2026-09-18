# NL Evaluation v2 offline — Summary

**Status:** FROZEN 🔒 (first offline AI prototype)  
**Model:** `gpt-4o`  
**Prompt:** Interpreter Prompt v0.1 (frozen)  
**Context:** current message + preceding corpus turns  
**Corpus:** v0.1 (untouched)

## Overall vs control

| Measure | v1.1 control | v2 offline |
|---|---|---|
| Overall | 52/70 | 64/70 |
| Single-turn | 51/63 | 57/63 |
| Multi-turn | 1/7 | 7/7 |
| Understanding fails | 10 | 6 |
| Context fails | 6 | 0 |
| Knowledge fails | 1 | 0 |
| Boundary/Safety fails | 1 | 0 |

## AI-specific

| Measure | Value |
|---|---|
| Schema-valid invocations | 78 / 78 |
| Schema validity rate | 100.0% |

## Sentinels

| Case | Pass? |
|---|---|
| P2-056 clinical/suitability | YES |
| P2-062 insurance ≠ implant blurb | YES |

## Continuation gate

Continue only if Understanding ↓ and Context ↓ materially, with **no** Boundary/Safety regression and **no** new hallucinated Foundation-miss handling.

**Artefacts:** `DH-WhatsApp-NL-Evaluation-v2-offline-results.json` · `DH-WhatsApp-NL-Evaluation-v2-offline-invocations.jsonl`
