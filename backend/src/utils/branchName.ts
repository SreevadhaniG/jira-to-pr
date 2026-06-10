export function generateBranchName(
  issueMessage: string
): string {
  const sanitized = issueMessage
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `agent/${sanitized}`;
}