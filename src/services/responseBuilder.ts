import { AssistantResponse, SupportedLanguage } from "../types/message";
import {
  AboutClinicFocus,
  BookingRoute,
  ClinicProfile,
  IntentResult,
  PriceItem,
  ServiceItem
} from "../types/knowledge";
import { knowledgeService } from "./knowledgeService";
import { normalizeText } from "../utils/normalizeText";

const bookingContactBlock = (language: SupportedLanguage, profile: ClinicProfile): string =>
  language === "lt"
    ? `Per WhatsApp vizito užregistruoti negaliu.\n\nDėl vizito susisiekite su klinika:\n${profile.phone}`
    : `I can't book appointments on WhatsApp.\n\nPlease contact the clinic to schedule a visit:\n${profile.phone}`;

const bookingOnlineRegistrationBlock = (language: SupportedLanguage, profile: ClinicProfile): string => {
  const url = profile.onlineRegistrationUrl ?? `${profile.website}registracija/`;
  return language === "lt"
    ? `Registruotis galite internetu:\n${url}\n\nPer WhatsApp vizito užregistruoti negaliu.`
    : `You can register online:\n${url}\n\nI can't book appointments on WhatsApp.`;
};

const bookingGuidanceBlock = (
  language: SupportedLanguage,
  profile: ClinicProfile,
  route?: BookingRoute
): string =>
  route === "online_registration"
    ? bookingOnlineRegistrationBlock(language, profile)
    : bookingContactBlock(language, profile);

const availabilityLimitationBlock = (language: SupportedLanguage, profile: ClinicProfile): string => {
  const url = profile.onlineRegistrationUrl ?? `${profile.website}registracija/`;
  return language === "lt"
    ? `Laisvų laikų per šį kanalą pasakyti negaliu.\n\nTerminų ieškokite internetinėje registracijoje:\n${url}\n\nArba skambinkite: ${profile.phone}`
    : `I can't provide available appointment times through this channel.\n\nPlease check online registration:\n${url}\n\nOr call: ${profile.phone}`;
};

const priceServiceClarification = (language: SupportedLanguage): string =>
  language === "lt"
    ? "Kokios paslaugos kainą norėtumėte sužinoti?"
    : "Which service's price would you like to know?";

const withPriceDisclaimer = (body: string, language: SupportedLanguage): string => {
  const disclaimer = knowledgeService.getPriceDisclaimer()[language];
  return `${body}\n\n${disclaimer}`;
};

/** Voice: turn authorised price fields into a patient sentence — do not stitch label onto raw detail. */
const formatAuthorisedPrice = (
  language: SupportedLanguage,
  label: string,
  amountText: string
): string => {
  const amount = amountText.trim();
  if (language === "lt") {
    if (/priekinio danties\s*:/i.test(amount)) {
      return amount
        .replace(/priekinio danties\s*:\s*/i, "Priekinio danties plombavimas kainuoja ")
        .replace(/;\s*šoninio\s*:\s*/i, ", šoninio – ")
        .replace(/\bEUR\b/g, "€");
    }
    if (new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(amount) || /kainuoja/i.test(amount)) {
      return amount;
    }
    return `${label} kainuoja ${amount}`;
  }
  if (/front tooth\s*:/i.test(amount)) {
    return amount
      .replace(/front tooth\s*:\s*/i, "Front-tooth filling costs ")
      .replace(/;\s*side tooth\s*:\s*/i, "; side tooth – ");
  }
  if (new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(amount) || /\bcosts\b/i.test(amount)) {
    return amount;
  }
  return `${label} costs ${amount}`;
};

/** Voice §5: natural capability sentence from authorised name + description. */
const formatServiceCapability = (language: SupportedLanguage, service: ServiceItem): string => {
  const name = service.name[language].trim().replace(/\.$/, "");
  const desc = service.description[language].trim().replace(/\.$/, "");
  if (language === "lt") {
    if (desc && normalizeText(desc) !== normalizeText(name)) {
      return `Taip, klinikoje atliekamas ${name} – ${lowerFirst(desc)}.`;
    }
    return `Taip, klinikoje atliekamas ${name}.`;
  }
  if (desc && desc.toLowerCase() !== name.toLowerCase()) {
    return `Yes, the clinic offers ${name} — ${lowerFirst(desc)}.`;
  }
  return `Yes, the clinic offers ${name}.`;
};

const lowerFirst = (s: string): string =>
  s.length ? s.charAt(0).toLowerCase() + s.slice(1) : s;

