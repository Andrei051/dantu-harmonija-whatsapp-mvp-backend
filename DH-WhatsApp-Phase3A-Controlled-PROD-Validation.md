# Phase 3A — Controlled PROD technical validation

**Date:** 2026-09-18  
**Status:** **ENGINEERING** 🟡 (optional v2 path on frozen v1.1; PROD deploy not yet)  
**Parent:** `DH-WhatsApp-Phase3-Productisation-Pilot-Gate.md`  
**Implementation principle:** v2 is an optional interpretation path around frozen v1.1 — not a rewrite. Sole activation gate = `AI_ENABLED`. Forced fallback for anchor #11 = `AI_FORCE_FAIL=api|schema` (temporary). Allowlist deferred to Phase 3B when Aušra joins.

---

## Purpose

Prove the **production plumbing**, not re-score intelligence.

Offline 2D already showed architecture + policy can work. 3A must show:

```text
WhatsApp → webhook → conversation identity/context
  → AI interpreter → schema validation
  → deterministic policy → Foundation
  → response assembly → WhatsApp
```

Especially: **multi-turn context must survive real message boundaries** (the 7/7 win used corpus-supplied prior turns — not yet live WhatsApp state).

---

## Authorisation boundary

| Allowed | Not allowed |
|---|---|
| Deploy v2 into **production infrastructure / WhatsApp channel** for controlled testing | Presenting v2 as a live clinic/patient service |
| Owner / designated technical testers only | Aušra clinic pilot (Phase 3B — later) |
| Deterministic safety/policy remains authoritative | Prompt-tuning against Corpus v0.1 |
| Kill switch / rollback to deterministic v1.1 | Public or real-patient AI use |

---

## Before first WhatsApp message (checklist)

### 1. Pilot / test boundary
- [x] Single owner/tester; WhatsApp not in live patient use for this window
- [ ] Rough duration / volume (lightweight — stop on repetition)
- [ ] Explicit: **experimental; not for real patient clinical enquiries**

### 2. Operational safeguards
- [x] Model/API failure → deterministic v1.1 fallback (`fallback_used` / `fallback_reason` logged)
- [x] Schema-invalid output → no silent repair; safe fallback
- [x] Deterministic S1 clinical / booking / Foundation-miss policy still enforced (Phase 2D `applyPolicyAndAssemble`)
- [x] Layered logs: `ai_path_inbound_context` → `ai_path_interpretation` → `ai_path_policy_outbound`
- [x] **Kill switch** `AI_ENABLED=false` → frozen v1.1
- [x] Anchor #11: `AI_FORCE_FAIL=api|schema` (temporary; no prompt tricks)

### 3. Data boundary
- [ ] Document exactly what text reaches the model provider
- [ ] What is logged, retention, access
- [ ] Avoid unnecessary patient/health data in this internal phase
- [ ] Confirm contractual/privacy stance for OpenAI (or chosen provider)

### 4. Evidence capture
- [ ] Per conversation: transcript/result, appropriate? (Y/N/partial), notes, provenance `owner-observed` / `internal-tester`
- [ ] Store in a **new** empirical folder/dataset — **never** into Corpus v0.1

---

## Smoke anchors (manual WhatsApp — not all 70)

Reproduce a **small** set through the real channel:

| # | Scenario | Expect |
|---|---|---|
| 1 | `Sveiki` | Capabilities (not Option C-only) |
| 2 | Implant price | Cached price + disclaimer |
| 3 | Price + availability | Both compose; no invented slot |
| 4 | Consultation booking | Online registration path |
| 5 | Treatment booking (e.g. implant) | Contact; not false online completion |
| 6 | Unresolved-service booking (e.g. filling shorthand) | **Contact**, not `/registracija/` |
| 7 | Suitability / clinical | Phone; booking suppressed |
| 8 | Insurance / reimbursement | Foundation miss / handoff — **not** implant blurb |
| 9 | 3–4 turn (Aušra-like): implant topic → booking → `O kiek kainuos?` | Context survives WhatsApp turns |
| 10 | Reference follow-ups: `O kada?` / `O kiek?` / whitening “same” | Context / safe limitation |
| 11 | *(if safe)* Force model failure or invalid schema | Fallback works |

Also use **natural** tester behaviour: typos, shorthand, topic switches, delayed follow-ups, LT/EN mix, two questions in one message — not only known passes.

| Finding type | Action |
|---|---|
| Serious safety / policy defect | **Stop**; fix under change control |
| Awkward Understanding miss that safely hands off | **Log** only; do not polish immediately |

---

## Pass criteria for 3A → unlock 3B design

- Anchors 1–10 behave as expected on live WhatsApp (or documented waivers)
- Context holds across real multi-turn (anchor 9–10)
- Fallback/kill switch verified or explicitly deferred with risk note
- No uncontrolled patient exposure occurred

Then: finish **Phase 3B clinic-pilot protocol** (boundary, safeguards, data, evidence + **value** criterion) → only then invite Aušra.

---

## Explicit non-goals

- Re-running Corpus v0.1 as the success metric  
- Asking Aušra to QA plumbing  
- Declaring patient production use  

---

## Next engineering (when implementing 3A)

Smallest deployable internal v2 on existing webhook with:

- conversation-scoped prior turns (minimum needed)
- schema validation
- Phase 2D policy assembly
- deterministic v1.1 fallback + kill switch  

Implementation starts only when this checklist’s data/ops items are accepted — then code against production infrastructure under the boundaries above.
