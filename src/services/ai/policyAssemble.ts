/**
 * Phase 2D — deterministic policy + Foundation assembly from Interpretation v1.
 * Hardening: D1 unresolved booking→contact; D2 ask-family Foundation gate;
 * D3 composable info+booking; D4 greeting/empty→capabilities.
 */
import { buildResponse } from "../responseBuilder";
import { knowledgeService } from "../knowledgeService";
import { IntentResult } from "../../types/knowledge";
import { SupportedLanguage } from "../../types/message";
import { InterpretationV1 } from "./validateInterpretation";

const ONLINE_BOOKABLE = new Set(["professional_hygiene", "diagnostics"]);

/** Foundation absence families — authorised non-answers (not Understanding synonym rescue). */
const UNSUPPORTED_ASK_FAMILY =
  /ligoniu\s*kas|ligonių\s*kas|kompensuoj|draudim|insurance|reimburs|issimoket|išsimoket|installment|financin|moketi\s*dalimis|mokėti\s*dalimis/i;

export type PolicyTrace = {
  actions: string[];
  suppressed: string[];
  foundation_hits: string[];
  foundation_misses: string[];
  route: string;
  escalated: boolean;
  reply: string;
  language: SupportedLanguage;
  primary_intent_label?: string;
};

const replyLang = (interp: InterpretationV1): SupportedLanguage =>
  interp.language === "en" ? "en" : "lt";

const hasIntent = (interp: InterpretationV1, type: string) =>
  interp.intents.some((i) => i.type === type);

const serviceId = (interp: InterpretationV1): string | undefined => {
  const id = interp.service_or_topic?.id;
  if (!id) return undefined;
  const known = knowledgeService.getServices().some((s) => s.id === id);
  return known ? id : undefined;
};

/** D1: unresolved service must never assume online-registration eligibility. */
const bookingRouteFor = (interp: InterpretationV1): "online_registration" | "contact" => {
  const sid = serviceId(interp);
  if (sid && ONLINE_BOOKABLE.has(sid)) return "online_registration";
  if (sid && !ONLINE_BOOKABLE.has(sid)) return "contact";
  // Unresolved / null service → contact (never online default)
  return "contact";
};

const isGreetingOnly = (message: string): boolean => {
  const n = message
    .trim()
    .toLowerCase()
    .replace(/[!?.,]+$/g, "")
    .trim();
  return [
    "sveiki",
    "sveikas",
    "sveika",
    "labas",
    "labukas",
    "labas rytas",
    "laba diena",
    "labas vakaras",
    "hello",
    "hi",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "hello there",
    "hi there",
    "hey there"
  ].includes(n);
};

const emptyInterpretation = (interp: InterpretationV1): boolean =>
  interp.intents.length === 0 &&
  !interp.signals.availability &&
  interp.signals.booking === "none" &&
  !interp.signals.clinical_or_suitability &&
  !interp.signals.unsupported_or_ambiguous;

