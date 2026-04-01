"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const timestamp = () => new Date().toISOString();
exports.logger = {
    info: (message, meta) => {
        // Keep logs structured but minimal for MVP debugging.
        console.log(JSON.stringify({ level: "info", at: timestamp(), message, meta }));
    },
    error: (message, meta) => {
        console.error(JSON.stringify({ level: "error", at: timestamp(), message, meta }));
    }
};
