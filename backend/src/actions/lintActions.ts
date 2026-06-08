import type { LintWorkflowContext } from "../types/workflow.js";
import { autoFixWorkflow } from "../workflows/autoFixWorkflow.js";

export async function executeLintAction(
  context: LintWorkflowContext
) {
  switch (context.decision) {
    case "PASS":
      console.log("Lint passed. Continuing workflow.");
      break;

    case "AUTO_FIX": {
      const firstIssue = context.issues[0];

      if (!firstIssue) {
        console.log("No issues found.");
        return;
      }

      await autoFixWorkflow(firstIssue);
      break;
    }
  }
}