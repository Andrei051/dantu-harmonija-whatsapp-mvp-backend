import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("POST /messages/test integration", () => {
  it("returns clinic hours flow", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "Kokios darbo valandos?" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("clinic_hours");
    expect(res.body.language).toBe("lt");
    expect(res.body.response).toContain("darbo laikas");
  });

  it("returns price-related response without invented exact numbers", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "Kiek kainuoja implantai?" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("price_info");
    expect(res.body.response).not.toBe("");
    expect(String(res.body.response)).toContain("EUR");
    expect(String(res.body.response).toLowerCase()).toContain("orientac");
  });

  it("returns urgent escalation and avoids service explanation", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "Labai skauda danti" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("clinical_or_urgent");
    expect(res.body.escalated).toBe(true);
    expect(String(res.body.response).toLowerCase()).toContain("negaliu vertinti klinikines bukles");
    expect(String(res.body.response).toLowerCase()).not.toContain("dantu implantacija");
  });

  it("returns English language response for language switch", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "Do you speak English?" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("language_switch");
    expect(res.body.language).toBe("en");
    expect(String(res.body.response).toLowerCase()).toContain("lithuanian or english");
  });

  it("returns unknown safe fallback", async () => {
    const res = await request(app)
      .post("/messages/test")
      .send({ message: "Sveiki" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("unknown");
    expect(res.body.escalated).toBe(true);
    expect(res.body.response).not.toBe("");
  });
});
