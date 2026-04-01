"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const health_1 = require("./routes/health");
const messages_1 = require("./routes/messages");
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
const port = Number(process.env.PORT ?? 3000);
app.use(express_1.default.json());
app.use(health_1.healthRouter);
app.use(messages_1.messagesRouter);
app.listen(port, () => {
    logger_1.logger.info(`Server started on port ${port}`);
});
