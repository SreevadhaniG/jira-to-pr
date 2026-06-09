export interface LLMProvider {
  generate(prompt: string): Promise<string>;
}

let callCount = 0;

export class MockLLMProvider
  implements LLMProvider
{
  async generate(
    prompt: string
  ): Promise<string> {
    callCount++;

    console.log(
      `Sending prompt to Mock LLM (Attempt ${callCount})...`
    );

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
}
