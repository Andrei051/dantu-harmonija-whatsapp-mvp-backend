# DH Site Audit & Discovery Handbook v1

Living research notebook for Dantų Harmonija.

**Purpose:** capture what we have learned.  
**Not for:** full URL inventories (see `DH-Content-Inventory-v1.md`).

Related:
- Website: https://dantuharmonija.lt/
- WhatsApp assistant backend lives in this same repo, but is a separate product surface
- Content inventory: `DH-Content-Inventory-v1.md`
- Pre-audit experiment register: `DH-Pre-Audit-Experiment-Register.md`
- Phase 4 candidates (not started): `DH-Phase4-Candidate-Experiments.md`

---

## 1. Executive Summary

Dantų Harmonija is a Vilnius dental clinic.

This workstream is an independent discovery and content architecture review.

- Existing SEO provider remains responsible for traditional SEO (technical SEO, backlinks, reporting, structured data).
- Focus: patient-intent discovery, GSC analysis, GBP analysis, content structure interpretation.

### Audit status — CLOSED (2026-07-14)

| Phase | Status |
|---|---|
| Phase 0 Foundation | ✅ PASS |
| Phase 1 Structure Acquisition | ✅ PASS |
| Phase 2 Behaviour Analysis | ✅ PASS |
| Phase 3 Opportunity Assessment | ✅ PASS |
| Phase 4 Experiments | Contains **EXP-001 only** (pre-audit pilot); no new experiments opened |

**Purpose achieved:** we now understand how the clinic is discovered.  
Future experimentation is a **separate programme** — see `DH-Phase4-Candidate-Experiments.md` (candidates only; not started).

Working discovery model summary: Prosthetics + Esthetic restorations (strong local) · Whitening (efficient local cosmetic intent) · Orthodontics (balanced) · Implants (research-heavy) · Specialists (secondary concentrated) · Brand (primary trust clicks).

---

## 2. Business Context

| Field | Value |
|---|---|
| Clinic name | Dantų Harmonija |
| Website | https://dantuharmonija.lt/ |
| Location | Vilnius (Olimpiečių g. 1A-24) |
| Main stakeholders | TBD |
| Aušra role | TBD |
| Existing SEO agency | TBD |
| Current relationship | Independent discovery parallel to existing SEO partner |

---

## 3. Objectives

### Primary
Understand how Google perceives the clinic.

### Secondary
Identify patient-intent opportunities.

### Tertiary
Run small low-risk experiments.

---

## 3a. Programme Phases

| Phase | Name | Question | Status |
|---|---|---|---|
| Phase 0 | Foundation | Setup | ✅ Complete |
| Phase 1 | Structure Acquisition | What exists? | ✅ Complete |
| Phase 1A | LT Corpus Acquisition | What exists (LT)? | ✅ Complete |
| Phase 1B | Language Surface Validation | What exists (locales)? | ✅ Complete |
| Phase 2 | Behaviour Analysis | How is structure performing? | ✅ Closed — PASS |
| Phase 2A | Structural Pattern Analysis | Inventory-only patterns | ✅ Complete |
| Phase 2B | Search Behaviour Analysis | What Google sees (GSC) | ✅ Complete |
| Phase 2C | Local Demand Analysis | What local patients search (GBP) | ✅ Complete |
| Phase 3 | Opportunity Assessment | What appears meaningful? | ✅ Closed — PASS |
| Phase 4 | Experiments | What should we test? | 📦 EXP-001 only (pre-audit); audit closed |

Progression: **Structure → Behaviour → Opportunity → Experiment**

Governance principle: **Observe first. Interpret later. Decide last.**

### Phase 1 — Structure Acquisition

**Question:** What exists?

**Success criterion:** we understand the structure of the site.

#### Session 1A snapshot — LT corpus (2026-07-14)
- LT URLs inventoried: **341**
- Types: Service 15 · Article 253 · FAQ 1 · Category 6 · Other 66
- Cluster totals: Whitening 15 · Implants 101 · Orthodontics 36 · Hygiene 4 · Other 185
- Detail: DH-Content-Inventory-v1.md + DH-Content-Inventory-data-v1.csv

#### Session 1B snapshot — Language surfaces (2026-07-14)
- RQ-006 acquisition outcome: **Outcome B — Partial mirrors**
- Counts: EN **71** · RU **64** · LV **0**
- Dataset: DH-Content-Inventory-locale-v1.csv

Sub-structure (observation only):
- Service layer near parity (LT 15 · EN 16 · RU 16)
- LT /naudinga/ educational corpus not fully mirrored by EN/RU /new/
- /lv/ absent from sitemap

### Phase 2 — Behaviour Analysis

**Question:** How is structure performing?

**Opened:** 2026-07-14 (governance open; analysis sessions require separate authorization)

