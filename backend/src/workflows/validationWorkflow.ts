import { runCommand } from "../tools/terminal.js";

import type { RepositoryContext } from "../types/repository.js";
import type { ValidationResult } from "../types/validation.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function validationWorkflow(
  repository: RepositoryContext,
  command: string,
): Promise<WorkflowResult<ValidationResult>> {
  console.log("Validating implementation...");

  const result = await runCommand(command, repository.repositoryPath);

  return {
    success: true,
    data: {
      passed: result.success,
      command,
      output: result.stdout + result.stderr,
    },
  };
}
