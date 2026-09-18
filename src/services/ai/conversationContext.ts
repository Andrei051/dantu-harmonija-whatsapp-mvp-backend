import fs from "fs";
import os from "os";
import path from "path";
import { normalizeSenderKey } from "../whatsappConversationIntro";

export type ContextTurn = {
  role: "patient" | "assistant";
  text: string;
};

/** Bounded prior turns for Phase 3A — no summarisation / structured memory. */
const DEFAULT_MAX_TURNS = 8;
const store = new Map<string, ContextTurn[]>();

let stateFilePath: string | null = null;

const defaultStatePath = (): string =>
  process.env.WHATSAPP_CONVERSATION_STATE_PATH?.trim() ||
  path.join(os.tmpdir(), "whatsapp-conversation-context.json");

const getStatePath = (): string => stateFilePath ?? defaultStatePath();

type DiskShape = { conversations?: Record<string, ContextTurn[]> };

const readFromDisk = (): Map<string, ContextTurn[]> => {
  try {
    const raw = fs.readFileSync(getStatePath(), "utf8");
    const data = JSON.parse(raw) as DiskShape;
    const out = new Map<string, ContextTurn[]>();
    for (const [k, turns] of Object.entries(data.conversations ?? {})) {
      const key = normalizeSenderKey(k);
      if (!key || !Array.isArray(turns)) continue;
      out.set(
        key,
        turns.filter(
          (t) =>
            t &&
            (t.role === "patient" || t.role === "assistant") &&
            typeof t.text === "string"
        )
      );
    }
    return out;
  } catch {
    return new Map();
  }
};

const mergeDiskIntoMemory = (): void => {
  for (const [k, turns] of readFromDisk()) {
    if (!store.has(k)) store.set(k, turns);
  }
};

const persistMemoryToDisk = (): void => {
  const conversations: Record<string, ContextTurn[]> = {};
  for (const [k, turns] of store) {
    conversations[k] = turns;
  }
  const filePath = getStatePath();
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  } catch {
    // ignore
  }
  fs.writeFileSync(filePath, JSON.stringify({ conversations }), "utf8");
};

export function getConversationContext(
  sender: string,
  maxTurns = DEFAULT_MAX_TURNS
): ContextTurn[] {
  mergeDiskIntoMemory();
  const key = normalizeSenderKey(sender);
  const turns = store.get(key) ?? [];
  if (turns.length <= maxTurns) return [...turns];
  return turns.slice(-maxTurns);
}

export function appendConversationTurn(sender: string, turn: ContextTurn): void {
  mergeDiskIntoMemory();
  const key = normalizeSenderKey(sender);
  if (!key) return;
  const next = [...(store.get(key) ?? []), turn];
  const maxKeep = DEFAULT_MAX_TURNS * 2;
  store.set(key, next.length > maxKeep ? next.slice(-maxKeep) : next);
  persistMemoryToDisk();
}

export function resetConversationContextForTests(): void {
  store.clear();
  try {
    if (fs.existsSync(getStatePath())) fs.unlinkSync(getStatePath());
  } catch {
    // ignore
  }
}

export function setConversationContextPathForTests(filePath: string | null): void {
  stateFilePath = filePath;
}