export const applyPolicyAndAssemble = (
  interp: InterpretationV1,
  patientMessage = ""
): PolicyTrace => {
  const language = replyLang(interp);
  const actions: string[] = [];
  const suppressed: string[] = [];
  const foundation_hits: string[] = [];
  const foundation_misses: string[] = [];
  const parts: string[] = [];
  let escalated = false;
  let route = "none";
  let primary_intent_label = "unknown";

  // D4 — greeting / empty interpretation → capabilities
  if (isGreetingOnly(patientMessage) || emptyInterpretation(interp)) {
    actions.push("D4_greeting_or_empty_capabilities");
    foundation_hits.push("assistant_capabilities");
    const built = buildResponse(language, { intent: "assistant_capabilities" });
    return {
      actions,
      suppressed,
      foundation_hits,
      foundation_misses,
      route: "none",
      escalated: false,
      reply: built.reply,
      language,
      primary_intent_label: "assistant_capabilities"
    };
  }

  // S1 clinical suppress
  if (interp.signals.clinical_or_suitability || hasIntent(interp, "clinical")) {
    actions.push("S1_clinical_phone");
    suppressed.push("booking", "online_registration");
    const built = buildResponse(language, { intent: "clinical_or_urgent" });
    return {
      actions,
      suppressed,
      foundation_hits,
      foundation_misses,
      route: "phone",
      escalated: true,
      reply: built.reply,
      language,
      primary_intent_label: "clinical_or_urgent"
    };
  }

  // D2 — unsupported ask family (Foundation absence), even if AI linked a service entity
  if (patientMessage && UNSUPPORTED_ASK_FAMILY.test(patientMessage)) {
    actions.push("D2_unsupported_absence_family_handoff");
    foundation_misses.push("unsupported_ask_family");
    suppressed.push("service_info_substitution");
    const built = buildResponse(language, { intent: "unknown" });
    return {
      actions,
      suppressed,
      foundation_hits,
      foundation_misses,
      route: "option_c",
      escalated: true,
      reply: built.reply,
      language,
      primary_intent_label: "unknown"
    };
  }

  if (interp.signals.unsupported_or_ambiguous && interp.intents.length === 0) {
    actions.push("ambiguous_unknown");
    const built = buildResponse(language, { intent: "unknown" });
    return {
      actions,
      suppressed,
      foundation_hits,
      foundation_misses,
      route: "option_c",
      escalated: true,
      reply: built.reply,
      language,
      primary_intent_label: "unknown"
    };
  }

  const wantPrice = hasIntent(interp, "price");
  const wantAvail = interp.signals.availability || hasIntent(interp, "availability");
  const wantBook = interp.signals.booking !== "none" || hasIntent(interp, "booking");
  const sid = serviceId(interp);

  // D3 — informational blocks that compose with booking/availability (hours, location, …)
  const infoMap: Array<{ type: string; intent: IntentResult["intent"] }> = [
    { type: "clinic_hours", intent: "clinic_hours" },
    { type: "clinic_location", intent: "clinic_location" },
    { type: "parking", intent: "parking" },
    { type: "contact", intent: "contact" },
    { type: "first_appointment_prep", intent: "first_appointment_prep" },
    { type: "first_visit_expectations", intent: "first_visit_expectations" },
    { type: "assistant_capabilities", intent: "assistant_capabilities" },
    { type: "language_switch", intent: "language_switch" }
  ];

  for (const row of infoMap) {
    if (!hasIntent(interp, row.type)) continue;
    actions.push(`C4_info:${row.type}`);
    foundation_hits.push(row.type);
    const built = buildResponse(language, { intent: row.intent });
    parts.push(built.reply);
    primary_intent_label = row.intent;
  }

  // Composable price
  if (wantPrice) {
    primary_intent_label = "price_info";
    if (sid) {
      const prices = knowledgeService.getPrices();
      const hit = prices.find((p) => p.serviceId === sid);
      if (hit) {
        foundation_hits.push(`price:${sid}`);
        actions.push("C1_price");
        const intentResult: IntentResult = {
          intent: "price_info",
          serviceId: sid,
          ...(wantAvail ? { appendAvailabilityGuidance: true as const } : {}),
          ...(wantBook && !wantAvail
            ? {
                appendBookingGuidance: true as const,
                bookingRoute: bookingRouteFor(interp)
              }
            : {})
        };
        if (wantAvail) actions.push("C2_availability");
        if (wantBook && !wantAvail) {
          actions.push("C3_booking");
          route = bookingRouteFor(interp);
        } else if (wantAvail) {
          route = "contact";
        }
        const built = buildResponse(language, intentResult);
        parts.push(built.reply);
      } else {
        foundation_misses.push(`price:${sid}`);
        actions.push("price_miss_clarify_or_handoff");
        const built = buildResponse(language, {
          intent: "price_info",
          needsServiceClarification: true
        });
        parts.push(built.reply);
      }
    } else {
      actions.push("C1_price_clarify");
      const built = buildResponse(language, {
        intent: "price_info",
        needsServiceClarification: true,
        ...(wantAvail ? { appendAvailabilityGuidance: true as const } : {}),
        ...(wantBook && !wantAvail
          ? { appendBookingGuidance: true as const, bookingRoute: bookingRouteFor(interp) }
          : {})
      });
      parts.push(built.reply);
      if (wantAvail) {
        actions.push("C2_availability");
        route = "contact";
      }
    }
  } else if (wantAvail && !wantBook) {
    actions.push("C2_availability");
    route = "contact";
    primary_intent_label = "booking_request";
    const built = buildResponse(language, {
      intent: "booking_request",
      availabilityOnly: true
    });
    parts.push(built.reply);
  } else if (wantAvail && wantBook) {
    // Availability restriction takes messaging priority for slots; booking route still contact/online per D1
    actions.push("C2_availability");
    route = bookingRouteFor(interp);
    primary_intent_label = "booking_request";
    const built = buildResponse(language, {
      intent: "booking_request",
      availabilityOnly: true
    });
    parts.push(built.reply);
  } else if (wantBook) {
    actions.push("C3_booking");
    const br = bookingRouteFor(interp);
    route = br;
    primary_intent_label = "booking_request";
    const built = buildResponse(language, {
      intent: "booking_request",
      bookingRoute: br
    });
    parts.push(built.reply);
  }

  // D2 relationship: service_info only authorises service-description fact for that id
  if (hasIntent(interp, "service_info") && !wantPrice && !wantBook && !wantAvail) {
    if (sid) {
      foundation_hits.push(`service_description:${sid}`);
      actions.push("C4_service_description");
      primary_intent_label = "service_info";
      const built = buildResponse(language, { intent: "service_info", serviceId: sid });
      parts.push(built.reply);
    } else {
      // Unresolved service informational ask — do not dump full catalogue as if answering
      foundation_misses.push("service_description:unresolved");
      actions.push("D2_unresolved_service_info_clarify");
      primary_intent_label = "service_info";
      const built = buildResponse(language, {
        intent: "price_info",
        needsServiceClarification: true
      });
      // Reuse clarify phrasing is imperfect; prefer short contact/unknown
      const fallback = buildResponse(language, { intent: "unknown" });
      parts.push(fallback.reply);
      escalated = true;
      route = "option_c";
    }
  }

  if (hasIntent(interp, "about_clinic") && !parts.length) {
    actions.push("C4_about");
    foundation_hits.push("about_clinic");
    primary_intent_label = "about_clinic";
    const built = buildResponse(language, { intent: "about_clinic", aboutFocus: "default" });
    parts.push(built.reply);
  }

  if (parts.length === 0) {
    if (hasIntent(interp, "other") || interp.signals.unsupported_or_ambiguous) {
      actions.push("foundation_or_unsupported_handoff");
      foundation_misses.push("no_authorised_block");
    } else {
      actions.push("safe_unknown");
    }
    const built = buildResponse(language, { intent: "unknown" });
    escalated = true;
    route = "option_c";
    primary_intent_label = "unknown";
    parts.push(built.reply);
  }

  return {
    actions,
    suppressed,
    foundation_hits,
    foundation_misses,
    route,
    escalated,
    reply: parts.join("\n\n"),
    language,
    primary_intent_label
  };
};
