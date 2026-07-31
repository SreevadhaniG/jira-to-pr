import { runCommand } from "../tools/terminal.js";

import type { RepositoryContext } from "../types/repository.js";
import type { ValidationResult } from "../types/validation.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function validationWorkflow(
  repository: RepositoryContext,
  commands: string[],
): Promise<WorkflowResult<ValidationResult>> {
  console.log("Validating implementation...");

  console.log("Repository Path:", repository.repositoryPath);

  for (const command of commands) {
    console.log(`Running: ${command}`);

    const result = await runCommand(command, repository.repositoryPath);

    if (!result.success) {
      return {
        success: true,
        data: {
          passed: false,
          command,
          output: result.stdout + result.stderr,
        },
      };
    }
  }

  if (commands.length === 0) {
    return {
      success: false,
      error: "No verification commands were provided.",
    };
  }

  return {
    success: true,
    data: {
      passed: true,
      command: commands[commands.length - 1]!,
      output: "All verification commands passed.",
    },
  };
}
