# DH Phase 4 Candidate Experiments

**Programme:** Experimentation (separate from closed discovery audit)  
Parent audit: `DH-Site-Audit-Discovery-Handbook-v1.md` (CLOSED — PASS through Phase 3)  
Historical pilot: `DH-Pre-Audit-Experiment-Register.md` → **EXP-001 PASS**

### Discovery model (locked — post EXP-002 + CAND-005)

Evidence base: Site architecture · GSC · GBP · Live SERP (EXP-002) · Named-clinician SERP (CAND-005)

| Surface | Behaviour |
|---|---|
| Brand | Primary trust layer |
| Named clinicians | Independent discovery layer (validated) |
| Orthodontics | Strong organic visibility |
| Implants | Strong organic visibility; weak local-pack |
| Whitening | Efficient discovery surface; competitive cosmetic SERP (EXP-003) |
| Prosthetics | Strong market demand; weak DH generic SERP visibility |
| Esthetics | Strong market demand; weak DH generic SERP visibility |
| Generic clinic / dentist | Weak DH visibility |

**Demand ≠ Visibility** (`F-EXP002-001`): Strong local demand does not imply strong clinic SERP visibility for that category.

**Specialist pathway (revised):** Generic dentist search ≠ DH strength. Named clinician search = strong DH discovery surface (`F-CAND005-001`).

**Programme validation status:** Audit 0–3 PASS · EXP-001 PASS · EXP-002 PASS · CAND-005 PASS · **EXP-003 PASS**. Discovery-model validation **closed**. Further work is exploration only.

---

## Active / Planned experiments

### EXP-002 — Discovery Surface Visibility Validation

| Field | Value |
|---|---|
| Title | Discovery Surface Visibility Validation |
| Status | **Complete** (Q1–Q9 captured 2026-07-14) |
| Origin | Phase 3 Discovery Model Validation |
| Type | Live SERP observation / model check |
| Parent programme | Phase 4 experimentation (not audit workbook) |

#### Objective
Validate whether observed Google visibility in Vilnius aligns with the discovery model derived from Phases 1–3.

#### Research question
Do the major discovery engines identified in the audit (Whitening, Implants, Prosthetics, Esthetics, Orthodontics, Brand/generic, Specialists) manifest in live Google search results?

#### Hypotheses
| ID | Hypothesis | Supports |
|---|---|---|
| H1 | DH appears prominently for whitening-related searches | Distinct Whitening Intent Engine |
| H2 | DH appears prominently for prosthetics-related searches | Hidden Duopoly (Prosthetics) |
| H3 | DH appears prominently for esthetic restoration searches | Hidden Duopoly (Esthetics) |
| H4 | DH performs relatively better in organic results than local-pack visibility for implants | Research-Heavy Discovery Engine |
| H5 | Specialist-related searches reveal a meaningful but secondary discovery surface | Secondary Specialist Discovery Pathway |

#### Methodology
**Environment**
- VPN: Lithuania
- Google: `google.lt`
- Incognito / logged out
- Single capture session

**Queries**
| ID | Query | Discovery surface |
|---|---|---|
| Q1 | dantų balinimas vilnius | Whitening |
| Q2 | dantų implantai vilnius | Implants |
| Q3 | dantų protezavimas vilnius | Prosthetics |
| Q4 | dantų protezai vilnius | Prosthetics |
| Q5 | estetinis plombavimas vilnius | Esthetics |
| Q6 | breketai vilnius | Orthodontics |
| Q7 | dantų tiesinimas vilnius | Orthodontics |
| Q8 | dantų klinika vilnius | Generic / brand-adjacent |
| Q9 | odontologas vilnius | Specialist |

**Capture template (per query)**
| Query | Local Pack Position | Organic Position | Notable competitors | Notes |
|---|---|---|---|---|
| Q1 | Not present (sponsored local ads) | ~3 (whitening service page) | rvl.lt, sypsenualeja.lt, videnta.lt, 32balti.lt, Šypsenų alėja (sponsored) | Revised — sponsored separated; see Q1 detail |
| Q2 | Not present | ~3 (implant service page) | Papadent, Šypsenos akademija, Gidenta, vinklinika, Bechara, DPC | Complete — see Q2 detail |
| Q3 | Not present | ~10 (prosthetics service page) | Papadent, Oradenta, vingioklinika, DPC, Šypsenos akademija, PGDENT | Complete — see Q3 detail |
| Q4 | Not present | ~8 (prosthetics service page) | DPC, vingioklinika, Papadent, Pilėnė, Euklinika, PGDENT | Complete — see Q4 detail |
| Q5 | Not present | >15 (~20+, esthetics service page) | Papadent, Restoklinika, Meliva, SDC, rvl, sypsenaok, Art Dentistry | Complete — see Q5 detail |
| Q6 | Not present | ~3 (orthodontics service page) | Pilėnė, Šypsenos akademija, sypsenaok, Era Dental, DPC, dtcentras | Complete — see Q6 detail |
| Q7 | Not present | ~1 (orthodontics service page) | Pilėnė, Restoklinika, vinklinika, Šypsenos akademija, Era Dental | Complete — see Q7 detail |
| Q8 | Not present | >15 (~20+, homepage) | SDC, Oradenta, Šypsenos akademija, Denticija, Ozoklinika, Gidenta | Complete — see Q8 detail |
| Q9 | Not present | Not found (pages 1–9) | N/A — exhaustive negative | Complete — see Q9 detail |

