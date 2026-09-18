# DH WhatsApp Assistant — Foundation v1 (Knowledge for clinic review)

**Status:** Structure READY FOR CLINIC REVIEW — **not approved**; knowledge content still requires Aušra / Marius sign-off  
**Date:** 2026-09-17  
**Source:** Current bot knowledge files in `src/data/` (as deployed; implementation frozen pending clinic review)  
**Paired with:** `DH-WhatsApp-Behaviour-Scope-v1.md` (behaviour LIVE VERIFIED)

| Gate | State |
|---|---|
| Foundation structure assembled from live KB | READY FOR CLINIC REVIEW ✅ |
| Clinic approval of Foundation facts | Pending |
| Behaviour + Foundation approval package | Pending clinic review |
| Patient QR pilot | **Not opened** — Foundation approval is required, not only behavioural fidelity |

Live verification of Behaviour does **not** mean this Foundation is approved or that the assistant is ready for patients.

---

## How to use this document

This is the **human-readable mirror** of what the WhatsApp assistant is allowed to treat as fact today.

| | |
|---|---|
| **Please do** | Confirm, correct, or remove each item |
| **Please do not assume** | That text is correct only because it came from the website or an older export |
| **Why** | The address correction (1A-9 → **1A-24**) showed that clinic approval is required |

After your review, Behaviour & Scope v1 + this Foundation v1 become the **two-document approval package**.

Mark each section: **Approve** / **Correct** / **Remove**.

---

## 1. Clinic profile

| Field | Lithuanian (as in bot) | English (as in bot) | Clinic decision |
|---|---|---|---|
| Clinic name | Dantu Harmonija | Dantu Harmonija | ☐ Approve ☐ Correct ☐ Remove |
| Address | Olimpiečių g. 1A-24, LT-09235 Vilnius | Olimpiečių g. 1A-24, LT-09235 Vilnius | ☐ Approve ☐ Correct ☐ Remove |
| Google Maps link | https://www.google.com/maps/search/?api=1&query=Olimpieciu+g.+1A-24+Vilnius | (same) | ☐ Approve ☐ Correct ☐ Remove |
| Working hours | Darbo dienomis 08:00–20:00, šeštadieniais 09:00–14:00 (tik su išankstine registracija), sekmadieniais nedirbama | Weekdays 08:00-20:00, Saturdays 09:00-14:00 (by prior registration), Sundays closed | ☐ Approve ☐ Correct ☐ Remove |
| Website | https://dantuharmonija.lt/ | (same) | ☐ Approve ☐ Correct ☐ Remove |
| Email | klinika@dantuharmonija.lt | (same) | ☐ Approve ☐ Correct ☐ Remove |
| Phone | +370 610 11 222 / (8-5) 27 222 11 | (same) | ☐ Approve ☐ Correct ☐ Remove |
| Parking | Prie pagrindinio įėjimo yra nemokama 5 vietų automobilių aikštelė. Taip pat yra mokamų parkavimo vietų netoliese. | There is a free 5-space parking area at the main entrance. Paid parking options are also available nearby. | ☐ Approve ☐ Correct ☐ Remove |

**Note:** Address **1A-24** was confirmed live by Aušra (2026-09-17). Still include in Foundation approval so the whole profile is signed off together.

---

## 2. Services

Short descriptions the bot may return when a service is recognised.  
*(Keywords used for matching are technical; not listed here for clinic review.)*

