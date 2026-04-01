import { MessageIntent, SupportedLanguage } from "./message";

export type LocalizedText = Record<SupportedLanguage, string>;

export interface ClinicProfile {
  clinicName: string;
  address: LocalizedText;
  workingHours: LocalizedText;
  website: string;
  email: string;
  phone: string;
  parking: LocalizedText;
  /** Official or approved Google Maps / place link */
  googleMapsUrl?: string;
}

export interface ServiceItem {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  keywords: Record<SupportedLanguage, string[]>;
}

export interface FaqItem {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
}

export interface PriceItem {
  id: string;
  serviceId: string;
  label: LocalizedText;
  amountText: LocalizedText;
  notes?: LocalizedText;
}

export interface FallbackData {
  unknown: LocalizedText;
  clinicalOrUrgent: LocalizedText;
  languageSwitch: LocalizedText;
}

export interface FirstVisitPatientData {
  appointmentPrep: LocalizedText;
  visitExpectations: LocalizedText;
}

export interface AboutClinicData {
  summary: LocalizedText;
  familyCare: LocalizedText;
  fullService: LocalizedText;
  teamSummary: LocalizedText;
}

export type AboutClinicFocus = "default" | "family" | "team" | "fullService";

export interface IntentResult {
  intent: MessageIntent;
  serviceId?: string;
  aboutFocus?: AboutClinicFocus;
  /** Vague "full price list" style question — short redirect, no dump */
  broadPriceList?: boolean;
  /** LT "ar darote …?" / EN "do you offer …?" — prefix reply with yes + service blurb */
  serviceAvailabilityYesNo?: boolean;
}
