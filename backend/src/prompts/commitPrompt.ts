import type { LintIssue } from "../parsers/eslintParser.js";

export function buildCommitPrompt(
  issue: LintIssue
): string {
  return `
Generate a concise conventional commit message.

Issue:
${issue.message}

Return only the commit message.
`;
}