import type { RepositoryContext } from "../types/repository.js";

export async function repositoryWorkflow(): Promise<RepositoryContext> {
  return {
    repositoryPath: "../sandbox/sample-project",
  };
}