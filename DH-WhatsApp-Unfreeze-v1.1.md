# Unfreeze note — Deterministic v1.1 alignment pass

**Date:** 2026-09-18  
**Decision:** UNFREEZE — narrow scope only  
**Authorisation:** Align live deterministic assistant (verified v1 baseline) with clinic-reviewed Foundation / Behaviour v1.1.

---

## In scope

| Area | Change |
|---|---|
| Clinic facts | Weekdays 08:00–20:00; mobile `+370 610 11222`; parking / first-visit text |
| Service taxonomy | Website-aligned names; laboratory removed as patient service; aesthetic / prosthetics adds |
| Booking routing | Never self-books; consultation + oral hygiene → `/registracija/`; other booking → clinic contact |
| Urgent path | Safety reply → phone; never online registration |
| WhatsApp handoff | Monitored; Option C ack uses working-day **08:00–17:00** wording; redirect ≠ team ack |
| Prices | Behaviour follows **source rule** + approved disclaimer; `prices.json` remains a **temporary cache** of `/kainos/` with source + sync metadata |

## Out of scope (do not expand this pass)

- Opportunistic classifier expansion / synonym rescue  
- AI / LLM work  
- Live price scraping or automated synchronisation infrastructure  
- Unrelated product enhancements  

---

## Engineering follow-up (logged, not blocking v1.1)

**Price-source synchronisation / retrieval automation**  
Keep `prices.json` as an explicit temporary cache of https://dantuharmonija.lt/kainos/ until a separate engineering task automates refresh. Do not block patient testing on that infrastructure.

---

## Exit criteria → re-freeze

1. Automated regression + v1.1 acceptance suite green  
2. Small production smoke (one case per changed branch)  
3. Freeze: Foundation v1.1 · Behaviour v1.1 · Deterministic implementation v1.1 · suite green · smoke passed  

Then stop improving the deterministic classifier; move to Phase 2 natural-language evaluation against the frozen baseline.
