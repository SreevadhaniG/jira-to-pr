export function generateBranchName(
  issueMessage: string
): string {
  return issueMessage
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 40);
}