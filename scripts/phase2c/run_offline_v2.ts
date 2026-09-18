/**
 * Phase 2C — offline AI interpretation prototype (one frozen prompt, one model, full corpus).
 * Requires OPENAI_API_KEY (env or .env). No production webhook.
 */
import fs from "fs";
import path from "path";
import { getOutboundBodyOptionC } from "../../src/services/whatsappOutbound";
import { MessageIntent } from "../../src/types/message";
import { applyPolicyAndAssemble } from "./policyAssemble";
import { extractJsonObject, validateInterpretation, InterpretationV1 } from "./validateInterpretation";
import { CorpusCase, scoreCase, TurnCapture } from "../run_nl_eval_v1.1";

const root = path.resolve(__dirname, "../..");

/** Minimal .env loader — no dotenv dependency. Does not override existing process.env. */
const loadDotEnv = (filePath: string): void => {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
};

loadDotEnv(path.join(root, ".env"));

const corpusPath = path.join(root, "data", "DH-WhatsApp-NL-Corpus-v0.1.json");
const promptPath = path.join(root, "DH-WhatsApp-AI-Interpreter-Prompt-v0.1.md");
const outDir = path.join(root, "data");
const invocationsPath = path.join(outDir, "DH-WhatsApp-NL-Evaluation-v2-offline-invocations.jsonl");
const resultsPath = path.join(outDir, "DH-WhatsApp-NL-Evaluation-v2-offline-results.json");
const summaryPath = path.join(root, "DH-WhatsApp-NL-Evaluation-v2-offline-summary.md");
const controlPath = path.join(outDir, "DH-WhatsApp-NL-Evaluation-v1.1-results.json");

const MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4o";
const PROMPT_VERSION = "v0.1";
const CONTRACT_VERSION = "interpretation-schema-v1 + policy-mapping-v1 + phase2d-hardening";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const buildSystemPrompt = (): string => {
  const md = fs.readFileSync(promptPath, "utf8");
  // Compact contract reminder only — embedding the full JSON Schema every call burns TPM (~2.3k tokens/request).
  return `${md}

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
};

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const callOpenAI = async (
  system: string,
  userContent: string
): Promise<{ raw: string; latency_ms: number; usage?: unknown }> => {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const maxAttempts = 8;
  let lastErr = "";
  const started = Date.now();

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: userContent }
        ] as ChatMessage[]
      })
    });

    const body = (await res.json()) as {
      error?: { message?: string };
      choices?: Array<{ message?: { content?: string } }>;
      usage?: unknown;
    };

    if (res.status === 429) {
      lastErr = `OpenAI HTTP 429: ${body.error?.message ?? "rate limited"}`;
      // Prefer server hint if present ("try again in 3.1s"), else exponential backoff.
      const hint = /try again in ([\d.]+)\s*s/i.exec(lastErr);
      const waitMs = hint
        ? Math.ceil(parseFloat(hint[1]) * 1000) + 250
        : Math.min(30000, 1000 * 2 ** (attempt - 1));
      console.warn(`rate-limited attempt ${attempt}/${maxAttempts}, waiting ${waitMs}ms`);
      await sleep(waitMs);
      continue;
    }

    if (!res.ok) {
      throw new Error(`OpenAI HTTP ${res.status}: ${body.error?.message ?? JSON.stringify(body)}`);
    }

    const raw = body.choices?.[0]?.message?.content ?? "";
    return { raw, latency_ms: Date.now() - started, usage: body.usage };
  }

  throw new Error(lastErr || "OpenAI rate limit: retries exhausted");
};

const formatUserPayload = (
  current: string,
  prior: Array<{ role: "patient" | "assistant"; text: string }>
): string => {
  const lines: string[] = [];
  if (prior.length) {
    lines.push("Preceding turns:");
    prior.forEach((p, i) => {
      lines.push(`${i + 1}. ${p.role}: ${p.text}`);
    });
    lines.push("");
  } else {
    lines.push("Preceding turns: (none)");
    lines.push("");
  }
  lines.push(`Current patient message: ${current}`);
  return lines.join("\n");
};

const main = async () => {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.error(
      "OPENAI_API_KEY missing. Set it, then run:\n  npx tsx scripts/phase2c/run_offline_v2.ts"
    );
    process.exit(1);
  }

  const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8")) as {
    corpus_id: string;
    cases: CorpusCase[];
  };
  const system = buildSystemPrompt();
  const control = fs.existsSync(controlPath)
    ? (JSON.parse(fs.readFileSync(controlPath, "utf8")) as {
        summary: Record<string, unknown>;
      })
    : null;

  if (fs.existsSync(invocationsPath)) fs.unlinkSync(invocationsPath);
  const invLog = fs.createWriteStream(invocationsPath, { flags: "a" });

  const caseResults: Array<Record<string, unknown>> = [];
  let schemaValid = 0;
  let schemaInvalid = 0;
  let invokeCount = 0;

  for (const c of corpus.cases) {
    const prior: Array<{ role: "patient" | "assistant"; text: string }> = [];
    const turns: TurnCapture[] = [];
    const turnLogs: unknown[] = [];

    for (let i = 0; i < c.conversation.length; i++) {
      const message = c.conversation[i];
      const userContent = formatUserPayload(message, prior);
      let raw = "";
      let latency_ms = 0;
      let usage: unknown;
      let schema_valid = false;
      let parse_errors: string[] | undefined;
      let interpretation: unknown = null;
      let policy = null as ReturnType<typeof applyPolicyAndAssemble> | null;
      let outbound = "";
      let interpretation_error: string | undefined;

      try {
        const call = await callOpenAI(system, userContent);
        raw = call.raw;
        latency_ms = call.latency_ms;
        usage = call.usage;
        invokeCount++;
        const parsed = extractJsonObject(raw);
        const validated = validateInterpretation(parsed);
        if (!validated.ok) {
          schemaInvalid++;
          schema_valid = false;
          parse_errors = validated.errors;
          interpretation_error = "schema_invalid";
          // Do not repair schema — but D4 may still apply greeting from patient message alone
          const empty: InterpretationV1 = {
            schema_version: "1.0",
            language: c.language === "en" ? "en" : "lt",
            intents: [],
            service_or_topic: null,
            signals: {
              booking: "none",
              availability: false,
              clinical_or_suitability: false,
              unsupported_or_ambiguous: false
            },
            references: [],
            overall_confidence: 0
          };
          policy = applyPolicyAndAssemble(empty, message);
          if (!policy.actions.includes("D4_greeting_or_empty_capabilities")) {
            policy = {
              actions: ["schema_invalid_fallback"],
              suppressed: [],
              foundation_hits: [],
              foundation_misses: ["schema_invalid"],
              route: "option_c",
              escalated: true,
              reply: c.language === "en" ? knowledgeUnknownEn() : knowledgeUnknownLt(),
              language: c.language === "en" ? "en" : "lt",
              primary_intent_label: "unknown"
            };
          }
        } else {
          schemaValid++;
          schema_valid = true;
          interpretation = validated.value;
          policy = applyPolicyAndAssemble(validated.value, message);
        }
      } catch (err) {
        schemaInvalid++;
        interpretation_error = err instanceof Error ? err.message : String(err);
        const empty: InterpretationV1 = {
          schema_version: "1.0",
          language: c.language === "en" ? "en" : "lt",
          intents: [],
          service_or_topic: null,
          signals: {
            booking: "none",
            availability: false,
            clinical_or_suitability: false,
            unsupported_or_ambiguous: false
          },
          references: [],
          overall_confidence: 0
        };
        policy = applyPolicyAndAssemble(empty, message);
        if (!policy.actions.includes("D4_greeting_or_empty_capabilities")) {
          policy = {
            actions: ["invoke_or_parse_error"],
            suppressed: [],
            foundation_hits: [],
            foundation_misses: ["error"],
            route: "option_c",
            escalated: true,
            reply: c.language === "en" ? knowledgeUnknownEn() : knowledgeUnknownLt(),
            language: c.language === "en" ? "en" : "lt",
            primary_intent_label: "unknown"
          };
        }
      }

      const outboundBody = getOutboundBodyOptionC(
        policy!.escalated,
        policy!.language,
        policy!.reply,
        (policy!.route === "phone"
          ? "clinical_or_urgent"
          : policy!.escalated
            ? "unknown"
            : undefined) as MessageIntent | undefined
      );
      outbound = outboundBody;

      const intentForScore = (policy!.primary_intent_label ||
        (policy!.route === "phone"
          ? "clinical_or_urgent"
          : policy!.escalated
            ? "unknown"
            : "service_info")) as MessageIntent;

      const capture: TurnCapture = {
        turn: i + 1,
        message,
        language: policy!.language,
        intent: intentForScore,
        intent_result: { intent: intentForScore },
        pipeline_response: policy!.reply,
        outbound_body: outbound,
        escalated: policy!.escalated,
        capability_intro_prepended: false,
        inferred_route: policy!.route
      };
      turns.push(capture);

      const invRow = {
        case_id: c.case_id,
        turn: i + 1,
        model: MODEL,
        prompt_version: PROMPT_VERSION,
        contract_version: CONTRACT_VERSION,
        input_messages_context: userContent,
        raw_model_output: raw,
        schema_valid,
        parse_errors,
        interpretation_error,
        parsed_interpretation: interpretation,
        latency_ms,
        usage,
        policy,
        outbound_body: outbound
      };
      invLog.write(`${JSON.stringify(invRow)}\n`);
      turnLogs.push(invRow);

      prior.push({ role: "patient", text: message });
      prior.push({ role: "assistant", text: outbound });

      await sleep(800);
    }

    const scored = scoreCase(c, turns);
    caseResults.push({
      case_id: c.case_id,
      language: c.language,
      scenario_family: c.scenario_family,
      provenance: c.provenance,
      turn_count: turns.length,
      actual_responses: turns.map((t) => t.outbound_body),
      actual_intents: turns.map((t) => t.intent),
      actual_routes: turns.map((t) => t.inferred_route),
      pass: scored.pass,
      primary_failure_bucket: scored.bucket,
      observed_notes: scored.notes,
      turns: turnLogs
    });

    console.log(
      `${c.case_id} ${scored.pass ? "PASS" : "FAIL"} ${scored.bucket ?? ""} ${scored.notes.slice(0, 80)}`
    );
  }

  invLog.end();

  const passed = caseResults.filter((r) => r.pass);
  const failed = caseResults.filter((r) => !r.pass);
  const buckets: Record<string, number> = {
    Understanding: 0,
    Context: 0,
    Knowledge: 0,
    "Boundary/Safety": 0
  };
  for (const r of failed) {
    const b = r.primary_failure_bucket as string | null;
    if (b && buckets[b] !== undefined) buckets[b]++;
  }

  const by = (key: string) => {
    const map: Record<string, { pass: number; fail: number; total: number }> = {};
    for (const r of caseResults) {
      const k = String(r[key]);
      if (!map[k]) map[k] = { pass: 0, fail: 0, total: 0 };
      map[k].total++;
      if (r.pass) map[k].pass++;
      else map[k].fail++;
    }
    return map;
  };

  const sentinels = {
    P2_056: caseResults.find((r) => r.case_id === "P2-056"),
    P2_062: caseResults.find((r) => r.case_id === "P2-062")
  };

  const payload = {
    evaluation_id: "DH-WhatsApp-NL-Evaluation-v2-offline",
    status: "FROZEN",
    evaluated_at: new Date().toISOString(),
    model: MODEL,
    prompt_version: PROMPT_VERSION,
    contract_version: CONTRACT_VERSION,
    context_strategy: "current_message + preceding_turns_from_corpus_case",
    corpus_id: corpus.corpus_id,
    harness_notes: [
      "LLM interprets only; policy+Foundation assemble replies.",
      "Schema-invalid outputs recorded as failures (unknown fallback) — not silently repaired.",
      "No structured conversation state in this run."
    ],
    summary: {
      total: caseResults.length,
      pass: passed.length,
      fail: failed.length,
      pass_rate: Number((passed.length / caseResults.length).toFixed(4)),
      schema_valid_invocations: schemaValid,
      schema_invalid_invocations: schemaInvalid,
      total_invocations: invokeCount,
      schema_validity_rate:
        invokeCount > 0 ? Number((schemaValid / (schemaValid + schemaInvalid)).toFixed(4)) : 0,
      by_language: by("language"),
      by_scenario_family: by("scenario_family"),
      by_provenance: by("provenance"),
      by_turn_shape: (() => {
        const map = { single_turn: { pass: 0, fail: 0, total: 0 }, multi_turn: { pass: 0, fail: 0, total: 0 } };
        for (const r of caseResults) {
          const k = (r.turn_count as number) > 1 ? "multi_turn" : "single_turn";
          map[k].total++;
          if (r.pass) map[k].pass++;
          else map[k].fail++;
        }
        return map;
      })(),
      failure_buckets: buckets,
      sentinels: {
        P2_056_pass: Boolean(sentinels.P2_056?.pass),
        P2_062_pass: Boolean(sentinels.P2_062?.pass)
      },
      control_v1_1: control?.summary ?? null
    },
    results: caseResults
  };

  fs.writeFileSync(resultsPath, JSON.stringify(payload, null, 2), "utf8");

  const ctrl = control?.summary as {
    pass?: number;
    fail?: number;
    by_turn_shape?: Record<string, { pass: number; fail: number; total: number }>;
    failure_buckets?: Record<string, number>;
  } | null;

  const md = `# NL Evaluation v2 offline — Summary

**Status:** FROZEN 🔒 (first offline AI prototype)  
**Model:** \`${MODEL}\`  
**Prompt:** Interpreter Prompt v0.1 (frozen)  
**Context:** current message + preceding corpus turns  
**Corpus:** v0.1 (untouched)

## Overall vs control

| Measure | v1.1 control | v2 offline |
|---|---|---|
| Overall | ${ctrl?.pass ?? 52}/70 | ${passed.length}/70 |
| Single-turn | ${ctrl?.by_turn_shape?.single_turn?.pass ?? 51}/63 | ${payload.summary.by_turn_shape.single_turn.pass}/63 |
| Multi-turn | ${ctrl?.by_turn_shape?.multi_turn?.pass ?? 1}/7 | ${payload.summary.by_turn_shape.multi_turn.pass}/7 |
| Understanding fails | ${ctrl?.failure_buckets?.Understanding ?? 10} | ${buckets.Understanding} |
| Context fails | ${ctrl?.failure_buckets?.Context ?? 6} | ${buckets.Context} |
| Knowledge fails | ${ctrl?.failure_buckets?.Knowledge ?? 1} | ${buckets.Knowledge} |
| Boundary/Safety fails | ${ctrl?.failure_buckets?.["Boundary/Safety"] ?? 1} | ${buckets["Boundary/Safety"]} |

## AI-specific

| Measure | Value |
|---|---|
| Schema-valid invocations | ${schemaValid} / ${schemaValid + schemaInvalid} |
| Schema validity rate | ${((schemaValid / Math.max(1, schemaValid + schemaInvalid)) * 100).toFixed(1)}% |

## Sentinels

| Case | Pass? |
|---|---|
| P2-056 clinical/suitability | ${sentinels.P2_056?.pass ? "YES" : "NO"} |
| P2-062 insurance ≠ implant blurb | ${sentinels.P2_062?.pass ? "YES" : "NO"} |

## Continuation gate

Continue only if Understanding ↓ and Context ↓ materially, with **no** Boundary/Safety regression and **no** new hallucinated Foundation-miss handling.

**Artefacts:** \`${path.basename(resultsPath)}\` · \`${path.basename(invocationsPath)}\`
`;
  fs.writeFileSync(summaryPath, md, "utf8");
  console.log(JSON.stringify(payload.summary, null, 2));
};

const knowledgeUnknownLt = () =>
  "Ačiū už žinutę. Kol kas galiu atsakyti tik pagal oficialią klinikos informaciją. Jei klausimas sudėtingesnis, perduosiu jį komandos nariui.";
const knowledgeUnknownEn = () =>
  "Thanks for your message. I currently answer only from official clinic information. If your question is more complex, I will route it to a team member.";

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
