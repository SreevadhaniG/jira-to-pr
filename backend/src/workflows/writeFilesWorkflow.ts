import { writeFileContent } from "../tools/file.js";

import type { CodeGenerationResult } from "../types/codeGeneration.js";
import type { WorkflowResult } from "../types/workflow.js";
import type { RepositoryContext } from "../types/repository.js";

import path from "path";

export async function writeFilesWorkflow(
  generatedCode: CodeGenerationResult,
  repository: RepositoryContext,
): Promise<WorkflowResult<void>> {
  console.log("Writing updated source files...");

  try {
    for (const file of generatedCode.files) {
      const absolutePath = path.join(
        repository.repositoryPath,
        file.relativePath,
      );

      console.log(`Writing ${file.relativePath}`);

      await writeFileContent(absolutePath, file.content);
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to write generated files.",
    };
  }
}
