import { buildPRPrompt } from "../prompts/prPrompt.js";
import { llmService } from "../services/llm.js";
import type { PullRequestDraft } from "../types/pr.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function prWorkflow(diff: string): Promise<WorkflowResult<PullRequestDraft>> {
  console.log("Starting PR workflow...");

  const prompt = buildPRPrompt(diff);

  const pr = await llmService.generatePRDraft(prompt);

  console.log("PR Title:");
  console.log(pr.title);

  console.log("PR Description:");
  console.log(pr.description);

  return {
    success: true,
    data: pr,
  };
}