**Q1 capture detail — `dantų balinimas vilnius` (2026-07-14, revised)**

Environment: Lithuania VPN · google.lt · incognito (per user session)

**Correction:** Initial capture conflated sponsored BookitNow local-service ads with organic results. Revised after user separated sponsored block.

**Sponsored (excluded from organic count):**
- BookitNow.lt — “Dantų balinimas Vilniuje” aggregator listings (×2 blocks)
- Clinics in sponsored blocks: Šypsenų alėja, Joladenta, Europos odontologijos klinika, Aušra Dens, Dantukų pasaulis, DNR Clinic, Danės, Rudaminos, Smile art, OLD TOWN SPA, Get Smile, Senamiesčio klinika, Prodentas, Adri7
- DH: **not present** in sponsored local listings

**Organic (corrected):**
1. rvl.lt — Philips Zoom AKCIJA
2. vingioklinika.lt
3. **dantuharmonija.lt** — “Balinimas Kapomis ir Zoom Sistema” (`/paslaugos` whitening service page)
4. simetriadentica.lt
5. sypsenualeja.lt
6. rocklinika.lt
7. 32balti.lt
8. videnta.lt

**Q1 interim read (H1):** **Supports** organic prominence (~3) with query-aligned whitening service page. **Does not support** prominence in sponsored local-aggregator layer. Aligns with audit: whitening = efficient cosmetic intent engine; visibility channel-dependent (organic service page vs paid/local listings).

**Q2 capture detail — `dantų implantai vilnius` (2026-07-14)**

Environment: Lithuania VPN · google.lt · incognito (per user session)

**Sponsored (top block):**
1. dantugydytojas.lt (Papadent) — implantų akcija
2. vinklinika.lt — implantavimas per vieną apsilankymą
3. becharaclinic.lt — implantai per 1 vizitą
4. clinicdpc.lt — implantacija, konsultacija 0€
- DH: **not present**

**Places / Local Pack:**
1. Šypsenos akademija
2. Papadent (UAB Dantų gydytojas)
3. Odontologijos klinika Gidenta
4. Sponsored: Papadent (local ad)
- DH: **not present**

**Organic:**
1. sypsenosakademija.lt — implantacija
2. dantugydytojas.lt (Papadent) — implantai, kainos
3. **dantuharmonija.lt** — “Dantų implantavimas” (`/paslaugos` implant service page)
4. sosklinika.lt (Simonas Grybauskas)
5. clinicdpc.lt — (after mid-SERP sponsored block)

