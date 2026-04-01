"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeText = void 0;
const normalizeText = (input) => input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
exports.normalizeText = normalizeText;
