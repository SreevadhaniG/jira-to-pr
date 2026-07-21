import { readFileContent } from "../tools/file.js";
import type { RepositoryContext, RepositoryFile } from "../types/repository.js";
import type { ImplementationPlan } from "../types/implementation.js";
import type { WorkflowResult } from "../types/workflow.js";
import path from "path";

export async function sourceFileWorkflow(
  implementationPlan: ImplementationPlan,
  repository: RepositoryContext,
): Promise<WorkflowResult<RepositoryFile[]>> {
  console.log("Reading source files...");

  const files: RepositoryFile[] = [];

  for (const relativePath of implementationPlan.files) {
    const absolutePath = path.join(
      repository.repositoryPath,
      relativePath,
    );

    try {
      const content = await readFileContent(absolutePath);

      files.push({
        name: path.basename(relativePath),
        relativePath,
        content,
      });
    } catch (error) {
      return {
        success: false,
        error: `Unable to read '${relativePath}'.`,
      };
    }
  }

  return {
    success: true,
    data: files,
  };
}