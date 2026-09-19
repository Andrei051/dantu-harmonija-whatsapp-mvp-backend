import { describe, expect, it } from "vitest";
import { applyPolicyAndAssemble } from "../services/ai/policyAssemble";
import type { InterpretationV1 } from "../services/ai/validateInterpretation";

const base = (
  overrides: Partial<InterpretationV1> & {
    intents: InterpretationV1["intents"];
  }
): InterpretationV1 => ({
  schema_version: "1.0",
  language: "lt",
  service_or_topic: null,
  signals: {
    booking: "none",
    availability: false,
    clinical_or_suitability: false,
    unsupported_or_ambiguous: false
  },
  references: [],
  overall_confidence: 0.9,
  ...overrides
});

describe("Pre-3B F1/F2 clinical judgement vs urgency", () => {
  it("R2: suitability without urgency → assessment contact, not emergency S1", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [{ type: "clinical", confidence: 0.9 }],
        service_or_topic: {
          id: "teeth_whitening",
          confidence: 0.9,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "O kuris variantas efektyvesnis ir ar man tiktų?"
    );

    expect(policy.actions).toContain("S1_clinical_assessment");
    expect(policy.actions).not.toContain("S1_urgent_phone");
    expect(policy.reply).not.toMatch(/skubi(ą|os)? pagalba|emergency care/i);
    expect(policy.reply).toMatch(/11222/);
    expect(policy.escalated).toBe(false);
    expect(policy.route).toBe("contact");
  });

  it("R6: broken tooth without urgency cue → assessment, not emergency", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [{ type: "clinical", confidence: 0.9 }],
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "Part of my tooth fell off. Can your clinic fix it?"
    );

    expect(policy.actions).toContain("S1_clinical_assessment");
    expect(policy.reply).not.toMatch(/emergency care|skubi/i);
    expect(policy.escalated).toBe(false);
  });

  it("R6: nekraujuoja must not match urgency token kraujuoja", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [
          { type: "clinical", confidence: 0.95 },
          { type: "service_info", confidence: 0.85 }
        ],
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "Dar vienas klausimas. Nuskilo dalis danties, bet neskauda ir nekraujuoja. Ar jūsų klinikoje galima tokį dantį sutvarkyti?"
    );

    expect(policy.actions).toContain("S1_clinical_assessment");
    expect(policy.actions).not.toContain("S1_urgent_phone");
    expect(policy.reply).not.toMatch(/skubi(ą|os)? pagalba|nedelsiant/i);
    expect(policy.escalated).toBe(false);
  });

  it("R8: kraujuoja as whole token still selects urgent path", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [{ type: "clinical", confidence: 0.95 }],
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "Nusilaužiau priekinį dantį, stipriai kraujuoja ir labai skauda. Ką man daryti?"
    );

    expect(policy.actions).toContain("S1_urgent_phone");
    expect(policy.reply).toMatch(/nedelsiant|skubi/i);
    expect(policy.escalated).toBe(true);
  });

  it("R8: explicit urgency → strong phone path", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "en",
        intents: [{ type: "clinical", confidence: 0.95 }],
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "Urgently need to fix this front tooth before a meeting."
    );

    expect(policy.actions).toContain("S1_urgent_phone");
    expect(policy.reply).toMatch(/immediately|emergency care/i);
    expect(policy.escalated).toBe(true);
    expect(policy.route).toBe("phone");
  });

  it("R7/F2: clinical judgement + service_info keeps Foundation service fact", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [
          { type: "clinical", confidence: 0.8 },
          { type: "service_info", confidence: 0.85 }
        ],
        service_or_topic: {
          id: "fillings",
          confidence: 0.9,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "Ar dedat plombas ar karuneles man?"
    );

    expect(policy.actions).toContain("S1_clinical_assessment");
    expect(policy.actions).toContain("C4_service_description");
    expect(policy.reply).toMatch(/plomba|plombav/i);
    expect(policy.reply).not.toMatch(/skubi(ą|os)? pagalba/i);
  });

  it("R7/F2 bridge: service_info + null id recovers explicit multi-service names", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [
          { type: "service_info", confidence: 0.95 },
          { type: "clinical", confidence: 0.9 }
        ],
        service_or_topic: {
          id: null,
          confidence: 0.8,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "Ar jūsų klinikoje darote plombavimą ir karūnėles? Nežinau, ko reikėtų mano dančiui."
    );

    expect(policy.actions).toContain("S1_clinical_assessment");
    expect(policy.actions).toContain("F2_single_slot_schema_bridge");
    expect(policy.reply).toMatch(/plombav/i);
    expect(policy.reply).toMatch(/protezav|vainikel|karun/i);
    expect(policy.reply).toMatch(/11222/);
    expect(policy.reply).not.toMatch(/skubi(ą|os)? pagalba|nedelsiant/i);
    expect(policy.escalated).toBe(false);
  });

  it("R7/F2 bridge: no explicit Foundation names → assessment only, no invented services", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [
          { type: "service_info", confidence: 0.9 },
          { type: "clinical", confidence: 0.9 }
        ],
        service_or_topic: {
          id: null,
          confidence: 0.8,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "Ką galėtumėte padaryti su mano dančiu? Nežinau ko man reikia."
    );

    expect(policy.actions).toContain("S1_clinical_assessment");
    expect(policy.actions).toContain("F2_bridge_no_explicit_foundation_match");
    expect(policy.actions).not.toContain("F2_single_slot_schema_bridge");
    expect(policy.reply).not.toMatch(/plombav|protezav|implant/i);
    expect(policy.reply).toMatch(/11222/);
  });
  it("R4: first visit + clinical judgement still surfaces first-visit Foundation", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [
          { type: "clinical", confidence: 0.7 },
          { type: "first_visit_expectations", confidence: 0.9 }
        ],
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "Kaip pas jus vyksta pirmasis vizitas, vaikas prisibijo?"
    );

    expect(policy.actions).toContain("S1_clinical_assessment");
    expect(policy.actions).toContain("C4_info:first_visit_expectations");
    expect(policy.reply).not.toMatch(/skubi(ą|os)? pagalba/i);
  });

  it("R8: urgency + price ask suppresses price tourism", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "en",
        intents: [
          { type: "clinical", confidence: 0.9 },
          { type: "price", confidence: 0.8 }
        ],
        service_or_topic: {
          id: "fillings",
          confidence: 0.9,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: true,
          unsupported_or_ambiguous: false
        }
      }),
      "I'm bleeding badly — how much is a filling?"
    );

    expect(policy.actions).toContain("S1_urgent_phone");
    expect(policy.actions).not.toContain("C1_price");
    expect(policy.reply).not.toMatch(/EUR|filling/i);
  });

  it("F4/R12: orthodontics + consultation cue → online registration", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [{ type: "booking", confidence: 0.95 }],
        service_or_topic: {
          id: "orthodontics",
          confidence: 0.9,
          source: "current_message"
        },
        signals: {
          booking: "hard",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "Noriu užsiregistruoti ortodonto konsultacijai"
    );

    expect(policy.actions).toContain("C3_booking");
    expect(policy.route).toBe("online_registration");
    expect(policy.reply).toMatch(/registracija/i);
  });

  it("F4: orthodontics treatment booking without consultation cue → contact", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [{ type: "booking", confidence: 0.95 }],
        service_or_topic: {
          id: "orthodontics",
          confidence: 0.9,
          source: "current_message"
        },
        signals: {
          booking: "hard",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "Noriu užsiregistruoti ortodontiniam gydymui"
    );

    expect(policy.route).toBe("contact");
    expect(policy.reply).not.toMatch(/registracija\/\)/i);
  });

  it("F5a: price + null id + explicit plomba → fillings price", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [{ type: "price", confidence: 0.95 }],
        service_or_topic: {
          id: null,
          confidence: 0.6,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "Kiek kainuoja plomba?"
    );

    expect(policy.actions).toContain("F5a_single_slot_price_bridge");
    expect(policy.actions).toContain("C1_price");
    expect(policy.reply).toMatch(/EUR|plomb/i);
    expect(policy.reply).not.toMatch(/Kokios paslaugos kainą/i);
  });

  it("F5a: multi explicit services in price ask → clarify (F5b not bridged)", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [{ type: "price", confidence: 0.95 }],
        service_or_topic: {
          id: null,
          confidence: 0.5,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "Kiek kainuoja plomba ir balinimas?"
    );

    expect(policy.actions).toContain("F5b_multi_price_not_bridged");
    expect(policy.actions).toContain("C1_price_clarify");
    expect(policy.actions).not.toContain("F5a_single_slot_price_bridge");
  });

  it("F6 name: about_clinic + name ask → clinicName only", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "en",
        intents: [{ type: "about_clinic", confidence: 0.9 }],
        service_or_topic: null,
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "What is the name of the clinic?"
    );

    expect(policy.actions).toContain("F6_clinic_name");
    expect(policy.foundation_hits).toContain("clinic_profile.clinicName");
    expect(policy.reply).toMatch(/Dantu Harmonija|Dantų Harmonija/i);
    expect(policy.reply).not.toMatch(/experienced specialists/i);
  });

  it("F6 children: service_info + null id + vaik* → paediatric capability", () => {
    const policy = applyPolicyAndAssemble(
      base({
        intents: [{ type: "service_info", confidence: 0.9 }],
        service_or_topic: {
          id: null,
          confidence: 0.7,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "Ar priimate mokyklinio amžiaus vaikus?"
    );

    expect(policy.actions).toContain("F6_single_slot_service_bridge");
    expect(policy.reply).toMatch(/vaik/i);
    expect(policy.escalated).toBe(false);
    expect(policy.actions).not.toContain("D2_unresolved_service_info_clarify");
  });

  it("F6 lab: about_clinic + laborator* → laboratoryInfo (not about dump)", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "lt",
        intents: [{ type: "about_clinic", confidence: 0.9 }],
        service_or_topic: null,
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "Ar turite dantų laboratoriją?"
    );

    expect(policy.actions).toContain("F6_laboratory_info");
    expect(policy.foundation_hits).toContain("fallback.laboratoryInfo");
    expect(policy.reply).toMatch(/laborator/i);
    expect(policy.reply).toMatch(/kainos pacientams atskirai nerodomos|nėra atskira/i);
    expect(policy.actions).not.toContain("C4_about");
  });

  it("F6 lab: service_info + null id + laborator* → laboratoryInfo (PROD shape)", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "lt",
        intents: [{ type: "service_info", confidence: 0.9 }],
        service_or_topic: {
          id: null,
          confidence: 0.8,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "Ar turite dantų laboratoriją?"
    );

    expect(policy.actions).toContain("F6_laboratory_info");
    expect(policy.foundation_hits).toContain("fallback.laboratoryInfo");
    expect(policy.reply).toMatch(/laborator/i);
    expect(policy.escalated).toBe(false);
    expect(policy.actions).not.toContain("D2_unresolved_service_info_clarify");
  });

  it("F6 lab: other + unsupported + laborator* → laboratoryInfo (PROD flap)", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "lt",
        intents: [{ type: "other", confidence: 0.9 }],
        service_or_topic: {
          id: null,
          confidence: 0,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: true
        }
      }),
      "Ar turite dantų laboratoriją?"
    );

    expect(policy.actions).toContain("F6_laboratory_info");
    expect(policy.foundation_hits).toContain("fallback.laboratoryInfo");
    expect(policy.reply).toMatch(/laborator/i);
    expect(policy.escalated).toBe(false);
    expect(policy.actions).not.toContain("foundation_or_unsupported_handoff");
  });

  it("N2: service_info + null + EN catalogue ask → generic services list", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "en",
        intents: [{ type: "service_info", confidence: 0.9 }],
        service_or_topic: {
          id: null,
          confidence: 0.8,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "which services do you provide?"
    );

    expect(policy.actions).toContain("N2_service_catalogue_list");
    expect(policy.foundation_hits).toContain("services_catalogue");
    expect(policy.reply).toMatch(/Main services offered/i);
    expect(policy.reply).toMatch(/Oral hygiene|Dental implants/i);
    expect(policy.escalated).toBe(false);
    expect(policy.actions).not.toContain("D2_unresolved_service_info_clarify");
  });

  it("N2: service_info + null + LT catalogue ask → generic services list", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "lt",
        intents: [{ type: "service_info", confidence: 0.9 }],
        service_or_topic: {
          id: null,
          confidence: 0.8,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "Kokias paslaugas teikiate?"
    );

    expect(policy.actions).toContain("N2_service_catalogue_list");
    expect(policy.reply).toMatch(/pagrindinės paslaugos/i);
    expect(policy.escalated).toBe(false);
    expect(policy.actions).not.toContain("D2_unresolved_service_info_clarify");
  });

  it("N2 negative: service_info + null without catalogue cues → D2 still fires", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "en",
        intents: [{ type: "service_info", confidence: 0.9 }],
        service_or_topic: {
          id: null,
          confidence: 0.7,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        }
      }),
      "Can you fix my tooth?"
    );

    expect(policy.actions).toContain("D2_unresolved_service_info_clarify");
    expect(policy.actions).not.toContain("N2_service_catalogue_list");
    expect(policy.escalated).toBe(true);
  });

  it("N3b negative: quoting greeting what…services while asking registration → not catalogue", () => {
    const policy = applyPolicyAndAssemble(
      base({
        language: "en",
        intents: [{ type: "service_info", confidence: 0.9 }],
        service_or_topic: {
          id: null,
          confidence: 0.8,
          source: "current_message"
        },
        signals: {
          booking: "none",
          availability: false,
          clinical_or_suitability: false,
          unsupported_or_ambiguous: false
        },
        references: [{ type: "service_info", resolved_to: "registration", source_turn: 1 }]
      }),
      "ok, I asked you about what can you do. You answered: I can help with information about clinic services, prices, registration, and your first visit.; I want to know more about the registration"
    );

    expect(policy.actions).not.toContain("N2_service_catalogue_list");
    expect(policy.reply).not.toMatch(/Main services offered/i);
  });
});
