/**
 * Phase 2D — deterministic policy + Foundation assembly from Interpretation v1.
 * Hardening: D1 unresolved booking→contact; D2 ask-family Foundation gate;
 * D3 composable info+booking; D4 greeting/empty→capabilities.
 * Pre-3B F1/F2: clinical judgement ≠ urgency; mixed turns keep Foundation facts.
 */
import { buildResponse } from "../responseBuilder";
import { knowledgeService } from "../knowledgeService";
import { IntentResult } from "../../types/knowledge";
import { SupportedLanguage } from "../../types/message";
import { normalizeText } from "../../utils/normalizeText";
import { InterpretationV1 } from "./validateInterpretation";

const ONLINE_BOOKABLE = new Set(["professional_hygiene", "diagnostics"]);

/** Foundation absence families — authorised non-answers (not Understanding synonym rescue). */
const UNSUPPORTED_ASK_FAMILY =
  /ligoniu\s*kas|ligonių\s*kas|kompensuoj|draudim|insurance|reimburs|issimoket|išsimoket|installment|financin|moketi\s*dalimis|mokėti\s*dalimis/i;

/**
 * Urgency subset of already-authorised clinical safety lexicon (classifier clinical_or_urgent).
 * Not a new clinical catalogue — Pre-3B F1: judgement alone must not use emergency S1.
 */
const URGENCY_CUES = [
  "stiprus skausmas",
  "kraujuoja",
  "urgent",
  "urgently",
  "emergency",
  "bleeding",
  "severe pain",
  "skubiai",
  "skubos tvarka",
  "nedelsiant"
];

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

/** D1 + F4: online for hygiene/diagnostics; consultation cue on message → online even if specialty id resolved. */
const bookingRouteFor = (
  interp: InterpretationV1,
  patientMessage = ""
): "online_registration" | "contact" => {
  const sid = serviceId(interp);
  const n = normalizeText(patientMessage);
  const hasConsultationCue =
    n.includes("konsultac") || n.includes("consultation") || n.includes("consult");
  if (sid === "professional_hygiene" || sid === "diagnostics") return "online_registration";
  if (hasConsultationCue) return "online_registration";
  if (sid && !ONLINE_BOOKABLE.has(sid)) return "contact";
  // Unresolved / null service without consultation cue → contact (D1)
  return "contact";
};

/** Same cues as v1.1 classifier looksLikeLaboratoryQuestion — lab is not a patient service. */
const isLaboratoryAsk = (patientMessage: string): boolean => {
  const n = normalizeText(patientMessage);
  return n.includes("laborator") || n.includes("dental lab") || n.includes("in-house lab");
};

/** Whole-token match only — `nekraujuoja` must not match `kraujuoja`. */
const hasAuthorisedUrgencySignal = (patientMessage: string): boolean => {
  const n = normalizeText(patientMessage);
  if (!n) return false;
  const tokens = new Set(n.split(" ").filter(Boolean));
  return URGENCY_CUES.some((cue) => {
    const c = normalizeText(cue);
    if (!c) return false;
    if (c.includes(" ")) {
      return n.includes(c) && c.split(" ").every((part) => tokens.has(part));
    }
    return tokens.has(c);
  });
};

const clinicalAssessmentCopy = (language: SupportedLanguage): string => {
  const fb = knowledgeService.getFallback();
  return fb.clinicalAssessment?.[language] ?? fb.clinicalOrUrgent[language];
};

/**
 * Controlled single-slot schema bridge (temporary Schema v1 accommodation):
 * When interpretation established price/service_info but id is null, recover
 * explicitly named Foundation services from the current patient message only.
 * - price: exactly one recovered id → governed price (F5a); never multi-price here (F5b)
 * - service_info: may surface multiple explicit capability facts (R7)
 * Not a general-purpose classifier; no symptom→service inference.
 */
const matchExplicitFoundationServiceIds = (patientMessage: string): string[] => {
  const n = normalizeText(patientMessage);
  if (!n) return [];
  const matched: string[] = [];
  for (const service of knowledgeService.getServices()) {
    const stems = [
      ...service.keywords.lt,
      ...service.keywords.en,
      service.name.lt,
      service.name.en
    ].map((s) => normalizeText(s)).filter((s) => s.length >= 4);
    const hit = stems.some((stem) => n.includes(stem));
    if (hit) matched.push(service.id);
  }
  return matched;
};

