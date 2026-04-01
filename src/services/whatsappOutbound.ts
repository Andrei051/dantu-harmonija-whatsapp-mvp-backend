import { SupportedLanguage } from "../types/message";

const ESCALATION_ACK_OPTION_C: Record<SupportedLanguage, string> = {
  lt: "Aciu uz zinute. Komandos narys perziures pranesima ir atsakys artimiausiu metu.",
  en: "Thanks for your message. A team member will review it and get back to you soon."
};

export const getOutboundBodyOptionC = (
  escalated: boolean,
  language: SupportedLanguage,
  fullResponse: string
): string => (escalated ? ESCALATION_ACK_OPTION_C[language] : fullResponse);

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
