# Phase 3 — Productisation & Pilot Gate

**Date:** 2026-09-18  
**Status:** **OPEN**  
**Character:** Product / operational decision — **not** benchmark optimisation  

---

## Formal record (locked)

| Item | Status |
|---|---|
| Phase 2D | CLOSED 🔒 |
| AI interpretation architecture | VALIDATED for continued product consideration ✅ |
| Corpus v0.1 optimisation | **STOP** 🛑 |
| Production infrastructure deployment | **Authorised for Phase 3A controlled owner/tester validation only** |
| Clinic pilot (Aušra) | **NOT YET AUTHORISED** |
| Patient / public WhatsApp use of AI v2 | **NOT AUTHORISED** 🔒 |

### Terminology (do not conflate)

| Phrase | Means |
|---|---|
| Production infrastructure deployment | v2 path may run on real WhatsApp plumbing for **controlled testing** |
| Clinic pilot | Inviting Aušra / colleagues into a coherent experiment |
| Patient production use | Public or real-patient AI assistant — **not approved** |

“We deployed v2 to PROD” must **never** be read as “we approved AI for patients.”

---

## What research already answered

| Finding | Implication |
|---|---|
| Context requires different architecture | Prior-turn interpretation removed Context fails on Corpus v0.1 |
| AI need not own clinic truth/policy | Interpretation-only hybrid was enough |
| Deterministic controls matter more with AI | 2C exposed permissive defaults; 2D fixed them without prompt changes |
| Remaining 6 Understanding misses | Safe contact/handoff; chasing them turns v0.1 into a training set — **stop** |

Ladder: v1.1 **52/70** → 2C **60/70** → 2D **64/70**.

---

## Product criterion (Phase 3 gate)

**Technical success is insufficient.**

Any pilot must produce evidence of **workflow / patient value**, not merely that the assistant correctly interprets messages. Correctness without a reason to use it is not a product.

---

## Sequence (authorised order)

```text
Phase 3A — Production-like technical validation (owner/tester)
        ↓
       Internal simulated-patient use (natural WhatsApp behaviour)
        ↓
Phase 3B — Clinic-side pilot (Aušra) — only after 3A passes
        ↓
       Pilot review → Outcome A / B iterate / C
        ↓
       Limited patient pilot — only if explicitly authorised
```

**Do not ask Aušra to participate until Phase 3A is complete and the clinic-pilot protocol + safeguards are finished.** Her role is value judgment, not discovering webhook bugs.

---

## Outcome menu (after evidence)

| Outcome | Meaning |
|---|---|
| **A — Do not deploy** | Interesting research; value ≤ operational complexity |
| **B — Iterate clinic-side** | Continue/refine internal or clinic pilot |
| **C — Limited patient pilot** | Narrow exposure after privacy, monitoring, rollback |

Preferred first clinic path (when ready): **clinic-side pilot**, not public patients.

---

## Evidence strategy

| Dataset | Role |
|---|---|
| Corpus **v0.1** | Frozen architectural benchmark — **do not add pilot cases** |
| Separate empirical set (e.g. v0.2) | Owner-observed / clinic-observed / later patient-observed |

---

## Related artefacts

- `DH-WhatsApp-Phase3A-Controlled-PROD-Validation.md` — 3A protocol (authorised now)  
- Phase 3B clinic-pilot protocol — draft after 3A passes (boundary, safeguards, data, evidence)

---

## Opening question for stakeholders

We answered: *Can AI solve the architectural weakness?*  

Phase 3 asks: *Is this valuable and safe enough in actual clinic use to justify becoming a product capability?*