const emitGovernedPrice = (
  language: SupportedLanguage,
  serviceIdForPrice: string,
  extras: {
    wantAvail: boolean;
    wantBook: boolean;
    interp: InterpretationV1;
    patientMessage: string;
  }
): {
  ok: boolean;
  reply?: string;
  actions: string[];
  foundation_hits: string[];
  foundation_misses: string[];
  route?: string;
} => {
  const actions: string[] = [];
  const foundation_hits: string[] = [];
  const foundation_misses: string[] = [];
  const prices = knowledgeService.getPrices();
  const hit = prices.find((p) => p.serviceId === serviceIdForPrice);
  if (!hit) {
    foundation_misses.push(`price:${serviceIdForPrice}`);
    return { ok: false, actions, foundation_hits, foundation_misses };
  }
  foundation_hits.push(`price:${serviceIdForPrice}`);
  actions.push("C1_price");
  let route: string | undefined;
  const intentResult: IntentResult = {
    intent: "price_info",
    serviceId: serviceIdForPrice,
    ...(extras.wantAvail ? { appendAvailabilityGuidance: true as const } : {}),
    ...(extras.wantBook && !extras.wantAvail
      ? {
          appendBookingGuidance: true as const,
          bookingRoute: bookingRouteFor(extras.interp, extras.patientMessage)
        }
      : {})
  };
  if (extras.wantAvail) actions.push("C2_availability");
  if (extras.wantBook && !extras.wantAvail) {
    actions.push("C3_booking");
    route = bookingRouteFor(extras.interp, extras.patientMessage);
  } else if (extras.wantAvail) {
    route = "contact";
  }
  const built = buildResponse(language, intentResult);
  return { ok: true, reply: built.reply, actions, foundation_hits, foundation_misses, route };
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

  const hasClinicalJudgement =
    interp.signals.clinical_or_suitability || hasIntent(interp, "clinical");
  const hasUrgency = hasAuthorisedUrgencySignal(patientMessage);

  // F1/F2 — urgent: safety-first; suppress diluting price/booking/availability
  if (hasClinicalJudgement && hasUrgency) {
    actions.push("S1_urgent_phone");
    suppressed.push("booking", "online_registration", "availability", "price_tourism");
    const urgent = buildResponse(language, { intent: "clinical_or_urgent" });
    parts.push(urgent.reply);
    const sidUrgent = serviceId(interp);
    if (hasIntent(interp, "service_info") && sidUrgent && !hasIntent(interp, "price")) {
      foundation_hits.push(`service_description:${sidUrgent}`);
      actions.push("S1_urgent_allow_capability_fact");
      const built = buildResponse(language, { intent: "service_info", serviceId: sidUrgent });
      parts.push(built.reply);
    }
    return {
      actions,
      suppressed,
      foundation_hits,
      foundation_misses,
      route: "phone",
      escalated: true,
      reply: parts.join("\n\n"),
      language,
      primary_intent_label: "clinical_or_urgent"
    };
  }

  // F1 — clinical judgement without urgency: assessment/contact; keep composing Foundation (F2)
  let clinicalJudgementActive = false;
  if (hasClinicalJudgement && !hasUrgency) {
    clinicalJudgementActive = true;
    actions.push("S1_clinical_assessment");
    suppressed.push("booking", "online_registration");
    parts.push(clinicalAssessmentCopy(language));
    route = "contact";
    primary_intent_label = "clinical_or_urgent";
    escalated = false;
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
  const wantAvail =
    !clinicalJudgementActive &&
    (interp.signals.availability || hasIntent(interp, "availability"));
  const wantBook =
    !clinicalJudgementActive &&
    (interp.signals.booking !== "none" || hasIntent(interp, "booking"));
  const sid = serviceId(interp);

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
    if (!clinicalJudgementActive) primary_intent_label = row.intent;
  }

  if (wantPrice) {
    if (!clinicalJudgementActive) primary_intent_label = "price_info";
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
                bookingRoute: bookingRouteFor(interp, patientMessage)
              }
            : {})
        };
        if (wantAvail) actions.push("C2_availability");
        if (wantBook && !wantAvail) {
          actions.push("C3_booking");
          route = bookingRouteFor(interp, patientMessage);
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
      // F5a — single-slot price bridge: exactly one explicit Foundation service in message
      const recovered = matchExplicitFoundationServiceIds(patientMessage);
      if (recovered.length === 1) {
        const bridged = emitGovernedPrice(language, recovered[0], {
          wantAvail,
          wantBook,
          interp,
          patientMessage
        });
        actions.push("F5a_single_slot_price_bridge", ...bridged.actions);
        foundation_hits.push(...bridged.foundation_hits);
        foundation_misses.push(...bridged.foundation_misses);
        if (bridged.ok && bridged.reply) {
          parts.push(bridged.reply);
          if (bridged.route) route = bridged.route;
        } else {
          actions.push("C1_price_clarify");
          const built = buildResponse(language, {
            intent: "price_info",
            needsServiceClarification: true
          });
          parts.push(built.reply);
        }
      } else {
        // 0 matches → clarify; 2+ matches → F5b multi-price (do not auto-compose)
        if (recovered.length > 1) {
          actions.push("F5b_multi_price_not_bridged");
          foundation_misses.push("price:multi_explicit_services");
        }
        actions.push("C1_price_clarify");
        const built = buildResponse(language, {
          intent: "price_info",
          needsServiceClarification: true,
          ...(wantAvail ? { appendAvailabilityGuidance: true as const } : {}),
          ...(wantBook && !wantAvail
            ? { appendBookingGuidance: true as const, bookingRoute: bookingRouteFor(interp, patientMessage) }
            : {})
        });
        parts.push(built.reply);
        if (wantAvail) {
          actions.push("C2_availability");
          route = "contact";
        }
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
    actions.push("C2_availability");
    route = bookingRouteFor(interp, patientMessage);
    primary_intent_label = "booking_request";
    const built = buildResponse(language, {
      intent: "booking_request",
      availabilityOnly: true
    });
    parts.push(built.reply);
  } else if (wantBook) {
    actions.push("C3_booking");
    const br = bookingRouteFor(interp, patientMessage);
    route = br;
    primary_intent_label = "booking_request";
    const built = buildResponse(language, {
      intent: "booking_request",
      bookingRoute: br
    });
    parts.push(built.reply);
  }

  if (hasIntent(interp, "service_info") && !wantPrice && !wantBook && !wantAvail) {
    if (sid) {
      foundation_hits.push(`service_description:${sid}`);
      actions.push("C4_service_description");
      if (!clinicalJudgementActive) primary_intent_label = "service_info";
      const built = buildResponse(language, { intent: "service_info", serviceId: sid });
      parts.push(built.reply);
    } else if (interp.service_or_topic?.id == null) {
      // F6 lab: AI often labels lab asks as service_info; lab is Foundation fallback, not a service id
      if (isLaboratoryAsk(patientMessage)) {
        actions.push("F6_laboratory_info");
        foundation_hits.push("fallback.laboratoryInfo");
        primary_intent_label = "about_clinic";
        const built = buildResponse(language, {
          intent: "about_clinic",
          laboratoryInfo: true
        });
        parts.push(built.reply);
      } else {
      // Single-slot schema bridge: explicit Foundation names in current message (R7 / F6 children)
      const recoveredIds = matchExplicitFoundationServiceIds(patientMessage);
      if (recoveredIds.length > 0) {
        actions.push(
          clinicalJudgementActive ? "F2_single_slot_schema_bridge" : "F6_single_slot_service_bridge"
        );
        const capabilityReplies: string[] = [];
        for (const recoveredId of recoveredIds) {
          foundation_hits.push(`service_description:${recoveredId}`);
          actions.push(`C4_service_description_bridged:${recoveredId}`);
          const built = buildResponse(language, {
            intent: "service_info",
            serviceId: recoveredId
          });
          capabilityReplies.push(built.reply);
        }
        if (clinicalJudgementActive) {
          parts.unshift(...capabilityReplies);
        } else {
          parts.push(...capabilityReplies);
          primary_intent_label = "service_info";
        }
      } else if (clinicalJudgementActive) {
        foundation_misses.push("service_description:unresolved_under_clinical");
        actions.push("F2_bridge_no_explicit_foundation_match");
      } else {
        foundation_misses.push("service_description:unresolved");
        actions.push("D2_unresolved_service_info_clarify");
        primary_intent_label = "service_info";
        const fallback = buildResponse(language, { intent: "unknown" });
        parts.push(fallback.reply);
        escalated = true;
        route = "option_c";
      }
      }
    } else if (!clinicalJudgementActive) {
      foundation_misses.push("service_description:unresolved");
      actions.push("D2_unresolved_service_info_clarify");
      primary_intent_label = "service_info";
      const fallback = buildResponse(language, { intent: "unknown" });
      parts.push(fallback.reply);
      escalated = true;
      route = "option_c";
    }
  }

  if (hasIntent(interp, "about_clinic") && !parts.length) {
    const n = normalizeText(patientMessage);
    const isNameAsk =
      /\b(name of (the )?clinic|clinic('?s)? name|how do you spell|what('?s| is) your clinic called|koks (yra )?pavadinimas|kaip vadinasi|klinikos pavadinimas)\b/.test(
        n
      ) ||
      (n.includes("spell") && n.includes("clinic")) ||
      (n.includes("pavadinim") && n.includes("klinik"));

    if (isNameAsk) {
      actions.push("F6_clinic_name");
      foundation_hits.push("clinic_profile.clinicName");
      primary_intent_label = "about_clinic";
      const name = knowledgeService.getClinicProfile().clinicName;
      parts.push(
        language === "en"
          ? `Our clinic is called ${name}.`
          : `Mūsų klinikos pavadinimas — ${name}.`
      );
    } else if (isLaboratoryAsk(patientMessage)) {
      actions.push("F6_laboratory_info");
      foundation_hits.push("fallback.laboratoryInfo");
      primary_intent_label = "about_clinic";
      const built = buildResponse(language, {
        intent: "about_clinic",
        laboratoryInfo: true
      });
      parts.push(built.reply);
    } else {
      actions.push("C4_about");
      foundation_hits.push("about_clinic");
      primary_intent_label = "about_clinic";
      const built = buildResponse(language, { intent: "about_clinic", aboutFocus: "default" });
      parts.push(built.reply);
    }
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
