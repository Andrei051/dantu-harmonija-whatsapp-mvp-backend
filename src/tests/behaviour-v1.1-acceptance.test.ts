import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";
import { classifyIntent } from "../services/classifier";
import { knowledgeService } from "../services/knowledgeService";
import { getOutboundBodyOptionC } from "../services/whatsappOutbound";

/**
 * Behaviour & Scope v1.1 acceptance — clinic-reviewed baseline alignment.
 * Aušra cases remain as regression in behaviour-v1-acceptance.test.ts.
 */
describe("Behaviour v1.1 acceptance", () => {
  const services = knowledgeService.getServices();
  const profile = knowledgeService.getClinicProfile();

  describe("clinic facts", () => {
    it("hours are weekdays 08:00–20:00", async () => {
      const res = await request(app).post("/messages/test").send({ message: "Koks jūsų darbo laikas?" });
      expect(res.body.intent).toBe("clinic_hours");
      expect(String(res.body.response)).toContain("08:00–20:00");
      expect(String(res.body.response).toLowerCase()).not.toContain("šeštadien");
    });

    it("contact uses mobile number only", async () => {
      const res = await request(app).post("/messages/test").send({ message: "Koks telefonas?" });
      expect(String(res.body.response)).toContain("+370 610 11222");
      expect(String(res.body.response)).not.toContain("5 2");
    });
  });

  describe("booking routing", () => {
    it("consultation booking → online registration", async () => {
      const classified = classifyIntent("Noriu užsiregistruoti konsultacijai", services);
      expect(classified).toMatchObject({
        intent: "booking_request",
        bookingRoute: "online_registration"
      });

      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Noriu užsiregistruoti konsultacijai" });
      expect(res.body.intent).toBe("booking_request");
      expect(res.body.escalated).toBe(false);
      const reply = String(res.body.response);
      expect(reply).toContain("registruoti negaliu");
      expect(reply).toContain(profile.onlineRegistrationUrl);
      expect(reply.toLowerCase()).not.toContain("atsakysime darbo dieną");
    });

    it("oral hygiene booking → online registration", async () => {
      const classified = classifyIntent("Noriu užsakyti burnos higieną", services);
      expect(classified).toMatchObject({
        intent: "booking_request",
        bookingRoute: "online_registration",
        serviceId: "professional_hygiene"
      });

      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Noriu užsakyti burnos higieną" });
      expect(String(res.body.response)).toContain("/registracija/");
      expect(res.body.escalated).toBe(false);
    });

    it("unsupported treatment booking → clinic contact", async () => {
      const classified = classifyIntent("Noriu užsakyti implantaciją", services);
      expect(classified).toMatchObject({
        intent: "booking_request",
        bookingRoute: "contact",
        serviceId: "implants"
      });

      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Noriu užsakyti implantaciją" });
      const reply = String(res.body.response);
      expect(reply).toContain("registruoti negaliu");
      expect(reply).toContain(profile.phone);
      expect(reply).not.toContain("/registracija/");
      expect(res.body.escalated).toBe(false);
    });

    it("availability never claims a slot", async () => {
      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Kada turite laisvų laikų?" });
      expect(res.body.intent).toBe("booking_request");
      expect(res.body.escalated).toBe(false);
      const reply = String(res.body.response).toLowerCase();
      expect(reply).toContain("laisvų laikų");
      expect(reply).toContain("pasakyti negaliu");
      expect(reply).not.toMatch(/\b(rytoj|po pietų|15:00|available at)\b/);
    });
  });

  describe("urgent and clinical", () => {
    it("urgent + otherwise online-bookable service → phone, not registration", async () => {
      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Skauda dantį, noriu užsiregistruoti higienai" });
      expect(res.body.intent).toBe("clinical_or_urgent");
      expect(res.body.escalated).toBe(true);
      const reply = String(res.body.response);
      expect(reply).toContain("+370 610 11222");
      expect(reply).not.toContain("/registracija/");
    });

    it("clinical question → safety/handoff", async () => {
      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Ar galiu dėtis implantą jei sergu diabetu?" });
      expect(res.body.intent).toBe("clinical_or_urgent");
      expect(res.body.escalated).toBe(true);
      expect(String(res.body.response).toLowerCase()).toContain("+370 610 11222");
    });
  });

  describe("WhatsApp handoff vs ordinary redirect", () => {
    it("team escalation uses 08–17 wording", () => {
      const body = getOutboundBodyOptionC(true, "lt", "Fallback text", "unknown");
      expect(body).toContain("8:00");
      expect(body).toContain("17:00");
      expect(body.toLowerCase()).not.toContain("soon");
      expect(body.toLowerCase()).not.toContain("netrukus");
    });

    it("ordinary booking redirect promises no WhatsApp follow-up", async () => {
      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Noriu užsakyti vizitą" });
      expect(res.body.escalated).toBe(false);
      const reply = String(res.body.response).toLowerCase();
      expect(reply).not.toContain("atsakysime darbo dieną");
      expect(reply).not.toContain("komandos narys");
    });
  });

  describe("prices and taxonomy", () => {
    it("price returns cached published amount + disclaimer", async () => {
      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Kiek kainuoja implantai?" });
      expect(res.body.intent).toBe("price_info");
      const reply = String(res.body.response);
      expect(reply).toContain("EUR");
      expect(reply).toContain("preliminari");
      expect(reply).toContain("gydytojas");
    });

    it("laboratory enquiry is not a patient treatment/service", async () => {
      const classified = classifyIntent("Ar turite dantų laboratoriją?", services);
      expect(classified).toMatchObject({ intent: "about_clinic", laboratoryInfo: true });

      const res = await request(app)
        .post("/messages/test")
        .send({ message: "Ar turite dantų laboratoriją?" });
      const reply = String(res.body.response).toLowerCase();
      expect(reply).toContain("laborator");
      expect(reply.toLowerCase()).toMatch(/atskirai nerodomos|not shown separately|nėra atskira/);
      expect(services.some((s) => s.id.includes("lab"))).toBe(false);
    });
  });
});
