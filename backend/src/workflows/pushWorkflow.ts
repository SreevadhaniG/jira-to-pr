import { gitPush } from "../tools/git.js";
import type { RepositoryContext } from "../types/repository.js";

export async function pushWorkflow(
  repository: RepositoryContext,
): Promise<boolean> {
  console.log("Starting push workflow...");

  const result = await gitPush(repository);

  console.log("STDOUT:");
  console.log(result.stdout);

  console.log("STDERR:");
  console.log(result.stderr);

  if (!result.success) {
    console.log("Push failed.");
    return false;
  }

  console.log("Branch pushed successfully.");

  return true;
}
