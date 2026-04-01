"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyIntent = void 0;
const normalizeText_1 = require("../utils/normalizeText");
const keywordMap = {
    clinic_hours: ["darbo laikas", "valandos", "kada dirbate", "opening", "hours", "working hours"],
    clinic_location: ["adresas", "kur randates", "lokacija", "location", "address", "where are you"],
    parking: ["parking", "parkav", "where to park"],
    contact: ["kontakt", "telefon", "email", "el past", "contact", "phone", "call"],
    service_info: ["paslaug", "gydym", "implant", "higiena", "ortodont", "service", "treatment", "services"],
    price_info: ["kaina", "kainos", "price", "cost", "kainuoja"],
    language_switch: ["english", "anglu", "in english", "lietuviskai", "lithuanian"],
    clinical_or_urgent: ["stiprus skausmas", "skauda", "kraujuoja", "patin", "temperatura", "urgent", "emergency", "bleeding", "severe pain"],
    unknown: []
};
const detectService = (normalizedMessage, services) => {
    for (const service of services) {
        const allKeywords = [...service.keywords.lt, ...service.keywords.en];
        if (allKeywords.some((keyword) => normalizedMessage.includes((0, normalizeText_1.normalizeText)(keyword)))) {
            return service.id;
        }
    }
    return undefined;
};
const classifyIntent = (message, services) => {
    const normalized = (0, normalizeText_1.normalizeText)(message);
    for (const keyword of keywordMap.clinical_or_urgent) {
        if (normalized.includes((0, normalizeText_1.normalizeText)(keyword))) {
            return { intent: "clinical_or_urgent" };
        }
    }
    if (keywordMap.language_switch.some((keyword) => normalized.includes((0, normalizeText_1.normalizeText)(keyword)))) {
        return { intent: "language_switch" };
    }
    if (keywordMap.clinic_hours.some((keyword) => normalized.includes((0, normalizeText_1.normalizeText)(keyword)))) {
        return { intent: "clinic_hours" };
    }
    if (keywordMap.clinic_location.some((keyword) => normalized.includes((0, normalizeText_1.normalizeText)(keyword)))) {
        return { intent: "clinic_location" };
    }
    if (keywordMap.parking.some((keyword) => normalized.includes((0, normalizeText_1.normalizeText)(keyword)))) {
        return { intent: "parking" };
    }
    if (keywordMap.contact.some((keyword) => normalized.includes((0, normalizeText_1.normalizeText)(keyword)))) {
        return { intent: "contact" };
    }
    if (keywordMap.price_info.some((keyword) => normalized.includes((0, normalizeText_1.normalizeText)(keyword)))) {
        const serviceId = detectService(normalized, services);
        return { intent: "price_info", serviceId };
    }
    if (keywordMap.service_info.some((keyword) => normalized.includes((0, normalizeText_1.normalizeText)(keyword)))) {
        const serviceId = detectService(normalized, services);
        return { intent: "service_info", serviceId };
    }
    const serviceId = detectService(normalized, services);
    if (serviceId) {
        return { intent: "service_info", serviceId };
    }
    return { intent: "unknown" };
};
exports.classifyIntent = classifyIntent;
