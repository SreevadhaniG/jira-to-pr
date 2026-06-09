import { lintWorkflow } from "../workflows/lintworkflow.js";
import { branchWorkflow } from "../workflows/branchWorkflow.js";
import { autoFixWorkflow } from "../workflows/autoFixWorkflow.js";

export async function startOrchestrator() {
  console.log("Orchestrator Started");

  const context = await lintWorkflow();

  if (context.decision === "PASS") {
    console.log("No changes required");
  }

  if (context.decision === "AUTO_FIX") {
    const issue = context.issues[0];

    if (!issue) {
      console.log("No issues found to fix.");
      return;
    }

    await branchWorkflow();
    await autoFixWorkflow(issue);
  }
  console.log("Orchestrator Finished");
}
