import type { LintIssue } from "../parsers/eslintParser.js";
import { getCurrentBranch, createBranch } from "../tools/git.js";
import { generateBranchName } from "../utils/branchName.js";

export async function branchWorkflow(issue: LintIssue) {
  const currentBranch = await getCurrentBranch();

  console.log("Current Branch:", currentBranch);

  const branchName = generateBranchName(issue.message);

  console.log("Creating Branch:", branchName);

  await createBranch(branchName);

  console.log("Branch created successfully.");
}
