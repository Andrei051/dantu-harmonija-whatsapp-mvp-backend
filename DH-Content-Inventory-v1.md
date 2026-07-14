# DH Content Inventory v1

Operational dataset for what exists on https://dantuharmonija.lt/

**Purpose:** answer “What exists?”  
**Not for:** long-form learning notes (see `DH-Site-Audit-Discovery-Handbook-v1.md`).

**Machine-readable full table (LT):** `DH-Content-Inventory-data-v1.csv`  
**Machine-readable locale table:** `DH-Content-Inventory-locale-v1.csv`

Programme context:
- Phase 0 Foundation ✅ Complete
- Phase 1 Structure Acquisition ✅ Complete
- Phase 2 Behaviour Analysis ✅ Closed — PASS
- Phase 2A/2B/2C ✅ Complete
- Phase 3 Opportunity Assessment ✅ Closed — PASS
- Phase 4 Experiments 📦 EXP-001 only (pre-audit); candidates listed, not started
- **Audit programme: CLOSED**

Governance principle: **Observe first. Interpret later. Decide last.**

Progression: **Structure → Behaviour → Opportunity → Experiment**

Scope notes:
- LT inventory = primary corpus (`DH-Content-Inventory-data-v1.csv`)
- EN/RU locale inventory = language-surface validation (`DH-Content-Inventory-locale-v1.csv`)
- LV: no URLs in sitemap
- Classification rule: when uncertain, pick best-fit and note
- robots.txt disallows `/en/` `/ru/` `/lv/` for crawlers; URLs still listed in sitemap and inventoried by URL structure

Status key:
- `Active` — keep and maintain
- `Review` — uncertain taxonomy fit / needs later look
- `Draft` — not yet live
- `Archive` — consider remove or noindex (decision pending)

---

## Session 1A acquisition totals (LT)

| Metric | Count |
|---|---:|
| LT URLs inventoried | 341 |
| Service | 15 |
| Article | 253 |
| FAQ | 1 |
| Category | 6 |
| Other | 66 |

### Intent mix (LT)

| Intent | Count |
|---|---:|
| Commercial | 19 |
| Informational | 295 |
| Safety | 15 |
| Cost | 11 |
| Comparison | 1 |

---

## Session 1B — Language surface validation

**RQ-006 acquisition outcome: Outcome B — Partial mirrors**

| Locale | URLs | Service | Article | FAQ | Category | Other |
|---|---:|---:|---:|---:|---:|---:|
| LT (1A) | 341 | 15 | 253 | 1 | 6 | 66 |
| EN | 71 | 16 | 9 | 1 | 3 | 42 |
| RU | 64 | 16 | 14 | 1 | 3 | 30 |
| LV | 0 | — | — | — | — | — |

Observed surface roles (acquisition labels only):
- Service pages: near parity across LT/EN/RU → service-mirror candidates
- LT `/naudinga/` patient-education corpus not mirrored by EN/RU article counts
- EN/RU `/new/` set behaves as a separate thin news/training surface
- Specialists and success stories: present but incomplete vs LT
- `/lv/`: absent from sitemap

---

## Cluster Summaries (LT)

| Cluster | Service | Informational (Article) | FAQ | Category | Other | Total |
|---|---:|---:|---:|---:|---:|---:|
| Whitening | 1 | 14 | 0 | 0 | 0 | **15** |
| Implants | 1 | 97 | 0 | 0 | 3 | **101** |
| Orthodontics | 1 | 31 | 0 | 0 | 4 | **36** |
| Hygiene | 1 | 3 | 0 | 0 | 0 | **4** |
| Other | 11 | 108 | 1 | 6 | 59 | **185** |

Notes:
- `Informational` column above = Article type count (primary educational surface).
- Many Service pages outside Whitening/Implants/Orthodontics/Hygiene are classified Topic=`Other` because taxonomy has no dedicated cluster for prosthetics, fillings, endodontics, etc.

---

## Observations Log

Patterns only. No recommendations.

| ID | Observation | Evidence |
|---|---|---|
| OBS-001 | Informational articles heavily outnumber service pages. | Article=253 vs Service=15 |
| OBS-002 | Implant-related article volume is very large in LT inventory. | Implants Article=97; cluster total=101 |
| OBS-003 | Whitening cluster is comparatively small in page count. | Whitening total=15 (Service=1, Article=14) |
| OBS-004 | Hygiene cluster is thin. | Hygiene total=4 |
| OBS-005 | Orthodontics has meaningful article depth relative to one service page. | Orthodontics Service=1, Article=31 |
| OBS-006 | Single dedicated FAQ URL exists in LT sitemap. | `/duk/` only as FAQ type |
| OBS-007 | Many clinical service pages sit outside priority topic taxonomy. | 11 Service pages Topic=Other (prosthetics, fillings, surgery, etc.) |
| OBS-008 | Success stories and specialists are large non-article supporting surfaces. | Specialist + success-story URLs counted under Type=Other |
| OBS-009 | EN/RU service counts are near LT service count. | LT 15 · EN 16 · RU 16 |
| OBS-010 | EN/RU article counts are far below LT `/naudinga/` corpus. | LT 253 · EN 9 · RU 14 |
| OBS-011 | Locale “articles” use `/new/` and read as clinic news/training, not LT patient-education mirrors. | EN/RU `/new/` titles in locale CSV |
| OBS-012 | No LV URLs present in sitemap. | LV = 0 |

---

