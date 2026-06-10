  import { lintWorkflow } from "../workflows/lintworkflow.js";
  import { branchWorkflow } from "../workflows/branchWorkflow.js";
  import { autoFixWorkflow } from "../workflows/autoFixWorkflow.js";
  import { commitWorkflow } from "../workflows/commitWorkflow.js";
  import { prWorkflow } from "../workflows/prWorkflow.js";
  import { repositoryWorkflow } from "../workflows/repositoryWorkflow.js";

  export async function startOrchestrator() {
    console.log("Orchestrator Started");

    const repository = await repositoryWorkflow();

    const context = await lintWorkflow(repository);

    if (context.decision === "PASS") {
      console.log("No changes required");
    }

    if (context.decision === "AUTO_FIX") {
      const issue = context.issues[0];

      if (!issue) {
        console.log("No issues found to fix.");
        return;
      }

      await branchWorkflow(issue);

      const fixed = await autoFixWorkflow(issue, repository);

      if (fixed) {
        const committed = await commitWorkflow(issue);

        if (committed) {
          await prWorkflow(issue);
        }
      }
    }
    console.log("Orchestrator Finished");
  }
