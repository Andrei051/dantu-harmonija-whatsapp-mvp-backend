import { Router } from "express";
import { runAssistantPipeline } from "../services/assistantPipeline";
import { logger } from "../utils/logger";
import { extractInboundTextMessage } from "../utils/webhookParser";

export const webhookRouter = Router();

webhookRouter.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const verifyToken = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    typeof verifyToken === "string" &&
    verifyToken === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    logger.info("webhook_verify_success", { mode });
    return res.status(200).type("text/plain").send(String(challenge ?? ""));
  }

  logger.info("webhook_verify_failed", { mode, tokenProvided: typeof verifyToken === "string" });
  return res.sendStatus(403);
});

webhookRouter.post("/webhook", (req, res) => {
  res.sendStatus(200);
  logger.info("webhook_post_received");

  const parsed = extractInboundTextMessage(req.body);
  if (!parsed?.messageText) {
    const entry = Array.isArray(req.body?.entry) ? req.body.entry[0] : undefined;
    const change = Array.isArray(entry?.changes) ? entry.changes[0] : undefined;
    const value = change?.value;
    const firstMessage = Array.isArray(value?.messages) ? value.messages[0] : undefined;
    const firstStatus = Array.isArray(value?.statuses) ? value.statuses[0] : undefined;

    logger.info("webhook_post_ignored_non_text", {
      hasEntry: Array.isArray(req.body?.entry),
      hasChanges: Array.isArray(entry?.changes),
      hasMessagesArray: Array.isArray(value?.messages),
      hasStatusesArray: Array.isArray(value?.statuses),
      firstMessageType: firstMessage?.type,
      firstStatus: firstStatus?.status,
      messagingProduct: value?.messaging_product
    });
    return;
  }

  const result = runAssistantPipeline(parsed.messageText);

  logger.info("webhook_inbound_text_processed", {
    sender: parsed.sender,
    messageId: parsed.messageId,
    messageText: parsed.messageText,
    detectedIntent: result.intent,
    detectedLanguage: result.language,
    escalated: result.escalated,
    response: result.response
  });
});
