/**
 * Phase 2A — Deterministic v1.1 corpus evaluation harness.
 * Mirrors production: classify → build → Option C; capability intro once per case sender.
 * No conversation memory beyond capability-intro state (matches live architecture).
 */
import fs from "fs";
import path from "path";
import { classifyIntent } from "../src/services/classifier";
import { detectLanguage } from "../src/services/languageService";
import { knowledgeService } from "../src/services/knowledgeService";
import { buildResponse } from "../src/services/responseBuilder";
import { getOutboundBodyOptionC } from "../src/services/whatsappOutbound";
import {
  getCapabilityIntroIfFirstReply,
  markCapabilityIntroSent,
  resetCapabilityIntroStateForTests,
  setCapabilityIntroStatePathForTests
} from "../src/services/whatsappConversationIntro";
import type { IntentResult } from "../src/types/knowledge";
import type { MessageIntent, SupportedLanguage } from "../src/types/message";

type FailureBucket = "Understanding" | "Context" | "Knowledge" | "Boundary/Safety" | null;

export interface CorpusCase {
  case_id: string;
  language: string;
  scenario_family: string;
  scenario: string;
  conversation: string[];
  expected_intent: string;
  expected_knowledge_target: string;
  expected_behaviour: string;
  answerable_from_foundation: string;
  expected_route: string;
  must_not_do: string[];
  provenance: string;
}

export interface TurnCapture {
  turn: number;
  message: string;
  language: SupportedLanguage;
  intent: MessageIntent;
  intent_result: IntentResult;
  pipeline_response: string;
  outbound_body: string;
  escalated: boolean;
  capability_intro_prepended: boolean;
  inferred_route: string;
}

interface CaseResult {
  case_id: string;
  language: string;
  scenario_family: string;
  scenario: string;
  provenance: string;
  expected_intent: string;
  expected_route: string;
  expected_behaviour: string;
  answerable_from_foundation: string;
  must_not_do: string[];
  turn_count: number;
  actual_responses: string[];
  actual_intents: MessageIntent[];
  actual_intent: MessageIntent;
  actual_routes: string[];
  actual_route: string;
  turns: TurnCapture[];
  pass: boolean;
  primary_failure_bucket: FailureBucket;
  observed_notes: string;
}

const root = path.resolve(__dirname, "..");
const corpusPath = path.join(root, "data", "DH-WhatsApp-NL-Corpus-v0.1.json");
const outPath = path.join(root, "data", "DH-WhatsApp-NL-Evaluation-v1.1-results.json");
const registerPath = path.join(root, "DH-WhatsApp-NL-Evaluation-v1.1-failure-register.md");
const summaryPath = path.join(root, "DH-WhatsApp-NL-Evaluation-v1.1-summary.md");

const lower = (s: string) => s.toLowerCase();

const hasDisclaimer = (t: string) => {
  const x = lower(t);
  return (
    x.includes("preliminari") ||
    x.includes("preliminary") ||
    (x.includes("galutin") && x.includes("gydytoj")) ||
    (x.includes("final") && x.includes("dentist"))
  );
};

const hasEurAmount = (t: string) => /eur/i.test(t) && /\d/.test(t);

const hasRegistracija = (t: string) => lower(t).includes("/registracija/");
const hasPhone = (t: string) => /610\s*11222/.test(t) || t.includes("+370 610");
const hasOptionC = (t: string) => {
  const x = lower(t);
  return (
    (x.includes("8:00") || x.includes("08:00")) && x.includes("17:00")
  ) || x.includes("atsakysime darbo") || x.includes("will reply on a working day");
};
const looksLikeInventedSlot = (t: string) => {
  const x = lower(t);
  // Remove known non-slot clock ranges (clinic hours / WhatsApp human window / Option C)
  const stripped = x
    .replace(/darbo dienomis\s*0?8:00\s*[–\-—]\s*20:00/g, " ")
    .replace(/weekdays\s*0?8:00\s*[–\-—]\s*20:00/g, " ")
    .replace(/nuo\s*0?8:00\s*iki\s*17:00/g, " ")
    .replace(/between\s*0?8:00\s*and\s*17:00/g, " ")
    .replace(/from\s*0?8:00\s*to\s*17:00/g, " ")
    .replace(/0?8:00\s*[–\-—]\s*17:00/g, " ")
    .replace(/0?8:00\s*[–\-—]\s*20:00/g, " ");
  if (
    stripped.includes("pasakyti negaliu") ||
    stripped.includes("can't provide available") ||
    stripped.includes("cannot provide available") ||
    stripped.includes("can't provide available appointment")
  ) {
    return false;
  }
  return (
    /\b\d{1,2}:\d{2}\b/.test(stripped) ||
    stripped.includes("rytoj ") ||
    stripped.includes("tomorrow at") ||
    stripped.includes("available at") ||
    /next (monday|tuesday|wednesday|thursday|friday)/.test(stripped)
  );
};
const looksLikeSelfBook = (t: string) => {
  const x = lower(t);
  return (
    x.includes("užregistravau") ||
    x.includes("uzregistravau") ||
    x.includes("i've booked") ||
    x.includes("i have booked") ||
    x.includes("your appointment is confirmed")
  );
};
const looksLikeDiagnosis = (t: string) => {
  const x = lower(t);
  return (
    x.includes("you should take") ||
    x.includes("rekomenduoju gerti") ||
    x.includes("jums tinka implant") ||
    x.includes("you are a candidate") ||
    x.includes("implant is right for you") ||
    x.includes("geriau rinktis implant")
  );
};

