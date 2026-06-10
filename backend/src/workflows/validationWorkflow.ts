import { runCommand } from "../tools/terminal.js";
import type { ValidationResult } from "../types/validation.js";
import type { RepositoryContext } from "../types/repository.js";

export async function validationWorkflow(repository: RepositoryContext): Promise<ValidationResult> {
  console.log("Starting validation workflow...");

  const result = await runCommand(
    "npx eslint .",
    repository.repositoryPath
  );

  console.log("Validation Result:");
  console.log(result.success);

  return {
    success: result.success,
    output: result.stdout + result.stderr,
  };
}