import express from "express";
import { healthRouter } from "./routes/health";
import { messagesRouter } from "./routes/messages";
import { webhookRouter } from "./routes/webhook";
import { logger } from "./utils/logger";

export const app = express();

app.use(express.json());
app.use((req, _res, next) => {
  logger.info("http_request", { method: req.method, path: req.originalUrl });
  next();
});
app.use(healthRouter);
app.use(messagesRouter);
app.use(webhookRouter);
