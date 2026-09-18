import { runAssistantPipeline } from "../assistantPipeline";
import {
  appendConversationTurn,
  getConversationContext,
  type ContextTurn
} from "./conversationContext";
import { interpretMessage } from "./aiInterpreter";
import { applyPolicyAndAssemble } from "./policyAssemble";
import type { MessageIntent } from "../../types/message";
import { normalizeSenderKey } from "../whatsappConversationIntro";
import { logger } from "../../utils/logger";

export type PipelineResult = ReturnType<typeof runAssistantPipeline> & {
  path: "v1.1" | "v2";
  ai_path_attempted: boolean;
  schema_valid: boolean | null;
  fallback_used: boolean;
  fallback_reason: string | null;
  context_turns_loaded: number;
};

function isAiEnabled(): boolean {
  const v = (process.env.AI_ENABLED || "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function v11Result(message: string, extra: Partial<PipelineResult>): PipelineResult {
  const base = runAssistantPipeline(message);
  return {
    ...base,
    path: "v1.1",
    ai_path_attempted: false,
    schema_valid: null,
    fallback_used: false,
    fallback_reason: null,
    context_turns_loaded: 0,
    ...extra
  };
}

/**
 * Optional v2 interpretation path around frozen v1.1.
 * Gate: AI_ENABLED only. Failures fall back to v1.1 with observable fallback_* fields.
 */
export async function runMessagePipeline(args: {
  message: string;
  sender?: string;
}): Promise<PipelineResult> {
  const { message, sender } = args;

  if (!isAiEnabled()) {
    return v11Result(message, {});
  }

  const priorTurns: ContextTurn[] = sender ? getConversationContext(sender) : [];
  logger.info("ai_path_inbound_context", {
    sender_key: sender ? normalizeSenderKey(sender) : null,
    messageText: message,
    context_turns_loaded: priorTurns.length,
    context_preview: priorTurns.map((t) => ({
      role: t.role,
      text: t.text.slice(0, 120)
    }))
  });

  const interpreted = await interpretMessage({ message, priorTurns });

  logger.info("ai_path_interpretation", {
    ok: interpreted.ok,
    reason: interpreted.ok ? null : interpreted.reason,
    schema_valid: interpreted.ok,
    interpretation: interpreted.ok
      ? {
          language: interpreted.interpretation.language,
          intents: interpreted.interpretation.intents,
          service_or_topic: interpreted.interpretation.service_or_topic,
          signals: interpreted.interpretation.signals,
          references: interpreted.interpretation.references,
          overall_confidence: interpreted.interpretation.overall_confidence
        }
      : null
  });

  if (!interpreted.ok) {
    const fallback = v11Result(message, {
      ai_path_attempted: true,
      schema_valid: false,
      fallback_used: true,
      fallback_reason: interpreted.reason,
      context_turns_loaded: priorTurns.length
    });
    logger.info("ai_path_fallback", {
      fallback_used: true,
      fallback_reason: interpreted.reason,
      schema_valid: false
    });
    return fallback;
  }

  const policy = applyPolicyAndAssemble(interpreted.interpretation, message);

  logger.info("ai_path_policy_outbound", {
    route: policy.route,
    actions: policy.actions,
    suppressed: policy.suppressed,
    foundation_hits: policy.foundation_hits,
    foundation_misses: policy.foundation_misses,
    primary_intent_label: policy.primary_intent_label,
    escalated: policy.escalated,
    language: policy.language,
    reply_preview: policy.reply.slice(0, 200)
  });

  const intent = (policy.primary_intent_label || "unknown") as MessageIntent;

  return {
    intent,
    language: policy.language,
    response: policy.reply,
    reply: policy.reply,
    escalated: policy.escalated,
    path: "v2",
    ai_path_attempted: true,
    schema_valid: true,
    fallback_used: false,
    fallback_reason: null,
    context_turns_loaded: priorTurns.length
  };
}

export function recordConversationExchange(args: {
  sender: string;
  patientText: string;
  assistantText: string;
}): void {
  appendConversationTurn(args.sender, { role: "patient", text: args.patientText });
  appendConversationTurn(args.sender, { role: "assistant", text: args.assistantText });
}
