import { gitClone } from "../tools/git.js";
import type { RepositoryContext } from "../types/repository.js";

export async function cloneRepositoryWorkflow(
  repository: RepositoryContext,
): Promise<boolean> {
  console.log("Starting clone repository workflow...");

  const result = await gitClone(
    repository.repositoryUrl,
    repository.repositoryPath,
  );

  if (!result.success) {
    console.log("Repository clone failed.");

    console.log(result.stderr);

    return false;
  }

  console.log("Repository cloned successfully.");

  return true;
}
