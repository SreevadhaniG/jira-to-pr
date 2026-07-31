import type { RepositoryContext } from "../types/repository.js";
import { getRepositoryPath } from "../utils/repository.js";
import { pathExists } from "../tools/path.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function repositoryResolutionWorkflow(
  repositoryUrl: string,
): Promise<WorkflowResult<RepositoryContext>> {
  const repositoryPath = getRepositoryPath(repositoryUrl);

  const exists = pathExists(repositoryPath);

  return {
    success: true,
    data: {
      repositoryUrl,
      repositoryPath,
      exists,
    },
  };
}
