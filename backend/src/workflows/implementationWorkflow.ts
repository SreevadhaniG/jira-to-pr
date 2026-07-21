import { buildImplementationPrompt } from "../prompts/implementationPrompt.js";
import { llmService } from "../services/llm.js";

import type { JiraIssue } from "../types/jira.js";
import type {
  RepositoryMetadata,
  RepositoryFile,
} from "../types/repository.js";
import type { WorkflowResult } from "../types/workflow.js";
import type { CodeGenerationResult } from "../types/codeGeneration.js";
import type { ValidationResult } from "../types/validation.js";

export async function implementationWorkflow(
  issue: JiraIssue,
  repository: RepositoryMetadata,
  sourceFiles: RepositoryFile[],
  validation?: ValidationResult,
): Promise<WorkflowResult<CodeGenerationResult>> {
  console.log(
    validation
      ? "Generating updated implementation..."
      : "Generating implementation...",
  );

  try {
    const prompt = buildImplementationPrompt(
      issue,
      repository,
      sourceFiles,
      validation,
    );

    const implementation =
      await llmService.generateJSON<CodeGenerationResult>(prompt);

    return {
      success: true,
      data: implementation,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Implementation generation failed.",
    };
  }
}
