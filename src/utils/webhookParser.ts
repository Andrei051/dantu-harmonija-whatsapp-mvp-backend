export interface ParsedInboundTextMessage {
  sender?: string;
  messageId?: string;
  messageText?: string;
}

interface WhatsAppMessageNode {
  id?: string;
  from?: string;
  type?: string;
  text?: {
    body?: string;
  };
}

interface ChangeValueNode {
  messages?: WhatsAppMessageNode[];
}

interface ChangeNode {
  value?: ChangeValueNode;
}

interface EntryNode {
  changes?: ChangeNode[];
}

interface WebhookPayload {
  entry?: EntryNode[];
}

export const extractInboundTextMessage = (payload: unknown): ParsedInboundTextMessage | null => {
  const typedPayload = payload as WebhookPayload;
  const entries = typedPayload?.entry;

  if (!Array.isArray(entries)) {
    return null;
  }

  for (const entry of entries) {
    const changes = entry?.changes;
    if (!Array.isArray(changes)) {
      continue;
    }

    for (const change of changes) {
      const messages = change?.value?.messages;
      if (!Array.isArray(messages)) {
        continue;
      }

      for (const message of messages) {
        if (message?.type === "text" && typeof message?.text?.body === "string") {
          return {
            sender: message.from,
            messageId: message.id,
            messageText: message.text.body
          };
        }
      }
    }
  }

  return null;
};
