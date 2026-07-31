import path from "path";

import { readFileContent } from "../tools/file.js";

import type { RepositoryContext, RepositoryFile } from "../types/repository.js";
import type { ImplementationPlan } from "../types/implementation.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function sourceFileWorkflow(
  implementationPlan: ImplementationPlan,
  repository: RepositoryContext,
): Promise<WorkflowResult<RepositoryFile[]>> {
  const files: RepositoryFile[] = [];

  for (const plannedFile of implementationPlan.files) {
    const absolutePath = path.join(
      repository.repositoryPath,
      plannedFile.relativePath,
    );

    try {
      const content = await readFileContent(absolutePath);

      console.log("inside try");

      files.push({
        name: path.basename(plannedFile.relativePath),
        relativePath: plannedFile.relativePath,
        requiredChanges: plannedFile.requiredChanges,
        exists: true,
        content,
      });
    } catch {

      console.log("inside catch");
      files.push({
        name: path.basename(plannedFile.relativePath),
        relativePath: plannedFile.relativePath,
        requiredChanges: plannedFile.requiredChanges,
        exists: false,
        content: "",
      });
    }
  }

  console.log("completed");

  return {
    success: true,
    data: files,
  };
}
