import { runCommand } from "../tools/terminal.js";

export async function validationWorkflow() {
  console.log("Starting validation workflow...");

  const result = await runCommand(
    "npx eslint .",
    "../sandbox/sample-project"
  );

  console.log("Validation Result:");
  console.log(result.success);

  return result.success;
}