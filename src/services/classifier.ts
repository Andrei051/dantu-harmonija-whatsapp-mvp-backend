import { MessageIntent } from "../types/message";
import { AboutClinicFocus, IntentResult, ServiceItem } from "../types/knowledge";
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
    "where are you located",
    "google maps",
    "maps",
    "zemelapis",
    "how do i get",
    "how to get there",
    "get there",
    "send location",
    "directions",
    "kaip atvykti",
    "kaip nuvaziuoti",
    "kaip jus rasti"
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
  price_info: ["kaina", "kainos", "price", "cost", "kainuoja", "how much"],
  language_switch: ["english", "anglu", "in english", "lietuviskai", "lithuanian"],
  first_appointment_prep: [],
  first_visit_expectations: [],
  about_clinic: [],
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

const matchesFirstVisitExpectations = (normalized: string): boolean => {
  const phrases = [
    "what happens",
    "what to expect",
    "what should i expect",
    "kas vyksta",
    "ko tiketis",
    "during first visit",
    "during the first appointment",
    "first visit process",
    "will i get a treatment",
    "treatment plan",
    "gydymo planas",
    "price at first visit",
    "price after",
    "tell me the price"
  ];

  if (phrases.some((phrase) => normalized.includes(normalizeText(phrase)))) {
    return true;
  }

  const hasFirstVisitContext =
    normalized.includes("first visit") ||
    normalized.includes("first appointment") ||
    normalized.includes("pirmas vizitas") ||
    normalized.includes("pirmo vizito");

  if (!hasFirstVisitContext) {
    return false;
  }

  return (
    normalized.includes("expect") ||
    normalized.includes("happens") ||
    normalized.includes("plan") ||
    normalized.includes("price") ||
    normalized.includes("kaina") ||
    normalized.includes("discuss")
  );
};

const matchesFirstAppointmentPrep = (normalized: string): boolean => {
  if (
    normalized.includes("what to bring") ||
    normalized.includes("what should i bring") ||
    normalized.includes("should i bring") ||
    normalized.includes("ka atsinesti") ||
    normalized.includes("ka reikia atsinesti")
  ) {
    return true;
  }

  if (
    normalized.includes("how early") &&
    (normalized.includes("arrive") ||
      normalized.includes("appointment") ||
      normalized.includes("vizitas") ||
      normalized.includes("first"))
  ) {
    return true;
  }

  if (normalized.includes("how early should i")) {
    return true;
  }

  if (
    normalized.includes("tapatybes") ||
    normalized.includes("identity document") ||
    normalized.includes("need id") ||
    normalized.includes("bring id") ||
    normalized.includes("do i need id") ||
    (normalized.includes("dokumentas") && (normalized.includes("vizitas") || normalized.includes("visit")))
  ) {
    return true;
  }

  if (normalized.includes("before first visit") || normalized.includes("pries pirma")) {
    return true;
  }

  if (normalized.includes("what should i know") && (normalized.includes("first visit") || normalized.includes("first appointment"))) {
    return true;
  }

  return false;
};

const resolveAboutClinic = (normalized: string): { intent: "about_clinic"; aboutFocus: AboutClinicFocus } | null => {
  const aboutGeneral =
    normalized.includes("about your clinic") ||
    normalized.includes("about the clinic") ||
    normalized.includes("tell me about your clinic") ||
    normalized.includes("tell me about the clinic") ||
    normalized.includes("who are you") ||
    normalized.includes("why choose") ||
    normalized.includes("why should i choose") ||
    normalized.includes("apie klinika") ||
    normalized.includes("kas jus") ||
    normalized.includes("what kind of clinic") ||
    normalized.includes("koki klinika") ||
    (normalized.includes("tell me about") && normalized.includes("clinic")) ||
    (normalized.includes("tell me about") && normalized.includes("you")) ||
    (normalized.includes("about you") && normalized.includes("clinic"));

  const familyCue =
    normalized.includes("children") ||
    normalized.includes("child") ||
    normalized.includes("vaik") ||
    normalized.includes("family") ||
    normalized.includes("kids") ||
    normalized.includes("seimos");

  const teamCue =
    normalized.includes("qualified") ||
    normalized.includes("specialists") ||
    normalized.includes("specialist") ||
    normalized.includes("doctors") ||
    normalized.includes("doctor") ||
    normalized.includes("gydytoj") ||
    normalized.includes("komanda");

  const fullServiceCue =
    normalized.includes("one roof") ||
    normalized.includes("one place") ||
    normalized.includes("full service") ||
    normalized.includes("vienoje vietoje") ||
    normalized.includes("viskas vienoje") ||
    normalized.includes("under one roof");

  const hasDentalContext =
    normalized.includes("clinic") ||
    normalized.includes("klinik") ||
    normalized.includes("dental") ||
    normalized.includes("treat") ||
    normalized.includes("stomatolog") ||
    familyCue;

  if (familyCue && hasDentalContext) {
    return { intent: "about_clinic", aboutFocus: "family" };
  }

  if (
    teamCue &&
    (aboutGeneral ||
      normalized.includes("clinic") ||
      normalized.includes("qualified") ||
      (normalized.includes("good") &&
        (normalized.includes("doctor") || normalized.includes("team") || normalized.includes("specialist"))) ||
      normalized.includes("experienced"))
  ) {
    return { intent: "about_clinic", aboutFocus: "team" };
  }

  if (fullServiceCue) {
    return { intent: "about_clinic", aboutFocus: "fullService" };
  }

  if (aboutGeneral) {
    return { intent: "about_clinic", aboutFocus: "default" };
  }

  return null;
};

const matchesBroadPriceList = (normalized: string): boolean => {
  const phrases = [
    "what are your prices",
    "what are prices",
    "all prices",
    "full price list",
    "complete price",
    "price list",
    "send price",
    "send me prices",
    "every price",
    "visos kainos",
    "pilna kain",
    "kainu sarasas",
    "how much does treatment cost",
    "how much would my",
    "my treatment cost",
    "how much will my treatment",
    "full list of prices",
    "all your prices"
  ];

  return phrases.some((phrase) => normalized.includes(normalizeText(phrase)));
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

  if (matchesFirstVisitExpectations(normalized)) {
    return { intent: "first_visit_expectations" };
  }

  if (matchesFirstAppointmentPrep(normalized)) {
    return { intent: "first_appointment_prep" };
  }

  const about = resolveAboutClinic(normalized);
  if (about) {
    return about;
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
    if (matchesBroadPriceList(normalized)) {
      return { intent: "price_info", broadPriceList: true };
    }

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
