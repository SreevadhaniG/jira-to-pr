import { runCommand } from "./terminal.js";

export async function getCurrentBranch() {
  const result = await runCommand("git branch --show-current");

  return result.stdout.trim();
}

export async function createBranch(branchName: string) {
  return await runCommand(
    `git checkout -b ${branchName}`,
    "../sandbox/sample-project",
  );
}

export async function gitStatus() {
  return await runCommand("git status --short", "../sandbox/sample-project");
}

export async function gitAdd() {
  return await runCommand("git add .", "../sandbox/sample-project");
}

export async function gitCommit(message: string) {
  return await runCommand(
    `git commit -m "${message}"`,
    "../sandbox/sample-project",
  );
}
