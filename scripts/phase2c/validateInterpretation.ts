/**
 * Phase 2C scripts — re-export from src so offline runner and PROD share one policy/schema.
 */
export {
  validateInterpretation,
  extractJsonObject,
  type InterpretationV1
} from "../../src/services/ai/validateInterpretation";
