import { readFileContent } from "../tools/file.js";
import { buildLintFixPrompt } from "../prompts/lintFixPrompt.js";
import type { LintIssue } from "../parsers/eslintParser.js";
import { MockLLMProvider } from "../providers/llm.js";
import { writeFileContent } from "../tools/file.js";

export async function autoFixWorkflow(issue: LintIssue) {
  console.log("Starting auto-fix workflow...");

  const content = await readFileContent(issue.file);

  const prompt = buildLintFixPrompt(issue, content);

  const provider = new MockLLMProvider();

  const fixedCode = await provider.generate(prompt);

  await writeFileContent(issue.file, fixedCode);

  console.log("Updated file with generated fix.");
}
