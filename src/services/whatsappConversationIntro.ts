import { SupportedLanguage } from "../types/message";

/** One-time framing copy per WhatsApp sender (in-process; resets on deploy / new instance). */
const CAPABILITY_INTRO: Record<SupportedLanguage, string> = {
  lt:
    "Galiu padėti su informacija apie paslaugas, kainas ir kliniką.\n\n" +
    "Dėl registracijos ar gydymo klausimų susisiekite su klinika.",
  en:
    "I can help with information about services, prices, and the clinic.\n\n" +
    "For bookings or medical questions, please contact the clinic directly."
};

const seenCapabilitySender = new Set<string>();

const normalizeSender = (sender: string): string => sender.trim();

/** Returns intro text if this sender has not yet received it; caller should send, then call `markCapabilityIntroSent`. */
export const getCapabilityIntroIfFirstReply = (sender: string, language: SupportedLanguage): string | null => {
  const key = normalizeSender(sender);
  if (!key || seenCapabilitySender.has(key)) {
    return null;
  }
  return CAPABILITY_INTRO[language];
};

export const markCapabilityIntroSent = (sender: string): void => {
  const key = normalizeSender(sender);
  if (key) {
    seenCapabilitySender.add(key);
  }
};

/** Test helper: reset in-memory state */
export const resetCapabilityIntroStateForTests = (): void => {
  seenCapabilitySender.clear();
};
