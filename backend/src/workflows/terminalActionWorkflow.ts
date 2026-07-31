import { llmService } from "../services/llm.js";
import { buildTerminalActionPrompt } from "../prompts/terminalActionPrompt.js";
import { executeTerminalActions } from "../services/terminalActionExecutor.js";

import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";

import type { ValidationResult } from "../types/validation.js";
import type { TerminalActionPlan } from "../types/terminalAction.js";
import type { RepositoryContext } from "../types/repository.js";

export async function terminalActionWorkflow(
  validationResult: ValidationResult,
  repository: RepositoryContext,
): Promise<boolean> {
  console.log("Analyzing validation failure...");

  const prompt = buildTerminalActionPrompt(validationResult);

  const plan = await llmService.generateJSON<TerminalActionPlan>(prompt);

  if (!plan.required) {
    console.log("No terminal actions required.");
    return false;
  }

  console.log();
  console.log("Terminal Action Summary:");
  console.log(plan.summary);
  console.log();

  console.log("Proposed Actions:");

  plan.actions.forEach((action, index) => {
    console.log(`${index + 1}. ${action.command}`);
    console.log(`   Reason: ${action.reason}`);
  });

  console.log();

  const rl = createInterface({
    input,
    output,
  });

  const answer = (
    await rl.question("\nApprove these terminal actions? (y/n): ")
  )
    .trim()
    .toLowerCase();

  rl.close();

  if (answer !== "y" && answer !== "yes") {
    console.log("Terminal actions rejected by user.");
    return false;
  }

  console.log("Terminal actions approved.");
  console.log();

  await executeTerminalActions(plan.actions, repository.repositoryPath);

  return true;
}
