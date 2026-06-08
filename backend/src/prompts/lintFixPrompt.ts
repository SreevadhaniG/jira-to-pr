import type { LintIssue } from "../parsers/eslintParser.js";

export function buildLintFixPrompt(
  issue: LintIssue,
  fileContent: string
): string {
  return `
You are a TypeScript expert.

Fix the following ESLint issue:

${issue.message}

Code:

${fileContent}

Return only the corrected code.
`;
}