import { describe, expect, it } from "vitest";
import { getOutboundBodyOptionC } from "../services/whatsappOutbound";

describe("whatsappOutbound Option C", () => {
  it("returns full response when not escalated", () => {
    expect(getOutboundBodyOptionC(false, "lt", "Full reply text")).toBe("Full reply text");
  });

  it("returns short acknowledgment when escalated (LT)", () => {
    const body = getOutboundBodyOptionC(true, "lt", "Long clinical fallback");
    expect(body).toContain("Aciu");
    expect(body).not.toContain("Long clinical fallback");
  });

  it("returns short acknowledgment when escalated (EN)", () => {
    const body = getOutboundBodyOptionC(true, "en", "Long clinical fallback");
    expect(body).toContain("Thanks for your message");
    expect(body).not.toContain("Long clinical fallback");
  });
});