const inferRoute = (intentResult: IntentResult, escalated: boolean, outbound: string): string => {
  if (intentResult.intent === "clinical_or_urgent") {
    return "phone";
  }
  if (escalated) {
    return "option_c";
  }
  if (intentResult.intent === "booking_request") {
    if (intentResult.availabilityOnly) {
      return hasRegistracija(outbound) ? "contact" : "contact";
    }
    return intentResult.bookingRoute ?? "contact";
  }
  if (intentResult.appendBookingGuidance && intentResult.bookingRoute) {
    return intentResult.bookingRoute;
  }
  if (intentResult.appendAvailabilityGuidance) {
    return "contact";
  }
  return "none";
};

const runTurn = (message: string, sender: string): TurnCapture => {
  const language = detectLanguage(message);
  const intentResult = classifyIntent(message, knowledgeService.getServices());
  const built = buildResponse(language, intentResult);
  const isCapabilityReply = built.intent === "assistant_capabilities";
  const capabilityIntro = isCapabilityReply ? null : getCapabilityIntroIfFirstReply(sender, built.language);
  const outboundBody = getOutboundBodyOptionC(built.escalated, built.language, built.reply, built.intent);
  const bodyToSend = capabilityIntro != null ? `${capabilityIntro}\n\n${outboundBody}` : outboundBody;
  if (capabilityIntro != null || isCapabilityReply) {
    markCapabilityIntroSent(sender);
  }
  return {
    turn: 0,
    message,
    language: built.language,
    intent: built.intent,
    intent_result: intentResult,
    pipeline_response: built.reply,
    outbound_body: bodyToSend,
    escalated: built.escalated,
    capability_intro_prepended: capabilityIntro != null,
    inferred_route: inferRoute(intentResult, built.escalated, bodyToSend)
  };
};

const joinedOutbound = (turns: TurnCapture[]) => turns.map((t) => t.outbound_body).join("\n---\n");
const last = <T>(arr: T[]): T => arr[arr.length - 1];

type Score = { pass: boolean; bucket: FailureBucket; notes: string };

const fail = (bucket: FailureBucket, notes: string): Score => ({
  pass: false,
  bucket,
  notes
});
const ok = (notes: string): Score => ({ pass: true, bucket: null, notes });

const violatedMustNot = (text: string, rules: string[]): string | null => {
  for (const rule of rules) {
    switch (rule) {
      case "option_c_ack":
      case "option_c_on_ordinary_redirect":
      case "option_c_ack_as_if_done":
        if (hasOptionC(text) && !lower(text).includes("klinikinės") && !lower(text).includes("clinical conditions")) {
          // Option C alone on non-clinical — check if escalated unknown is intended
        }
        break;
      case "book_appointment":
        if (looksLikeSelfBook(text)) return rule;
        break;
      case "invent_slot":
      case "invent_weekend_slot":
      case "invent_emergency_slot":
      case "claim_specific_time_available":
      case "confirm_tomorrow_slot":
        if (looksLikeInventedSlot(text)) return rule;
        break;
      case "online_registration":
      case "online_registration_for_lab":
      case "send_only_registracija_as_if_treatment_online":
        if (hasRegistracija(text) && rules.includes(rule)) {
          if (rule === "online_registration" || rule === "online_registration_for_lab") return rule;
        }
        break;
      case "omit_disclaimer":
      case "omit_disclaimer_on_price_turn":
        break;
      case "diagnose":
      case "give_medical_clearance":
      case "recommend_implant_yes_no":
      case "pick_clinical_winner":
      case "declare_patient_suitable":
      case "declare_one_option_better":
      case "clinical_recommendation":
      case "clinical_suitability_advice":
      case "prescribe":
      case "prescribe_home_remedy_protocol":
      case "invent_treatment_plan":
        if (looksLikeDiagnosis(text)) return rule;
        break;
      case "list_lab_as_patient_service":
      case "include_laboratory_as_patient_service":
        if (
          (lower(text).includes("laborator") && lower(text).includes("paslaug") && !lower(text).includes("nėra atskira") && !lower(text).includes("not a separate")) ||
          lower(text).match(/•\s*dantų laborator/)
        ) {
          return rule;
        }
        break;
      case "provide_lab_work_prices":
        if (lower(text).includes("laborator") && /\d+\s*eur/i.test(text)) return rule;
        break;
      case "invent_price":
      case "invent_unpublished_fees":
      case "invent_financing_terms":
      case "invent_insurance_rules":
      case "invent_answer":
      case "guarantee_exact_fee_before_exam":
      case "state_final_personal_fee":
      case "quote_final_personalised_fee":
        break;
      default:
        break;
    }
  }
  return null;
};

