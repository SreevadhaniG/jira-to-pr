import type { LintIssue } from "../parsers/eslintParser.js";

export function buildPRPrompt(
  issue: LintIssue
): string {
  return `
Generate a pull request title and description.

Issue:
${issue.message}

Return:

Title:
...

Description:
...
`;
}