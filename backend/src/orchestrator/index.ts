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
    repositoryUrl: "local-test",
    repositoryPath:
      "C:/Users/Sreevadhani_Kongu/jira-to-pr/sandbox/sample-project",
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

    // Create branch once
    await branchWorkflow(firstIssue, repository);

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
      const committed = await commitWorkflow(firstIssue, repository);

      if (committed) {
        await prWorkflow(firstIssue);
      }
    }
  }
  console.log("Orchestrator Finished");
}
