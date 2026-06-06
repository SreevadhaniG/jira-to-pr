import { lintWorkflow } from "../workflows/lintworkflow.js";

export async function startOrchestrator() {
  console.log("Orchestrator Started");

  await lintWorkflow();

  console.log("Orchestrator Finished");
}