| # | LT name | EN name | LT description | EN description | Decision |
|---|---|---|---|---|---|
| 1 | Profesionali burnos higiena | Professional oral hygiene | Burnos higienos paslauga atliekama klinikoje kaip dantų gydymo priežiūros dalis. | Oral hygiene service provided in the clinic as part of dental care. | ☐ A ☐ C ☐ R |
| 2 | Dantų implantacija | Dental implants | Dantų implantavimo paslaugos, įskaitant skirtingas implantų sistemas pagal klinikos teikiamą informaciją. | Dental implant services, including different implant systems listed by the clinic. | ☐ A ☐ C ☐ R |
| 3 | Ortodontinis gydymas / dantų tiesinimas | Orthodontic treatment / teeth straightening | Ortodontinio gydymo paslaugos, įskaitant dantų tiesinimą breketais ir aligneriais. | Orthodontic treatment services, including teeth alignment with braces and aligners. | ☐ A ☐ C ☐ R |
| 4 | Dantų balinimas | Teeth whitening | Kosmetinė procedūra dantų spalvai šviesinti; gali būti kapomis arba klinikoje atliekamu gydymu. | Cosmetic procedure to lighten tooth colour; can use trays or in-clinic treatment. | ☐ A ☐ C ☐ R |
| 5 | Fizioterapija / žandikaulio terapija | Physiotherapy / jaw therapy | Padeda esant žandikaulio skausmui, įtempimui, spragtelėjimui; gerina raumenų funkciją. | Helps with jaw pain, tension, clicking; improves muscle function. | ☐ A ☐ C ☐ R |
| 6 | Vaikų odontologija | Paediatric dentistry | Dantų priežiūra ir gydymas vaikams. | Dental care and treatment for children. | ☐ A ☐ C ☐ R |
| 7 | Konsultacijos ir diagnostika | Consultations and diagnostics | Naudojama įvertinti burnos sveikatą ir sudaryti gydymo planą. | Used to assess dental condition and create a treatment plan. | ☐ A ☐ C ☐ R |
| 8 | Plombavimas / estetinis plombavimas | Fillings / aesthetic fillings | Dantų audinių atkūrimas kompozitinėmis medžiagomis, įskaitant estetinį plombavimą priekiniams dantims. | Restoring teeth with composite materials, including aesthetic fillings for front teeth. | ☐ A ☐ C ☐ R |
| 9 | Dantų kanalų gydymas | Root canal treatment | Šaknies kanalų gydymas, siekiant išsaugoti dantį. | Endodontic treatment to save the tooth. | ☐ A ☐ C ☐ R |
| 10 | Dantų šalinimas | Tooth extraction | Paprastas ar chirurginis dantų šalinimas. | Simple or surgical tooth removal. | ☐ A ☐ C ☐ R |
| 11 | Dantų laminatai / veneeriai | Dental veneers | Plonos plokštelės priekiniams dantims estetikai. | Thin shells for front teeth aesthetics. | ☐ A ☐ C ☐ R |
| 12 | Periodontologija | Periodontics | Dantenų ir implantų priežiūra. | Care of gums and supporting tissues. | ☐ A ☐ C ☐ R |
| 13 | Protezavimas | Prosthetic restoration | Vainikeliai, tiltai, protezai. | Crowns, bridges, dentures. | ☐ A ☐ C ☐ R |
| 14 | Nuskausminimas | Anaesthesia | Vietiniai ir bendrieji nuskausminimai procedūrų metu komfortui užtikrinti. | Local and general anaesthesia used to ensure comfort during procedures. | ☐ A ☐ C ☐ R |
| 15 | Dantų laboratorija | Dental laboratory | Klinikoje veikianti dantų laboratorija leidžia greičiau ir tiksliau paruošti sprendimus. | In-house dental laboratory enables faster and more customised dental solutions. | ☐ A ☐ C ☐ R |

**Gap to note:** “Dantų laboratorija” has a service entry but **no price row** in the current knowledge base.

---

## 3. Prices

All amounts are presented as **indicative**. Standard note attached to each priced service:

> LT: *Pateikiamos kainos yra orientacinės. Tikslią kainą gydytojas pasako po individualios konsultacijos.*  
> EN: *Prices are indicative. The exact fee is confirmed by the doctor after an individual consultation.*

