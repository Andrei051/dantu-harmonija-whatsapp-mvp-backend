import { MessageIntent, SupportedLanguage } from "../types/message";

const ESCALATION_ACK_OPTION_C: Record<SupportedLanguage, string> = {
  lt: "Jūsų užklausą gavome, atsakysime darbo dieną nuo 8:00 iki 17:00.",
  en: "We have received your enquiry and will reply on a working day between 08:00 and 17:00."
};

/** Option C: team ack only when escalated (unknown / clinical follow-up expected). Contact redirects must not set escalated. */
export const getOutboundBodyOptionC = (
  escalated: boolean,
  language: SupportedLanguage,
  fullResponse: string,
  intent?: MessageIntent
): string => {
  if (!escalated) {
    return fullResponse;
  }
  if (intent === "clinical_or_urgent" && fullResponse.trim().length > 0) {
    return `${fullResponse}\n\n${ESCALATION_ACK_OPTION_C[language]}`;
  }
  return ESCALATION_ACK_OPTION_C[language];
};

const truncateForWhatsApp = (body: string, maxChars = 4000): string => {
  if (body.length <= maxChars) {
    return body;
  }

  return `${body.slice(0, maxChars - 1)}…`;
};

export const sendWhatsAppTextMessage = async (params: {
  to: string;
  body: string;
}): Promise<{ ok: boolean; status: number; detail?: string }> => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    return { ok: false, status: 0, detail: "missing_env" };
  }

  const url = `https://graph.facebook.com/v22.0/${phoneId}/messages`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.to,
      type: "text",
      text: { body: truncateForWhatsApp(params.body) }
    })
  });

  const responseText = await response.text();

  if (!response.ok) {
    return { ok: false, status: response.status, detail: responseText.slice(0, 500) };
  }

  return { ok: true, status: response.status };
};
