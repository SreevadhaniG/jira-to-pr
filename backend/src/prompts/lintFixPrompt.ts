import type { LintIssue } from "../parsers/eslintParser.js";

export function buildLintFixPrompt(
  issue: LintIssue,
  fileContent: string,
): string {
  return `
You are a senior TypeScript engineer.

Fix the ESLint issue described below.

Issue:
${issue.message}

File Content:

${fileContent}

Rules:
- Fix only what is necessary to resolve the ESLint issue.
- Preserve existing functionality.
- Do not modify unrelated code.
- Do not add comments.
- Do not add explanations.
- Do not add markdown.
- Do not use code fences.
- Return the COMPLETE updated file.
- The returned code must be valid TypeScript.

Return only the updated file contents.
`;
}