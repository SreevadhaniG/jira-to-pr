import { MockLLMProvider } from "./llm.js";

export function getLLMProvider() {
  return new MockLLMProvider();
}