import { AssistantResponse, SupportedLanguage } from "../types/message";
import { AboutClinicFocus, IntentResult, PriceItem, ServiceItem } from "../types/knowledge";
import { knowledgeService } from "./knowledgeService";

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
  const list = labels.join(language === "lt" ? "; " : "; ");

  if (language === "lt") {
    return `Klinikoje teikiamos pagrindines paslaugos (is oficialios informacijos): ${list}. Daugiau: ${website}`;
  }

  return `Main services offered (from official information): ${list}. More: ${website}`;
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
            ? `Musu darbo laikas: ${profile.workingHours.lt}. Jei norite, galiu padeti rasti tinkamiausia kita zingsni.`
            : `Our working hours: ${profile.workingHours.en}. If you want, I can guide you to the next step.`,
        escalated: false
      };

    case "clinic_location": {
      const maps =
        profile.googleMapsUrl != null && profile.googleMapsUrl.trim() !== ""
          ? ` Google Maps: ${profile.googleMapsUrl}`
          : "";
      return {
        language,
        intent: "clinic_location",
        reply:
          language === "lt"
            ? `Musu adresas: ${profile.address.lt}. Daugiau informacijos rasite: ${profile.website}.${maps}`
            : `Our address: ${profile.address.en}. More information: ${profile.website}.${maps}`,
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

    case "contact":
      return {
        language,
        intent: "contact",
        reply:
          language === "lt"
            ? `Susisiekti galite el. pastu ${profile.email} arba telefonu ${profile.phone}. Svetaine: ${profile.website}`
            : `You can contact us via email ${profile.email} or phone ${profile.phone}. Website: ${profile.website}`,
        escalated: false
      };

    case "booking_request":
      return {
        language,
        intent: "booking_request",
        reply:
          language === "lt"
            ? `Per si kanala vizitu neuzsakau ir kalendoriaus nenaudoju. Registruokites arba susisiekite su klinika iprastu budu: ${profile.website}, tel. ${profile.phone}, el. pastas ${profile.email}.`
            : `I do not book appointments or use calendars here. To schedule a visit, please follow the clinic's usual process: ${profile.website}, phone ${profile.phone}, email ${profile.email}.`,
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
        reply: `${pick("summary")} ${pick("familyCare")} ${pick("fullService")} ${pick("teamSummary")}`,
        escalated: false
      };
    }

    case "service_info": {
      const service = serviceById(services, intentResult.serviceId);
      if (!service) {
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
            ? `${service.name.lt}: ${service.description.lt}`
            : `${service.name.en}: ${service.description.en}`,
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
        return {
          language,
          intent: "price_info",
          reply:
            language === "lt"
              ? "Kainos pateikiamos tik toms paslaugoms, kurios yra musu strukturuotoje informacijoje. Del tiksliu ikainiu susisiekite su klinika."
              : "Prices are provided only for services available in our structured information. Please contact the clinic for exact fees.",
          escalated: false
        };
      }

      return {
        language,
        intent: "price_info",
        reply:
          language === "lt"
            ? `${price.label.lt}: ${price.amountText.lt}${price.notes ? ` (${price.notes.lt})` : ""}`
            : `${price.label.en}: ${price.amountText.en}${price.notes ? ` (${price.notes.en})` : ""}`,
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

    case "clinical_or_urgent":
      return fallbackWith(language, "clinicalOrUrgent");

    default:
      return fallbackWith(language, "unknown");
  }
};
