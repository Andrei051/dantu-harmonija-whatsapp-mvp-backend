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

  it("prioritizes urgent over other intents", () => {
    const result = classifyIntent("Kokia implantu kaina? Severe pain now", services);
    expect(result.intent).toBe("clinical_or_urgent");
  });
});
