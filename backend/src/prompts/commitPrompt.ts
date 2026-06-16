export function buildCommitPrompt(diff: string): string {
  return `
Generate a concise conventional commit message.

Git Diff:

${diff}

Rules:
- Return only the commit message.
- Use conventional commit format.
- Do not include markdown.
- Do not include explanations.
- Keep it under 72 characters.
`;
}
