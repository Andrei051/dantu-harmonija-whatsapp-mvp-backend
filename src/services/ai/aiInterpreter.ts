import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ContextTurn } from "./conversationContext";
import { validateInterpretation, type InterpretationV1 } from "./validateInterpretation";

const PROMPT_PATH = join(process.cwd(), "DH-WhatsApp-AI-Interpreter-Prompt-v0.1.md");

let cachedSystemPrompt: string | null = null;

function loadSystemPrompt(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt;
  const md = readFileSync(PROMPT_PATH, "utf8");
  cachedSystemPrompt = `${md}

---

## Machine output requirements (must satisfy Schema v1)

Return one JSON object only, with exactly these top-level keys:
schema_version ("1.0"), language (lt|en|mixed), intents (array of {type, confidence}),
service_or_topic (null or {id, confidence, source}), signals ({booking, availability, clinical_or_suitability, unsupported_or_ambiguous}),
references (array of {type, resolved_to, source_turn}), overall_confidence (0..1).

intent type vocabulary: clinic_hours, clinic_location, parking, contact, booking, availability, service_info, price, first_appointment_prep, first_visit_expectations, about_clinic, assistant_capabilities, clinical, language_switch, other.

signals.booking: none|soft|hard. Other signal fields: boolean.
service_or_topic.source: current_message|conversation_context.
No additional properties. No markdown.`;
  return cachedSystemPrompt;
}

export type InterpretResult =
  | { ok: true; interpretation: InterpretationV1; raw: string }
  | { ok: false; reason: string; raw?: string };

function forceFailMode(): "api" | "schema" | null {
  const v = (process.env.AI_FORCE_FAIL || "").trim().toLowerCase();
  if (v === "api" || v === "1" || v === "true") return "api";
  if (v === "schema" || v === "invalid") return "schema";
  return null;
}

export async function interpretMessage(args: {
  message: string;
  priorTurns: ContextTurn[];
}): Promise<InterpretResult> {
  const forced = forceFailMode();
  if (forced === "api") {
    return { ok: false, reason: "forced_api_failure" };
  }
  if (forced === "schema") {
    return {
      ok: false,
      reason: "forced_invalid_schema",
      raw: JSON.stringify({ intent: "not_a_real_intent" })
    };
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, reason: "missing_openai_api_key" };
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o";
  const system = loadSystemPrompt();
  const contextBlock =
    args.priorTurns.length === 0
      ? "(no prior turns)"
      : args.priorTurns.map((t) => `${t.role}: ${t.text}`).join("\n");

  const userContent = [
    "Conversation context (oldest → newest):",
    contextBlock,
    "",
    "Current patient message:",
    args.message,
    "",
    "Return JSON only matching Schema v1."
  ].join("\n");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: userContent }
        ]
      })
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        reason: `openai_http_${res.status}`,
        raw: detail.slice(0, 500)
      };
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content ?? "";
    const parsed = (() => {
      try {
        return JSON.parse(raw) as unknown;
      } catch {
        return null;
      }
    })();

    if (parsed == null) {
      return { ok: false, reason: "json_parse_failed", raw };
    }

    const validated = validateInterpretation(parsed);
    if (!validated.ok) {
      return {
        ok: false,
        reason: `schema_invalid:${validated.errors.join(";")}`,
        raw
      };
    }

    return { ok: true, interpretation: validated.value, raw };
  } catch (err) {
    return { ok: false, reason: `openai_exception:${String(err)}` };
  }
}
