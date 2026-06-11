import { lintWorkflow } from "../workflows/lintworkflow.js";
import { branchWorkflow } from "../workflows/branchWorkflow.js";
import { autoFixWorkflow } from "../workflows/autoFixWorkflow.js";
import { commitWorkflow } from "../workflows/commitWorkflow.js";
import { prWorkflow } from "../workflows/prWorkflow.js";
import { repositoryWorkflow } from "../workflows/repositoryWorkflow.js";
import { cloneRepositoryWorkflow } from "../workflows/cloneRepositoryWorkflow.js";
import { repositoryAnalysisWorkflow } from "../workflows/repositoryAnalysisWorkflow.js";

export async function startOrchestrator() {
  console.log("Orchestrator Started");

  //Repository Workflow
  const repositoryUrl = process.env.GITHUB_LINK;

  if (!repositoryUrl) {
    throw new Error("GITHUB_LINK is not configured");
  }

  let repository = await repositoryWorkflow(repositoryUrl);

  if (!repository.exists) {
    //Clone Repository Workflow
    const cloned = await cloneRepositoryWorkflow(repository);

    if (!cloned) {
      console.log("Cloning unable to continue.");

      return;
    }

    repository = await repositoryWorkflow(repositoryUrl);
  }

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
    const issue = context.issues[0];

    if (!issue) {
      console.log("No issues found to fix.");
      return;
    }

    //Branch Workflow
    await branchWorkflow(issue, repository);

    //Auto Fix Workflow
    const fixed = await autoFixWorkflow(issue, repository);

    if (fixed) {
      //Commit Workflow
      const committed = await commitWorkflow(issue, repository);

      if (committed) {
        //PR Workflow
        await prWorkflow(issue);
      }
    }
  }
  console.log("Orchestrator Finished");
}
