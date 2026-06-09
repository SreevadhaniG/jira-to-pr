import { runCommand } from "../tools/terminal.js";
import { parseEslintOutput } from "../parsers/eslintParser.js";
import { analyzeLintIssues } from "../analyzers/lintAnalyzer.js";
import { makeLintDecision } from "../decisions/lintDecision.js";
import type { LintWorkflowContext } from "../types/workflow.js";

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

  const context: LintWorkflowContext = {
    issues,
    analysis,
    decision,
  };

  //action is taken by the autoFixWorkflow based on the decision made here. Call is invoked from the orchestrator.
  //context is being returned to the orchestrator.

  return context;
}
