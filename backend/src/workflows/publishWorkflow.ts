import { gitAdd, gitDiff, getCurrentBranch } from "../tools/git.js";
import { commitWorkflow } from "./commitWorkflow.js";
import { pushWorkflow } from "./pushWorkflow.js";
import { prWorkflow } from "./prWorkflow.js";
import { createPullRequestWorkflow } from "./createPullRequestWorkflow.js";
import { parseGitHubRepositoryUrl } from "../utils/github.js";

import type { RepositoryContext } from "../types/repository.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function publishWorkflow(
  repository: RepositoryContext,
): Promise<WorkflowResult<string>> {
  console.log("Starting publish workflow...");

  // Stage files
  const addResult = await gitAdd(repository);

  if (!addResult.success) {
    return {
      success: false,
      error: "Unable to stage files.",
    };
  }

  console.log("Files staged.");

  // Generate diff
  const diffResult = await gitDiff(repository);

  if (!diffResult.success) {
    return {
      success: false,
      error: "Unable to generate git diff.",
    };
  }

  const diff = diffResult.stdout;

  if (!diff.trim()) {
    return {
      success: false,
      error: "No changes detected.",
    };
  }

  console.log("Diff:");
  console.log(diff);

  // Commit
  const commitResult = await commitWorkflow(repository, diff);

  if (!commitResult.success) {
    return {
      success: false,
      error: commitResult.error,
    };
  }

  // Push
  const pushResult = await pushWorkflow(repository);

  if (!pushResult.success) {
    return {
      success: false,
      error: pushResult.error,
    };
  }

  // Generate PR content
  const prResult = await prWorkflow(diff);

  if (!prResult.success) {
    return {
      success: false,
      error: prResult.error,
    };
  }

  const githubRepo = parseGitHubRepositoryUrl(repository.repositoryUrl);

  const head = await getCurrentBranch(repository);

  const prContext = {
    owner: githubRepo.owner,
    repo: githubRepo.repo,
    head,
    base: "main",
    title: prResult.data.title,
    description: prResult.data.description,
  };

  // Create GitHub PR
  const prCreationResult = await createPullRequestWorkflow(prContext);

  if (!prCreationResult.success) {
    return {
      success: false,
      error: prCreationResult.error,
    };
  }

  console.log("PR Created:");
  console.log(prCreationResult.data);

  return {
    success: true,
    data: prCreationResult.data,
  };
}
