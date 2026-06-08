import { runCommand } from "../tools/terminal.js";
import { parseEslintOutput } from "../parsers/eslintParser.js";

export async function lintWorkflow() {
  console.log("Running lint workflow...");

  const result = await runCommand("npx eslint .", "../sandbox/sample-project");

  console.log("Lint workflow result:");
  console.log(result.success);

  const issues = parseEslintOutput(result.stdout + result.stderr);

  console.log("Parsed Issues:");
  console.log(issues);
}
