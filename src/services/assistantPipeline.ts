import { classifyIntent } from "./classifier";
import { detectLanguage } from "./languageService";
import { knowledgeService } from "./knowledgeService";
import { buildResponse } from "./responseBuilder";

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
