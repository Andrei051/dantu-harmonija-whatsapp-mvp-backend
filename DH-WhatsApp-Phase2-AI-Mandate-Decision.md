# Phase 2 — AI mandate decision

**Date:** 2026-09-18  
**Status:** **ACCEPTED** (narrow scope) ✅  
**Evidence:** `DH-WhatsApp-NL-Evaluation-v1.1-summary.md` · failure register · frozen corpus v0.1  

---

## Decision

Evaluation of frozen **deterministic v1.1** found that failure is concentrated in **natural-language understanding** and **conversational context** (**16/18** failures), while the existing deterministic **boundary/safety** layer largely held.

**AI-assisted v2 is therefore authorised for investigation** with a narrow mandate:

> **Interpret natural patient language and resolve conversational context.**

### Explicitly not authorised

AI is **not** authorised to:

- become the source of clinic truth  
- make clinical decisions  
- invent availability  
- determine prices independently  
- bypass deterministic safety / routing controls  

---

## Why this is earned, not assumed

| Signal | Evidence |
|---|---|
| Deterministic strength where expected | Single-turn **51/63**; clinic facts & first-visit **perfect in-sample**; prices & clinical/urgent **7/8** |
| Architectural cliff | Multi-turn **1/7** vs single-turn **51/63** |
| Taxonomy alignment | **16/18** fails = Understanding or Context |
| Safety mostly held | Boundary/Safety **1/18**; Knowledge mishandle **1/18** |

Overall **52/70 (74.3%)** is descriptive. The **shape** of failure justifies the mandate.

---

## Minority failures — freeze with baseline (do not patch v1.1)

| Case | What | Why it matters for v2 |
|---|---|---|
| **P2-056** | “Ar balinimas man tinka?” → whitening **service blurb** | Personalised suitability crossing clinical territory. AI may help *identify* clinical/suitability; **deterministic policy must still enforce** the boundary. |
| **P2-062** | Insurance/reimbursement → **implant service blurb** | Confident misclassification turns knowledge **absence** into an inappropriate answer. |

**Implication for v2:** the interpretation layer should be able to express signals such as:

- appears clinical / suitability  
- approved knowledge does not contain an answer  
- ambiguity / unsupported  

…after which **deterministic policy** decides what is permitted.

Prefer that over forcing the model to always emit one of the existing intents.

**Do not reopen deterministic v1.1** for these findings. The system is now an experimental **control**. Findings are frozen with the baseline (different risk call if v1.1 were about to be broadly patient-exposed without a successor path).

---

## Frozen controls (unchanged)

| Artefact | Status |
|---|---|
| Deterministic implementation v1.1 | **FROZEN** 🔒 |
| Foundation / Behaviour v1.1 | **FROZEN** 🔒 |
| NL Corpus v0.1 | **FROZEN** 🔒 |
| Evaluation results v1.1 | **FROZEN** 🔒 |
| Phase 2A scoring | **CLOSED** 🔒 |

---

## Next

**Phase 2B — AI Interpretation Layer Design**  
Specify authority and contract **before** any LLM integration or webhook wiring.

See: `DH-WhatsApp-Phase2B-AI-Interpretation-Layer-Design-v1.md`
