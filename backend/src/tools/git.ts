import { runCommand } from "./terminal.js";

export async function getCurrentBranch() {
  const result = await runCommand(
    "git branch --show-current"
  );

  return result.stdout.trim();
}

export async function createBranch(
  branchName: string
) {
  const result = await runCommand(
    `git checkout -b ${branchName}`
  );

  return result;
}