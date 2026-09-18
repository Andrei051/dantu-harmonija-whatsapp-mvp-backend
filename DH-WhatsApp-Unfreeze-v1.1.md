# Unfreeze note — Deterministic v1.1 alignment pass

**Date:** 2026-09-18  
**Decision:** UNFREEZE (narrow) → alignment complete → **RE-FROZEN** 🔒  
**Authorisation was:** Align live deterministic assistant (verified v1 baseline) with clinic-reviewed Foundation / Behaviour v1.1.

---

## In scope (completed)

| Area | Change |
|---|---|
| Clinic facts | Weekdays 08:00–20:00; mobile `+370 610 11222`; parking / first-visit text |
| Service taxonomy | Website-aligned names; laboratory removed as patient service; aesthetic / prosthetics adds |
| Booking routing | Never self-books; consultation + oral hygiene → `/registracija/`; other booking → clinic contact |
| Urgent path | Safety reply → phone; never online registration |
| WhatsApp handoff | Monitored; Option C ack uses working-day **08:00–17:00** wording; redirect ≠ team ack |
| Prices | Behaviour follows **source rule** + approved disclaimer; `prices.json` remains a **temporary cache** of `/kainos/` with source + sync metadata |

## Out of scope (still forbidden while frozen)

- Opportunistic classifier expansion / synonym rescue  
- AI / LLM work inside this baseline  
- Live price scraping or automated synchronisation infrastructure  
- Language-selection patches from smoke observations  
- Unrelated product enhancements  

---

## Exit criteria

| Criterion | State |
|---|---|
| Automated suite green | ✅ 140/140 |
| Production smoke | ✅ PASS — `DH-WhatsApp-Smoke-v1.1.md` |
| Foundation v1.1 frozen | ✅ clinic-reviewed baseline |
| Behaviour v1.1 frozen | ✅ clinic-reviewed baseline |
| Deterministic implementation v1.1 frozen | ✅ aligned and live |

**Logged observation (not a reopen):** LT clinical → EN safety reply — Phase 2 evidence.  
**Logged follow-up (not blocking):** automate price-source synchronisation/retrieval.

---

## Project boundary

Stop developing the deterministic assistant. It is now the **experimental control baseline**.

Next: `DH-WhatsApp-Phase2-NL-Evaluation-Charter-v1.md` — define evaluation rules **before** building the 60–80 case corpus.
