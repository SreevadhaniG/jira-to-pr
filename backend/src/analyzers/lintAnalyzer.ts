export function analyzeLintIssues(
  issues: LintIssue[]
) {
  return {
    totalIssues: issues.length,
    canAutoFix: true,
  };
}