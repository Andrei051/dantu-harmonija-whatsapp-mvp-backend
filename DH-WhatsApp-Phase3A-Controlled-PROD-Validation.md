# Phase 3A — Controlled PROD technical validation

**Date:** 2026-09-18  
**Status:** **CLOSED** 🔒  
**Parent:** `DH-WhatsApp-Phase3-Productisation-Pilot-Gate.md`  
**Successor:** `DH-WhatsApp-Pre3B-Product-Hardening.md` (product-policy hardening — **not** Phase 3B)

---

## Formal outcome

| Gate | Result |
|---|---|
| **Technical gate** | **PASS** ✅ |
| **Patient-product assessment** | **PARTIAL** ⚠️ |

**Verdict:** Phase 3A **validated the production architecture** (optional v2 path on frozen v1.1 through real WhatsApp) and **identified product-policy / retrieval issues** that require a **controlled Pre-3B hardening** step before any clinic-side pilot.

| Authorisation | Status |
|---|---|
| Owner/tester PROD validation | Completed |
| **Aušra / clinic pilot (Phase 3B)** | **NOT AUTHORISED** 🔒 |
| Patient / public AI v2 use | **NOT AUTHORISED** 🔒 |

Corpus v0.1 was **not** re-opened. No prompt/corpus chasing during 3A.

---

## What was validated (technical PASS)

Live path on Render with `AI_ENABLED=true`:

```text
WhatsApp → webhook → AI_ENABLED?
  → bounded prior turns → AI interpreter → Schema v1
  → Phase 2D deterministic policy → Foundation
  → outbound  |  on failure → observable v1.1 fallback
```

| Capability | Evidence |
|---|---|
| Optional path (not rewrite) | Non-AI / kill switch remains pure v1.1 |
| Schema gating | Invalid / forced-fail → no silent repair |
| Observable fallback | `#11`: `forced_api_failure`, `forced_invalid_schema`; recovery → `path: "v2"` |
| Multi-turn context across webhooks | Anchor `#9`–`#10`; owner sims |
| Reference + topic replacement | e.g. implant → whitening; `O kiek?` / `jis` |
| Policy remains authoritative | S1/D2 fired when signals present; no invented slots/prices/bookings |
| Layered diagnostics | `ai_path_inbound_context` → `ai_path_interpretation` → `ai_path_policy_outbound` |

Kill switch / activation: `AI_ENABLED` only (allowlist deferred to Phase 3B). Temporary `AI_FORCE_FAIL` used for `#11` only.

---

## Scripted anchors (after correct deploy `718e94b`)

| # | Result | Notes |
|---|---|---|
| 1–3 | PASS | Capabilities; implant price; price+availability |
| 4 | **FAIL** (waiver) | Interpretation correct (`orthodontics` + hard booking); `bookingRouteFor` ignored consultation cue → contact (**F4**) |
| 5–8 | PASS | Treatment/filling contact; S1 suitability; D2 insurance |
| 9–10 | PASS | Context + references + topic switch; availability→`/registracija/` wording noted as UX observation |
| 11 | PASS | API + schema force-fail + v2 recovery (after env hygiene) |

Early Pass 1 on `cab856d` exercised **v1.1 only** — discarded for v2 scoring.

---

## Owner-observed natural simulations

| ID | Journey | Assessment |
|---|---|---|
| **001** | General dental concern / broken tooth (LT) | **PARTIALLY APPROPRIATE** — logistics/booking safe; clinical turns over-urgent |
| **002** | Elective whitening journey (LT) | **PARTIALLY APPROPRIATE** — opening price OK; suitability/process → emergency S1 |
| **003** | Price shopper (LT) | **PARTIALLY APPROPRIATE** — **no S1**; multi-intent / filling price misses (**F5**) |
| **004** | Parent / child (LT) | **NOT APPROPRIATE** (UX) — children + first-visit Foundation miss / S1; still safe |
| **005** | EN exploratory / stress | **PARTIALLY APPROPRIATE** — stable under provocation; reinforces F1/F5/F6 |

Comparative control: **003 never hit S1**; **001 / 002 / 004** repeatedly did → F1/F2 are journey-boundary issues, not random instability.

---

## Findings (evidence level at 3A close)

| ID | Finding | Level |
|---|---|---|
| **F1** | Clinical judgement ≠ urgent situation — S1 uses emergency-framed phone language for ordinary clinical uncertainty | **Systematic** (001, 002, 004; compatible 005) |
| **F2** | Safety suppression too coarse — mixed turns lose safe Foundation-backed components | **Systematic** (001, 002, 004) |
| **F3** | Correction / negation / some references incomplete (e.g. `higienos nereikia`) | **Observe / defer** (001) |
| **F4** | Consultation booking routing loses consultation cue after resolved specialty id | **Confirmed** (anchor #4) |
| **F5** | Price / service retrieval & compound price handling incomplete | **Recurring** (001, 003, 005) |
| **F6** | Approved Foundation knowledge not reliably surfaced (clinic name, lab, children, …) | **Recurring** (004, 005) |

Additional observation (not elevated): implant **availability** copy may point at generic online registration while treatment context is implant — related to F4 family.

---

## Explicit non-goals (unchanged)

- Re-running Corpus v0.1 as success metric  
- Prompt polishing for tone while F1/F2 remain wrong  
- Clinic Voice / presentation pass (deferred until behaviour is right)  
- Inviting Aušra  
- Patient production use  

---

## Next (not 3B)

1. Open **Pre-3B Product Hardening** — design F1/F2 replacement behaviour from owner evidence **before code**  
2. Gate blockers: **F1 + F2**; candidates **F4–F6** after RCA; defer **F3**  
3. Clinic Voice & Response Presentation v1 — **after** F1/F2 green  
4. Short owner smoke → only then design **Phase 3B** clinic-pilot protocol  

**Do not conflate:** Pre-3B hardening ≠ Phase 3B Aušra pilot.
