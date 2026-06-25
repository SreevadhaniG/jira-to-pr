import { lintWorkflow } from "../workflows/lintworkflow.js";
import { branchWorkflow } from "../workflows/branchWorkflow.js";
import { autoFixWorkflow } from "../workflows/autoFixWorkflow.js";
import { commitWorkflow } from "../workflows/commitWorkflow.js";
import { prWorkflow } from "../workflows/prWorkflow.js";
import { repositoryWorkflow } from "../workflows/repositoryWorkflow.js";
import { cloneRepositoryWorkflow } from "../workflows/cloneRepositoryWorkflow.js";
import { repositoryAnalysisWorkflow } from "../workflows/repositoryAnalysisWorkflow.js";
import { gitDiff, gitAdd, getCurrentBranch } from "../tools/git.js";
import { pushWorkflow } from "../workflows/pushWorkflow.js";
import { parseGitHubRepositoryUrl } from "../utils/github.js";
import { createPullRequestWorkflow } from "../workflows/createPullRequestWorkflow.js";
import { runCommand } from "../tools/terminal.js";

export async function startOrchestrator() {
  console.log("Orchestrator Started");

  //Repository Workflow
  // const repositoryUrl = process.env.GITHUB_LINK;

  // if (!repositoryUrl) {
  //   throw new Error("GITHUB_LINK is not configured");
  // }

  // let repository = await repositoryWorkflow(repositoryUrl);

  // if (!repository.exists) {
  //   //Clone Repository Workflow
  //   const cloned = await cloneRepositoryWorkflow(repository);

  //   if (!cloned) {
  //     console.log("Cloning unable to continue.");

  //     return;
  //   }

  //   repository = await repositoryWorkflow(repositoryUrl);
  // }

  const repository = {
    repositoryUrl: process.env.TEST_REPOSITORY_URL || "",
    repositoryPath: process.env.TEST_REPOSITORY_LINK || "",
    exists: true,
  };

  console.log("Repository Info:");

  console.log(repository);

  //Repository Analysis Workflow
  const analysis = await repositoryAnalysisWorkflow(repository);

  console.log("Repository Analysis:");

  console.log(analysis);

  if (!analysis.hasEslint) {
    console.log("No ESLint configuration found.");

    return;
  }

  //Lint workflow
  const context = await lintWorkflow(repository);

  if (context.decision === "PASS") {
    console.log("Linting passed. No changes required.");
  }

  if (context.decision === "AUTO_FIX") {
    const firstIssue = context.issues[0];

    if (!firstIssue) {
      console.log("No issues found to fix.");
      return;
    }

    const pwdResult = await runCommand("echo %cd%", repository.repositoryPath);
    console.log("EXECUTING IN:", pwdResult.stdout);

    // Create branch once
    const branchCreated = await branchWorkflow(firstIssue, repository);

    if (!branchCreated) {
      console.log("Failed to create branch.");
      return;
    }

    const MAX_FIX_CYCLES = 10;

    let fixedAny = false;

    for (let cycle = 1; cycle <= MAX_FIX_CYCLES; cycle++) {
      console.log(`Fix Cycle ${cycle}`);

      const lintContext = await lintWorkflow(repository);

      if (lintContext.decision === "PASS") {
        console.log("All lint issues resolved.");

        break;
      }

      const issue = lintContext.issues[0];

      if (!issue) {
        console.log("No issues found.");

        break;
      }

      console.log(`Fixing: ${issue.message}`);

      const fixed = await autoFixWorkflow(issue, repository);

      if (!fixed) {
        console.log("Unable to fix issue.");

        break;
      }

      fixedAny = true;
    }

    if (fixedAny) {
      const addResult = await gitAdd(repository);

      if (!addResult.success) {
        console.log("Unable to stage files.");
        return;
      }

      console.log("Files staged.");

      const diffResult = await gitDiff(repository);

      if (!diffResult.success) {
        console.log("Unable to generate diff.");
        return;
      }

      const diff = diffResult.stdout;

      if (!diff.trim()) {
        console.log("No changes detected.");
        return;
      }

      console.log("Diff:");
      console.log(diff);

      const committed = await commitWorkflow(repository, diff);

      if (committed) {
        const pushed = await pushWorkflow(repository);

        if (pushed) {
          const pr = await prWorkflow(diff);

          const githubRepo = parseGitHubRepositoryUrl(repository.repositoryUrl);

          const head = await getCurrentBranch(repository);

          const prContext = {
            owner: githubRepo.owner,
            repo: githubRepo.repo,
            head,
            base: "main",
            title: pr.title,
            description: pr.description,
          };

          const prUrl = await createPullRequestWorkflow(prContext);

          console.log("PR Created:");
          console.log(prUrl);
        }
      }
    }
  }
  console.log("Orchestrator Finished");
}
