import fs from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getCapabilityIntroIfFirstReply,
  markCapabilityIntroSent,
  normalizeSenderKey,
  resetCapabilityIntroStateForTests,
  setCapabilityIntroStatePathForTests
} from "../services/whatsappConversationIntro";

describe("whatsappConversationIntro", () => {
  beforeEach(() => {
    const testPath = join(tmpdir(), `wa-cap-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
    setCapabilityIntroStatePathForTests(testPath);
    resetCapabilityIntroStateForTests();
  });

  afterEach(() => {
    resetCapabilityIntroStateForTests();
    setCapabilityIntroStatePathForTests(null);
  });

  it("returns intro once per sender, then null", () => {
    const s = "37060000000";
    const first = getCapabilityIntroIfFirstReply(s, "lt");
    expect(first).toContain("Galiu padėti");
    expect(getCapabilityIntroIfFirstReply(s, "lt")).toEqual(first);
    markCapabilityIntroSent(s);
    expect(getCapabilityIntroIfFirstReply(s, "lt")).toBeNull();
  });

  it("treats distinct senders independently", () => {
    expect(getCapabilityIntroIfFirstReply("111", "en")).toContain("I can help");
    markCapabilityIntroSent("111");
    expect(getCapabilityIntroIfFirstReply("222", "en")).toContain("I can help");
  });

  it("returns EN copy for en", () => {
    expect(getCapabilityIntroIfFirstReply("x", "en")).toContain("contact the clinic directly");
  });

  it("normalizes phone variants to one key", () => {
    expect(normalizeSenderKey("+447885510772")).toBe(normalizeSenderKey("447885510772"));
    const a = getCapabilityIntroIfFirstReply("+447885510772", "en");
    expect(a).toContain("I can help");
    markCapabilityIntroSent("447885510772");
    expect(getCapabilityIntroIfFirstReply("+447885510772", "en")).toBeNull();
  });

  it("writes seen sender to state file", () => {
    const testPath = join(tmpdir(), `wa-cap-${Date.now()}.json`);
    setCapabilityIntroStatePathForTests(testPath);
    resetCapabilityIntroStateForTests();
    markCapabilityIntroSent("37060000000");
    const raw = fs.readFileSync(testPath, "utf8");
    expect(JSON.parse(raw).keys).toContain("37060000000");
  });
});