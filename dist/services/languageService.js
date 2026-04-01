"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLanguage = void 0;
const normalizeText_1 = require("../utils/normalizeText");
const ENGLISH_HINTS = [
    "hello",
    "hi",
    "where",
    "address",
    "hours",
    "price",
    "parking",
    "service",
    "contact",
    "email",
    "phone",
    "clinic"
];
const LITHUANIAN_HINTS = [
    "sveiki",
    "kur",
    "adresas",
    "valandos",
    "kaina",
    "paslaug",
    "klinika",
    "telefonas",
    "el pastas",
    "darbo"
];
const detectLanguage = (message) => {
    const normalized = (0, normalizeText_1.normalizeText)(message);
    let enScore = 0;
    let ltScore = 1;
    for (const token of ENGLISH_HINTS) {
        if (normalized.includes(token)) {
            enScore += 1;
        }
    }
    for (const token of LITHUANIAN_HINTS) {
        if (normalized.includes(token)) {
            ltScore += 1;
        }
    }
    return enScore > ltScore ? "en" : "lt";
};
exports.detectLanguage = detectLanguage;
