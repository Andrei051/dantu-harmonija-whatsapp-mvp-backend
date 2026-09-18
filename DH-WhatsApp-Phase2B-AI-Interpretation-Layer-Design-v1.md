# Phase 2B — AI Interpretation Layer Design v1

**Date:** 2026-09-18  
**Status:** Design v1 — **AGREED** ✅ · executable contracts **FROZEN** 🔒  
**Prerequisite:** Phase 2A closed · AI mandate **ACCEPTED** (`DH-WhatsApp-Phase2-AI-Mandate-Decision.md`)  
**Test bed (frozen):** Corpus v0.1 · Evaluation v1.1 baselines  
**Executable contracts:**  
- `DH-WhatsApp-AI-Interpretation-Schema-v1.md` + `data/DH-WhatsApp-AI-Interpretation-Schema-v1.json`  
- `DH-WhatsApp-AI-Signal-Policy-Mapping-v1.md`  

---

## Purpose

Specify precisely what authority an AI layer receives before any OpenAI (or other) call is wired into WhatsApp.

**Design principle:**

> The LLM **interprets** what the patient means; it does **not** decide what the clinic is allowed to say.

---

## Problem the layer is authorised to solve

From evaluation v1.1:

1. **Understanding** — natural / shorthand / compound Lithuanian (and some EN) phrasing misrouted or missed.  
2. **Context** — follow-ups (“O kada…”, “O kiek…”, “same for whitening?”) fail because production preserves almost no dialog state.

It is **not** authorised to replace Foundation, Behaviour, or deterministic critical routing.

---

## Target pipeline (conceptual)

```
Patient message + conversation context
        ↓
AI interpretation (see Schema v1)
  - language
  - intents[] (multi-intent)
  - service_or_topic (+ source)
  - signals: booking, availability, clinical_or_suitability, unsupported_or_ambiguous
  - references[]
  - overall_confidence (logged; not thresholded in v1)
        ↓
Deterministic policy / safety (see Policy Mapping v1)
  - suppressive vs composable rules
  - what may be answered?
  - which route? (none | contact | online_registration | phone | option_c)
  - clinical override required?
  - online registration allowed?
  - human escalation required?
        ↓
Foundation / source retrieval
  - approved clinic facts / services / prices…
  - **miss ⇒ knowledge absence** (policy), not an AI “knowledge_gap” claim
        ↓
Controlled response assembly
```

---

## Authority split

| Concern | Owner |
|---|---|
| What the patient meant | AI interpretation |
| What the clinic may say / do | Deterministic Behaviour + policy |
| What is true about the clinic | Foundation / designated sources |
| Critical safety routing (urgent → phone; never invent slots; no self-book) | Deterministic code |
| Prices | Source rule + cache + disclaimer (not model-invented fees) |

---

## Interpretation output contract (draft schema)

The AI layer returns a **structured interpretation object**, not patient-facing prose (v2 prototype may forbid free-text clinic answers from the model entirely).

Suggested fields (names illustrative):

| Field | Type | Role |
|---|---|---|
| `language` | `lt` \| `en` \| `mixed` | Response language policy input |
| `intents` | ranked list or multi-label | e.g. price, booking, availability, clinical… |
| `service_or_topic` | id \| null \| `ambiguous` | Link to catalogue / topic |
| `booking_signal` | none \| soft \| hard | Desire to schedule |
| `availability_signal` | boolean | Asking for slots/times |
| `clinical_or_suitability` | boolean + optional subtype | Pain, “man tinka”, diabetes, compare treatments… |
| `unsupported_or_ambiguous` | boolean | Unclear / unrecognisable ask — **not** “Foundation lacks a fact” |
| `references` | objects | Resolved entities from prior turns |
| `confidence` | 0–1 | Logged experimentally; **no policy thresholds in v1** |

### Hard rule

The model **must not** be forced to always emit one legacy `MessageIntent`. Prefer multi-intent + signals. **Knowledge absence** is established by Foundation miss + policy, not by an AI `knowledge_gap` field.

---

## Deterministic policy (unchanged ownership)

Examples of decisions that remain code/Behaviour-owned:

- If `clinical_or_suitability` → phone safety path; **never** `/registracija/` as substitute.  
- If booking + hygiene/consultation inventory → may offer online registration link.  
- If booking + treatment → contact.  
- If availability → never invent slots.  
- If price + known service → cache/source amount + disclaimer.  
- If `knowledge_gap_likely` and no Foundation hit → refuse / handoff; **do not** invent.  
- Option C only when escalation follow-up is expected.

---

## Conversation context the AI may see

v1.1 production stores almost nothing. For v2 **evaluation and prototype**, the interpretation step may receive:

- current message  
- prior N turns of the **same WhatsApp conversation** (patient + assistant text)  
- optional structured summary of prior topic/service if maintained by the harness  

Context window policy and retention/PII rules are part of implementation design (not specified here beyond: minimum needed for reference resolution).

---

## Success condition for the first v2 prototype

Run the **same untouched** Corpus v0.1. Compare to Evaluation v1.1.

| Measure | Deterministic v1.1 | AI-assisted v2 |
|---|---|---|
| Overall | 52/70 | ? |
| Single-turn | 51/63 | ? |
| Multi-turn | 1/7 | ? |
| Understanding fails | 10 | ? |
| Context fails | 6 | ? |
| Knowledge fails | 1 | ? |
| Boundary/Safety fails | 1 | ? |

**No arbitrary “must hit 90%” target.**

Directional success:

1. Understanding failures **materially decrease**  
2. Context failures **materially decrease**  
3. Boundary/Safety does **not regress** (especially P2-056-class)  
4. Knowledge absence does **not** become hallucinated knowledge (especially P2-062-class)  

If overall rises (e.g. 67/70) but new unsafe clinical answers appear → **reject** that prototype.

---

## Explicit non-goals for Phase 2B

- Wiring LLM into production WhatsApp webhook  
- Letting the model draft final clinic copy as source of truth  
- Expanding live price scrape infrastructure  
- Patching deterministic v1.1 classifier for corpus fails  
- Building a general “AI dentist”  

---

## Deliverables

| Artefact | Status |
|---|---|
| Phase 2B design note | **AGREED** ✅ |
| Interpretation Schema v1 | **FROZEN** 🔒 |
| Signal → Policy Mapping v1 | **FROZEN** 🔒 |
| Offline LLM prototype | **Not authorised until** both contracts frozen (now satisfied) — still requires explicit go-ahead to call a model |

**Prototype boundary (unchanged):** frozen corpus → interpretation → schema → policy/Foundation → controlled assembly → scorer. No WhatsApp/Render/RAG/price-scrape/AI patient prose required for the first experiment.
