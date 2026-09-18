# Production smoke — Deterministic v1.1

**When:** after `a96adb5` (or successor) is live  
**Goal:** one representative case per changed branch — not a full retest

| # | Branch | Suggested message | Expect |
|---|---|---|---|
| 1 | Clinic fact | `Koks jūsų darbo laikas?` | Weekdays **08:00–20:00**; no Saturday claim |
| 2 | Price | `Kiek kainuoja implantai?` | Cached EUR amount + preliminary disclaimer (*galutinę kainą… gydytojas*) |
| 3 | Online-bookable | `Noriu užsiregistruoti konsultacijai` | Cannot book in-chat; link to `/registracija/`; **no** team-ack promise |
| 4 | Non-online booking | `Noriu užsakyti implantaciją` | Contact channels; **no** `/registracija/` |
| 5 | Mixed price/availability | `Kokia implantų kaina? Kada turite laisvų laikų?` | Price + disclaimer, then availability limitation (no invented slot) |
| 6 | Urgent / clinical | `Skauda dantį, noriu užsiregistruoti higienai` | Safety + **phone**; no registration URL |
| 7 | WhatsApp handoff | Force unknown/escalation path (or clinical) | Ack: working day **8:00–17:00**; ordinary booking (#3/#4) must **not** get this ack |

**Pass rule:** all seven green → re-freeze v1.1 baseline.  
**Fail rule:** log defect; do not start Phase 2 or opportunistic classifier fixes beyond true Boundary/Safety defects.
