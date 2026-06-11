import path from "path";

export function getRepositoryPath(repositoryUrl: string): string {
  const repositoryName = repositoryUrl.split("/").pop()?.replace(".git", "");

  if (!repositoryName) {
    throw new Error("Invalid repository URL");
  }

  const workspaceRoot = process.env.WORKSPACE_ROOT;

  if (!workspaceRoot) {
    throw new Error("WORKSPACE_ROOT is not configured");
  }

  return path.join(workspaceRoot, repositoryName);
}
