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
    "where u located",
    "where are u",
    "send pin",
    "drop pin",
    "atsiusk pin",
    "atsiuskite pin",
    "atsiuskite lokacija",
    "siuskite lokacija",
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
  price_info: [
    "kaina",
    "kainos",
    "price",
    "cost",
    "kainuoja",
    "how much",
    "cheap",
    "cheapest",
    "budget",
    "affordable",
    "low cost",
    "pigiau",
    "pigiausia",
    "nebrangu",
    "pigus",
    "pigiausi"
  ],
  language_switch: ["english", "anglu", "in english", "lietuviskai", "lithuanian"],
  first_appointment_prep: [],
  first_visit_expectations: [],
  about_clinic: [],
  assistant_capabilities: [],
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
    normalized.includes("discuss") ||
    normalized.includes("vyksta") ||
    normalized.includes("eiga") ||
    normalized.includes("nutinka")
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

  // First visit orientation (prep / what to expect before going) — beats generic "appointment" booking match
  const hasFirstVisitCue =
    normalized.includes("first appointment") ||
    normalized.includes("first visit") ||
    normalized.includes("pirmas vizitas") ||
    normalized.includes("pirmo vizito");

  if (hasFirstVisitCue) {
    const looksLikeCancelOrRescheduleOnly =
      (normalized.includes("cancel") || normalized.includes("reschedule") || normalized.includes("atšaukti") || normalized.includes("atsaukti")) &&
      !normalized.includes("what") &&
      !normalized.includes("bring") &&
      !normalized.includes("prepare");

    if (looksLikeCancelOrRescheduleOnly) {
      return false;
    }

    return true;
  }

  // Informal / compressed: "first time what need bring"
  if (normalized.includes("first time") && (normalized.includes("bring") || normalized.includes("need"))) {
    return true;
  }

  if (
    (normalized.includes("what need") || normalized.includes("what bring")) &&
    normalized.includes("bring")
  ) {
    return true;
  }

  if (normalized.includes("pirma karta") && normalized.includes("reikia")) {
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
    normalized.includes("tell me about you") ||
    normalized.includes("learn about your clinic") ||
    normalized.includes("learn more about your clinic") ||
    normalized.includes("about your practice") ||
    normalized.includes("about your dental practice") ||
    normalized.includes("describe your clinic") ||
    normalized.includes("what is your clinic like") ||
    normalized.includes("what s your clinic like") ||
    normalized.includes("kokia jusu klinika") ||
    normalized.includes("kokia klinika esate") ||
    (normalized.includes("apie jus") &&
      (normalized.includes("klinik") ||
        normalized.includes("dent") ||
        normalized.includes("stomatolog") ||
        normalized.includes("dant") ||
        normalized.includes("gydytoj"))) ||
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

/** Comparative / suitability / “do I need X” — escalate; do not answer from service descriptions */
const matchesDecisionSeekingQuestion = (normalized: string): boolean => {
  if (
    normalized.includes("which is better") ||
    normalized.includes("which would be better") ||
    normalized.includes("which option is better") ||
    normalized.includes("kas geriau") ||
    normalized.includes("kuri geriau") ||
    normalized.includes("whats better") ||
    normalized.includes("what s better") ||
    normalized.includes("geriau nei") ||
    normalized.includes("ar geriau") ||
    normalized.includes("ar verta")
  ) {
    return true;
  }

  if (normalized.includes("do i need")) {
    if (
      normalized.includes("how much") ||
      normalized.includes("how long") ||
      normalized.includes("how many") ||
      normalized.includes("how often")
    ) {
      return false;
    }
    if (
      normalized.includes("do i need to pay") ||
      normalized.includes("do i need to bring") ||
      normalized.includes("do i need to book") ||
      normalized.includes("do i need to call") ||
      normalized.includes("do i need to cancel") ||
      normalized.includes("do i need to arrive") ||
      normalized.includes("do i need to schedule")
    ) {
      return false;
    }
    return true;
  }

  if (normalized.includes("ar man reikia")) {
    if (normalized.includes("kiek")) {
      return false;
    }
    if (
      normalized.includes("sumoketi") ||
      normalized.includes("atsinesti") ||
      normalized.includes("uzsiregistruoti") ||
      normalized.includes("paskambinti")
    ) {
      return false;
    }
    return true;
  }

  if (normalized.includes("should i get") || normalized.includes("should i have")) {
    if (
      normalized.includes("should i call") ||
      normalized.includes("should i contact") ||
      normalized.includes("should i phone") ||
      normalized.includes("should i email")
    ) {
      return false;
    }
    return true;
  }

  if (normalized.includes("am i a candidate")) {
    return true;
  }

  // "Is whitening right for me?" — not "is it right for me"
  if (normalized.includes("right for me")) {
    if (
      normalized.includes("price") ||
      normalized.includes("kaina") ||
      normalized.includes("cost") ||
      normalized.includes("quote") ||
      normalized.includes("how much")
    ) {
      return false;
    }
    return true;
  }

  return false;
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

/** Comparative price questions — avoid picking one service; use broad price guidance */
const matchesComparativePriceQuestion = (normalized: string): boolean => {
  const phrases = [
    "which is cheaper",
    "what is cheaper",
    "which costs less",
    "what costs less",
    "cheaper than",
    "which one is cheaper",
    "kas pigiau",
    "kuris pigesnis",
    "kuri pigesne",
    "kas kainuoja maziau",
    "kainuoja pigiau"
  ];

  if (phrases.some((phrase) => normalized.includes(normalizeText(phrase)))) {
    return true;
  }

  // "how much veneers vs filling", "price X vs Y"
  if (
    normalized.includes(" vs ") &&
    (normalized.includes("how much") ||
      normalized.includes("price") ||
      normalized.includes("cost") ||
      normalized.includes("kaina") ||
      normalized.includes("kiek"))
  ) {
    return true;
  }

  // LT: "... implantu ar plombai ... kaina" style comparisons
  if (
    normalized.includes(" ar ") &&
    (normalized.includes("kaina") || normalized.includes("kiek") || normalized.includes("kainuoja"))
  ) {
    return true;
  }

  // "ar pigiau implantai ar breketai" — comparative cost, not single-service price
  if (
    normalized.includes(" ar ") &&
    (normalized.includes("pigiau") || normalized.includes("pigesnis") || normalized.includes("pigesne"))
  ) {
    return true;
  }

  return false;
};

const looksLikeLocationQuery = (normalized: string): boolean => {
  if (normalized.includes("kur") && (normalized.includes("randat") || normalized.includes("esate"))) {
    return true;
  }

  if (normalized.includes("where") && (normalized.includes("located") || normalized.includes("locate"))) {
    return true;
  }

  // "kur jus" without matching "kur jusu …" (e.g. kaina)
  if (/(^|\s)kur jus(\s|$)/.test(normalized)) {
    return true;
  }

  return false;
};

/** LT "kiek implantas?" — price shorthand without "kainuoja" */
const matchesKiekPriceShorthand = (normalized: string): boolean => {
  if (!normalized.includes("kiek")) {
    return false;
  }
  if (
    normalized.includes("kiek laiko") ||
    normalized.includes("kiek ilgai") ||
    normalized.includes("kiek kartu") ||
    normalized.includes("kiek dienu") ||
    normalized.includes("kiek valand")
  ) {
    return false;
  }
  return true;
};

/** About-style wording + price topic — before about_clinic (avoids "tell me about your prices" -> about via "your"/you) */
const matchesAboutPhrasingWithPriceTopic = (normalized: string): boolean => {
  const hasPrice =
    normalized.includes("price") ||
    normalized.includes("pricing") ||
    normalized.includes("cost") ||
    normalized.includes("kaina") ||
    normalized.includes("kainos") ||
    (normalized.includes("kiek") && normalized.includes("kainuoja"));

  if (!hasPrice) {
    return false;
  }

  if (normalized.includes("tell me about")) {
    return true;
  }

  return (
    normalized.includes("explain your pricing") ||
    normalized.includes("explain the pricing") ||
    normalized.includes("what are your prices like") ||
    normalized.includes("can you explain your pricing") ||
    normalized.includes("kokios jusu kainos") ||
    normalized.includes("kokia jusu kaina") ||
    normalized.includes("papasakokite apie kainas") ||
    normalized.includes("pasakykite apie kainas")
  );
};

const matchesAssistantCapabilities = (normalized: string): boolean => {
  const phrases = [
    "what can you do",
    "what do you do",
    "how can you help",
    "what is this",
    "what languages do you speak",
    "what language do you speak",
    "ka tu gali",
    "ka galite",
    "kuo galite padeti",
    "ka jus darote",
    "kokia kalba kalbate",
    "kokia kalba jus kalbate",
    "kokiomis kalbomis kalbate",
    "kokiomis kalbomis"
  ];

  return phrases.some((phrase) => normalized.includes(normalizeText(phrase)));
};

const matchesServiceAvailabilityYesNo = (normalized: string): boolean =>
  normalized.includes("ar darote") ||
  normalized.includes("ar atliekate") ||
  normalized.includes("ar teikiate") ||
  normalized.includes("do you offer") ||
  normalized.includes("do you do") ||
  (normalized.includes("do you have") &&
    (normalized.includes("whitening") ||
      normalized.includes("implant") ||
      normalized.includes("brace") ||
      normalized.includes("filling") ||
      normalized.includes("cleaning")));

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

  if (matchesDecisionSeekingQuestion(normalized)) {
    return { intent: "clinical_or_urgent" };
  }

  if (keywordMap.language_switch.some((keyword) => normalized.includes(normalizeText(keyword)))) {
    return { intent: "language_switch" };
  }

  if (matchesAssistantCapabilities(normalized)) {
    return { intent: "assistant_capabilities" };
  }

  if (matchesFirstVisitExpectations(normalized)) {
    return { intent: "first_visit_expectations" };
  }

  if (matchesFirstAppointmentPrep(normalized)) {
    return { intent: "first_appointment_prep" };
  }

  if (matchesAboutPhrasingWithPriceTopic(normalized)) {
    return { intent: "price_info", broadPriceList: true };
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

  if (matchesComparativePriceQuestion(normalized)) {
    return { intent: "price_info", broadPriceList: true };
  }

  if (matchesKiekPriceShorthand(normalized)) {
    const kiekServiceId = detectService(normalized, services);
    if (kiekServiceId) {
      return { intent: "price_info", serviceId: kiekServiceId };
    }
  }

  if (keywordMap.price_info.some((keyword) => normalized.includes(normalizeText(keyword)))) {
    if (matchesBroadPriceList(normalized)) {
      return { intent: "price_info", broadPriceList: true };
    }

    const serviceId = detectService(normalized, services);
    return { intent: "price_info", serviceId };
  }

  if (matchesServiceAvailabilityYesNo(normalized)) {
    const availabilityServiceId = detectService(normalized, services);
    return { intent: "service_info", serviceId: availabilityServiceId, serviceAvailabilityYesNo: true };
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
