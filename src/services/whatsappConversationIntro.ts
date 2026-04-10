import fs from "fs";
import os from "os";
import path from "path";
import { SupportedLanguage } from "../types/message";

/** One-time framing copy per WhatsApp sender. */
const CAPABILITY_INTRO: Record<SupportedLanguage, string> = {
  lt:
    "Galiu padėti su informacija apie paslaugas, kainas ir kliniką.\n\n" +
    "Dėl registracijos ar gydymo klausimų susisiekite su klinika.",
  en:
    "I can help with information about services, prices, and the clinic.\n\n" +
    "For bookings or medical questions, please contact the clinic directly."
};

/** In-process cache (merged with disk on read). */
const seenCapabilitySender = new Set<string>();

let stateFilePath: string | null = null;

const defaultStatePath = (): string =>
  process.env.WHATSAPP_CAPABILITY_STATE_PATH?.trim() ||
  path.join(os.tmpdir(), "whatsapp-capability-seen.json");

const getStatePath = (): string => {
  if (stateFilePath != null) {
    return stateFilePath;
  }
  return defaultStatePath();
};

/** E.164 variants (+44… vs 44…) map to the same key; short test ids keep trimmed string. */
export const normalizeSenderKey = (sender: string): string => {
  const trimmed = sender.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 8) {
    return digits;
  }
  return trimmed;
};

const readSeenFromDisk = (): Set<string> => {
  const filePath = getStatePath();
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw) as { keys?: string[] };
    const out = new Set<string>();
    for (const k of data.keys ?? []) {
      const nk = normalizeSenderKey(k);
      if (nk) {
        out.add(nk);
      }
    }
    return out;
  } catch {
    return new Set();
  }
};

const mergeDiskIntoMemory = (): void => {
  for (const k of readSeenFromDisk()) {
    seenCapabilitySender.add(k);
  }
};

const persistMemoryToDisk = (): void => {
  const filePath = getStatePath();
  const keys = [...seenCapabilitySender];
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  } catch {
    // ignore
  }
  fs.writeFileSync(filePath, JSON.stringify({ keys }), "utf8");
};

/** Returns intro text if this sender has not yet received it; caller should send, then call `markCapabilityIntroSent`. */
export const getCapabilityIntroIfFirstReply = (sender: string, language: SupportedLanguage): string | null => {
  mergeDiskIntoMemory();
  const key = normalizeSenderKey(sender);
  if (!key || seenCapabilitySender.has(key)) {
    return null;
  }
  return CAPABILITY_INTRO[language];
};

export const markCapabilityIntroSent = (sender: string): void => {
  mergeDiskIntoMemory();
  const key = normalizeSenderKey(sender);
  if (!key) {
    return;
  }
  seenCapabilitySender.add(key);
  persistMemoryToDisk();
};

/** Test helper: reset in-memory state and optional temp file */
export const resetCapabilityIntroStateForTests = (): void => {
  seenCapabilitySender.clear();
  const filePath = getStatePath();
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // ignore
  }
};

/** Test helper: isolate state file path */
export const setCapabilityIntroStatePathForTests = (filePath: string | null): void => {
  stateFilePath = filePath;
};
