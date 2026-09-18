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
  /** Online registration for specialist consultations + oral hygiene */
  onlineRegistrationUrl?: string;
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

export interface PriceCacheMeta {
  source: string;
  synchronisedAt: string;
  note?: string;
  disclaimer: LocalizedText;
}

export interface PriceCacheData {
  meta: PriceCacheMeta;
  items: PriceItem[];
}

export interface FallbackData {
  unknown: LocalizedText;
  /** Clinic-related but not in Foundation — redirect to clinic, no human WhatsApp promise. */
  unknownClinicUnsupported?: LocalizedText;
  clinicalOrUrgent: LocalizedText;
  /** Non-urgent clinical judgement — general assessment/contact (Pre-3B F1). */
  clinicalAssessment?: LocalizedText;
  /** Non-urgent suitability ask (“ar man tinka…”) — same boundary, topic-neutral suitability wording. */
  clinicalAssessmentSuitability?: LocalizedText;
  languageSwitch: LocalizedText;
  laboratoryInfo?: LocalizedText;
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

export type BookingRoute = "online_registration" | "contact";

export interface IntentResult {
  intent: MessageIntent;
  serviceId?: string;
  aboutFocus?: AboutClinicFocus;
  /** Vague "full price list" style question — short redirect, no dump */
  broadPriceList?: boolean;
  /** Price asked with no identifiable service — ask which service */
  needsServiceClarification?: boolean;
  /** LT "ar darote …?" / EN "do you offer …?" — prefix reply with yes + service blurb */
  serviceAvailabilityYesNo?: boolean;
  /** Price question also asks about booking — append contact/online booking guidance after price */
  appendBookingGuidance?: boolean;
  /** Price/availability mix — append availability contact redirect (not Option C) */
  appendAvailabilityGuidance?: boolean;
  /** Availability-only enquiry — contact redirect, no slot invention */
  availabilityOnly?: boolean;
  /** How booking_request should be answered */
  bookingRoute?: BookingRoute;
  /** Contact intent: short doctor/specialist question without escalation */
  contactContext?: "doctor";
  /** Laboratory is not a patient service */
  laboratoryInfo?: boolean;
}
