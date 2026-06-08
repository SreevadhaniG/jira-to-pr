import type { LintIssue } from "../parsers/eslintParser.js";

export interface LintAnalysis {
  totalIssues: number;
  passed: boolean;
  canAutoFix: boolean;
}

export function analyzeLintIssues(
  issues: LintIssue[]
): LintAnalysis {
  const totalIssues = issues.length;

  return {
    totalIssues,
    passed: totalIssues === 0,
    canAutoFix: totalIssues > 0,
  };
}