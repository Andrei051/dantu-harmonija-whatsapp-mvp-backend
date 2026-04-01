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

export interface IntentResult {
  intent: MessageIntent;
  serviceId?: string;
}
