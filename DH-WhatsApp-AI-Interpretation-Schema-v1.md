# DH WhatsApp — AI Interpretation Schema v1

**Status:** **FROZEN** 🔒  
**Date:** 2026-09-18  
**Executable schema:** `data/DH-WhatsApp-AI-Interpretation-Schema-v1.json` (JSON Schema 2020-12)  
**Paired policy:** `DH-WhatsApp-AI-Signal-Policy-Mapping-v1.md`  
**Authority:** Phase 2 mandate — interpret language + resolve context only  

---

## Design locks

1. Schema answers only what **deterministic policy** needs.  
2. **Multi-intent** is first-class (`intents[]`), not a single forced `MessageIntent`.  
3. **`knowledge_gap_likely` is not an AI field.** Absence of clinic truth = Foundation retrieval miss → policy.  
4. **No `raw_notes`.** Free-text model reasoning is not a policy input; log separately in the eval harness if needed.  
5. **Confidence is captured, not thresholded.** No v1 rule such as “&lt;0.7 → Option C”. Inspect after offline runs.  

---

## Object shape

```text
schema_version: "1.0"
language: lt | en | mixed

intents[]:
  type
  confidence

service_or_topic: null | {
  id
  confidence
  source: current_message | conversation_context
}

signals:
  booking: none | soft | hard
  availability: boolean
  clinical_or_suitability: boolean
  unsupported_or_ambiguous: boolean

references[]:
  type
  resolved_to
  source_turn

overall_confidence: number 0..1
```

### Intent `type` vocabulary (v1)

`clinic_hours` · `clinic_location` · `parking` · `contact` · `booking` · `availability` · `service_info` · `price` · `first_appointment_prep` · `first_visit_expectations` · `about_clinic` · `assistant_capabilities` · `clinical` · `language_switch` · `other`

`other` + `unsupported_or_ambiguous=true` is preferred over inventing a clinic fact intent.

---

## Worked examples (normative intent)

### Price + availability (composable)

Patient: `Kokia implantų kaina? Kada turite laisvų laikų?`

```json
{
  "schema_version": "1.0",
  "language": "lt",
  "intents": [
    { "type": "price", "confidence": 0.92 },
    { "type": "availability", "confidence": 0.88 }
  ],
  "service_or_topic": {
    "id": "implants",
    "confidence": 0.95,
    "source": "current_message"
  },
  "signals": {
    "booking": "none",
    "availability": true,
    "clinical_or_suitability": false,
    "unsupported_or_ambiguous": false
  },
  "references": [],
  "overall_confidence": 0.9
}
```

Policy then runs **both** price retrieval and availability restriction — not a single winner intent.

### Clinical + booking (suppressive)

Patient: `Skauda dantį, noriu užsiregistruoti higienai`

```json
{
  "schema_version": "1.0",
  "language": "lt",
  "intents": [
    { "type": "clinical", "confidence": 0.9 },
    { "type": "booking", "confidence": 0.85 }
  ],
  "service_or_topic": {
    "id": "professional_hygiene",
    "confidence": 0.8,
    "source": "current_message"
  },
  "signals": {
    "booking": "hard",
    "availability": false,
    "clinical_or_suitability": true,
    "unsupported_or_ambiguous": false
  },
  "references": [],
  "overall_confidence": 0.86
}
```

Policy: clinical override **suppresses** ordinary booking → phone.

### Knowledge absence (not an AI “gap” claim)

Patient: reimbursement / insurance question.

AI may emit e.g. `intents: [{ type: "other" … }]` or a non-catalogue topic with `unsupported_or_ambiguous` only if the *ask* is unclear — preferably a recognisable informational ask without inventing clinic content.

**Foundation** lookup finds no authorised reimbursement fact → policy unsupported/handoff.

AI must **not** assert “the clinic doesn’t know this.”

---

## Out of contract

| Item | Where it lives |
|---|---|
| Whether Foundation has an answer | Deterministic retrieval |
| Route choice, Option C, registration eligibility | Policy mapping |
| Final patient-facing wording | Controlled response assembly / KB |
| Model raw completion, latency, model id | Eval harness logs |

---

## Conversation memory (experiment, not schema field)

Structured state *after* interpretation (e.g. `active_service`, `previous_intents`, `last_route`) is a **harness/runtime** concern for Phase 2B experiments — not part of this JSON object. Offline prototype may also pass prior turns to the model; production should prefer **minimum structured state** over indefinite transcript replay.

---

## Freeze

**Interpretation Schema v1 — FROZEN** 🔒  

Do not expand fields opportunistically during the first offline LLM prototype. Change only via a new schema version.
