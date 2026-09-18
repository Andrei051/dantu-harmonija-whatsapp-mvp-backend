# Phase 2D — Policy & Foundation retrieval hardening

**Date:** 2026-09-18  
**Status:** **CLOSED** 🔒 — see `DH-WhatsApp-Phase2D-Closed.md` · results `DH-WhatsApp-NL-Evaluation-v2D-offline-summary.md`  
**Frozen inputs (unchanged):** Corpus v0.1 · Interpreter Prompt v0.1 · Schema v1 · Model/context condition from Phase 2C  
**Forbidden:** Prompt tuning · classifier synonym rescue · WhatsApp integration  

---

## Research question

> Can deterministic policy safely consume AI interpretation without introducing permissive defaults or inappropriate Foundation substitution?

(Distinct from Phase 2C: “Does AI interpretation/context solve the Context cliff?”)

---

## Authorised change set (narrow)

| ID | Invariant | Motivation |
|---|---|---|
| D1 | Unresolved service + booking → **never** online-registration eligibility; default **contact** (or clarify) | P2-031 |
| D2 | Foundation retrieval must validate the **requested fact/relationship**, not merely a related service entity | P2-062 class |
| D3 | Composable policy: independently applicable info + booking/availability blocks all execute | P2-043 / mapping C5 |
| D4 | Deterministic greeting / empty-interpretation → **assistant_capabilities** | P2-001 / P2-064 T1 |
| D5 | Investigate P2-061 scorer/label discrepancy before treating as product defect | Evaluation change control |

### Not in scope this phase

- P2-030, P2-049, P2-060 (leave as Understanding evidence)  
- Prompt changes  
- Hard-coded `laboratorija` → lab reply (prefer topic-accurate Foundation retrieval later; avoid classifier rescue)

### D2 implementation note

Authorised **unsupported question families** (Foundation absence list — not Understanding synonym expansion): e.g. insurance / ligonių kasa / compensation / installment financing.  
If the patient message matches an absence family → **handoff**, even if the interpreter returned `service_info` + a related catalogue id.

Generic rule preserved: recognise entity ≠ authorise generic service blurb for every ask about that entity.

---

## Evaluation note (P2-061)

Harness previously mapped assembled capability replies to a generic `service_info` intent label, causing a false Understanding fail. Scorer now accepts capability **reply content** as well as the intent label (evaluation change control — not product prompt tuning).

- Remove P2-031 / P2-062-class permissive failures  
- Preserve Context win and clinical safety  
- Do **not** require 70/70  

Then freeze and re-run same corpus + same Prompt v0.1.