**Mid-SERP sponsored (between organic #4–#5):**
- Papadent, vinklinika — DH not present

**Q2 read (H4):** **Supports** — DH visible organic (~3) with intent-aligned service page; **absent** from Places/local pack and sponsored layers. Consistent with audit: implants = research-heavy discovery; organic service-page visibility stronger than local/paid surfaces.

**Q3 capture detail — `dantų protezavimas vilnius` (2026-07-14)**

Environment: Lithuania VPN · google.lt · incognito (per user session)

**Sponsored (top block):**
1. vingioklinika.lt — protezavimas
2. clinicdpc.lt — protezavimas
3. dentastra.lt
4. galidenta.eu
- DH: **not present**

**Places / Local Pack:**
1. Papadent (UAB Dantų gydytojas)
2. Oradenta odontologijos klinika
3. Sanidentas
4. Sponsored: Mackevičių odontologijos klinika
- DH: **not present**

**Organic:**
1. anteja.lt
2. pgdent.lt
3. sypsenosakademija.lt
4. manodaktaras.lt
5. dantucentras.lt — (after mid-SERP sponsored block)
6. pilene.lt
7. clinicdpc.lt
8. vinklinika.lt
9. sosklinika.lt
10. **dantuharmonija.lt** — “Dantų protezavimas” (`/paslaugos` prosthetics service page)

**Mid-SERP sponsored (between organic #4–#5):**
- meliva.lt, seimosodontologija.lt — DH not present

**Q3 read (H2):** **Does not support** “prominent” — DH absent from sponsored and Places; organic only ~10 despite query-aligned service page. Tension with audit GBP signal (prosthetics = strong local demand). Prosthetics SERP appears more competitive / specialist-dominated than whitening or implants for DH organic position.

**Q4 capture detail — `dantų protezai vilnius` (2026-07-14)**

Environment: Lithuania VPN · google.lt · incognito (per user session)

**Sponsored (top block):**
1. clinicdpc.lt — protezai, 100% garantija
2. vingioklinika.lt — protezai Naujamiestyje
3. dentastra.lt
4. meliva.lt — VIC Klinikos
- DH: **not present**

**Organic (before Places block):**
1. anteja.lt
2. pgdent.lt
3. ozoklinika.com
4. sypsenosakademija.lt
5. pilene.lt
6. vinklinika.lt
7. clinicdpc.lt

**Places / Local Pack (mid-SERP):**
1. Euklinika
2. Pilėnė
3. Papadent (UAB Dantų gydytojas)
4. Sponsored: Mackevičių odontologijos klinika
- DH: **not present**

**Organic (after Places block):**
8. **dantuharmonija.lt** — “Dantų Protezavimas Vilniuje \| Dantų Protezai ir Kaina” (`/paslaugos`)
9. dantucentras.lt
10. sosklinika.lt

**Q4 read (H2):** **Does not support** “prominent” — same prosthetics surface as Q3; DH ~8 organic (vs Q3 ~10), absent from sponsored and Places. Query wording (`protezai` vs `protezavimas`) yields marginal organic lift only; prosthetics live SERP remains specialist/competitor-dominated for DH.

**Q5 capture detail — `estetinis plombavimas vilnius` (2026-07-14)**

Environment: Lithuania VPN · google.lt · incognito (per user session)

**Sponsored (multiple blocks throughout SERP):**
- Papadent, Restoklinika, Meliva, SDC klinika, Prodentum, sypsenaok.lt, madentis.lt (repeated blocks)
- DH: **not present**

**Places / Local Pack (multiple blocks):**
- Šypsenos akademija, Pilėnė, Papadent, Sakalausko, Sanidentas, Gidenta, Euklinika, Meleda, Precize, OZO, Ateities, Dantų centras, Dentaminta
- DH: **not present**

**Organic (confirmed top 10 — DH absent):**
1. sypsenosakademija.lt
2. dantugydytojas.lt (Papadent)
3. rvl.lt
4. ozoklinika.com
5. pilene.lt
6. sypsenualeja.lt
7. rocklinika.lt
8. majuklinika.lt
9. artdentistry.lt
10. manodaktaras.lt

**Organic (later page-1 — DH appears deep):**
- vinklinika.lt, clinicdpc.lt, 32balti.lt, odontika.com, citydent.lt, prodentum.lt, ortodenta.lt, euromed.lt, sdcklinika.lt, videnta.lt, seimosodontologija.lt, euklinika.lt
- **dantuharmonija.lt** — “Estetinis Plombavimas Vilniuje” (`/paslaugos` esthetics service page) — **>15 (~20+)**

**Q5 read (H3):** **Does not support** “prominent” — DH absent from all sponsored and Places blocks; organic position deep on page 1 despite query-aligned service page. Mirrors Q3–Q4 prosthetics pattern: audit GBP esthetics demand strong, but live generic esthetics SERP is specialist/ad-dominated with DH outside top tier.

**Q6 capture detail — `breketai vilnius` (2026-07-14)**

Environment: Lithuania VPN · google.lt · incognito (per user session)

**Sponsored (top block):**
1. eradental.lt — breketai, 4.9 įvertinimas
2. clinicdpc.lt — breketai
3. offer.sypsenosakademija.lt — tiesinimo paketas
4. sypsenaok.lt — breketai
- DH: **not present**

**Places / Local Pack:**
1. Pilėnė
2. Oradenta odontologijos klinika
3. Sanidentas
4. Sponsored: Šypsenos akademija
- DH: **not present**

**Organic:**
1. pilene.lt — breketai
2. sypsenosakademija.lt — breketai
3. **dantuharmonija.lt** — “Dantų Tiesinimas Vilniuje — Breketai ir Invisalign Kapos” (`/paslaugos` orthodontics service page)
4. sypsenaok.lt
5. dtcentras.lt

**Q6 read (Orthodontics):** **Supports** prior expectation (Moderate–Strong) — DH ~3 organic with query-aligned service page; absent from sponsored and Places. Pattern matches Q1/Q2: strong organic `/paslaugos` visibility for intent-aligned queries where DH has dedicated service coverage.

**Q7 capture detail — `dantų tiesinimas vilnius` (2026-07-14)**

Environment: Lithuania VPN · google.lt · incognito (per user session)

**Sponsored (top block):**
1. vinklinika.lt — kapos, nemokama konsultacija
2. restoklinika.lt — tiesinimas kapomis
3. offer.sypsenosakademija.lt — tiesinimo paketas
4. eradental.lt — breketai / kapomis
- DH: **not present**

**Places / Local Pack:**
1. Pilėnė
2. Oradenta odontologijos klinika
3. Šypsenos akademija
4. Sponsored: Restoklinika (Restauracinės Odontologijos Klinika)
- DH: **not present**

**Organic:**
1. **dantuharmonija.lt** — “Dantų Tiesinimas Vilniuje — Breketai ir Invisalign Kapos” (`/paslaugos` orthodontics service page)
2. pilene.lt

**Q7 read (Orthodontics):** **Supports** prior expectation — DH **~1 organic** with same service page as Q6; absent from sponsored and Places. Broader query (`tiesinimas` vs `breketai`) strengthens DH organic position vs Q6 (~3), confirming orthodontics as a strong organic discovery surface for DH.

**Q8 capture detail — `dantų klinika vilnius` (2026-07-14)**

Environment: Lithuania VPN · google.lt · incognito (per user session)

**Sponsored (multiple blocks throughout SERP):**
- SDC klinika, Meliva/InMedica, lavesa.lt, sypsenaok.lt, Bechara, madentis.lt, 32balti, galidenta, vingioklinika (repeated blocks)
- DH: **not present**

**Places / Local Pack (multiple blocks):**
- Oradenta, Šypsenos akademija, Pilėnė, Meliva, Meleda, SDC, City Dent, Dentaminta, Sakalausko, Ateities
- DH: **not present**

**Organic (confirmed top 10 — DH absent):**
1. sypsenosakademija.lt
2. denticija.lt
3. ozoklinika.com
4. clinicdpc.lt
5. satrijosklinika.lt
6. majuklinika.lt
7. dantuspecialistai.lt
8. gidenta.lt
9. sdcklinika.lt
10. dentara.lt

**Organic (later page-1 — DH appears deep):**
- pagalbadantims.lt, sypsnis.lt, pilene.lt, kristadenta.lt, ateitiesodontologijosklinika.lt, meliva.lt, vinklinika.lt, seimosodontologija.lt, simetriadentica.lt, uoc.lt, dentes.lt, adadenta.lt, implantucentras.lt (directory — lists DH among 35 clinics), papadent, jusuodontologas.lt
- **dantuharmonija.lt** — homepage (“Odontologijos klinika Vilniuje — Dantų Harmonija”) — **>15 (~20+)**

**Q8 read (Generic clinic):** **Does not support** prior expectation (Strong) — DH absent from sponsored and Places; homepage deep on page 1. Generic clinic SERP dominated by multi-location groups (Denticija, Šypsenos akademija), high-review locals (Oradenta, Gidenta), and ad-heavy operators (SDC). Secondary mention: implantucentras.lt directory lists DH — not a primary ranking signal.

**Q9 capture detail — `odontologas vilnius` (2026-07-14)**

Environment: Lithuania VPN · google.lt · incognito (per user session)

**Capture method:** User scrolled through **9 pages** of Google results.

**Result:** DH (**dantuharmonija.lt**) **not found** in organic, sponsored, or Places across pages 1–9.

**Q9 read (H5):** **Does not support** generic specialist-query visibility. Consistent with audit framing: specialist discovery is a **named-clinician / brand-adjacent pathway** (GSC doctor-name clicks ~16%), not generic `odontologas vilnius`. Q9 tests the wrong shape of specialist intent for DH prominence — negative result is interpretable, not a model failure.

#### Success criteria
Not “DH ranks #1.”

Succeeds if observations can be **meaningfully interpreted against** the discovery model:
- Whitening Engine
- Implant Research Engine
- Prosthetics Engine
- Esthetics Engine
- Orthodontics Engine
- Specialist Pathway
- Generic clinic visibility

#### Prior expectations (before capture)
| Surface | Expectation |
|---|---|
| Whitening | Strong |
| Prosthetics | Strong |
| Esthetics | Strong |
| Orthodontics | Moderate–Strong |
| Implants | Strong organic, less dominant local |
| Specialists | Secondary |
| Generic clinic | Strong |

#### Results
**Q1–Q9 complete** (2026-07-14)

| Query | DH Local Pack | DH Organic | Hypothesis read |
|---|---|---|---|
| Q1 dantų balinimas vilnius | Not present (sponsored) | ~3 whitening `/paslaugos` | H1 supported (organic); not supported (sponsored local) |
| Q2 dantų implantai vilnius | Not present | ~3 implant `/paslaugos` | H4 supported — organic yes; local/sponsored no |
| Q3 dantų protezavimas vilnius | Not present | ~10 prosthetics `/paslaugos` | H2 not supported for “prominent” |
| Q4 dantų protezai vilnius | Not present | ~8 prosthetics `/paslaugos` | H2 not supported; marginal lift vs Q3 |
| Q5 estetinis plombavimas vilnius | Not present | >15 esthetics `/paslaugos` | H3 not supported for “prominent” |
| Q6 breketai vilnius | Not present | ~3 orthodontics `/paslaugos` | Orthodontics expectation supported |
| Q7 dantų tiesinimas vilnius | Not present | ~1 orthodontics `/paslaugos` | Orthodontics expectation supported (stronger) |
| Q8 dantų klinika vilnius | Not present | >15 homepage | Generic clinic expectation not supported |
| Q9 odontologas vilnius | Not present | Not found (p. 1–9) | H5 not supported for generic specialist query |

#### Verdict
**PASS** — model validation (not ranking success).

EXP-002 succeeded: all nine queries yield **meaningful interpretation** against the Phase 3 discovery model. The model is **refined**, not overturned.

**Validated patterns**
| Pattern | Evidence |
|---|---|
| Service-intent organic engine | DH `/paslaugos` ~1–3 for whitening (Q1), implants (Q2), orthodontics (Q6–Q7) |
| Implant research split | Q2: strong organic, absent local/sponsored — matches research-heavy discovery |
| GBP–SERP divergence (duopoly) | Prosthetics (Q3–Q4) and esthetics (Q5): audit GBP demand strong; live generic SERP weak (~8–20+) |
| Local/sponsored blind spot | DH absent from Places and sponsored blocks across **all** Q1–Q9 captures |
| Generic discovery weak | Q8 homepage ~20+; Q9 absent through 9 pages |
| Brand/specialist path orthogonal | Generic `odontologas` / `dantų klinika` ≠ how brand or named-specialist discovery works in audit |

**Hypothesis summary**
| ID | Result |
|---|---|
| H1 Whitening | Supported (organic ~3) |
| H2 Prosthetics | Not supported for SERP prominence |
| H3 Esthetics | Not supported for SERP prominence |
| H4 Implants | Supported (organic > local) |
| H5 Specialists | Not supported on *generic* query; **resolved by CAND-005** for named queries |

**Model refinement (locked from EXP-002)**
Live Google discovery for DH is **service-intent and page-type dependent**: intent-aligned `/paslaugos` surfaces rank well for whitening, implants, and orthodontics; prosthetics/esthetics demand manifests more in GBP than generic SERP; generic clinic/dentist head terms are weak DH acquisition surfaces.

**Finding `F-EXP002-001`:** Demand surfaces and visibility surfaces are separate analytical layers. Strong local demand ≠ strong clinic visibility for that demand category.

**Follow-on:** Named-clinician validation — **CAND-005 PASS** (resolved H5; final major model validation). Whitening anomaly → **EXP-003** (market-structure refinement).

---

### EXP-003 — Whitening Market Structure

| Field | Value |
|---|---|
| Title | Whitening Market Structure |
| Status | **Complete** (WQ1–WQ5 captured 2026-07-14) |
| Origin | EXP-002 whitening tension + programme refinement questions |
| Type | Live SERP market-structure observation |
| Parent programme | Phase 4 refinement (not new discovery foundation) |

#### Why this experiment exists

| Source | Observation |
|---|---|
| GBP | Whitening = strongest clinical demand signal |
| GSC | Whitening = highly efficient visibility |
| EXP-002 Q1 | DH ~3 organic — present, not dominant |

All three can be true simultaneously. EXP-003 asks what *kind of market* whitening is.

#### Research question
**RQ-EXP003-001:** What structural characteristics of the Vilnius whitening market explain the difference between whitening demand signals (GBP/GSC) and DH’s live SERP visibility?

#### Hypotheses
| ID | Hypothesis |
|---|---|
| W1 | Specialist competition — SERP dominated by clinics positioning around cosmetic dentistry |
| W2 | SERP saturation — whitening unusually competitive vs implants / orthodontics |
| W3 | GBP / organic separation — Maps, reviews, local-pack matter more than organic rank alone |
| W4 | Intent fragmentation — market split across multiple query families, not one dominant query |

#### Success criteria
Succeeds if we can **explain** why whitening looks stronger in GBP/GSC than DH’s generic whitening SERP position would suggest.  
Not: whether DH ranks #3 or #8.

#### Prior (Outcome A)
High whitening demand + many specialist competitors + strong Maps behaviour → GBP strong · GSC efficient · SERP crowded — would reconcile all observations.

#### Queries
| ID | Query | Notes |
|---|---|---|
| WQ1 | dantų balinimas vilnius | Reuse EXP-002 Q1 (complete) |
| WQ2 | dantu balinimas kaina vilnius | Price + location |
| WQ3 | dantu balinimas kaina | Price-only fragmentation |
| WQ4 | dantu balinimas zoom | Valid — DH has Zoom service copy + articles |
| WQ5 | dantu balinimas odontologas | Profession-framed whitening |

#### Capture template (per query)
| Query | DH Position | Local Pack (DH Y/N) | Ads count | Who owns page 1 (repeat clinics) | Competitor types |

**Competitor types:** clinic · cosmetic clinic · directory · article · marketplace

**Ignore exact ego ranking.** Focus on page-1 ownership repeats (W2) and result-type mix (W1).

#### WQ1 page-1 ownership / type decomposition (from EXP-002 Q1, revised)

| # | Domain | Type |
|---|---|---|
| 1 | rvl.lt | Clinic service (cosmetic/Zoom promo) |
| 2 | vingioklinika.lt | Clinic service |
| 3 | **dantuharmonija.lt** | Clinic service (`/paslaugos`) |
| 4 | simetriadentica.lt | Clinic service |
| 5 | sypsenualeja.lt | Clinic (multi-city cosmetic) |
| 6 | rocklinika.lt | Clinic service |
| 7 | 32balti.lt | Clinic service |
| 8 | videnta.lt | Clinic service |

**WQ1 sponsored / Places:** BookitNow aggregator local ads; Šypsenų alėja, Joladenta, etc. — DH absent local/sponsored.

**WQ1 interim (pre WQ2–WQ5):** Page 1 organic ≈ **clinic/cosmetic service pages** (no directories/articles in corrected top 8). Cosmetic-named competitors (rvl Zoom, sypsenualeja, 32balti) present → leans W1. Crowding relative to implants/ortho TBD with WQ2–WQ5 repeat analysis.

#### Results

**Capture summary**

| Query | DH organic | Local Pack / ads | Page-1 ownership pattern |
|---|---|---|---|
| WQ1 dantų balinimas vilnius | ~3 service `/paslaugos` | DH absent; BookitNow/local ads heavy | Clinic/cosmetic service pages (rvl, vingioklinika, DH, sypsenualeja, 32balti, videnta…) |
| WQ2 dantu balinimas kaina vilnius | ~16 service (prices) | DH absent; Meliva, lavesa, Danės, Šypsenos ads + BookitNow | **Price pages dominate** — videnta, kainoraščiai (Antakalnio, Šypsenos, Dentiste, Sanidentas, Oradenta…), Papadent, 32balti, rvl, Pilėnė, marketplace `dantuklinikos.lt` |
| WQ3 dantu balinimas kaina | ~15+ service (prices) | DH absent; Meliva/lavesa/Danės/Šypsenos ads + BookitNow | Price SERP + **AI Overview**; Vilnius + Kaunas kainoraščiai; directories/marketplaces |
| WQ4 dantu balinimas zoom | ~6 **article** `/naudinga` | DH absent; Meliva, Šypsenos, BookitNow ads | Zoom-system specialists: Šypsenos akademija, Neodenta, RVL, VIN, Affidea, DPC; AI Overview cites DH article |
| WQ5 dantu balinimas odontologas | ~4 **homepage** (not whitening page) | DH absent; Meliva, Šypsenos, SDC ads | Cosmetic/general clinics: Era Dental, PGDENT, Simetria, Ateities; weak intent match |

**Who owns page 1 — repeat competitors across WQ1–WQ5**

| Competitor | Appears in |
|---|---|
| Meliva / InMedica | Ads WQ2–WQ5 (heavy) |
| Lavesa | Ads WQ2–WQ3 |
| Šypsenos akademija | Ads + organic (WQ2 kainoraštis, WQ4 Zoom #1) |
| Danės klinika | Ads WQ2–WQ3 |
| Videnta | Organic leader on price queries (WQ2–WQ3) |
| RVL | Organic WQ1, WQ2, WQ3, WQ4 |
| BookitNow | Marketplace / local-listing blocks WQ1–WQ4 |
| Papadent | Organic WQ2–WQ3 |
| 32:Balti | Organic WQ1–WQ2 |
| Pilėnė | Organic WQ2–WQ3 |
| Sypsenų alėja | WQ1 organic + BookitNow listings |

**Result-type mix (not ego rank)**

| Type | Role on whitening SERPs |
|---|---|
| Clinic service / kainoraštis | Dominant organic |
| Cosmetic Zoom specialists | Own Zoom query + ads |
| Marketplace / directory | BookitNow, dantuklinikos.lt |
| Article | Rare except Zoom (DH article surfaces on WQ4) |
| AI Overview | Price (WQ3) and Zoom (WQ4) informational layer |

#### Hypothesis evaluation
| ID | Result |
|---|---|
| W1 Specialist competition | **Supported** — Zoom/cosmetic-positioned clinics (rvl, Lavesa Zoom ads, Šypsenos Zoom, Neodenta, Affidea) and aesthetic clinics (32balti, Era Dental) recur |
| W2 SERP saturation | **Supported** — same names repeat across variants; price queries push DH from ~3 (generic) to ~15+; far more crowded than implants/ortho ~1–3 surfaces |
| W3 GBP / organic separation | **Supported** — DH consistently absent from Places/local ads while organic remains merely present; Maps/aggregator layer is a separate competitive surface |
| W4 Intent fragmentation | **Supported** — generic, price, Zoom, and “odontologas” produce **different** page-1 structures and DH page types (service vs article vs homepage) |

#### Verdict
**PASS** — Outcome A confirmed.

Whitening is a **high-demand, high-competition, channel-separated cosmetic market**:
- GBP/GSC capture local + efficiency signals
- Live SERP is saturated by specialist/cosmetic clinics, kainoraščiai, Zoom product framing, ads, and marketplaces
- DH is **visible but not dominant** on the generic head term (~3); weaker on price (#15+) and off-type on profession framing (homepage)

This reconciles the whitening anomaly without contradicting Phase 3 or EXP-002.

**Finding `F-EXP003-001`:** Whitening demand strength ≠ organic SERP dominance. Whitening behaves as a **Maps/efficiency + contested cosmetic SERP** market, not a single DH-owned organic category.

---

### CAND-005 — Named Clinician Validation

| Field | Value |
|---|---|
| Title | Named Clinician Validation |
| Status | **Complete** (priority wave 1–6 captured 2026-07-14) |
| Origin | O-004 / EXP-002 H5 follow-on |
| Type | Live SERP observation — named-person queries |
| Research question | Do DH clinicians have independent Google visibility that plausibly acts as a discovery pathway? |

**GSC priority test order** (query-click leaders): Vitalija Tučė → Vytautas Sabataitis → Deividas Blažys → Monika Ambrasienė → Marius Bučinskas → Eugenija Bučinskienė

**Query forms per clinician**
| Form | Template |
|---|---|
| A | `[Doctor Name]` |
| B | `[Doctor Name] odontologas` |
| C | `[Doctor Name] vilnius` |
| D | `[Doctor Name] [specialty]` — optional, if obvious |

**Capture template**
| Query | DH result | Position | SERP composition notes |
|---|---|---|---|

**SERP composition checklist (per query)**
| Result type | Present? |
|---|---|
| DH doctor page (`/specialistai/`) | |
| Google Business Profile | |
| LinkedIn | |
| Facebook | |
| Instagram | |
| Doctor directory (Manodaktaras etc.) | |
| Review site | |
| Competitor clinic doctor page | |
| Personal / side brand site | |

#### Clinician 1 — Vitalija Tučė (GSC ~513 name-query clicks)

Environment: Lithuania VPN · google.lt · incognito · page 1 sufficient

| Form | Query | DH organic | Position | Top competitors |
|---|---|---|---:|---|
| A | Vitalija Tučė | `/specialistai/vitalija-tuce` | ~2 | Meliva #1, Manodaktaras, Instagram, vaikudantys.lt |
| B | Vitalija Tučė odontologas | `/specialistai/vitalija-tuce` | **~1** | Meliva, Instagram, Manodaktaras |
| C | Vitalija Tučė vilnius | `/specialistai/vitalija-tuce` | ~2 | Meliva #1, Instagram, Manodaktaras, LinkedIn, Kardiolita (legacy) |
| D | Vitalija Tučė vaikų odontologė | `/specialistai/vitalija-tuce` | **~1** | Meliva, Instagram, Manodaktaras |

**SERP composition (consistent across forms)**
| Result type | Present |
|---|---|
| DH doctor page | **Y** (1–2) |
| Google Business Profile | Not observed in paste |
| LinkedIn | Y (Form C) |
| Facebook | Y (DH + Meliva) |
| Instagram | Y (personal — strong) |
| Doctor directory | Y (Manodaktaras) |
| Review site | Y (via Manodaktaras) |
| Competitor clinic doctor page | Y (Meliva — often #1) |
| Personal brand | Y (vaikudantys.lt) |

**Clinician 1 read:** **Strong named-clinician pathway** — DH profile ranks 1–2 across all four query forms. Validates O-004 for **named-person** discovery (not generic `odontologas`). Important nuance: Vitalija operates a **multi-surface clinician market** (Meliva competes for #1, personal Instagram/vaikudantys strong). GSC click concentration on this name is plausibly **discoverability + reputation**, not navigation-only.

#### Clinician 2 — Vytautas Sabataitis (GSC ~78 clicks)

| Form | Query | DH organic | Position | Top competitors |
|---|---|---|---:|---|
| A | Vytautas Sabataitis | `/specialistai/vytautas-sabataitis` | **~1** | Pincetas, Instagram, Facebook, LinkedIn |
| B | Vytautas Sabataitis odontologas | `/specialistai/vytautas-sabataitis` | **~1** | Pincetas, Geraklinika, Gydo.lt |
| C | Vytautas Sabataitis vilnius | `/specialistai/vytautas-sabataitis` | **~1** | Pincetas, Facebook, Geraklinika |

**SERP composition:** DH page Y · Pincetas Y · Instagram Y · Facebook Y · LinkedIn Y · Geraklinika / AIK.lt Y (multi-employer) · Manodaktaras N on A

**Read:** **Strong** — DH #1 all forms. Ortodontas with **multi-clinic footprint** (Geraklinika, historical AIK references) alongside DH.

#### Clinician 3 — Deividas Blažys (GSC ~69 clicks)

| Form | Query | DH organic | Position | Top competitors |
|---|---|---|---:|---|
| A | Deividas Blažys | `/specialistai/deividas-blazys` | **~1** | Pincetas, City-Dent, Žalgirio klinika, Manodaktaras |
| B | Deividas Blažys odontologas | `/specialistai/deividas-blazys` | **~1** | City-Dent, Manodaktaras, Pincetas, Žalgirio klinika, DH `/paslaugos` |
| C | Deividas Blažys vilnius | `/specialistai/deividas-blazys` | **~1** | Manodaktaras, City-Dent, Pincetas, Žalgirio klinika |

**SERP composition:** DH page Y · Pincetas Y · Manodaktaras Y · Instagram Y · Facebook Y · Competitor clinic pages Y (City-Dent, Žalgirio klinika strong) · Name-collision noise (unrelated LinkedIn / TenisoNamai)

**Read:** **Strong DH #1**, but **heaviest multi-clinic competition** in priority wave — burnos chirurgas visible at Žalgirio klinika, City-Dent, Antakalnio (via Manodaktaras).

#### Clinician 4 — Monika Ambrasienė (GSC ~65 clicks)

| Form | Query | DH organic | Position | Top competitors |
|---|---|---|---:|---|
| A | Monika Ambrasienė | `/specialistai/monika-ambrasiene` | **~1** | Manodaktaras, Danės klinika, Dentamicus, MIR, Ozoklinika |
| B | Monika Ambrasienė odontologas | `/specialistai/monika-ambrasiene` | **~1** | Manodaktaras, Danės, Dentamicus, MIR, Ozoklinika |
| C | Monika Ambrasienė vilnius | `/specialistai/monika-ambrasiene` | **~1** | Manodaktaras, Danės, Dentamicus, Ozoklinika, MIR |

**SERP composition:** DH page Y · Manodaktaras Y · Pincetas Y · LinkedIn Y · Competitor clinic pages Y (Danės, MIR, Ozoklinika, Dentamicus, Periodont) · Facebook/Instagram Y (DH)

**Read:** **Strong DH #1**, but periodontologė with **broad multi-employer SERP** — patient may discover her through several clinics, not only DH.

#### Clinician 5 — Marius Bučinskas (GSC ~24 clicks)

| Form | Query | DH organic | Position | Top competitors |
|---|---|---|---:|---|
| A | Marius Bučinskas | `/specialistai/marius-bucinskas` | **~1** | vz.lt (director), Pincetas, Manodaktaras, LinkedIn |
| B | Marius Bučinskas odontologas | `/specialistai/marius-bucinskas` | **~1** | Pincetas, vz.lt, Facebook (DH), Manodaktaras |
| C | Marius Bučinskas vilnius | `/specialistai/marius-bucinskas` | **~1** | vz.lt, Instagram, Manodaktaras, LinkedIn |
| D | Marius Bučinskas implantologas | `/specialistai/marius-bucinskas` | **~1** | Facebook (DH), DH article, Manodaktaras |

**SERP composition:** DH page Y · Pincetas Y · Manodaktaras Y · LinkedIn Y · Instagram Y · Facebook Y (DH) · Registry/director listings Y (vz.lt, Okredo) · Name-collision noise (basketball player on BasketNews)

**Read:** **Very strong DH-dominant** — director + implantologist; DH profile owns #1 across all forms. Registry/social secondary. Most **DH-centric** named SERP in the wave.

#### Clinician 6 — Eugenija Bučinskienė (GSC ~25 clicks)

| Form | Query | DH organic | Position | Top competitors |
|---|---|---|---:|---|
| A | Eugenija Bučinskienė | `/specialistai/eugenija-bucinskiene` | **~1** | Manodaktaras, Pincetas, Facebook/Instagram (DH) |
| B | Eugenija Bučinskienė odontologas | `/specialistai/eugenija-bucinskiene` | **~1** | Manodaktaras, Facebook videos, DH specialistai |
| C | Eugenija Bučinskienė vilnius | `/specialistai/eugenija-bucinskiene` | **~1** | Manodaktaras, Instagram, Pincetas |
| D | Eugenija Bučinskienė ortodontė | `/specialistai/eugenija-bucinskiene` | **~1** | Manodaktaras, Pincetas, Facebook (DH) |

**SERP composition:** DH page Y · Manodaktaras Y · Pincetas Y · Facebook/Instagram Y (DH) · Delfi/media Y · Competitor clinic pages weak

**Read:** **Strong DH-dominant** — ortodontė with consistent DH #1; media/social support pathway.

#### CAND-005 results summary (priority wave)

| Clinician | GSC clicks | DH position (typical) | Archetype |
|---|---:|---|---|
| Vitalija Tučė | ~513 | 1–2 | Multi-surface (Meliva + personal brand) |
| Vytautas Sabataitis | ~78 | ~1 | Multi-clinic ortodontas |
| Deividas Blažys | ~69 | ~1 | Multi-clinic chirurgas |
| Monika Ambrasienė | ~65 | ~1 | Multi-clinic periodontologė |
| Marius Bučinskas | ~24 | ~1 | DH-dominant (director/implantologas) |
| Eugenija Bučinskienė | ~25 | ~1 | DH-dominant ortodontė |

#### CAND-005 verdict
**PASS** — named-clinician pathway **validated as an observable discovery mechanism**.

Moved O-004 / GSC ~15.7% doctor-name clicks from *interesting click pattern* to *live SERP mechanism*:

```
Named clinician query → DH clinician profile → Position ~1
```

repeated across six GSC-evidenced clinicians.

**Headline (not “clinicians rank #1”):** Generic specialist discovery and named specialist discovery are **completely different markets**.

| Query type | Result |
|---|---|
| `odontologas vilnius` (EXP-002 Q9) | DH absent (pages 1–9) |
| Named clinician (CAND-005) | DH `/specialistai/` ~1–2 |

**Revised Specialist Pathway**
```
Generic dentist search  →  not a DH strength
Named clinician search  →  strong DH discovery surface
```

**Locked finding `F-CAND005-001`:** Specialist discovery is a **named-person layer**, not a generic head-term layer.

**Two clinician SERP archetypes**
1. **DH-dominant brand assets** — Marius Bučinskas, Eugenija Bučinskienė (Search → DH → everything else)
2. **Multi-clinic clinician market** — Vitalija, Deividas, Monika, Vytautas (Search → DH → other clinics → directories). Clinician reputation exists independently of a single employer — often a *stronger* discovery signal than pure DH dominance.

**Implication for O-004:** GSC doctor-name clicks (~15.7%) reflect **real discoverability**, not reputation/navigation-only traffic — at least for the six priority clinicians tested.

**Programme note:** CAND-005 is the **final major validation** of the Phase 3–4 discovery model. Remaining questions are refinements (e.g. why whitening GBP demand is so strong; why prosthetics/esthetics demand does not translate into DH generic SERP visibility), not foundational gaps in *how DH is discovered*.

---

## Idea-stage candidates (exploration, not validation)

| ID | Candidate | Target surface | Status |
|---|---|---|---|
| CAND-001 | Prosthetics decision-stage patient question | Prosthetics | Idea |
| CAND-002 | Estetinis plombavimas patient-question page | Esthetics | Idea |
| CAND-003 | Whitening trays / home vs in-clinic clarity page | Whitening | Idea |
| CAND-004 | Implant research FAQ set (cost / healing / smoking) | Implants | Idea |
| CAND-005 | Named Clinician Validation | Specialists | **Complete (PASS)** |
| CAND-006 | Orthodontics adult suitability question | Orthodontics | Idea |

---

## Governance

| Layer | Location / status |
|---|---|
| Closed audit | `DH-Site-Audit-Discovery-Handbook-v1.md` — PASS (Phases 0–3) |
| Historical pilot | EXP-001 — PASS (`DH-Pre-Audit-Experiment-Register.md`) |
| SERP model validation | EXP-002 — PASS (this file) |
| Named-clinician validation | CAND-005 — PASS (**final major discovery-model validation**) |
| Exploration candidates | CAND-001–004, CAND-006 — Idea only |

**Explicit non-goals of the validation programme:**
- No site changes from SERP results
- No GBP optimisation actions
- No ranking ego metrics
- Handbook remains CLOSED unless explicitly reopened

**Remaining refinement questions** (not foundational gaps):
- Whitening GBP vs SERP tension → **EXP-003 PASS** (`F-EXP003-001`)
- Why does prosthetics/esthetics demand not translate into DH generic SERP visibility? (optional future — not opened)

**Programme close note (2026-07-14)**

Discovery programme validation is **complete**.

| Layer | Status |
|---|---|
| Audit Phases 0–3 | PASS |
| EXP-001 | PASS |
| EXP-002 | PASS |
| CAND-005 | PASS (final major model validation) |
| EXP-003 | PASS (last anomaly — whitening market structure) |

**Freeze artefact:** [`DH-Final-Discovery-Model-v1.md`](DH-Final-Discovery-Model-v1.md) — **FROZEN**.  
Do not open Phase 5. Do not open EXP-004. Do not keep searching for anomalies.

Evidence base: Site architecture · GSC · GBP · Live service SERPs · Named-clinician SERPs · Whitening market-structure SERPs.

Remaining idea-stage candidates (CAND-001–004, CAND-006; prosthetics/esthetics visibility gap) are **optional exploration only** — not foundational gaps.

**Current:** Programme closed. Refer to **Final Discovery Model v1**.
