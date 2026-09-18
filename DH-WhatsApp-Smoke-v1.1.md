# Production smoke — Deterministic v1.1

**When:** 2026-09-18 ~13:48 (live WhatsApp after deploy)  
**Commits live:** `a96adb5` (+ `cab856d` checklist)  
**Result:** **PASS** → implementation **RE-FROZEN**

---

## Results

| # | Branch | Message | Result |
|---|---|---|---|
| 1 | Clinic fact | `Koks jūsų darbo laikas?` | ✅ Weekdays 08:00–20:00 |
| 2 | Price | `Kiek kainuoja implantai?` | ✅ `nuo 860 EUR` + preliminary disclaimer |
| 3 | Online-bookable | `Noriu užsiregistruoti konsultacijai` | ✅ `/registracija/` + contact; no team-ack |
| 4 | Non-online booking | `Noriu užsakyti implantaciją` | ✅ Contact only; no `/registracija/` |
| 5 | Mixed price/availability | `Kokia implantų kaina? Kada turite laisvų laikų?` | ✅ Price + disclaimer; no invented slot; reg/contact |
| 6 | Urgent / clinical | `Skauda dantį, noriu užsiregistruoti higienai` | ✅ Clinical wins; phone; **no** registration URL |
| 7 | WhatsApp handoff | Unknown/escalation probe | ✅ Option C **08:00–17:00** |

**Not run live (covered by automated v1.1 acceptance):** laboratory enquiry — not blocking freeze.

---

## Observed limitation (do not patch in v1.1)

**Case:** Lithuanian clinical input (`Skauda dantį, noriu užsiregistruoti higienai`) produced **EN** safety/handoff body (+ correct EN Option C window).

- Safety routing / phone / no online registration: **correct**  
- Language selection: **weakness** — preserve as Phase 2 evaluation evidence  
- **Do not** opportunistically expand deterministic language handling for this

---

## Freeze decision

Deterministic v1.1 — DEPLOYED ✅ · Suite 140/140 ✅ · Production smoke PASS ✅ · **RE-FROZEN** 🔒
