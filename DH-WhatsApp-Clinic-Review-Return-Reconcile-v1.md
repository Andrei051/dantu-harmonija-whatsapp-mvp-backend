# Clinic review return — reconciliation (Gate 1)

**Status:** Internal working note — do **not** reply to Aušra yet  
**Date:** 2026-09-18  
**Inputs:** Returned clinic review workbook (your read-through) · frozen `DH-WhatsApp-Clinic-Review-LT-v1` · live website scan `dantuharmonija.lt`  
**Positioning note (separate track):** experience / company since 2007 → log only for MPR; not WhatsApp Foundation

---

## Gate verdict

| Item | State |
|---|---|
| Behaviour boundaries (can / cannot clinical) | Effectively **confirmed** ✅ |
| WhatsApp monitoring | **Yes**, working days **08:00–17:00** ✅ |
| Foundation facts as reviewed | **Not approved unchanged** — corrections + design shifts |
| Gate 1 (bounded review closed) | **Very close** — after we apply corrections + record source-of-truth / booking requirements |
| Patient QR pilot | Still **not** opened |

Agree with your read: this is better than blank approval. No clinic email until we finish our-side reconcile and only then, if needed, a compact query.

---

## Classification of every comment type

### A — Straightforward corrections (apply in Foundation / Behaviour draft)

