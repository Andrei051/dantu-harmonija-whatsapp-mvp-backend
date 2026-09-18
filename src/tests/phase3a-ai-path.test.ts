import { beforeEach, describe, expect, it, vi } from "vitest";
import { runMessagePipeline } from "../services/ai/messagePipeline";
import {
  appendConversationTurn,
  resetConversationContextForTests
} from "../services/ai/conversationContext";
import * as aiInterpreter from "../services/ai/aiInterpreter";

describe("Phase 3A optional AI path", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetConversationContextForTests();
    delete process.env.AI_ENABLED;
    delete process.env.AI_FORCE_FAIL;
  });

  it("defaults to v1.1 when AI is disabled", async () => {
    const result = await runMessagePipeline({
      message: "Kokios darbo valandos?",
      sender: "37060000000"
    });
    expect(result.path).toBe("v1.1");
    expect(result.ai_path_attempted).toBe(false);
    expect(result.fallback_used).toBe(false);
    expect(result.intent).toBe("clinic_hours");
  });

  it("falls back observably on forced API failure", async () => {
    process.env.AI_ENABLED = "true";
    process.env.AI_FORCE_FAIL = "api";

    const result = await runMessagePipeline({
      message: "Kokios darbo valandos?",
      sender: "37060000000"
    });

    expect(result.ai_path_attempted).toBe(true);
    expect(result.fallback_used).toBe(true);
    expect(result.fallback_reason).toBe("forced_api_failure");
    expect(result.path).toBe("v1.1");
    expect(result.intent).toBe("clinic_hours");
  });

  it("falls back observably on forced invalid schema", async () => {
    process.env.AI_ENABLED = "true";
    process.env.AI_FORCE_FAIL = "schema";

    const result = await runMessagePipeline({
      message: "labas",
      sender: "37060000000"
    });

    expect(result.ai_path_attempted).toBe(true);
    expect(result.schema_valid).toBe(false);
    expect(result.fallback_used).toBe(true);
    expect(result.fallback_reason).toBe("forced_invalid_schema");
  });

  it("uses v2 path when interpretation succeeds", async () => {
    process.env.AI_ENABLED = "true";

    vi.spyOn(aiInterpreter, "interpretMessage").mockResolvedValue({
      ok: true,
      raw: "{}",
      interpretation: {
        schema_version: "1.0",
        language: "lt",
        intents: [{ type: "clinic_hours", confidence: 0.9 }],
        service_or_topic: null,
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        },
        references: [],
        overall_confidence: 0.9
      }
    });

    appendConversationTurn("37060000000", {
      role: "patient",
      text: "Sveiki"
    });

    const result = await runMessagePipeline({
      message: "Kokios darbo valandos?",
      sender: "37060000000"
    });

    expect(result.path).toBe("v2");
    expect(result.ai_path_attempted).toBe(true);
    expect(result.schema_valid).toBe(true);
    expect(result.fallback_used).toBe(false);
    expect(result.context_turns_loaded).toBe(1);
    expect(result.intent).toBe("clinic_hours");
  });
});
