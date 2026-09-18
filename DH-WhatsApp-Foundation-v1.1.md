# DH WhatsApp Assistant — Foundation v1.1 (knowledge model)

**Status:** Clinic-reviewed baseline (derived) — ready for implementation planning; **implementation not yet unfrozen**  
**Date:** 2026-09-18  
**Governance:** Internal translation of the returned clinic-facing review. Aušra did **not** approve this document verbatim — traceability is to `docs/clinic-review/2026.09.18-…-RETURNED.xlsx`. Prefer “clinic-reviewed baseline” over “Clinic Approved.”  
**Evidence:** Returned review · website · `DH-WhatsApp-Registration-Inventory-v1.md`  
**Paired with:** `DH-WhatsApp-Behaviour-Scope-v1.1.md`

---

## How this differs from Foundation v1

| Area | v1 | v1.1 |
|---|---|---|
| Prices | Static amounts in KB treated as reviewable facts | **Authoritative-source rule:** designated `/kainos/` + clinic-requested disclaimer; cache is interim only |
| Services | Our constructed list (incl. laboratory as service) | **Website taxonomy** (clinic names); lab is not a patient service |
| Booking facts | Contact-only | Contact + online registration URL for consultations / hygiene |
| Hours / phone | Full website hours + two phones | Channel facts from returned review |
| First visit | Short summary | Site-aligned + parking + consents + treatment plan |

**Model note:** some Foundation knowledge is *content*; some is an *authoritative-source rule*. Prices are the latter.

---

## 1. Clinic profile (assistant channel)

| Field | Semantic id | Value for assistant | Notes |
|---|---|---|---|
| Name | — | Dantų Harmonija | Confirmed (+) |
| Address | — | Olimpiečių g. 1A-24, LT-09235 Vilnius | Confirmed (+) |
| Opening hours | `clinic_opening_hours` | **Darbo dienomis 08:00–20:00** | Returned review replaced the longer Sat/Sun string with weekdays only. Website still lists Saturday — **documented source difference**; implementation follows returned review |
| WhatsApp human response | `whatsapp_human_response_window` | **Working days 08:00–17:00** | **Not** the same as opening hours. Provenance: monitoring confirmed **Taip** (R25); 08–17 from clinic’s proposed patient handoff wording (R24) |
| Phone | — | **+370 610 11222** | Single number from returned review. Website still shows landline — **documented source difference**; implementation follows returned review |
| Email | — | klinika@dantuharmonija.lt | Confirmed (+) |
| Website | — | https://dantuharmonija.lt/ | Confirmed (+) |
| Parking | — | Free parking at main entrance (site: 5 spaces); paid nearby | From website / contacts; include with first-visit |

Google Maps link: keep current place link for 1A-24.

### Documented source differences

Implementation follows the **returned clinic review** for this channel unless subsequently changed. Website disagreements (Saturday hours, landline) stay documented; they are **not** open clinic questions.

---

## 2. Patient-facing service catalogue

**Rule:** Foundation lists **what the clinic calls the service** (website taxonomy). Patient synonyms and intent matching belong to the interpreter layer, not this catalogue.

### In catalogue

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
13. Kineziterapija / žandikaulio terapija  
14. Diagnostika  
15. Anestezija *(confirmed + in review; not a top nav item — retained)*  

**Keep separate:**

- **Service taxonomy** (this section)  
- **Booking taxonomy** (registration inventory — consultation types + hygiene)  
- **Patient-language synonyms** (implementation / future AI interpreter)

Example: laminatės / veneers → map in the interpreter to **Estetinis protezavimas** where supported by published content; do not invent a separate Foundation catalogue row.

### Explicitly not a patient service

- **Laboratorija** — supporting clinic capability. Optional later “about clinic” fact only. **No patient-facing lab prices.**

### Clinic instruction

> Reikėtų sutikrinti visas paslaugas, kaip mes skelbiame puslapyje.

Catalogue names above are that sync pass; long descriptions stay deferred.

---

## 3. Prices — knowledge model

### Clinic-requested source rule

The assistant may provide prices **currently published by the clinic** from the designated source:

- **Designated source:** https://dantuharmonija.lt/kainos/  
- **Disclaimer (clinic-proposed wording):**  
  > *Kaina yra preliminari ir galutinę kainą įvardins tik gydytojas.*  
  EN working equivalent: *The price is preliminary; only the dentist will state the final fee.*

When the assistant states that it can give prices, patients must also understand that only the dentist, after assessing the situation at the visit, can give the exact fee (returned comment on “can provide published prices”).

### What this is not

- The v1 / Excel static price table is **not** a permanent authorised dataset  
- Laboratory work prices are **not** shown to patients  

### Interim cache (until sync/retrieval exists)

A manual JSON cache of `/kainos/` may exist as engineering interim. Semantics must record:

- `source`: https://dantuharmonija.lt/kainos/  
- `retrieved_or_synchronised_at`: timestamp  
- `cached_value`: …  
- `disclaimer`: approved wording above  

The cached figure is **not** the truth; the published source is. Sync method (manual / build-time / scheduled / live) is deferred engineering.

---

## 4. Online registration (fact for assistant)

- **URL:** https://dantuharmonija.lt/registracija/  
- **Safely bookable online:** specialist consultations + Burnos higiena (exact rows in registration inventory)  
- **Not online:** inventing slots; urgent care (phone); treatments not on the registration form  

Full inventory: `DH-WhatsApp-Registration-Inventory-v1.md`.

---

## 5. First visit

### Before the visit

- Recommend arriving **10–15 minutes early** to calmly complete documents.  
- Bring an **identity document**.  
- Include **parking** (website): free parking at the main entrance; paid options nearby.  

### During the visit

- Documents at reception; **procedure consents** may need to be completed.  
- Examination; diagnostics if needed.  
- A **treatment plan** is drawn up; options and fees discussed with the dentist; final fee only after clinical assessment.  

---

## 6. Still out of Foundation for patient QR

- Doctor roster / bios as in-chat booking targets (registration page handles doctor choice)  
- Invented availability  
- Clinical recommendations / diagnosis  
- Unapproved promotional “about clinic” claims  
- Positioning claims (e.g. since 2007) — MPR track only  

---

## 7. No further clinic clarification currently required

Saturday hours and landline are documented source differences (channel follows returned review). Taxonomy splits and synonyms are internal modelling. Booking verified against registration inventory. Price sourcing and WhatsApp monitoring come from the returned workbook.
