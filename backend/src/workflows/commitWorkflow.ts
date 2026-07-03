import { gitStatus, gitCommit } from "../tools/git.js";
import { buildCommitPrompt } from "../prompts/commitPrompt.js";
import type { RepositoryContext } from "../types/repository.js";
import type { WorkflowResult } from "../types/workflow.js";
import { llmService } from "../services/llmService.js";

export async function commitWorkflow(
  repository: RepositoryContext,
  diff: string,
): Promise<WorkflowResult> {
  console.log("Starting commit workflow...");

  const statusResult = await gitStatus(repository);

  const hasChanges = statusResult.stdout.trim().length > 0;

  if (!hasChanges) {
    console.log("No changes detected. Skipping commit.");
    return {
      success: false,
      error: "No changes to commit.",
    };
  }

  console.log("Changes detected.");

  const prompt = buildCommitPrompt(diff);

  const commitMessage = await llmService.generateCommitMessage(prompt);

  const result = await gitCommit(commitMessage, repository);

  if (!result.success) {
    console.log("Commit failed.");
    
    return {
      success: false,
      error: "Failed to commit changes.",
    };
  }

  console.log("Commit Message:");
  console.log(commitMessage);

  return {
    success: true,
  };
}
