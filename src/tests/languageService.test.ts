import { describe, expect, it } from "vitest";
import { detectLanguage } from "../services/languageService";

describe("languageService", () => {
  it("defaults to Lithuanian when unclear", () => {
    expect(detectLanguage("???")).toBe("lt");
  });

  it("detects Lithuanian text", () => {
    expect(detectLanguage("Sveiki, kokios jusu darbo valandos?")).toBe("lt");
  });

  it("detects clearly English text", () => {
    expect(detectLanguage("Hello, what are your working hours and address?")).toBe("en");
  });

  it("detects English for hello alone (manual pack)", () => {
    expect(detectLanguage("hello")).toBe("en");
  });

  it("detects English for What are your working hours? (manual pack)", () => {
    expect(detectLanguage("What are your working hours?")).toBe("en");
  });

  it("keeps Lithuanian when LT cues include weak English token parking", () => {
    expect(detectLanguage("Ar yra parkingas?")).toBe("lt");
  });

  it("keeps clearly English parking question in English", () => {
    expect(detectLanguage("Do you have parking?")).toBe("en");
  });
});
