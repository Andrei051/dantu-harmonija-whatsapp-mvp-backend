"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeService = void 0;
const clinic_profile_json_1 = __importDefault(require("../data/clinic-profile.json"));
const services_json_1 = __importDefault(require("../data/services.json"));
const faq_json_1 = __importDefault(require("../data/faq.json"));
const prices_json_1 = __importDefault(require("../data/prices.json"));
const fallback_json_1 = __importDefault(require("../data/fallback.json"));
exports.knowledgeService = {
    getClinicProfile: () => clinic_profile_json_1.default,
    getServices: () => services_json_1.default,
    getFaq: () => faq_json_1.default,
    getPrices: () => prices_json_1.default,
    getFallback: () => fallback_json_1.default
};
