import { describe, expect, it } from "vitest";
import { buildResponse } from "../services/responseBuilder";

describe("responseBuilder", () => {
  it("builds Lithuanian clinic_hours response", () => {
    const result = buildResponse("lt", { intent: "clinic_hours" });
    expect(result.intent).toBe("clinic_hours");
    expect(result.language).toBe("lt");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Musu darbo laikas");
  });

  it("builds English clinic_location response", () => {
    const result = buildResponse("en", { intent: "clinic_location" });
    expect(result.intent).toBe("clinic_location");
    expect(result.language).toBe("en");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Our address");
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
    expect(result.reply).toContain("email");
  });

  it("builds booking_request response without booking action", () => {
    const resultLt = buildResponse("lt", { intent: "booking_request" });
    expect(resultLt.intent).toBe("booking_request");
    expect(resultLt.escalated).toBe(false);
    expect(resultLt.reply).toContain("neuzsakau");
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
    expect(result.reply).toContain("Dantu implantacija");
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
    expect(result.reply).toContain("negaliu vertinti klinikines bukles");
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

  it("builds generic service_info when no specific service id", () => {
    const result = buildResponse("en", { intent: "service_info" });
    expect(result.intent).toBe("service_info");
    expect(result.escalated).toBe(false);
    expect(result.reply).toContain("Main services offered");
    expect(result.reply).toContain("https://");
  });
});
