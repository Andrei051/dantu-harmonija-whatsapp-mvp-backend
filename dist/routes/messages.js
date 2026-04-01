"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = require("express");
const classifier_1 = require("../services/classifier");
const languageService_1 = require("../services/languageService");
const knowledgeService_1 = require("../services/knowledgeService");
const responseBuilder_1 = require("../services/responseBuilder");
exports.messagesRouter = (0, express_1.Router)();
exports.messagesRouter.post("/messages/test", (req, res) => {
    const body = req.body;
    if (!body.message || typeof body.message !== "string") {
        return res.status(400).json({ error: "Field 'message' is required and must be a string." });
    }
    const language = (0, languageService_1.detectLanguage)(body.message);
    const intentResult = (0, classifier_1.classifyIntent)(body.message, knowledgeService_1.knowledgeService.getServices());
    const response = (0, responseBuilder_1.buildResponse)(language, intentResult);
    return res.status(200).json(response);
});
