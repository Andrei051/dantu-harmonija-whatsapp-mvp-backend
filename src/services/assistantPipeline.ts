import { classifyIntent } from "./classifier";
import { detectLanguage } from "./languageService";
import { knowledgeService } from "./knowledgeService";
import { buildResponse } from "./responseBuilder";

/** Reply text and outbound WhatsApp body use the same `language` from `detectLanguage` (Option C acks use the short copy in that language). */
export const runAssistantPipeline = (message: string) => {
  const language = detectLanguage(message);
  const intentResult = classifyIntent(message, knowledgeService.getServices());
  const built = buildResponse(language, intentResult);

  return {
    intent: built.intent,
    language: built.language,
    response: built.reply,
    reply: built.reply,
    escalated: built.escalated
  };
};