const appendActionGuidance = (
  body: string,
  language: SupportedLanguage,
  profile: ClinicProfile,
  intentResult: IntentResult
): string => {
  const parts = [body];
  if (intentResult.appendBookingGuidance === true) {
    parts.push(bookingGuidanceBlock(language, profile, intentResult.bookingRoute));
  } else if (intentResult.appendAvailabilityGuidance === true) {
    parts.push(availabilityLimitationBlock(language, profile));
  }
  return parts.join("\n\n");
};

const fallbackWith = (language: SupportedLanguage, key: "unknown" | "clinicalOrUrgent"): AssistantResponse => ({
  language,
  intent: key === "unknown" ? "unknown" : "clinical_or_urgent",
  reply: knowledgeService.getFallback()[key][language],
  escalated: true
});

const serviceById = (services: ServiceItem[], id?: string): ServiceItem | undefined =>
  id ? services.find((service) => service.id === id) : undefined;

const priceByServiceId = (prices: PriceItem[], serviceId?: string): PriceItem | undefined =>
  serviceId ? prices.find((price) => price.serviceId === serviceId) : undefined;

const genericServicesReply = (language: SupportedLanguage, services: ServiceItem[], website: string): string => {
  const labels = services.map((s) => (language === "lt" ? s.name.lt : s.name.en));
  const lines = labels.map((label) => `• ${label}`).join("\n");

  if (language === "lt") {
    return `Klinikoje teikiamos pagrindinės paslaugos (iš oficialios informacijos):\n\n${lines}\n\nDaugiau: ${website}`;
  }

  return `Main services offered (from official information):\n\n${lines}\n\nMore: ${website}`;
};

