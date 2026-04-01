import { describe, expect, it } from "vitest";
import { classifyIntent } from "../services/classifier";
import { knowledgeService } from "../services/knowledgeService";

describe("classifier", () => {
  const services = knowledgeService.getServices();

  it("classifies clinic_hours", () => {
    expect(classifyIntent("Kokios darbo valandos?", services).intent).toBe("clinic_hours");
  });

  it("classifies clinic_location", () => {
    expect(classifyIntent("Koks jusu adresas?", services).intent).toBe("clinic_location");
  });

  it("classifies clinic_location for diacritic Kur jus randates (manual pack)", () => {
    expect(classifyIntent("Kur jus randatės?", services).intent).toBe("clinic_location");
  });

  it("classifies clinic_location for Google Maps / directions phrasing", () => {
    expect(classifyIntent("Can you send a Google Maps link?", services).intent).toBe("clinic_location");
  });

  it("classifies clinic_location for Kaip jus rasti", () => {
    expect(classifyIntent("Kaip jus rasti?", services).intent).toBe("clinic_location");
  });

  it("classifies booking_request", () => {
    expect(classifyIntent("I need appointment tomorrow", services).intent).toBe("booking_request");
  });

  it("prioritizes clinical over booking_request", () => {
    expect(classifyIntent("skauda dantis ir reikia vizito", services).intent).toBe("clinical_or_urgent");
  });

  it("classifies parking", () => {
    expect(classifyIntent("Ar yra parkingas?", services).intent).toBe("parking");
  });

  it("classifies contact", () => {
    expect(classifyIntent("Koks jusu telefonas ir email?", services).intent).toBe("contact");
  });

  it("classifies service_info with service id", () => {
    const result = classifyIntent("Noriu daugiau apie implantus", services);
    expect(result.intent).toBe("service_info");
    expect(result.serviceId).toBe("implants");
  });

  it("classifies price_info with service id", () => {
    const result = classifyIntent("Kokia implantu kaina?", services);
    expect(result.intent).toBe("price_info");
    expect(result.serviceId).toBe("implants");
  });

  it("classifies language_switch", () => {
    expect(classifyIntent("Can we continue in English?", services).intent).toBe("language_switch");
  });

  it("classifies clinical_or_urgent", () => {
    expect(classifyIntent("Man stiprus skausmas ir kraujuoja", services).intent).toBe("clinical_or_urgent");
  });

  it("returns unknown for unmatched input", () => {
    expect(classifyIntent("asdkjhasd qweoiu zxcmn", services).intent).toBe("unknown");
  });

  it("classifies assistant meta questions as assistant_capabilities", () => {
    expect(classifyIntent("What can you do?", services).intent).toBe("assistant_capabilities");
    expect(classifyIntent("What language do you speak?", services).intent).toBe("assistant_capabilities");
    expect(classifyIntent("Kuo galite padeti?", services).intent).toBe("assistant_capabilities");
  });

  it("prioritizes urgent over other intents", () => {
    const result = classifyIntent("Kokia implantu kaina? Severe pain now", services);
    expect(result.intent).toBe("clinical_or_urgent");
  });

  it("classifies clinical phrases in English", () => {
    expect(classifyIntent("Im in a lot of pain", services).intent).toBe("clinical_or_urgent");
    expect(classifyIntent("My gum is swollen", services).intent).toBe("clinical_or_urgent");
    expect(classifyIntent("Child has tooth pain", services).intent).toBe("clinical_or_urgent");
    expect(classifyIntent("Possible infection in gum", services).intent).toBe("clinical_or_urgent");
  });

  it("classifies booking_request with registracijos inflection", () => {
    expect(classifyIntent("Noriu registracijos rytoj", services).intent).toBe("booking_request");
  });

  it("classifies first_appointment_prep", () => {
    expect(classifyIntent("What should I bring to my first appointment?", services).intent).toBe(
      "first_appointment_prep"
    );
    expect(classifyIntent("What should I bring first time?", services).intent).toBe("first_appointment_prep");
    expect(classifyIntent("How early should I arrive?", services).intent).toBe("first_appointment_prep");
    expect(classifyIntent("I have a first appointment coming up", services).intent).toBe("first_appointment_prep");
    expect(classifyIntent("First appointment", services).intent).toBe("first_appointment_prep");
  });

  it("classifies first_visit_expectations before service_info", () => {
    expect(classifyIntent("What happens at first visit?", services).intent).toBe("first_visit_expectations");
    expect(classifyIntent("What happens during the first visit?", services).intent).toBe("first_visit_expectations");
    expect(classifyIntent("Will I get a treatment plan at my first visit?", services).intent).toBe(
      "first_visit_expectations"
    );
  });

  it("classifies broad price list without dumping service prices", () => {
    expect(classifyIntent("What are your prices?", services)).toEqual({
      intent: "price_info",
      broadPriceList: true
    });
    expect(classifyIntent("Kokia implantu kaina?", services).intent).toBe("price_info");
  });

  it("classifies comparative price questions as broad price guidance", () => {
    expect(classifyIntent("Which is cheaper veneers or filling?", services)).toEqual({
      intent: "price_info",
      broadPriceList: true
    });
    expect(classifyIntent("Kas pigiau implantai ar tiltas?", services)).toEqual({
      intent: "price_info",
      broadPriceList: true
    });
    expect(classifyIntent("how much veneers vs filling", services)).toEqual({
      intent: "price_info",
      broadPriceList: true
    });
  });

  it("classifies informal location and compressed first-visit phrasing", () => {
    expect(classifyIntent("where u located send pin", services).intent).toBe("clinic_location");
    expect(classifyIntent("kur jus", services).intent).toBe("clinic_location");
    expect(classifyIntent("atsiusk pin", services).intent).toBe("clinic_location");
    expect(classifyIntent("first time what need bring", services).intent).toBe("first_appointment_prep");
    expect(classifyIntent("pirma karta ka reikia", services).intent).toBe("first_appointment_prep");
  });

  it("LT kiek shorthand and comparative pigiau+ar route to price correctly", () => {
    expect(classifyIntent("kiek implantas?", services)).toMatchObject({ intent: "price_info", serviceId: "implants" });
    expect(classifyIntent("ar pigiau implantai ar breketai", services)).toEqual({
      intent: "price_info",
      broadPriceList: true
    });
  });

  it("escalates LT ar geriau / ar verta comparative suitability", () => {
    expect(classifyIntent("Ar implantai geriau nei tiltas?", services).intent).toBe("clinical_or_urgent");
    expect(classifyIntent("implantai ar verta", services).intent).toBe("clinical_or_urgent");
  });

  it("classifies ar darote as service_info with availability flag when service known", () => {
    expect(classifyIntent("Ar darote balinima?", services)).toMatchObject({
      intent: "service_info",
      serviceId: "teeth_whitening",
      serviceAvailabilityYesNo: true
    });
  });

  it("kaip vyksta pirmas vizitas is expectations not prep", () => {
    expect(classifyIntent("Kaip vyksta pirmas vizitas?", services).intent).toBe("first_visit_expectations");
  });

  it("classifies price slang with service as price_info", () => {
    const r = classifyIntent("cheap braces?", services);
    expect(r.intent).toBe("price_info");
    expect(r.broadPriceList).toBeUndefined();
    expect(r.serviceId).toBeDefined();
    expect(classifyIntent("pigus breketai?", services).intent).toBe("price_info");
  });

  it("escalates decision-seeking treatment questions instead of service_info", () => {
    expect(classifyIntent("Do I need root canal?", services).intent).toBe("clinical_or_urgent");
    expect(classifyIntent("Which is better veneers or filling?", services).intent).toBe("clinical_or_urgent");
    expect(classifyIntent("Ar man reikia kanalu gydymo?", services).intent).toBe("clinical_or_urgent");
    expect(classifyIntent("Should I get veneers?", services).intent).toBe("clinical_or_urgent");
    expect(classifyIntent("Is whitening right for me?", services).intent).toBe("clinical_or_urgent");
    expect(classifyIntent("Do I need braces?", services).intent).toBe("clinical_or_urgent");
  });

  it("does not treat administrative do i need to as clinical decision", () => {
    expect(classifyIntent("How much do I need to pay?", services).intent).toBe("price_info");
  });

  it("classifies about_clinic with focus", () => {
    expect(classifyIntent("Tell me about your clinic", services)).toEqual({
      intent: "about_clinic",
      aboutFocus: "default"
    });
    expect(classifyIntent("Do you treat children at your clinic?", services)).toEqual({
      intent: "about_clinic",
      aboutFocus: "family"
    });
    expect(classifyIntent("Are your doctors qualified?", services)).toEqual({
      intent: "about_clinic",
      aboutFocus: "team"
    });
    expect(classifyIntent("Is everything under one roof?", services)).toEqual({
      intent: "about_clinic",
      aboutFocus: "fullService"
    });
    expect(classifyIntent("Learn about your clinic", services)).toEqual({
      intent: "about_clinic",
      aboutFocus: "default"
    });
    expect(classifyIntent("Tell me about you", services)).toEqual({
      intent: "about_clinic",
      aboutFocus: "default"
    });
    expect(classifyIntent("What kind of clinic are you?", services)).toEqual({
      intent: "about_clinic",
      aboutFocus: "default"
    });
  });
});