| Service | LT amount text | EN amount text | Decision |
|---|---|---|---|
| Profesionali burnos higiena | 80-100 EUR | 80-100 EUR | ☐ A ☐ C ☐ R |
| Dantų implantacija | nuo 860 EUR | from 860 EUR | ☐ A ☐ C ☐ R |
| Ortodontinis gydymas | Konsultacija: 50–80 EUR; metaliniai breketai: nuo 750 EUR / žandikaulį; kapos (aligneriai): apie 4000–5000 EUR | Consultation: 50-80 EUR; metal braces: from 750 EUR per jaw; aligners: approx. 4000-5000 EUR | ☐ A ☐ C ☐ R |
| Dantų balinimas | Kapomis balinimas: 200 EUR; Zoom balinimas: 299 EUR; Post-op kapomis: 100 EUR | Teeth whitening (trays): 200 EUR; Zoom whitening: 299 EUR; Post-op trays: 100 EUR | ☐ A ☐ C ☐ R |
| Fizioterapija / žandikaulio terapija | Konsultacija: 75 EUR; TMJ gydymas: 65 EUR; miofunkcinė terapija: 55 EUR | Consultation: 75 EUR; TMJ treatment: 65 EUR; Myofunctional therapy: 55 EUR | ☐ A ☐ C ☐ R |
| Vaikų odontologija | Konsultacija vaikams: 40–50 EUR; gydymas priklauso nuo procedūros (pvz. plombavimas 60–120 EUR) | Children's consultation: 40-50 EUR; treatment depends on procedure (e.g. fillings often 60-120 EUR) | ☐ A ☐ C ☐ R |
| Konsultacijos ir diagnostika | Konsultacija: 50 EUR; Rentgeno nuotrauka: 10 EUR; Panoraminis rentgenas: 30 EUR; KT: 100 EUR | Consultation: 50 EUR; X-ray: 10 EUR; Panoramic X-ray: 30 EUR; CT scan: 100 EUR | ☐ A ☐ C ☐ R |
| Plombavimas / estetinis plombavimas | Kompozitinis plombavimas: dažniausiai 60–150 EUR už paviršių; estetinis priekinis: apie 50–120 EUR (priklauso nuo danties) | Composite fillings: typically 60–150 EUR per surface; aesthetic anterior fillings: approx. 50–120 EUR (depends on tooth) | ☐ A ☐ C ☐ R |
| Dantų kanalų gydymas | nuo 150 EUR iki 400 EUR, priklausomai nuo danties ir sudėtingumo | from 150 EUR to 400 EUR depending on tooth and complexity | ☐ A ☐ C ☐ R |
| Dantų šalinimas | Paprastas šalinimas: nuo 50 EUR; chirurginis: nuo 150 EUR | Simple extraction: from 50 EUR; surgical: from 150 EUR | ☐ A ☐ C ☐ R |
| Veneeriai / laminatai | nuo 300 EUR uz danti (orientacines) | from 300 EUR per tooth (indicative) | ☐ A ☐ C ☐ R |
| Periodontologija | Profesionali burnos higiena / skalinimas: nuo 80 EUR; gydymas pagal dantenų būklę (orientacinės) | Professional cleaning/scaling: from 80 EUR; treatment depends on gum condition (indicative) | ☐ A ☐ C ☐ R |
| Protezavimas | Vainikelis: nuo 350 EUR; tiltas: nuo 600 EUR; protezas: nuo 900 EUR (orientacinės) | Crown: from 350 EUR; bridge: from 600 EUR; denture: from 900 EUR (indicative) | ☐ A ☐ C ☐ R |
| Nuskausminimas | Vietiniai nuskausminimai: 10–15 EUR; bendroji narkozė: 150–550 EUR | Local anaesthesia: 10-15 EUR; General anaesthesia: 150-550 EUR | ☐ A ☐ C ☐ R |

### When the patient asks about price without naming a service

Bot may say:

> LT: *Kainos priklauso nuo paslaugos ir individualios situacijos. Paklauskite konkrečios procedūros arba peržiūrėkite klinikos svetainę.* (+ indicative note)  
> EN: *Fees depend on the service and your individual situation. Ask about a specific treatment or see the clinic website.* (+ indicative note)

☐ Approve ☐ Correct ☐ Remove

---

## 4. First visit

### Before the appointment

| LT | EN | Decision |
|---|---|---|
| Pirmam vizitui: atvykite 10–15 min. anksčiau. Atsineškite tapatybės dokumentą. Ruoškite klausimus iš anksto. | For your first visit: arrive 10-15 minutes early. Bring a valid identity document. Prepare any questions in advance. | ☐ A ☐ C ☐ R |

### What to expect at the visit

| LT | EN | Decision |
|---|---|---|
| Registratūroje užpildote anketą ir pasirašote sutartį; gali būti prašoma susipažinti su klinikos taisyklėmis. Gydytojas atlieka apžiūrą. Jei reikia, skiriama diagnostika. Gydymo variantai ir kainos aptariamos po įvertinimo. Galutinis gydymo planas ir kaina priklauso nuo individualios konsultacijos po apžiūros. | At reception you complete a questionnaire and sign the service agreement; you may be asked to read the clinic rules. The dentist performs an examination. Diagnostics may be prescribed if needed. Treatment options and prices are discussed after assessment. The exact treatment plan and fees depend on an individual consultation after examination. | ☐ A ☐ C ☐ R |

---

## 5. About the clinic

| Theme | LT | EN | Decision |
|---|---|---|---|
| Summary | Stomatologijos klinika su patyrusiais specialistais; visapusė dantų priežiūra vienoje vietoje; naudojama moderni įranga ir taikomi gydymo metodai. | Dental clinic with experienced specialists, comprehensive dental care in one place, using modern equipment and treatment methods. | ☐ A ☐ C ☐ R |
| Family care | Teikiame dantų priežiūrą suaugusiems ir vaikams. | We provide dental care for both adults and children. | ☐ A ☐ C ☐ R |
| Full service | Skirtingų sričių specialistai ir klinikos laboratorija — visą gydymo grandinę galima užbaigti vienoje vietoje. | Multiple specialists and an in-house lab—full treatment pathway in one place. | ☐ A ☐ C ☐ R |
| Team | Kvalifikuoti specialistai tiek paprastiems, tiek sudėtingesniems atvejams. | A team of qualified dental specialists for both routine and complex cases. | ☐ A ☐ C ☐ R |

---

## 6. Contact, booking, and handoff wording

### Contact (general)

Bot may share website, phone, and email from the clinic profile (section 1).

### Contact (specific doctor)

