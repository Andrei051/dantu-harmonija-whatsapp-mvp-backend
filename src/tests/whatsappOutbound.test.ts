import { describe, expect, it } from "vitest";
import { getOutboundBodyOptionC } from "../services/whatsappOutbound";

describe("whatsappOutbound Option C", () => {
  it("returns full response when not escalated", () => {
    expect(getOutboundBodyOptionC(false, "lt", "Full reply text")).toBe("Full reply text");
  });

  it("prepends clinical guidance before ack when escalated clinical_or_urgent", () => {
    const clinical = "Apgailestauju, tačiau negaliu vertinti klinikinės būklės.";
    const body = getOutboundBodyOptionC(true, "lt", clinical, "clinical_or_urgent");
    expect(body).toContain(clinical);
    expect(body).toContain("Ačiū už žinutę");
    expect(body).toContain("Komandos narys");
  });

  it("prepends EN clinical guidance before ack when escalated clinical_or_urgent", () => {
    const clinical = "I am sorry, but I cannot assess clinical conditions.";
    const body = getOutboundBodyOptionC(true, "en", clinical, "clinical_or_urgent");
    expect(body).toContain(clinical);
    expect(body).toContain("Thanks for your message");
  });

  it("returns only ack for unknown escalation", () => {
    const body = getOutboundBodyOptionC(true, "lt", "Kol kas galiu atsakyti tik pagal oficialią informaciją.", "unknown");
    expect(body).not.toContain("oficialią informaciją");
    expect(body).toContain("Ačiū už žinutę");
  });

  it("defaults to ack-only when escalated clinical but empty response", () => {
    const body = getOutboundBodyOptionC(true, "lt", "   ", "clinical_or_urgent");
    expect(body).toBeTruthy();
    expect(body).toContain("Ačiū");
  });
});
