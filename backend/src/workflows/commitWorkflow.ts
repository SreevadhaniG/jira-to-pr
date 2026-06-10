import { MockLLMProvider } from "../providers/llm.js";
import { gitStatus, gitAdd, gitCommit } from "../tools/git.js";
import { buildCommitPrompt } from "../prompts/commitPrompt.js";
import type { LintIssue } from "../parsers/eslintParser.js";

export async function commitWorkflow(issue: LintIssue): Promise<boolean> {
  console.log("Starting commit workflow...");

  const statusResult = await gitStatus();

  const hasChanges = statusResult.stdout.trim().length > 0;

  if (!hasChanges) {
    console.log("No changes detected. Skipping commit.");
    return false;
  }

  console.log("Changes detected.");

  await gitAdd();

  console.log("Files staged.");

  const prompt = buildCommitPrompt(issue);

  const provider = getLLMProvider();

  const commitMessage = await provider.generateCommitMessage(prompt);

  const result = await gitCommit(commitMessage);

  if (!result.success) {
    console.log("Commit failed.");
    return false;
  }

  console.log("Commit Message:");
  console.log(commitMessage);

  return true;
}
