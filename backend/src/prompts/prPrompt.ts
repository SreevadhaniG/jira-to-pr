import type { LintIssue } from "../parsers/eslintParser.js";

export function buildPRPrompt(
  issue: LintIssue
): string {
  return `
You are generating a pull request.

Issue:
${issue.message}

Return ONLY a JSON object.

Example:

{
  "title": "Fix unused variable warning",
  "description": "Removes the unused variable and resolves the ESLint warning."
}

Rules:
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.
- Do not provide multiple options.
- Do not include explanations.
`;
}