import clinicProfileData from "../data/clinic-profile.json";
import servicesData from "../data/services.json";
import faqData from "../data/faq.json";
import pricesData from "../data/prices.json";
import fallbackData from "../data/fallback.json";
import {
  ClinicProfile,
  FallbackData,
  FaqItem,
  PriceItem,
  ServiceItem
} from "../types/knowledge";

export const knowledgeService = {
  getClinicProfile: (): ClinicProfile => clinicProfileData as ClinicProfile,
  getServices: (): ServiceItem[] => servicesData as ServiceItem[],
  getFaq: (): FaqItem[] => faqData as FaqItem[],
  getPrices: (): PriceItem[] => pricesData as PriceItem[],
  getFallback: (): FallbackData => fallbackData as FallbackData
};
