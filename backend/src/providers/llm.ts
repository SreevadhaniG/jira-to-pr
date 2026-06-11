import type { PullRequestDraft } from "../types/pr.js";
export interface LLMProvider {
  generate(prompt: string): Promise<string>;
  generateCommitMessage(prompt: string): Promise<string>;
  generatePR(prompt: string): Promise<PullRequestDraft>;
}

let callCount = 0;

export class MockLLMProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    callCount++;

    console.log(`Sending prompt to Mock LLM (Attempt ${callCount})...`);

    if (callCount === 1) {
      return `
const unusedVariable = "hello";

//console.log(unusedVariable);
console.log("Testing ESLint");
`;
    }

    return `
const unusedVariable = "hello";

console.log(unusedVariable);
console.log("Testing ESLint");
`;
  }

  async generateCommitMessage(prompt: string): Promise<string> {
    console.log("Generating commit message...");

    return "fix: remove unused variable warning";
  }

  async generatePR(prompt: string): Promise<{
    title: string;
    description: string;
  }> {
    return {
      title: "Fix unused variable warning",

      description:
        "Removes the unused variable warning and updates the code to satisfy ESLint validation.",
    };
  }
}

export function extractCodeFromResponse(
  response: string,
): string {
  return response
    .replace(/^```(?:typescript|ts|javascript|js)?\n?/i, "")
    .replace(/\n?```$/, "")
    .trim();
}