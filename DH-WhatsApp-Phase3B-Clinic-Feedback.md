# Phase 3B — Clinic feedback register (Aušra)

**Opened:** 2026-09-25  
**Updated:** 2026-10-08 — A2 contract accepted; content preparation next; no code  
**Status:** Capture and disposition — **no implementation in this update**  
**Source:** Clinic-side WhatsApp testing. Logs available.

Aušra is supplying clinic-owned routing, not sentence-level copy edits. Do not turn each WhatsApp comment into its own patch.

**Clinical ≠ urgent** (F1) stays. **First aid ≠ urgent.** A patient may need prompt practical help without the assistant deciding the situation is an emergency.

---

## Where we stand

| Finding | Expected behaviour | Readiness |
|---|---|---|
| **A1** Pirma pagalba | Acknowledge the incident and direct the patient to call the clinic | Behaviour confirmed for the examples discussed; **boundaries still open** |
| **A2** Sąvokos / “Kas tai yra?” | One-sentence approved definition; follow-up stays on that term; suitability and urgency unchanged | **Contract accepted.** Content preparation next. **No code.** |
| **A3** Hygiene pricing | Hygiene-only disclaimer and registration link; other prices unchanged | **Implemented locally** — pending production check |
| **A4** Booking language | Online registration leads with the link; contact-only bookings still use the phone route | **CLOSED / PROD VERIFIED** 🔒 2026-10-08 |

**Suggested order:** A3 wording next. A2 stays in content review. Leave N11 and unresolved first-aid boundaries open.

---

## A1 — First aid (not fully resolved)

Aušra’s follow-up confirms a handling principle and explains two clocks. It does not close terminology, Saturday, or out-of-hours behaviour. Do not generalise her approval into a rule for every dental symptom. She was responding to the first-aid examples already discussed (fallen bracket, lost tooth, chipped tooth).

| Slice | What she confirmed | Status |
|---|---|---|
| **A1a** First-aid contact principle | Briefly acknowledge what happened and direct the patient to call the clinic. Clinic staff decide assessment and next steps. The assistant does not decide whether it is a medical emergency. | **CONFIRMED** |
| **A1b** 07:45 vs 08:00 | Reception opens and answers calls at **07:45**. Doctors start seeing patients at **08:00**. These are two operational facts, not competing versions of one opening time. | **CONFIRMED** |
| **A1c** Pirma pagalba vs Skubi pagalba | She did not say whether her label and the website label are the same pathway. | **OPEN** |
| **A1d** Saturday | Not addressed. Homepage still shows Saturday 09:00–14:00 by prior registration. WhatsApp hours text is weekdays only. | **OPEN** |
| **N11** Outside hours / unanswered calls | Not addressed. Do not invent an out-of-hours pathway. | **OPEN** |

### What the current bot does

Fallen tooth and similar turns: `clinical` + `clinical_or_suitability: true` → `S1_clinical_assessment` (“Koks gydymas būtų tinkamas…”). Safe under F1. Wrong operational response for the examples Aušra named.

### Dimensions (do not collapse)

| | Question |
|---|---|
| Clinical judgement | Does a dentist need to determine treatment or suitability? |
| Urgency | Does this meet the existing urgent-phone criteria? |
| First aid | For the confirmed examples, acknowledge and direct the patient to call. |

Severe pain and bleeding still use the urgent route. Suitability questions (“Ar man tinka implantas?”) stay on assessment, not first aid.

### Site context (2026-09-25) — not bot copy

