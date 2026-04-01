export type SupportedLanguage = "lt" | "en";

export type MessageIntent =
  | "clinic_hours"
  | "clinic_location"
  | "parking"
  | "contact"
  | "booking_request"
  | "service_info"
  | "price_info"
  | "language_switch"
  | "clinical_or_urgent"
  | "first_appointment_prep"
  | "first_visit_expectations"
  | "about_clinic"
  | "unknown";

export interface TestMessageRequest {
  message: string;
}

export interface AssistantResponse {
  language: SupportedLanguage;
  intent: MessageIntent;
  reply: string;
  escalated: boolean;
}