> LT: *Klinikoje dirba įvairių sričių specialistai. Dėl konkretaus gydytojo rekomenduojame susisiekti su klinika:* (+ contact lines)  
> EN: *The clinic has specialists in several areas. For a specific dentist, please contact the clinic:* (+ contact lines)

☐ Approve ☐ Correct ☐ Remove

### Booking / registration (assistant cannot book — contact redirect)

> LT: *Per šį kanalą vizitų registruoti negaliu. Registruokitės arba susisiekite su klinika įprastu būdu:* (+ website, phone, email)  
> EN: *I can't register visits through this channel. To schedule a visit, please follow the clinic's usual process:* (+ website, phone, email)

This is a **contact redirect**, not Option C. Do not imply a WhatsApp team reply.

FAQ equivalent:

> LT: *Aš galiu suteikti informaciją ir nukreipti, bet vizitų neregistruoju.*  
> EN: *I can provide information and guidance, but I do not perform bookings.*

☐ Approve ☐ Correct ☐ Remove

### Availability (no slots — contact redirect)

> LT: *Laisvų laikų per šį kanalą pasakyti negaliu. Dėl terminų susisiekite su klinika:* (+ contact)  
> EN: *I can't provide available appointment times through this channel. Please contact the clinic for scheduling:* (+ contact)

☐ Approve ☐ Correct ☐ Remove

### Insufficient price context (clarify, do not escalate)

> LT: *Kokios paslaugos kainą norėtumėte sužinoti?*  
> EN: *Which service's price would you like to know?*

☐ Approve ☐ Correct ☐ Remove

### Capability (what the assistant says it can help with)

> LT: *Galiu padėti su bendra informacija apie kliniką — paslaugas, kainas, vietą ir pirmo vizito eigą. Dėl medicininių klausimų jums atsakys klinikos komanda.*  
> EN: *I can help with general information about the clinic — services, prices, location, and what to expect during your visit. For medical advice, a team member will assist you.*

☐ Approve ☐ Correct ☐ Remove

### First-message framing (prepended once per patient; skipped if the reply is already the capability greeting)

> LT: *Galiu padėti su informacija apie paslaugas, kainas ir kliniką. Dėl registracijos ar gydymo klausimų susisiekite su klinika.*  
> EN: *I can help with information about services, prices, and the clinic. For bookings or medical questions, please contact the clinic directly.*

☐ Approve ☐ Correct ☐ Remove  
*(See also Behaviour & Scope note on whether this should appear on simple location answers.)*

### When the question is outside knowledge / needs the team (Option C)

Pipeline / logs may use:

> LT: *Ačiū už žinutę. Kol kas galiu atsakyti tik pagal oficialią klinikos informaciją. Jei klausimas sudėtingesnis, perduosiu jį komandos nariui.*  
> EN: *Thanks for your message. I currently answer only from official clinic information. If your question is more complex, I will route it to a team member.*

**WhatsApp Option C body** (only when escalated — team follow-up expected):

> LT: *Ačiū už žinutę. Komandos narys peržiūrės pranešimą ir atsakys artimiausiu metu.*  
> EN: *Thanks for your message. A team member will review it and get back to you soon.*

**Governance:** Use team acknowledgement only when a clinic-team WhatsApp follow-up workflow exists. Contact redirects must not use this copy.

☐ Approve ☐ Correct ☐ Remove

### Clinical / urgent safety path

> LT: *Apgailestauju, tačiau negaliu vertinti klinikinės būklės. Dėl skubios ar klinikinės situacijos prašome nedelsiant susisiekti su klinika telefonu arba kreiptis į skubią pagalbą.*  
> EN: *I am sorry, but I cannot assess clinical conditions. For urgent or clinical situations, please contact the clinic by phone immediately or seek emergency care.*

☐ Approve ☐ Correct ☐ Remove

### Language switch

> LT: *Galiu tęsti lietuviškai arba angliškai. Parašykite, kuria kalba patogiau.*  
> EN: *I can continue in Lithuanian or English. Please tell me which language you prefer.*

☐ Approve ☐ Correct ☐ Remove

---

## 7. Explicitly not in Foundation v1

These are **out of scope** for this knowledge set (aligns with Behaviour & Scope):

- Doctor roster / named clinician bios  
- Appointment availability or calendar  
- Clinical recommendations or diagnosis  
- Full website / article content  
- Anything not listed above  

Adding such content later = **coverage expansion**, only after Foundation v1 is approved.

---

## Clinic sign-off

| | Name | Date | Notes |
|---|---|---|---|
| Reviewed by | | | |
| Approved as Foundation v1 | | | |
| Corrections attached | ☐ Yes ☐ No | | |

Once signed: Behaviour & Scope v1 + Foundation v1 = **clinic approval package** for limited live use readiness.
