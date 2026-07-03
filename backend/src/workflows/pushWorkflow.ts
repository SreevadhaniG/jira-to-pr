import { getCurrentBranch, gitPush, remoteBranchExists } from "../tools/git.js";
import type { RepositoryContext } from "../types/repository.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function pushWorkflow(
  repository: RepositoryContext,
): Promise<WorkflowResult> {
  console.log("Starting push workflow...");

  const result = await gitPush(repository);

  console.log("STDOUT:");
  console.log(result.stdout);

  console.log("STDERR:");
  console.log(result.stderr);

  const currentBranch = await getCurrentBranch(repository);

  const remoteCheck = await remoteBranchExists(currentBranch, repository);

  if (!remoteCheck.stdout.trim()) {
    console.log("Push failed.");

    return {
      success: false,
      error: "Failed to push changes.",
    };
  }

  console.log("Branch pushed successfully.");

  return {
    success: true,
  };
}