#### Analytical questions (not action questions)
- Which clusters generate visibility? *(2B)*
- Which clusters generate local demand? *(2C)*
- Which clusters have content depth? *(2A)*
- Which clusters have little content but high visibility? *(2A+2B)*
- Which clusters have high content but low visibility? *(2A+2B)*
- How does site architecture relate to search behaviour? *(2A+2B+2C)*

#### Inputs
- **Dataset A — Site Structure:** inventory + locale analysis ✅
- **Dataset B — Search Behaviour:** GSC exports ✅
- **Dataset C — Local Demand:** GBP manual capture Feb–Jul 2026 ✅ (DH-GBP-Manual-Capture-2026-02-to-2026-07.md)

#### Outputs (containers)
- Pattern Catalogue
- Cluster Scorecards
- Visibility Map *(needs 2B)*
- Demand Map *(needs 2C)*
- Hypothesis Register

**No Action Backlog in Phase 2.** That belongs in Phase 3.

#### Phase 2 rule set

**Allowed**
- Pattern identification
- Cluster comparison
- Distribution analysis
- Structural observations
- Visibility observations (when GSC arrives)
- Demand observations (when GBP arrives)
- Hypothesis generation

**Not allowed**
- Content recommendations
- Page rewrites
- Consolidation plans
- Editorial calendars
- Prioritization
- Implementation decisions
- Experiment proposals

#### Phase 2 exit criterion

Phase 2 is complete when the site structure, search behaviour, and local demand can be described through evidence-backed patterns **without prescribing actions**.

#### Subphase status
| Subphase | Purpose | Status |
|---|---|---|
| 2A Structural Pattern Analysis | Inventory-only patterns | ✅ Complete |
| 2B Search Behaviour Analysis | GSC evidence | ✅ Complete |
| 2C Local Demand Analysis | GBP evidence | ✅ Complete |

#### Phase 2A Session 1 — Structural Pattern Analysis (2026-07-14)

**Status:** Complete (inventory-only)

**Inputs used:** LT inventory (341), locale inventory, cluster summaries, OBS-001–012 classifications.

**Outputs written to:** `DH-Content-Inventory-v1.md` (Pattern Catalogue + Cluster Scorecards) + Hypothesis Register below.

##### Pattern Catalogue (Session 1)
| ID | Pattern | Evidence |
|---|---|---|
| PAT-001 | Informational-dominant architecture | Article 253 vs Service 15; Informational intent 295/341 |
| PAT-002 | One-service + multi-article cloud per priority topic | Whitening/Implants/Orthodontics/Hygiene each have Service=1 |
| PAT-003 | Extreme article-depth asymmetry across clusters | Implants A/S=97; Orthodontics 31; Whitening 14; Hygiene 3 |
| PAT-004 | Large taxonomy residual in `Other` | Other = 185 URLs (54%); includes 11 services + 108 articles |
| PAT-005 | Latent families exist inside `Other` (slug-level scan) | Article slug hits: prosthetics ~42; esthetics/fillings ~33 (not formal taxonomy yet) |
| PAT-006 | Safety/Cost intents are sparse vs Informational | Safety 15; Cost 11; Comparison 1 |
| PAT-007 | Single dedicated FAQ node | FAQ type count = 1 (`/duk/`) |
| PAT-008 | Locale architecture is service-strong, article-weak | EN/RU services ≈ LT; EN/RU articles 9/14 vs LT 253 |

##### Hypothesis Register (for later 2B/2C validation only)
| ID | Hypothesis | To validate in |
|---|---|---|
| H-2A-001 | Visibility may not scale with article count (thin clusters can still show strong discovery signals). | 2B / 2C |
| H-2A-002 | The implant article cloud creates depth without guaranteeing proportional search/local demand. | 2B / 2C |
| H-2A-003 | Service-layer parity across locales does not imply informational-corpus parity. | 2B (intl visibility) |
| H-2A-004 | Latent `Other` families (prosthetics/esthetics) may be major structural surfaces under-described by current topic taxonomy. | 2A refine / later taxonomy decision only if needed |
| H-2A-005 | Sparse Safety/Cost intents in inventory may under-represent decision-journey language present in patient queries. | 2B query themes |

---


#### Phase 2B Session 1 — Search Behaviour Analysis (2026-07-14)

**Status:** Complete (GSC evidence only; no actions)

**Source:** Downloads/dantuharmonija.lt-Performance-on-Search-2026-07-14/  
**Filters:** Search type = Web · Date = Last 12 months  
**Coverage:** Queries export n=1000 · Pages export n=403 (325 matched to LT inventory)

##### Visibility Map (cluster page impressions)

| Cluster | Inventory depth | Page impressions | Impr / URL | Page clicks |
|---|---:|---:|---:|---:|
| Other | 185 | 251,725 | 1,361 | 8,125 |
| Implants | 101 | 60,777 | 602 | 1,055 |
| Orthodontics | 36 | 28,798 | 800 | 306 |
| Whitening | 15 | 11,353 | 757 | 137 |
| Hygiene | 4 | 10,090 | 2,523 | 126 |
| Locale (EN/RU) | — | 540 | — | 1 |

