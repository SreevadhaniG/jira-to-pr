import { getLLMProvider } from "../providers/index.js";
import { buildPRPrompt } from "../prompts/prPrompt.js";
import type { LintIssue } from "../parsers/eslintParser.js";
import type { PullRequestDraft } from "../types/pr.js";

export async function prWorkflow(issue: LintIssue): Promise<PullRequestDraft> {
  console.log("Starting PR workflow...");

  const prompt = buildPRPrompt(issue);

  const provider = getLLMProvider();

  const pr = await provider.generatePR(prompt);

  console.log("PR Title:");
  console.log(pr.title);

  console.log("PR Description:");
  console.log(pr.description);

  return pr;
}
