import type { LintIssue } from "../parsers/eslintParser.js";
import { getCurrentBranch, createBranch } from "../tools/git.js";
import { generateBranchName } from "../utils/branchName.js";
import type { RepositoryContext } from "../types/repository.js";

export async function branchWorkflow(issue: LintIssue, repository: RepositoryContext) {
  const currentBranch = await getCurrentBranch(repository);

  console.log("Current Branch:", currentBranch);

  const branchName = generateBranchName(issue.message);

  console.log("Creating Branch:", branchName);

  await createBranch(branchName, repository);

  console.log("Branch created successfully.");
}