##### Query demand proxies (Top queries export)

| Query family | Queries | Impressions | Clicks | Impr share |
|---|---:|---:|---:|---:|
| Other clinical (prosthetics/fillings/extraction etc.) | 233 | 49,854 | 515 | 31.2% |
| Implants | 176 | 33,715 | 286 | 21.1% |
| Unclassified (incl. specialist names) | 239 | 19,962 | 975 | 12.5% |
| Orthodontics | 127 | 18,031 | 92 | 11.3% |
| Generic/clinic | 125 | 15,110 | 107 | 9.4% |
| Whitening | 43 | 8,353 | 37 | 5.2% |
| Brand | 15 | 7,555 | 2,826 | 4.7% |
| Hygiene | 42 | 7,326 | 21 | 4.6% |

##### Pattern Catalogue additions
| ID | Pattern | Evidence |
|---|---|---|
| PAT-009 | Brand dominates clicks more than impressions | Brand = 4.7% query impressions but 2,826 clicks (top click queries are brand) |
| PAT-010 | Non-brand query demand is dominated by Other clinical + Implants | 31.2% + 21.1% of query impressions |
| PAT-011 | Visibility efficiency ≠ corpus depth | Hygiene impr/URL 2,523 · Whitening 757 · Ortho 800 · Implants 602 |
| PAT-012 | Articles carry substantial visibility alongside services | Matched type impr: Article 134,987 · Service 82,352 |
| PAT-013 | Within implants, articles can out-click the service hub | Implant articles 861 clicks vs service 193; pain article 298 clicks |
| PAT-014 | Locale surfaces contribute negligible GSC visibility in this export | Locale pages 540 impressions / 1 click |
| PAT-015 | Specialist-name queries are a distinct click pathway | Unclassified click leaders include doctor names; specialist pages high clicks |

##### Hypothesis validation (from 2A)
| ID | Result (evidence-backed, not action) |
|---|---|
| H-2A-001 | **Supported directionally** — thinner clusters (Hygiene, Whitening) show higher or competitive impr/URL vs deep Implants corpus |
| H-2A-002 | **Supported directionally** — Implants has large depth and strong absolute impressions, but lower impr/URL than Whitening/Hygiene/Ortho |
| H-2A-003 | **Supported** — locale service mirrors exist structurally but receive almost no GSC impressions in this export |
| H-2A-005 | Open — decision-journey queries appear in implant pain / aftercare pages; needs deeper query-theme pass |

##### Notable page observations (no recommendations)
- Homepage / is the single largest impression page (66,650 impr / 2,668 clicks)
- /kainos/ is a major commercial/support surface (24,159 impr / 524 clicks)
- Implant experiment-related article /naudinga/skausmas-po-dantu-implantacijos-... : 4,955 impr / 298 clicks
- Whitening service + articles split visibility roughly evenly (service 5,574 vs articles 5,548 impr)



#### Phase 2C Session 1 — Local Demand Analysis (2026-07-14)

**Status:** Complete (GBP evidence; manual capture; no actions)

**Source:** Google Business Profile UI (no export) · Period **Feb 2026 – Jul 2026**  
**Archive:** DH-GBP-Manual-Capture-2026-02-to-2026-07.md

##### Profile demand / engagement snapshot
| Metric | Value |
|---|---:|
| Profile views | 21,443 |
| Profile interactions | 5,029 |
| Searches showing profile | 7,625 |
| Calls | 1,919 |
| Direction requests | 1,937 |
| Website clicks | 1,173 |
| Bookings | 0 |

##### Channel mix (views)
| Channel | Share |
|---|---:|
| Google Search – mobile | 64% |
| Google Maps – mobile | 18% |
| Google Search – desktop | 16% |
| Google Maps – desktop | 3% |

##### Demand Map (search terms with explicit counts ≥16)

Classified share of counted search-show volume (n≈7,624 counted shows):

