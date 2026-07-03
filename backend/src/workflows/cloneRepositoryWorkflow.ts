import { gitClone } from "../tools/git.js";
import type { RepositoryContext } from "../types/repository.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function cloneRepositoryWorkflow(
  repository: RepositoryContext,
): Promise<WorkflowResult> {
  console.log("Starting clone repository workflow...");

  const result = await gitClone(
    repository.repositoryUrl,
    repository.repositoryPath,
  );

  if (!result.success) {
    console.log("Repository clone failed.");

    console.log(result.stderr);

    return {
      success: false,
      error: "Failed to clone repository.",
    };
  }

  console.log("Repository cloned successfully.");

  return {
    success: true,
  };
}
