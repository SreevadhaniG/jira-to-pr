import { readFileContent } from "../tools/file.js";
import { buildLintFixPrompt } from "../prompts/lintFixPrompt.js";
import type { LintIssue } from "../parsers/eslintParser.js";

export async function autoFixWorkflow(
  issue: LintIssue
) {
  console.log("Starting auto-fix workflow...");

  const content = await readFileContent(issue.file);

  console.log("File Content:");
  console.log(content);

  const prompt = buildLintFixPrompt(
    issue,
    content
  );

  console.log("Generated Prompt:");
  console.log(prompt);
}