/**
 * Phase 2C — validate Interpretation Schema v1 (no extra deps).
 */
const INTENT_TYPES = new Set([
  "clinic_hours",
  "clinic_location",
  "parking",
  "contact",
  "booking",
  "availability",
  "service_info",
  "price",
  "first_appointment_prep",
  "first_visit_expectations",
  "about_clinic",
  "assistant_capabilities",
  "clinical",
  "language_switch",
  "other"
]);

export type InterpretationV1 = {
  schema_version: "1.0";
  language: "lt" | "en" | "mixed";
  intents: Array<{ type: string; confidence: number }>;
  service_or_topic: null | {
    id: string | null;
    confidence: number;
    source: "current_message" | "conversation_context";
  };
  signals: {
    booking: "none" | "soft" | "hard";
    availability: boolean;
    clinical_or_suitability: boolean;
    unsupported_or_ambiguous: boolean;
  };
  references: Array<{
    type: string;
    resolved_to: string | null;
    source_turn: number;
  }>;
  overall_confidence: number;
};

const isNum01 = (n: unknown) => typeof n === "number" && n >= 0 && n <= 1 && !Number.isNaN(n);

export const validateInterpretation = (
  value: unknown
): { ok: true; value: InterpretationV1 } | { ok: false; errors: string[] } => {
  const errors: string[] = [];
  if (!value || typeof value !== "object") {
    return { ok: false, errors: ["root must be object"] };
  }
  const o = value as Record<string, unknown>;
  if (o.schema_version !== "1.0") errors.push("schema_version must be \"1.0\"");
  if (o.language !== "lt" && o.language !== "en" && o.language !== "mixed") {
    errors.push("language invalid");
  }
  if (!Array.isArray(o.intents)) errors.push("intents must be array");
  else {
    o.intents.forEach((it, i) => {
      if (!it || typeof it !== "object") {
        errors.push(`intents[${i}] invalid`);
        return;
      }
      const row = it as Record<string, unknown>;
      if (typeof row.type !== "string" || !INTENT_TYPES.has(row.type)) {
        errors.push(`intents[${i}].type invalid`);
      }
      if (!isNum01(row.confidence)) errors.push(`intents[${i}].confidence invalid`);
    });
  }

  if (o.service_or_topic !== null && typeof o.service_or_topic === "object") {
    const s = o.service_or_topic as Record<string, unknown>;
    if (!(s.id === null || typeof s.id === "string")) errors.push("service_or_topic.id invalid");
    if (!isNum01(s.confidence)) errors.push("service_or_topic.confidence invalid");
    if (s.source !== "current_message" && s.source !== "conversation_context") {
      errors.push("service_or_topic.source invalid");
    }
  } else if (o.service_or_topic !== null) {
    errors.push("service_or_topic must be object or null");
  }

  const signals = o.signals as Record<string, unknown> | undefined;
  if (!signals || typeof signals !== "object") errors.push("signals missing");
  else {
    if (!["none", "soft", "hard"].includes(String(signals.booking))) errors.push("signals.booking invalid");
    if (typeof signals.availability !== "boolean") errors.push("signals.availability invalid");
    if (typeof signals.clinical_or_suitability !== "boolean") {
      errors.push("signals.clinical_or_suitability invalid");
    }
    if (typeof signals.unsupported_or_ambiguous !== "boolean") {
      errors.push("signals.unsupported_or_ambiguous invalid");
    }
  }

  if (!Array.isArray(o.references)) errors.push("references must be array");
  else {
    o.references.forEach((r, i) => {
      if (!r || typeof r !== "object") {
        errors.push(`references[${i}] invalid`);
        return;
      }
      const row = r as Record<string, unknown>;
      if (typeof row.type !== "string") errors.push(`references[${i}].type invalid`);
      if (!(row.resolved_to === null || typeof row.resolved_to === "string")) {
        errors.push(`references[${i}].resolved_to invalid`);
      }
      if (typeof row.source_turn !== "number" || row.source_turn < 0) {
        errors.push(`references[${i}].source_turn invalid`);
      }
    });
  }

  if (!isNum01(o.overall_confidence)) errors.push("overall_confidence invalid");

  const allowed = new Set([
    "schema_version",
    "language",
    "intents",
    "service_or_topic",
    "signals",
    "references",
    "overall_confidence"
  ]);
  for (const k of Object.keys(o)) {
    if (!allowed.has(k)) errors.push(`additional property: ${k}`);
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, value: o as InterpretationV1 };
};

export const extractJsonObject = (raw: string): unknown => {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("no JSON object in model output");
  }
};
