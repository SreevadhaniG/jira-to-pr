import { readFileContent, writeFileContent } from "../tools/file.js";
import { buildLintFixPrompt } from "../prompts/lintFixPrompt.js";
import { buildRetryPrompt } from "../prompts/retryPrompt.js";
import type { LintIssue } from "../parsers/eslintParser.js";
import { getLLMProvider } from "../providers/index.js";
import { validationWorkflow } from "./validationWorkflow.js";
import { agentConfig } from "../config/agent.js";
import type { RepositoryContext } from "../types/repository.js";
import {cleanLLMResponse} from "../utils/llm.js";

export async function autoFixWorkflow(
  issue: LintIssue,
  repository: RepositoryContext,
): Promise<boolean> {
  console.log("Starting auto-fix workflow...");

  const content = await readFileContent(issue.file);

  let prompt = buildLintFixPrompt(issue, content);

  const provider = getLLMProvider();

  for (let attempt = 1; attempt <= agentConfig.maxRetries; attempt++) {
    console.log(`\nAttempt ${attempt}`);

    const response = await provider.generate(prompt);

    const fixedCode = cleanLLMResponse(response);

    console.log("Generated Fix:");
    console.log(fixedCode);

    await writeFileContent(issue.file, fixedCode);

    console.log("Updated file with generated fix.");

    const validationResult = await validationWorkflow(repository);

    if (validationResult.success) {
      console.log("Auto-fix validated successfully.");
      return true;
    }

    console.log("Validation failed.");

    if (attempt < agentConfig.maxRetries) {
      console.log("Building retry prompt...");

      prompt = buildRetryPrompt(prompt, validationResult.output);
    }
  }

  console.log("Maximum retry attempts reached.");

  return false;
}