| Topic | Clinic comment (as summarised) | Website check | Proposed action |
|---|---|---|---|
| Opening hours (assistant) | Weekdays **08:00–20:00** only; drop Sat/Sun from what we currently use | Website footer **still** lists Sat 09–14 (prior reg) + Sun closed | Apply **clinic instruction for the assistant**. Note divergence from website — do not silently re-add Saturday unless they ask |
| Phone | **+370 610 11222** only | Site still shows mobile **and** `(8-5) 27 222 11` | Assistant uses **mobile only** per review; landline may remain site-only |
| Service rename | Fizioterapija → **Kineziterapija** / žandikaulio terapija | Nav: **Kineziterapija** | Rename in catalogue |
| Add services | **Estetinis plombavimas**, **Estetinis protezavimas** | Both are first-class nav items | Add as separate patient-facing services |
| Laboratory | Not a patient service; supporting clinic capability | Nav under “Kita”: Laboratorija | Remove from patient service catalogue; optional “about clinic” fact later (unapproved until explicit) |
| Price disclaimer | Prefer: *Kaina yra preliminari ir galutinę kainą įvardins tik gydytojas.* | Site still uses longer “orientacinės…” wording | Adopt **clinic-proposed** disclaimer for assistant |
| Handoff ack | Prefer timed: *Jūsų užklausą gavome, atsakysime darbo dieną nuo 8:00 iki 17:00.* (+ polish OK) | n/a | Adopt principle; polish LT slightly before code change |
| First visit | Include parking; soften paperwork; procedure consents; treatment plan created; “from website” | [Prieš pirmąjį vizitą](https://dantuharmonija.lt/pries-pirmaji-vizita/) + contacts parking copy | Rewrite first-visit from **current site** (see draft below) |

### B — New requirements (design before implement)

| Topic | Finding | Decision |
|---|---|---|
| **Online booking** | Assistant may direct to online registration for **Konsultacija pas specialistus** and **Higiena** | **Do not implement yet.** Inspect mechanism first. Entry URL found: `https://dantuharmonija.lt/registracija/` — still need: exact bookable types, deep links, EN handling, and Behaviour wording (cannot book itself; can **link** for supported types; else contact/WhatsApp handoff) |
| **Price source-of-truth** | Repeated: agent should take price ranges from a designated place; prices change | Record as **architectural rule**, not approve frozen JSON numbers. Interim: stop treating reviewed price table as permanent approval; designate `https://dantuharmonija.lt/kainos/` as published source for future retrieval / sync. Live retrieval can wait |

### C — Taxonomy / naming (resolvable from website — no email yet)

| Our review label | Website label | Reading of “ką turima omenyje?” |
|---|---|---|
| Periodontologinis gydymas | **Periodontologija** | Our invented umbrella name; site uses specialty name. Rename to **Periodontologija** |
| Dantų protezavimas | **Dantų protezavimas** + separate **Estetinis protezavimas** | Likely unclear because we had one bucket; site splits prosthetic vs aesthetic prosthetic. Keep both as separate catalogue rows |
| Dantų plombavimas | **Dantų plombavimas** + **Estetinis plombavimas** | Same split — already requested as add |
| Ortodontinis gydymas | **Dantų tiesinimas** | Align name to site (**Dantų tiesinimas**) unless clinic prefers clinical term |
| Dantų implantacija | **Dantų implantavimas** | Align verb form to site |
| Vaikų odontologija | **Vaikų dantų gydymas** | Align to site |
| Dantų šaknų kanalų gydymas | **Kanalų gydymas** | Align to site |
| Anestezija | Not a top-level nav item | Keep only if on price page / needed; else confirm later |
| Konsultacijos ir diagnostika | **Diagnostika** (+ consultation prices under Kainos) | Prefer site taxonomy when rebuilding catalogue |

Clinic instruction: *sutikrinti visas paslaugas, kaip skelbiame puslapyje* → rebuild patient catalogue from **nav + kainos sections**, not our invented list.

### D — Confirmed as-is (no change)

- General clinic Q&A, services-as-category, address, LT/EN  
- Clinical boundaries (no diagnosis / advice / treatment selection / unapproved facts)  
- WhatsApp monitored weekdays 08:00–17:00 → Option C / team ack **allowed** in that window (wording to be updated)

### E — Out of scope for WhatsApp

- Distinctiveness / since 2007 → **MPR positioning candidate only** (hypothesis, not claim)

---

## Proposed patient-facing service catalogue (v1.1 draft names)

Mirror site nav (Gydymas + relevant Kita), **excluding** Laboratorija as a bookable/patient “service” row:

1. Burnos higiena  
2. Dantų implantavimas  
3. Dantų tiesinimas  
4. Dantų protezavimas  
5. Estetinis protezavimas  
6. Dantų plombavimas  
7. Estetinis plombavimas  
8. Kanalų gydymas  
9. Dantų balinimas  
10. Periodontologija  
11. Dantų šalinimas  
12. Vaikų dantų gydymas  
13. Kineziterapija  
14. Diagnostika / konsultacijos *(wording TBD from kainos headings)*  

Gift voucher: omit from assistant catalogue unless clinic asks.

---

## First-visit rewrite basis (from site, for Foundation v1.1)

From [pries-pirmaji-vizita](https://dantuharmonija.lt/pries-pirmaji-vizita/):

- Prepare questions; arrive **10–15 min** early to prepare and **sign required documents**; bring ID.  
- Reception: patient questionnaire + service agreement; clinic internal rules; water/coffee; disposable hygiene items.  
- Chairside: examination; diagnostics as needed (dental / panoramic / cephalogram / CT).  
- Plan & fee: several options usually exist; dentist advises and presents prices; **patient decides**; plan formed with clinician.  
- Parking (contacts / first-visit): free parking at main entrance (site: **5 spaces** on contacts page); paid nearby.

Soft paperwork = site tone (“pasirašyti reikiamus dokumentus” / anketa + sutartis + rules) rather than heavy legal framing. Procedure-specific consents: align with clinic comment when drafting — site stresses documents before procedure readiness.

---

## Online booking — open inspection checklist (our side)

URL: `https://dantuharmonija.lt/registracija/`

**First look (2026-09-18):** live online registration page exists (“Pasirinkite paslaugą ir tinkamą laiką”). Flow UI includes: choose service → choose doctor → date/time → patient info. Urgent help is **phone-only** (not online), with mobile `+370 61011222`. Landline still appears in footer elsewhere.

Before Behaviour/code change, document:

1. Exact options in “Pasirinkite paslaugą” (confirm Konsultacija / Higiena and any others Aušra named)  
2. Whether deep links / preselected service URLs exist  
3. Language behaviour  
4. What the assistant should say for types that are **not** in the online list  
5. Exact patient-facing sentence + link(s) for Behaviour v1.1  

---

## Price architecture — proposed Foundation rule (v1.1)

**Approved rule (policy), not approved snapshot of numbers:**

> The assistant may provide prices currently published by the clinic from the designated price source (`https://dantuharmonija.lt/kainos/` unless clinic names another), together with the clinic-approved preliminary disclaimer: *Kaina yra preliminari ir galutinę kainą įvardins tik gydytojas.*

Implication: frozen Excel price table is **historical evidence of review**, not permanent authorised content. Manual JSON remains interim until sync/retrieval exists — and should be treated as stale-risk.

Spot-check already shows drift (e.g. tray whitening **214 €** on site vs our older **200 €**).

---

## Proposed next steps (our side only)

1. Preserve returned workbook in repo as evidence (when you drop the file in).  
2. Inspect `registracija/` booking surface → booking pathway note.  
3. Draft **Foundation v1.1** + **Behaviour v1.1** deltas (hours, phone, taxonomy, first visit, handoff wording, price rule, online-booking *principle* with link TBD).  
4. **Do not** code or un-freeze implementation until those drafts are reviewed.  
5. Only if still blocked: compact clinic query (e.g. confirm assistant should omit Saturday hours despite website; confirm landline omitted from WhatsApp).

---

## Compact questions (parked — ask only if still needed after drafts)

1. Assistant hours: weekdays only even though website still shows Saturday?  
2. WhatsApp phone line: mobile only — never landline?  
3. Online booking: confirm exact types + preferred link text after we screenshot `registracija/`.
