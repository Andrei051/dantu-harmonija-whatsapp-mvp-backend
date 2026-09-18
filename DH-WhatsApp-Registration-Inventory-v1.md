# Online registration inventory — dantuharmonija.lt/registracija/

**Date:** 2026-09-18  
**URL:** https://dantuharmonija.lt/registracija/  
**Purpose:** What the WhatsApp assistant may safely claim is bookable online (no system reverse-engineering).  
**Source:** Live page inspection (service list as shown to patients).

---

## Clinic comment (returned review)

Assistant may redirect to online registration for:

- **Konsultacija pas specialistus**
- **Higiena**

Exact selectable options on the live form are more specific (below). Treat Aušra’s phrase as the **policy intent**; treat this inventory as the **safe claim set**.

---

## Flow (patient-facing)

1. Choose service  
2. Choose doctor  
3. Choose date and time  
4. Patient information  
5. Payment step (page UI includes payment; assistant should not describe payment mechanics)

**Urgent care:** labelled *Skubi pagalba (7:45–20:00)* but instructions say contact **by phone** during working hours — **not** an online self-booking claim for the assistant.

---

## Selectable services (live list)

| # | Service as shown on registration page | Listed fee on form |
|---|---|---|
| 1 | Konsultacija gydytojos ortodontės E.Bučinskienės | 80 € |
| 2 | Gydytojo ortodonto konsultacija | 50 € |
| 3 | Implantuojančio gydytojo konsultacija (įskaičiuota panoraminė nuotrauka) | 80 € |
| 4 | Konsultacija protezuojančio gydytojo | 50 € |
| 5 | Konsultacija gydytojo endodontologo | 50 € |
| 6 | Konsultacija dėl žandikaulio sąnario sutrikimų | 100 € |
| 7 | Konsultacija gydytojo periodontologo | 50 € |
| 8 | Vaikų gydytojo konsultacija | 70 € |
| 9 | Kineziterapeuto konsultacija | 75 € |
| 10 | Burnos higiena | 100 € |

Fees on the booking form are **display prices for that funnel**; Foundation price rule still prefers designated `/kainos/` source + preliminary disclaimer. Do not treat booking-form fees as a second permanent snapshot.

---

## Safe assistant claims

**May say / link:**

- Online registration is available at `https://dantuharmonija.lt/registracija/`
- Patients can book **specialist consultations** and **oral hygiene (Burnos higiena)** online there
- Optionally name that the page lists specific consultation types (orthodontist, implantologist, prosthodontist, endodontist, periodontologist, jaw-joint, paediatric, physiotherapist/kinesiotherapist, etc.) **without inventing availability**

**Must not say:**

- That the assistant itself books, changes, or cancels visits  
- That **all** clinic services / treatments are bookable online  
- That urgent care is booked online (phone only)  
- Specific free slots or doctor availability outside what the patient sees after opening the link  
- Lab / treatment procedures as online-bookable items (not on this list)

**Otherwise:** contact redirect (phone / email / WhatsApp handoff per Behaviour).

---

## Implication for Behaviour v1.1

Booking pathway =

1. Assistant never creates/changes/cancels appointments itself.  
2. If patient wants registration for **consultation / hygiene** (or asks how to book online) → direct to registration URL.  
3. Any other booking / change / cancel / slots → clinic contact or WhatsApp team path (monitored weekdays 08:00–17:00).
