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
    logger.info("webhook_post_ignored_non_text");
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
