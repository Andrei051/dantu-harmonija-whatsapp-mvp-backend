import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";

/**
 * Regression coverage for phrases from the manual message pack (curl/script runs).
 */
describe("manual pack regression (POST /messages/test)", () => {
  it("Kur jus randates (diacritics) -> clinic_location + lt", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "Kur jus randatės?" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("clinic_location");
    expect(res.body.language).toBe("lt");
    expect(res.body.escalated).toBe(false);
    expect(String(res.body.response).toLowerCase()).toContain("adresas");
  });

  it("What are your working hours? -> clinic_hours + en", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "What are your working hours?" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("clinic_hours");
    expect(res.body.language).toBe("en");
    expect(res.body.escalated).toBe(false);
    expect(String(res.body.response).toLowerCase()).toContain("working hours");
  });

  it("hello -> unknown + en", async () => {
    const res = await request(app).post("/messages/test").send({ message: "hello" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("unknown");
    expect(res.body.language).toBe("en");
    expect(res.body.escalated).toBe(true);
  });

  it("I need appointment tomorrow -> booking_request + en", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "I need appointment tomorrow" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("booking_request");
    expect(res.body.language).toBe("en");
    expect(res.body.escalated).toBe(false);
    expect(String(res.body.response).toLowerCase()).toContain("do not book");
  });

  it("Ar dirbate savaitgaliais? -> clinic_hours + lt", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "Ar dirbate savaitgaliais?" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("clinic_hours");
    expect(res.body.language).toBe("lt");
    expect(res.body.escalated).toBe(false);
    expect(String(res.body.response).toLowerCase()).toContain("darbo laikas");
  });

  it("ar jus dirbat rytoj -> clinic_hours + lt", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "ar jus dirbat rytoj" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("clinic_hours");
    expect(res.body.language).toBe("lt");
    expect(res.body.escalated).toBe(false);
  });

  it("Labai skauda danti -> clinical_or_urgent still wins over booking", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "Labai skauda danti" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("clinical_or_urgent");
    expect(res.body.escalated).toBe(true);
    expect(String(res.body.response).toLowerCase()).not.toContain("do not book");
  });

  it("clinical wins when booking keywords appear with pain context", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "skauda dantis ir reikia vizito" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("clinical_or_urgent");
    expect(res.body.escalated).toBe(true);
  });
});
