import { describe, expect, it } from "vitest";
import { buildResponse } from "../services/responseBuilder";

describe("responseBuilder", () => {
  it("builds Lithuanian clinic_hours response", () => {
    const result = buildResponse("lt", { intent: "clinic_hours" });
    expect(result.intent).toBe("clinic_hours");
    expect(result.language).toBe("lt");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Mūsų darbo laikas");
  });

  it("builds English clinic_location response", () => {
    const result = buildResponse("en", { intent: "clinic_location" });
    expect(result.intent).toBe("clinic_location");
    expect(result.language).toBe("en");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Our address");
    expect(result.reply).toContain("Google Maps");
    expect(result.reply).toContain("google.com/maps");
  });

  it("builds Lithuanian clinic_location with address and maps from KB", () => {
    const result = buildResponse("lt", { intent: "clinic_location" });
    expect(result.reply).toContain("Olimpiečių str. 1A-9");
    expect(result.reply).toContain("LT-09235");
    expect(result.reply).not.toContain("1A-24");
    expect(result.reply).toContain("Google Maps");
  });

  it("builds parking response", () => {
    const result = buildResponse("lt", { intent: "parking" });
    expect(result.intent).toBe("parking");
    expect(result.escalated).toBe(false);
  });

  it("builds contact response", () => {
    const result = buildResponse("en", { intent: "contact" });
    expect(result.intent).toBe("contact");
    expect(result.escalated).toBe(false);
    expect(result.reply.toLowerCase()).toContain("email");
  });

  it("builds booking_request response without booking action", () => {
    const resultLt = buildResponse("lt", { intent: "booking_request" });
    expect(resultLt.intent).toBe("booking_request");
    expect(resultLt.escalated).toBe(false);
    expect(resultLt.reply).toContain("neužsakau");
    expect(resultLt.reply).toContain("https://");

    const resultEn = buildResponse("en", { intent: "booking_request" });
    expect(resultEn.intent).toBe("booking_request");
    expect(resultEn.escalated).toBe(false);
    expect(resultEn.reply).toContain("do not book");
  });

  it("builds service_info response", () => {
    const result = buildResponse("lt", { intent: "service_info", serviceId: "implants" });
    expect(result.intent).toBe("service_info");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Dantų implantacija");
  });

  it("builds price_info response", () => {
    const result = buildResponse("en", { intent: "price_info", serviceId: "implants" });
    expect(result.intent).toBe("price_info");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Dental implants");
  });

  it("builds language_switch response", () => {
    const result = buildResponse("en", { intent: "language_switch" });
    expect(result.intent).toBe("language_switch");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Lithuanian or English");
  });

  it("escalates clinical_or_urgent in Lithuanian", () => {
    const result = buildResponse("lt", { intent: "clinical_or_urgent" });
    expect(result.intent).toBe("clinical_or_urgent");
    expect(result.escalated).toBe(true);
    expect(result.reply).toContain("negaliu vertinti klinikinės būklės");
  });

  it("escalates clinical_or_urgent in English", () => {
    const result = buildResponse("en", { intent: "clinical_or_urgent" });
    expect(result.intent).toBe("clinical_or_urgent");
    expect(result.escalated).toBe(true);
    expect(result.reply).toContain("cannot assess clinical conditions");
  });

  it("returns unknown fallback for unknown intent", () => {
    const result = buildResponse("lt", { intent: "unknown" });
    expect(result.intent).toBe("unknown");
    expect(result.escalated).toBe(true);
  });

  it("builds first_appointment_prep from knowledge", () => {
    const result = buildResponse("en", { intent: "first_appointment_prep" });
    expect(result.intent).toBe("first_appointment_prep");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("10-15");
  });

  it("builds first_visit_expectations from knowledge", () => {
    const result = buildResponse("lt", { intent: "first_visit_expectations" });
    expect(result.intent).toBe("first_visit_expectations");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Registratūroje");
  });

  it("builds about_clinic default and family focus", () => {
    const def = buildResponse("en", { intent: "about_clinic", aboutFocus: "default" });
    expect(def.reply).toContain("Dental clinic");

    const fam = buildResponse("en", { intent: "about_clinic", aboutFocus: "family" });
    expect(fam.reply).toContain("adults and children");
    expect(fam.reply.length).toBeLessThan(def.reply.length);
  });

  it("builds generic service_info when no specific service id", () => {
    const result = buildResponse("en", { intent: "service_info" });
    expect(result.intent).toBe("service_info");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Main services offered");
    expect(result.reply).toContain("https://");
  });

  it("builds assistant_capabilities reply without escalation", () => {
    const en = buildResponse("en", { intent: "assistant_capabilities" });
    expect(en.intent).toBe("assistant_capabilities");
    expect(en.escalated).toBe(false);
    expect(en.reply).toContain("general information");
    const lt = buildResponse("lt", { intent: "assistant_capabilities" });
    expect(lt.escalated).toBe(false);
    expect(lt.reply).toContain("kliniką");
  });

  it("prefixes Taip for LT service availability yes-no", () => {
    const result = buildResponse("lt", {
      intent: "service_info",
      serviceId: "teeth_whitening",
      serviceAvailabilityYesNo: true
    });
    expect(result.reply).toMatch(/^Taip, atliekame\. /);
    expect(result.reply).toContain("balinimas");
  });
});
