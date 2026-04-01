import clinicProfileData from "../data/clinic-profile.json";
import servicesData from "../data/services.json";
import faqData from "../data/faq.json";
import pricesData from "../data/prices.json";
import fallbackData from "../data/fallback.json";
import firstVisitPatientData from "../data/first-visit-patient.json";
import aboutClinicData from "../data/about-clinic.json";
import priceBroadData from "../data/price-broad.json";
import assistantCapabilitiesData from "../data/assistant-capabilities.json";
import {
  AboutClinicData,
  ClinicProfile,
  FallbackData,
  FaqItem,
  FirstVisitPatientData,
  LocalizedText,
  PriceItem,
  ServiceItem
} from "../types/knowledge";

export const knowledgeService = {
  getClinicProfile: (): ClinicProfile => clinicProfileData as ClinicProfile,
  getServices: (): ServiceItem[] => servicesData as ServiceItem[],
  getFaq: (): FaqItem[] => faqData as FaqItem[],
  getPrices: (): PriceItem[] => pricesData as PriceItem[],
  getFallback: (): FallbackData => fallbackData as FallbackData,
  getFirstVisitPatient: (): FirstVisitPatientData => firstVisitPatientData as FirstVisitPatientData,
  getAboutClinic: (): AboutClinicData => aboutClinicData as AboutClinicData,
  getPriceBroadReply: (): LocalizedText => priceBroadData as LocalizedText,
  getAssistantCapabilitiesReply: (): LocalizedText => assistantCapabilitiesData as LocalizedText
};
