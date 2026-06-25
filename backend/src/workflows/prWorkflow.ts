import { getLLMProvider } from "../providers/index.js";
import { buildPRPrompt } from "../prompts/prPrompt.js";
import type { PullRequestDraft } from "../types/pr.js";

export async function prWorkflow(diff: string): Promise<PullRequestDraft> {
  console.log("Starting PR workflow...");

  const prompt = buildPRPrompt(diff);

  const provider = getLLMProvider();

  const pr = await provider.generatePR(prompt);

  console.log("PR Title:");
  console.log(pr.title);

  console.log("PR Description:");
  console.log(pr.description);

  return pr;
}
