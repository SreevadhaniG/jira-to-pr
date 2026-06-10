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
  return await runCommand(
    `git checkout -b ${branchName}`,
    "../sandbox/sample-project"
  );
}