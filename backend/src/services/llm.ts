import { getLLMProvider } from "../providers/index.js";
import type { PullRequestDraft } from "../types/pr.js";
import { cleanLLMResponse } from "../utils/llm.js";

export class LLMService {
  async generateText(prompt: string): Promise<string> {
    const provider = getLLMProvider();
    return provider.generate(prompt);
  }

  async generateJSON<T>(prompt: string): Promise<T> {
    const response = await this.generateText(prompt);

    const cleaned = cleanLLMResponse(response);

    return JSON.parse(cleaned) as T;
  }

  async generateCommitMessage(prompt: string): Promise<string> {
    return this.generateText(prompt);
  }

  async generatePRDraft(prompt: string): Promise<PullRequestDraft> {
    return this.generateJSON<PullRequestDraft>(prompt);
  }
}

export const llmService = new LLMService();
