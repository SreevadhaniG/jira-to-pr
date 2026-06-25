import { getLLMProvider } from "../providers/index.js";
import type { PullRequestDraft } from "../types/pr.js";
import { cleanLLMResponse } from "../utils/llm.js";

export class LLMService {
  async generateText(prompt: string): Promise<string> {
    const provider = getLLMProvider();

    return provider.generate(prompt);
  }

  async generateCommitMessage(prompt: string): Promise<string> {
    return this.generateText(prompt);
  }

  async generatePRDraft(prompt: string): Promise<PullRequestDraft> {
    const response = await this.generateText(prompt);

    console.log("Raw PR Response:");

    console.log(response);

    const cleaned = cleanLLMResponse(response);

    const pr = JSON.parse(cleaned) as PullRequestDraft;

    return pr;
  }
}

export const llmService = new LLMService();
