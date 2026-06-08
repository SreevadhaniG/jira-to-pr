import { runCommand } from "../tools/terminal.js";
import { parseEslintOutput } from "../parsers/eslintParser.js";
import { analyzeLintIssues } from "../analyzers/lintAnalyzer.js";
import { makeLintDecision } from "../decisions/lintDecision.js";

export async function lintWorkflow() {
  console.log("Running lint workflow...");

  //workflow: orchestrator -> tool -> parser -> analyser -> decision
  //runCommand -> parseEslintOutput -> analyzeLintIssues -> makeLintDecision
  //tool
  const result = await runCommand("npx eslint .", "../sandbox/sample-project");

  console.log("Lint workflow result:");
  console.log(result.success);

  //parser
  const issues = parseEslintOutput(result.stdout + result.stderr);

  console.log("Parsed Issues:");
  console.log(issues);

  //analyser
  const analysis = analyzeLintIssues(issues);

  console.log("Analysis:");
  console.log(analysis);

  //decision
  const decision = makeLintDecision(analysis);

  console.log("Decision:");
  console.log(decision);
}
