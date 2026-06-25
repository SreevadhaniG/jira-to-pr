import { getLLMProvider } from "../providers/index.js";
import { gitStatus, gitCommit } from "../tools/git.js";
import { buildCommitPrompt } from "../prompts/commitPrompt.js";
import type { RepositoryContext } from "../types/repository.js";

export async function commitWorkflow(
  repository: RepositoryContext,
  diff: string,
): Promise<boolean> {
  console.log("Starting commit workflow...");

  const statusResult = await gitStatus(repository);

  const hasChanges = statusResult.stdout.trim().length > 0;

  if (!hasChanges) {
    console.log("No changes detected. Skipping commit.");
    return false;
  }

  console.log("Changes detected.");

  const prompt = buildCommitPrompt(diff);

  const provider = getLLMProvider();

  const commitMessage = await provider.generateCommitMessage(prompt);

  const result = await gitCommit(commitMessage, repository);

  if (!result.success) {
    console.log("Commit failed.");
    return false;
  }

  console.log("Commit Message:");
  console.log(commitMessage);

  return true;
}
