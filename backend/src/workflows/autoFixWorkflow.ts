import { readFileContent, writeFileContent } from "../tools/file.js";
import { buildLintFixPrompt } from "../prompts/lintFixPrompt.js";
import { buildRetryPrompt } from "../prompts/retryPrompt.js";
import type { LintIssue } from "../parsers/eslintParser.js";
import { MockLLMProvider } from "../providers/llm.js";
import { validationWorkflow } from "./validationWorkflow.js";
import { agentConfig } from "../config/agent.js";

export async function autoFixWorkflow(
  issue: LintIssue
): Promise<boolean> {
  console.log("Starting auto-fix workflow...");

  const content = await readFileContent(issue.file);

  let prompt = buildLintFixPrompt(
    issue,
    content
  );

  const provider = getLLMProvider();

  for (
    let attempt = 1;
    attempt <= agentConfig.maxRetries;
    attempt++
  ) {
    console.log(`\nAttempt ${attempt}`);

    const fixedCode =
      await provider.generate(prompt);

    await writeFileContent(
      issue.file,
      fixedCode
    );

    console.log(
      "Updated file with generated fix."
    );

    const validationResult =
      await validationWorkflow();

    if (validationResult.success) {
      console.log(
        "Auto-fix validated successfully."
      );
      return true;
    }

    console.log("Validation failed.");

    if (
      attempt < agentConfig.maxRetries
    ) {
      console.log(
        "Building retry prompt..."
      );

      prompt = buildRetryPrompt(
        prompt,
        validationResult.output
      );
    }
  }

  console.log(
    "Maximum retry attempts reached."
  );

  return false;
}