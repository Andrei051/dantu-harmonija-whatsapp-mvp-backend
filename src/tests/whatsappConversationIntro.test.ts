import { describe, expect, it } from "vitest";
import {
  getCapabilityIntroIfFirstReply,
  markCapabilityIntroSent,
  resetCapabilityIntroStateForTests
} from "../services/whatsappConversationIntro";

describe("whatsappConversationIntro", () => {
  it("returns intro once per sender, then null", () => {
    resetCapabilityIntroStateForTests();
    const s = "37060000000";
    const first = getCapabilityIntroIfFirstReply(s, "lt");
    expect(first).toContain("Galiu padėti");
    expect(getCapabilityIntroIfFirstReply(s, "lt")).toEqual(first);
    markCapabilityIntroSent(s);
    expect(getCapabilityIntroIfFirstReply(s, "lt")).toBeNull();
  });

  it("treats distinct senders independently", () => {
    resetCapabilityIntroStateForTests();
    expect(getCapabilityIntroIfFirstReply("111", "en")).toContain("I can help");
    markCapabilityIntroSent("111");
    expect(getCapabilityIntroIfFirstReply("222", "en")).toContain("I can help");
  });

  it("returns EN copy for en", () => {
    resetCapabilityIntroStateForTests();
    expect(getCapabilityIntroIfFirstReply("x", "en")).toContain("contact the clinic directly");
  });
});
