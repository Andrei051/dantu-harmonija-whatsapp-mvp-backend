/**
 * Phase 2C scripts — re-export from src so offline runner and PROD share one policy/schema.
 */
export {
  applyPolicyAndAssemble,
  type PolicyTrace
} from "../../src/services/ai/policyAssemble";
export type { InterpretationV1 } from "../../src/services/ai/validateInterpretation";
