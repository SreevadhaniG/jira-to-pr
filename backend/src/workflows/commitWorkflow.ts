import { getLLMProvider } from "../providers/index.js";
import { gitStatus, gitAdd, gitCommit } from "../tools/git.js";
import { buildCommitPrompt } from "../prompts/commitPrompt.js";
import type { LintIssue } from "../parsers/eslintParser.js";
import type { RepositoryContext } from "../types/repository.js";
import { gitDiff } from "../tools/git.js";

export async function commitWorkflow(
  issue: LintIssue,
  repository: RepositoryContext,
): Promise<boolean> {
  console.log("Starting commit workflow...");

  const statusResult = await gitStatus(repository);

  const hasChanges = statusResult.stdout.trim().length > 0;

  if (!hasChanges) {
    console.log("No changes detected. Skipping commit.");
    return false;
  }

  console.log("Changes detected.");

  await gitAdd(repository);

  console.log("Files staged.");

  const diffResult = await gitDiff(repository);

  console.log("Git Diff:");
  console.log(diffResult.stdout);

  const prompt = buildCommitPrompt(diffResult.stdout);

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
