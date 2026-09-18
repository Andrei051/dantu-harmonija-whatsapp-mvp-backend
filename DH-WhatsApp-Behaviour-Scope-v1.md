# DH WhatsApp Assistant — Behaviour & Scope v1

**Status:** Implementation LIVE VERIFIED against this document — ready for clinic review (Aušra / Marius)  
**Date:** 2026-09-17  
**Audience:** Clinic leadership (non-technical)  
**Implementation freeze:** No further product changes from our side until clinic correction or a genuine acceptance defect.

| Gate | State |
|---|---|
| Behaviour v1 implemented as specified | LIVE VERIFIED ✅ |
| Automated tests | 127/127 ✅ |
| Production smoke (greeting, location 1A-24, named-doctor booking, price+availability, bare price clarify, standard price) | PASS ✅ |
| Clinic approval of Behaviour & Scope | Pending |
| Patient QR pilot | **Not opened** — requires clinic approval of Behaviour + Foundation |

This document describes how the live assistant behaves today. Approving it means approving that behaviour — not an aspiration.

---

## Purpose

The assistant is a first-line information channel for Dantų Harmonija patients. Its purpose is to answer common informational questions quickly and direct patients to the clinic team when human involvement is required.

**This is not a medical chatbot or booking system.**

---

## What the assistant will answer

- Clinic location, contact details and opening hours  
- Information about services covered by its knowledge base  
- Published prices covered by its knowledge base  
- General information about the clinic  
- First-visit / appointment preparation information  
- Basic questions about what the assistant can help with  
- Lithuanian and English  

Answers come **only** from **Foundation v1** knowledge (clinic-approved). Nothing outside that set is treated as answerable fact.

---

## What the assistant will not do

- Diagnose symptoms or conditions  
- Provide clinical or treatment advice  
- Recommend a treatment for an individual patient  
- Book, change or cancel appointments  
- Provide appointment availability  
- Invent or estimate information that is not in its knowledge base  

---

## When the clinic team takes over

Two different paths — do not conflate them:

1. **Contact redirect** (no WhatsApp human queue): booking, availability, or “please use clinic channels.” The assistant gives website / phone / email and does **not** say a team member will review the WhatsApp message.  
2. **Team escalation (Option C)**: only when the message enters a workflow where clinic-team follow-up on WhatsApp is expected (today: unknown / unreliable questions, and clinical/urgent safety path). Only then may the assistant acknowledge that a team member will review the message.

**Governance:** Team acknowledgement is used only when follow-up is genuinely expected. Contact redirects must never imply that a team member has received or will review the enquiry.

When a patient wants to book, asks about availability, needs clinical advice, or asks something the assistant cannot reliably answer, the assistant should clearly say clinic-team involvement is required and **either** redirect to contact channels **or** escalate — whichever matches the path above.

---

## Conversation behaviour

- A simple greeting should receive a simple welcome/capability response (not Option C).  
- Booking intent takes priority over general service information.  
- A named doctor + booking request should be treated as a booking request (contact redirect), not merely as a question about the associated service.  
- Mixed questions: answer a supported component where it can be identified reliably, then handle the unsupported/action component with contact redirect (e.g. approved price, then availability needs the clinic).  
- The assistant should never pretend to know appointment availability.  
- If context is insufficient — e.g. “How much does it cost?” without a clearly identifiable service — ask which service before sending the patient away.  
- Clinical/urgent questions always follow the safety/handoff path (Option C allowed).  

---

## First interaction

The patient's first response should briefly explain what the assistant can help with and make clear that registration or treatment-related questions may require the clinic team.

**Observation for acceptance (not a code change yet):** On a simple location question, the one-time capability intro (two short paragraphs) can make the reply feel heavier than needed. Review whether first-interaction framing should stay prepended to every first answer, or only greetings / unknown — decide during Behaviour & Scope / acceptance, not as an ad-hoc fix.

---

## Knowledge principle

The assistant answers only from the clinic information included in its agreed knowledge base (**Foundation v1**). If information is absent or uncertain, it should not invent an answer.

---

## Success criterion (for this phase)

Ready for **limited live use** when:

1. **Behaviour & Scope v1** is approved by the clinic, and  
2. **Foundation v1** knowledge is approved by the clinic.  

Coverage expansion and any later AI layer come **after** those approvals.