export const buildResponse = (
  language: SupportedLanguage,
  intentResult: IntentResult
): AssistantResponse => {
  const profile = knowledgeService.getClinicProfile();
  const services = knowledgeService.getServices();
  const prices = knowledgeService.getPrices();
  const fallback = knowledgeService.getFallback();

  switch (intentResult.intent) {
    case "clinic_hours":
      return {
        language,
        intent: "clinic_hours",
        reply:
          language === "lt"
            ? `Mūsų darbo laikas: ${profile.workingHours.lt}.\n\nJei norite, galiu padėti rasti tinkamiausią kitą žingsnį.`
            : `Our working hours: ${profile.workingHours.en}.\n\nIf you want, I can guide you to the next step.`,
        escalated: false
      };

    case "clinic_location": {
      const mapsLine =
        profile.googleMapsUrl != null && profile.googleMapsUrl.trim() !== ""
          ? `\nGoogle Maps: ${profile.googleMapsUrl}`
          : "";
      return {
        language,
        intent: "clinic_location",
        reply:
          language === "lt"
            ? `Mūsų adresas: ${profile.address.lt}.\n\nSvetainė: ${profile.website}${mapsLine}`
            : `Our address: ${profile.address.en}.\n\nWebsite: ${profile.website}${mapsLine}`,
        escalated: false
      };
    }

    case "parking":
      return {
        language,
        intent: "parking",
        reply: language === "lt" ? profile.parking.lt : profile.parking.en,
        escalated: false
      };

    case "contact": {
      const contactLines =
        language === "lt"
          ? `Svetainė: ${profile.website}\nTel.: ${profile.phone}\nEl. paštas: ${profile.email}`
          : `Website: ${profile.website}\nPhone: ${profile.phone}\nEmail: ${profile.email}`;

      if (intentResult.contactContext === "doctor") {
        return {
          language,
          intent: "contact",
          reply:
            language === "lt"
              ? `Klinikoje dirba įvairių sričių specialistai.\n\nDėl konkretaus gydytojo rekomenduojame susisiekti su klinika:\n\n${contactLines}`
              : `The clinic has specialists in several areas.\n\nFor a specific dentist, please contact the clinic:\n\n${contactLines}`,
          escalated: false
        };
      }

      return {
        language,
        intent: "contact",
        reply:
          language === "lt"
            ? `Susisiekti galite:\n\n${contactLines}`
            : `You can reach us:\n\n${contactLines}`,
        escalated: false
      };
    }

    case "booking_request":
      return {
        language,
        intent: "booking_request",
        reply:
          intentResult.availabilityOnly === true
            ? availabilityLimitationBlock(language, profile)
            : bookingGuidanceBlock(language, profile, intentResult.bookingRoute),
        escalated: false
      };

    case "first_appointment_prep": {
      const fv = knowledgeService.getFirstVisitPatient();
      return {
        language,
        intent: "first_appointment_prep",
        reply: fv.appointmentPrep[language],
        escalated: false
      };
    }

    case "first_visit_expectations": {
      const fv = knowledgeService.getFirstVisitPatient();
      return {
        language,
        intent: "first_visit_expectations",
        reply: fv.visitExpectations[language],
        escalated: false
      };
    }

    case "about_clinic": {
      if (intentResult.laboratoryInfo === true) {
        const lab = fallback.laboratoryInfo;
        return {
          language,
          intent: "about_clinic",
          reply:
            lab?.[language] ??
            (language === "lt"
              ? "Dantų laboratorija nėra atskira pacientų paslauga."
              : "The dental laboratory is not a separate patient service."),
          escalated: false
        };
      }

      const about = knowledgeService.getAboutClinic();
      const focus: AboutClinicFocus = intentResult.aboutFocus ?? "default";
      const pick = (key: keyof typeof about) => about[key][language];

      if (focus === "family") {
        return { language, intent: "about_clinic", reply: pick("familyCare"), escalated: false };
      }

      if (focus === "team") {
        return { language, intent: "about_clinic", reply: pick("teamSummary"), escalated: false };
      }

      if (focus === "fullService") {
        return { language, intent: "about_clinic", reply: pick("fullService"), escalated: false };
      }

      return {
        language,
        intent: "about_clinic",
        reply: [pick("summary"), pick("familyCare"), pick("fullService"), pick("teamSummary")].join("\n\n"),
        escalated: false
      };
    }

    case "service_info": {
      const service = serviceById(services, intentResult.serviceId);

      if (!service) {
        if (intentResult.serviceAvailabilityYesNo) {
          return {
            language,
            intent: "service_info",
            reply:
              language === "lt"
                ? `Ši procedūra neįvardyta mūsų trumpoje informacijoje. Daugiau: ${profile.website}, tel. ${profile.phone}.`
                : `That procedure is not listed in our short information. More: ${profile.website}, phone ${profile.phone}.`,
            escalated: false
          };
        }
        return {
          language,
          intent: "service_info",
          reply: genericServicesReply(language, services, profile.website),
          escalated: false
        };
      }

      // Voice §5: patient-facing sentence from authorised name + description
      return {
        language,
        intent: "service_info",
        reply: formatServiceCapability(language, service),
        escalated: false
      };
    }

    case "price_info": {
      if (intentResult.broadPriceList) {
        return {
          language,
          intent: "price_info",
          reply: knowledgeService.getPriceBroadReply()[language],
          escalated: false
        };
      }

      if (intentResult.needsServiceClarification === true || !intentResult.serviceId) {
        return {
          language,
          intent: "price_info",
          reply: appendActionGuidance(priceServiceClarification(language), language, profile, intentResult),
          escalated: false
        };
      }

      const service = serviceById(services, intentResult.serviceId);
      const price = priceByServiceId(prices, intentResult.serviceId);

      if (!service || !price) {
        const genericPrice =
          language === "lt"
            ? "Kainos pateikiamos tik toms paslaugoms, kurios yra mūsų struktūruotoje informacijoje. Dėl tikslių įkainių susisiekite su klinika."
            : "Prices are provided only for services available in our structured information. Please contact the clinic for exact fees.";
        return {
          language,
          intent: "price_info",
          reply: appendActionGuidance(genericPrice, language, profile, intentResult),
          escalated: false
        };
      }

      const priceBody = formatAuthorisedPrice(
        language,
        price.label[language],
        price.amountText[language]
      );
      const withNotes = price.notes
        ? `${priceBody}\n\n${price.notes[language]}`
        : priceBody;

      return {
        language,
        intent: "price_info",
        reply: appendActionGuidance(withPriceDisclaimer(withNotes, language), language, profile, intentResult),
        escalated: false
      };
    }

    case "language_switch":
      return {
        language,
        intent: "language_switch",
        reply: fallback.languageSwitch[language],
        escalated: false
      };

    case "assistant_capabilities":
      return {
        language,
        intent: "assistant_capabilities",
        reply: knowledgeService.getAssistantCapabilitiesReply()[language],
        escalated: false
      };

    case "clinical_or_urgent":
      return fallbackWith(language, "clinicalOrUrgent");

    default:
      return fallbackWith(language, "unknown");
  }
};
