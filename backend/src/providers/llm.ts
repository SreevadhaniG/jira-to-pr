export interface LLMProvider {
  generate(prompt: string): Promise<string>;
}

export class MockLLMProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    console.log("Sending prompt to Mock LLM...");

    return `
const unusedVariable = "hello";

console.log(unusedVariable);
console.log("Testing ESLint");
`;
  }
}
