import {
  getCurrentBranch
} from "../tools/git.js";

export async function branchWorkflow() {
  const currentBranch =
    await getCurrentBranch();

  console.log(
    "Current Branch:",
    currentBranch
  );
}