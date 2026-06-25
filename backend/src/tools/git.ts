import { runCommand } from "./terminal.js";
import type { RepositoryContext } from "../types/repository.js";

export async function getCurrentBranch(repository: RepositoryContext) {
  const result = await runCommand(
    "git branch --show-current",
    repository.repositoryPath,
  );

  return result.stdout.trim();
}

export async function createBranch(
  branchName: string,
  repository: RepositoryContext,
) {
  return await runCommand(
    `git checkout -b ${branchName}`,
    repository.repositoryPath,
  );
}

export async function gitStatus(repository: RepositoryContext) {
  return await runCommand("git status --short", repository.repositoryPath);
}

export async function gitAdd(repository: RepositoryContext) {
  return await runCommand("git add .", repository.repositoryPath);
}

export async function gitCommit(
  message: string,
  repository: RepositoryContext,
) {
  return await runCommand(
    `git commit -m "${message}"`,
    repository.repositoryPath,
  );
}

export async function gitPush(repository: RepositoryContext) {
  return await runCommand(
    "git push --set-upstream origin HEAD",
    repository.repositoryPath,
  );
}

export async function gitClone(repositoryUrl: string, destinationPath: string) {
  return await runCommand(`git clone ${repositoryUrl} "${destinationPath}"`);
}

export async function gitDiff(repository: RepositoryContext) {
  return await runCommand("git diff --cached", repository.repositoryPath);
}

export async function remoteBranchExists(
  branch: string,
  repository: RepositoryContext,
) {
  return await runCommand(
    `git ls-remote --heads origin ${branch}`,
    repository.repositoryPath,
  );
}
