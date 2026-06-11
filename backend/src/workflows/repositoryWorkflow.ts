import type { RepositoryContext } from "../types/repository.js";
import { getRepositoryPath } from "../utils/repository.js";
import { pathExists } from "../tools/path.js";

export async function repositoryWorkflow(
  repositoryUrl: string,
): Promise<RepositoryContext> {
  const repositoryPath = getRepositoryPath(repositoryUrl);

  const exists = pathExists(repositoryPath);

  return {
    repositoryUrl,
    repositoryPath,
    exists,
  };
}