## Phase 1 — Knowledge Acquisition Method

**Objective:** build an accurate model of the site before making judgments.

**Success criterion:** we understand site structure.

**Not success:** knowing what to change.

### Deliverables
- **Output A** — Complete URL inventory ✅ 1A LT + 1B locales
- **Output B** — Classification by Topic / Intent / Type / Status ✅
- **Output C** — Cluster summaries ✅
- **Output D** — Observations log ✅

### Field taxonomy (locked)

| Field | Meaning | Allowed values |
|---|---|---|
| URL | Exact page path or full URL | As on site |
| Type | Page role | `Service` / `Article` / `FAQ` / `Category` |
| Topic | Cluster | `Whitening` / `Implants` / `Orthodontics` / `Hygiene` / `Other` |
| Intent | Patient need | `Commercial` / `Informational` / `Comparison` / `Safety` / `Cost` |
| Status | Working state | `Active` / `Review` / `Draft` / `Archive` |
| Notes | Free text | Short evidence or open questions |

Locale CSV adds: `lang`, `surface` (acquisition labels only).

### Out of Scope for Phase 1
- Content rewrites
- New content proposals
- Editorial calendars
- Redirect plans
- SEO recommendations
- Prioritisation decisions
- Implementation planning
- Content quality assessment
- Consolidation decisions
- Experiment design

### Status

Audit CLOSED (Phases 0–3 PASS). Discovery model locked. EXP-001 pre-audit pilot PASS. Phase 4 candidates listed only — not started.

---

## Phase 2 Pattern Catalogue

Populated by Phase 2A/2B/2C Session 1. No actions implied.

| ID | Pattern | Evidence | Subphase |
|---|---|---|---|
| PAT-001 | Informational-dominant architecture | Article 253 vs Service 15; Informational intent 295/341 | 2A |
| PAT-002 | One-service + multi-article cloud per priority topic | W/I/O/H each Service=1 | 2A |
| PAT-003 | Extreme article-depth asymmetry across clusters | Implants A/S=97; Ortho 31; Whitening 14; Hygiene 3 | 2A |
| PAT-004 | Large taxonomy residual in `Other` | Other=185 (54% of LT URLs) | 2A |
| PAT-005 | Latent families inside `Other` (slug scan) | Prosthetics~42; esthetics/fillings~33 article slug hits | 2A |
| PAT-006 | Safety/Cost intents sparse vs Informational | Safety 15; Cost 11; Comparison 1 | 2A |
| PAT-007 | Single dedicated FAQ node | FAQ=1 (`/duk/`) | 2A |
| PAT-008 | Locale service-strong / article-weak architecture | EN/RU services≈LT; articles 9/14 vs LT 253 | 2A |
| PAT-009 | Brand dominates clicks more than impressions | Brand ~4.7% query impr; brand queries lead clicks | 2B |
| PAT-010 | Non-brand demand heavy in Other clinical + Implants | Query impr share 31.2% + 21.1% | 2B |
| PAT-011 | Visibility efficiency ≠ corpus depth | Hygiene/Whitening/Ortho impr/URL ≥ Implants | 2B |
| PAT-012 | Articles carry substantial visibility with services | Article impr 134,987 vs Service 82,352 | 2B |
| PAT-013 | Implant articles can out-click service hub | Article clicks 861 vs service 193 | 2B |
| PAT-014 | Locale GSC visibility negligible in export | Locale 540 impr / 1 click | 2B |
| PAT-015 | Specialist-name queries are a distinct click pathway | Doctor-name queries + specialist page clicks | 2B |
| PAT-016 | Local discovery exceeds pure brand/location on GBP | Discovery-like ~70% vs brand-like ~30% counted | 2C |
| PAT-017 | Whitening is #1 local non-brand GBP term | `dantu balinimas` 843 | 2C |
| PAT-018 | GBP ranks Other clinical ahead of Implants | 25.6% vs 5.5% counted shows | 2C |
| PAT-019 | Orthodontics strong in local demand | 13.0% counted GBP shows | 2C |
| PAT-020 | Search (esp. mobile) dominates GBP discovery vs Maps | Search ~80% views vs Maps ~21% | 2C |
| PAT-021 | Calls + directions primary GBP actions; bookings=0 | Calls 1,919 · Directions 1,937 · Bookings 0 | 2C |

---

## Cluster Scorecards

| Cluster | Content depth | Visibility (GSC) | Local demand (GBP counted) | Notes |
|---|---|---|---|---|
| Whitening | Low–moderate (15) | 11,353 impr · 757/URL | **High** — 937 shows (12.3%); #1 clinical term | Thin corpus, strong local demand |
| Implants | High (101) | 60,777 impr · 602/URL | **Low–moderate** — 421 shows (5.5%) | Deep corpus; weaker local share |
| Orthodontics | Moderate (36) | 28,798 impr · 800/URL | **High** — 992 shows (13.0%) | Strong local demand |
| Hygiene | Low (4) | 10,090 impr · 2,523/URL | Moderate — 347 shows (4.6%) | Thin but efficient |
| Other / Other clinical | High residual (185) | 251,725 impr | **Highest clinical** — 1,950 shows (25.6%) esthetics/prosthetics | Latent family demand confirmed locally |

---

## Demand Map (Phase 2C)

Source: GBP manual capture Feb–Jul 2026.  
Archive: `DH-GBP-Manual-Capture-2026-02-to-2026-07.md`  
Full tables in handbook Phase 2C Session 1.

