import { Router } from "express";
import { runAssistantPipeline } from "../services/assistantPipeline";
import { TestMessageRequest } from "../types/message";

export const messagesRouter = Router();

messagesRouter.post("/messages/test", (req, res) => {
  const body = req.body as Partial<TestMessageRequest>;

  if (!body.message || typeof body.message !== "string") {
    return res.status(400).json({ error: "Field 'message' is required and must be a string." });
  }

  return res.status(200).json(runAssistantPipeline(body.message));
});
