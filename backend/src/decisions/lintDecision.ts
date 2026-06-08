import type { LintAnalysis } from "../analyzers/lintAnalyzer.js";

export type LintDecision = "PASS" | "AUTO_FIX";

export function makeLintDecision(analysis: LintAnalysis): LintDecision {
  if (analysis.canAutoFix) {
    return "AUTO_FIX";
  }

  return "PASS";
}
