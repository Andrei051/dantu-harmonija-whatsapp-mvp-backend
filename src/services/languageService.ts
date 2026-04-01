import { normalizeText } from "../utils/normalizeText";
import { SupportedLanguage } from "../types/message";

const ENGLISH_HINTS = [
  "hello",
  "hi",
  "english",
  "do you",
  "what",
  "working",
  "where",
  "located",
  "address",
  "hours",
  "price",
  "parking",
  "service",
  "contact",
  "email",
  "phone",
  "clinic",
  "appointment",
  "booking",
  "need",
  "tomorrow"
];

const LITHUANIAN_HINTS = [
  "sveiki",
  "kur",
  "adresas",
  "valandos",
  "kaina",
  "paslaug",
  "klinika",
  "telefonas",
  "el pastas",
  "darbo"
];

const LT_PRIORITY_CUES = ["ar", "yra", "kur", "jusu", "kokios"];
const WEAK_ENGLISH_HINTS = ["parking"];

export const detectLanguage = (message: string): SupportedLanguage => {
  const normalized = normalizeText(message);

  let enScore = 0;
  let ltScore = 0;

  for (const token of ENGLISH_HINTS) {
    if (normalized.includes(token)) {
      enScore += 1;
    }
  }

  for (const token of LITHUANIAN_HINTS) {
    if (normalized.includes(token)) {
      ltScore += 1;
    }
  }

  const hasLtPriorityCue = LT_PRIORITY_CUES.some((token) => normalized.includes(token));
  const hasOnlyWeakEnglishHint =
    enScore === 1 && WEAK_ENGLISH_HINTS.some((token) => normalized.includes(token));

  if (hasLtPriorityCue && hasOnlyWeakEnglishHint) {
    return "lt";
  }

  return enScore > ltScore ? "en" : "lt";
};
