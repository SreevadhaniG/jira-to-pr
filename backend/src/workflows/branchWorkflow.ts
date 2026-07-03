import type { LintIssue } from "../parsers/eslintParser.js";
import { getCurrentBranch, createBranch } from "../tools/git.js";
import { generateBranchName } from "../utils/branchName.js";
import type { RepositoryContext } from "../types/repository.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function branchWorkflow(
  issue: LintIssue,
  repository: RepositoryContext,
): Promise<WorkflowResult> {
  const currentBranch = await getCurrentBranch(repository);

  console.log("Current Branch:", currentBranch);

  const branchName = generateBranchName(issue.message);

  console.log("Creating Branch:", branchName);

  await createBranch(branchName, repository);

  const branch = await getCurrentBranch(repository);

  if (branch !== branchName) {
    console.log("Branch creation failed.");

    return {
      success: false,
      error: `Failed to create branch '${branchName}'.`,
    };
  }

  console.log("Branch created successfully");

  return {
    success: true,
  };
}
