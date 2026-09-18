# DH WhatsApp NL Corpus v0.1 — Manifest

**Corpus id:** `DH-WhatsApp-NL-Corpus-v0.1`  
**Status:** **FROZEN** 🔒  
**Frozen at:** 2026-09-18  
**Charter:** `DH-WhatsApp-Phase2-NL-Evaluation-Charter-v1.md` (signed off)  
**Data file:** `data/DH-WhatsApp-NL-Corpus-v0.1.json`  
**SHA-256:** `B0AECFB96E8D045809F5DCEAB1E94DEC6C3624FC4B46FBF8EE2C740F2B724E40`  
**Case count:** **70**

---

## Purpose of freeze

This corpus is frozen **before** any scoring against deterministic v1.1.  
Do not edit cases to chase classifier behaviour. Evaluation results are separate artefacts.

---

## Language mix

| Language | Cases |
|---|---|
| `lt` | 58 |
| `en` | 10 |
| `mixed` | 2 |
| **Total** | **70** |

---

## Scenario family (primary purpose tags)

Targets were approximate, not quotas. Multi-turn cases may also exercise booking/price behaviour.

| Family | Cases |
|---|---|
| clinic_facts | 5 |
| services | 8 |
| prices | 8 |
| booking | 10 |
| availability | 5 |
| mixed_intent | 8 |
| first_visit | 4 |
| clinical_urgent | 8 |
| unsupported_ambiguous | 7 |
| multi_turn | 7 |
| **Total** | **70** |

---

## Provenance

| Provenance | Cases | Notes |
|---|---|---|
| `clinic-observed` | 4 | Aušra greeting; named-doctor booking; price+availability line; full multi-turn sequence |
| `patient-observed` | 1 | Production smoke LT clinical (`P2-050`) — verbatim |
| `constructed` | 65 | Behavioural variation; ordinary WhatsApp phrasing |
| `receptionist-observed` | 0 | Reserved for later |

---

## Empirical core (verbatim anchors)

| case_id | Provenance | Conversation |
|---|---|---|
| `P2-001` | clinic-observed | `Sveiki` |
| `P2-023` | clinic-observed | `Domina paskirti visita implantacijai pas gyd Mariu Bucinska` |
| `P2-038` | clinic-observed | `Kokia kaina? Kada turite laisvu laiku?` |
| `P2-064` | clinic-observed | Full Aušra three-turn sequence |
| `P2-050` | patient-observed | `Skauda dantį, noriu užsiregistruoti higienai` (smoke; safety expected; **no pre-assigned failure bucket** for LT→EN) |

---

## Scoring ban until results file exists

Do **not** run deterministic v1.1 against this corpus until ready to write a separate evaluation results document.  
No-rescue rule applies for the whole run.

**Next:** score frozen corpus → evaluation results (pass/fail, one primary bucket on fail, optional `observed_notes` for partial success).
