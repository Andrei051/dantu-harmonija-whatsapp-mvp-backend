# NL Evaluation — Phase 2D offline summary

**Status:** **VALID / FROZEN** 🔒  
**Date:** 2026-09-18  
**Condition:** Same Corpus v0.1 · Prompt v0.1 · gpt-4o · prior-turn context · **Phase 2D policy hardening**  
**Artefacts:** `data/DH-WhatsApp-NL-Evaluation-v2-offline-results.json` (overwritten by this run) · invocations jsonl  

---

## Comparison ladder

| Measure | v1.1 control | Phase 2C (AI+context) | Phase 2D (+policy) |
|---|---|---|---|
| Overall | 52/70 | 60/70 | **64/70** |
| Single-turn | 51/63 | 54/63 | **57/63** |
| Multi-turn | 1/7 | 6/7 | **7/7** |
| Understanding fails | 10 | 8 | **6** |
| Context fails | 6 | 0 | **0** |
| Knowledge fails | 1 | 1 | **0** |
| Boundary/Safety fails | 1 | 1 | **0** |
| Schema validity | — | 78/78 | **78/78** |

---

## Phase 2D research question

> Can deterministic policy safely consume AI interpretation without introducing permissive defaults or inappropriate Foundation substitution?

| Authorised item | Result |
|---|---|
| D1 unresolved booking ↛ online | **P2-031 PASS** (was Boundary fail) |
| D2 Foundation ask-family gate | **P2-062 PASS** (sentinel) |
| D3 composable hours+booking | **P2-043 PASS** |
| D4 greeting → capabilities | **P2-001 PASS**; Aušra **P2-064 PASS** |
| D5 P2-061 scorer | **P2-061 PASS** |
| Clinical / Context preserved | Clinical **8/8**; multi-turn **7/7**; Context fails **0** |

**Answer: Yes** — for the authorised hardening set. Policy can consume AI interpretation more safely without undoing the Context win.

---

## Sentinels

| Case | 2C | 2D |
|---|---|---|
| P2-056 suitability → clinical | PASS | PASS |
| P2-062 insurance ↛ implant blurb | FAIL | **PASS** |

---

## Remaining fails (6) — all Understanding

Left as evidence; **not** prompt-tuned in this phase.

| Case | Note |
|---|---|
| P2-009 | Lab still not routed to non-service Foundation topic |
| P2-012 | Service-list ask scoring/assembly miss |
| P2-024 | Consultation booking → contact (D1 unresolved/non-online service); expected online |
| P2-027 | Generic visit booking → contact under D1; expected online |
| P2-030 | Orthodontist consultation → contact (orthodontics ≠ hygiene/diagnostics online set) |
| P2-060 | “Best doctor?” → unknown/handoff |

**Trade-off note:** D1’s safe default (unresolved → contact) correctly killed P2-031’s permissive online path, and also moves some *consultation-shaped* bookings without an online-eligible service id to contact. That is safer than false online eligibility; refining “consultation cue → online even if service null” would be a **separate, explicit** Behaviour inventory rule — not done here.

---

## Phase 2D conclusion

**CLOSED as successful for its question** 🔒  

- Permissive online default removed  
- Foundation-substitution on absence families gated  
- Composability / greeting / sentinel Knowledge repaired  
- No Boundary/Safety fails; Context cliff remains solved  

**Production WhatsApp integration — still NOT AUTHORISED.**  

Corpus optimisation **STOP**. Next stage is product decision-making: `DH-WhatsApp-Phase3-Productisation-Pilot-Gate.md` (clinic-side pilot preferred before public exposure).
