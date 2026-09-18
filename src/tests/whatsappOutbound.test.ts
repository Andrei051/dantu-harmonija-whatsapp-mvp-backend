import { describe, expect, it } from "vitest";
import { getOutboundBodyOptionC } from "../services/whatsappOutbound";

describe("whatsappOutbound Option C", () => {
  it("returns full response when not escalated", () => {
    expect(getOutboundBodyOptionC(false, "lt", "Full reply text")).toBe("Full reply text");
  });

  it("urgent clinical: safety reply only — no Option C ack", () => {
    const clinical = "Pagal jūsų aprašymą reikėtų nedelsiant susisiekti su klinika telefonu +370 610 11222.";
    const body = getOutboundBodyOptionC(true, "lt", clinical, "clinical_or_urgent");
    expect(body).toBe(clinical);
    expect(body).not.toContain("Jūsų užklausą gavome");
  });

  it("urgent clinical EN: safety reply only — no Option C ack", () => {
    const clinical = "Based on what you described, please contact the clinic immediately on +370 610 11222.";
    const body = getOutboundBodyOptionC(true, "en", clinical, "clinical_or_urgent");
    expect(body).toBe(clinical);
    expect(body).not.toContain("We have received your enquiry");
  });

  it("returns only ack for unknown escalation", () => {
    const body = getOutboundBodyOptionC(
      true,
      "lt",
      "Kol kas galiu atsakyti tik pagal oficialią informaciją.",
      "unknown"
    );
    expect(body).not.toContain("oficialią informaciją");
    expect(body).toContain("Jūsų užklausą gavome");
    expect(body).toContain("17:00");
  });

  it("defaults to ack-only when escalated clinical but empty response", () => {
    const body = getOutboundBodyOptionC(true, "lt", "   ", "clinical_or_urgent");
    expect(body).toBeTruthy();
    expect(body).toContain("Jūsų užklausą gavome");
  });
});
