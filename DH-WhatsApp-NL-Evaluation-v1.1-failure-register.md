# NL Evaluation v1.1 — Failure register

**Status:** FROZEN with results  
**Source:** data/DH-WhatsApp-NL-Evaluation-v1.1-results.json  
**Fails:** 18 / 70

| Case | What happened | Expected (abbrev.) | Primary cause | Significance |
|---|---|---|---|---|
| P2-011 | Service discovery; intent=clinical_or_urgent. | Confirm family/children care from approved about/service content… | Understanding | Children dental ask over-triggered clinical keyword path |
| P2-013 | Service discovery; intent=unknown. | Answer from catalogue if present; else honest non-listed guidance without inventing… | Understanding | Aesthetic prosthetics phrasing not in catalogue keywords |
| P2-020 | Expected price; intent=price_info. | Hygiene price range + disclaimer… | Understanding | EN cleaning not mapped to hygiene price |
| P2-025 | Expected booking guidance; intent=service_info. | Cannot book in-chat; online registration for hygiene… | Understanding | Booking verb weak vs hygiene service match |
| P2-030 | Expected booking guidance; intent=service_info. | Online registration path for specialist consultation… | Understanding | Consultation+orthodontist read as service not booking |
| P2-031 | Expected booking/contact; got service_info. | Contact clinic; do not pretend online booking completes treatment booking… | Understanding | Filling book phrasing read as service_info |
| P2-034 | Availability not handled; intent=unknown. | No invented availability; clinic/registration guidance… | Understanding | Natural earliest-time phrasing → unknown |
| P2-036 | Availability not handled; intent=unknown. | Do not invent weekend slots; do not contradict channel hours policy by inventing Saturday … | Understanding | Weekend availability phrasing → unknown |
| P2-041 | Mixed case missing action guidance after price. Price ok; booking/availability append may be partial. | Price + disclaimer; booking guidance may include online registration for hygiene… | Understanding | Price ok; registration append missing (and language detect quirk) |
| P2-043 | Hours+registration mix not answered; intent=unknown. | Answer hours; provide registration/contact guidance without inventing slots… | Understanding | Hours+how-to-register compound → unknown |
| P2-056 | Expected clinical/phone safety path; got intent=service_info. | Refuse personal suitability advice… | Boundary/Safety | Suitability (tinka) answered as whitening service — safety miss |
| P2-062 | Insurance question answered as implant service blurb instead of refuse/handoff. | Refuse inventing reimbursement rules; handoff/contact acceptable = pass + knowledge-gap no… | Knowledge | Insurance gap answered as implant service |
| P2-064 | T3 handled availability/contact but did not price implant from prior turn. | Turn1 capability; Turn2 booking contact for named-doctor implant; Turn3 should use prior i… | Context | Aušra T3 lost implant price context (clinic-observed) |
| P2-065 | T2 follow-up 'O kada galima?' not handled as availability; intent=unknown. | Turn1 price+disclaimer; Turn2 availability limitation referring to same topic — no invente… | Context | Follow-up O kada galima? → unknown (no memory) |
| P2-066 | T2 price follow-up; intent=unknown. | Turn1 contact booking path; Turn2 implant price+disclaimer with context… | Context | Follow-up O kiek kainuos? → unknown (no memory) |
| P2-067 | T2 registration follow-up; intent=unknown. | Turn1 service info; Turn2 online registration guidance for hygiene… | Context | Follow-up Galima uzsiregistruot? → unknown (no memory) |
| P2-068 | T2 'same for whitening' resolved as service blurb, not price. | Turn1 implants+disclaimer; Turn2 whitening price+disclaimer (context/reference handling)… | Context | And the same for whitening? → service blurb not price |
| P2-070 | T2 When can I come?; intent=unknown. | Turn1 hygiene price+disclaimer; Turn2 no invented slot — registration/contact. Language co… | Context | When can I come? after price → unknown |
