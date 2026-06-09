import { runCommand } from "../tools/terminal.js";
import type { ValidationResult } from "../types/validation.js";

export async function validationWorkflow(): Promise<ValidationResult> {
  console.log("Starting validation workflow...");

  const result = await runCommand(
    "npx eslint .",
    "../sandbox/sample-project"
  );

  console.log("Validation Result:");
  console.log(result.success);

  return {
    success: result.success,
    output: result.stdout + result.stderr,
  };
}