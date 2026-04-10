import { AssistantResponse, SupportedLanguage } from "../types/message";
import { AboutClinicFocus, ClinicProfile, IntentResult, PriceItem, ServiceItem } from "../types/knowledge";
import { knowledgeService } from "./knowledgeService";

const bookingLimitationBlock = (language: SupportedLanguage, profile: ClinicProfile): string =>
  language === "lt"
    ? `Per šį kanalą vizitų registruoti negaliu.\n\nRegistruokitės arba susisiekite su klinika įprastu būdu:\n\nSvetainė: ${profile.website}\nTel.: ${profile.phone}\nEl. paštas: ${profile.email}`
    : `I can't register visits through this channel.\n\nTo schedule a visit, please follow the clinic's usual process:\n\nWebsite: ${profile.website}\nPhone: ${profile.phone}\nEmail: ${profile.email}`;

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
        reply: bookingLimitationBlock(language, profile),
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
      const yesAvail =
        intentResult.serviceAvailabilityYesNo === true
          ? language === "lt"
            ? "Taip, atliekame. "
            : "Yes, we offer this. "
          : "";

      if (!service) {
        if (intentResult.serviceAvailabilityYesNo) {
          return {
            language,
            intent: "service_info",
            reply:
              language === "lt"
                ? `Ši procedūra neįvardyta mūsų trumpoje informacijoje.\n\nDaugiau: ${profile.website}, tel. ${profile.phone}.`
                : `That procedure is not listed in our short information.\n\nMore: ${profile.website}, phone ${profile.phone}.`,
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

      return {
        language,
        intent: "service_info",
        reply:
          language === "lt"
            ? `${yesAvail}${service.name.lt}: ${service.description.lt}`
            : `${yesAvail}${service.name.en}: ${service.description.en}`,
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

      const service = serviceById(services, intentResult.serviceId);
      const price = priceByServiceId(prices, intentResult.serviceId);

      if (!service || !price) {
        const genericPrice =
          language === "lt"
            ? "Kainos pateikiamos tik toms paslaugoms, kurios yra mūsų struktūruotoje informacijoje. Dėl tikslių įkainių susisiekite su klinika."
            : "Prices are provided only for services available in our structured information. Please contact the clinic for exact fees.";
        const withBooking =
          intentResult.appendBookingGuidance === true
            ? `${genericPrice}\n\n${bookingLimitationBlock(language, profile)}`
            : genericPrice;
        return {
          language,
          intent: "price_info",
          reply: withBooking,
          escalated: false
        };
      }

      const priceBody =
        language === "lt"
          ? `${price.label.lt}: ${price.amountText.lt}${price.notes ? `\n\n${price.notes.lt}` : ""}`
          : `${price.label.en}: ${price.amountText.en}${price.notes ? `\n\n${price.notes.en}` : ""}`;
      const priceReply =
        intentResult.appendBookingGuidance === true
          ? `${priceBody}\n\n${bookingLimitationBlock(language, profile)}`
          : priceBody;

      return {
        language,
        intent: "price_info",
        reply: priceReply,
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
