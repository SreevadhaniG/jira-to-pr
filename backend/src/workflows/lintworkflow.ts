import { runCommand } from "../tools/terminal.js";

export async function lintWorkflow() {
  console.log("Running lint workflow...");

  const result = await runCommand("npx eslint .", "../sandbox/sample-project");
  console.log("Lint workflow result:");
  console.log(result.success);
  console.log(result.stdout);
  console.log(result.stderr);
}
