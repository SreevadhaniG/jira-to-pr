import { MockLLMProvider } from "../providers/llm.js";
import { buildPRPrompt } from "../prompts/prPrompt.js";
import type { LintIssue } from "../parsers/eslintParser.js";

export async function prWorkflow(issue: LintIssue) {
  console.log("Starting PR workflow...");

  const prompt = buildPRPrompt(issue);

  const provider = new MockLLMProvider();

  const pr = await provider.generatePR(prompt);

  console.log("PR Title:");
  console.log(pr.title);

  console.log("PR Description:");
  console.log(pr.description);

  return pr;
}
