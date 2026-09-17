import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";
import { classifyIntent } from "../services/classifier";
import { knowledgeService } from "../services/knowledgeService";

/**
 * Behaviour & Scope v1 acceptance — five pre-approval mismatches + Aušra live phrases.
 */
describe("Behaviour v1 acceptance", () => {
  const services = knowledgeService.getServices();

  describe("1. Greeting → capability, not Option C", () => {
    it.each(["Sveiki", "Sveiki!", "Labas", "Hello", "Hi", "labas rytas"])(
      "%s → assistant_capabilities, not escalated",
      async (message) => {
        const res = await request(app).post("/messages/test").send({ message });
        expect(res.status).toBe(200);
        expect(res.body.intent).toBe("assistant_capabilities");
        expect(res.body.escalated).toBe(false);
        const reply = String(res.body.response).toLowerCase();
        expect(reply).not.toContain("team member will review");
        expect(reply).not.toContain("komandos narys peržiūrės");
      }
    );
  });

  describe("2. Booking is contact redirect, not team ack", () => {
    it("booking reply redirects to clinic channels without Option C promise", async () => {
      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Noriu užsakyti vizitą" });

      expect(res.body.intent).toBe("booking_request");
      expect(res.body.escalated).toBe(false);
      expect(String(res.body.response).toLowerCase()).toContain("registruoti negaliu");
      expect(String(res.body.response).toLowerCase()).not.toContain("komandos narys peržiūrės");
    });
  });

  describe("3. Named doctor + booking (Aušra)", () => {
    const ausraBooking =
      "Domina paskirti vizitą implantacijai pas gyd. Marių Bučinską";

    it("classifies as booking_request before service_info", () => {
      expect(classifyIntent(ausraBooking, services).intent).toBe("booking_request");
    });

    it("returns booking contact redirect, not implant description", async () => {
      const res = await request(app).post("/messages/test").send({ message: ausraBooking });
      expect(res.body.intent).toBe("booking_request");
      expect(res.body.escalated).toBe(false);
      const reply = String(res.body.response).toLowerCase();
      expect(reply).toContain("registruoti negaliu");
      expect(reply).not.toContain("implantacija:");
    });

    it.each(["vizita", "vizitą", "vizitui", "paskirti vizitą"])(
      "booking stem %s resolves to booking_request",
      (fragment) => {
        expect(classifyIntent(`Noriu ${fragment} rytoj`, services).intent).toBe("booking_request");
      }
    );
  });

  describe("4. Mixed questions — supported then action redirect", () => {
    it("implant price + free slots → price then availability contact", async () => {
      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Kokia implantų kaina? Kada turite laisvų laikų?" });

      expect(res.body.intent).toBe("price_info");
      expect(res.body.escalated).toBe(false);
      const reply = String(res.body.response);
      expect(reply).toContain("EUR");
      expect(reply.toLowerCase()).toContain("laisvų laikų");
      expect(reply.toLowerCase()).not.toContain("komandos narys");
    });

    it("whitening price + book still appends booking redirect", () => {
      expect(
        classifyIntent("kiek kainuoja balinimas ir ar galit uzrasyti", services)
      ).toEqual({
        intent: "price_info",
        serviceId: "teeth_whitening",
        appendBookingGuidance: true
      });
    });

    it("availability alone is contact redirect, not escalated", async () => {
      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Kada turite laisvų laikų?" });

      expect(res.body.intent).toBe("booking_request");
      expect(res.body.escalated).toBe(false);
      expect(String(res.body.response).toLowerCase()).toContain("laisvų laikų");
    });
  });

  describe("5. Insufficient price → clarify", () => {
    it.each(["Kokia kaina?", "How much does it cost?"])(
      "%s asks which service",
      async (message) => {
        const res = await request(app).post("/messages/test").send({ message });
        expect(res.body.intent).toBe("price_info");
        expect(res.body.escalated).toBe(false);
        const reply = String(res.body.response).toLowerCase();
        expect(
          reply.includes("kokios paslaugos") || reply.includes("which service")
        ).toBe(true);
        expect(reply).not.toContain("team member will review");
      }
    );
  });
});