---

## Visibility Map (Phase 2B)

Source: GSC Pages + Queries · Web · Last 12 months.  
Full tables in handbook Phase 2B Session 1. Raw export in Downloads.

---

## Inventory (full LT set)

Ordered: Service → Article → FAQ → Category → Other.

Full locale rows live in `DH-Content-Inventory-locale-v1.csv` (not duplicated below).

| URL | Type | Topic | Intent | Status | Notes |
|---|---|---|---|---|---|
| `/paslaugos/burnos-higiena/` | Service | Hygiene | Commercial | Active |  |
| `/paslaugos/dantu-implantavimas/` | Service | Implants | Commercial | Active |  |
| `/paslaugos/dantu-tiesinimas-ortodontija/` | Service | Orthodontics | Commercial | Active |  |
| `/paslaugos/dantu-chirurgija/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/dantu-plombavimas/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/dantu-protezavimas/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/diagnostika/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/estetinis-plombavimas/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/estetinis-protezavimas/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/kanalu-gydymas/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/kineziterapija/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/laboratorija/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/periodontologija/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/vaiku-dantu-gydymas/` | Service | Other | Commercial | Review | Service outside priority clusters; Topic=Other by taxonomy |
| `/paslaugos/dantu-balinimas/` | Service | Whitening | Commercial | Active |  |
| `/naudinga/6-burnos-higienistes-patarimai-kaip-atsikratyti-blogo-burnos-kvapo/` | Article | Hygiene | Informational | Active |  |
| `/naudinga/ka-butina-zinoti-apie-burnos-higienos-priemones-irigatoriu-tarpdanciu-siula-ar-liezuvio-valikli/` | Article | Hygiene | Informational | Active |  |
| `/naudinga/kiek-laiko-trunka-ir-kiek-kainuoja-dantu-higiena/` | Article | Hygiene | Informational | Active |  |
| `/naudinga/10-mitu-apie-dantu-implantavima-gydytojas-papasakojo-ko-bijoti-tikrainereiketu/` | Article | Implants | Informational | Active |  |
| `/naudinga/5-dantu-implantu-privalumai-kaip-dantu-implantai-gali-pagerinti-jusu-burnos-sveikata-1/` | Article | Implants | Informational | Active |  |
| `/naudinga/all-on-4-dantu-implantai-viena-moderniausiu-dantu-atkurimo-gydymo-metodiku/` | Article | Implants | Informational | Active |  |
| `/naudinga/all-on-4-gydymo-metodika-ar-pavieniai-implantai/` | Article | Implants | Informational | Active |  |
| `/naudinga/ar-skauda-dantu-implantavimas/` | Article | Implants | Safety | Active | Pain/safety question page |
| `/naudinga/automatiskai-issaugotas-juodrastisir-dantu-implantacija-pasizymes-mazesne-kaina/` | Article | Implants | Cost | Active |  |
| `/naudinga/danties-implanto-atmetimo-pozymiai/` | Article | Implants | Safety | Active | Rejection signs angle |
| `/naudinga/dantu-implantacija-investicija-i-dantu-sveikata/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantacija-ir-jos-kaina-pigus-dantu-implantai/` | Article | Implants | Cost | Active |  |
| `/naudinga/dantu-implantacijos-kaina-nera-maza-taciau-pacientas-kuriam-buvo-atliktas-dantu-implantavimas-susiduria-su-zymiai-mazesniu-papildomu-proceduru-poreikiu/` | Article | Implants | Cost | Active |  |
| `/naudinga/dantu-implantai-ar-tikrai-gali-tarnauti-visa-gyvenima/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-budas-atgauti-pasitikejima-savimi/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-burnos-ertmeje-funkcionuoja-lygiai-taip-pat-kaip-naturalus-dantys/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-efektyviausias-dantu-atkurimo-budas/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-galimybe-dziaugtis-sveikais-dantimis/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-galimybe-susigrazinti-pasitikejima-savimi/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-idealiai-sypsenai-atkurti/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-ir-dantu-protezai-ar-didesne-kaina-atsveria-privalumus/` | Article | Implants | Cost | Active |  |
| `/naudinga/dantu-implantai-ir-gydymo-metodikos-all-on-4-privalumai/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-ir-ju-prieziura-kaip-issirinkti-tinkamiausia-sprendima-ir-uztikrinti-implantu-ilgaamziskuma/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-ir-rukymas-ar-turiu-mesti-rukyti-pries-dantu-implantavimo-procedura/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-ju-istorija-ir-naujausios-inovacijos/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-ka-verta-zinoti/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-kaip-atsirado-ir-kodel-tokie-populiarus/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-kaip-procedura-pagerina-gyvenimo-kokybe/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-keramikiniai-ir-titaniniai/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-kodel-netenkame-dantu-ir-kodel-svarbu-juos-nedelsiant-atkurti/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-kokybiskas-gyvenimas-kaip-su-naturaliais-dantimis/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-nauji-dantys-nuo-saknies-iki-vainiko/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-ne-tik-atkuria-estetine-sypsena/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-neretai-tarnauja-visa-zmogaus-gyvenima/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-patarimai-kaip-priziureti-dantu-implantus/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-pazangiausia-dantu-atkurimo-technologija/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-prabanga-ar-butinybe/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-skiriasi-ne-tik-savo-estetinemis/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-sveiki-ir-stiprus-dantys-visam-gyvenimui/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-tinkai-jautru-organizma-turintiems-pacientams/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-vienas-kokybiskiausiu-ir-pazangiausiu-dantu-atkurimo-budu/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-vienas-populiariausiu-pasirinkimu-jei-praradote-dantis/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantai-visiskai-prilygsta-naturaliems-dantims/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-all-on-4-geriausias-pasirinkimas-praradus-visus-dantis/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-all-on-4-metodu-greita-ir-efektyvu/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-all-on-4-metodu-privalumai-su-kuriais-niekas-negali-konkuruoti/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-apie-sia-procedura-reiketu-zinoti-pliusus-ir-minusus/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-dantu-atkurimas-bet-kuriai-amziaus-grupei/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-dazniausiai-uzduodami-klausimai/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-geriausia-iseitis-visiems-pacientams-kurie-nori-atkurti-prarastus-dantis/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-investicija-visam-gyvenimui/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-is-ko-gaminami-dantu-implantai/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-ka-reikia-zinoti-kiekvienam-pacientui/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-kaip-priziureti-dantis-po-proceduros/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-kas-kaip-ir-kodel/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-kas-tai-ir-kodel-sulauke-tokio-didelio-susidomejimo/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-kodel-verta-rinktis-ir-ka-reikia-zinoti/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-kur-mitai-o-kur-realybe/` | Article | Implants | Safety | Active |  |
| `/naudinga/dantu-implantavimas-mitai-ir-faktai/` | Article | Implants | Safety | Active |  |
| `/naudinga/dantu-implantavimas-mitai-ir-realybe/` | Article | Implants | Safety | Active |  |
| `/naudinga/dantu-implantavimas-modernus-budas-atkurti-dantis/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-ne-visiems-vaikams-tinkamas-sprendimas/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-neivertinti-implantu-privalumai/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-neskausmingas-ir-ilgaamzis-dantu-atkurimo-budas/` | Article | Implants | Safety | Active |  |
| `/naudinga/dantu-implantavimas-nuo-ko-pradeti-praradus-viena-ar-kelis-dantis/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-padeda-ne-tik-atrodyti-bet-ir-jaustis-daug-geriau/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-pades-atkurti-net-ir-visus-prarastus-dantis/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-pazangiausias-danties-atstatymo-metodas/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-pazangu-ir-ilgaamziska/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-pazangus-prarastu-dantu-atkurimas-per-trumpa-laika/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-populiariausia-ir-ilgaamziskiausia-prarastu-dantu-atkurimo-technologija/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-praktiniai-patarimai-kaip-pasiruosti-dantu-implantavimo-procedurai/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-prarastu-dantu-atkurimas-greitai-ir-ilgam/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-suzinokite-ar-jums-si-procedura-yra-tinkama/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-svarstote-apie-dantu-implantus-5-privalumai-kuriuos-reikia-pasverti/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-tinkamai-priziurimi-implantai-tarnauja-visa-gyvenima/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimas-yra-optimalus-sprendimas-pacientams/` | Article | Implants | Informational | Active |  |
| `/naudinga/dantu-implantavimo-procedura-apipyne-mitai/` | Article | Implants | Safety | Active |  |
| `/naudinga/dantu-implantavimo-zingsniai-ko-tiketis-atliekant-procedura/` | Article | Implants | Informational | Active |  |
| `/naudinga/implantavimo-variantas-all-on-4-metodika/` | Article | Implants | Informational | Active |  |
| `/naudinga/implantuojancio-gydytojo-mariaus-bucinsko-paskaita-studentams/` | Article | Implants | Informational | Active |  |
| `/naudinga/investicija-i-save-kaip-dantu-implantacijos-kaina-atsiperka-ilgainiui/` | Article | Implants | Cost | Active |  |
| `/naudinga/ka-reiketu-zinoti-apie-dantu-implantacijos-kaina-ir-finansavimo-galimybes/` | Article | Implants | Cost | Active |  |
| `/naudinga/kaip-dedami-dantu-implantai/` | Article | Implants | Informational | Active |  |
| `/naudinga/kaip-issirinkti-dantis-implantuojanti-gydytoja/` | Article | Implants | Informational | Active |  |
| `/naudinga/kaip-veikia-dantu-implantacija/` | Article | Implants | Informational | Active |  |
| `/naudinga/kas-itakoja-dantu-implantavimo-kaina/` | Article | Implants | Cost | Active |  |
| `/naudinga/kas-turi-itakos-dantu-implantu-kainai-ir-vertei/` | Article | Implants | Cost | Active |  |
| `/naudinga/kodel-dantu-implantacija-yra-brangi-odontologine-procedura/` | Article | Implants | Informational | Active |  |
| `/naudinga/kokiais-atvejais-negalima-atlikti-dantu-atkurimo-implantais/` | Article | Implants | Informational | Active |  |
| `/naudinga/kokybiski-dantu-implantai-kaina-lenkia-kitas-dantu-atkurimo-priemones/` | Article | Implants | Cost | Active |  |
| `/naudinga/kursai-apie-implantacija-sudetingais-atvejais/` | Article | Implants | Informational | Active |  |
| `/naudinga/kursai-apie-mikroimplantu-naudojima-ortodontiniam-gydymui/` | Article | Implants | Informational | Active |  |
| `/naudinga/kursai-guided-implant-surgery-aesthetics/` | Article | Implants | Informational | Active |  |
| `/naudinga/moderni-naujiena-dantu-implantai-zygoma/` | Article | Implants | Informational | Active |  |
| `/naudinga/noriu-implantuotis-dantis-kas-kaip-kodel/` | Article | Implants | Informational | Active |  |
| `/naudinga/nuo-ko-priklauso-dantu-implantu-ilgaamziskumas/` | Article | Implants | Informational | Active |  |
| `/naudinga/skausmas-po-dantu-implantacijos-gijimas-ir-galimos-komplikacijos/` | Article | Implants | Safety | Active |  |
| `/naudinga/violeta-po-dantu-implantacijos-man-prireike-ne-vaistu-nuo-skausmo-o-lupdazio/` | Article | Implants | Safety | Active |  |
| `/naudinga/visu-apatinio-zandikaulio-dantu-atkurimas-tik-ant-3-implantu/` | Article | Implants | Informational | Active |  |
| `/naudinga/breketai-klientu-apklausa/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantims-tiesinti-ne-vien-tik-breketai/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-4-dazniausiai-uzduodami-klausimai/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-breketais-gali-buti-ir-visai-nepastebimas/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-breketais-privalumai-ir-trukumai/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-budas-atkurti-idealia-sypsena/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-invisalign-dantu-kapomis-siuolaikiska-ir-patogu/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-invisalign-dantu-tiesinimo-kapos-kurias-visame-pasaulyje-jau-atrado-milijonai-zmoniu/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-invisalign-kapomis-idealios-sypsenos-garantas/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-invisalign-kapomis/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-iprociai-ir-burnos-higiena-kas-keiciasi/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-ka-reiketu-zinoti-2/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-ka-svarbu-zinoti/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-kaip-issirinkti-tinkamiausius-breketus/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-kaip-veikia-breketai/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-ne-tik-del-isvaizdos-bet-ir-del-fizines-bei-emocines-sveikatos/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-ortodontai-griauna-mitus-apie-kreivus-dantis-ir-sudetingas-proceduras/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-padeda-isspresti-ne-tik-dantu-bet-ir-psichologines-problemas/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-populiariausi-mitai-apie-sia-procedura/` | Article | Orthodontics | Safety | Active |  |
| `/naudinga/dantu-tiesinimas-populiariausi-ortodontiniai-sprendimai-ir-specialistu-patarimai-neatidelioti-sios-proceduros/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-vaikams-kodel-tai-svarbu/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-yra-procedura/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/dantu-tiesinimas-yra-toks-svarbus-ir-kokia-nauda-suteikia-ortodontinis-gydymas/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/inovatyvus-dantu-tiesinimas-vis-daznesnis-pacientu-pasirinkimas/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/noretumete-atsikratyti-diskomforto-besisypsant-dantu-tiesinimas-geriausias-sprendimas/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/pagrindines-dantu-breketu-rusys-ir-ju-skirtumai/` | Article | Orthodontics | Comparison | Active |  |
| `/naudinga/populiariausios-siu-laiku-dantu-tiesinimo-proceduros/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/seminaras-apie-sudetingu-ortodontiniu-atveju-gydyma/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/septyni-mitai-apie-vidinius-dantu-breketus/` | Article | Orthodontics | Safety | Active |  |
| `/naudinga/specialistai-dantu-tiesinimas-dazniau-yra-butinas-del-sveikatos-o-ne-estetines-isvaizdos/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/viskas-ka-reikia-zinoti-apie-dantu-tiesinima-kapomis/` | Article | Orthodontics | Informational | Active |  |
| `/naudinga/15841/` | Article | Other | Informational | Active |  |
| `/naudinga/5-klausimai-vaiku-odontologei/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/8-atspalviais-baltesni-dantys-vos-po-vienos-proceduros/` | Article | Other | Informational | Active |  |
| `/naudinga/all-on-4-center-of-excellence-klinikos-statusas/` | Article | Other | Informational | Active |  |
| `/naudinga/all-on-4-privalumai/` | Article | Other | Informational | Active |  |
| `/naudinga/amzius-ne-kliutis-graziai-sypsenai/` | Article | Other | Informational | Active |  |
| `/naudinga/ar-kreivi-dantys-tik-grozio-problema-ne/` | Article | Other | Informational | Active |  |
| `/naudinga/dalinames-savo-praktinemis-ziniomis-su-kolegomis/` | Article | Other | Informational | Active |  |
| `/naudinga/dantenu-kraujavimas-ka-vertetu-zinoti/` | Article | Other | Informational | Active |  |
| `/naudinga/dantu-griezimas/` | Article | Other | Informational | Active |  |
| `/naudinga/dantu-protezavimas-3-dazniausiai-uzduodami-klausimai/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-butinybe-praradus-net-ir-viena-danti/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-dantu-atkurimas-po-infekciju-ir-pradejus-nykti-zandikaulio-kaului/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-dantu-protezu-tiltai/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-gali-buti-atliekamas-naudojant-skirtingos-rusies-dantu-protezus/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-greitas-ir-efektyvus-budas-atgauti-savo-sypsena/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-greitas-ir-veiksmingas-budas-vel-sypsotis/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-greitas-prarastu-dantu-ir-estetines-sypsenos-atkurimo-budas/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-harmoningos-sypsenos-susigrazinimas-per-trumpa-laika/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-individualiai-pritaikytas-dantu-atkurimas-suteiks-galimybe-dziaugtis-puikia-sypsena/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-isimami-ir-fiksuoti-dantu-protezu-tipai/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-ka-daugelis-pamirsta-ir-kodel-tai-svarbu/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-kaip-issirinkti-tinkamus-protezus/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-kaip-priziureti-dantu-protezus/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-kas-tai-ir-kodel-jis-taikomas/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-kodel-svarbu-pasirinkti-patyrusius-specialistus/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-maksimaliai-funkcionalus-dantu-protezai-per-trumpa-laika/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-misija-imanoma/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-modernus-budas-dziaugtis-puikia-sypsena/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-modernus-dantu-atkurimo-metodas/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-padeda-isvengti-rimtu-sveikatos-problemu/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-pades-atkurti-bet-kokio-amziaus-pacientu-prarastus-dantis/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-prarastu-dantu-mokslas-ir-menas/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-privalumai-inovacijos-ir-ateities-spejimai/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-puikios-sypsenos-garantas/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-reikalingas-ne-tik-vyresnio-amziaus-zmonems-2/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-reikalingas-ne-tik-vyresnio-amziaus-zmonems/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-siuolaikinis-metodas-atkurti-dantis/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-suzinokite-kaip-si-procedura-gali-atkurti-jusu-prarastus-dantis/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-uzkerta-kelia-daugeliui-sutrikimu-ir-ligu/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimas-vienas-is-efektyviausiu-dantu-atkurimo-metodu/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dantu-protezavimo-budai/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/daugelis-to-nezino-pasake-uz-kurias-vaiku-dantu-gydymo-procedurastevams-nereikia-isleisti-ne-cento/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/dovanu-kuponai-pasirupinkite-artimuju-sypsena/` | Article | Other | Informational | Active |  |
| `/naudinga/estetinis-plombavimas-apsauga-nuo-eduonies-ir-sveika-dantu-isvaizda/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-efektyviam-pazeistu-dantu-audiniu-atkurimui/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-estetine-odontologija-dantu-defektams-pasalinti/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-gali-buti-atliekamas-priekiniams-ir-kruminiams-dantims/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-geriausias-sprendimas-atstatyti-pazeista-dantu-forma/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-greiciausias-budas-susigrazinti-tobula-sypsena/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-ir-estetinis-protezavimas-yra-veiksmingos-proceduros/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-ir-jusu-dietos-pokyciai/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-kaip-procedura-paveikia-dantis/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-kam-ir-kada-reikalinga-procedura/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-kas-tai-yra-ir-kada-naudinga/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-kelias-i-grazia-sypsena/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-nesudetinga-procedura-padesianti-atkurti-pazeistus-dantis/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-nudilusiems-eduonies-pazeistiems-ar-spalva-pakeitusiems-dantims-atkurti-2/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-nudilusiems-eduonies-pazeistiems-ar-spalva-pakeitusiems-dantims-atkurti/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-pades-atkurti-estetine-dantu-isvaizda/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-pagerina-estetinis-savybes/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-precizisko-darbo-rezultatai-dziugina-po-pirmo-karto/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-proceduros-privalumai-ir-trukumai/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-profesionalus-pazeistu-danties-audiniu-atkurimas/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-raktas-i-nepriekaistinga-sypsena/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-stulbinamai-atkurti-pazeisti-dantys-ir-prieinama-kaina/` | Article | Other | Cost | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-tiek-estetikai-tiek-dantu-buklei-gerinti/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-tobula-sypsena-po-vieno-vizito-klinikoje/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-vaikams-kada-ir-kodel-tai-reikalinga/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas-viskas-ka-reikia-zinoti/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/estetinis-plombavimas/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/gyd-m-bucinskas-tarp-pirmuju-europoje-atlikusiu-tokia-operacija/` | Article | Other | Informational | Active |  |
| `/naudinga/idealia-sypsena-susigrazinkite-kitiems-nematomu-budu/` | Article | Other | Informational | Active |  |
| `/naudinga/ka-pasirinkti-kai-iskyla-dilema-gydyti-kanalus-ar-salinti-danti/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/ka-reikia-zinoti-norint-tureti-sveikus-dantis-gydytojos-patarimai/` | Article | Other | Informational | Active |  |
| `/naudinga/kada-galima-valgyti-po-danties-rovimo/` | Article | Other | Informational | Active |  |
| `/naudinga/kada-tikslinga-atlikti-estetini-dantu-plombavima/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/kaip-issirinkti-dantu-pasta/` | Article | Other | Informational | Active |  |
| `/naudinga/kaip-naudoti-protezu-klijus/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/kaip-priprasti-prie-dantu-protezu/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/kas-yra-dantu-protezavimas-ir-ka-reikia-zinoti/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/kas-yra-estetinis-plombavimas-ir-kokius-stebuklus-gali-sukurti/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/klinika-dantu-harmonija-dalyvauja-akcijoje-knygu-kaledos/` | Article | Other | Informational | Active |  |
| `/naudinga/kodel-specialistai-rekomenduoja-rinktis-dantu-protezavima/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/kokiais-budais-gali-buti-atliekamas-dantu-protezavimas/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/kreivi-dantys-juos-tiesinti-galima-ir-visiskai-nematomu-budu/` | Article | Other | Informational | Active |  |
| `/naudinga/lietuviai-investuoja-i-sypsenas-estetiniu-dantu-proceduru-paklausa-isaugo-50-proc/` | Article | Other | Informational | Active |  |
| `/naudinga/mokymai-apie-kokybiska-bendradarbiavima/` | Article | Other | Informational | Active |  |
| `/naudinga/nauji-dantys-greitai-ir-patikimai/` | Article | Other | Informational | Active |  |
| `/naudinga/nesustojame-tobuleti/` | Article | Other | Informational | Active |  |
| `/naudinga/nobelprocera-skeneris-musu-klinikoje/` | Article | Other | Informational | Active |  |
| `/naudinga/odontologe-lietuviai-rupinasi-dantimis-taciau-pamirsta-kita-svarbu-dalyka/` | Article | Other | Informational | Active |  |
| `/naudinga/odontologe-paneige-tris-didziausius-mitus-apie-dantu-protezavima/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/odontologe-papasakojo-kad-tenka-atlikti-saknu-kanalu-gydyma-isvardijo-galimas-infekcijos-priezastis/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/padedame-ugdyti-tinkamus-igudzius-nuo-pat-mazumes/` | Article | Other | Informational | Active |  |
| `/naudinga/pamirskite-kreivus-dantis-gydytojai-siuncia-zinia/` | Article | Other | Informational | Active |  |
| `/naudinga/pasake-kiek-minuciu-vertetu-valyti-dantis/` | Article | Other | Informational | Active |  |
| `/naudinga/preciziskas-gydytoju-darbas-ir-dantu-protezavimas-padeda-pilnai-atkurti-kramtymo-funkcija/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/protiniai-dantys-gali-sukelti-daug-komplikaciju-jei-laiku-ju-neisrausite-aiskios-taisykles-kam-jus-rauti-butina/` | Article | Other | Safety | Active |  |
| `/naudinga/reikia-estetinio-plombavimo-viskas-ka-reikia-zinoti-is-specialistu-lupu/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/ryskus-pokyciai-atsiranda-nepastebimai/` | Article | Other | Informational | Active |  |
| `/naudinga/siuolaikinis-dantu-protezavimas-modernus-funkcionalus-ir-lengvai-igyvendinamas/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/skaitmenine-sypsena-nuo-a-iki-z/` | Article | Other | Informational | Active |  |
| `/naudinga/specialistai-kas-yra-estetinis-plombavimas-ir-kuo-jis-skiriasi-nuo-iprasto-dantu-plombavimo/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/tarptautinis-nobel-biocare-simpoziumas/` | Article | Other | Informational | Active |  |
| `/naudinga/tyrimas-parode-kad-pusei-lietuvos-gyventoju-truksta-dantu/` | Article | Other | Informational | Active |  |
| `/naudinga/visi-atsakymai-apie-estetini-plombavima-vienoje-vietoje/` | Article | Other | Informational | Review | Topic=Other (no dedicated taxonomy cluster); best-fit flag |
| `/naudinga/zaizda-po-danties-rovimo/` | Article | Other | Informational | Active |  |
| `/naudinga/dantu-balinimas-5-dalykai-kuriuos-svarbu-zinoti-norint-tureti-baltesne-sypsena/` | Article | Whitening | Informational | Active |  |
| `/naudinga/dantu-balinimas-dazniausiai-pasitaikantys-mitai/` | Article | Whitening | Safety | Active | Safety/myths angle from slug |
| `/naudinga/dantu-balinimas-ka-butina-zinoti-pries-apsisprendziant/` | Article | Whitening | Informational | Active |  |
| `/naudinga/dantu-balinimas-kaip-veikia-balinamoji-medziaga-ir-kodel-butina-odontologo-apziura/` | Article | Whitening | Informational | Active |  |
| `/naudinga/dantu-balinimas-kerinti-sypsena-vos-per-valanda/` | Article | Whitening | Informational | Active |  |
| `/naudinga/dantu-balinimas-lazeriu-pastebimi-rezultatai-jau-po-pirmojo-vizito/` | Article | Whitening | Informational | Active |  |
| `/naudinga/dantu-balinimas-namuose-paprasta-ir-efektyvu/` | Article | Whitening | Informational | Active | Likely trays/home intent; Intent=Informational (Safety/Cost not confirmed) |
| `/naudinga/dantu-balinimas-odontologijos-kabinete/` | Article | Whitening | Informational | Active |  |
| `/naudinga/dantu-balinimas-saugus-ir-greitas-budas-atkurti-dantu-baltuma/` | Article | Whitening | Safety | Active | Safety/myths angle from slug |
| `/naudinga/dantu-balinimas-vienas-trumpiausiu-keliu-iki-tobulos-sypsenos/` | Article | Whitening | Informational | Active |  |
| `/naudinga/dantu-balinimas-zoom-sistema-kas-tai-ir-kodel-verta-rinktis/` | Article | Whitening | Informational | Active |  |
| `/naudinga/dantu-balinimas-zoom-sistema-saugu-ir-efektyvu/` | Article | Whitening | Safety | Active | Safety/myths angle from slug |
| `/naudinga/estetinis-plombavimas-profesionali-burnos-higiena-dantu-balinimas-ir-pan/` | Article | Whitening | Informational | Active |  |
| `/naudinga/viskas-ka-turetumete-zinoti-apie-dantu-balinima/` | Article | Whitening | Informational | Active |  |
| `/duk/` | FAQ | Other | Informational | Active |  |
| `/` | Category | Other | Commercial | Active | Homepage |
| `/karjera/` | Category | Other | Informational | Active |  |
| `/naudinga/` | Category | Other | Informational | Active |  |
| `/paslaugos/` | Category | Other | Commercial | Active |  |
| `/sekmes-istorijos/` | Category | Other | Informational | Active |  |
| `/specialistai/` | Category | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-dantu-implantacija-marius-bucinskas-2/` | Other | Implants | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-dantu-implantacija-marius-bucinskas-3/` | Other | Implants | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-dantu-implantacija-marius-bucinskas/` | Other | Implants | Informational | Active |  |
| `/karjera/gydytojas-ortodontas/` | Other | Orthodontics | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-dantu-tiesinimas-eugenija-bucinskiene-2/` | Other | Orthodontics | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-dantu-tiesinimas-eugenija-bucinskiene-3/` | Other | Orthodontics | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-dantu-tiesinimas-eugenija-bucinskiene/` | Other | Orthodontics | Informational | Active |  |
| `/apie-klinika/` | Other | Other | Informational | Active |  |
| `/hello-world/` | Other | Other | Informational | Review | Likely leftover WP page |
| `/kainos/` | Other | Other | Cost | Active | Prices page |
| `/odontologijos-klinikos-kontaktai/` | Other | Other | Commercial | Active | Contact |
| `/paieska/` | Other | Other | Informational | Active |  |
| `/pasiruosimas-chirurginei-procedurai/` | Other | Other | Informational | Active |  |
| `/pries-pirmaji-vizita/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-10/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-11/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-12-2/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-12/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-14/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-17/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-18/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-19/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-20/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-21/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-22/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-23-2/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-23-3/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-23/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-9/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-et/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-test-2/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-istorija-test/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/sekmes-m-m/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/story-1/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/story-2/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/story-3/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/story-4/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/story-5/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/story-6/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/story-7/` | Other | Other | Informational | Active |  |
| `/sekmes-istorija/story-8/` | Other | Other | Informational | Active |  |
| `/specialistai/adele-tvaskuviene/` | Other | Other | Informational | Active |  |
| `/specialistai/aurelijus/` | Other | Other | Informational | Active |  |
| `/specialistai/beata-ostapenko/` | Other | Other | Informational | Active |  |
| `/specialistai/deividas-blazys/` | Other | Other | Informational | Active |  |
| `/specialistai/deividas/` | Other | Other | Informational | Active |  |
| `/specialistai/egle-tupalske/` | Other | Other | Informational | Active |  |
| `/specialistai/eugenija-bucinskiene/` | Other | Other | Informational | Active |  |
| `/specialistai/gabriele-juozapaviciute/` | Other | Other | Informational | Active |  |
| `/specialistai/goda-useviciute/` | Other | Other | Informational | Active |  |
| `/specialistai/jone-davidoniene/` | Other | Other | Informational | Active |  |
| `/specialistai/lina-duseviciute/` | Other | Other | Informational | Active |  |
| `/specialistai/lukas-naktinis/` | Other | Other | Informational | Active |  |
| `/specialistai/marius-bucinskas/` | Other | Other | Informational | Active |  |
| `/specialistai/migle-baranauskaite-sutkaite/` | Other | Other | Informational | Active |  |
| `/specialistai/milda-cepenaite/` | Other | Other | Informational | Active |  |
| `/specialistai/monika-ambrasiene/` | Other | Other | Informational | Active |  |
| `/specialistai/monika-maciute/` | Other | Other | Informational | Active |  |
| `/specialistai/monika-pratapiene/` | Other | Other | Informational | Active |  |
| `/specialistai/neringa-vasiliauskaite/` | Other | Other | Informational | Active |  |
| `/specialistai/pavel-petrov/` | Other | Other | Informational | Active |  |
| `/specialistai/pavel-serlat/` | Other | Other | Informational | Active |  |
| `/specialistai/rugile-joneliene-2/` | Other | Other | Informational | Active |  |
| `/specialistai/vitalija-tuce/` | Other | Other | Informational | Active |  |
| `/specialistai/vytautas-sabataitis/` | Other | Other | Informational | Active |  |
| `/susisiekite/` | Other | Other | Commercial | Active | Contact |

---

## Change Log

| Date | Change |
|---|---|
| 2026-07-14 | v1 created — empty/seed structure only; crawl deferred |
| 2026-07-14 | Added locked Phase 1 field taxonomy before crawl |
| 2026-07-14 | Reframed as Knowledge Acquisition; added empty Cluster Summaries + Observations Log |
| 2026-07-14 | Session 1: sitemap acquisition + LT classification; CSV dataset added |
| 2026-07-14 | Session 1B: EN/RU locale inventory; RQ-006 Outcome B Partial mirrors |
| 2026-07-14 | Phase 2 opened; empty Pattern Catalogue + Cluster Scorecards containers added |
| 2026-07-14 | Phase 2A Session 1: PAT-001–008 + depth scorecards populated |
| 2026-07-14 | Phase 2B Session 1: PAT-009–015 + visibility scorecards |
| 2026-07-14 | Phase 2C Session 1: PAT-016–021 + demand scorecards; GBP manual archive |
| 2026-07-14 | Phase 2 closed PASS; Phase 3 Opportunity Assessment opened |
| 2026-07-14 | Phase 3 Session 1: O-001–O-004 significance ranking |
| 2026-07-14 | Phase 3 Session 2: O-003/O-002 fork resolution |
| 2026-07-14 | Phase 3 Session 3: O-001/O-004 resolved; Phase 3 closed PASS |
| 2026-07-14 | Audit closed; EXP-001 register + Phase 4 candidates doc |
| 2026-07-14 | EXP-002 SERP visibility validation registered Planned |
