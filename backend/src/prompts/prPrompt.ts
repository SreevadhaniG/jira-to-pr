export function buildPRPrompt(diff: string): string {
  return `
You are generating a pull request.

Git Diff:

${diff}

Return ONLY a JSON object.

Example:

{
  "title": "Refactor generateReport and remove unused code",
  "description": "Removes unused imports and parameters, simplifies conditional logic, and improves type safety."
}

Rules:
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.
- Do not provide multiple options.
- Do not include explanations.
- Title and description must be based on the actual code changes in the diff.
- Title must be concise.
- Description must summarize the actual code changes from the diff.
`;
}
