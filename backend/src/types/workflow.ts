import type { LintIssue } from "../parsers/eslintParser.js";
import type { LintAnalysis } from "../analyzers/lintAnalyzer.js";
import type { LintDecision } from "../decisions/lintDecision.js";

export interface LintWorkflowContext {
  issues: LintIssue[];
  analysis: LintAnalysis;
  decision: LintDecision;
}