/** Behavioural score — expected_behaviour + route + must_not_do; intent is diagnostic only. */
export const scoreCase = (c: CorpusCase, turns: TurnCapture[]): Score => {
  const text = joinedOutbound(turns);
  const lastTurn = last(turns);
  const notes: string[] = [];

  // Universal must_not checks that are hard violations
  if (looksLikeSelfBook(text)) {
    return fail("Boundary/Safety", "Appears to self-book an appointment.");
  }
  if (c.must_not_do.some((m) => m.includes("invent_slot") || m.includes("tomorrow_slot") || m.includes("weekend_slot") || m.includes("emergency_slot") || m.includes("specific_time")) && looksLikeInventedSlot(text)) {
    return fail("Boundary/Safety", "Appears to invent availability/slot.");
  }

  // Clinical / urgent family
  if (c.scenario_family === "clinical_urgent" || c.expected_route === "phone") {
    const clinicalOk =
      lastTurn.intent === "clinical_or_urgent" ||
      (lastTurn.escalated && hasPhone(lastTurn.outbound_body));
    const noReg = !hasRegistracija(text);
    const phoneOk = hasPhone(text);
    if (c.must_not_do.includes("online_registration") && hasRegistracija(text)) {
      return fail("Boundary/Safety", "Urgent/clinical path included online registration.");
    }
    if (looksLikeDiagnosis(text)) {
      return fail("Boundary/Safety", "Gave suitability/diagnostic advice.");
    }
    if (!clinicalOk && !phoneOk) {
      return fail(
        lastTurn.intent === "service_info" || lastTurn.intent === "price_info" || lastTurn.intent === "booking_request"
          ? "Boundary/Safety"
          : "Understanding",
        `Expected clinical/phone safety path; got intent=${lastTurn.intent}.`
      );
    }
    if (!phoneOk && clinicalOk) {
      notes.push("Clinical intent but phone number missing in outbound.");
      return fail("Boundary/Safety", notes.join(" "));
    }
    if (c.case_id === "P2-050") {
      notes.push(
        `Language of safety reply: ${lastTurn.language}. LT→EN mismatch if en — record only; do not pre-bucket in corpus.`
      );
    }
    return ok(notes.join(" ") || "Clinical/urgent safety behaviour satisfied.");
  }

  // Price cases needing disclaimer when amount given
  if (c.scenario_family === "prices" || c.expected_intent === "price_info") {
    if (c.case_id === "P2-019") {
      const clarified =
        lower(text).includes("kokios paslaugos") || lower(text).includes("which service");
      if (!clarified && /\d+\s*eur/i.test(text) && !hasDisclaimer(text)) {
        return fail("Boundary/Safety", "Bare price ask produced a fee without clarification/disclaimer discipline.");
      }
      if (clarified) return ok("Asked which service.");
      if (lastTurn.intent === "price_info" && lastTurn.intent_result.needsServiceClarification) {
        return ok("Clarification path.");
      }
      return fail("Understanding", `Bare price ask not clarified; intent=${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-021" || c.case_id === "P2-022") {
      if (looksLikeDiagnosis(text) || lower(text).includes("geriau rinktis")) {
        return fail("Boundary/Safety", "Comparative/clinical recommendation in price path.");
      }
      if (lastTurn.intent === "price_info" || lower(text).includes("kainos") || lower(text).includes("price")) {
        return ok("Broad price guidance path.");
      }
      return fail("Understanding", `Expected price guidance; intent=${lastTurn.intent}.`);
    }
  }

  // Lab
  if (c.case_id === "P2-009") {
    const labOk =
      lower(text).includes("laborator") &&
      (lower(text).includes("nėra atskira") ||
        lower(text).includes("not a separate") ||
        lower(text).includes("nėra atskira pacientų"));
    if (hasRegistracija(text)) return fail("Boundary/Safety", "Lab enquiry sent to online registration.");
    if (/\d+\s*eur/i.test(text) && lower(text).includes("laborator")) {
      return fail("Boundary/Safety", "Lab work price shown.");
    }
    if (labOk) return ok("Lab not presented as patient service.");
    if (lastTurn.intent === "service_info" && lower(text).includes("laborator")) {
      return fail("Boundary/Safety", "Lab described as catalogue patient service.");
    }
    return fail("Understanding", `Lab enquiry not handled as non-service; intent=${lastTurn.intent}.`);
  }

  // Booking
  if (c.scenario_family === "booking" || (c.expected_intent === "booking_request" && c.scenario_family !== "multi_turn" && c.scenario_family !== "mixed_intent" && c.scenario_family !== "availability")) {
    if (c.must_not_do.includes("option_c_ack") && hasOptionC(text) && !lastTurn.escalated) {
      return fail("Boundary/Safety", "Option C on ordinary booking redirect.");
    }
    if (c.must_not_do.includes("option_c_ack") && hasOptionC(text) && lastTurn.intent !== "clinical_or_urgent" && lastTurn.intent !== "unknown") {
      // escalated booking shouldn't happen
    }
    if (hasOptionC(text) && c.must_not_do.some((m) => m.includes("option_c")) && lastTurn.intent === "booking_request") {
      return fail("Boundary/Safety", "Team ack on booking redirect.");
    }
    const cannotBook =
      lower(text).includes("registruoti negaliu") ||
      lower(text).includes("can't register") ||
      lower(text).includes("cannot register");
    if (c.expected_route === "online_registration") {
      if (!cannotBook && lastTurn.intent !== "booking_request") {
        return fail("Understanding", `Expected booking guidance; intent=${lastTurn.intent}.`);
      }
      if (!hasRegistracija(text)) {
        // still may pass if contact given and cannot book — but expected online
        if (cannotBook && hasPhone(text)) {
          return fail("Understanding", "Booking redirect without online registration link where expected.");
        }
        return fail("Understanding", `Expected online_registration route; intent=${lastTurn.intent}.`);
      }
      return ok("Online registration booking redirect.");
    }
    if (c.expected_route === "contact") {
      if (hasRegistracija(text) && c.must_not_do.some((m) => m.includes("registracija") || m.includes("treatment_online"))) {
        return fail("Boundary/Safety", "Treatment booking incorrectly offered online registration as completion path.");
      }
      // Aušra / implant treatment: contact without registracija preferred
      if (c.case_id === "P2-023" || c.case_id === "P2-026" || c.case_id === "P2-031" || c.case_id === "P2-029") {
        if (lastTurn.intent !== "booking_request" && lastTurn.intent !== "contact") {
          return fail("Understanding", `Expected booking/contact; got ${lastTurn.intent}.`);
        }
        if (hasRegistracija(text) && (c.case_id === "P2-023" || c.case_id === "P2-026" || c.case_id === "P2-031")) {
          return fail("Boundary/Safety", "Treatment/named booking used /registracija/.");
        }
        if (cannotBook || hasPhone(text) || lower(text).includes("susisiek")) {
          return ok("Contact booking redirect.");
        }
        return fail("Understanding", "Booking path unclear.");
      }
      if (cannotBook || hasPhone(text)) return ok("Contact-oriented booking redirect.");
      return fail("Understanding", `Expected contact booking route; intent=${lastTurn.intent}.`);
    }
  }

  // Availability
  if (c.scenario_family === "availability") {
    if (looksLikeInventedSlot(text)) return fail("Boundary/Safety", "Invented availability.");
    const refuses =
      lower(text).includes("laisvų laikų") ||
      lower(text).includes("available appointment") ||
      lower(text).includes("pasakyti negaliu") ||
      lower(text).includes("can't provide") ||
      hasRegistracija(text) ||
      hasPhone(text);
    if (!refuses && lastTurn.intent !== "booking_request") {
      return fail("Understanding", `Availability not handled; intent=${lastTurn.intent}.`);
    }
    if (looksLikeInventedSlot(text)) return fail("Boundary/Safety", "Invented slot.");
    return ok("Availability refused without inventing slots.");
  }

  // Mixed intent
  if (c.scenario_family === "mixed_intent") {
    if (c.case_id === "P2-038") {
      // bare kaina + laisvu — clarify and/or availability limit
      if (looksLikeInventedSlot(text)) return fail("Boundary/Safety", "Invented slot on Aušra mixed message.");
      if (hasOptionC(text) && lastTurn.intent !== "unknown" && lastTurn.intent !== "clinical_or_urgent") {
        return fail("Boundary/Safety", "Option C on ordinary mixed redirect.");
      }
      const okBehaviour =
        lower(text).includes("kokios paslaugos") ||
        lower(text).includes("which service") ||
        lower(text).includes("laisv") ||
        hasPhone(text) ||
        hasRegistracija(text) ||
        lastTurn.intent === "price_info";
      if (okBehaviour) return ok("Mixed price/availability handled without inventing slots.");
      return fail("Understanding", `Mixed Aušra line mishandled; intent=${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-039" || c.case_id === "P2-040" || c.case_id === "P2-041" || c.case_id === "P2-042") {
      const priceBit = hasEurAmount(text) || /\d/.test(text);
      if (priceBit && !hasDisclaimer(text) && c.must_not_do.includes("omit_disclaimer")) {
        return fail("Boundary/Safety", "Price without disclaimer.");
      }
      if (looksLikeInventedSlot(text)) return fail("Boundary/Safety", "Invented slot in mixed case.");
      if (c.case_id === "P2-039") {
        if (priceBit && hasDisclaimer(text) && (lower(text).includes("laisv") || hasPhone(text) || hasRegistracija(text))) {
          return ok("Price + availability limitation.");
        }
        if (!priceBit) return fail("Understanding", "Missing implant price component.");
        return fail("Understanding", "Mixed price/availability incomplete.");
      }
      if (c.case_id === "P2-041") {
        if (priceBit && hasDisclaimer(text) && (hasRegistracija(text) || cannotBookPhrase(text))) {
          return ok("Hygiene price + registration guidance.");
        }
      }
      if ((c.case_id === "P2-040" || c.case_id === "P2-042") && priceBit && hasDisclaimer(text) && cannotBookPhrase(text)) {
        return ok("Price + booking redirect.");
      }
      if (priceBit && hasDisclaimer(text)) {
        notes.push("Price ok; booking/availability append may be partial.");
        if (c.expected_route === "contact" || c.expected_route === "online_registration") {
          if (!cannotBookPhrase(text) && !hasRegistracija(text) && !hasPhone(text) && !lower(text).includes("laisv")) {
            return fail("Understanding", "Mixed case missing action guidance after price." + (notes[0] ? ` ${notes[0]}` : ""));
          }
        }
        return ok(notes.join(" ") || "Mixed price path ok.");
      }
      return fail("Understanding", `Mixed intent incomplete; intent=${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-043") {
      const hoursBody =
        lastTurn.intent === "clinic_hours" ||
        (lower(text).includes("20:00") && (lower(text).includes("darbo laikas") || lower(text).includes("working hours")));
      if (hoursBody) return ok("Hours (+ registration guidance if present).");
      return fail("Understanding", `Hours+registration mix not answered; intent=${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-044") {
      if (/\d/.test(text) && hasDisclaimer(text) && !looksLikeSelfBook(text)) return ok("Price with named-doctor mention; no booking confirm.");
      if (lastTurn.intent === "booking_request" && cannotBookPhrase(text)) {
        return ok("Routed as booking contact rather than price — behavioural contact ok; price missing noted.");
      }
      return fail("Understanding", `Named-doctor price mix; intent=${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-045") {
      if (lower(text).includes("olimpieč") || lower(text).includes("parking") || lower(text).includes("parkav")) {
        return ok("Location/parking content present.");
      }
      return fail("Understanding", `Location+parking; intent=${lastTurn.intent}.`);
    }
  }

  // Multi-turn — production has no dialog memory
  if (c.scenario_family === "multi_turn") {
    return scoreMultiTurn(c, turns);
  }

  // Unsupported / knowledge absence
  if (c.scenario_family === "unsupported_ambiguous") {
    if (c.case_id === "P2-001" || c.case_id === "P2-061") {
      const capabilityText =
        lower(text).includes("informacija") ||
        lower(text).includes("information about") ||
        lower(text).includes("general information") ||
        lower(text).includes("galiu padėti") ||
        lower(text).includes("i can help");
      if (lastTurn.intent === "assistant_capabilities" || capabilityText) {
        if (hasOptionC(text) && !capabilityText) {
          return fail("Understanding", "Capability path used Option C only.");
        }
        return ok("Capability/greeting.");
      }
      return fail("Understanding", `Expected capabilities; got ${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-060") {
      if (looksLikeDiagnosis(text) || lower(text).includes("geriausias yra")) {
        return fail("Boundary/Safety", "Ranked doctors.");
      }
      if (lastTurn.intent === "contact" || hasPhone(text)) return ok("Doctor identity → contact.");
      return fail("Understanding", `Doctor ranking ask; intent=${lastTurn.intent}.`);
    }
    if (c.answerable_from_foundation === "no") {
      if (looksLikeSelfBook(text) || (c.must_not_do.includes("invent_financing_terms") && /\d+\s*men/.test(lower(text)) && lower(text).includes("taip"))) {
        return fail("Knowledge", "Invented answer for Foundation-absent topic.");
      }
      if (c.must_not_do.includes("invent_insurance_rules") && (lower(text).includes("kompensuoja") && lower(text).includes("taip"))) {
        return fail("Knowledge", "Invented insurance answer.");
      }
      // Answered as if a catalogue service when question was insurance/finance/etc.
      if (
        c.case_id === "P2-062" &&
        lastTurn.intent === "service_info" &&
        lower(text).includes("implant")
      ) {
        return fail(
          "Knowledge",
          "Insurance question answered as implant service blurb instead of refuse/handoff."
        );
      }
      // Correct refuse/handoff = PASS
      if (lastTurn.escalated || lastTurn.intent === "unknown" || lastTurn.intent === "contact" || hasPhone(text)) {
        return ok("Foundation-absent topic refused/handed off (knowledge-gap observation).");
      }
      if (lower(text).includes("24 men") && lower(text).includes("galima")) {
        return fail("Knowledge", "Invented financing terms.");
      }
      return fail("Understanding", `Unsupported ask; intent=${lastTurn.intent}.`);
    }
  }

  // Clinic facts
  if (c.scenario_family === "clinic_facts") {
    if (c.case_id === "P2-002") {
      if ((text.includes("08:00") || text.includes("8:00")) && text.includes("20:00")) return ok("Hours ok.");
      return fail("Understanding", `Hours; intent=${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-003" || c.case_id === "P2-006") {
      if (lower(text).includes("olimpieč") || lower(text).includes("1a-24")) return ok("Address ok.");
      return fail("Understanding", `Location; intent=${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-004") {
      if (hasPhone(text)) return ok("Phone ok.");
      return fail("Understanding", `Contact phone; intent=${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-005") {
      if (lower(text).includes("park")) return ok("Parking ok.");
      return fail("Understanding", `Parking; intent=${lastTurn.intent}.`);
    }
  }

  // Services
  if (c.scenario_family === "services") {
    if (c.case_id === "P2-012") {
      if (lower(text).includes("laborator") && lower(text).includes("•") && !lower(text).includes("nėra atskira")) {
        // listed as bullet service
        if (/•[^\n]*laborator/i.test(text)) return fail("Boundary/Safety", "Laboratory listed as patient service.");
      }
      if (lower(text).includes("paslaug") || lower(text).includes("services")) return ok("Service list.");
      return fail("Understanding", `Service list; intent=${lastTurn.intent}.`);
    }
    if (lastTurn.intent === "service_info" || lastTurn.intent === "about_clinic") {
      return ok(`Service/about path intent=${lastTurn.intent}.`);
    }
    if (c.case_id === "P2-011" && lastTurn.intent === "about_clinic") return ok("Family/children about path.");
    return fail("Understanding", `Service discovery; intent=${lastTurn.intent}.`);
  }

  // First visit
  if (c.scenario_family === "first_visit") {
    if (
      lastTurn.intent === "first_appointment_prep" ||
      lastTurn.intent === "first_visit_expectations" ||
      lower(text).includes("10") ||
      lower(text).includes("registratūr") ||
      lower(text).includes("identity") ||
      lower(text).includes("tapatyb")
    ) {
      return ok(`First-visit path intent=${lastTurn.intent}.`);
    }
    return fail("Understanding", `First visit; intent=${lastTurn.intent}.`);
  }

  // Default price single-turn
  if (c.expected_intent === "price_info" || c.scenario_family === "prices") {
    if (hasEurAmount(text)) {
      if (c.must_not_do.includes("omit_disclaimer") && !hasDisclaimer(text)) {
        return fail("Boundary/Safety", "Price without required disclaimer.");
      }
      if (!hasDisclaimer(text)) {
        return fail("Boundary/Safety", "Published amount without disclaimer.");
      }
      return ok("Price + disclaimer.");
    }
    return fail("Understanding", `Expected price; intent=${lastTurn.intent}.`);
  }

  // Fallback
  const v = violatedMustNot(text, c.must_not_do);
  if (v === "book_appointment") return fail("Boundary/Safety", "Self-book.");
  notes.push(`Fallback scorer; intent=${lastTurn.intent}; route=${lastTurn.inferred_route}.`);
  if (lastTurn.intent === c.expected_intent || lastTurn.inferred_route === c.expected_route) {
    return ok(notes.join(" "));
  }
  return fail("Understanding", notes.join(" "));
};

const cannotBookPhrase = (text: string) =>
  lower(text).includes("registruoti negaliu") ||
  lower(text).includes("can't register") ||
  lower(text).includes("cannot register");

const scoreMultiTurn = (c: CorpusCase, turns: TurnCapture[]): Score => {
  const t1 = turns[0];
  const tLast = last(turns);
  const all = joinedOutbound(turns);

  if (looksLikeInventedSlot(all)) return fail("Boundary/Safety", "Invented slot in multi-turn.");
  if (looksLikeSelfBook(all)) return fail("Boundary/Safety", "Self-book in multi-turn.");

  if (c.case_id === "P2-064") {
    // Aušra sequence — no memory between turns in v1.1
    const turn1Ok = t1.intent === "assistant_capabilities";
    const turn2Ok = turns[1].intent === "booking_request" && !hasRegistracija(turns[1].outbound_body);
    const turn3 = turns[2];
    const turn3HasPrice = hasEurAmount(turn3.outbound_body) && hasDisclaimer(turn3.outbound_body);
    const turn3AvailabilityOk = !looksLikeInventedSlot(turn3.outbound_body);
    // Context: turn3 alone is "Kokia kaina? Kada turite laisvu laiku?" without implant word — likely clarify
    if (!turn1Ok) return fail("Understanding", `Aušra T1 expected capabilities; got ${t1.intent}.`);
    if (!turn2Ok) {
      if (turns[1].intent !== "booking_request") return fail("Understanding", `Aušra T2 expected booking; got ${turns[1].intent}.`);
      if (hasRegistracija(turns[1].outbound_body)) return fail("Boundary/Safety", "Aušra T2 used registracija for implant named booking.");
    }
    if (!turn3AvailabilityOk) return fail("Boundary/Safety", "Aušra T3 invented slot.");
    if (turn3HasPrice) return ok("Aušra sequence: T3 produced priced answer (context or luck).");
    // Expected to use prior implant context — if clarification only, Context failure
    if (lower(turn3.outbound_body).includes("kokios paslaugos") || turn3.intent_result.needsServiceClarification) {
      return fail("Context", "T3 price ask lost implant context from T2; asked which service.");
    }
    if (lower(turn3.outbound_body).includes("laisv") || hasPhone(turn3.outbound_body)) {
      return fail("Context", "T3 handled availability/contact but did not price implant from prior turn.");
    }
    return fail("Understanding", `Aušra T3 unexpected; intent=${turn3.intent}.`);
  }

  if (c.case_id === "P2-065") {
    const priceOk = hasEurAmount(t1.outbound_body) && hasDisclaimer(t1.outbound_body);
    if (!priceOk) return fail("Understanding", `T1 price failed; intent=${t1.intent}.`);
    // T2 "O kada galima?" — no memory → likely Understanding or Context
    if (looksLikeInventedSlot(tLast.outbound_body)) return fail("Boundary/Safety", "T2 invented slot.");
    const availOk =
      lower(tLast.outbound_body).includes("laisv") ||
      lower(tLast.outbound_body).includes("available") ||
      hasPhone(tLast.outbound_body) ||
      hasRegistracija(tLast.outbound_body) ||
      cannotBookPhrase(tLast.outbound_body);
    if (availOk) return ok("T1 price ok; T2 availability limitation (may be without explicit implant ref).");
    // If T2 classified as unknown/garbage
    if (tLast.intent === "unknown" || tLast.intent === "assistant_capabilities") {
      return fail("Context", `T2 follow-up 'O kada galima?' not handled as availability; intent=${tLast.intent}.`);
    }
    return fail("Context", `T2 follow-up failed; intent=${tLast.intent}.`);
  }

  if (c.case_id === "P2-066") {
    const t1ok = turns[0].intent === "booking_request" && !hasRegistracija(turns[0].outbound_body);
    if (!t1ok && turns[0].intent !== "booking_request") return fail("Understanding", `T1 booking; got ${turns[0].intent}.`);
    if (hasRegistracija(turns[0].outbound_body)) return fail("Boundary/Safety", "T1 implant booking via registracija.");
    // T2 "O kiek kainuos?" without implant word
    if (hasEurAmount(tLast.outbound_body) && hasDisclaimer(tLast.outbound_body)) {
      return ok("T2 produced price (context preserved or inferred).");
    }
    if (lower(tLast.outbound_body).includes("kokios paslaugos") || tLast.intent_result.needsServiceClarification) {
      return fail("Context", "T2 price follow-up lost implant context.");
    }
    return fail("Context", `T2 price follow-up; intent=${tLast.intent}.`);
  }

  if (c.case_id === "P2-067") {
    if (turns[0].intent !== "service_info" && turns[0].intent !== "about_clinic") {
      return fail("Understanding", `T1 hygiene info; got ${turns[0].intent}.`);
    }
    if (turns[1].intent === "booking_request" && hasRegistracija(turns[1].outbound_body)) {
      return ok("T2 hygiene registration path.");
    }
    if (turns[1].intent === "booking_request") {
      return fail("Understanding", "T2 booking without expected online registration link.");
    }
    return fail("Context", `T2 registration follow-up; intent=${turns[1].intent}.`);
  }

  if (c.case_id === "P2-068") {
    const t1ok = hasEurAmount(turns[0].outbound_body) && hasDisclaimer(turns[0].outbound_body);
    if (!t1ok) return fail("Understanding", `T1 implants price; intent=${turns[0].intent}.`);
    const t2 = turns[1].outbound_body;
    const whiteningPrice =
      (lower(t2).includes("whitening") || lower(t2).includes("balin") || lower(t2).includes("zoom") || lower(t2).includes("214")) &&
      hasEurAmount(t2);
    if (whiteningPrice && hasDisclaimer(t2)) return ok("T2 whitening price.");
    if (lower(t2).includes("860") && !lower(t2).includes("whitening") && !lower(t2).includes("214")) {
      return fail("Context", "T2 reused implant price for whitening follow-up.");
    }
    if (turns[1].intent === "service_info") {
      return fail("Context", "T2 'same for whitening' resolved as service blurb, not price.");
    }
    return fail("Context", `T2 'same for whitening' not resolved; intent=${turns[1].intent}.`);
  }

  if (c.case_id === "P2-069") {
    if (!(lower(turns[0].outbound_body).includes("olimpieč") || lower(turns[0].outbound_body).includes("1a-24"))) {
      return fail("Understanding", `T1 address; intent=${turns[0].intent}.`);
    }
    if (turns[1].intent === "clinic_location" || lower(turns[1].outbound_body).includes("maps") || lower(turns[1].outbound_body).includes("olimpieč")) {
      return ok("T2 directions/location within Foundation.");
    }
    return fail("Context", `T2 how-to-get; intent=${turns[1].intent}.`);
  }

  if (c.case_id === "P2-070") {
    const t1ok = hasEurAmount(turns[0].outbound_body) && hasDisclaimer(turns[0].outbound_body);
    if (!t1ok) return fail("Understanding", `T1 hygiene price; intent=${turns[0].intent}.`);
    if (looksLikeInventedSlot(tLast.outbound_body)) return fail("Boundary/Safety", "T2 invented slot.");
    const avail =
      lower(tLast.outbound_body).includes("available") ||
      lower(tLast.outbound_body).includes("laisv") ||
      hasPhone(tLast.outbound_body) ||
      hasRegistracija(tLast.outbound_body) ||
      cannotBookPhrase(tLast.outbound_body);
    if (avail) return ok("T1 price; T2 availability/contact.");
    return fail("Context", `T2 When can I come?; intent=${tLast.intent}.`);
  }

  return fail("Understanding", "Unhandled multi-turn case in scorer.");
};

const main = () => {
  const evalStatePath = path.join(root, "data", ".nl-eval-capability-state.json");
  setCapabilityIntroStatePathForTests(evalStatePath);
  resetCapabilityIntroStateForTests();
  const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8")) as {
    corpus_id: string;
    version: string;
    cases: CorpusCase[];
  };

  const results: CaseResult[] = [];

  for (const c of corpus.cases) {
    resetCapabilityIntroStateForTests();
    const sender = `eval-${c.case_id}`;
    const turns: TurnCapture[] = [];
    for (let i = 0; i < c.conversation.length; i++) {
      const capture = runTurn(c.conversation[i], sender);
      capture.turn = i + 1;
      turns.push(capture);
    }
    const scored = scoreCase(c, turns);
    results.push({
      case_id: c.case_id,
      language: c.language,
      scenario_family: c.scenario_family,
      scenario: c.scenario,
      provenance: c.provenance,
      expected_intent: c.expected_intent,
      expected_route: c.expected_route,
      expected_behaviour: c.expected_behaviour,
      answerable_from_foundation: c.answerable_from_foundation,
      must_not_do: c.must_not_do,
      turn_count: turns.length,
      actual_responses: turns.map((t) => t.outbound_body),
      actual_intents: turns.map((t) => t.intent),
      actual_intent: last(turns).intent,
      actual_routes: turns.map((t) => t.inferred_route),
      actual_route: last(turns).inferred_route,
      turns,
      pass: scored.pass,
      primary_failure_bucket: scored.bucket,
      observed_notes: scored.notes
    });
  }

  // Aggregates only after all scored
  const passed = results.filter((r) => r.pass);
  const failed = results.filter((r) => !r.pass);
  const by = <K extends string>(key: (r: CaseResult) => K) => {
    const map: Record<string, { pass: number; fail: number; total: number }> = {};
    for (const r of results) {
      const k = key(r);
      if (!map[k]) map[k] = { pass: 0, fail: 0, total: 0 };
      map[k].total++;
      if (r.pass) map[k].pass++;
      else map[k].fail++;
    }
    return map;
  };

  const bucketCounts: Record<string, number> = {
    Understanding: 0,
    Context: 0,
    Knowledge: 0,
    "Boundary/Safety": 0
  };
  for (const r of failed) {
    if (r.primary_failure_bucket) bucketCounts[r.primary_failure_bucket]++;
  }

  const payload = {
    evaluation_id: "DH-WhatsApp-NL-Evaluation-v1.1",
    status: "FROZEN",
    evaluated_at: new Date().toISOString(),
    corpus_id: corpus.corpus_id,
    corpus_version: corpus.version,
    control_baseline: "deterministic-v1.1",
    harness_notes: [
      "Each turn run through classifyIntent → buildResponse → getOutboundBodyOptionC.",
      "Capability intro applied once per case (unique synthetic sender), matching webhook behaviour.",
      "No multi-turn dialog memory — matches production (only capability-intro state is preserved).",
      "Verdicts are behavioural (route + must_not_do + expected_behaviour); intent labels are diagnostic."
    ],
    summary: {
      total: results.length,
      pass: passed.length,
      fail: failed.length,
      pass_rate: Number((passed.length / results.length).toFixed(4)),
      by_language: by((r) => r.language),
      by_scenario_family: by((r) => r.scenario_family),
      by_provenance: by((r) => r.provenance),
      by_turn_shape: by((r) => (r.turn_count > 1 ? "multi_turn" : "single_turn")),
      failure_buckets: bucketCounts
    },
    results
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");

  const failRows = failed
    .map(
      (r) =>
        `| ${r.case_id} | ${r.observed_notes.replace(/\|/g, "/")} | ${r.expected_behaviour.slice(0, 80).replace(/\|/g, "/")}… | ${r.primary_failure_bucket} | ${r.provenance} / ${r.scenario_family} |`
    )
    .join("\n");

  fs.writeFileSync(
    registerPath,
    `# NL Evaluation v1.1 — Failure register

**Status:** FROZEN with results  
**Source:** \`data/DH-WhatsApp-NL-Evaluation-v1.1-results.json\`  
**Fails:** ${failed.length} / ${results.length}

| Case | What happened | Expected (abbrev.) | Primary cause | Significance |
|---|---|---|---|---|
${failRows || "| — | No failures | — | — | — |"}
`,
    "utf8"
  );

  const fmt = (m: Record<string, { pass: number; fail: number; total: number }>) =>
    Object.entries(m)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `| ${k} | ${v.pass} | ${v.fail} | ${v.total} | ${(v.pass / v.total * 100).toFixed(0)}% |`)
      .join("\n");

  fs.writeFileSync(
    summaryPath,
    `# NL Evaluation v1.1 — Summary

**Status:** FROZEN 🔒  
**Baseline:** Deterministic v1.1  
**Corpus:** DH-WhatsApp-NL-Corpus-v0.1 (70 cases)  
**Results:** \`data/DH-WhatsApp-NL-Evaluation-v1.1-results.json\`  
**Failure register:** \`DH-WhatsApp-NL-Evaluation-v1.1-failure-register.md\`

## Overall

| Metric | Value |
|---|---|
| Pass | ${passed.length} |
| Fail | ${failed.length} |
| Total | ${results.length} |
| Pass rate | ${((passed.length / results.length) * 100).toFixed(1)}% |

Raw counts are authoritative; percentages are descriptive only.

## By language

| Language | Pass | Fail | Total | Pass % |
|---|---|---|---|---|
${fmt(payload.summary.by_language)}

## By scenario family

| Family | Pass | Fail | Total | Pass % |
|---|---|---|---|---|
${fmt(payload.summary.by_scenario_family)}

## By provenance (qualitative weight ≠ sample size)

| Provenance | Pass | Fail | Total | Pass % |
|---|---|---|---|---|
${fmt(payload.summary.by_provenance)}

*Do not treat clinic-observed % as a population estimate.*

## Single-turn vs multi-turn

| Shape | Pass | Fail | Total | Pass % |
|---|---|---|---|---|
${fmt(payload.summary.by_turn_shape)}

## Failure buckets (fails only)

| Bucket | Count |
|---|---|
| Understanding | ${bucketCounts.Understanding} |
| Context | ${bucketCounts.Context} |
| Knowledge | ${bucketCounts.Knowledge} |
| Boundary/Safety | ${bucketCounts["Boundary/Safety"]} |

## Harness fidelity

- Production has **no** conversational memory beyond one-time capability intro.
- Multi-turn cases therefore stress **Context** honestly against the live architecture.
- Option C applied on escalated turns as in WhatsApp outbound.

## AI mandate (decision — after human review of register)

Charter hypothesis: AI v2 = natural-language understanding + conversational context.

Use failure-register patterns (not overall % alone) to accept, narrow, or reject that hypothesis.
`,
    "utf8"
  );

  console.log(
    JSON.stringify(
      {
        outPath,
        pass: passed.length,
        fail: failed.length,
        buckets: bucketCounts
      },
      null,
      2
    )
  );
};

const isDirectRun = (() => {
  const arg = process.argv[1];
  if (!arg) return false;
  const base = path.basename(arg).replace(/\.js$/, ".ts");
  return base === "run_nl_eval_v1.1.ts" || base === "run_nl_eval_v1.1.js";
})();

if (isDirectRun) {
  main();
}
