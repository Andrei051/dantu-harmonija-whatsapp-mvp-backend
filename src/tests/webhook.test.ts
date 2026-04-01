import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../app";
import { resetInboundMessageDedupForTests } from "../utils/inboundMessageDedup";
import { logger } from "../utils/logger";

describe("webhook routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetInboundMessageDedupForTests();
  });

  it("GET /webhook returns challenge for valid token", async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = "test-token";

    const res = await request(app)
      .get("/webhook")
      .query({ "hub.mode": "subscribe", "hub.verify_token": "test-token", "hub.challenge": "12345" });

    expect(res.status).toBe(200);
    expect(res.text).toBe("12345");
  });

  it("GET /webhook rejects invalid token", async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = "test-token";

    const res = await request(app)
      .get("/webhook")
      .query({ "hub.mode": "subscribe", "hub.verify_token": "wrong-token", "hub.challenge": "12345" });

    expect(res.status).toBe(403);
  });

  it("POST /webhook processes inbound text payload", async () => {
    const infoSpy = vi.spyOn(logger, "info").mockImplementation(() => undefined);

    const payload = {
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: "wamid.HBgM123",
                    from: "37060000000",
                    type: "text",
                    text: { body: "Kokios darbo valandos?" }
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    const res = await request(app).post("/webhook").send(payload);

    expect(res.status).toBe(200);
    expect(infoSpy).toHaveBeenCalledWith(
      "webhook_inbound_text_processed",
      expect.objectContaining({
        sender: "37060000000",
        messageText: "Kokios darbo valandos?",
        detectedIntent: "clinic_hours",
        detectedLanguage: "lt",
        escalated: false
      })
    );
  });

  it("POST /webhook safely ignores non-message payload", async () => {
    const infoSpy = vi.spyOn(logger, "info").mockImplementation(() => undefined);

    const payload = {
      entry: [
        {
          changes: [
            {
              value: {
                statuses: [{ id: "wamid.STATUS" }]
              }
            }
          ]
        }
      ]
    };

    const res = await request(app).post("/webhook").send(payload);

    expect(res.status).toBe(200);
    expect(infoSpy).not.toHaveBeenCalledWith("webhook_inbound_text_processed", expect.anything());
  });

  it("POST /webhook skips duplicate inbound message id", async () => {
    const infoSpy = vi.spyOn(logger, "info").mockImplementation(() => undefined);

    const payload = {
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: "wamid.DUPLICATE_TEST",
                    from: "37060000000",
                    type: "text",
                    text: { body: "Kokios darbo valandos?" }
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    await request(app).post("/webhook").send(payload);
    await request(app).post("/webhook").send(payload);

    const processedCalls = infoSpy.mock.calls.filter((call) => call[0] === "webhook_inbound_text_processed");
    expect(processedCalls).toHaveLength(1);

    expect(infoSpy).toHaveBeenCalledWith(
      "webhook_inbound_duplicate_skipped",
      expect.objectContaining({ messageId: "wamid.DUPLICATE_TEST" })
    );
  });
});
