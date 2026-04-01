import express from "express";
import { healthRouter } from "./routes/health";
import { messagesRouter } from "./routes/messages";
import { webhookRouter } from "./routes/webhook";

export const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(messagesRouter);
app.use(webhookRouter);