[Registracija](https://dantuharmonija.lt/registracija/) labels **Skubi pagalba (7:45–20:00)** and says to call **+370 610 11222** during working hours. Aušra’s 07:45 fact matches reception answering the phone. It does not, by itself, rename the pathway or set Saturday or after-hours behaviour.

### Not authorised until boundaries are defined

- No schema or interpreter change
- No keyword list (`nuskilo` / `iškrito` / `breketas` → first aid)
- No frozen sentence until A1c, and any hours wording, are explicit
- Do not treat every symptom as first aid because A1a is confirmed

**A1a shape, when later implemented:** short acknowledgement of what happened, then call the clinic so staff can decide what to do. Not a treatment-selection essay, and not the emergency script.

---

## A2 — Sąvokos / “Kas tai yra?” — behavioural contract

**Status:** CONTRACT ACCEPTED / CONTENT PREPARATION NEXT / NO CODE.  
**Does not wait on A1c, A1d, or N11.** A4 stays the other implementation candidate once content and the follow-up check below are settled.

### What went wrong

| Turn | What happened |
|---|---|
| `Kas yra dantų protezas?` | `service_info`. Bridge maps “protezas” to prosthetics. Reply is a **capability** sentence (“Taip, klinikoje atliekamas…”). |
| `O kas tai yra?` | Reference text resolves to the prosthesis. Policy never reads `references`. No service id → **D2** scope reply. |

`services.json` descriptions are offering fragments (`Vainikėliai, tiltai, protezai.`), and `formatServiceCapability` always leads with “the clinic offers…”. They are not definitions.

### 1. What counts as a definition request

A definition request asks what a dental term **means**, not whether the clinic provides it and not whether it is right for the patient.

**In:**

- Explicit meaning asks: `Kas yra …?`, `Kas tai yra?`, `O kas tai yra?`, `What is a …?`, `What does … mean?`
- The term is one approved catalogue concept (a service or a plain-language name already tied to one service, such as dantų protezas → prosthetics).

**Out (not definitions):**

- Capability: `Ar darote protezavimą?`, `Do you do implants?`
- Catalogue: `Kokias paslaugas turite?`
- Price, booking, hours, first visit
- Need, suitability, or comparison: `Ar man reikia…`, `Ar man tinka…`, `Kas geriau — implantas ar tiltas?`
- What happened to the patient, pain, first aid, urgency
- Terms with no approved definition

One explicit term per turn. Two terms in one meaning question stay unresolved (ask which term). Do not invent a definition for the second.

### 2. Where the words come from

Reply-time generation is not a definition source.

Each approved term has a **separate one-sentence definition**, written and reviewed in advance, in LT and EN. It states what the thing is in plain language. It does not say the clinic offers it, quote a price, recommend it, or compare it with another treatment.

Current `description` fields stay capability text. A definition must not be assembled by rephrasing them at runtime.

Until that sentence exists for a term, the assistant does not define the term.

### 3. Follow-ups

`O kas tai yra?` / `What is it?` is a definition request whose term is the **single** concept from the immediately previous clinic answer (capability or definition).

- One clear prior concept with an approved definition → that definition.
- No single prior concept, or the prior concept has no approved definition → ask which term they mean. Do not send the generic out-of-scope line for a clinic term already in the conversation.
- A new explicit term in the follow-up replaces the prior concept.

The assistant does not accumulate a list of possible meanings across a long chat.

### 4. When assessment wins

| Patient job | Response |
|---|---|
| Definition only | The one-sentence definition. No “Taip, klinikoje atliekamas…”. No assessment paragraph. |
| Capability only | Existing capability sentence. No definition. |
| Suitability, need, or comparison only | Existing assessment / contact. No definition. |
| Urgent cues | Existing urgent phone path. No definition. |
| Definition and suitability in the same message | Definition first, then the existing assessment. Assessment does not replace the definition. Suitability alone does not become a definition. |

First aid and N11 are unchanged by this contract.

### 5. Can Schema v1 and current policy carry this?

**Schema v1 does not need a new intent.** `service_info` already covers “kas yra dantų protezas?”. There is no definition type, and adding one is unnecessary if policy tells definition apart from capability.

**Policy cannot do it unchanged.**

- It treats every resolved `service_info` as a capability sentence.
- It does not read `references`, so `O kas tai yra?` cannot use the reference the interpreter already returned.
- It has no approved definition text to return.

**Smallest later change, if this contract is accepted:** a definition mode inside the existing `service_info` path, plus a reviewed definition sentence per term, plus use of the existing `references` entry only for a bare “what is it?” follow-up. No new intent, no free-text generation, no change to urgency or to the capability reply for “do you offer…?”.

**Acceptance, when built:**

- `Kas yra dantų protezas?` → one approved sentence about what a prosthesis is.
- `O kas tai yra?` after that → the same sentence, not D2.
- `Ar darote protezavimą?` → capability sentence, unchanged.
- `Ar man tinka protezas?` → assessment, no definition.
- Urgent bleeding → urgent path, unchanged.

### 6. Follow-up feasibility (checked, contract unchanged)

The preceding clinic answer is kept, but not as a structured concept.

Stored context is `{ role, text }` for the last eight turns (`conversationContext.ts`). That transcript is given to the **interpreter** only. `applyPolicyAndAssemble` receives the interpretation and the current message. It does not receive prior turns, and it does not read `references`.

Nothing on the stored assistant turn records a service id or a definition term. The interpreter may put the idea into Schema v1 as `service_or_topic.id` or as `references[].resolved_to` (a free string plus `source_turn`). In Aušra’s follow-up it did the second, with no service id. Policy cannot dereference `source_turn`, because it never sees the turn list.

So a bare `O kas tai yra?` is safe for policy only when the interpreter’s reference string matches **exactly one** approved inventory term. If the reference is missing, vague, or matches two terms, ask which term. Policy must not recover the concept by parsing the previous reply. A prosthetics capability sentence mentions crowns, bridges, and dentures at once, so the service id alone is also not a definition term.

| Interpreter reference | Policy behaviour |
|---|---|
| Exactly one approved term | Return that term’s approved definition |
| No matching approved term | Ask which term the patient means |
| More than one possible term | Ask which term the patient means |
| Urgent or suitability signal | Existing urgent or assessment path |

This is feasible on Schema v1. It is not yet something policy can do on its own. **No A2 code until the three definitions are approved.**

### 7. Initial definition inventory (draft, unapproved)

Three terms only. Wording is a draft for the clinic-content review. The assistant must not use it until that review marks it approved.

| Term | Service id | Draft LT | Draft EN | Review |
|---|---|---|---|---|
| Dantų protezas | `prosthetics` | Dantų protezas yra dirbtinis gaminys, kuriuo atkuriamas prarastas dantis arba keli dantys. | A dental prosthesis is an artificial replacement for one or more missing teeth. | **Unapproved.** Clinic check: in Lithuanian, “protezas” often means a removable denture, while the mapped service also covers crowns and bridges. |
| Dantų implantas | `implants` | Dantų implantas yra į žandikaulį įsriegiamas dirbtinis šaknies pakaitalas, prie kurio vėliau tvirtinamas dantis. | A dental implant is an artificial tooth root placed in the jaw, to which a tooth is later attached. | **Unapproved.** |
| Kanalų gydymas | `root_canal` | Kanalų gydymas yra pažeisto danties šaknies vidaus gydymas, kad dantį būtų galima išsaugoti. | Root canal treatment treats the inside of a damaged tooth so the tooth can be kept. | **Unapproved.** |

**Acceptance examples (for later tests, not a build):**

| Ask | Expected once approved |
|---|---|
| `Kas yra dantų protezas?` | The prosthesis sentence. Not “Taip, klinikoje atliekamas…”. |
| `O kas tai yra?` immediately after that answer | The same sentence, if the reference matches this one term. |
| `Kas yra dantų implantas?` | The implant sentence. |
| `Kas yra kanalų gydymas?` | The root-canal sentence. |
| `Ar darote protezavimą?` | Capability sentence, unchanged. |
| `Ar man tinka protezas?` | Assessment, no definition. |

No further glossary terms until these three have been reviewed.

---

## A3 — Hygiene price and registration

**Status:** IMPLEMENTED LOCALLY — pending deploy and production check.

Only `professional_hygiene` uses the agreed hygienist note and the A4 hygiene registration link. That note replaces the generic dentist disclaimer. Other prices are unchanged.

Current reply: `Burnos higiena kainuoja 80–100 EUR` plus “galutinę kainą įvardins tik gydytojas.”

Aušra: that disclaimer does not fit hygiene. The €80–100 range stays. The price depends on complexity and oral condition. The hygienist clarifies it during the visit. The reply should also offer online registration.

**Deterministic exception:** only `professional_hygiene` replaces the generic dentist disclaimer. Every other price keeps “only the dentist will state the final fee.” The amount text stays `80–100 EUR`. The registration URL is the existing one. No other service gets this disclaimer or this link from the price path.

**Draft LT**

```
Burnos higiena kainuoja 80–100 EUR.

Kaina priklauso nuo burnos būklės ir procedūros sudėtingumo. Tikslią kainą vizito metu patikslina burnos higienistė.

Burnos higienai Jums patogiu laiku galite užsiregistruoti internetu:
https://dantuharmonija.lt/registracija/
```

**Draft EN**

```
Oral hygiene costs 80–100 EUR.

The price depends on your oral condition and how complex the visit is. The hygienist confirms the exact fee during the visit.

You can register for oral hygiene online at a time that suits you:
https://dantuharmonija.lt/registracija/
```

**Acceptance, once agreed and built:** `Kiek kainuoja burnos higiena?` and `How much is oral hygiene?` match those replies. An implant price still uses the dentist disclaimer and does not add the registration link.

---

## A4 — Booking language

**Status:** CLOSED / PROD VERIFIED 🔒 (2026-10-08).

Online registration leads with the link and does not add “Per WhatsApp vizito užregistruoti negaliu.” Contact-only bookings still open with that limitation and the phone number. That implant wording is inside the agreed A4 scope.

| Route | PROD |
|---|---|
| Hygiene LT / EN | Hygiene-specific sentence plus registration link |
| Orthodontist consultation LT / EN | Generic online-registration sentence plus link |
| Implant LT / EN | Phone route and WhatsApp limitation; no registration link |

Local tests for the wording passed before deploy. This smoke did not re-test the urgent path.

---

## Still open — do not implement

| Item | Why it stays open |
|---|---|
| **A1c** | Same pathway as website “Skubi pagalba”, or a different label? |
| **A1d** | Saturday 09:00–14:00 by prior registration is on the homepage and not in the assistant’s hours text. She has not confirmed it. |
| **N11** | What to say outside reception hours, or when nobody answers. |
| **A1 scope** | Confirmed examples only. Not every dental complaint. |

---

## Next sequence

| Workstream | Status | Next action |
|---|---|---|
| **A2** Definitions | Contract accepted; three draft terms; no code | Review LT/EN wording and approve definitions |
| **A4** Registration language | **CLOSED / PROD VERIFIED** 🔒 2026-10-08 | None |
| **A3** Hygiene pricing | Implemented locally | Deploy, then verify LT/EN hygiene price in production |
| **A1** First aid | Partially confirmed | Keep unresolved boundaries open |
| **A1c, A1d, N11** | Open | No implementation |

No additional glossary terms. No A2 code until those definitions are approved. No A1 expansion.