| Local demand family | Shows | Share | Top examples |
|---|---:|---:|---|
| Brand / location / reviews | 2,301 | 30.2% | address variants, harmonija, reviews |
| Other clinical (prosthetics/esthetics/endo) | 1,950 | 25.6% | estetinis plombavimas, protezavimas |
| Orthodontics | 992 | 13.0% | breketai, tiesinimas, ortodontas |
| Whitening | 937 | 12.3% | dantu balinimas (#1 overall) |
| Generic clinic discovery | 560 | 7.3% | odontologijos klinika |
| Implants | 421 | 5.5% | dantu implantai |
| Hygiene | 347 | 4.6% | dantu higiena / burnos higiena |
| Specialist names | 38 | 0.5% | vitalija tučė |
| Competitor / other | 19 | 0.2% | anteja |

**Brand-like vs discovery-like (among counted):** brand/location/reviews **30.2%** · discovery-like **69.8%**

##### Pattern Catalogue additions
| ID | Pattern | Evidence |
|---|---|---|
| PAT-016 | Local discovery searches exceed pure brand/location queries | Discovery-like ~70% of counted GBP search shows |
| PAT-017 | Whitening is the #1 local non-brand search term | dantu balinimas 843 shows |
| PAT-018 | Local demand ranks Other clinical (esthetics/prosthetics) ahead of Implants | Other clinical 25.6% vs Implants 5.5% of counted shows |
| PAT-019 | Orthodontics local demand is strong relative to site depth | Ortho 13.0% GBP counted vs mid inventory depth |
| PAT-020 | Search (esp. mobile) dominates profile discovery over Maps | Search mobile 64% + Search desktop 16% vs Maps 21% combined |
| PAT-021 | Calls and directions are primary GBP actions; bookings unused | Calls 1,919 · Directions 1,937 · Bookings 0 |

##### Cross-layer validation (2A/2B ↔ 2C)
| ID | Result |
|---|---|
| H-2A-001 | **Further supported** — Whitening thin corpus + high local demand (#1 term) |
| H-2A-002 | **Further supported** — Implants large corpus but weaker local GBP share (5.5%) vs Whitening/Ortho/Other clinical |
| GBP-001 | **Supported** — discovery-like > brand-like among counted shows |
| GBP-002 | **Supported** — Whitening strong locally |
| GBP-003 | **Supported** — Implants weaker than expected locally relative to corpus and GSC absolute visibility |
| RQ-001 | Open analytical question now highly constrained by evidence: local whitening demand >> implants despite thinner content |

##### GSC vs GBP contrast (observation only)
- GSC query impressions: Implants high absolute; Whitening moderate
- GBP local shows: Whitening #1 clinical term; Implants much lower share
- Both layers show strong Other clinical (esthetics/prosthetics) demand



#### Phase 2 Verdict — PASS (2026-07-14)

**Decision:** Close Phase 2.

**Reason:**
- Structure characterised
- Visibility characterised
- Local demand characterised
- Cross-layer comparisons possible
- Core hypotheses tested directionally
- No actions proposed

##### Bridge artefact — three-layer comparison

| Cluster | Structure | Visibility | Demand |
|---|---|---|---|
| Whitening | Thin | Efficient | Strong |
| Implants | Deep | High absolute | Weak locally |
| Orthodontics | Moderate | Strong | Strong |
| Other clinical | Large residual | Very high | Very high |

This table is the bridge between Behaviour Analysis and Opportunity Assessment.

**Note:** No further Phase 2 pattern work unless a genuinely new dataset appears.

### Phase 3 — Opportunity Assessment

**Question:** Which findings appear meaningful enough to deserve attention?

**Opened:** 2026-07-14

Phase 2 asked: *What is happening?*  
Phase 3 asks: *Which observations appear important enough to investigate further?*  
Still not: *What should we change?*

#### Phase 3 rule set

**Allowed**
- Significance assessment
- Opportunity identification
- Tension analysis
- Structural contradictions
- Demand / visibility mismatches
- Competitive interpretation
- Economic interpretation
- Prioritisation frameworks
- Opportunity scoring

**Not allowed** (remain Phase 4)
- Content briefs
- New page proposals
- Rewrite recommendations
- SEO implementation plans
- Editorial calendars
- GBP optimisation actions
- Technical SEO actions

#### Phase 3 exit criterion

Phase 3 is complete when the programme can state which cross-layer findings appear meaningful enough to deserve attention — still without prescribing website changes.

#### Candidate Opportunity Surfaces (registered before Session 1)

| ID | Name | Core question |
|---|---|---|
| O-001 | Whitening Efficiency | Why does whitening generate disproportionate visibility and demand relative to content depth? |
| O-002 | Implant Depth Paradox | Why does the deepest topic cluster fail to dominate local discovery? |
| O-003 | Other Clinical Hidden Giant | Is "Other" actually the clinic's primary discovery engine? |
| O-004 | Specialist-Led Discovery | To what extent is discovery attached to clinicians rather than services? |

---

#### Phase 3 Session 1 — Significance Assessment (2026-07-14)

**Status:** Complete  
**Method:** Score each candidate on evidence strength, cross-layer tension, and model-challenging power. No actions.

##### Scoring scale
| Score | Meaning |
|---|---|
| High | Strong multi-layer evidence; challenges a prior mental model |
| Medium | Clear pattern; important but partially expected |
| Watch | Real signal; narrower or secondary pathway |

##### Opportunity assessments

###### O-001 — Whitening Efficiency
- **Evidence:** Thin corpus (15) · efficient GSC visibility · #1 GBP clinical term (`dantu balinimas` 843)
- **Tension:** Demand/efficiency much greater than structural depth
- **Model impact:** Confirms known surprise; does not rewrite the clinic model by itself
- **Significance:** **Medium–High** — meaningful mismatch; already partially anticipated by RQ-001 / GBP-002

###### O-002 — Implant Depth Paradox
- **Evidence:** Deepest dedicated corpus (101) · high absolute GSC · weak GBP share (5.5%)
- **Tension:** Content depth does not equal local discovery dominance
- **Model impact:** Challenges naive assumption that more content equals more local demand
- **Significance:** **High** — strong paradox; essential for understanding clinics-as-content-machines

###### O-003 — Other Clinical Hidden Giant
- **Evidence:** Taxonomy residual in Phase 1 · largest GSC page visibility bucket · largest clinical GBP demand (25.6%) · 11 services + large article set under Other · top terms include estetinis plombavimas, protezavimas
- **Tension:** Analytical label "Other" understates operational reality
- **Model impact:** May mean the clinic's primary discovery engine was outside the priority taxonomy
- **Significance:** **Highest** — largest model-challenge; Phase 1 residue becomes Phase 2 centre of gravity

###### O-004 — Specialist-Led Discovery
- **Evidence:** Doctor-name queries among top GSC clicks · specialist pages high clicks · GBP includes specialist names and review-seeking brand variants
- **Tension:** Trust/discovery pathway may partially bypass service clusters
- **Model impact:** Brand is not the only trust mechanism; clinician search matters
- **Significance:** **Medium** — clear secondary pathway; narrower than O-003/O-002 but real

##### Session 1 verdict — meaningful vs interesting

| Rank | ID | Verdict | Why |
|---|---|---|---|
| 1 | O-003 | **Meaningful (primary)** | Taxonomy residue vs highest visibility + clinical local demand = incomplete mental model of the clinic |
| 2 | O-002 | **Meaningful (primary)** | Depth without local dominance is a structural-demand contradiction |
| 3 | O-001 | **Meaningful (support)** | Strong mismatch; already foreshadowed; supports efficiency thesis |
| 4 | O-004 | **Meaningful (secondary / watch)** | Real click pathway; less central to cluster architecture story |

**Pre-session expectation check:** Prediction that O-003 would be highest-value is **confirmed** by Session 1 scoring.

**Still not Phase 3 output:** what to rewrite, merge, create, or publish.

**Status after Session 1:** Led to Session 2 fork investigation on O-003 / O-002.


#### Phase 3 Session 2 — Fork Resolution (2026-07-14)

**Status:** Complete  
**Scope (narrow):** O-003 disaggregation + O-002 journey-stage comparison only.  
**Not included:** O-001, O-004, recommendations, experiments, action backlog.

##### Proposed Scope (recorded at start)
- **O-003 question:** Is "Other clinical" a coherent discovery family, or an aggregation of multiple independent engines?
  - Fork A — Unified Engine
  - Fork B — Multiple Engines
- **O-002 question:** Does the implant cluster genuinely underperform relative to its structural depth?
  - Fork A — Underperformance
  - Fork B — Journey-Stage Difference

##### O-003 evidence (disaggregation)

GBP counted clinical-latent split (prosthetics/esthetics/fillings/endo/surgery family pool):
| Family | Shows | Share of clinical-latent |
|---|---:|---:|
| Prosthetics | 870 | 45.1% |
| Esthetic restorations | 682 | 35.3% |
| Fillings | 294 | 15.2% |
| Endodontics | 85 | 4.4% |
| Surgery / extraction | 0* | 0% |

\*Surgery is weak in GBP top counted terms, but strong in GSC (page impr ~24k; query research/aftercare theme).

GSC non-priority query impressions (directional):
| Family | Impressions | Share of this pool |
|---|---:|---:|
| Prosthetics | 19,091 | 22.5% |
| Esthetic restorations | 12,881 | 15.2% |
| Surgery / extraction | 8,616 | 10.1% |
| Endodontics | 6,918 | 8.1% |
| Fillings | 3,403 | 4.0% |

Inventory Topic=`Other` depth (slug/family tagging): Prosthetics dominates latent clinical content depth (≈43 URLs, mostly articles). Esthetics/fillings thinner in inventory tagging but strong in demand metrics.

**O-003 fork resolution:** **Fork B — Multiple Engines (concentrated)** best supported.

Not five equal engines. Two primary engines (**Prosthetics** + **Esthetic restorations**) account for roughly **~80%** of clinical-latent GBP demand; Fillings secondary; Endodontics smaller; Surgery more GSC-research than GBP-local in this capture.

Interpretation: "Other" was not one hidden giant — it was a container hiding especially two strong discovery engines plus smaller adjacencies. Aggregation previously overstated unity.

##### O-002 evidence (journey lens)

Implant GSC query stages (top-query export):
| Stage | Queries | Impressions | Clicks |
|---|---:|---:|---:|
| General | 72 | 14,467 | 98 |
| Cost research | 50 | 10,611 | 34 |
| Local service | 22 | 4,958 | 12 |
| Process/aftercare research | 20 | 2,300 | 124 |
| Solution-type research | 12 | 1,379 | 18 |

Contrast:
- Implant pages: Articles 35,174 impr / 861 clicks vs Service 25,440 / 193 — research corpus carries more engagement
- GBP counted: Whitening 937 vs Implants 421 — local immediate intent favors whitening
- Whitening GSC has fewer queries overall but higher share of simple/general + local patterns relative to depth

**O-002 fork resolution:** **Fork B — Journey-Stage Difference** best supported as explanation of the apparent paradox.

Implants show heavy research/cost/process behaviour in GSC and comparatively weaker GBP local-show share. That pattern fits "different measurement moment in the patient journey" better than a simple claim of local market failure. Local weakness remains a **real descriptive fact**; "underperformance" as interpretive verdict is weaker.

Residual open: Fork A is not fully falsified for local channel specifically — implants may still be locally soft — but Session 2 treats Journey-Stage Difference as the better default explanation for the Structure/Visibility/Demand mismatch.

##### Session 2 verdict

| Opportunity | Best-supported fork | Material understanding change? |
|---|---|---|
| O-003 | **Multiple Engines (concentrated: Prosthetics + Esthetics)** | **Yes** — "Other" is not one engine |
| O-002 | **Journey-Stage Difference (with residual local softness)** | **Yes** — paradox likely cross-channel journey effect, not pure depth failure |

Still no implementation decisions, experiments, or action backlog.

**Phase 3 status after Session 2:** Led to Session 3 residual pass on O-001 / O-004.



#### Phase 3 Session 3 — Residual Opportunities (2026-07-14)

**Status:** Complete  
**Scope:** O-001 Whitening Efficiency + O-004 Specialist-Led Discovery only.

##### O-001 — Whitening Efficiency

**Question:** Is whitening genuinely exceptional, or simply another manifestation of esthetic-intent demand?

Evidence:
- Whitening and Esthetic restorations are **parallel**, not identical demand streams (GSC query impr: Esthetic ~12.9k · Whitening ~8.4k; GBP shows: Whitening 937 · Esthetic 682)
- Broader smile/veneer language is small (GSC ~721 impr) — not the main shared parent
- Whitening corpus is thin (15) but focused (mostly informational/safety around one purchasable outcome)
- Efficiency remains high (≈742 impr/URL vs esthetic slug set ≈573)
- Service + articles both contribute; service hub leads whitening page impressions

**Resolution:** Whitening is a **distinct immediate cosmetic-treatment intent engine**, related to esthetics but **not reducible** to the Esthetic restorations engine from Session 2.

Exceptional relative to depth: **yes**, mainly because it is a short, high-clarity local purchase pathway.  
Part of a broader esthetic universe: only loosely — adjacency, not identity.

**Status:** Explained / closed as open opportunity.

##### O-004 — Specialist-Led Discovery

**Question:** Are clinicians generating discovery, or benefiting from discovery created elsewhere?

Evidence:
- Doctor-name queries ≈ **15.7%** of clicks in GSC query export (762 clicks) vs brand-query clicks ≈ 2,826
- Specialist profile pages in export: 25 pages · 8,736 impr · **1,624 clicks**
- Highly concentrated: top clinician page alone (~740 clicks) exceeds nearly all service-page click totals
- Brand remains the larger trust click pathway; specialists are secondary but material

**Resolution:** **Both**, with concentration.
- Top clinicians generate named-search discovery (true person-led entry)
- Clinic/brand remains primary trust magnet overall
- Specialists also benefit from existing clinic discovery (profile browsing after clinic intent)

**Status:** Explained as **secondary concentrated trust pathway** — watchlist cleared as open question; remains a standing feature of the model, not an unresolved paradox.

##### Updated Opportunity Register

| Opportunity | Status after Session 3 |
|---|---|
| O-003 Other Clinical Hidden Giant | **Finding:** Hidden Duopoly (Prosthetics + Esthetic restorations) |
| O-002 Implant Depth Paradox | **Finding:** Journey-stage separation (GSC research vs GBP local intent) |
| O-001 Whitening Efficiency | **Finding:** Distinct cosmetic-treatment intent engine (adjacent to, not identical with, esthetics) |
| O-004 Specialist-Led Discovery | **Finding:** Secondary concentrated clinician-name pathway alongside brand |

#### Phase 3 Verdict — PASS (2026-07-14)

**Decision:** Close Phase 3.

**Reason:**
- Significance hierarchy established (Session 1)
- Tier-1 forks resolved (Session 2)
- Residual opportunities explained (Session 3)
- Opportunity register fully converted from open questions to findings
- No actions / experiments proposed

##### Working model of clinic discovery (interpretive summary)

| Discovery surface | Dominant behaviour |
|---|---|
| Prosthetics | Strong local demand |
| Esthetic restorations | Strong local demand |
| Whitening | Efficient local discovery (distinct cosmetic intent) |
| Orthodontics | Balanced visibility + demand |
| Implants | Research-heavy discovery |
| Specialists | Secondary concentrated trust pathway |
| Brand | Primary click/trust magnet in search queries |

**Phase 4** is not opened by this audit. Historical pilot EXP-001 is recorded below and in `DH-Pre-Audit-Experiment-Register.md`. Candidate future experiments live in `DH-Phase4-Candidate-Experiments.md` (not started).


## 4. Research Questions

Not findings. Not hypotheses. Questions that drive the work.

### RQ-001
Why is whitening disproportionately strong in GBP compared with implants?

### RQ-002
Is whitening visibility driven by commercial intent, informational intent, or both?

### RQ-003
How fragmented is the whitening cluster?

### RQ-004
Which patient questions generate the highest discovery visibility?

### RQ-005
Does Google prefer service pages or educational pages for dental topics?

### RQ-006
Are localized URLs (/en/, /ru/, /lv/) true mirrors of the Lithuanian corpus, or do they represent independent content surfaces?

**Acquisition status:** Outcome B (Partial mirrors). Behavioural interpretation may continue in Phase 2 without reopening acquisition.

---

## 5. What We Believe

Separate evidence from interpretation.

### Evidence
- Whitening cluster generated ~>9k impressions in 3 months.
- Brand queries currently dominate traffic.
- Informational content performs better than expected.
- Implant pain-page experiment was indexed and associated with relevant queries.
- In GBP, discovery searches exceed branded searches.
- In GBP, whitening appears stronger than expected; implants weaker than expected.
- LT site structure: 341 classified URLs; implant article volume is large (97 articles).
- Localized surfaces are partial mirrors (RQ-006 Outcome B): services near parity; patient-education articles not fully mirrored; `/lv/` absent from sitemap.

### Hypotheses
- Whitening cluster is fragmented around patient intents (safety, trays/home, cost, myths).
- Stronger ownership of whitening tray intent could improve clarity and capture.
- Content architecture (not only page count) is a major lever for discoverability.
- Patient decision-journey questions (pain, safety, healing, cost clarity) are useful framing for future pages.

---

## 6. Google Search Console Findings

### Finding GSC-001
**Brand dominates clicks more than impressions.** (Refined in 2B Session 1: brand ~4.7% query impressions, but brand queries lead clicks.)

### Finding GSC-002
**Informational content performs better than expected.**

### Finding GSC-003
**Implant experiment indexed successfully.**

### Finding GSC-004
**Whitening cluster generated >9k impressions in 3 months.**

---

## 7. GBP Findings

### Finding GBP-001
**Discovery searches exceed branded searches.** (Confirmed 2C Session 1: discovery-like ~70% vs brand/location/reviews ~30% among counted terms.)

### Finding GBP-002
**Whitening stronger than expected.** (Confirmed: dantu balinimas #1 GBP term, 843 shows.)

### Finding GBP-003
**Implants weaker than expected.** (Confirmed locally: Implants 5.5% of counted GBP shows vs Whitening 12.3% and Other clinical 25.6%.)

### Finding GBP-004
**Discovery is Search-heavy more than Maps-heavy.** (Refined 2C: Search 80% of views vs Maps 21%; cosmetic/esthetics strong in search terms.)

---

## 8. Experiments

### Pre-Audit Experiment Register

Experiments that ran **before** this audit framework matured. Not part of a formal Phase 4 programme launch.

| ID | Experiment | Status | Result |
|---|---|---|---|
| EXP-001 | Ar skauda dantų implantavimas? / implant pain–recovery question page | Complete | **PASS** (small-scale validation) |

Finding (narrow, defensible):

Patient-question content can obtain indexation, query association, and organic clicks on Dantų Harmonija when the question aligns with real search behaviour.

This does **not** prove content expansion works in general.

### EXP-001 — Implant pain / recovery question
- **Status:** Complete (pre-audit intervention)
- **Hypothesis:** A patient decision-stage question around implant pain/recovery can be captured organically
- **Intervention:** Page created → indexed → query mapping observed → performance measured
- **Measured signal (GSC Pages, Web, last 12 months export):**  
  `/naudinga/skausmas-po-dantu-implantacijos-gijimas-ir-galimos-komplikacijos/` ≈ **4,955 impressions · 298 clicks** (strong engagement relative to many implant articles)
- **Outcome table:** Indexation ✅ · Query alignment ✅ · Relevant clicks ✅ · Positioning reasonable (~14–15 reported) · Behavioural signal confirmed ✅
- **Result:** **PASS** (small-scale validation)
- **Fit to discovery model:** Sits in **Implants → research-heavy discovery** (pain, recovery, healing, aftercare, complications) — retrospectively aligned with Phase 3 journey-stage finding
- **Detail register:** `DH-Pre-Audit-Experiment-Register.md`

### EXP-002 — Whitening trays
- **Status:** Superseded as experiment ID
- **Note:** ID **EXP-002** is now reserved for Planned Phase 4 experiment *Discovery Surface Visibility Validation* in `DH-Phase4-Candidate-Experiments.md`
- Whitening trays idea retained as **CAND-003** (Idea only)

---

## 8a. Audit Close Note (2026-07-14)

The formal discovery audit is **complete**.

We understand:
- what the clinic built (Phase 1)
- what Google and GBP surface (Phase 2)
- how to interpret contradictions (Phase 3)

Experimentation, if pursued, starts a **new programme** — not an unfinished tail of this audit.

---

## 9. Opportunity Backlog

Legacy idea list retained for continuity. Formal significance work supersedes this in Phase 3 opportunity register (O-001–O-004 → findings).

### OPP-001
Whitening trays intent ownership.

### OPP-002
Whitening cluster consolidation.

### OPP-003
FAQ cluster around sensitivity. *(candidate)*

### OPP-004
GBP review mining. *(candidate)*

---

## 10. Timeline

| Date | Event | Status |
|---|---|---|
| TBD | Initial GSC access granted | Completed |
| 2026-04-15 | Wordcloud exercise (current + future intent cloud) | Completed |
| TBD | Implant experiment proposed | Completed |
| TBD | Implant page published | Completed |
| TBD | First results reviewed | Completed |
| TBD | Whitening review started | Completed |
| 2026-07-14 | Discovery Handbook + Content Inventory scaffolding created | Completed |
| 2026-07-14 | Research Questions + Phase 1 taxonomy added | Completed |
| 2026-07-14 | Phase 1 redefined as Knowledge Acquisition; programme phases locked | Completed |
| 2026-07-14 | Phase 1 Session 1A: LT sitemap acquisition + classification | Completed |
| 2026-07-14 | Phase 1 Session 1B: EN/RU language-surface validation; RQ-006 → Outcome B | Completed |
| 2026-07-14 | Phase 2 Behaviour Analysis opened (2A open; 2B/2C waiting exports) | Completed |
| 2026-07-14 | Phase 2A Session 1 complete — PAT-001–008 + H-2A-001–005 recorded | Completed |
| 2026-07-14 | Phase 2B Session 1 complete — PAT-009–015 + visibility map | Completed |
| 2026-07-14 | Phase 2C Session 1 complete — PAT-016–021 + demand map | Completed |
| 2026-07-14 | Phase 2 closed — PASS; three-layer bridge recorded | Completed |
| 2026-07-14 | Phase 3 Opportunity Assessment opened | Completed |
| 2026-07-14 | Phase 3 Session 1 — significance assessment O-001–O-004 | Completed |
| 2026-07-14 | Phase 3 Session 2 — O-003/O-002 fork resolution | Completed |
| 2026-07-14 | Phase 3 Session 3 — O-001/O-004 residual resolution | Completed |
| 2026-07-14 | Phase 3 closed — PASS; discovery model summarised | Completed |
| 2026-07-14 | Audit closed — formal discovery programme complete | Completed |
| — | Phase 4 new experiments | Not opened (candidates only) |

---

## Change Log

| Date | Change |
|---|---|
| 2026-07-14 | v1 created — seeded with known findings; inventory kept separate |
| 2026-07-14 | Added Research Questions (RQ-001–RQ-005); renumbered sections |
| 2026-07-14 | Added programme phases + Phase 1 Knowledge Acquisition governance |
| 2026-07-14 | Phase 1 Session 1 snapshot added (LT inventory complete) |
| 2026-07-14 | Phase 1A/1B split; RQ-006; exit criteria; Session 1B Outcome B recorded |
| 2026-07-14 | Phase 2 Behaviour Analysis opened with 2A/2B/2C model; Phase 3/4 closed |
| 2026-07-14 | Phase 2A Session 1 Structural Pattern Analysis completed |
| 2026-07-14 | Phase 2B Session 1 Search Behaviour Analysis completed |
| 2026-07-14 | Phase 2C Session 1 Local Demand Analysis completed |
| 2026-07-14 | Phase 2 closed PASS; Phase 3 Opportunity Assessment opened |
| 2026-07-14 | Phase 3 Session 1 significance assessment (O-001–O-004) |
| 2026-07-14 | Phase 3 Session 2 fork resolution O-003/O-002 |
| 2026-07-14 | Phase 3 Session 3 residual opportunities; Phase 3 closed PASS |
| 2026-07-14 | Audit closed; EXP-001 pre-audit register; Phase 4 candidates doc |
| 2026-07-14 | EXP-002 Discovery Surface Visibility Validation registered Planned |
