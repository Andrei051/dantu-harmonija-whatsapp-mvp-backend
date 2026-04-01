import { MessageIntent } from "../types/message";
import { IntentResult, ServiceItem } from "../types/knowledge";
import { normalizeText } from "../utils/normalizeText";

const keywordMap: Record<MessageIntent, string[]> = {
  clinic_hours: [
    "darbo laikas",
    "valandos",
    "kada dirbate",
    "opening",
    "hours",
    "working hours",
    "savaitgaliais",
    "weekend",
    "dirbat rytoj"
  ],
  clinic_location: [
    "adresas",
    "kur randates",
    "kur jus randates",
    "kur randat",
    "kur esate",
    "lokacija",
    "location",
    "address",
    "where are you",
    "where are you located"
  ],
  parking: ["parking", "parkav", "where to park"],
  contact: ["kontakt", "telefon", "email", "el past", "contact", "phone", "call"],
  booking_request: [
    "appointment",
    "booking",
    "vizitas",
    "registruoti",
    "registracija",
    "registracijos",
    "rezervuoti",
    "reserve",
    "uzsakyti",
    "need appointment"
  ],
  service_info: ["paslaug", "gydym", "implant", "higiena", "ortodont", "service", "treatment", "services"],
  price_info: ["kaina", "kainos", "price", "cost", "kainuoja"],
  language_switch: ["english", "anglu", "in english", "lietuviskai", "lithuanian"],
  clinical_or_urgent: [
    "stiprus skausmas",
    "skauda",
    "skausmas",
    "skaudejo",
    "kraujuoja",
    "patin",
    "temperatura",
    "infekcija",
    "danties",
    "urgent",
    "emergency",
    "bleeding",
    "severe pain",
    "severe",
    "pain",
    "hurts",
    "hurting",
    "aching",
    "ache",
    "swollen",
    "swelling",
    "infection",
    "tooth pain",
    "dental pain",
    "broken tooth",
    "prescribe",
    "prescription",
    "antibiotic",
    "antibiotics",
    "gum",
    "gums",
    "child has"
  ],
  unknown: []
};

const looksLikeLocationQuery = (normalized: string): boolean => {
  if (normalized.includes("kur") && (normalized.includes("randat") || normalized.includes("esate"))) {
    return true;
  }

  return false;
};

const detectService = (normalizedMessage: string, services: ServiceItem[]): string | undefined => {
  for (const service of services) {
    const allKeywords = [...service.keywords.lt, ...service.keywords.en];
    if (allKeywords.some((keyword) => normalizedMessage.includes(normalizeText(keyword)))) {
      return service.id;
    }
  }

  return undefined;
};

export const classifyIntent = (message: string, services: ServiceItem[]): IntentResult => {
  const normalized = normalizeText(message);

  for (const keyword of keywordMap.clinical_or_urgent) {
    if (normalized.includes(normalizeText(keyword))) {
      return { intent: "clinical_or_urgent" };
    }
  }

  if (keywordMap.language_switch.some((keyword) => normalized.includes(normalizeText(keyword)))) {
    return { intent: "language_switch" };
  }

  if (keywordMap.booking_request.some((keyword) => normalized.includes(normalizeText(keyword)))) {
    return { intent: "booking_request" };
  }

  if (keywordMap.clinic_hours.some((keyword) => normalized.includes(normalizeText(keyword)))) {
    return { intent: "clinic_hours" };
  }

  if (
    keywordMap.clinic_location.some((keyword) => normalized.includes(normalizeText(keyword))) ||
    looksLikeLocationQuery(normalized)
  ) {
    return { intent: "clinic_location" };
  }

  if (keywordMap.parking.some((keyword) => normalized.includes(normalizeText(keyword)))) {
    return { intent: "parking" };
  }

  if (keywordMap.contact.some((keyword) => normalized.includes(normalizeText(keyword)))) {
    return { intent: "contact" };
  }

  if (keywordMap.price_info.some((keyword) => normalized.includes(normalizeText(keyword)))) {
    const serviceId = detectService(normalized, services);
    return { intent: "price_info", serviceId };
  }

  if (keywordMap.service_info.some((keyword) => normalized.includes(normalizeText(keyword)))) {
    const serviceId = detectService(normalized, services);
    return { intent: "service_info", serviceId };
  }

  const serviceId = detectService(normalized, services);
  if (serviceId) {
    return { intent: "service_info", serviceId };
  }

  return { intent: "unknown" };
};
